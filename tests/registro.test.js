import test from 'node:test'
import assert from 'node:assert/strict'
import { criarRegistro, FASES } from '../src/core/Registro.js'

function memoria() {
  const data = new Map()
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => { data.set(k, String(v)) },
    _data: data,
  }
}

test('registro persiste, deduplica imediato e limpa', () => {
  const store = memoria()
  const r = criarRegistro(store)
  const a = r.registrar(0, 'Nomeou o problema', 'atraso', 'evidencia')
  const dup = r.registrar(0, 'Nomeou o problema', 'atraso', 'evidencia')
  const b = r.registrar(4, 'Cenário frio', '+3,2 s/dia', 'resultado')
  assert.equal(dup, a)
  assert.equal(r.lista().length, 2)
  assert.equal(b.fase, FASES[4])
  assert.equal(JSON.parse(store.getItem('relogio-de-precisao:registro')).length, 2)
  r.limpar()
  assert.deepEqual(r.lista(), [])
  assert.equal(store.getItem('relogio-de-precisao:registro'), '[]')
})

test('registro sem storage fica só em memória', () => {
  const r = criarRegistro(null)
  r.registrar(5, 'Ciclo percorrido', '', 'decisao')
  assert.equal(r.lista().length, 1)
  assert.equal(r.lista()[0].fase, 'Aprendizado')
})
