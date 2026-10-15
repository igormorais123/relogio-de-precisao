import test from 'node:test'
import assert from 'node:assert/strict'
import { detectWebGL } from '../src/core/webgl.js'

test('detectWebGL aceita WebGL1 quando WebGL2 falta', () => {
  assert.equal(detectWebGL((type) => type === 'webgl' ? {} : null), true)
})

test('detectWebGL prefere WebGL2', () => {
  const seen = []
  assert.equal(detectWebGL((type) => { seen.push(type); return type === 'webgl2' ? {} : null }), true)
  assert.deepEqual(seen, ['webgl2'])
})

test('detectWebGL recusa quando nenhum contexto existe', () => {
  assert.equal(detectWebGL(() => null), false)
})

test('detectWebGL trata exceção como ausência', () => {
  assert.equal(detectWebGL(() => { throw new Error('blocked') }), false)
})
