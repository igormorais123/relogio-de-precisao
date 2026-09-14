/** Derive a smaller GLB without changing assembly nodes, names, transforms or materials. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { MeshoptSimplifier } from 'three/addons/libs/meshopt_simplifier.module.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2), mobile = args.includes('--mobile');
const source = args.find(arg => !arg.startsWith('--')) || path.resolve(root, '../../INTEIA-laboratorio-3d/web/assets/carro-movable.glb');
const basename = mobile ? 'carro-aula-mobile' : 'carro-aula';
const targetRatio = mobile ? .10 : .25, targetError = mobile ? .004 : .0015;
const destination = path.resolve(root, `public/assets/${basename}.glb`);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const input = fs.readFileSync(source);
if (input.readUInt32LE(0) !== 0x46546c67 || input.readUInt32LE(4) !== 2) throw Error('Expected glTF 2 GLB');
const jsonLength = input.readUInt32LE(12);
const original = JSON.parse(input.subarray(20, 20 + jsonLength));
const binary = input.subarray(28 + jsonLength);
if (original.animations || original.skins || original.meshes.some(m => m.primitives.some(p => p.targets))) throw Error('This derivative only handles the static assembly base');
const output = structuredClone(original);
output.accessors = [];
output.bufferViews = [];
const chunks = [];
let offset = 0;
const types = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 };
const arrays = { 5121: Uint8Array, 5123: Uint16Array, 5125: Uint32Array, 5126: Float32Array };

function readAccessor(index) {
  const a = original.accessors[index], v = original.bufferViews[a.bufferView];
  if (a.sparse || v.extensions || v.buffer !== 0) throw Error('Unsupported accessor encoding');
  const Type = arrays[a.componentType], width = types[a.type];
  if (!Type || !width) throw Error('Unsupported component type');
  const step = width * Type.BYTES_PER_ELEMENT;
  const start = (v.byteOffset || 0) + (a.byteOffset || 0);
  const data = new Type(a.count * width);
  const bytes = Buffer.from(data.buffer);
  for (let i = 0; i < a.count; i++) binary.copy(bytes, i * step, start + i * (v.byteStride || step), start + i * (v.byteStride || step) + step);
  return { a, data, width };
}

function addView(bytes, target) {
  const padding = (4 - offset % 4) % 4;
  if (padding) { chunks.push(Buffer.alloc(padding)); offset += padding; }
  const view = { buffer: 0, byteOffset: offset, byteLength: bytes.length };
  if (target) view.target = target;
  chunks.push(bytes);
  offset += bytes.length;
  output.bufferViews.push(view);
  return output.bufferViews.length - 1;
}

function addAccessor(data, template, target) {
  const a = structuredClone(template);
  a.bufferView = addView(Buffer.from(data.buffer, data.byteOffset, data.byteLength), target);
  delete a.byteOffset;
  a.count = data.length / types[a.type];
  a.componentType = data instanceof Uint16Array ? 5123 : data instanceof Uint32Array ? 5125 : data instanceof Float32Array ? 5126 : template.componentType;
  if (a.min || a.max) {
    const width = types[a.type];
    a.min = Array(width).fill(Infinity);
    a.max = Array(width).fill(-Infinity);
    for (let i = 0; i < data.length; i++) { a.min[i % width] = Math.min(a.min[i % width], data[i]); a.max[i % width] = Math.max(a.max[i % width], data[i]); }
  }
  output.accessors.push(a);
  return output.accessors.length - 1;
}

await MeshoptSimplifier.ready;
const primitives = [];
for (let mi = 0; mi < original.meshes.length; mi++) {
  const mesh = original.meshes[mi];
  for (let pi = 0; pi < mesh.primitives.length; pi++) {
    const primitive = mesh.primitives[pi];
    if ((primitive.mode ?? 4) !== 4 || primitive.indices === undefined) throw Error('Expected indexed triangles');
    const attrs = Object.fromEntries(Object.entries(primitive.attributes).map(([key, index]) => [key, readAccessor(index)]));
    const indices = new Uint32Array(readAccessor(primitive.indices).data);
    const positions = attrs.POSITION.data;
    const count = positions.length / 3;
    const locked = new Uint8Array(count);
    // Keep each primitive's exact geometric extrema: assembly bounding-box pivots remain identical.
    for (let axis = 0; axis < 3; axis++) {
      let low = 0, high = 0;
      for (let v = 1; v < count; v++) { if (positions[v * 3 + axis] < positions[low * 3 + axis]) low = v; if (positions[v * 3 + axis] > positions[high * 3 + axis]) high = v; }
      locked[low] = locked[high] = 1;
    }
    const normals = attrs.NORMAL?.data, uv = attrs.TEXCOORD_0?.data;
    const stride = (normals ? 3 : 0) + (uv ? 2 : 0);
    const attributeData = new Float32Array(count * stride);
    for (let v = 0; v < count; v++) {
      let a = v * stride;
      if (normals) for (let k = 0; k < 3; k++) attributeData[a++] = normals[v * 3 + k];
      if (uv) for (let k = 0; k < 2; k++) attributeData[a++] = uv[v * 2 + k];
    }
    const weights = [...(normals ? [1, 1, 1] : []), ...(uv ? [.1, .1] : [])];
    const target = Math.max(360, Math.floor(indices.length * targetRatio / 3) * 3);
    const [simplified, error] = indices.length >= 1500
      ? MeshoptSimplifier.simplifyWithAttributes(indices, positions, 3, attributeData, stride, weights, locked, target, targetError, ['LockBorder'])
      : [indices, 0];
    if (!simplified.length || simplified.length % 3) throw Error('Invalid simplification');
    // Compact only retained vertices. Every position/normal/UV value remains byte-identical to the source.
    const remap = new Map(), retained = [];
    for (const index of simplified) if (!remap.has(index)) { remap.set(index, retained.length); retained.push(index); }
    const IndexType = retained.length <= 65535 ? Uint16Array : Uint32Array;
    const compactIndices = new IndexType(simplified.length);
    for (let i = 0; i < simplified.length; i++) compactIndices[i] = remap.get(simplified[i]);
    const result = output.meshes[mi].primitives[pi];
    result.attributes = {};
    for (const [name, attr] of Object.entries(attrs)) {
      const data = new attr.data.constructor(retained.length * attr.width);
      for (let v = 0; v < retained.length; v++) data.set(attr.data.subarray(retained[v] * attr.width, (retained[v] + 1) * attr.width), v * attr.width);
      result.attributes[name] = addAccessor(data, attr.a, 34962);
    }
    result.indices = addAccessor(compactIndices, { type: 'SCALAR', componentType: 5125 }, 34963);
    primitives.push({ mesh: mesh.name, primitive: pi, trianglesBefore: indices.length / 3, trianglesAfter: simplified.length / 3, verticesBefore: count, verticesAfter: retained.length, simplifierError: error });
  }
}
// Preserve the source images and texture/material definitions exactly, including embedded PNG bytes.
for (const image of output.images || []) {
  const view = original.bufferViews[image.bufferView];
  image.bufferView = addView(binary.subarray(view.byteOffset || 0, (view.byteOffset || 0) + view.byteLength));
}
output.buffers = [{ byteLength: offset }];
const totals = primitives.reduce((r, p) => ({ trianglesBefore: r.trianglesBefore + p.trianglesBefore, trianglesAfter: r.trianglesAfter + p.trianglesAfter }), { trianglesBefore: 0, trianglesAfter: 0 });
const sourceNodeContract = JSON.stringify(original.nodes);
if (JSON.stringify(output.nodes) !== sourceNodeContract) throw Error('Assembly node contract changed');
const payload = Buffer.concat(chunks);
const json = Buffer.from(JSON.stringify(output));
const paddedJson = Buffer.alloc(Math.ceil(json.length / 4) * 4, 32);
json.copy(paddedJson);
const paddedBin = Buffer.alloc(Math.ceil(payload.length / 4) * 4);
payload.copy(paddedBin);
const header = Buffer.alloc(20);
header.writeUInt32LE(0x46546c67, 0); header.writeUInt32LE(2, 4); header.writeUInt32LE(28 + paddedJson.length + paddedBin.length, 8);
header.writeUInt32LE(paddedJson.length, 12); header.writeUInt32LE(0x4e4f534a, 16);
const binHeader = Buffer.alloc(8);
binHeader.writeUInt32LE(paddedBin.length, 0); binHeader.writeUInt32LE(0x004e4942, 4);
const result = Buffer.concat([header, paddedJson, binHeader, paddedBin]);
fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.writeFileSync(destination, result);
const report = {
  createdAt: new Date().toISOString(), source, destination,
  sourceSha256: sha(input), outputSha256: sha(result), bytesBefore: input.length, bytesAfter: result.length,
  ...totals, meshes: output.meshes.length, nodes: output.nodes.length, assemblyParts: output.nodes.filter(n => n.extras?.assemblyComponent).length,
  unchangedNodeContract: true, unchangedMaterials: JSON.stringify(output.materials) === JSON.stringify(original.materials),
  method: `MeshoptSimplifier.simplifyWithAttributes; target ratio ${targetRatio}; maximum relative simplifier error ${targetError}; LockBorder; fixed extrema; normal weights 1; UV weights .1; primitives below 500 triangles unchanged; no compression decoder`,
  limitation: 'Simplifier error is an algorithm metric, not a certified physical distance or proof of visual equivalence. Original extras.triangles describes source topology and is intentionally preserved. See per-primitive trianglesAfter for derivative topology.',
  primitives
};
fs.writeFileSync(path.resolve(root, `public/assets/${basename}.proveniencia.json`), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ destination, ...totals, bytesBefore: input.length, bytesAfter: result.length, parts: report.assemblyParts, unchangedNodeContract: true }, null, 2));
