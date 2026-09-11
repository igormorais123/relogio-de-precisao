import test from 'node:test'
import assert from 'node:assert/strict'
import { sampleCameraPose } from '../src/core/cameraPath.js'

const numbers = (pose) => Object.values(pose).flat()
for (const portrait of [false, true]) {
  test(`poses finite and safe throughout the complete ${portrait ? 'portrait' : 'landscape'} path`, () => {
    for (let ch = 0; ch < 6; ch++) for (let step = 0; step <= 1000; step++) {
      const value = sampleCameraPose(ch, step / 1000, { portrait })
      assert(numbers(value).every(Number.isFinite))
      assert(value.camera[2] >= 6.4 - 1e-9 && value.camera[2] <= 7.82 + 1e-9)
      assert(Math.abs(value.camera[0]) <= 1.2)
    }
  })
  test(`chapter boundaries stay continuous in ${portrait ? 'portrait' : 'landscape'}`, () => {
    for (let ch = 1; ch < 6; ch++) {
      const end = sampleCameraPose(ch - 1, 1, { portrait })
      const start = sampleCameraPose(ch, 0, { portrait })
      assert.deepEqual(start, end)
      const near = numbers(sampleCameraPose(ch, 0.00001, { portrait }))
      numbers(end).forEach((v, i) => assert(Math.abs(v - near[i]) < 0.00001))
    }
  })
}
test('reduced motion keeps camera and target stationary across every chapter', () => {
  for (let ch = 0; ch < 6; ch++) for (let step = 0; step <= 100; step++) {
    const value = sampleCameraPose(ch, step / 100, { reduced: true })
    assert.deepEqual(value.camera, [0, 0.2, 7.3])
    assert.deepEqual(value.target, [0, 0, 0])
    assert.equal(value.rotation, 0)
  }
})
test('reading pauses do not continue to orbit and reversing scroll retraces the same pose', () => {
  for (const ch of [0, 1, 2, 4]) {
    assert.deepEqual(sampleCameraPose(ch, 0.5), sampleCameraPose(ch, 0.7))
  }
  const before = sampleCameraPose(3, 0.4)
  sampleCameraPose(4, 0.7)
  assert.deepEqual(sampleCameraPose(3, 0.4), before)
})


test('desktop alternates sides while portrait preserves the top text layout', () => {
  for (let ch = 0; ch < 6; ch++) {
    assert.equal(sampleCameraPose(ch, 0.26).side, ch % 2 ? -1 : 1)
    assert.equal(sampleCameraPose(ch, 0.26, { portrait: true }).side, 1)
  }
})
test('horizontal crossing is continuous, reversible and stationary while reading', () => {
  for (let ch = 1; ch < 6; ch++) {
    const path = Array.from({ length: 181 }, (_, i) => sampleCameraPose(ch, i / 1000))
    assert.equal(path[0].side, ch % 2 ? 1 : -1)
    assert.equal(path.at(-1).side, ch % 2 ? -1 : 1)
    for (let i = 1; i < path.length; i++) assert(Math.abs(path[i].side - path[i - 1].side) < 0.017)
    assert(Math.abs(path[90].side) < 1e-9)
    assert.equal(sampleCameraPose(ch, 0.3).side, sampleCameraPose(ch, 0.8).side)
    assert.deepEqual(path[40], sampleCameraPose(ch, 0.04))
  }
})
