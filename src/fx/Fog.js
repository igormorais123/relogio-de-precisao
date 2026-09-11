import * as THREE from 'three'

// Capítulo 0 — "vidro embaçado". Disco de condensação colado no cristal do relógio parado.
// fbm lento gera manchas branco-azuladas; 4 gotas escorrem devagar; v=1 embaçado, v=0 limpo.
// A limpeza é radial: um círculo que cresce do centro para a borda conforme v cai.
const vert = /* glsl */`
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const frag = /* glsl */`
precision highp float;
uniform float uTime;
uniform float uV;
uniform vec3 uColor;
uniform vec3 uCold;
varying vec2 vUv;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
  for (int i = 0; i < 5; i++){ v += a * noise(p); p = rot * p * 2.03; a *= 0.5; }
  return v;
}

// Gota: disco com cauda curta acima, escorrendo devagar no eixo y.
float drop(vec2 uv, float seedX, float speed, float size, float phase){
  float y = fract(phase - uTime * speed);
  vec2 c = vec2(seedX, 1.08 - y * 1.2);
  vec2 d = uv - c;
  // Cauda: rastro fino que sobe a partir da cabeça da gota.
  float tail = (1.0 - smoothstep(0.0, size * 0.42, abs(d.x))) * smoothstep(0.0, 0.02, d.y) * (1.0 - smoothstep(0.01, 0.16, d.y));
  float head = 1.0 - smoothstep(size * 0.25, size, length(d * vec2(1.0, 0.88)));
  return clamp(head + tail * 0.55, 0.0, 1.0);
}

void main(){
  vec2 uv = vUv;
  vec2 c = uv - 0.5;
  float r = length(c) * 2.0;              // 0 no centro, 1 na borda do disco
  if (r > 1.0) discard;

  // Condensação: duas escalas de fbm que respiram lentamente.
  float q = fbm(uv * 3.6 + vec2(uTime * 0.013, -uTime * 0.009));
  float n = fbm(uv * 5.2 + q * 0.8 + vec2(-uTime * 0.011, uTime * 0.016));
  float fine = fbm(uv * 14.0 - vec2(uTime * 0.008, uTime * 0.006));
  float mist = smoothstep(0.28, 0.86, n * 0.78 + fine * 0.34);
  mist = mist * 0.72 + 0.28;              // nunca zera: vidro leitoso por inteiro

  // Gotas que escorrem (as trilhas limpam o embaçado por onde passam).
  float d1 = drop(uv, 0.34, 0.020, 0.030, 0.10);
  float d2 = drop(uv, 0.58, 0.014, 0.038, 0.55);
  float d3 = drop(uv, 0.47, 0.026, 0.022, 0.80);
  float d4 = drop(uv, 0.68, 0.011, 0.026, 0.32);
  float drops = clamp(d1 + d2 + d3 + d4, 0.0, 1.0);

  // Limpeza radial: raio limpo = 1 - v (com uma borda suave e acúmulo na franja).
  float cleanR = (1.0 - uV) * 1.40;
  float wipe = smoothstep(cleanR - 0.26, cleanR + 0.06, r);
  float fringe = (1.0 - smoothstep(cleanR + 0.02, cleanR + 0.20, r)) * smoothstep(cleanR - 0.24, cleanR + 0.02, r);

  float edge = (1.0 - smoothstep(0.86, 1.0, r));  // some antes de bater no bisel
  float a = mist * 0.3 * uV * wipe * edge;
  a *= 1.0 - drops * 0.88;                // gota escorrida deixa rastro transparente
  a += fringe * 0.22 * uV * edge;         // franja de condensação empurrada pela limpeza
  a += drops * 0.30 * uV * wipe * edge;   // brilho especular na cabeça da gota

  if (a < 0.004) discard;
  vec3 col = mix(uCold, uColor, mist * 0.8 + drops * 0.4);
  gl_FragColor = vec4(col, clamp(a, 0.0, 0.62));
}
`

export class Fog {
  constructor(app, watch, scroll) {
    this.app = app; this.watch = watch; this.scroll = scroll
    this.v = 1

    this.uniforms = {
      uTime: { value: 0 },
      uV: { value: 1 },
      uColor: { value: new THREE.Color(0xdfe8f2) },
      uCold: { value: new THREE.Color(0x9fb6cd) },
    }
    const mat = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      toneMapped: false,
      side: THREE.DoubleSide,
    })
    this.mesh = new THREE.Mesh(new THREE.CircleGeometry(1.3, app.isMobile ? 64 : 96), mat)
    this.mesh.renderOrder = 6
    this.mesh.frustumCulled = false

    // Filho do cristal: acompanha abertura da tampa, explosão e parallax sem nenhum cálculo extra.
    if (watch.crystal) {
      this.mesh.position.z = 0.02
      watch.crystal.add(this.mesh)
    } else {
      app.scene.add(this.mesh)
      this.orphan = true
    }
  }

  set(v) { this.v = THREE.MathUtils.clamp(v, 0, 1) }

  update(dt, t) {
    // O Director só chama set() no capítulo 0; fora dele o valor ficaria preso. Gate pelo capítulo.
    const alvo = this.scroll && this.scroll.chapter !== 0 ? 0 : this.v
    // Amortece a resposta ao scroll: condensação não some em degrau.
    this.uniforms.uV.value += (alvo - this.uniforms.uV.value) * (1 - Math.pow(0.004, dt))
    this.uniforms.uTime.value = t
    this.mesh.visible = this.uniforms.uV.value > 0.004
    if (this.orphan && this.mesh.visible) {
      this.watch.crystal?.getWorldPosition(this.mesh.position)
      this.mesh.position.z += 0.02
    }
  }
}
