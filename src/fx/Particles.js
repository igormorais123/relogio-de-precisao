import * as THREE from 'three'

// Poeira ambiente: pontos instanciados com ruído no vertex shader, tamanho por profundidade, brilho aditivo.
const vert = /* glsl */`
attribute float aSize; attribute float aPhase; attribute vec3 aSeed;
uniform float uTime; uniform float uPixelRatio; uniform float uIntensity; uniform vec2 uPointer; uniform vec3 uLight;
varying float vAlpha; varying float vMix;
vec3 hash3(vec3 p){ p = vec3(dot(p,vec3(127.1,311.7,74.7)), dot(p,vec3(269.5,183.3,246.1)), dot(p,vec3(113.5,271.9,124.6))); return fract(sin(p)*43758.5453); }
void main(){
  vec3 p = position;
  p.x += sin(uTime * 0.25 + aPhase) * 0.35 + cos(uTime * 0.11 + aPhase * 2.0) * 0.2;
  p.y += cos(uTime * 0.2 + aPhase * 1.3) * 0.3 + sin(uTime * 0.07 + aSeed.y) * 0.25;
  p.z += sin(uTime * 0.15 + aSeed.z * 6.28) * 0.3;
  p.xy += uPointer * 0.25 * (0.4 + aSeed.x);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float depth = -mv.z;
  // Fora do foco: maior, mais suave, mais transparente (truque de profundidade barato).
  float defocus = smoothstep(2.0, 6.0, abs(depth - 6.5));
  gl_PointSize = aSize * uPixelRatio * (10.0 / depth) * (1.0 + defocus * 1.2);
  vMix = step(0.6, aSeed.x);
  float near = 1.0 - smoothstep(4.0, 9.0, depth);
  float lit = 0.25 + 0.75 * exp(-distance(p, uLight) * 0.22);
  vAlpha = uIntensity * lit * (0.18 + near * 0.22 - defocus * 0.12) * (0.6 + 0.4 * sin(uTime * 0.8 + aPhase * 5.0));
  gl_Position = projectionMatrix * mv;
}
`
const frag = /* glsl */`
precision highp float;
uniform vec3 uColor; uniform vec3 uColor2; varying float vAlpha; varying float vMix;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float a = (1.0 - smoothstep(0.05, 0.5, d)) * vAlpha;
  gl_FragColor = vec4(mix(uColor, uColor2, vMix), a);
}
`
export class Particles {
  constructor(scene, { count = 900, color = 0xd3a94f, spread = [9, 6, 6] } = {}) {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3), size = new Float32Array(count), phase = new Float32Array(count), seed = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread[0]
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread[1]
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread[2] - 0.5
      size[i] = 0.7 + Math.pow(Math.random(), 5) * 8
      phase[i] = Math.random() * Math.PI * 2
      seed[i * 3] = Math.random(); seed[i * 3 + 1] = Math.random(); seed[i * 3 + 2] = Math.random()
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 3))
    this.uniforms = { uTime: { value: 0 }, uPixelRatio: { value: 1 }, uIntensity: { value: 1 }, uColor: { value: new THREE.Color(color) }, uColor2: { value: new THREE.Color(0x8fa3b8) }, uPointer: { value: new THREE.Vector2() }, uLight: { value: new THREE.Vector3(3, 4, 5) } }
    const mat = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms: this.uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
    this.points = new THREE.Points(geo, mat)
    this.points.frustumCulled = false
    scene.add(this.points)
  }
  update(t, pointer, intensity = 1, dpr = 1) {
    this.uniforms.uPixelRatio.value = dpr
    this.uniforms.uTime.value = t
    this.uniforms.uIntensity.value = intensity
    this.uniforms.uPointer.value.copy(pointer)
  }
}
