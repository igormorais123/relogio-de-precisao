import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createMechanics } from '../materia-prima/modulos-atualizados/mechanics.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.resolve(root, '../../INTEIA-laboratorio-3d/web/assets/carro-movable.glb');
const basename = process.argv.includes('--mobile') ? 'carro-aula-mobile' : 'carro-aula';
const derived = path.resolve(root, `public/assets/${basename}.glb`);
const readGLB = file => {
  const bytes = fs.readFileSync(file);
  const length = bytes.readUInt32LE(12);
  return { bytes, length, json: JSON.parse(bytes.subarray(20, 20 + length)) };
};
async function loadGeometry(file) {
  const { bytes, length, json } = readGLB(file);
  // This test covers geometry/assembly only; browser QA covers texture and lighting appearance.
  json.materials = [{}];
  for (const key of ['images', 'textures', 'samplers', 'extensionsUsed', 'extensionsRequired']) delete json[key];
  for (const mesh of json.meshes) for (const p of mesh.primitives) p.material = 0;
  const text = Buffer.from(JSON.stringify(json));
  const padded = Buffer.alloc(Math.ceil(text.length / 4) * 4, 32);
  text.copy(padded);
  const tail = bytes.subarray(20 + length), out = Buffer.alloc(20 + padded.length + tail.length);
  bytes.copy(out, 0, 0, 12);
  out.writeUInt32LE(out.length, 8); out.writeUInt32LE(padded.length, 12); out.writeUInt32LE(0x4e4f534a, 16);
  padded.copy(out, 20); tail.copy(out, 20 + padded.length);
  const gltf = await new GLTFLoader().parseAsync(out.buffer.slice(out.byteOffset, out.byteOffset + out.length), '');
  const model = gltf.scene;
  const box = new THREE.Box3().setFromObject(model), center = box.getCenter(new THREE.Vector3());
  model.position.set(-center.x, -box.min.y, -center.z);
  model.updateMatrixWorld(true);
  return model;
}
const sourceGLB = readGLB(source), derivedGLB = readGLB(derived);
assert.deepEqual(derivedGLB.json.nodes, sourceGLB.json.nodes, 'All original nodes, extras, pivots and transforms must remain byte-equivalent JSON values');
assert.deepEqual(derivedGLB.json.materials, sourceGLB.json.materials, 'Material definitions must remain intact');
assert.equal(derivedGLB.json.meshes.length, 97);
const originalModel = await loadGeometry(source), model = await loadGeometry(derived);
const originalMechanics = createMechanics(originalModel);
const before = new Map();
model.traverse(o => { if (o.isMesh) before.set(o.uuid, o.matrixWorld.clone()); });
const mechanics = createMechanics(model);
assert.equal(mechanics.records.length, 97);
assert.equal(mechanics.wheels.length, 4);
assert(mechanics.flap, 'DRS flap must exist');
let boundsError = 0;
for (let i = 0; i < 97; i++) {
  const current = mechanics.records[i], expected = originalMechanics.records[i];
  assert.equal(current.source, expected.source);
  assert.equal(current.root.userData.partId, expected.root.userData.partId);
  boundsError = Math.max(boundsError, current.center.distanceTo(expected.center), current.size.distanceTo(expected.size));
}
assert(boundsError < 1e-6, `Assembly bounding boxes changed: ${boundsError}`);
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
const report = { checkedAt: new Date().toISOString(), passed: true, parts: mechanics.records.length, wheelPivots: mechanics.wheels.length, drs: true, assemblyCycles: 20, boundsError, initialError, finalError, resetError, dragResetError, nodeContractIdentical: true, materialDefinitionsIdentical: true, limitation: 'Geometry and mechanics validated in Node/Three. Does not replace visual QA or FPS measurement in the target browser.' };
fs.writeFileSync(path.resolve(root, `public/assets/${basename}.validacao.json`), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
