import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {applyCarMaterials} from '../materia-prima/modulos-atualizados/studio.js';
import {wipeUniforms} from '../src/fx/wipe-clip.js';

// Pré-visualização isolada do túnel. Parâmetros:
// ?cam=px,py,pz,tx,ty,tz &fov=30 &wipe=0|1 &t=segundos &mobile=0|1 &bloom=0|1 &car=0|1 &flow=0..1
const q = new URLSearchParams(location.search);
const num = (k, d) => (q.has(k) ? Number(q.get(k)) : d);
const mobile = q.get('mobile') === '1';
const hud = document.getElementById('hud');

const renderer = new THREE.WebGLRenderer({antialias: true, powerPreference: 'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = .95;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.append(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#0b1014');
scene.fog = new THREE.Fog('#0b1014', 10, 34);

const cam = (q.get('cam') || '4.6,0.78,3.8,0,0.45,0.6').split(',').map(Number);
const camera = new THREE.PerspectiveCamera(num('fov', 28), innerWidth / innerHeight, .05, 120);
camera.position.set(cam[0], cam[1], cam[2]);
const target = new THREE.Vector3(cam[3], cam[4], cam[5]);
camera.lookAt(target);

// Luz-chave fria com sombra (na cena principal ela pertence à cena, não ao módulo).
const key = new THREE.DirectionalLight('#e9f3ff', 2.2);
key.position.set(1.5, 7, 2.5);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, {left: -5, right: 5, top: 5, bottom: -5, near: .5, far: 20});
key.shadow.bias = -.0002;
key.shadow.normalBias = .02;
scene.add(key);
scene.add(new THREE.HemisphereLight('#9fb8c8', '#0b1014', .12));

const stats = {ready: false};
window.__tunnel = stats;

async function loadCar() {
  const gltf = await new GLTFLoader().loadAsync('/assets/carro-aula-mobile.glb');
  const model = gltf.scene;
  const box = new THREE.Box3().setFromObject(model), center = box.getCenter(new THREE.Vector3());
  model.position.set(-center.x, -box.min.y, -center.z);
  scene.add(model);
  model.updateMatrixWorld(true);
  applyCarMaterials(THREE, model);
  if (q.get('dump') === '1') {
    const out = [];
    model.traverse(o => {
      if (!o.isMesh) return;
      const b = new THREE.Box3().setFromObject(o);
      out.push([o.name, o.material.name, ...b.min.toArray().map(v => +v.toFixed(3)), ...b.max.toArray().map(v => +v.toFixed(3))].join(' '));
    });
    stats.dump = out;
  }
  return model;
}

const [{createTunnel}, model] = await Promise.all([
  q.get('dump') === '1' ? Promise.resolve({createTunnel: null}) : import('../src/world/tunnel.js'),
  q.get('car') === '0' ? Promise.resolve(null) : loadCar(),
]);
if (!createTunnel) { stats.ready = true; throw new Error('dump concluído'); }

const tunnel = createTunnel({renderer, scene, mobile});
window.__tunnelApi = tunnel;
await tunnel.ready;
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(tunnel.envScene, .02, .1, 100).texture;
scene.environmentIntensity = 1;
pmrem.dispose();
tunnel.setFlow(num('flow', 1));

let composer = null;
if (q.get('bloom') !== '0') {
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), .35, .45, .9));
  composer.addPass(new OutputPass());
}

const buffer = new THREE.Vector2();
function syncWipe() {
  renderer.getDrawingBufferSize(buffer);
  wipeUniforms.uWipeRes.value.copy(buffer);
  if (q.get('wipe') === '1') { wipeUniforms.uWipePos.value = 0; tunnel.clip.side = 1; }
}
syncWipe();

function countCalls() {
  // Chamadas só do túnel: passo principal sem o carro (o túnel não projeta sombra).
  renderer.info.autoReset = false;
  const carVisible = model?.visible;
  if (model) model.visible = false;
  renderer.info.reset();
  renderer.render(scene, camera);
  const tunnelCalls = renderer.info.render.calls;
  if (model) model.visible = carVisible;
  renderer.info.reset();
  renderer.render(scene, camera);
  const totalCalls = renderer.info.render.calls;
  renderer.info.autoReset = true;
  return {tunnelCalls, totalCalls, triangles: renderer.info.render.triangles};
}

function frame() {
  if (composer) composer.render(); else renderer.render(scene, camera);
}

const fixedT = q.has('t') ? num('t', 0) : null;
let elapsed = 0;
if (fixedT !== null) {
  const dt = 1 / 60;
  for (; elapsed < fixedT; elapsed += dt) tunnel.update(dt, camera, elapsed);
  tunnel.update(0, camera, elapsed);
  Object.assign(stats, countCalls());
  frame();
  stats.ready = true;
  hud.textContent = `túnel ${stats.tunnelCalls} draw calls · total ${stats.totalCalls} · t=${fixedT}s`;
} else {
  const clock = new THREE.Clock();
  Object.assign(stats, countCalls());
  stats.ready = true;
  renderer.setAnimationLoop(() => {
    const dt = Math.min(clock.getDelta(), 1 / 20);
    elapsed += dt;
    tunnel.update(dt, camera, elapsed);
    frame();
  });
  hud.textContent = `túnel ${stats.tunnelCalls} draw calls · total ${stats.totalCalls}`;
}

addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight);
  composer?.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  syncWipe();
});
