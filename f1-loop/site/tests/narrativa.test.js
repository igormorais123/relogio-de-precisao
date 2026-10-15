import test from 'node:test'
import assert from 'node:assert/strict'
import { CAPITULOS, N, BLOCOS, PAGINAS } from '../src/data/narrativa.js'

const BLOCO_SET = new Set(BLOCOS)

test('sete capítulos com id, bloco do loop e fato F1', () => {
  assert.equal(N, 7)
  assert.equal(CAPITULOS.length, 7)
  const ids = new Set()
  const blocosVistos = new Set()
  for (const c of CAPITULOS) {
    assert.ok(c.id && c.slug && c.nome && c.titulo && c.corpo, `campos básicos em ${c.id}`)
    assert.ok(!ids.has(c.id), `id duplicado: ${c.id}`)
    ids.add(c.id)
    assert.ok(BLOCO_SET.has(c.bloco), `bloco inválido em ${c.id}: ${c.bloco}`)
    blocosVistos.add(c.bloco)
    assert.ok(c.essencia)
    assert.ok(Array.isArray(c.licoes) && c.licoes.length === 3)
    assert.ok(c.f1?.termo && c.f1?.texto && c.f1?.fonte)
    assert.ok(c.titulo.split('\n').length >= 2 && c.titulo.split('\n').length <= 3)
    assert.ok(c.corpo.length <= 72, `corpo longo em ${c.id}: ${c.corpo.length}`)
  }
  for (const bloco of BLOCOS) assert.ok(blocosVistos.has(bloco), `falta bloco ${bloco}`)
})

test('os quatro blocos do loop aparecem na ordem pedagógica', () => {
  assert.deepEqual(CAPITULOS.map((c) => c.bloco), [
    'preparar', 'preparar', 'uma-volta', 'uma-volta', 'controlar', 'controlar', 'encerrar',
  ])
})

test('lições não se repetem entre capítulos', () => {
  const termos = CAPITULOS.flatMap((c) => c.licoes.map((l) => l.termo))
  assert.equal(new Set(termos).size, termos.length)
})

test('aprofundamentos e cenários existem', () => {
  assert.equal(CAPITULOS[4].aprofundamento, 'verificador')
  assert.equal(CAPITULOS[6].aprofundamento, 'dossie')
  assert.ok(PAGINAS.verificador.secoes.length === 4)
  assert.ok(PAGINAS.dossie.secoes.length === 4)
  for (const nome of ['cfd', 'tunel', 'pista', 'piso']) {
    assert.equal(typeof CAPITULOS[4].cenarios[nome].desvio, 'number')
    assert.ok(CAPITULOS[4].cenarios[nome].texto)
  }
})
