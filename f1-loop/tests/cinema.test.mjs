import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleStory } from '../src/story.js';

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
