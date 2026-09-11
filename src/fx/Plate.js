import * as THREE from 'three'

// Placa fotográfica: fotografia macro do próprio relógio (gerada no Codex Pro, ver assets-gen/) desenhada em
// tela cheia atrás da cena, logo acima do fundo em shader. Fica no plano mais distante do depth buffer, então o
// DOF a desfoca como um fundo real; o texto continua nítido porque vive na cena de sobreposição.
// set(nome, v): troca a foto ('balanco' | 'mostrador') e a opacidade 0..1. Nunca assume chamada todo quadro.

const FOTOS = { balanco: 'macro-balanco.jpg', mostrador: 'macro-mostrador.jpg' }

const vert = /* glsl */`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.9995, 1.0); }
`

const frag = /* glsl */`
precision highp float;
uniform sampler2D uMap; uniform vec2 uCover; uniform vec2 uCenter; uniform vec2 uPointer;
uniform float uOpacity; uniform float uShade; uniform float uTime; uniform float uBlur; uniform float uPortrait;
varying vec2 vUv;
void main() {
  // Cobertura tipo object-fit: cover, com o centro deslocável (retrato mostra o assunto à direita).
  vec2 uv = (vUv - 0.5) * uCover + uCenter + uPointer * 0.012;
  // Desfoque por mipmap (bias): a foto fica atrás do plano de foco, como fundo de macro real.
  vec3 c = texture2D(uMap, uv, uBlur).rgb;
  // Zona do texto escurecida: terço esquerdo em paisagem, metade superior em retrato; vinheta nas bordas.
  float left = mix(smoothstep(0.0, 0.55, vUv.x), 1.0 - smoothstep(0.22, 0.62, vUv.y), uPortrait);
  float vig = 1.0 - smoothstep(0.55, 1.15, length((vUv - 0.5) * vec2(1.4, 1.0)) * 1.25);
  c *= mix(uShade, 1.0, left) * mix(0.55, 1.0, vig);
  // Respiração lenta da luz, como a placa fotográfica do estúdio.
  c *= 1.0 + 0.03 * sin(uTime * 0.2 + vUv.x * 3.0);
  c += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
  gl_FragColor = vec4(c, uOpacity);
}
`

export class Plate {
  constructor(app, watch, scroll) {
    this.app = app
    this.textures = {}
    this.aspects = {}
    this.current = null
    this.target = 0
    this.opacity = 0
    this.uniforms = {
      uMap: { value: null }, uCover: { value: new THREE.Vector2(1, 1) }, uCenter: { value: new THREE.Vector2(0.5, 0.5) },
      uPointer: { value: new THREE.Vector2() }, uOpacity: { value: 0 }, uShade: { value: 0.08 }, uTime: { value: 0 }, uBlur: { value: 2.0 }, uPortrait: { value: 0 },
    }
    // transparent: sem isso o three desenha sem blending e a opacidade é ignorada. depthTest fica ligado: a placa está no
    // plano mais distante (z = 0,9995 em clip space), então o relógio e as peças opacas a cobrem naturalmente.
    const mat = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms: this.uniforms, transparent: true, depthWrite: false, depthTest: true })
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = -9
    this.mesh.visible = false
    app.scene.add(this.mesh)
    const loader = new THREE.TextureLoader()
    for (const [nome, arq] of Object.entries(FOTOS)) {
      loader.load(`${import.meta.env.BASE_URL}${arq}`, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8
        tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
        tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter
        this.textures[nome] = tex; this.aspects[nome] = tex.image.width / tex.image.height
      })
    }
  }

  set(nome, v = 0, blur = 2.0) {
    this.target = nome ? THREE.MathUtils.clamp(v, 0, 1) : 0
    this.blur = blur
    if (nome && nome !== this.current) { this.current = nome; this.opacity = Math.min(this.opacity, 0.001) }
  }

  update(dt, t) {
    const tex = this.current && this.textures[this.current]
    const k = 1 - Math.pow(0.02, dt)
    this.opacity += ((tex ? this.target : 0) - this.opacity) * k
    this.mesh.visible = this.opacity > 0.004
    if (!this.mesh.visible) return
    const u = this.uniforms
    if (u.uMap.value !== tex) u.uMap.value = tex
    const img = this.aspects[this.current] || 1.78, scr = this.app.aspect
    // cover: encolhe a janela de UV no eixo em que a imagem sobra.
    u.uCover.value.set(Math.min(1, scr / img), Math.min(1, img / scr))
    u.uCenter.value.set(this.app.isPortrait ? 0.6 : 0.5, 0.5)
    u.uPortrait.value = this.app.isPortrait ? 1 : 0
    u.uBlur.value = this.blur ?? 2.0
    u.uPointer.value.copy(this.app.pointerSmooth)
    u.uOpacity.value = this.opacity
    u.uTime.value = t
  }
}
