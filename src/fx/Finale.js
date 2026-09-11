import * as THREE from 'three'

// Fecho do capítulo 5. Dois anéis concêntricos de luz partem do centro do relógio a cada tique (0,5 s),
// com o brilho modulado pela fase do balanço (2,5 Hz), e uma constelação de 60 pontos orbita o herói
// em duas órbitas inclinadas. Tudo desaparece em v = 0.

const { clamp, smoothstep, lerp } = THREE.MathUtils

const TIQUE = 0.5

const vert = /* glsl */`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`

// Anel radial suave: banda estreita que engorda e esmaece conforme se expande.
const frag = /* glsl */`
precision highp float;
uniform float uAlpha; uniform float uEsp; uniform vec3 uColor;
varying vec2 vUv;
void main() {
  float r = length((vUv - 0.5) * 2.0);
  float banda = 1.0 - smoothstep(0.0, uEsp, abs(r - 0.82));
  float a = banda * uAlpha * (1.0 - smoothstep(0.86, 1.02, r));
  if (a < 0.004) discard;
  gl_FragColor = vec4(uColor, a);
}
`

export class Finale {
  constructor(app, watch, scroll) {
    this.app = app
    this.watch = watch
    this.scroll = scroll
    this.v = 0

    this.group = new THREE.Group()
    this.group.visible = false
    this.group.renderOrder = 7
    app.scene.add(this.group)

    const geo = new THREE.PlaneGeometry(1, 1)
    const cores = [0xd8b062, 0x9fc4ff]
    this.aneis = cores.map((cor, i) => {
      const m = new THREE.Mesh(geo, new THREE.ShaderMaterial({
        vertexShader: vert, fragmentShader: frag,
        uniforms: { uAlpha: { value: 0 }, uEsp: { value: 0.06 }, uColor: { value: new THREE.Color(cor) } },
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false,
      }))
      m.userData.offset = i * TIQUE * 0.5
      m.renderOrder = 7
      this.group.add(m)
      return m
    })

    // Constelação: 60 pontos (30 em cada órbita inclinada), metade no celular.
    this.n = app.isMobile ? 30 : 60
    this.meta = Math.ceil(this.n / 2)
    const pos = new Float32Array(this.n * 3)
    const geoP = new THREE.BufferGeometry()
    geoP.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    this.pontos = new THREE.Points(geoP, new THREE.PointsMaterial({
      color: 0xffeec4, size: app.isMobile ? 0.07 : 0.062, sizeAttenuation: true,
      transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false,
    }))
    this.pontos.frustumCulled = false
    this.group.add(this.pontos)

    this.fases = new Float32Array(this.n)
    for (let i = 0; i < this.n; i++) {
      const dentro = i < this.meta
      const k = dentro ? i / this.meta : (i - this.meta) / (this.n - this.meta)
      this.fases[i] = k * Math.PI * 2
    }
    // Duas órbitas inclinadas em eixos diferentes.
    this.orb = [
      { r: 1.55, incl: 0.42, eixo: 0.0, vel: 0.22 },
      { r: 1.95, incl: -0.68, eixo: 0.9, vel: -0.15 },
    ]
  }

  set(v = 0) { this.v = clamp(v, 0, 1) }

  update(dt, t) {
    const v = this.v
    const vis = v > 0.002
    this.group.visible = vis
    if (!vis) return

    const e = smoothstep(v, 0, 1)
    const hp = this.watch.group.position
    this.group.position.set(hp.x, hp.y, hp.z)
    const esc = this.watch.group.scale.x / 0.9

    // Fase do balanço: 2,5 Hz, a mesma do relógio.
    const fase = Math.sin(t * Math.PI * 2 * 2.5)
    const brilho = 0.55 + 0.45 * Math.abs(fase)

    for (const anel of this.aneis) {
      const a = (((t + anel.userData.offset) % TIQUE) + TIQUE) % TIQUE / TIQUE
      const s = lerp(1.0, 3.6, a) * esc
      anel.scale.setScalar(s)
      anel.material.uniforms.uAlpha.value = e * brilho * Math.pow(1 - a, 1.3) * 1.35
      anel.material.uniforms.uEsp.value = 0.026 + a * 0.045
    }

    const pa = this.pontos.geometry.attributes.position
    const arr = pa.array
    for (let i = 0; i < this.n; i++) {
      const dentro = i < this.meta
      const o = this.orb[dentro ? 0 : 1]
      const ang = this.fases[i] + t * o.vel * Math.PI * 2
      const r = o.r * esc * (1 + 0.03 * Math.sin(t * 1.3 + this.fases[i] * 3))
      const x = Math.cos(ang) * r
      const y = Math.sin(ang) * r
      // Inclinação da órbita: rotação em x seguida de rotação em z.
      const yi = y * Math.cos(o.incl)
      const zi = y * Math.sin(o.incl)
      const ce = Math.cos(o.eixo), se = Math.sin(o.eixo)
      const j = i * 3
      arr[j] = x * ce - yi * se
      arr[j + 1] = x * se + yi * ce
      arr[j + 2] = zi
    }
    pa.needsUpdate = true
    this.pontos.material.opacity = e * brilho * 0.95
  }
}
