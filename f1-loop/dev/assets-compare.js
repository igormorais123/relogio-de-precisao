// Página de QA da frente matéria-prima: mesmo estúdio e materiais da aula, dois GLB lado a lado.
// Parâmetros: ?a=carro-aula.glb&b=carro-aula-v2.glb&view=hero|lado|decalque|volante|pneu|traseira|asa&theme=dark
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
import {setupStudio, applyCarMaterials} from '../materia-prima/modulos-atualizados/studio.js';
import {createMechanics} from '../materia-prima/modulos-atualizados/mechanics.js';
import {applyInteiaBranding} from '../materia-prima/modulos-atualizados/branding.js';

const params = new URLSearchParams(location.search);
const files = [params.get('a') || 'carro-aula.glb', params.get('b') || 'carro-aula-v2.glb'];
const viewName = params.get('view') || 'hero';
const width = Number(params.get('w') || 900), height = Number(params.get('h') || 640);
const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);

// Offsets are in car space: nose at +Z, INTEIA signature on +X, cockpit facing +Z.
const views = {
  hero: {find: () => null, target: [0, .45, .1], offset: [4.4, 1.7, 4.6], fov: 30},
  lado: {find: r => r.source === 'main_body', target: [0, .45, 0], offset: [5.6, .55, 0], fov: 28},
  decalque: {find: r => r.source === 'main_body', target: [.5, .33, -.55], offset: [1.5, .25, .1], fov: 26},
  volante: {find: r => /^steering_wheel/.test(r.source), offset: [.05, .16, -.38], fov: 32, only: /steering|lcd|sw_connection/},
  pneu: {find: r => r.source.includes('front_tire') && r.center.x > 0, offset: [1.05, .3, .75], fov: 32},
  traseira: {find: () => null, target: [0, .55, -1.2], offset: [-3.2, 2.1, -4.3], fov: 30},
  asa: {find: r => r.source.startsWith('front_wing'), offset: [1.2, .75, 1.5], fov: 30}
};
const view = views[viewName] || views.hero;

async function render(canvas, file, label) {
  const renderer = new THREE.WebGLRenderer({canvas, antialias: true, preserveDrawingBuffer: true});
  renderer.setPixelRatio(1);
  renderer.setSize(width, height, false);
  const scene = new THREE.Scene();
  const studio = setupStudio(THREE, renderer, scene);
  studio.setTheme(params.get('theme') === 'dark');
  const started = performance.now();
  const response = await fetch(import.meta.env.BASE_URL + 'assets/' + file);
  if (!response.ok) throw new Error(file + ' HTTP ' + response.status);
  const raw = await response.arrayBuffer();
  const gltf = await loader.parseAsync(raw, '');
  const parseMs = performance.now() - started;
  const model = gltf.scene;
  const bounds = new THREE.Box3().setFromObject(model), center = bounds.getCenter(new THREE.Vector3());
  model.position.set(-center.x, -bounds.min.y, -center.z);
  scene.add(model);
  model.updateMatrixWorld(true);
  applyCarMaterials(THREE, model);
  const mechanics = createMechanics(model);
  const branding = applyInteiaBranding(model, mechanics);
  let triangles = 0;
  model.traverse(o => { if (o.isMesh) triangles += (o.geometry.index?.count ?? o.geometry.attributes.position.count) / 3; });
  const record = mechanics.records.find(view.find);
  if (view.only) for (const r of mechanics.records) r.hidden = !view.only.test(r.source);
  mechanics.update(0, 0, true);
  const target = record && !view.target ? record.center.clone().add(model.position) : new THREE.Vector3(...view.target);
  const camera = new THREE.PerspectiveCamera(view.fov, width / height, .01, 100);
  camera.position.copy(target).add(new THREE.Vector3(...view.offset));
  camera.lookAt(target);
  for (let i = 0; i < 3; i++) renderer.render(scene, camera);
  label.textContent = `${file} · ${(raw.byteLength / 1048576).toFixed(2)} MB · ${Math.round(triangles).toLocaleString('pt-BR')} triângulos · ${mechanics.records.length} peças · decalques ${branding.decals.length} · ${Math.round(parseMs)} ms`;
  return {bytes: raw.byteLength, triangles, parts: mechanics.records.length, decals: branding.decals.length, parseMs};
}

function difference(a, b) {
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const context = canvas.getContext('2d', {willReadFrequently: true});
  context.drawImage(a, 0, 0); const pa = context.getImageData(0, 0, width, height).data;
  context.drawImage(b, 0, 0); const pb = context.getImageData(0, 0, width, height).data;
  let sum = 0, changed = 0;
  for (let i = 0; i < pa.length; i += 4) {
    const d = Math.max(Math.abs(pa[i] - pb[i]), Math.abs(pa[i + 1] - pb[i + 1]), Math.abs(pa[i + 2] - pb[i + 2]));
    sum += d; if (d > 16) changed++;
  }
  return {meanAbsDiff: sum / (pa.length / 4), pixelsOver16: changed / (pa.length / 4)};
}

const status = document.querySelector('#status');
try {
  const results = await Promise.all([render(document.querySelector('#a'), files[0], document.querySelector('#label-a')), render(document.querySelector('#b'), files[1], document.querySelector('#label-b'))]);
  const diff = difference(document.querySelector('#a'), document.querySelector('#b'));
  const summary = {view: viewName, files, results, ...diff};
  status.textContent = `vista ${viewName} · diferença média ${diff.meanAbsDiff.toFixed(2)}/255 · pixels com diferença > 16: ${(diff.pixelsOver16 * 100).toFixed(2)}%`;
  document.body.dataset.result = JSON.stringify(summary);
} catch (error) {
  status.textContent = 'erro: ' + error.message;
  document.body.dataset.result = JSON.stringify({error: error.message});
  throw error;
}
