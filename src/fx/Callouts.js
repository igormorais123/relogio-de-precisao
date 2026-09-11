import * as THREE from 'three'

// Rótulo de peça com linha-guia (inspirado nas legendas "PNEUS", "ASA DIANTEIRA" do site F1):
// um por capítulo, sempre ancorado na peça real do relógio, projetado da cena para o DOM.
// A linha se desenha, o anel marca a peça e o nome entra em tipografia de display.
const ROTULOS = {
  0: { part: 'ponteiro-segundos', nome: 'Ponteiros', sub: 'parados: o sintoma' },
  1: { part: 'balanco', nome: 'Balanço', sub: 'a causa mora aqui' },
  2: { part: 'roda-escape', nome: 'Escape', sub: 'o ritmo do plano' },
  3: { part: 'coroa', nome: 'Coroa', sub: 'dar corda é executar' },
  4: { part: 'mostrador', nome: 'Mostrador', sub: 'desvio medido contra o padrão' },
  5: { part: 'balanco', nome: 'Espiral nova', sub: 'calibrada pelo desvio' },
}

export class Callouts {
  constructor(app, watch, scroll) {
    this.app = app; this.watch = watch; this.scroll = scroll
    this.chapter = -1; this.v = 0; this.shown = 0
    this.tmp = new THREE.Vector3()
    this.parts = {}
    for (const k in ROTULOS) this.parts[k] = watch.parts.find((p) => p.name === ROTULOS[k].part) || null

    const NS = 'http://www.w3.org/2000/svg'
    this.root = document.createElement('div')
    this.root.className = 'callout'
    this.root.setAttribute('aria-hidden', 'true')
    this.svg = document.createElementNS(NS, 'svg')
    this.svg.setAttribute('class', 'callout__svg')
    this.line = document.createElementNS(NS, 'line'); this.line.setAttribute('class', 'callout__line')
    this.ring = document.createElementNS(NS, 'circle'); this.ring.setAttribute('class', 'callout__ring'); this.ring.setAttribute('r', '7')
    this.dot = document.createElementNS(NS, 'circle'); this.dot.setAttribute('class', 'callout__dot'); this.dot.setAttribute('r', '2.2')
    this.svg.append(this.line, this.ring, this.dot)
    this.label = document.createElement('div'); this.label.className = 'callout__label'
    this.nome = document.createElement('b'); this.sub = document.createElement('span')
    this.label.append(this.nome, this.sub)
    this.root.append(this.svg, this.label)
    document.body.appendChild(this.root)
    this.root.style.opacity = '0'
  }

  // set(capítulo, visibilidade 0..1); o Director chama todo quadro. -1 esconde.
  set(chapter, v = 0) {
    if (chapter < 0 || v <= 0.001 || !this.parts[chapter]) { this.v = 0; return }
    if (chapter !== this.chapter) {
      this.chapter = chapter
      this.nome.textContent = ROTULOS[chapter].nome
      this.sub.textContent = ROTULOS[chapter].sub
    }
    this.v = Math.min(1, v)
  }

  update(dt) {
    this.shown += (this.v - this.shown) * (1 - Math.pow(0.003, dt))
    if (this.shown < 0.01) { if (this.root.style.opacity !== '0') this.root.style.opacity = '0'; return }
    const part = this.parts[this.chapter]
    if (!part) return
    part.getWorldPosition(this.tmp).project(this.app.camera)
    if (this.tmp.z > 1) { this.root.style.opacity = '0'; return }
    const W = innerWidth, H = innerHeight
    const px = (this.tmp.x * 0.5 + 0.5) * W, py = (-this.tmp.y * 0.5 + 0.5) * H
    // Fora de quadro (peças espalhadas), some em vez de grudar na borda.
    const margem = 1 - THREE.MathUtils.smoothstep(Math.max(Math.abs(this.tmp.x), Math.abs(this.tmp.y)), 0.82, 0.96)
    const s = THREE.MathUtils.smoothstep(this.shown, 0, 1) * margem
    this.root.style.opacity = s.toFixed(3)
    // Rótulo fora do objeto, como no F1: acima da borda projetada do relógio (ou 90 px acima da peça,
    // o que ficar mais alto), deslocado para a esquerda; nunca sob o HUD nem sob os pontos de capítulo.
    const p = this.app.isPortrait
    if (p && this.chapter === 4) { this.root.style.opacity = '0'; return } // em retrato o padrão atômico ocupa esse espaço
    const g = this.watch.group
    g.getWorldPosition(this.c1 || (this.c1 = new THREE.Vector3()))
    const R = 1.75 * g.scale.x
    this.c2 = this.c2 || new THREE.Vector3()
    this.c2.copy(this.c1).addScaledVector(this.app.camera.up, R)
    this.c1.project(this.app.camera); this.c2.project(this.app.camera)
    const topo = (-this.c2.y * 0.5 + 0.5) * H
    const espalhado = this.watch.state.scatter > 0.3
    const alvoY = espalhado ? py - 96 : Math.min(py - 96, topo - 30)
    const lx = px + (p ? 0 : -70) * (0.4 + 0.6 * s)
    const ly = Math.max(p ? 88 : 96, alvoY + (1 - s) * 24)
    this.line.setAttribute('x1', px.toFixed(1)); this.line.setAttribute('y1', py.toFixed(1))
    this.line.setAttribute('x2', lx.toFixed(1)); this.line.setAttribute('y2', ly.toFixed(1))
    this.ring.setAttribute('cx', px.toFixed(1)); this.ring.setAttribute('cy', py.toFixed(1))
    this.ring.setAttribute('r', (5 + 4 * s).toFixed(1))
    this.dot.setAttribute('cx', px.toFixed(1)); this.dot.setAttribute('cy', py.toFixed(1))
    const meia = this.label.offsetWidth / 2 || 80
    const x = THREE.MathUtils.clamp(lx, meia + 12, W - meia - (p ? 40 : 90))
    this.label.style.transform = `translate(-50%, -100%) translate(${x.toFixed(1)}px, ${(ly - 8 + (1 - s) * 10).toFixed(1)}px)`
  }
}
