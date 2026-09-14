// Uso: node tools/verify-car.mjs [arquivo.glb] | [--mobile]
// Sem argumento de arquivo, valida public/assets/carro-aula.glb (ou carro-aula-mobile.glb com --mobile).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { isDeepStrictEqual } from 'node:util';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { createMechanics } from '../materia-prima/modulos-atualizados/mechanics.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.resolve(root, '../../INTEIA-laboratorio-3d/web/assets/carro-movable.glb');
const argument = process.argv.slice(2).find(arg => !arg.startsWith('--'));
const derived = argument
  ? (fs.existsSync(path.resolve(argument)) ? path.resolve(argument) : path.resolve(root, argument))
  : path.resolve(root, `public/assets/${process.argv.includes('--mobile') ? 'carro-aula-mobile' : 'carro-aula'}.glb`);
const basename = path.basename(derived, '.glb');
await MeshoptDecoder.ready;
const readGLB = file => {
  const bytes = fs.readFileSync(file);
  const length = bytes.readUInt32LE(12);
  return { bytes, length, json: JSON.parse(bytes.subarray(20, 20 + length)) };
};
async function loadGeometry(file) {
  const { bytes, length, json } = readGLB(file);
  // This test covers geometry/assembly only; browser QA covers texture and lighting appearance.
  json.materials = [{}];
  for (const key of ['images', 'textures', 'samplers']) delete json[key];
  // Geometry codecs stay required; texture/material extensions are irrelevant once materials are stripped.
  for (const key of ['extensionsUsed', 'extensionsRequired']) {
    json[key] = (json[key] || []).filter(name => name === 'EXT_meshopt_compression' || name === 'KHR_mesh_quantization');
    if (!json[key].length) delete json[key];
  }
  for (const mesh of json.meshes) for (const p of mesh.primitives) p.material = 0;
  const text = Buffer.from(JSON.stringify(json));
  const padded = Buffer.alloc(Math.ceil(text.length / 4) * 4, 32);
  text.copy(padded);
  const tail = bytes.subarray(20 + length), out = Buffer.alloc(20 + padded.length + tail.length);
  bytes.copy(out, 0, 0, 12);
  out.writeUInt32LE(out.length, 8); out.writeUInt32LE(padded.length, 12); out.writeUInt32LE(0x4e4f534a, 16);
  padded.copy(out, 20); tail.copy(out, 20 + padded.length);
  const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(out.buffer.slice(out.byteOffset, out.byteOffset + out.length), '');
  const model = gltf.scene;
  const box = new THREE.Box3().setFromObject(model), center = box.getCenter(new THREE.Vector3());
  model.position.set(-center.x, -box.min.y, -center.z);
  model.updateMatrixWorld(true);
  return model;
}
// Texture indices may be renumbered by other encoders; compare each texture reference by image name instead.
const imageName = (json, info) => {
  const texture = json.textures[info.index];
  return json.images[texture.source ?? texture.extensions?.EXT_texture_webp?.source]?.name;
};
const materialSemantics = json => json.materials.map(m => JSON.parse(JSON.stringify(m, (key, value) => /Texture$/.test(key) && Number.isInteger(value?.index) ? { ...value, index: imageName(json, value) } : value)));

const sourceGLB = readGLB(source), derivedGLB = readGLB(derived);
const extensions = derivedGLB.json.extensionsUsed || [];
const compressed = extensions.includes('EXT_meshopt_compression');
assert.deepEqual(derivedGLB.json.nodes, sourceGLB.json.nodes, 'All original nodes, extras, pivots and transforms must remain byte-equivalent JSON values');
const materialDefinitionsIdentical = isDeepStrictEqual(derivedGLB.json.materials, sourceGLB.json.materials);
assert.deepEqual(materialSemantics(derivedGLB.json), materialSemantics(sourceGLB.json), 'Material names, factors, extensions and texture images must remain intact');
assert.equal(derivedGLB.json.meshes.length, 97);
const originalModel = await loadGeometry(source), model = await loadGeometry(derived);
let triangles = 0;
model.traverse(o => { if (o.isMesh) triangles += (o.geometry.index?.count ?? o.geometry.attributes.position.count) / 3; });
const originalMechanics = createMechanics(originalModel);
const before = new Map();
model.traverse(o => { if (o.isMesh) before.set(o.uuid, o.matrixWorld.clone()); });
const mechanics = createMechanics(model);
assert.equal(mechanics.records.length, 97);
assert.equal(mechanics.wheels.length, 4);
assert(mechanics.flap, 'DRS flap must exist');
// EXPONENTIAL position coding (16-bit mantissa, |p| <= 2.2) moves a vertex at most 6.1e-5. A box center then moves
// at most that per axis and a size at most twice that, so the distance between size vectors is below sqrt(3)*1.22e-4 = 2.1e-4.
const boundsTolerance = compressed ? 2.5e-4 : 1e-6;
let boundsError = 0;
for (let i = 0; i < 97; i++) {
  const current = mechanics.records[i], expected = originalMechanics.records[i];
  assert.equal(current.source, expected.source);
  assert.equal(current.root.userData.partId, expected.root.userData.partId);
  boundsError = Math.max(boundsError, current.center.distanceTo(expected.center), current.size.distanceTo(expected.size));
}
assert(boundsError < boundsTolerance, `Assembly bounding boxes changed: ${boundsError}`);
const matrixError = () => {
  model.updateMatrixWorld(true);
  let error = 0;
  model.traverse(o => { if (before.has(o.uuid)) o.matrixWorld.elements.forEach((value, i) => { error = Math.max(error, Math.abs(value - before.get(o.uuid).elements[i])); }); });
  return error;
};
mechanics.update(.05, 0, true);
const initialError = matrixError();
let now = 0;
for (let cycle = 0; cycle < 20; cycle++) {
  mechanics.setAmount(1);
  for (let step = 0; step < 100; step++) mechanics.update(.05, now += 50, false);
  assert.equal(mechanics.amount, 1);
  mechanics.setAmount(0);
  for (let step = 0; step < 100; step++) mechanics.update(.05, now += 50, false);
  assert.equal(mechanics.amount, 0);
}
const finalError = matrixError();
assert(initialError < 1e-6 && finalError < 1e-6, 'Assembly must return without transform drift');
mechanics.setSteering(22); mechanics.setSpin(true); mechanics.setDRS(32); mechanics.update(.05, now, true);
assert(mechanics.wheels.some(w => Math.abs(w.pivot.rotation.y) > .2));
assert(mechanics.wheels.every(w => w.covers.length === 1));
mechanics.select(10); mechanics.setManual(.7); mechanics.update(.05, now, true);
assert.equal(mechanics.motionAvailable, false);
mechanics.restoreParts(); mechanics.reset(); mechanics.update(.05, now, true);
const resetError = matrixError();
assert(resetError < 1e-6);
mechanics.select(20); mechanics.isolate(); mechanics.restoreParts();
assert.equal(mechanics.isolated, false);
mechanics.drag(true); mechanics.records[20].root.position.x += .75; mechanics.drag(false); mechanics.update(.05, now, true);
assert(mechanics.records[20].custom.length() > .7);
mechanics.restoreParts(); mechanics.reset(); mechanics.update(.05, now, true);
const dragResetError = matrixError();
assert(dragResetError < 1e-6);
const report = {
  checkedAt: new Date().toISOString(), passed: true, file: path.relative(root, derived).replaceAll('\\', '/'), bytes: derivedGLB.bytes.length,
  sha256: crypto.createHash('sha256').update(derivedGLB.bytes).digest('hex'), triangles, extensionsUsed: extensions,
  parts: mechanics.records.length, wheelPivots: mechanics.wheels.length, drs: true, assemblyCycles: 20,
  boundsError, boundsTolerance, initialError, finalError, resetError, dragResetError,
  nodeContractIdentical: true, materialDefinitionsIdentical,
  materialCheck: materialDefinitionsIdentical ? 'JSON de materiais idêntico ao do laboratório' : 'Comparação semântica: nomes, fatores, extensões e nome da imagem de cada textura (índices podem ter sido renumerados)',
  boundsToleranceReason: compressed ? 'Posições com filtro EXPONENTIAL (mantissa de 16 bits): limite analítico sqrt(3)*2*6.1e-5 = 2.1e-4 unidades, com folga para 2.5e-4' : 'Sem compressão de posição',
  limitation: 'Geometry and mechanics validated in Node/Three. Does not replace visual QA or FPS measurement in the target browser.'
};
fs.writeFileSync(path.join(path.dirname(derived), `${basename}.validacao.json`), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
