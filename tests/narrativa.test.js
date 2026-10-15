import test from 'node:test'
import assert from 'node:assert/strict'
import { CAPITULOS, N } from '../src/data/narrativa.js'
import { PAGINAS } from '../src/data/paginas.js'

test('seis capítulos com f1, essência e lições', () => {
  assert.equal(N, 6)
  assert.equal(CAPITULOS.length, 6)
  for (const c of CAPITULOS) {
    assert.ok(c.id && c.slug && c.nome && c.titulo && c.corpo)
    assert.ok(c.essencia)
    assert.ok(Array.isArray(c.licoes) && c.licoes.length >= 3)
    assert.ok(c.f1?.termo && c.f1?.texto)
  }
})

test('cenários de avaliação e páginas de aprofundamento existem', () => {
  const cen = CAPITULOS[4].cenarios
  for (const nome of ['frio', 'calor', 'impacto', 'posicao']) {
    assert.equal(typeof cen[nome].desvio, 'number')
    assert.ok(cen[nome].texto)
    assert.equal(cen[nome].descricao, undefined)
  }
  assert.ok(PAGINAS.loop.imagem.endsWith('.jpg'))
  assert.equal(PAGINAS.grafo.imagem, 'pagina-grafo-final.png')
})
