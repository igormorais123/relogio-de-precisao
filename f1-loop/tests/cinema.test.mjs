import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
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

// Round 2 left a limbo at 1.72–2.06: the next chapter's title was legible while the old world
// was still leaving. The wipe now lives in the text-free travel and is done on the seam, so the
// copy of 03 and 04 (opened by main.js after the seam) always lands on a single world.
test('each diagonal wipe runs in the travel before a tunnel seam and is over on the seam', () => {
  for (const [p, incoming] of [[1.8, 'tunnel'], [1.9, 'tunnel'], [1.98, 'tunnel'], [2.8, 'garage'], [2.9, 'garage'], [2.98, 'garage']]) {
    assert.equal(sampleStory(p).incoming, incoming, `wipe at ${p}`);
  }
  for (const p of [1.7, 2, 2.02, 2.2, 2.7, 3, 3.02, 3.2]) assert.equal(sampleStory(p).incoming, null, `no wipe at ${p}`);
  for (const seam of [2, 3]) {
    let peak = 0, at = 0;
    for (let p = seam - .3; p < seam; p += .001) { const w = sampleStory(p).wipe; if (w > peak) { peak = w; at = p; } }
    assert.ok(peak > .99 && at <= seam - .1, `wipe into ${seam} peaks at ${at.toFixed(3)}`);
  }
});

test('dark haze covers every wipe and clears before the reading pauses', () => {
  for (const pose of samples) if (pose.incoming) assert.equal(pose.haze, 1, `no haze during the wipe at ${pose.index + pose.local}`);
  for (const p of [0, .3, 1.3, 2.3, 3.3, 4.3, 5]) assert.equal(sampleStory(p).haze, 0, `haze at ${p}`);
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

// Desktop frame as scene.js builds it (text column on the left: view offset −15% x, −3% y).
const frame = new THREE.PerspectiveCamera(30, 1440 / 900, .05, 80);
frame.setViewOffset(1440, 900, -216, -27, 1440, 900);
function shoot(pose) {
  frame.fov = pose.fov; frame.updateProjectionMatrix(); frame.position.fromArray(pose.camera);
  frame.lookAt(new THREE.Vector3().fromArray(pose.target)); frame.updateMatrixWorld();
  return frame;
}
function screenBox(pose, lo, hi) {
  const camera = shoot(pose), v = new THREE.Vector3();
  let x0 = Infinity, x1 = -Infinity;
  for (let i = 0; i < 8; i++) { v.set(i & 1 ? hi[0] : lo[0], i & 2 ? hi[1] : lo[1], i & 4 ? hi[2] : lo[2]).project(camera); x0 = Math.min(x0, (v.x + 1) / 2); x1 = Math.max(x1, (v.x + 1) / 2); }
  return {x0, x1, width: x1 - x0, centre: (x0 + x1) / 2};
}

// Round 2 racked to monitors that were 6–10% of the width and blurred the hero for nothing.
// Now the car is the sharp subject through the copy, the push-in makes the central monitor
// legible (35–40% of the width), and the focus only settles on it once it is that big.
test('Avaliar keeps the car sharp through the copy, pushes in to the central monitor, then racks to it', () => {
  const monitors = new THREE.Vector3(-4.72, 1.52, -1.35), car = new THREE.Vector3(0, .5, 0);
  const lo = [monitors.x, monitors.y - .32, monitors.z - .57], hi = [monitors.x, monitors.y + .32, monitors.z + .57];
  for (const p of [3, 3.1, 3.2, 3.3, 3.4, 3.45]) {
    const pose = sampleStory(p), eye = new THREE.Vector3().fromArray(pose.camera), focus = new THREE.Vector3().fromArray(pose.focus);
    assert.ok(focus.distanceTo(car) < 1.5, `focus left the car at ${p}`);
    assert.ok(Math.abs(eye.distanceTo(focus) - eye.distanceTo(car)) < pose.focusRange, `car outside the depth of field at ${p}`);
  }
  for (let p = 3.45; p <= 3.9; p += .01) {
    const pose = sampleStory(p);
    if (new THREE.Vector3().fromArray(pose.focus).distanceTo(monitors) < .01) {
      const m = screenBox(pose, lo, hi);
      assert.ok(m.width >= .3, `focus settles on a monitor only ${(m.width * 100).toFixed(0)}% wide at ${p.toFixed(2)}`);
    }
  }
  let held = 0;
  for (let p = 3.68; p <= 3.82; p += .01) {
    const pose = sampleStory(p), m = screenBox(pose, lo, hi);
    if (m.width >= .35 && m.width <= .4 && m.centre >= .45 && m.centre <= .65) held++;
  }
  assert.ok(held >= 6, `central monitor at 35–40% of the width for only ${held} of 15 samples`);
  const pose = sampleStory(3.74), eye = new THREE.Vector3().fromArray(pose.camera), e = carExtent(pose);
  assert.ok(new THREE.Vector3().fromArray(pose.focus).distanceTo(monitors) < .01, 'focus on the monitor at the peak');
  assert.ok(!e || e.min > 1 || e.max < 0 || Math.abs(eye.distanceTo(car) - eye.distanceTo(monitors)) > pose.focusRange, 'a car in frame at the peak must be out of focus');
});

// Round 2 "closes" cropped the whole car under the chapter dots. A close is one part, centred,
// sharp, with the rest of the car soft and never past 88% of the width (the dots column).
const HULL = JSON.parse(readFileSync(new URL('../tools/car-hull.json', import.meta.url), 'utf8')).parts;
const DELAY = {wheels: 0, aero: .12, suspension: .18, body: .24, cockpit: .3, details: .32};
const ease = (x, a, b) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
function partBox(indices, explode) {
  const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
  for (const i of indices) {
    const [category, box, dir] = HULL[i], t = ease(explode, DELAY[category], 1);
    for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], box[k] + dir[k] * t); hi[k] = Math.max(hi[k], box[k + 3] + dir[k] * t); }
  }
  return [lo, hi];
}
test('each text-free close centres one part at 45–65%, locks a short focus on it and keeps the car off the dots', () => {
  const closes = [[.72, [0, 1, 2, 3, 4, 5, 6, 7, 8], 'rear wing'], [1.64, [25], 'floor'], [2.7, [67, 69], 'rear wheel']];
  for (const [p, indices, name] of closes) {
    const pose = sampleStory(p), [lo, hi] = partBox(indices, pose.explode), s = screenBox(pose, lo, hi), e = carExtent(pose);
    assert.ok(s.centre >= .45 && s.centre <= .65, `${name} centred at ${(s.centre * 100).toFixed(0)}% at ${p}`);
    assert.ok(e && e.max <= .88, `${name} close lets the car reach ${(e?.max * 100).toFixed(0)}% at ${p}`);
    const eye = new THREE.Vector3().fromArray(pose.camera), centre = new THREE.Vector3(...lo.map((v, k) => (v + hi[k]) / 2));
    assert.ok(Math.abs(eye.distanceTo(new THREE.Vector3().fromArray(pose.focus)) - eye.distanceTo(centre)) < .5, `${name} is not the focal plane at ${p}`);
    assert.ok(pose.focusRange <= 1.6 && pose.bokeh >= .45, `${name} close keeps a deep focus (range ${pose.focusRange.toFixed(2)}, bokeh ${pose.bokeh.toFixed(2)})`);
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
