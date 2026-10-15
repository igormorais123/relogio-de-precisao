import * as THREE from 'three'

const vert = /* glsl */`
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.9999, 1.0); }
`
const frag = /* glsl */`
precision highp float;
varying vec2 vUv;
uniform vec3 uColorA; uniform vec3 uColorB; uniform vec3 uAccentA; uniform vec3 uAccentB;
uniform float uMix; uniform float uTime; uniform vec2 uAspect; uniform vec2 uPointer; uniform float uAngle;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y); }
float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<5;i++){ v+=a*noise(p); p=p*2.03+7.1; a*=.5; } return v; }
void main(){
  vec2 p = (vUv - 0.5) * uAspect;
  vec2 d = vec2(cos(uAngle), sin(uAngle));
  float edge = dot(p, d) + (uMix * 2.0 - 1.0) * 1.6;
  float n = fbm(p * 2.2 + uTime * 0.03) - 0.5;
  float m = smoothstep(-0.06, 0.06, edge + n * 0.25);
  vec3 base = mix(uColorA, uColorB, m);
  vec3 accent = mix(uAccentA, uAccentB, m);
  float r = length(p - uPointer * 0.15);
  float glow = exp(-r * r * 1.3) * 0.028;
  float mist = fbm(p * 1.4 + vec2(uTime * 0.02, -uTime * 0.015)) * 0.22;
  vec3 col = base * (1.0 + mist * 1.8) + accent * (glow + mist * 0.014);
  col += (hash(vUv * 900.0 + uTime) - 0.5) * 0.012;
  gl_FragColor = vec4(col, 1.0);
}
`

export class Background {
  constructor(scene) {
    this.uniforms = {
      uColorA: { value: new THREE.Color(0x07090c) }, uColorB: { value: new THREE.Color(0x07090c) },
      uAccentA: { value: new THREE.Color(0xd92135) }, uAccentB: { value: new THREE.Color(0xd92135) },
      uMix: { value: 0 }, uTime: { value: 0 }, uAspect: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2() }, uAngle: { value: -0.35 },
    }
    const mat = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms: this.uniforms, depthWrite: false, depthTest: false })
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = -10
    scene.add(this.mesh)
  }
  set(colorA, accentA, colorB, accentB, mix) {
    this.uniforms.uColorA.value.setHex(colorA)
    this.uniforms.uAccentA.value.setHex(accentA)
    this.uniforms.uColorB.value.setHex(colorB)
    this.uniforms.uAccentB.value.setHex(accentB)
    this.uniforms.uMix.value = mix
  }
  update(t, aspect, pointer) {
    this.uniforms.uTime.value = t
    this.uniforms.uAspect.value.set(aspect, 1)
    this.uniforms.uPointer.value.copy(pointer)
  }
}
