import * as THREE from 'three'
import { Text } from 'troika-three-text'
import { FONT_DISPLAY, FONT_BODY } from '../core/Title.js'

// Capítulo 4 — Avaliação. Instrumento HUD 3D que representa o padrão atômico contra o qual o herói é medido.
// Um anel de escala (60 s) que se desenha, um arco de desvio (±10 s/dia = ±150°), dois ponteiros
// (referência em 60 s exatos e herói com a taxa alterada pelo desvio), os dígitos do desvio e a etiqueta.
// O cenário muda a atmosfera: um único sistema de partículas é reaproveitado trocando cor e direção.

const TAU = Math.PI * 2
const { clamp, lerp, smoothstep, degToRad } = THREE.MathUtils

const OURO = new THREE.Color(0xf0bf62)
const ACO = new THREE.Color(0x7fb6ff)

// Atmosferas por cenário: cor da partícula, direção dominante, velocidade e turbulência.
const ATMOSFERA = {
  frio: { cor: new THREE.Color(0x9fc4ff), dir: new THREE.Vector3(0.04, -1, 0), vel: 0.13, turb: 0.25, tilt: 0 },
  calor: { cor: new THREE.Color(0xffa859), dir: new THREE.Vector3(-0.05, 1, 0), vel: 0.2, turb: 0.45, tilt: 0 },
  impacto: { cor: new THREE.Color(0xff8a7a), dir: new THREE.Vector3(0.1, -0.3, 0), vel: 0.3, turb: 1.0, tilt: 0 },
  posicao: { cor: new THREE.Color(0xcfe3ff), dir: new THREE.Vector3(0.6, -0.55, 0), vel: 0.16, turb: 0.3, tilt: degToRad(25) },
}

// Mostrador: anel de escala + marcas de 10 s + arco de desvio, tudo em um plano com shader.
// Desenho progressivo por ângulo (uDraw), arco irregular sob impacto (uJitter).
const mostradorFrag = /* glsl */`
precision highp float;
uniform float uDraw;      // 0..1 quanto do anel já foi desenhado (sentido horário a partir do topo)
uniform float uArc;       // 0..1 crescimento do arco de desvio
uniform float uDev;       // desvio normalizado -1..1 (±10 s/dia)
uniform float uJitter;    // irregularidade do arco (cenário de impacto)
uniform float uTime;
uniform float uAlpha;
uniform vec3 uArcColor;
uniform vec3 uRingColor;
varying vec2 vUv;

float faixa(float d, float w) { return 1.0 - smoothstep(0.0, w, abs(d)); }

void main() {
  vec2 p = (vUv - 0.5) * 2.0;
  float r = length(p);
  if (r > 1.02) discard;
  float a = atan(p.x, p.y);          // 0 no topo, cresce no sentido horário
  if (a < 0.0) a += 6.28318530718;

  float drawn = smoothstep(0.0, 0.06, uDraw * 6.28318530718 - a);
  drawn = max(drawn, step(0.999, uDraw));

  // Anel fino de escala
  float ring = faixa(r - 0.87, 0.010) * drawn;

  // Marcas: maiores a cada 10 s (6), menores a cada 5 s (12)
  float passoM = 6.28318530718 / 6.0;
  float passom = 6.28318530718 / 12.0;
  float dM = min(mod(a, passoM), passoM - mod(a, passoM));
  float dm = min(mod(a, passom), passom - mod(a, passom));
  float marcaM = (1.0 - smoothstep(0.0, 0.030, dM)) * faixa(r - 0.795, 0.075) * drawn;
  float marcam = (1.0 - smoothstep(0.0, 0.014, dm)) * faixa(r - 0.835, 0.035) * drawn * 0.55;

  // Arco de desvio: horário quando adianta, anti-horário quando atrasa
  float ext = abs(uDev) * 2.6179938 * uArc;            // 150° no fundo de escala
  float dentro = uDev >= 0.0
    ? (1.0 - smoothstep(0.0, 0.02, a - ext))
    : (1.0 - smoothstep(0.0, 0.02, (6.28318530718 - a) - ext));
  dentro *= step(0.001, ext);
  float rr = 0.66 + uJitter * 0.035 * sin(a * 13.0 + uTime * 7.0) * sin(a * 5.0 - uTime * 3.0);
  float esp = 0.030 + uJitter * 0.012 * sin(a * 21.0 + uTime * 11.0);
  float arco = faixa(r - rr, esp) * dentro;

  // Zero da escala destacado no topo
  float zero = (1.0 - smoothstep(0.0, 0.018, min(a, 6.28318530718 - a))) * faixa(r - 0.755, 0.115) * drawn;

  vec3 cor = uRingColor * (ring * 1.15 + marcaM * 1.1 + marcam * 0.8 + zero * 1.4) + uArcColor * arco * 2.4;
  float alpha = (ring * 1.15 + marcaM * 1.1 + marcam * 0.8 + zero * 1.4 + arco * 2.2) * uAlpha;
  if (alpha < 0.004) discard;
  gl_FragColor = vec4(cor, clamp(alpha, 0.0, 1.0));
}
`

// Disco de apoio: escurece o fundo atrás do HUD para os dígitos ficarem legíveis sobre o título.
const discoFrag = /* glsl */`
precision highp float;
uniform float uAlpha; uniform vec3 uColor;
varying vec2 vUv;
void main() {
  float r = length((vUv - 0.5) * 2.0);
  float a = (1.0 - smoothstep(0.12, 1.0, r)) * uAlpha;
  if (a < 0.004) discard;
  gl_FragColor = vec4(uColor, a);
}
`

const vert = /* glsl */`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`

// Formata o desvio no padrão brasileiro: sinal explícito, vírgula decimal.
function formataDesvio(d) {
  const sinal = d < 0 ? '−' : '+'
  return `${sinal}${Math.abs(d).toFixed(1).replace('.', ',')} s/dia`
}

export class Reference {
  constructor(app, watch, scroll) {
    this.app = app
    this.watch = watch
    this.scroll = scroll

    this.v = 0
    this.desvio = 0
    this.desvioSuave = 0
    this.cenario = 'frio'
    this.cenarioAnterior = 'frio'
    this.tremor = 0          // 0..1, decai em 0,6 s após troca para 'impacto'
    this.faseRef = 0
    this.faseHeroi = 0
    this.tilt = 0
    this.jitter = 0

    const R = 0.52
    this.R = R

    this.group = new THREE.Group()
    this.group.renderOrder = 6
    this.group.visible = false
    ;(app.overlay || app.scene).add(this.group)

    // Pivô interno: recebe o tremor do impacto sem contaminar a posição base.
    this.pivot = new THREE.Group()
    this.group.add(this.pivot)

    const planeGeo = new THREE.PlaneGeometry(1, 1)

    this.disco = new THREE.Mesh(planeGeo, new THREE.ShaderMaterial({
      vertexShader: vert, fragmentShader: discoFrag,
      uniforms: { uAlpha: { value: 0 }, uColor: { value: new THREE.Color(0x05070c) } },
      transparent: true, depthWrite: false, depthTest: false, toneMapped: false,
    }))
    this.disco.scale.setScalar(R * 3.5)
    this.disco.position.z = -0.02
    this.disco.renderOrder = 6
    this.pivot.add(this.disco)

    this.uni = {
      uDraw: { value: 0 }, uArc: { value: 0 }, uDev: { value: 0 }, uJitter: { value: 0 },
      uTime: { value: 0 }, uAlpha: { value: 0 },
      uArcColor: { value: new THREE.Color(0xd8b062) }, uRingColor: { value: new THREE.Color(0xcfd8e4) },
    }
    this.mostrador = new THREE.Mesh(planeGeo, new THREE.ShaderMaterial({
      vertexShader: vert, fragmentShader: mostradorFrag, uniforms: this.uni,
      transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, toneMapped: false,
    }))
    this.mostrador.scale.setScalar(R * 2.3)
    this.mostrador.renderOrder = 7
    this.pivot.add(this.mostrador)

    // Ponteiros: base no centro, apontando para cima.
    const ponteiro = (comp, larg, cor, op) => {
      const g = new THREE.PlaneGeometry(larg, comp)
      g.translate(0, comp / 2, 0)
      const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({
        color: cor, transparent: true, opacity: op, depthWrite: false, depthTest: false,
        blending: THREE.AdditiveBlending, toneMapped: false,
      }))
      m.renderOrder = 8
      this.pivot.add(m)
      return m
    }
    this.ptRef = ponteiro(R * 0.84, 0.022, 0xe9e4d8, 0)     // referência: 1 volta a cada 60 s exatos
    this.ptHeroi = ponteiro(R * 0.60, 0.036, 0xd8b062, 0)   // herói: taxa alterada pelo desvio
    this.nucleo = new THREE.Mesh(new THREE.CircleGeometry(0.026, 20), new THREE.MeshBasicMaterial({
      color: 0xe9e4d8, transparent: true, opacity: 0, depthWrite: false, depthTest: false,
      blending: THREE.AdditiveBlending, toneMapped: false,
    }))
    this.nucleo.renderOrder = 9
    this.nucleo.position.z = 0.004
    this.pivot.add(this.nucleo)

    // Dígitos do desvio e etiqueta.
    this.digitos = new Text()
    this.digitos.text = formataDesvio(0)
    this.digitos.font = FONT_DISPLAY
    this.digitos.fontSize = 0.13
    this.digitos.letterSpacing = 0.03
    this.digitos.anchorX = 'center'
    this.digitos.anchorY = 'middle'
    this.digitos.color = 0xf3ecdd
    this.digitos.outlineWidth = '6%'
    this.digitos.outlineColor = 0x05070c
    this.digitos.fillOpacity = 0
    this.digitos.outlineOpacity = 0
    this.digitos.position.set(0, -R * 0.56, 0.01)
    this.digitos.material.toneMapped = false
    this.digitos.material.transparent = true
    this.digitos.material.depthWrite = false
    this.digitos.material.depthTest = false
    this.digitos.renderOrder = 10
    this.pivot.add(this.digitos)
    this.digitos.sync()

    this.etiqueta = new Text()
    this.etiqueta.text = 'PADRÃO ATÔMICO'
    this.etiqueta.font = FONT_BODY
    this.etiqueta.fontSize = 0.074
    this.etiqueta.letterSpacing = 0.24
    this.etiqueta.anchorX = 'center'
    this.etiqueta.anchorY = 'middle'
    this.etiqueta.color = 0xdbe3ec
    this.etiqueta.outlineWidth = '10%'
    this.etiqueta.outlineColor = 0x05070c
    this.etiqueta.fillOpacity = 0
    this.etiqueta.outlineOpacity = 0
    this.etiqueta.position.set(0, -R - 0.16, 0.01)
    this.etiqueta.material.toneMapped = false
    this.etiqueta.material.transparent = true
    this.etiqueta.material.depthWrite = false
    this.etiqueta.material.depthTest = false
    this.etiqueta.renderOrder = 10
    this.pivot.add(this.etiqueta)
    this.etiqueta.sync()

    // Sistema único de partículas, reaproveitado entre cenários.
    this.nPart = app.isMobile ? 200 : 400
    this.caixa = new THREE.Vector3(1.05, 1.0, 0.45)
    const pos = new Float32Array(this.nPart * 3)
    this.semente = new Float32Array(this.nPart)
    for (let i = 0; i < this.nPart; i++) {
      pos[i * 3] = (Math.random() * 2 - 1) * this.caixa.x
      pos[i * 3 + 1] = (Math.random() * 2 - 1) * this.caixa.y
      pos[i * 3 + 2] = (Math.random() * 2 - 1) * this.caixa.z
      this.semente[i] = 0.45 + Math.random() * 1.1
    }
    const pgeo = new THREE.BufferGeometry()
    pgeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    this.particulas = new THREE.Points(pgeo, new THREE.PointsMaterial({
      color: ATMOSFERA.frio.cor.clone(), size: app.isMobile ? 0.026 : 0.02, sizeAttenuation: true,
      transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false,
    }))
    this.particulas.frustumCulled = false
    this.group.add(this.particulas)

    this.corAtual = ATMOSFERA.frio.cor.clone()
    this.dirAtual = ATMOSFERA.frio.dir.clone()
    this.velAtual = ATMOSFERA.frio.vel
    this.turbAtual = ATMOSFERA.frio.turb
    this.corArco = new THREE.Color()
    this.tmp = new THREE.Vector3()
  }

  // v: 0..1 entrada. desvio: s/dia. cenario: frio | calor | impacto | posicao.
  set(v = 0, desvio = 0, cenario = 'frio') {
    this.v = clamp(v, 0, 1)
    this.desvio = desvio
    if (cenario && cenario !== this.cenario) {
      this.cenarioAnterior = this.cenario
      this.cenario = cenario
      if (cenario === 'impacto') this.tremor = 1
    }
  }

  update(dt, t) {
    const v = this.v
    const vis = v > 0.002
    this.group.visible = vis
    if (!vis) { this.tremor = Math.max(0, this.tremor - dt / 0.6); return }

    const e = smoothstep(v, 0, 1)
    const atm = ATMOSFERA[this.cenario] || ATMOSFERA.frio
    const k = 1 - Math.pow(0.002, dt)

    // Posição: à esquerda do herói em paisagem, acima dele em retrato (abaixo ficaria sob a barra de cenários).
    // Em paisagem o HUD é erguido para a faixa livre entre o bloco de texto e o relógio.
    const hp = this.watch.group.position
    const retrato = this.app.isPortrait
    const escala = retrato ? 0.58 : 0.82
    this.group.scale.setScalar(escala)
    const ox = retrato ? -0.22 : (hp.x < 0 ? 1.75 : -1.75)
    const oy = retrato ? 1.5 : 1.2
    this.group.position.set(hp.x + ox, hp.y + oy, hp.z + 0.35)
    // A etiqueta fica sempre abaixo do anel; os dígitos, dentro dele.
    this.etiqueta.position.y = -this.R - (retrato ? 0.14 : 0.16)

    // Tremor amortecido de 0,6 s disparado pela troca para 'impacto'.
    this.tremor = Math.max(0, this.tremor - dt / 0.6)
    const tr = this.tremor * this.tremor
    this.pivot.position.set(Math.sin(t * 46) * 0.055 * tr, Math.cos(t * 37) * 0.045 * tr, 0)

    // Inclinação de 25° no cenário de posição.
    this.tilt = lerp(this.tilt, atm.tilt, k)
    this.group.rotation.z = this.tilt

    // Desvio suavizado e cores do arco.
    this.desvioSuave = lerp(this.desvioSuave, this.desvio, 1 - Math.pow(0.01, dt))
    const dn = clamp(this.desvioSuave / 10, -1, 1)
    this.corArco.copy(this.desvioSuave >= 0 ? OURO : ACO)
    this.uni.uArcColor.value.lerp(this.corArco, k)
    this.uni.uDev.value = dn
    this.uni.uDraw.value = smoothstep(v, 0, 0.65)
    this.uni.uArc.value = smoothstep(v, 0.35, 0.95)
    this.jitter = lerp(this.jitter, this.cenario === 'impacto' ? 1 : 0, k)
    this.uni.uJitter.value = this.jitter + tr * 0.6
    this.uni.uTime.value = t
    this.uni.uAlpha.value = e
    this.disco.material.uniforms.uAlpha.value = e * 0.88

    // Ponteiros: referência em 60 s exatos; herói com a taxa exagerada pelo desvio.
    this.faseRef += dt / 60
    this.faseHeroi += (dt / 60) * (1 + this.desvioSuave * 0.03)
    this.ptRef.rotation.z = -this.faseRef * TAU
    this.ptHeroi.rotation.z = -this.faseHeroi * TAU
    this.ptRef.material.opacity = e * 0.85
    this.ptHeroi.material.opacity = e
    this.ptHeroi.material.color.lerp(this.corArco, k)
    this.nucleo.material.opacity = e

    // Texto: sobe de opacidade depois do anel.
    const op = clamp((v - 0.42) / 0.4, 0, 1)
    const txt = formataDesvio(this.desvio)
    if (txt !== this.digitos.text) { this.digitos.text = txt; this.digitos.sync() }
    this.digitos.fillOpacity = op
    this.digitos.outlineOpacity = op
    this.etiqueta.fillOpacity = op * 0.9
    this.etiqueta.outlineOpacity = op * 0.9

    // Atmosfera: uma só nuvem de pontos muda cor, direção e velocidade conforme o cenário.
    this.corAtual.lerp(atm.cor, k)
    this.particulas.material.color.copy(this.corAtual)
    this.particulas.material.opacity = e * (this.cenario === 'impacto' ? 0.75 : 0.55)
    this.dirAtual.lerp(atm.dir, k)
    this.velAtual = lerp(this.velAtual, atm.vel, k)
    this.turbAtual = lerp(this.turbAtual, atm.turb, k)

    const pa = this.particulas.geometry.attributes.position
    const arr = pa.array
    const bx = this.caixa.x, by = this.caixa.y, bz = this.caixa.z
    for (let i = 0; i < this.nPart; i++) {
      const s = this.semente[i]
      const j = i * 3
      arr[j] += (this.dirAtual.x * this.velAtual * s + Math.sin(t * 0.9 + s * 9) * 0.05 * this.turbAtual) * dt
      arr[j + 1] += (this.dirAtual.y * this.velAtual * s + Math.cos(t * 1.1 + s * 7) * 0.05 * this.turbAtual) * dt
      arr[j + 2] += Math.sin(t * 0.6 + s * 4) * 0.02 * this.turbAtual * dt
      if (arr[j] > bx) arr[j] = -bx; else if (arr[j] < -bx) arr[j] = bx
      if (arr[j + 1] > by) arr[j + 1] = -by; else if (arr[j + 1] < -by) arr[j + 1] = by
      if (arr[j + 2] > bz) arr[j + 2] = -bz; else if (arr[j + 2] < -bz) arr[j + 2] = bz
    }
    pa.needsUpdate = true
  }
}
