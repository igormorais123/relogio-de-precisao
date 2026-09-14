/**
 * Carro v2 da aula: texturas WebP + geometria EXT_meshopt_compression.
 *
 * Contrato: o JSON de nodes (nomes, extras, hierarquia, transforms), materials, meshes, scenes e samplers
 * sai literalmente igual ao da fonte. Só accessors, bufferViews, buffers, images, textures (fonte WebP)
 * e as listas de extensões mudam. As posições continuam float32 com o filtro EXPONENTIAL do meshopt,
 * porque a quantização inteira de posição exige mover a dequantização para os transforms dos nós.
 *
 * Uso: node tools/optimize-car-v2.mjs [--mobile] [--texture 2048] [--quality 88]
 *        [--position-bits 16] [--normal-bits 10] [--uv-bits 12] [--source f.glb] [--output f.glb]
 * Dependências de ferramenta (meshoptimizer, sharp) ficam fora do repositório, em F1_ASSET_TOOL_ROOT
 * (padrão: %TEMP%/claude/f1-assets, criado com `npm i meshoptimizer@1.2.0 sharp@0.35.4`).
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name, fallback) => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : fallback; };
const mobile = args.includes('--mobile');
const basename = mobile ? 'carro-aula-mobile' : 'carro-aula';
const source = path.resolve(root, flag('source', `public/assets/${basename}.glb`));
const destination = path.resolve(root, flag('output', `public/assets/${basename}-v2.glb`));
const textureLimit = Number(flag('texture', mobile ? 1024 : 2048));
const webpQuality = Number(flag('quality', 88));
const positionBits = Number(flag('position-bits', 16));
const normalBits = Number(flag('normal-bits', 10));
const uvBits = Number(flag('uv-bits', 12));
const budget = mobile ? 2_000_000 : 3_000_000;
const toolRoot = process.env.F1_ASSET_TOOL_ROOT || path.join(os.tmpdir(), 'claude', 'f1-assets');
const require = createRequire(path.join(toolRoot, 'package.json'));
const { MeshoptEncoder, MeshoptDecoder } = await import(pathToFileURL(require.resolve('meshoptimizer')).href);
const sharp = require('sharp');
await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready]);

const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const relative = file => path.relative(root, file).replaceAll('\\', '/');
const input = fs.readFileSync(source);
if (input.readUInt32LE(0) !== 0x46546c67 || input.readUInt32LE(4) !== 2) throw Error('GLB 2 esperado');
const jsonLength = input.readUInt32LE(12);
const json = JSON.parse(input.subarray(20, 20 + jsonLength));
const binary = input.subarray(28 + jsonLength, 28 + jsonLength + input.readUInt32LE(20 + jsonLength));
if (json.extensionsRequired?.length || json.buffers.length !== 1 || json.animations || json.skins) throw Error('Fonte deve ser GLB estático sem compressão');

const out = structuredClone(json);
out.bufferViews = [];
const chunks = [];
let offset = 0, fallbackLength = 0;
const pad4 = n => Math.ceil(n / 4) * 4;
function put(bytes) {
  const padding = pad4(offset) - offset;
  if (padding) { chunks.push(Buffer.alloc(padding)); offset += padding; }
  const start = offset;
  chunks.push(Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength));
  offset += bytes.byteLength;
  return start;
}
const WIDTH = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 };
const ARRAY = { 5123: Uint16Array, 5125: Uint32Array, 5126: Float32Array };
function read(index) {
  const a = json.accessors[index], v = json.bufferViews[a.bufferView], Type = ARRAY[a.componentType];
  if (!Type || a.sparse || a.normalized || v.byteStride) throw Error('Accessor fora do formato esperado');
  const start = binary.byteOffset + (v.byteOffset || 0) + (a.byteOffset || 0);
  return new Type(binary.buffer.slice(start, start + a.count * WIDTH[a.type] * Type.BYTES_PER_ELEMENT));
}
// Encodes one stream and decodes it back with the reference decoder before accepting it.
function compressed(data, count, stride, mode, filter, target) {
  const encoded = MeshoptEncoder.encodeGltfBuffer(data, count, stride, mode, 0);
  const decoded = new Uint8Array(count * stride);
  MeshoptDecoder.decodeGltfBuffer(decoded, count, stride, encoded, mode, filter === 'NONE' ? undefined : filter);
  const extension = { buffer: 0, byteOffset: put(encoded), byteLength: encoded.length, byteStride: stride, count, mode };
  if (filter !== 'NONE') extension.filter = filter;
  const view = { buffer: 1, byteOffset: fallbackLength, byteLength: count * stride, target, extensions: { EXT_meshopt_compression: extension } };
  if (mode === 'ATTRIBUTES') view.byteStride = stride;
  fallbackLength = pad4(fallbackLength + count * stride);
  out.bufferViews.push(view);
  return { view: out.bufferViews.length - 1, decoded, bytes: encoded.length };
}

const stats = { primitives: 0, triangles: 0, verticesBefore: 0, verticesAfter: 0, geometryBytes: 0, positionMaxError: 0, normalMaxAngleDegrees: 0, uvMaxError: 0, uvStreamsNormalizedUint16: 0, uvStreamsExponentialFloat: 0 };
for (const mesh of json.meshes) for (const primitive of mesh.primitives) {
  if ((primitive.mode ?? 4) !== 4 || primitive.targets || primitive.indices === undefined) throw Error('Triângulos indexados esperados');
  const semantics = Object.keys(primitive.attributes);
  if (semantics.some(s => !/^(POSITION|NORMAL|TEXCOORD_\d+)$/.test(s))) throw Error('Atributo inesperado: ' + semantics);
  const indices = new Uint32Array(read(primitive.indices));
  const sourceIndices = indices.slice();
  const sourceCount = json.accessors[primitive.attributes.POSITION].count;
  // Vertex cache/fetch order only; no vertex or triangle is removed or merged.
  const [remap, count] = MeshoptEncoder.reorderMesh(indices, true, true);
  const compact = (data, width) => {
    const result = new Float32Array(count * width);
    for (let i = 0; i < remap.length; i++) if (remap[i] !== 0xffffffff) for (let k = 0; k < width; k++) result[remap[i] * width + k] = data[i * width + k];
    return result;
  };
  stats.primitives++; stats.triangles += indices.length / 3; stats.verticesBefore += sourceCount; stats.verticesAfter += count;

  const positions = compact(read(primitive.attributes.POSITION), 3);
  const p = compressed(MeshoptEncoder.encodeFilterExp(positions, count, 12, positionBits, 'SharedComponent'), count, 12, 'ATTRIBUTES', 'EXPONENTIAL', 34962);
  const decodedPositions = new Float32Array(p.decoded.buffer);
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < decodedPositions.length; i++) {
    const k = i % 3, value = decodedPositions[i];
    if (!Number.isFinite(value)) throw Error('Posição não finita');
    min[k] = Math.min(min[k], value); max[k] = Math.max(max[k], value);
    stats.positionMaxError = Math.max(stats.positionMaxError, Math.abs(value - positions[i]));
  }
  out.accessors[primitive.attributes.POSITION] = { bufferView: p.view, componentType: 5126, count, type: 'VEC3', min, max };
  stats.geometryBytes += p.bytes;

  if (primitive.attributes.NORMAL !== undefined) {
    const normals = compact(read(primitive.attributes.NORMAL), 3), padded = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) for (let k = 0; k < 3; k++) padded[i * 4 + k] = normals[i * 3 + k];
    const stride = normalBits > 8 ? 8 : 4, n = compressed(MeshoptEncoder.encodeFilterOct(padded, count, stride, normalBits), count, stride, 'ATTRIBUTES', 'OCTAHEDRAL', 34962);
    const decoded = stride === 8 ? new Int16Array(n.decoded.buffer) : new Int8Array(n.decoded.buffer), scale = stride === 8 ? 32767 : 127;
    for (let i = 0; i < count; i++) {
      const a = [0, 1, 2].map(k => Math.max(decoded[i * 4 + k] / scale, -1)), b = [0, 1, 2].map(k => normals[i * 3 + k]);
      const la = Math.hypot(...a), lb = Math.hypot(...b);
      if (lb > 1e-6) stats.normalMaxAngleDegrees = Math.max(stats.normalMaxAngleDegrees, Math.acos(Math.min(1, Math.abs((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / (la * lb)))) * 180 / Math.PI);
    }
    out.accessors[primitive.attributes.NORMAL] = { bufferView: n.view, componentType: stride === 8 ? 5122 : 5120, normalized: true, count, type: 'VEC3' };
    stats.geometryBytes += n.bytes;
  }

  for (const semantic of semantics.filter(s => s.startsWith('TEXCOORD_'))) {
    const uv = compact(read(primitive.attributes[semantic]), 2);
    if (uv.every(v => v >= 0 && v <= 1)) {
      const levels = 2 ** uvBits - 1, quantized = new Uint16Array(count * 2);
      for (let i = 0; i < uv.length; i++) quantized[i] = Math.round(Math.round(uv[i] * levels) / levels * 65535);
      const t = compressed(new Uint8Array(quantized.buffer), count, 4, 'ATTRIBUTES', 'NONE', 34962);
      assert(Buffer.from(t.decoded).equals(Buffer.from(quantized.buffer)), 'UV roundtrip');
      for (let i = 0; i < uv.length; i++) stats.uvMaxError = Math.max(stats.uvMaxError, Math.abs(quantized[i] / 65535 - uv[i]));
      out.accessors[primitive.attributes[semantic]] = { bufferView: t.view, componentType: 5123, normalized: true, count, type: 'VEC2' };
      stats.uvStreamsNormalizedUint16++; stats.geometryBytes += t.bytes;
    } else {
      // UVs outside [0,1] cannot be normalized integers without KHR_texture_transform; keep them float.
      const t = compressed(MeshoptEncoder.encodeFilterExp(uv, count, 8, uvBits + 4, 'SharedComponent'), count, 8, 'ATTRIBUTES', 'EXPONENTIAL', 34962);
      const decoded = new Float32Array(t.decoded.buffer);
      for (let i = 0; i < uv.length; i++) stats.uvMaxError = Math.max(stats.uvMaxError, Math.abs(decoded[i] - uv[i]));
      out.accessors[primitive.attributes[semantic]] = { bufferView: t.view, componentType: 5126, count, type: 'VEC2' };
      stats.uvStreamsExponentialFloat++; stats.geometryBytes += t.bytes;
    }
  }

  const Index = count <= 65535 ? Uint16Array : Uint32Array, typed = new Index(indices);
  const x = compressed(new Uint8Array(typed.buffer), typed.length, Index.BYTES_PER_ELEMENT, 'TRIANGLES', 'NONE', 34963);
  // Reordering changes triangle order and the codec may rotate a triangle's vertices. The multiset of
  // triangles, in source vertex ids and with the same winding, must be identical.
  const decodedIndices = new Index(x.decoded.buffer), inverse = new Uint32Array(count);
  for (let i = 0; i < remap.length; i++) if (remap[i] !== 0xffffffff) inverse[remap[i]] = i;
  const canonical = (get, length) => {
    const keys = [];
    for (let t = 0; t < length; t += 3) {
      const v = [get(t), get(t + 1), get(t + 2)], r = v.indexOf(Math.min(...v));
      keys.push(`${v[r]},${v[(r + 1) % 3]},${v[(r + 2) % 3]}`);
    }
    return keys.sort().join(';');
  };
  if (canonical(t => sourceIndices[t], sourceIndices.length) !== canonical(t => inverse[decodedIndices[t]], decodedIndices.length)) throw Error('Triângulos alterados no reorder/codec de índices');
  out.accessors[primitive.indices] = { bufferView: x.view, componentType: Index === Uint16Array ? 5123 : 5125, count: typed.length, type: 'SCALAR' };
  stats.geometryBytes += x.bytes;
}

const usedTextures = new Set();
JSON.stringify(json.materials, (key, value) => { if (/Texture$/.test(key) && Number.isInteger(value?.index)) usedTextures.add(value.index); return value; });
const usedImages = new Set([...usedTextures].map(i => json.textures[i].source));
const textures = [];
for (let i = 0; i < json.images.length; i++) {
  const image = json.images[i], view = json.bufferViews[image.bufferView];
  const bytes = binary.subarray(view.byteOffset || 0, (view.byteOffset || 0) + view.byteLength);
  const before = await sharp(bytes).metadata();
  const { data, info } = await sharp(bytes).resize({ width: textureLimit, height: textureLimit, fit: 'inside', withoutEnlargement: true }).webp({ quality: webpQuality, effort: 6 }).toBuffer({ resolveWithObject: true });
  out.bufferViews.push({ buffer: 0, byteOffset: put(data), byteLength: data.length });
  out.images[i] = { ...image, mimeType: 'image/webp', bufferView: out.bufferViews.length - 1 };
  textures.push({ name: image.name, referencedByMaterial: usedImages.has(i), before: { mimeType: image.mimeType, bytes: bytes.length, width: before.width, height: before.height }, after: { mimeType: 'image/webp', bytes: data.length, width: info.width, height: info.height } });
}
out.textures = json.textures.map(({ source: image, ...texture }) => ({ ...texture, extensions: { ...texture.extensions, EXT_texture_webp: { source: image } } }));
const payload = Buffer.concat([...chunks, Buffer.alloc(pad4(offset) - offset)]);
out.buffers = [{ byteLength: payload.length }, { byteLength: fallbackLength, extensions: { EXT_meshopt_compression: { fallback: true } } }];
const added = ['EXT_meshopt_compression', 'EXT_texture_webp', 'KHR_mesh_quantization'];
out.extensionsUsed = [...new Set([...(json.extensionsUsed || []), ...added])];
out.extensionsRequired = added;

const preserved = {};
for (const key of ['asset', 'scene', 'scenes', 'nodes', 'materials', 'meshes', 'samplers']) {
  preserved[key] = JSON.stringify(out[key]) === JSON.stringify(json[key]);
  assert(preserved[key], `Contrato violado em ${key}`);
}
const text = Buffer.from(JSON.stringify(out));
const jsonChunk = Buffer.alloc(pad4(text.length), 32);
text.copy(jsonChunk);
const header = Buffer.alloc(20), binHeader = Buffer.alloc(8);
header.writeUInt32LE(0x46546c67, 0); header.writeUInt32LE(2, 4); header.writeUInt32LE(28 + jsonChunk.length + payload.length, 8);
header.writeUInt32LE(jsonChunk.length, 12); header.writeUInt32LE(0x4e4f534a, 16);
binHeader.writeUInt32LE(payload.length, 0); binHeader.writeUInt32LE(0x004e4942, 4);
const result = Buffer.concat([header, jsonChunk, binHeader, payload]);
if (result.length > budget) throw Error(`Orçamento excedido: ${result.length} > ${budget}`);
fs.writeFileSync(destination, result);

const upstreamFile = source.replace(/\.glb$/, '.proveniencia.json');
const upstream = fs.existsSync(upstreamFile) ? JSON.parse(fs.readFileSync(upstreamFile, 'utf8')) : null;
const report = {
  createdAt: new Date().toISOString(),
  origin: upstream && { laboratorySource: 'INTEIA-laboratorio-3d/web/assets/carro-movable.glb', laboratorySha256: upstream.sourceSha256, laboratoryBytes: upstream.bytesBefore, laboratoryTriangles: upstream.trianglesBefore, derivedBy: 'tools/optimize-car.mjs' + (mobile ? ' --mobile' : ''), derivedSha256: upstream.outputSha256 },
  source: relative(source), output: relative(destination),
  commands: [
    'npm i --prefix "%TEMP%/claude/f1-assets" meshoptimizer@1.2.0 sharp@0.35.4',
    'node tools/optimize-car-v2.mjs ' + args.join(' '),
    'node tools/verify-car.mjs ' + relative(destination),
    'npx --yes @gltf-transform/cli@4.5.0 validate ' + relative(destination)
  ],
  sourceSha256: sha(input), outputSha256: sha(result), bytesBefore: input.length, bytesAfter: result.length, budgetBytes: budget,
  bytesByContent: { geometryCompressed: stats.geometryBytes, texturesWebp: textures.reduce((s, t) => s + t.after.bytes, 0), jsonChunk: jsonChunk.length },
  triangles: stats.triangles, trianglesChangedVsSource: false, verticesBefore: stats.verticesBefore, verticesAfter: stats.verticesAfter, primitives: stats.primitives,
  meshes: out.meshes.length, nodes: out.nodes.length, assemblyParts: out.nodes.filter(n => n.extras?.assemblyComponent).length,
  jsonIdenticalToSource: preserved,
  rewrittenTopLevel: ['accessors', 'bufferViews', 'buffers', 'images', 'textures', 'extensionsUsed', 'extensionsRequired'],
  geometry: {
    method: 'meshopt reorderMesh (vertex cache strip + fetch remap, sem remover vértices ou triângulos); EXT_meshopt_compression codec v0 nível 2',
    position: `float32, filtro EXPONENTIAL SharedComponent, mantissa ${positionBits} bits`,
    normal: `filtro OCTAHEDRAL ${normalBits} bits (KHR_mesh_quantization)`,
    texcoord: `[0,1]: uint16 normalizado na grade de ${uvBits} bits; fora de [0,1]: float32 EXPONENTIAL ${uvBits + 4} bits`,
    positionMaxErrorLocalUnits: stats.positionMaxError, normalMaxAngleDegrees: stats.normalMaxAngleDegrees, uvMaxError: stats.uvMaxError,
    uvStreamsNormalizedUint16: stats.uvStreamsNormalizedUint16, uvStreamsExponentialFloat: stats.uvStreamsExponentialFloat,
    roundtrip: 'Cada stream foi decodificado com MeshoptDecoder; índices conferidos triângulo a triângulo (só rotação cíclica permitida)'
  },
  textures: { limitPixels: textureLimit, webpQuality, kernel: 'sharp lanczos3, fit inside, sem ampliar', images: textures },
  toolchain: { node: process.version, meshoptimizer: JSON.parse(fs.readFileSync(path.join(path.dirname(require.resolve('meshoptimizer')), 'package.json'))).version, sharp: JSON.parse(fs.readFileSync(path.join(toolRoot, 'node_modules/sharp/package.json'))).version, runtimeDecoder: 'three/addons/libs/meshopt_decoder.module.js' },
  limitation: 'SHA-256 identifica bytes. Os erros acima são medidos contra a fonte decodificada; equivalência visual e desempenho exigem a comparação no navegador.'
};
fs.writeFileSync(destination.replace(/\.glb$/, '.proveniencia.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ output: report.output, bytesBefore: report.bytesBefore, bytesAfter: report.bytesAfter, bytesByContent: report.bytesByContent, triangles: report.triangles, parts: report.assemblyParts, jsonIdenticalToSource: preserved, geometry: { positionMaxError: stats.positionMaxError, normalMaxAngleDegrees: stats.normalMaxAngleDegrees, uvMaxError: stats.uvMaxError }, textures: textures.map(t => `${t.name}${t.referencedByMaterial ? '' : ' (sem material)'} ${t.after.width}px ${t.after.bytes}B`) }, null, 2));
