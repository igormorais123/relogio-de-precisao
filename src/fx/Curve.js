import * as THREE from 'three'

// Capítulo 5 — Aprendizado. "A curva de desvios vira uma nova mola."
// Um tubo fino (raio 0,012) cujos 300 pontos são morfados por v: em 0..0,5 desenha o gráfico de desvios
// (12 amostras com ruído determinístico, suavizadas por CatmullRomCurve3); em 0,5..1 os mesmos pontos
// interpolam para uma espiral de Arquimedes de 9 voltas que viaja até o balanço do relógio.
// A malha é um tubo próprio com topologia fixa: só as posições/normais são recalculadas, e só quando v muda.

const { clamp, lerp, smoothstep } = THREE.MathUtils

const SEG = 300          // pontos ao longo da curva
const RAD = 6            // segmentos ao redor do tubo
const RAIO = 0.012
const AMOSTRAS = 12      // amostras do gráfico de desvios

// Ruído determinístico: mesma curva em toda sessão e em toda captura.
const ruido = (i) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return s - Math.floor(s)
}

export class Curve {
  constructor(app, watch, scroll) {
    this.app = app
    this.watch = watch
    this.scroll = scroll

    this.v = 0
    this.ultimoV = -1
    this.fade = 0

    // Gráfico de desvios: zigue-zague irregular, achatado em z.
    const ctrl = []
    for (let i = 0; i < AMOSTRAS; i++) {
      const u = i / (AMOSTRAS - 1)
      const sinal = i % 2 === 0 ? 1 : -1
      const amp = 0.05 + Math.pow(ruido(i), 1.4) * 0.42
      ctrl.push(new THREE.Vector3(-1.15 + 2.3 * u, sinal * amp * (0.4 + u * 0.9), (ruido(i + 40) - 0.5) * 0.05))
    }
    const curva = new THREE.CatmullRomCurve3(ctrl, false, 'catmullrom', 0.12)
    this.grafico = curva.getPoints(SEG - 1)

    // Espiral de Arquimedes: 9 voltas, raio 0,05 → 0,4 (mesma geometria da espiral real do balanço).
    this.espiral = []
    for (let i = 0; i < SEG; i++) {
      const u = i / (SEG - 1)
      const ang = u * Math.PI * 2 * 9
      const r = lerp(0.05, 0.4, u)
      this.espiral.push(new THREE.Vector3(Math.cos(ang) * r, Math.sin(ang) * r, (u - 0.5) * 0.03))
    }

    // Topologia fixa do tubo.
    const pos = new Float32Array(SEG * RAD * 3)
    const nor = new Float32Array(SEG * RAD * 3)
    const idx = []
    for (let i = 0; i < SEG - 1; i++) {
      for (let j = 0; j < RAD; j++) {
        const a = i * RAD + j
        const b = i * RAD + ((j + 1) % RAD)
        const c = (i + 1) * RAD + ((j + 1) % RAD)
        const d = (i + 1) * RAD + j
        idx.push(a, b, d, b, c, d)
      }
    }
    this.geo = new THREE.BufferGeometry()
    this.geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    this.geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3))
    this.geo.setIndex(idx)
    this.geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 2)

    this.mat = new THREE.MeshPhysicalMaterial({
      color: 0xaec6dd, metalness: 1, roughness: 0.2, clearcoat: 0.6, clearcoatRoughness: 0.2,
      envMapIntensity: 1.8, emissive: 0x2b5a93, emissiveIntensity: 1.1,
      transparent: true, opacity: 0, depthWrite: false,
    })
    this.mesh = new THREE.Mesh(this.geo, this.mat)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = 4

    this.group = new THREE.Group()
    this.group.visible = false
    this.group.add(this.mesh)
    app.scene.add(this.group)

    // Linha de zero: dá ao trecho inicial a leitura de gráfico e desaparece quando vira espiral.
    const zgeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-1.22, 0, 0), new THREE.Vector3(1.22, 0, 0)])
    this.zero = new THREE.Line(zgeo, new THREE.LineBasicMaterial({
      color: 0x8fa3b8, transparent: true, opacity: 0, depthWrite: false, toneMapped: false,
    }))
    this.zero.frustumCulled = false
    this.group.add(this.zero)

    this.p = new THREE.Vector3()
    this.pPrev = new THREE.Vector3()
    this.pNext = new THREE.Vector3()
    this.T = new THREE.Vector3()
    this.N = new THREE.Vector3()
    this.B = new THREE.Vector3()
    this.up = new THREE.Vector3(0, 0, 1)
    this.alvo = new THREE.Vector3()
    this.pontos = new Array(SEG)
    for (let i = 0; i < SEG; i++) this.pontos[i] = new THREE.Vector3()

    this.cos = new Float32Array(RAD)
    this.sin = new Float32Array(RAD)
    for (let j = 0; j < RAD; j++) {
      const a = (j / RAD) * Math.PI * 2
      this.cos[j] = Math.cos(a); this.sin[j] = Math.sin(a)
    }
  }

  set(v = 0) { this.v = clamp(v, 0, 1) }

  // Recalcula posições e normais do tubo para a mistura m (0 gráfico, 1 espiral).
  reconstruir(m) {
    const g = this.grafico, e = this.espiral, pts = this.pontos
    for (let i = 0; i < SEG; i++) pts[i].lerpVectors(g[i], e[i], m)

    const pos = this.geo.attributes.position.array
    const nor = this.geo.attributes.normal.array
    for (let i = 0; i < SEG; i++) {
      this.pPrev.copy(pts[Math.max(0, i - 1)])
      this.pNext.copy(pts[Math.min(SEG - 1, i + 1)])
      this.T.subVectors(this.pNext, this.pPrev)
      if (this.T.lengthSq() < 1e-12) this.T.set(1, 0, 0)
      this.T.normalize()
      this.N.crossVectors(this.up, this.T)
      if (this.N.lengthSq() < 1e-8) this.N.set(1, 0, 0)
      this.N.normalize()
      this.B.crossVectors(this.T, this.N).normalize()
      const p = pts[i]
      for (let j = 0; j < RAD; j++) {
        const nx = this.N.x * this.cos[j] + this.B.x * this.sin[j]
        const ny = this.N.y * this.cos[j] + this.B.y * this.sin[j]
        const nz = this.N.z * this.cos[j] + this.B.z * this.sin[j]
        const k = (i * RAD + j) * 3
        pos[k] = p.x + nx * RAIO; pos[k + 1] = p.y + ny * RAIO; pos[k + 2] = p.z + nz * RAIO
        nor[k] = nx; nor[k + 1] = ny; nor[k + 2] = nz
      }
    }
    this.geo.attributes.position.needsUpdate = true
    this.geo.attributes.normal.needsUpdate = true
  }

  update(dt, t) {
    const v = this.v
    // Acima de 0,98 a espiral real do relógio assume o papel.
    const vis = v > 0.008 && v < 0.98
    this.group.visible = vis
    if (!vis) return

    const m = smoothstep(clamp((v - 0.5) / 0.5, 0, 1), 0, 1)
    if (Math.abs(v - this.ultimoV) > 0.0015) { this.reconstruir(m); this.ultimoV = v }

    // Entrada/saída de opacidade nas pontas do intervalo.
    this.fade = Math.min(smoothstep(v, 0.01, 0.16), 1 - smoothstep(v, 0.86, 0.98))
    this.mat.opacity = this.fade
    this.mat.emissiveIntensity = 0.5 + m * 1.2
    this.zero.material.opacity = this.fade * (1 - m) * 0.5

    // Posição: gráfico flutuando à esquerda do herói; espiral pousando no balanço.
    const hp = this.watch.group.position
    const retrato = this.app.isPortrait
    const gx = hp.x + (retrato ? -0.02 : -2.30)
    const gy = hp.y + (retrato ? 1.35 : -0.74)
    ;(this.watch.hairspring || this.watch.balance).getWorldPosition(this.alvo)
    this.group.position.set(
      lerp(gx, this.alvo.x, m),
      lerp(gy, this.alvo.y, m),
      lerp(hp.z + 0.5, this.alvo.z + 0.02, m),
    )
    const esc = lerp(retrato ? 0.62 : 0.72, this.watch.group.scale.x, m)
    this.group.scale.setScalar(esc)
    this.group.rotation.z = lerp(Math.sin(t * 0.35) * 0.05, this.watch.group.rotation.z, m)
    this.group.rotation.y = lerp(Math.sin(t * 0.28) * 0.12, this.watch.group.rotation.y, m)
    this.group.rotation.x = lerp(0, this.watch.group.rotation.x, m)
  }
}
