import test from 'node:test'
import assert from 'node:assert/strict'
import { stitchBounds, resolveChapter } from '../src/core/Scroll.js'

const raw = [
  [0, 0.2],
  [0.18, 0.4],
  [0.38, 0.55],
  [0.55, 0.7],
  [0.7, 0.85],
  [0.85, 0.98],
]

test('stitchBounds fecha buracos e termina em 1', () => {
  const bounds = stitchBounds(raw)
  assert.equal(bounds.length, 6)
  assert.equal(bounds[0][0], 0)
  assert.equal(bounds[5][1], 1)
  for (let i = 0; i < 5; i++) assert.equal(bounds[i][1], bounds[i + 1][0])
})

test('resolveChapter mapeia progresso para capítulo e local', () => {
  const bounds = stitchBounds(raw)
  assert.equal(resolveChapter(0, bounds).chapter, 0)
  assert.equal(resolveChapter(0, bounds).local, 0)
  assert.equal(resolveChapter(1, bounds).chapter, 5)
  assert.equal(resolveChapter(1, bounds).local, 1)
  const mid = resolveChapter((bounds[2][0] + bounds[2][1]) / 2, bounds)
  assert.equal(mid.chapter, 2)
  assert.ok(Math.abs(mid.local - 0.5) < 1e-9)
})

test('resolveChapter satura fora de 0..1', () => {
  const bounds = stitchBounds(raw)
  assert.equal(resolveChapter(-0.2, bounds).chapter, 0)
  assert.equal(resolveChapter(1.4, bounds).chapter, 5)
})
