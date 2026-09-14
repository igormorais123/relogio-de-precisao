import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { sampleStory } from '../src/story.js';
import { carExtent, speedProfile } from '../tools/camera-metrics.mjs';
import { createChoreo, partTurn } from '../src/fx/choreo.js';

const samples = Array.from({length: 2001}, (_, i) => sampleStory(i / 2000 * 5));

test('the diagonal wipe only runs while one environment replaces the other', () => {
  for (const pose of samples) {
    if (pose.incoming === null) {
      assert.equal(pose.wipe, 0);
      assert.equal(pose.sweep, 0);
      assert.ok(pose.tunnel === 0 || pose.tunnel === 1, `a settled frame shows one world, got tunnel=${pose.tunnel}`);
    } else {
      assert.ok(['tunnel', 'garage'].includes(pose.incoming));
      assert.ok(pose.sweep > 0 && pose.sweep < 1);
      const expected = pose.incoming === 'tunnel' ? pose.sweep : 1 - pose.sweep;
      assert.ok(Math.abs(pose.tunnel - expected) < 1e-9, 'environment weight must match the swept area');
    }
  }
});

test('the tunnel is the stage of Executar and nowhere else', () => {
  for (const pose of samples) {
    if (pose.tunnel === 1) assert.equal(pose.index, 2, `tunnel fully visible outside Executar at ${pose.index + pose.local}`);
  }
  assert.equal(sampleStory(2.5).tunnel, 1);
  for (const p of [0.3, 1.3, 3.4, 4.3, 5]) assert.equal(sampleStory(p).tunnel, 0);
});

test('the diagonal wipes straddle the seams into (2) and out of (3) the tunnel', () => {
  for (const [p, incoming] of [[1.95, 'tunnel'], [2, 'tunnel'], [2.05, 'tunnel'], [2.95, 'garage'], [3, 'garage'], [3.05, 'garage']]) {
    assert.equal(sampleStory(p).incoming, incoming, `wipe at ${p}`);
  }
  for (const p of [1.8, 2.2, 2.8, 3.2]) assert.equal(sampleStory(p).incoming, null, `no wipe at ${p}`);
});

test('lens, focus and highlights stay physically usable across the take', () => {
  for (const pose of samples) {
    assert.ok(pose.fov >= 20 && pose.fov <= 40, `fov ${pose.fov}`);
    for (const v of pose.focus) assert.ok(Number.isFinite(v));
    for (const key of ['bokeh', 'highlight', 'debrief']) assert.ok(pose[key] >= 0 && pose[key] <= 1, `${key}=${pose[key]}`);
    assert.ok(pose.exposure > .5 && pose.exposure <= 1.05);
    assert.ok(pose.camera[1] > .3, 'camera never goes below the floor line');
  }
});

test('the part isolated by the hypothesis is the part shown as revised, and only then', () => {
  assert.equal(sampleStory(1.3).highlight, 1, 'Hipótese isolates one part');
  assert.equal(sampleStory(4.3).highlight, 1, 'Corrigir shows the same revised part');
  for (const p of [0.3, 2.3, 3.3, 5]) assert.equal(sampleStory(p).highlight, 0, `no highlight at ${p}`);
});

// Camera speed is measured in scene units per unit of progress. The damped scroll follow
// in main.js smooths time, not space: a spike here is a visible lurch on screen.
test('the camera never lurches and never stalls: speed stays within 0.2–1.8× its median', () => {
  const profile = speedProfile(.005), speeds = profile.map(s => s.speed).sort((a, b) => a - b);
  const median = speeds[speeds.length >> 1];
  const peak = profile.reduce((a, b) => b.speed > a.speed ? b : a), slowest = profile.reduce((a, b) => b.speed < a.speed ? b : a);
  assert.ok(peak.speed <= 1.8 * median, `peak ${peak.speed.toFixed(1)} u/p at p=${peak.p.toFixed(3)} is ${(peak.speed / median).toFixed(2)}× the median ${median.toFixed(1)}`);
  assert.ok(slowest.speed >= .2 * median, `camera nearly stops at p=${slowest.p.toFixed(3)} (${slowest.speed.toFixed(1)} u/p)`);
  // The tunnel exit used to be a 9 m jump hidden behind the wipe; it is now a travel.
  const at = p => sampleStory(p).camera;
  const gap = Math.hypot(...at(2.8).map((v, k) => v - at(3.2)[k]));
  assert.ok(gap <= .4 * 1.8 * median, `2.8→3.2 moves ${gap.toFixed(2)} u`);
});

test('the camera keeps moving while each chapter reads (no locked-off frames)', () => {
  for (let i = 0; i < 5; i++) {
    const a = sampleStory(i).camera, b = sampleStory(i + .5).camera;
    assert.ok(Math.hypot(...a.map((v, k) => v - b[k])) > 1.5, `chapter ${i + 1} camera barely moves during the copy`);
  }
});

test('while copy is on screen the car stays clear of the text column and the chapter dots (1440×900)', () => {
  const stops = [5];
  for (let i = 0; i < 5; i++) for (let k = 0; k <= 10; k++) stops.push(i + k * .05);
  for (const p of stops) {
    const e = carExtent(sampleStory(p));
    assert.ok(e, `car off screen at ${p}`);
    assert.ok(e.min >= .415 && e.max <= .925, `p=${p.toFixed(2)} car spans ${(e.min * 100).toFixed(0)}%–${(e.max * 100).toFixed(0)}%`);
  }
});

test('Avaliar reads the island monitors while the car sits outside the depth of field', () => {
  const monitors = new THREE.Vector3(-4.72, 1.52, -1.35), car = new THREE.Vector3(0, .5, 0);
  const camera = new THREE.PerspectiveCamera(30, 1440 / 900, .05, 80);
  camera.setViewOffset(1440, 900, -216, -27, 1440, 900);
  for (const p of [3.3, 3.4, 3.5, 3.6, 3.7]) {
    const pose = sampleStory(p), eye = new THREE.Vector3().fromArray(pose.camera);
    assert.ok(new THREE.Vector3().fromArray(pose.focus).distanceTo(monitors) < .01, `focus on the monitors at ${p}`);
    const range = 3.4 + (1.15 - 3.4) * pose.bokeh;                       // scene.js focus range
    assert.ok(Math.abs(eye.distanceTo(car) - eye.distanceTo(monitors)) > range, `car inside the focus range at ${p}`);
    camera.fov = pose.fov; camera.updateProjectionMatrix(); camera.position.copy(eye); camera.lookAt(new THREE.Vector3().fromArray(pose.target)); camera.updateMatrixWorld();
    const s = monitors.clone().project(camera), x = (s.x + 1) / 2, y = (1 - s.y) / 2;
    assert.ok(x > .42 && x < .92 && y > .12 && y < .88, `monitors at ${(x * 100).toFixed(0)}%,${(y * 100).toFixed(0)}% on screen at ${p}`);
  }
});

// Choreography runs on top of mechanics.js, which rewrites positions but never quaternions.
// This mock reproduces that contract; the same check in the page is documented in choreo.js.
function mockMechanics() {
  const model = new THREE.Group(), categories = ['wheels', 'aero', 'suspension', 'body', 'cockpit', 'details'];
  const records = categories.map((category, id) => {
    const root = new THREE.Group();
    root.position.set(id * .1, .2, -id * .3);
    root.quaternion.setFromEuler(new THREE.Euler(.3 * id, -.2, .11 * id));
    model.add(root);
    return {id, root, category, source: category, base: root.position.clone(), rotation: root.quaternion.clone(),
      center: new THREE.Vector3(id * .2, .4, id * .1 - .5), size: new THREE.Vector3(.5, .3, .6), direction: new THREE.Vector3(id % 2 ? 1 : -1, .6, .2)};
  });
  const mechanics = {records, wheels: [], flap: null, amount: 0};
  const apply = amount => { mechanics.amount = amount; for (const r of records) r.root.position.copy(r.base).addScaledVector(r.direction, amount); };
  return {model, mechanics, apply};
}

test('exploded parts tumble, and an assembled car returns exactly to its original orientation', () => {
  for (const c of ['wheels', 'aero', 'suspension', 'body', 'cockpit', 'details']) {
    assert.equal(partTurn(c, 0, 3, 12.3), 0, `${c} turns while assembled`);
    assert.ok(partTurn(c, 1, 3, 0) > 0, `${c} never turns`);
    assert.ok(partTurn('wheels', .3) > partTurn(c === 'wheels' ? 'details' : c, .3) || c === 'wheels', 'turn lags by category');
  }
  const {model, mechanics, apply} = mockMechanics();
  const choreo = createChoreo({model, mechanics, mobile: false});
  for (let frame = 0; frame < 90; frame++) { apply(.9); choreo.update(1 / 60, frame / 60, {explode: .9, tunnel: 0}); }
  assert.ok(mechanics.records.some(r => r.root.quaternion.angleTo(r.rotation) > .05), 'no part tumbles when exploded');
  for (let frame = 0; frame < 5; frame++) { apply(0); choreo.update(1 / 60, 2 + frame / 60, {explode: 0, tunnel: 0}); }
  for (const r of mechanics.records) {
    assert.ok(r.root.quaternion.equals(r.rotation), `${r.category} orientation drifted`);
    assert.ok(r.root.position.equals(r.base), `${r.category} position drifted`);
  }
  choreo.dispose();
});

test('the car works in the tunnel and settles back exactly when it leaves', () => {
  const {model, mechanics, apply} = mockMechanics();
  const choreo = createChoreo({model, mechanics, mobile: false});
  let moved = 0;
  for (let frame = 0; frame < 60; frame++) {
    apply(0); choreo.update(1 / 60, frame / 60, {explode: 0, tunnel: 1});
    const body = mechanics.records.find(r => r.category === 'body');
    moved = Math.max(moved, body.root.position.distanceTo(body.base));
    const wheel = mechanics.records.find(r => r.category === 'wheels');
    assert.ok(wheel.root.position.equals(wheel.base), 'wheels stay planted');
  }
  assert.ok(moved > .003 && moved < .05, `body load motion ${moved.toFixed(4)} m`);
  apply(0); choreo.update(1 / 60, 5, {explode: 0, tunnel: 0});
  for (const r of mechanics.records) assert.ok(r.root.quaternion.equals(r.rotation) && r.root.position.equals(r.base), `${r.category} kept tunnel motion`);
  choreo.dispose();
});
