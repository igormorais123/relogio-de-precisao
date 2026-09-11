import * as THREE from 'three'

// Capítulo 3 — dar corda. Faíscas douradas curtas saltam da coroa enquanto `wind` sobe,
// e um anel de luz de 0,4 s dispara no centro quando o relógio passa a funcionar.

const vert = /* glsl */`
attribute vec3 aVel;
attribute float aLife;   // vida restante, em segundos
attribute float aMax;    // vida total
attribute float aSize;
uniform float uPixelRatio;
varying float vA;
varying float vHeat;
void main(){
  float k = clamp(aLife / max(aMax, 0.0001), 0.0, 1.0);
  vHeat = k;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float depth = max(-mv.z, 0.2);
  // Faísca encolhe e some ao esfriar; tamanho por profundidade.
  // depthWrite fica desligado (regra do projeto), então o DOF trata cada ponto como fundo e o
  // espalha. Compensa-se com brilho alto: o resultado lê como cintilação, não como borrão morto.
  gl_PointSize = aSize * uPixelRatio * (16.0 / depth) * (0.42 + 0.58 * k);
  vA = smoothstep(0.0, 0.22, k) * (1.5 + 1.1 * k);
  if (aLife <= 0.0) { vA = 0.0; gl_PointSize = 0.0; }
  gl_Position = projectionMatrix * mv;
}
`

const frag = /* glsl */`
precision highp float;
uniform vec3 uHot; uniform vec3 uCold;
varying float vA; varying float vHeat;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float core = (1.0 - smoothstep(0.06, 0.5, d));
  float a = core * core * vA;
  if (a < 0.01) discard;
  gl_FragColor = vec4(mix(uCold, uHot, vHeat * vHeat), a);
}
`

const ringVert = /* glsl */`
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`

const ringFrag = /* glsl */`
precision highp float;
uniform float uT;        // 0..1 ao longo dos 0,4 s
uniform vec3 uColor;
varying vec2 vUv;
void main(){
  float r = length(vUv - 0.5) * 2.0;
  float raio = 0.10 + uT * 0.82;
  float esp = 0.03 + uT * 0.07;
  float anel = 1.0 - smoothstep(0.0, esp, abs(r - raio));
  float a = anel * (1.0 - uT) * (1.0 - uT) * 0.85;
  if (a < 0.01) discard;
  gl_FragColor = vec4(uColor, a);
}
`

export class Sparks {
  constructor(app, watch, scroll) {
    this.app = app; this.watch = watch; this.scroll = scroll
    this.v = 0
    this.prev = 0
    this.acc = 0
    this.cursor = 0
    this.ringT = -1
    this.runPrev = 0
    this.spinPrev = 0
    this.origem = new THREE.Vector3()
    this.count = app.isMobile ? 60 : 120

    const n = this.count
    this.pos = new Float32Array(n * 3)
    this.vel = new Float32Array(n * 3)
    this.life = new Float32Array(n)
    this.max = new Float32Array(n)
    this.size = new Float32Array(n)
    for (let i = 0; i < n; i++) { this.size[i] = 2.2 + Math.random() * 3.4; this.max[i] = 1 }

    const geo = new THREE.BufferGeometry()
    this.aPos = new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage)
    this.aVel = new THREE.BufferAttribute(this.vel, 3).setUsage(THREE.DynamicDrawUsage)
    this.aLife = new THREE.BufferAttribute(this.life, 1).setUsage(THREE.DynamicDrawUsage)
    geo.setAttribute('position', this.aPos)
    geo.setAttribute('aVel', this.aVel)
    geo.setAttribute('aLife', this.aLife)
    this.aMax = new THREE.BufferAttribute(this.max, 1).setUsage(THREE.DynamicDrawUsage)
    geo.setAttribute('aMax', this.aMax)
    geo.setAttribute('aSize', new THREE.BufferAttribute(this.size, 1))

    this.uniforms = {
      uPixelRatio: { value: 1 },
      uHot: { value: new THREE.Color(0xfff0c0) },
      uCold: { value: new THREE.Color(0xd07a1c) },
    }
    const mat = new THREE.ShaderMaterial({
      vertexShader: vert, fragmentShader: frag, uniforms: this.uniforms,
      // Faísca é luz: passa por cima do bisel dourado em vez de ser ocultada por ele.
      transparent: true, depthWrite: false, depthTest: false,
      blending: THREE.AdditiveBlending, toneMapped: false,
    })
    this.points = new THREE.Points(geo, mat)
    this.points.frustumCulled = false
    this.points.visible = false
    this.points.renderOrder = 8
    app.scene.add(this.points)

    this.ringUniforms = { uT: { value: 0 }, uColor: { value: new THREE.Color(0xffd48a) } }
    this.ring = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 2.6),
      new THREE.ShaderMaterial({
        vertexShader: ringVert, fragmentShader: ringFrag, uniforms: this.ringUniforms,
        transparent: true, depthWrite: false, depthTest: false,
        blending: THREE.AdditiveBlending, toneMapped: false,
      }),
    )
    this.ring.frustumCulled = false
    this.ring.visible = false
    this.ring.renderOrder = 7
    app.scene.add(this.ring)
  }

  set(v) { this.v = THREE.MathUtils.clamp(v, 0, 1) }

  _emitir(qtd) {
    const n = this.count
    for (let k = 0; k < qtd; k++) {
      const i = this.cursor % n
      this.cursor++
      const j = i * 3
      this.pos[j] = this.origem.x + (Math.random() - 0.5) * 0.05
      this.pos[j + 1] = this.origem.y + (Math.random() - 0.5) * 0.05
      this.pos[j + 2] = this.origem.z + (Math.random() - 0.5) * 0.05
      // Leque curto em torno da vertical: a coroa fica na borda do quadro e um jato horizontal
      // levaria as faíscas para fora da tela antes de serem vistas.
      // Leque largo para cima: a coroa é dourada e brilhante, faísca sobre ela não lê. O jato
      // precisa alcançar o mostrador escuro à esquerda e o fundo à direita.
      const a = Math.PI * 0.5 + (Math.random() - 0.5) * 2.4
      const b = (Math.random() - 0.5) * 1.6
      const s = 0.5 + Math.random() * 1.1
      this.vel[j] = Math.cos(a) * s
      this.vel[j + 1] = Math.sin(a) * s + 0.3
      this.vel[j + 2] = Math.sin(b) * s * 0.35
      this.max[i] = 0.45 + Math.random() * 0.45
      this.life[i] = this.max[i]
    }
  }

  update(dt, t) {
    const st = this.watch.state
    this.uniforms.uPixelRatio.value = this.app.dpr || 1
    // O Director só chama set() no capítulo 3; fora dele o valor ficaria preso.
    const cap3 = !this.scroll || this.scroll.chapter === 3
    const cur = cap3 ? Math.max(this.v, st.wind || 0) : 0
    const dv = Math.max(0, cur - this.prev)
    this.prev = cur

    // Giro manual da coroa (CrownDrag roda depois deste update, então a variação chega no quadro seguinte).
    const spin = st.spinCrown || 0
    const dspin = Math.min(0.6, Math.abs(spin - this.spinPrev))
    this.spinPrev = spin

    if (this.watch.crown) this.watch.crown.getWorldPosition(this.origem)

    // Emissão: fluxo contínuo proporcional à corda + rajada na derivada + rajada no giro da coroa.
    const m = this.app.isMobile ? 0.55 : 1
    const ativo = (cur > 0.01 || (cap3 && dspin > 0.0004)) && st.running < 0.995
    if (ativo) {
      this.acc += cur * 70 * m * dt + dv * 300 * m + dspin * 30 * m
      const qtd = Math.min(Math.floor(this.acc), this.count)
      if (qtd > 0) { this._emitir(qtd); this.acc -= qtd }
    } else {
      this.acc = 0
    }

    // Integração: gravidade leve e arrasto.
    let vivos = 0
    const arrasto = Math.pow(0.35, dt)
    for (let i = 0; i < this.count; i++) {
      if (this.life[i] <= 0) continue
      const j = i * 3
      this.life[i] -= dt
      if (this.life[i] <= 0) { this.life[i] = 0; continue }
      this.vel[j + 1] -= 1.5 * dt
      this.vel[j] *= arrasto; this.vel[j + 2] *= arrasto
      this.pos[j] += this.vel[j] * dt
      this.pos[j + 1] += this.vel[j + 1] * dt
      this.pos[j + 2] += this.vel[j + 2] * dt
      vivos++
    }
    this.points.visible = vivos > 0
    this.aPos.needsUpdate = true; this.aVel.needsUpdate = true
    this.aLife.needsUpdate = true; this.aMax.needsUpdate = true

    // Tique: anel de luz curto quando o relógio começa a andar.
    const run = st.running || 0
    if (this.runPrev <= 0.5 && run > 0.5) this.ringT = 0
    this.runPrev = run
    if (this.ringT >= 0) {
      this.ringT += dt / 0.4
      if (this.ringT >= 1) { this.ringT = -1; this.ring.visible = false }
      else {
        this.ring.visible = true
        this.ringUniforms.uT.value = this.ringT
        this.ring.position.copy(this.watch.group.position)
        this.ring.quaternion.copy(this.app.camera.quaternion)
      }
    }
  }
}
