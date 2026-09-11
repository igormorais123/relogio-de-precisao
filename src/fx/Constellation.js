import * as THREE from 'three'

// Linhas entre peças espalhadas (capítulo Pesquisa): segmentos instanciados como planos finos orientados
// entre pares de peças, com máscara de progresso no fragment. Um único draw call.
const vert = /* glsl */`
attribute vec3 aStart; attribute vec3 aEnd; attribute float aOrder;
uniform float uProgress; uniform float uTime;
varying float vT; varying float vOrder;
void main(){
  vT = position.x + 0.5; vOrder = aOrder;
  vec3 dir = aEnd - aStart;
  vec3 mid = mix(aStart, aEnd, vT);
  vec4 mv = modelViewMatrix * vec4(mid, 1.0);
  // espessura em espaço de tela constante
  vec3 dirView = normalize((modelViewMatrix * vec4(dir, 0.0)).xyz);
  vec3 side = normalize(cross(dirView, vec3(0.0, 0.0, 1.0)));
  mv.xyz += side * position.y * 0.005;
  gl_Position = projectionMatrix * mv;
}
`
const frag = /* glsl */`
precision highp float;
uniform float uProgress; uniform float uTime; uniform vec3 uColor;
varying float vT; varying float vOrder;
void main(){
  float reveal = smoothstep(vOrder, vOrder + 0.35, uProgress * 1.35);
  float draw = smoothstep(vT - 0.02, vT + 0.02, reveal);
  float a = draw * 0.13 * smoothstep(0.0, 0.12, vT) * (1.0 - smoothstep(0.88, 1.0, vT));
  if (a < 0.01) discard;
  gl_FragColor = vec4(uColor, a);
}
`
export class Constellation {
  constructor(scene, parts) {
    this.parts = parts
    const pairs = []
    for (let i = 0; i < parts.length; i++) {
      pairs.push([i, (i + 1) % parts.length])
    }
    this.pairs = pairs
    const base = new THREE.PlaneGeometry(1, 1, 16, 1)
    const geo = new THREE.InstancedBufferGeometry()
    geo.index = base.index; geo.attributes.position = base.attributes.position; geo.attributes.uv = base.attributes.uv
    this.start = new THREE.InstancedBufferAttribute(new Float32Array(pairs.length * 3), 3)
    this.end = new THREE.InstancedBufferAttribute(new Float32Array(pairs.length * 3), 3)
    const order = new Float32Array(pairs.length); pairs.forEach((_, i) => (order[i] = i / pairs.length))
    geo.setAttribute('aStart', this.start); geo.setAttribute('aEnd', this.end)
    geo.setAttribute('aOrder', new THREE.InstancedBufferAttribute(order, 1))
    this.uniforms = { uProgress: { value: 0 }, uTime: { value: 0 }, uColor: { value: new THREE.Color(0xe6c98f) } }
    const mat = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms: this.uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })
    this.mesh = new THREE.Mesh(geo, mat)
    this.mesh.frustumCulled = false
    this.mesh.visible = false
    scene.add(this.mesh)
    // Nós: pontos brilhantes nas peças
    const nodeGeo = new THREE.BufferGeometry()
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(parts.length * 3), 3))
    this.nodes = new THREE.Points(nodeGeo, new THREE.PointsMaterial({ color: 0xcfe3ff, size: 0.07, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true }))
    this.nodes.frustumCulled = false
    scene.add(this.nodes)
    this.progress = 0
    this.tmp = new THREE.Vector3()
  }
  set(p) { this.progress = p }
  update(t) {
    this.uniforms.uTime.value = t
    this.uniforms.uProgress.value = this.progress
    this.mesh.visible = this.progress > 0.001
    this.nodes.material.opacity = this.progress * 0.9
    if (!this.mesh.visible) return
    const np = this.nodes.geometry.attributes.position
    this.parts.forEach((p, i) => { p.getWorldPosition(this.tmp); np.setXYZ(i, this.tmp.x, this.tmp.y, this.tmp.z) })
    np.needsUpdate = true
    this.pairs.forEach(([a, b], i) => {
      this.parts[a].getWorldPosition(this.tmp); this.start.setXYZ(i, this.tmp.x, this.tmp.y, this.tmp.z)
      this.parts[b].getWorldPosition(this.tmp); this.end.setXYZ(i, this.tmp.x, this.tmp.y, this.tmp.z)
    })
    this.start.needsUpdate = true; this.end.needsUpdate = true
  }
}
