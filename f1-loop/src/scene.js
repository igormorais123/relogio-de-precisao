import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
import {applyCarMaterials} from '../materia-prima/modulos-atualizados/studio.js';
import {createMechanics} from '../materia-prima/modulos-atualizados/mechanics.js';
import {applyInteiaBranding} from '../materia-prima/modulos-atualizados/branding.js';
import {createPost} from './fx/post.js';
import {wipeUniforms, WIPE_RANGE} from './fx/wipe-clip.js';
import {createDust} from './fx/dust.js';
import {createHighlight} from './fx/highlight.js';
import {createGarage} from './world/garage.js';
import {createTunnel} from './world/tunnel.js';

const FOG = '#0b1014';
const mix = (a, b, t) => a + (b - a) * t;
const smooth = t => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };

async function fetchModel(names, signal, onFraction) {
  for (const name of names) {
    const response = await fetch(import.meta.env.BASE_URL + 'assets/' + name, {signal});
    if (response.status === 404 || (response.headers.get('content-type') || '').includes('text/html')) continue;
    if (!response.ok) throw new Error('Modelo HTTP ' + response.status);
    const total = Number(response.headers.get('content-length')) || 0;
    if (!response.body || !total) { const bytes = await response.arrayBuffer(); onFraction(1); return bytes; }
    const reader = response.body.getReader(), chunks = [];
    let received = 0;
    for (;;) {
      const {done, value} = await reader.read();
      if (done) break;
      chunks.push(value); received += value.length; onFraction(Math.min(1, received / total));
    }
    const bytes = new Uint8Array(received);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    return bytes.buffer;
  }
  throw new Error('Modelo do carro ausente');
}

function radialTexture(size = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const context = canvas.getContext('2d'), image = context.createImageData(size, size);
  for (let j = 0; j < size; j++) for (let i = 0; i < size; i++) {
    const dx = (i + .5) / size * 2 - 1, dy = (j + .5) / size * 2 - 1, d = Math.sqrt(dx * dx + dy * dy);
    // Dithered alpha avoids the 8-bit banding a smooth gradient shows under grading.
    image.data[(j * size + i) * 4 + 3] = Math.max(0, Math.min(255, Math.pow(Math.max(0, 1 - d), 1.7) * 255 + Math.random() - .5));
  }
  context.putImageData(image, 0, 0);
  return new THREE.CanvasTexture(canvas);
}

export async function createScene(stage, {onProgress, onError}) {
  const mobile = innerWidth < 761;
  const params = new URLSearchParams(location.search);
  let pixelRatio = Math.min(devicePixelRatio, mobile ? 1.25 : 1.5);
  const renderer = new THREE.WebGLRenderer({antialias: false, alpha: false, stencil: false, powerPreference: 'high-performance'});
  renderer.setPixelRatio(pixelRatio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.info.autoReset = false;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(FOG);
  scene.fog = new THREE.Fog(FOG, 15, 40);
  const camera = new THREE.PerspectiveCamera(30, 1, .05, 80);
  stage.append(renderer.domElement);
  renderer.domElement.addEventListener('webglcontextlost', e => { e.preventDefault(); onError(); });

  // Warm key against a cold world (R10); the environment map supplies the softboxes.
  const warmKey = new THREE.Color('#ffcf9e'), coldKey = new THREE.Color('#dcecff');
  const warmRim = new THREE.Color('#8fb6ff'), coldRim = new THREE.Color('#4fd6ff');
  const key = new THREE.DirectionalLight(warmKey, 3);
  key.position.set(4.5, 7, -2.5);
  key.castShadow = true;
  key.shadow.mapSize.setScalar(mobile ? 1024 : 2048);
  Object.assign(key.shadow.camera, {left: -4.2, right: 4.2, top: 4.2, bottom: -4.2, near: 1, far: 20});
  key.shadow.camera.updateProjectionMatrix();
  key.shadow.bias = -.00025;
  key.shadow.normalBias = .012;
  key.shadow.radius = 5;
  // Steep rim: a low rim mirrors off the epoxy straight into the low cameras as a white sheet.
  const rim = new THREE.DirectionalLight(warmRim, 2);
  rim.position.set(-2.5, 9, -6);
  const front = new THREE.DirectionalLight('#dfe8f0', .45);
  front.position.set(3, 2, 8);
  const hemi = new THREE.HemisphereLight('#44576a', '#07090b', .4);
  scene.add(key, key.target, rim, front, hemi);

  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const abort = new AbortController(), timer = setTimeout(() => abort.abort(), 45000);
  let model;
  try {
    const names = mobile ? ['carro-aula-mobile-v2.glb', 'carro-aula-mobile.glb'] : ['carro-aula-v2.glb', 'carro-aula.glb'];
    const raw = await fetchModel(names, abort.signal, f => onProgress(f * .8, 'Carregando o carro'));
    onProgress(.84, 'Montando as 97 peças');
    await MeshoptDecoder.ready;
    model = (await loader.parseAsync(raw, '')).scene;
  } catch (error) {
    renderer.dispose(); renderer.domElement.remove(); throw error;
  } finally { clearTimeout(timer); }
  const bounds = new THREE.Box3().setFromObject(model), center = bounds.getCenter(new THREE.Vector3());
  model.position.set(-center.x, -bounds.min.y, -center.z);
  scene.add(model);
  model.updateMatrixWorld(true);
  const carMaterials = applyCarMaterials(THREE, model);
  for (const m of carMaterials.materials) if (m.name.toLowerCase().startsWith('pintura')) m.envMapIntensity = 1.25;
  const mechanics = createMechanics(model);
  applyInteiaBranding(model, mechanics);
  let triangles = 0;
  const offsetScale = new THREE.Vector3();
  // Parts smaller than a few centimetres add shadow-pass draw calls but no readable shadow.
  model.traverse(o => {
    if (!o.isMesh) return;
    triangles += (o.geometry.index?.count || o.geometry.attributes.position.count) / 3;
    if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
    o.castShadow = !o.userData.inteiaDecal && o.geometry.boundingSphere.radius * o.getWorldScale(offsetScale).x > .09;
    o.receiveShadow = true;
  });
  const find = pattern => mechanics.records.find(r => pattern.test(r.source));
  const floor = createHighlight(mechanics.records.filter(r => /^floor/.test(r.source)), '#ff2d45');

  // Soft contact shadow under the chassis and each tyre, faded when the car opens.
  const blobTexture = radialTexture();
  const blobMaterial = new THREE.MeshBasicMaterial({map: blobTexture, color: '#000', transparent: true, depthWrite: false});
  const contacts = new THREE.Group();
  const blob = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 6.6), blobMaterial);
  blob.rotation.x = -Math.PI / 2; blob.position.y = .004; contacts.add(blob);
  for (const w of mechanics.wheels) {
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(.62, .86), blobMaterial);
    shadow.rotation.x = -Math.PI / 2; shadow.position.set(w.pivot.position.x, .006, w.pivot.position.z); contacts.add(shadow);
  }
  contacts.renderOrder = 1;
  scene.add(contacts);

  onProgress(.9, 'Acendendo o box');
  const garage = createGarage({renderer, scene, mobile});
  const tunnel = createTunnel({renderer, scene, mobile});
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envGarage = pmrem.fromScene(garage.envScene, .02);
  const envTunnel = pmrem.fromScene(tunnel.envScene, .02);
  pmrem.dispose();
  scene.environment = envGarage.texture;
  const dust = createDust({mobile});
  scene.add(dust.points);
  const post = createPost(renderer, scene, camera, {mobile});

  const target = new THREE.Vector3(), focus = new THREE.Vector3(), offset = new THREE.Vector3(), side = new THREE.Vector3(), point = new THREE.Vector3(), buffer = new THREE.Vector2();
  const pointer = {x: 0, y: 0, sx: 0, sy: 0};
  const gradeGarage = [[.9, .99, 1.07], [1.06, 1, .92]], gradeTunnel = [[.84, 1, 1.14], [.97, 1.02, 1.07]], gradeDebrief = [[.97, .92, 1.02], [1.05, .98, .93]];
  const dustWarm = new THREE.Color('#ffd9b8'), dustCold = new THREE.Color('#bfe9ff'), dustColor = new THREE.Color();
  let pose = null, width = 1, height = 1;

  function resize() {
    width = innerWidth; height = innerHeight;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height);
    post.setSize(width, height);
    camera.aspect = width / height;
    // Text owns the left column on desktop and the lower half on phones (R4).
    camera.setViewOffset(width, height, mobile ? 0 : -width * .13, mobile ? height * .2 : -height * .03, width, height);
    camera.updateProjectionMatrix();
    wipeUniforms.uWipeRes.value.copy(renderer.getDrawingBufferSize(buffer));
  }

  const partPoint = (record, extra) => record
    ? () => point.copy(record.center).add(model.position).add(offset.subVectors(record.root.position, record.base)).add(extra)
    : () => point.set(0, .8, 0);
  const floorPart = find(/^floor/), steering = find(/^steering_wheel/);
  // Hotspots sit on the subject, clear of the text column and of the evidence itself.
  const anchors = [
    partPoint(steering, new THREE.Vector3(0, .62, -.7)),
    partPoint(floorPart, new THREE.Vector3(0, .05, -1.2)),
    partPoint(steering, new THREE.Vector3(0, .62, -.9)),
    () => (garage?.anchors?.monitors ? point.copy(garage.anchors.monitors) : point.set(-4.6, 1.52, -1.35)).add(offset.set(0, .72, -1.9)),
    partPoint(floorPart, new THREE.Vector3(0, -.02, -.4)),
    partPoint(steering, new THREE.Vector3(0, .62, -.7)),
  ];

  function apply(dt, time) {
    const t = pose.tunnel, d = pose.debrief, e = pose.exposure;
    camera.position.fromArray(pose.camera);
    target.fromArray(pose.target);
    if (mobile) { offset.subVectors(camera.position, target).multiplyScalar(1.5 + pose.explode * .45); camera.position.copy(target).add(offset); }
    // Handheld breathing and pointer parallax stay small so the take remains legible.
    const follow = 1 - Math.exp(-dt * 3);
    pointer.sx += (pointer.x - pointer.sx) * follow; pointer.sy += (pointer.y - pointer.sy) * follow;
    side.subVectors(target, camera.position).cross(camera.up).normalize();
    camera.position.addScaledVector(side, pointer.sx * .16 + Math.sin(time * .31) * .025);
    camera.position.y += -pointer.sy * .08 + Math.sin(time * .23 + 1.3) * .018;
    camera.fov = pose.fov * (mobile ? 1.32 : 1);
    camera.updateProjectionMatrix();
    camera.lookAt(target);

    mechanics.setAmount(pose.explode);
    mechanics.setSpin(t > .01);
    mechanics.update(dt * (1 + 20 * t), time * 1000, true);
    floor.set(pose.highlight, time);
    blobMaterial.opacity = .85 * (1 - smooth(pose.explode * 4));

    const inTunnel = t >= .5;
    if (pose.incoming) {
      wipeUniforms.uWipePos.value = mix(-WIPE_RANGE, WIPE_RANGE, pose.sweep);
      if (garage) { garage.root.visible = true; garage.clip.side = pose.incoming === 'garage' ? 1 : -1; }
      if (tunnel) { tunnel.root.visible = true; tunnel.clip.side = pose.incoming === 'tunnel' ? 1 : -1; }
    } else {
      wipeUniforms.uWipePos.value = -9;
      if (garage) { garage.root.visible = !inTunnel; garage.clip.side = 0; }
      if (tunnel) { tunnel.root.visible = inTunnel; tunnel.clip.side = 0; }
    }
    scene.environment = (inTunnel ? envTunnel : envGarage).texture;
    tunnel?.setFlow(t);
    garage?.setMood({debrief: d});
    garage?.update(dt, camera, time);
    tunnel?.update(dt, camera, time);

    key.color.lerpColors(warmKey, coldKey, t);
    key.intensity = (3.1 - .8 * t) * (1 - .55 * d) * e;
    rim.color.lerpColors(warmRim, coldRim, t);
    rim.intensity = (1.7 + 1.8 * t + 1.2 * d) * e;
    front.intensity = .3 * (1 - .6 * d) * e;
    hemi.intensity = .28 * e;
    scene.environmentIntensity = (.9 + .15 * t) * (1 - .35 * d) * e;
    const g = t > 0 ? [0, 1].map(k => gradeGarage[k].map((v, i) => mix(v, gradeTunnel[k][i], t))) : gradeGarage.map((row, k) => row.map((v, i) => mix(v, gradeDebrief[k][i], d)));
    post.setGrade(g[0], g[1], 1);
    post.setBloom(.5 + .35 * t + .3 * d);
    post.setBand(pose.incoming ? pose.wipe : 0, time);
    focus.fromArray(pose.focus);
    post.focus(camera.position.distanceTo(focus), mix(3.4, 1.15, pose.bokeh), 1 + pose.bokeh * 4.4);
    dustColor.lerpColors(dustWarm, dustCold, t);
    dust.update(time, pixelRatio * height / 900, 1 - .5 * t, dustColor);
    debug?.after?.();
  }
  // ?debug=1 exposes the rig to tools/probe.mjs for isolating a look problem.
  const debug = params.has('debug') ? (window.__scene = {scene, key, rim, front, hemi, garage, tunnel, post, mechanics}) : null;

  // Frame-time guard: long frames lower the render resolution once, never the story.
  let samples = params.get('quality') === 'high' ? -1 : 0, accumulated = 0;
  function adapt(dt) {
    if (samples < 0) return;
    accumulated += dt; samples++;
    if (samples < 120) return;
    if (accumulated / samples > .03 && pixelRatio > .9) { pixelRatio = Math.max(.85, pixelRatio - .3); resize(); samples = 0; accumulated = 0; stage.dataset.quality = String(pixelRatio); }
    else samples = -1;
  }

  stage.dataset.parts = String(mechanics.records.length);
  stage.dataset.triangles = String(triangles);
  stage.dataset.highlights = String(floor.count);
  resize();
  onProgress(1, 'Pronto');
  return {
    setPose(next) { pose = next; },
    setPointer(x, y) { pointer.x = x; pointer.y = y; },
    setNotebook(values, fields) { garage?.setNotebook(values, fields); },
    anchor(index) {
      const p = anchors[index]().project(camera);
      return {x: (p.x + 1) / 2 * width, y: (1 - p.y) / 2 * height, ok: p.z > -1 && p.z < 1 && Math.abs(p.x) < .92 && Math.abs(p.y) < .86};
    },
    resize,
    render(dt, time) {
      if (!pose) return;
      apply(dt, time);
      renderer.info.reset();
      post.render(dt);
      stage.dataset.calls = String(renderer.info.render.calls);
      if (!stage.dataset.loaded) { stage.dataset.loaded = 'true'; stage.classList.add('loaded'); }
      adapt(dt);
    },
    dispose() { post.dispose(); dust.dispose(); floor.dispose(); carMaterials.dispose(); garage?.dispose(); tunnel?.dispose(); envGarage.dispose(); envTunnel.dispose(); renderer.dispose(); },
  };
}
