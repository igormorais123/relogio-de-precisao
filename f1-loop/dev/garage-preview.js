import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createGarage} from '../src/world/garage.js';
import {wipeUniforms} from '../src/fx/wipe-clip.js';
import {FIELDS} from '../src/content.js';
import {applyCarMaterials} from '../materia-prima/modulos-atualizados/studio.js';

// Pré-visualização isolada do box. URL: ?cam=px,py,pz,tx,ty,tz&fov=30&wipe=0|1
// &debrief=0..1&notebook=sample|empty&mobile=1&car=0&clean=1&orbit=1
const q = new URLSearchParams(location.search);
const num = (k, d) => (q.has(k) && Number.isFinite(Number(q.get(k))) ? Number(q.get(k)) : d);
const mobile = q.get('mobile') === '1';
if (q.get('clean') === '1') document.body.classList.add('clean');
const hud = document.getElementById('hud');

const renderer = new THREE.WebGLRenderer({antialias: true, powerPreference: 'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = num('exp', 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#0b1014');
scene.fog = new THREE.Fog('#0b1014', num('fogNear', 9), num('fogFar', 30));

const cam = (q.get('cam') || '5.6,1.35,6.4,0,0.45,0.2').split(',').map(Number);
const camera = new THREE.PerspectiveCamera(num('fov', 30), innerWidth / innerHeight, .1, 100);
camera.position.set(cam[0], cam[1], cam[2]);
const target = new THREE.Vector3(cam[3], cam[4], cam[5]);
camera.lookAt(target);

const garage = createGarage({renderer, scene, mobile});
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(garage.envScene, .025, .1, 60).texture;
pmrem.dispose();

// Luz-chave quente com sombra (na cena principal ela pertence a scene.js).
const key = new THREE.DirectionalLight('#ffc996', num('key', 2.4));
key.position.set(5.5, 7, 3);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, {left: -7, right: 7, top: 7, bottom: -7, near: .5, far: 25});
key.shadow.bias = -.0002;
key.shadow.normalBias = .02;
scene.add(key);

// Dados de teste da pré-visualização; o módulo desenha exatamente o que recebe.
const SAMPLE = {
  task: 'Resumo do parecer técnico para a diretoria',
  reference: 'parecer-v1.docx · versão de 02/09',
  criterion: 'Preservar todas as datas e sustentar cada afirmação na fonte.',
  evidence: 'Versão 3: 12 de 12 datas conferidas; 2 afirmações sem fonte na página 4.',
  test: 'Comparar com a referência · limite de 3 tentativas',
};
garage.setNotebook(q.get('notebook') === 'empty' ? {} : SAMPLE, FIELDS.map(([k, label]) => [k, label]));
garage.setMood({debrief: num('debrief', 0), evaluate: num('evaluate', 0)});

let controls = null;
if (q.get('orbit') === '1') { controls = new OrbitControls(camera, renderer.domElement); controls.target.copy(target); }

if (q.get('wipe') === '1') {
  wipeUniforms.uWipePos.value = num('wipePos', 0);
  garage.clip.side = num('side', -1);
}

let car = null;
async function loadCar() {
  if (q.get('car') === '0') return;
  const gltf = await new GLTFLoader().loadAsync('/assets/carro-aula-mobile.glb');
  const model = gltf.scene;
  const bounds = new THREE.Box3().setFromObject(model);
  const center = bounds.getCenter(new THREE.Vector3());
  model.position.set(-center.x, -bounds.min.y, -center.z);
  applyCarMaterials(THREE, model);
  car = model;
  scene.add(model);
}

const size = new THREE.Vector2();
const clock = new THREE.Clock();
function frame() {
  const dt = Math.min(clock.getDelta(), .1);
  controls?.update();
  renderer.getDrawingBufferSize(size);
  wipeUniforms.uWipeRes.value.copy(size);
  garage.update(dt, camera, clock.elapsedTime);
  renderer.render(scene, camera);
}
function measure() {
  frame();
  const all = {calls: renderer.info.render.calls, triangles: renderer.info.render.triangles};
  let box = all;
  if (car) { car.visible = false; frame(); box = {calls: renderer.info.render.calls, triangles: renderer.info.render.triangles}; car.visible = true; frame(); }
  return {all, box, programs: renderer.info.programs.length, textures: renderer.info.memory.textures, geometries: renderer.info.memory.geometries};
}

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

window.__preview = {THREE, renderer, scene, camera, garage, wipeUniforms, measure, ready: false};
Promise.all([loadCar(), document.fonts.ready]).then(() => {
  renderer.setAnimationLoop(frame);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const stats = measure();
    hud.textContent = `box: ${stats.box.calls} chamadas · ${stats.box.triangles} triângulos\ntotal: ${stats.all.calls} · ${stats.all.triangles}`;
    window.__preview.stats = stats;
    window.__preview.ready = true;
  }));
}).catch(error => { hud.textContent = 'erro: ' + error.message; console.error(error); });
