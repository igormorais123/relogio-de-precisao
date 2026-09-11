import * as THREE from 'three'
import { registro } from '../core/Registro.js'
import { CAPITULOS } from '../data/narrativa.js'

// Hotspots em anel (capítulos Pesquisa e Planejamento).
// Cada hotspot é uma instância de um quad billboard desenhado só no shader: anel externo fino que gira,
// anel interno que pulsa, ponto central e uma sequência de 24 quadros ("flipbook") de um ícone de sinal,
// gerada uma única vez num atlas 2D no construtor. Tudo num único draw call (InstancedBufferGeometry).
// O texto vai para o DOM `#tooltip`, que já existe no index.html.

const MAX = 4
const GRID_C = 6, GRID_R = 4, FRAMES = GRID_C * GRID_R, CELL = 128

// Quais peças do relógio ancoram cada hotspot, na mesma ordem de CAPITULOS[i].hotspots.
const ANCORAS = {
  1: ['ponteiro-segundos', 'balanco', 'caixa', 'coroa'],
  2: ['tambor-da-mola', 'roda-escape', 'balanco', 'roda-central'],
}

const vert = /* glsl */`
attribute vec3 aPos;
attribute float aAlpha;
attribute float aScale;
attribute float aHover;
attribute float aSeed;
varying vec2 vUv; varying float vAlpha; varying float vHover; varying float vSeed;
void main(){
  vUv = uv; vAlpha = aAlpha; vHover = aHover; vSeed = aSeed;
  vec4 mv = modelViewMatrix * vec4(aPos, 1.0);
  // Billboard: o quad cresce no plano da câmera, então o anel nunca aparece de perfil.
  mv.xy += position.xy * (aScale * (1.0 + aHover * 0.16));
  gl_Position = projectionMatrix * mv;
}
`

const frag = /* glsl */`
precision highp float;
uniform vec3 uColor; uniform float uTime; uniform float uFrame; uniform sampler2D uAtlas;
varying vec2 vUv; varying float vAlpha; varying float vHover; varying float vSeed;

float band(float d, float r, float w){ return 1.0 - smoothstep(0.0, w, abs(d - r)); }

void main(){
  if (vAlpha < 0.004) discard;
  vec2 p = vUv - 0.5;
  float d = length(p);
  float ang = atan(p.y, p.x);

  // Anel externo fino, com três lóbulos que giram devagar.
  float rot = uTime * 0.55 + vSeed * 6.2831;
  float lobe = smoothstep(0.08, 0.55, abs(sin((ang - rot) * 1.5)));
  float outer = band(d, 0.395 + vHover * 0.045, 0.014) * (0.30 + 0.70 * lobe);

  // Anel interno pulsante.
  float pulse = 0.5 + 0.5 * sin(uTime * 2.1 + vSeed * 3.7);
  float inner = band(d, 0.215 + pulse * 0.045, 0.020) * (0.50 + 0.50 * pulse);

  // Ponto central.
  float core = (1.0 - smoothstep(0.018, 0.058, d));

  // Flipbook: quadro atual do atlas de ícone de sinal, com defasagem por hotspot.
  float fi = floor(mod(uFrame + vSeed * 11.0, ${FRAMES}.0));
  vec2 cell = vec2(mod(fi, ${GRID_C}.0), floor(fi / ${GRID_C}.0));
  vec2 fuv = vec2(vUv.x, 1.0 - vUv.y);
  float ico = texture2D(uAtlas, (fuv + cell) / vec2(${GRID_C}.0, ${GRID_R}.0)).a;

  // Arco de seleção quando o ponteiro está em cima.
  float halo = band(d, 0.465, 0.012) * vHover;

  float m = outer * 0.95 + inner * 0.85 + core * 1.35 + ico * (0.45 + 0.35 * vHover) + halo * 0.9;
  float a = m * vAlpha;
  if (a < 0.004) discard;
  gl_FragColor = vec4(uColor * (1.15 + 0.60 * core + 0.45 * vHover), a);
}
`

export class Hotspots {
  constructor(app, watch, scroll) {
    this.app = app; this.watch = watch; this.scroll = scroll

    this.chapter = -1
    this.visibility = 0
    this.items = []            // { nome, texto, part }
    this.hover = new Float32Array(MAX)
    this.screen = new Float32Array(MAX * 3)   // x, y, válido
    this.active = -1
    this.pinned = -1
    this.cursorOn = false
    this._tmp = new THREE.Vector3()
    this._ndc = new THREE.Vector3()
    this._frame = 0

    // Caches dos dois capítulos: resolve as peças uma única vez.
    this.sets = {}
    for (const k of [1, 2]) {
      const dados = CAPITULOS[k]?.hotspots || []
      const nomes = ANCORAS[k] || []
      this.sets[k] = {
        color: new THREE.Color(CAPITULOS[k]?.acento ?? 0xd3a94f),
        items: dados.map((h, i) => ({
          nome: h.nome,
          texto: h.texto,
          part: watch.parts.find((p) => p.name === nomes[i]) || null,
        })).filter((h) => h.part),
      }
    }

    // Geometria instanciada: um quad para todos os anéis.
    const base = new THREE.PlaneGeometry(1, 1)
    const geo = new THREE.InstancedBufferGeometry()
    geo.index = base.index
    geo.attributes.position = base.attributes.position
    geo.attributes.uv = base.attributes.uv
    geo.instanceCount = 0
    this.aPos = new THREE.InstancedBufferAttribute(new Float32Array(MAX * 3), 3)
    this.aAlpha = new THREE.InstancedBufferAttribute(new Float32Array(MAX), 1)
    this.aScale = new THREE.InstancedBufferAttribute(new Float32Array(MAX), 1)
    this.aHover = new THREE.InstancedBufferAttribute(new Float32Array(MAX), 1)
    const seeds = new Float32Array(MAX)
    for (let i = 0; i < MAX; i++) seeds[i] = i * 0.27
    geo.setAttribute('aPos', this.aPos)
    geo.setAttribute('aAlpha', this.aAlpha)
    geo.setAttribute('aScale', this.aScale)
    geo.setAttribute('aHover', this.aHover)
    geo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1))
    this.geo = geo

    this.atlas = this._buildAtlas()
    this.uniforms = {
      uColor: { value: new THREE.Color(0xd3a94f) },
      uTime: { value: 0 },
      uFrame: { value: 0 },
      uAtlas: { value: this.atlas },
    }
    const mat = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: this.uniforms,
      transparent: true,
      // Grava profundidade (sem testá-la) só para o DOF saber que o anel está no plano das peças:
      // sem isso o desfoque usa o depth do fundo e os anéis saem lamacentos no capítulo 2.
      depthWrite: true,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
      side: THREE.DoubleSide,
    })
    this.mesh = new THREE.Mesh(geo, mat)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = 20
    this.mesh.visible = false
    app.scene.add(this.mesh)

    this.tooltip = document.getElementById('tooltip')

    // Toque: tocar perto de um hotspot alterna o tooltip daquele hotspot.
    this._onPointerDown = (e) => {
      if (e.pointerType !== 'touch' && e.pointerType !== 'pen') return
      const i = this._nearest(e.clientX, e.clientY)
      this.pinned = i === this.pinned ? -1 : i
    }
    addEventListener('pointerdown', this._onPointerDown, { passive: true })
  }

  // Atlas 24 quadros de um ícone de "sinal": dois arcos opostos que crescem e somem.
  // Canvas 2D só no construtor — nenhuma textura externa, nenhum trabalho por quadro.
  _buildAtlas() {
    const cv = document.createElement('canvas')
    cv.width = GRID_C * CELL; cv.height = GRID_R * CELL
    const g = cv.getContext('2d')
    g.lineCap = 'round'
    for (let f = 0; f < FRAMES; f++) {
      const cx = (f % GRID_C) * CELL + CELL / 2
      const cy = Math.floor(f / GRID_C) * CELL + CELL / 2
      for (let k = 0; k < 2; k++) {
        const ph = ((f / FRAMES) + k * 0.5) % 1
        const r = CELL * (0.15 + ph * 0.30)
        const a = Math.sin(Math.PI * Math.min(1, ph * 1.2)) * (1 - ph * 0.55)
        if (a <= 0.015) continue
        g.strokeStyle = `rgba(255,255,255,${a.toFixed(3)})`
        g.lineWidth = Math.max(1, CELL * 0.05 * (1 - ph * 0.55))
        const sweep = Math.PI * 0.34
        g.beginPath(); g.arc(cx, cy, r, -sweep, sweep); g.stroke()
        g.beginPath(); g.arc(cx, cy, r, Math.PI - sweep, Math.PI + sweep); g.stroke()
      }
    }
    const tex = new THREE.CanvasTexture(cv)
    tex.flipY = false
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.generateMipmaps = false
    tex.colorSpace = THREE.NoColorSpace
    return tex
  }

  // Índice do hotspot visível mais próximo de um ponto em pixels de tela, ou -1.
  // `solto` amplia o raio para o hotspot já ativo: o parallax do relógio move a peça quando o
  // ponteiro anda, e sem essa histerese o anel fugiria do cursor.
  _nearest(px, py, solto = -1) {
    if (this.visibility <= 0.05) return -1
    const raio = this.app.isMobile ? 54 : 46
    let melhor = -1, dist = raio * raio
    if (solto >= 0 && solto < this.items.length && this.screen[solto * 3 + 2] > 0.5 && this.aAlpha.array[solto] >= 0.25) {
      const dx = this.screen[solto * 3] - px, dy = this.screen[solto * 3 + 1] - py
      if (dx * dx + dy * dy < (raio * 2.8) ** 2) return solto
    }
    for (let i = 0; i < this.items.length; i++) {
      if (this.screen[i * 3 + 2] < 0.5 || this.aAlpha.array[i] < 0.25) continue
      const dx = this.screen[i * 3] - px, dy = this.screen[i * 3 + 1] - py
      const d = dx * dx + dy * dy
      if (d < dist) { dist = d; melhor = i }
    }
    return melhor
  }

  // Chamado todo quadro pelo Director. i = -1 esconde tudo.
  setChapter(chapterIndex, visibility = 0) {
    const set = this.sets[chapterIndex]
    // O Director chama setChapter(-1) todo quadro antes do switch; só zera a visibilidade,
    // sem descartar o capítulo corrente (senão o estado de toque se perderia a cada quadro).
    if (!set || visibility <= 0.001) {
      this.visibility = 0
      return
    }
    if (this.chapter !== chapterIndex) {
      this.chapter = chapterIndex
      this.items = set.items
      this.uniforms.uColor.value.copy(set.color)
      this.pinned = -1
      this.hover.fill(0)
    }
    this.visibility = Math.min(1, visibility)
  }

  update(dt, t) {
    const n = this.items.length
    const ativo = this.visibility > 0.001 && n > 0
    this.mesh.visible = ativo
    this.geo.instanceCount = ativo ? n : 0
    if (!ativo) {
      this._hideTooltip()
      this._setCursor(false)
      this.active = -1
      return
    }

    this.uniforms.uTime.value = t
    this._frame = (this._frame + dt * 18) % FRAMES
    this.uniforms.uFrame.value = this._frame

    const cam = this.app.camera
    cam.updateMatrixWorld()
    const W = innerWidth, H = innerHeight
    const escalaBase = this.app.isPortrait ? 0.90 : 0.72
    const offsetY = this.app.isPortrait ? 0.34 : 0.28
    const pos = this.aPos.array, alpha = this.aAlpha.array, scale = this.aScale.array

    for (let i = 0; i < n; i++) {
      // Escalonamento: cada hotspot entra um pouco depois do anterior.
      const v = THREE.MathUtils.clamp((this.visibility - i * 0.13) / 0.62, 0, 1)
      const e = THREE.MathUtils.smoothstep(v, 0, 1)

      this.items[i].part.getWorldPosition(this._tmp)
      this._tmp.y += offsetY
      pos[i * 3] = this._tmp.x; pos[i * 3 + 1] = this._tmp.y; pos[i * 3 + 2] = this._tmp.z

      this._ndc.copy(this._tmp).project(cam)
      // Peças espalhadas (capítulo 1) podem sair de quadro: apaga o anel na margem em vez de
      // deixá-lo colado na borda, e nesse caso ele também deixa de responder ao ponteiro.
      const margem = this._ndc.z < 1
        ? 1 - THREE.MathUtils.smoothstep(Math.max(Math.abs(this._ndc.x), Math.abs(this._ndc.y)), 0.80, 0.94)
        : 0
      alpha[i] = e * margem
      scale[i] = escalaBase * (0.6 + 0.4 * e)
      this.screen[i * 3] = (this._ndc.x * 0.5 + 0.5) * W
      this.screen[i * 3 + 1] = (-this._ndc.y * 0.5 + 0.5) * H
      this.screen[i * 3 + 2] = margem > 0.5 ? 1 : 0
    }

    // Hover: em ponteiro fino, proximidade em espaço de tela; em toque, o hotspot fixado.
    let alvo = -1
    if (this.pinned >= 0 && this.pinned < n) {
      alvo = this.screen[this.pinned * 3 + 2] > 0.5 ? this.pinned : (this.pinned = -1)
    } else if (!this.app.isMobile) {
      const p = this.app.pointer
      alvo = this._nearest((p.x * 0.5 + 0.5) * W, (-p.y * 0.5 + 0.5) * H, this.active)
    }

    const k = 1 - Math.pow(0.002, dt)
    for (let i = 0; i < n; i++) {
      this.hover[i] += ((i === alvo ? 1 : 0) - this.hover[i]) * k
      this.aHover.array[i] = this.hover[i]
    }

    this.aPos.needsUpdate = true
    this.aAlpha.needsUpdate = true
    this.aScale.needsUpdate = true
    this.aHover.needsUpdate = true

    if (alvo !== this.active) {
      this.active = alvo
      if (alvo < 0) this._hideTooltip()
      else { this._showTooltip(this.items[alvo]); const it = this.items[alvo]; registro.registrar(this.scroll?.chapter ?? 1, it.nome, it.texto, (this.scroll?.chapter ?? 1) === 2 ? 'decisao' : 'evidencia') }
      this._setCursor(alvo >= 0 && !this.app.isMobile)
    }
    if (alvo >= 0 && this.tooltip) {
      // Mantém o balão colado no hotspot; vira para a esquerda perto da borda direita.
      const x = THREE.MathUtils.clamp(this.screen[alvo * 3], 16, W - 16)
      const y = THREE.MathUtils.clamp(this.screen[alvo * 3 + 1], 76, H - 76)
      // Usa `right` no lado esquerdo: com `left` fixo o balão seria espremido pela borda da viewport
      // antes do transform, e o texto sairia em coluna de uma palavra no telefone.
      const esquerda = x > W - 300
      this.tooltip.style.top = `${Math.round(y)}px`
      if (esquerda) {
        this.tooltip.style.left = 'auto'
        this.tooltip.style.right = `${Math.round(W - x)}px`
        this.tooltip.style.transform = 'translate(-46px, -50%)'
      } else {
        this.tooltip.style.right = 'auto'
        this.tooltip.style.left = `${Math.round(x)}px`
        this.tooltip.style.transform = 'translate(46px, -50%)'
      }
    }
  }

  _showTooltip(item) {
    if (!this.tooltip) return
    this.tooltip.innerHTML = `<b>${item.nome}</b>${item.texto}`
    this.tooltip.hidden = false
  }

  _hideTooltip() {
    if (this.tooltip && !this.tooltip.hidden) this.tooltip.hidden = true
  }

  _setCursor(on) {
    if (on === this.cursorOn) return
    this.cursorOn = on
    document.body.style.cursor = on ? 'pointer' : ''
  }

  dispose() {
    removeEventListener('pointerdown', this._onPointerDown)
    this.mesh.parent?.remove(this.mesh)
    this.geo.dispose(); this.mesh.material.dispose(); this.atlas.dispose()
  }
}
