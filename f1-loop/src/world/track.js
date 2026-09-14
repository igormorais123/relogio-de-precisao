import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {emblem, glyphs} from '../../materia-prima/modulos-atualizados/identity.js';
import {createWipeClip, WIPE_SHADER_CHUNK} from '../fx/wipe-clip.js';

// Reta de circuito à noite. O carro fica parado na origem (nariz em +Z) e o mundo
// corre em −Z à sua volta, em laço de TRACK_LOOP metros, então as câmeras da aula
// continuam sendo coordenadas do carro.
//
// Contrato: createTrack({THREE, renderer, mobile}) ->
//   {root, clip, envTexture, fog, cameraFar, motion, lights,
//    update(time, dt, speed) -> motion, dispose()}
//   - speed 0..1 (1 = TRACK_TOP_SPEED m/s). update devolve o estado de movimento
//     {travel, velocity, wheelAngle}: aplique wheelAngle em spinPivot.rotation.x das
//     quatro rodas DEPOIS de mechanics.update (mechanics reescreve a rotação).
//   - Tudo que passa pelo carro é instanciado; o deslocamento é um uniform (uTravel)
//     e o laço é feito por instância no vertex shader: nenhuma matriz é tocada por
//     quadro. root deve ficar na identidade (sem rotação nem escala).
//   - envTexture é um PMREM próprio: faixas de luz ao longo de Z (torres, cobertura
//     da arquibancada, barreira vermelha) que viram reflexos alongados na pintura.
//   - fog/cameraFar são a recomendação para a cena enquanto a pista é visível.
//   - clip é o recorte diagonal do wipe, como no túnel e no box.
//   - Luzes próprias: dois SpotLights sem sombra que seguem a torre mais próxima de
//     cada lado; a contagem é fixa (as variantes de shader não mudam com a velocidade).
// Laço sem salto: um objeto de meia extensão h só troca de ponta quando |z| = LOOP/2,
// e LOOP/2 − h ≥ TRACK_VISIBLE para toda fileira (tests/track.test.mjs).

export const TRACK_LOOP = 640;
export const TRACK_VISIBLE = 150;
export const TRACK_TOP_SPEED = 80;      // m/s com speed = 1 (≈ 290 km/h)
export const WHEEL_RADIUS = .33;
const TAU = Math.PI * 2;

// Fileiras ao longo da pista (along = z + travel). As regulares têm espaçamento que divide o
// laço; as de posição explícita (zebras, placas de frenagem) têm spacing null. `half` é a meia
// extensão em z de cada peça, usada na regra de troca de ponta fora da lente.
export const TRACK_ROWS = {
  tecpro: {spacing: 1.6, half: .8},
  banner: {spacing: 12.8, half: 4.8},
  fencePost: {spacing: 4, half: .6},
  armcoPost: {spacing: 4, half: .1},
  tower: {spacing: 80, half: 3},
  stand: {spacing: 320, half: 48},
  kerb: {spacing: null, half: 6},
  board: {spacing: null, half: .8},
};

/** Posição em z de um objeto nascido em `along`, depois de `travel` metros, dentro de [−loop/2, loop/2). */
export function wrapAlong(along, travel, loop = TRACK_LOOP) {
  const h = loop / 2;
  let v = (along - travel + h) % loop;
  if (v < 0) v += loop;
  return v - h;
}

/** Integrador puro do rolamento: sem alocação por passo. */
export function createTrackMotion({loop = TRACK_LOOP, topSpeed = TRACK_TOP_SPEED, wheelRadius = WHEEL_RADIUS} = {}) {
  const state = {
    travel: 0, velocity: 0, wheelAngle: 0, speed: 0,
    step(dt, speed) {
      const d = dt > 0 ? Math.min(dt, .1) : 0;
      const s = speed > 0 ? Math.min(speed, 1) : 0;   // NaN e negativos param o carro
      state.speed = s;
      state.velocity = s * topSpeed;
      state.travel += state.velocity * d;
      if (state.travel >= loop) state.travel -= loop * Math.floor(state.travel / loop);
      state.wheelAngle += state.velocity * d / wheelRadius;
      if (state.wheelAngle >= TAU) state.wheelAngle -= TAU * Math.floor(state.wheelAngle / TAU);
      return state;
    },
  };
  return state;
}

// ------------------------------------------------------------------ GLSL
const ROLL_VERTEX = /* glsl */`
#ifdef USE_INSTANCING
{
  float rz = instanceMatrix[3].z;
  float rs = mod(rz - uTravel + .5 * uLoop, uLoop) - .5 * uLoop - rz;
  transformed += inverse(mat3(instanceMatrix)) * vec3(0., 0., rs);
}
#endif`;

const FOG_UNIFORMS = THREE => ({fogColor: {value: new THREE.Color('#0b1014')}, fogNear: {value: 1}, fogFar: {value: 2000}, fogDensity: {value: .00025}});
const FOG_FRAGMENT = /* glsl */`
#include <fog_pars_fragment>
float fogAmount(){
#ifdef USE_FOG
#ifdef FOG_EXP2
  return 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
#else
  return smoothstep(fogNear, fogFar, vFogDepth);
#endif
#else
  return 0.0;
#endif
}`;

const NOISE_GLSL = /* glsl */`
float trHash(vec2 p){p=fract(p*vec2(.1031,.1030));p+=dot(p,p.yx+33.33);return fract((p.x+p.y)*p.x);}
// Ruído de valor periódico em y (período em células): o padrão ao longo da pista fecha o laço.
float trNoise(vec2 p, float period){
  vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  float y0=mod(i.y,period), y1=mod(i.y+1.,period);
  return mix(mix(trHash(vec2(i.x,y0)),trHash(vec2(i.x+1.,y0)),f.x),mix(trHash(vec2(i.x,y1)),trHash(vec2(i.x+1.,y1)),f.x),f.y);
}`;

// Poças de luz das torres: esquerda em along 40+80k (x −15), direita em 80k (x +24).
// A torre mais próxima de cada lado é luz real (SpotLight); `near` = 0 tira dela a parcela analítica.
const POOLS_GLSL = /* glsl */`
uniform vec3 uPoolColor;
uniform float uPoolGain;
float trPools(float along, float x, float z, float near){
  float dzL = mod(along - 40. + 40., 80.) - 40.;
  float dzR = mod(along + 40., 80.) - 40.;
  float wL = mix(1., smoothstep(25., 40., abs(z - dzL)), near);
  float wR = mix(1., smoothstep(25., 40., abs(z - dzR)), near);
  float pL = exp(-dzL*dzL/162. - (x+2.)*(x+2.)/242.);
  float pR = exp(-dzR*dzR/162. - (x-5.)*(x-5.)/242.) * .75;
  return (pL*wL + pR*wR) * uPoolGain;
}`;

// ------------------------------------------------------------ texturas
function rng(seed) { return () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; }; }

function periodicNoise(size, cells, seed) {
  const r = rng(seed), lattice = new Float32Array(cells * cells);
  for (let i = 0; i < lattice.length; i++) lattice[i] = r();
  return (x, y) => {
    const fx = x / size * cells, fy = y / size * cells, ix = Math.floor(fx), iy = Math.floor(fy);
    let tx = fx - ix, ty = fy - iy; tx = tx * tx * (3 - 2 * tx); ty = ty * ty * (3 - 2 * ty);
    const x0 = ix % cells, y0 = iy % cells, x1 = (x0 + 1) % cells, y1 = (y0 + 1) % cells;
    const a = lattice[y0 * cells + x0], b = lattice[y0 * cells + x1], c = lattice[y1 * cells + x0], d = lattice[y1 * cells + x1];
    return (a + (b - a) * tx) + ((c + (d - c) * tx) - (a + (b - a) * tx)) * ty;
  };
}

// Microtextura do asfalto (ladrilho de 4 m): agregado, vazios do ligante e altura para a normal.
function asphaltTextures(THREE, size) {
  const r = rng(7331), n = size * size;
  const height = new Float32Array(n), albedo = new Float32Array(n), rough = new Float32Array(n);
  const low = periodicNoise(size, 12, 11), mid = periodicNoise(size, 48, 23);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = y * size + x, l = low(x, y), m = mid(x, y), g = r();
    height[i] = .35 * m + .15 * g;
    albedo[i] = .42 + .18 * l + .12 * m + .16 * (g - .5);
    rough[i] = .5 + .25 * (m - .5);
  }
  // Pedras do agregado: carimbos circulares com borda periódica.
  const stones = Math.round(n / 26);
  for (let s = 0; s < stones; s++) {
    const cx = r() * size, cy = r() * size, rad = .7 + r() * r() * 2.6 * size / 1024, tone = r(), lift = .45 + r() * .55;
    const R = Math.ceil(rad);
    for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
      const d = Math.hypot(dx, dy) / rad;
      if (d > 1) continue;
      const px = ((Math.floor(cx) + dx) % size + size) % size, py = ((Math.floor(cy) + dy) % size + size) % size, i = py * size + px;
      const dome = Math.sqrt(1 - d * d);
      height[i] = Math.max(height[i], .45 + dome * lift * .55);
      albedo[i] = albedo[i] * .35 + (.3 + tone * .7) * .65;
      rough[i] = .35 + .25 * tone;
    }
  }
  // Vazios escuros entre pedras.
  for (let s = 0; s < n / 90; s++) {
    const i = Math.floor(r() * n);
    height[i] *= .3; albedo[i] *= .35; rough[i] = .9;
  }
  const colorCanvas = document.createElement('canvas'), normalCanvas = document.createElement('canvas');
  colorCanvas.width = colorCanvas.height = normalCanvas.width = normalCanvas.height = size;
  const cctx = colorCanvas.getContext('2d'), nctx = normalCanvas.getContext('2d');
  const cimg = cctx.createImageData(size, size), nimg = nctx.createImageData(size, size);
  const at = (x, y) => height[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = y * size + x, o = i * 4;
    const v = Math.max(0, Math.min(1, albedo[i]));
    cimg.data[o] = v * 255; cimg.data[o + 1] = height[i] * 255; cimg.data[o + 2] = Math.max(0, Math.min(1, rough[i])) * 255; cimg.data[o + 3] = 255;
    const sx = (at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1)) - (at(x - 1, y - 1) + 2 * at(x - 1, y) + at(x - 1, y + 1));
    const sy = (at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1)) - (at(x - 1, y - 1) + 2 * at(x, y - 1) + at(x + 1, y - 1));
    const k = 2.2, nx = -sx * k, ny = sy * k, len = Math.hypot(nx, ny, 1);
    nimg.data[o] = (nx / len * .5 + .5) * 255; nimg.data[o + 1] = (ny / len * .5 + .5) * 255; nimg.data[o + 2] = (1 / len * .5 + .5) * 255; nimg.data[o + 3] = 255;
  }
  cctx.putImageData(cimg, 0, 0); nctx.putImageData(nimg, 0, 0);
  const make = canvas => {
    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 16; t.colorSpace = THREE.NoColorSpace;
    return t;
  };
  return {data: make(colorCanvas), normal: make(normalCanvas)};
}

// Ladrilho de 16 × 32 m: R = selante de trincas (tar snakes), G = remendos, B = marcas de pneu.
function detailTexture(THREE, w, h) {
  const r = rng(4242), mpx = w / 16;
  const layer = draw => { const c = document.createElement('canvas'); c.width = w; c.height = h; const ctx = c.getContext('2d'); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h); draw(ctx); return ctx.getImageData(0, 0, w, h).data; };
  const wrapStroke = (ctx, path) => { for (const ox of [-w, 0, w]) for (const oy of [-h, 0, h]) { ctx.save(); ctx.translate(ox, oy); path(); ctx.stroke(); ctx.restore(); } };
  const tar = layer(ctx => {
    ctx.strokeStyle = '#fff'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (let k = 0; k < 26; k++) {
      let x = r() * w, y = r() * h, a = r() * TAU;
      const pts = [[x, y]];
      for (let s = 0; s < 14 + r() * 30; s++) { a += (r() - .5) * 1.4; x += Math.cos(a) * mpx * .35; y += Math.sin(a) * mpx * .35; pts.push([x, y]); }
      ctx.lineWidth = Math.max(1, mpx * (.04 + r() * .05));
      ctx.globalAlpha = .55 + r() * .45;
      wrapStroke(ctx, () => { ctx.beginPath(); pts.forEach(([px, py], i) => i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)); });
    }
  });
  const patch = layer(ctx => {
    for (let k = 0; k < 7; k++) {
      const pw = mpx * (1.5 + r() * 4), ph = mpx * (2 + r() * 6), x = r() * w, y = r() * h;
      ctx.globalAlpha = .4 + r() * .5; ctx.fillStyle = '#fff'; ctx.filter = 'blur(1px)';
      for (const ox of [-w, 0, w]) for (const oy of [-h, 0, h]) ctx.fillRect(x + ox, y + oy, pw, ph);
    }
    ctx.filter = 'none';
  });
  const skid = layer(ctx => {
    ctx.strokeStyle = '#fff'; ctx.lineCap = 'round';
    for (let k = 0; k < 5; k++) {
      const x0 = w / 2 + (r() - .5) * mpx * 5, y0 = r() * h, len = mpx * (6 + r() * 18), bend = (r() - .5) * mpx * .9, gap = mpx * 1.52;
      for (const side of [-.5, .5]) {
        ctx.lineWidth = mpx * .28; ctx.globalAlpha = .35 + r() * .35;
        wrapStroke(ctx, () => { ctx.beginPath(); ctx.moveTo(x0 + side * gap, y0); ctx.bezierCurveTo(x0 + side * gap + bend, y0 + len * .35, x0 + side * gap - bend, y0 + len * .7, x0 + side * gap + bend * .4, y0 + len); });
      }
    }
  });
  const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d'), img = ctx.createImageData(w, h);
  for (let i = 0; i < w * h * 4; i += 4) { img.data[i] = tar[i]; img.data[i + 1] = patch[i]; img.data[i + 2] = skid[i]; img.data[i + 3] = 255; }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; t.colorSpace = THREE.NoColorSpace;
  return t;
}

const BOARD_FONT = 'TrackBoard';
const ATLAS = {w: 2048, h: 1024, brand: [0, 0, 2048, 192], plain: [0, 208, 2048, 192], boards: [[0, 420, 600, 430], [712, 420, 600, 430], [1424, 420, 600, 430]]};
const rect = ([x, y, w, h]) => [x / ATLAS.w, 1 - (y + h) / ATLAS.h, w / ATLAS.w, h / ATLAS.h];

function drawAtlas(ctx, scale) {
  const S = v => v * scale;
  ctx.clearRect(0, 0, S(ATLAS.w), S(ATLAS.h));
  // Faixa com a marca: fundo grafite, emblema e nome, nada além disso.
  const [bx, by, bw, bh] = ATLAS.brand.map(S);
  ctx.fillStyle = '#101417'; ctx.fillRect(bx, by, bw, bh);
  ctx.fillStyle = 'rgba(255,255,255,.05)'; ctx.fillRect(bx, by + S(10), bw, S(2)); ctx.fillRect(bx, by + bh - S(12), bw, S(2));
  const k = S(1.22), logoW = 560 * k, ox = bx + (bw - logoW) / 2, oy = by + (bh - 96 * k) / 2;
  ctx.save(); ctx.translate(ox, oy); ctx.scale(k, k);
  ctx.fillStyle = '#d92135'; ctx.fill(new Path2D(emblem), 'evenodd');
  ctx.translate(183, 16); ctx.transform(1, 0, -Math.tan(12 * Math.PI / 180), 1, 0, 0);
  for (const [, d, accent] of glyphs) { ctx.fillStyle = accent ? '#d92135' : '#e8ebed'; ctx.fill(new Path2D(d), 'evenodd'); }
  ctx.restore();
  // Faixa lisa: grafite com um fio vermelho.
  const [px, py, pw, ph] = ATLAS.plain.map(S);
  ctx.fillStyle = '#14181b'; ctx.fillRect(px, py, pw, ph);
  ctx.fillStyle = '#a3081c'; ctx.fillRect(px, py + ph - S(30), pw, S(7));
  // Placas de frenagem.
  ['300', '200', '100'].forEach((label, i) => {
    const [x, y, w, h] = ATLAS.boards[i].map(S);
    ctx.fillStyle = '#0b0d0f'; ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#e8ebed'; ctx.lineWidth = S(14); ctx.strokeRect(x + S(24), y + S(24), w - S(48), h - S(48));
    ctx.fillStyle = '#e8ebed'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `${S(300)}px ${BOARD_FONT}, "Bebas Neue", "Arial Narrow", Impact, sans-serif`;
    ctx.fillText(label, x + w / 2, y + h / 2 + S(14));
  });
}

// --------------------------------------------------------------- pista
export function createTrack({THREE, renderer, mobile = false} = {}) {
  const root = new THREE.Group();
  root.name = 'Pista noturna';
  const clip = createWipeClip('track');
  const motion = createTrackMotion();
  const geometries = new Set(), materials = new Set(), textures = new Set();
  const helper = new THREE.Object3D();
  const own = (set, v) => { set.add(v); return v; };

  // Uniforms compartilhados por todos os materiais que rolam.
  const roll = {uTravel: {value: 0}, uLoop: {value: TRACK_LOOP}, uTime: {value: 0}, uSmear: {value: 0}};
  const pools = {uPoolColor: {value: new THREE.Color('#dfe9ff')}, uPoolGain: {value: .3}};
  const fogColor = new THREE.Color('#0b1014');

  const rolling = (material, key) => {
    material.onBeforeCompile = shader => {
      Object.assign(shader.uniforms, roll);
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nuniform float uTravel;\nuniform float uLoop;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\n' + ROLL_VERTEX);
      material.userData.extraVertex?.(shader);
    };
    material.customProgramCacheKey = () => 'track-roll-' + key;
    return own(materials, material);
  };
  const instanced = (geometry, material, count, name) => {
    const mesh = new THREE.InstancedMesh(own(geometries, geometry), material, count);
    mesh.name = name; mesh.frustumCulled = false; root.add(mesh);
    return mesh;
  };
  const place = (mesh, i, x, y, along, {rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1} = {}) => {
    helper.position.set(x, y, along); helper.rotation.set(rx, ry, rz); helper.scale.set(sx, sy, sz); helper.updateMatrix();
    mesh.setMatrixAt(i, helper.matrix);
  };
  const rowCount = row => Math.round(TRACK_LOOP / TRACK_ROWS[row].spacing);

  // ---------------------------------------------------------------- céu
  {
    const material = own(materials, new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      uniforms: {uTime: roll.uTime, uHorizon: {value: new THREE.Color('#0b1014')}, uZenith: {value: new THREE.Color('#05070a')}, uGlow: {value: new THREE.Color('#ff8a2a')}},
      vertexShader: /* glsl */`
        varying vec3 vDir;
        void main(){
          vDir = position;
          vec4 p = projectionMatrix * vec4(mat3(viewMatrix) * position, 1.);
          gl_Position = vec4(p.xy, p.w * .99998, p.w);
        }`,
      fragmentShader: /* glsl */`
        uniform vec3 uHorizon, uZenith, uGlow;
        uniform float uTime;
        varying vec3 vDir;
        ${WIPE_SHADER_CHUNK}
        float sHash(float n){return fract(sin(n*12.9898)*43758.5453);}
        float sNoise(float u, float period){float i=floor(u),f=fract(u);f=f*f*(3.-2.*f);return mix(sHash(mod(i,period)),sHash(mod(i+1.,period)),f);}
        void main(){
          wipeDiscard();
          vec3 d = normalize(vDir);
          float el = d.y;
          float u = atan(d.x, d.z) / 6.2831853 + .5;
          vec3 col = mix(uHorizon, uZenith, smoothstep(.0, .5, el));
          // Clarão âmbar baixo da cidade e do próprio circuito, mais forte à esquerda (arquibancada).
          float side = .55 + .45 * smoothstep(-.2, -.9, d.x);
          float haze = exp(-max(el, 0.) * 24.) * (.55 + .45 * sNoise(u * 9., 9.)) * side;
          col += uGlow * haze * .022;
          col += vec3(.45, .6, .75) * exp(-max(el, 0.) * 40.) * .01;
          // Silhueta distante: morros, prédios e estruturas do autódromo.
          float h = .004 + .012 * sNoise(u * 38., 38.) + .01 * step(.62, sNoise(u * 150., 150.)) * sNoise(u * 600., 600.);
          float fw = max(fwidth(el), 1e-5);
          float sil = 1. - smoothstep(h - fw, h + fw, el);
          col = mix(col, uHorizon * .6, sil);
          // Luzes distantes dentro da silhueta; algumas vermelhas de balizamento piscam.
          vec2 g = vec2(u * 2400., el * 380.);
          vec2 cell = floor(g), f = fract(g) - .5;
          float rnd = fract(sin(dot(cell, vec2(41.3, 289.1))) * 43758.5453);
          float lit = step(.965, rnd) * sil * step(.0, el);
          float dist = length(f * vec2(1., 380. / 2400. * 6.3));
          float spot = 1. - smoothstep(.06, .06 + fwidth(g.x) * 1.2, dist);
          vec3 tint = rnd > .993 ? vec3(1., .08, .1) * (.5 + .5 * step(.0, sin(uTime * 3.1 + rnd * 40.))) : mix(vec3(1., .62, .3), vec3(.75, .86, 1.), step(.982, rnd));
          col += tint * lit * spot * 1.4;
          gl_FragColor = vec4(col, 1.);
        }`,
    }));
    const sky = new THREE.Mesh(own(geometries, new THREE.SphereGeometry(1, 48, 24)), material);
    sky.name = 'Céu'; sky.frustumCulled = false; sky.renderOrder = -10;
    root.add(sky);
  }

  // --------------------------------------------------------------- solo
  const texSize = mobile ? 512 : 1024;
  const asphalt = asphaltTextures(THREE, texSize);
  const detail = detailTexture(THREE, mobile ? 256 : 512, mobile ? 512 : 1024);
  textures.add(asphalt.data); textures.add(asphalt.normal); textures.add(detail);
  {
    const material = new THREE.MeshStandardMaterial({color: '#ffffff', roughness: 1, metalness: 0, envMapIntensity: .15});
    const groundUniforms = {uAsphalt: {value: asphalt.data}, uAsphaltN: {value: asphalt.normal}, uDetail: {value: detail}};
    material.onBeforeCompile = shader => {
      Object.assign(shader.uniforms, roll, pools, groundUniforms);
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vTrackW;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvTrackW = (modelMatrix * vec4(transformed, 1.)).xyz;');
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>
varying vec3 vTrackW;
uniform float uTravel, uSmear;
uniform sampler2D uAsphalt, uAsphaltN, uDetail;
${NOISE_GLSL}
${POOLS_GLSL}
float trBand(float x, float a, float b, float fw){return smoothstep(a-fw,a+fw,x)-smoothstep(b-fw,b+fw,x);}
float trRough; vec2 trUv, trGx, trGy; float trTrack, trRun, trLine, trGrass;`)
        .replace('#include <map_fragment>', /* glsl */`
{
  float x = vTrackW.x, along = vTrackW.z + uTravel;
  trUv = vec2(x, along) * .25;
  trGx = dFdx(trUv); trGy = dFdy(trUv);
  // Desfoque de obturador na própria amostragem: o gradiente cresce ao longo da pista.
  float s = uSmear * .25;
  if (abs(trGx.y) > abs(trGy.y)) trGx.y += trGx.y < 0. ? -s : s; else trGy.y += trGy.y < 0. ? -s : s;
  vec4 agg = textureGrad(uAsphalt, trUv, trGx, trGy);
  vec4 det = texture(uDetail, vec2((x + 8.) / 16., along / 32.));
  float fw = max(fwidth(x), 1e-3);
  trLine = trBand(x, -6.4, -6.2, fw) + trBand(x, 8.2, 8.4, fw);
  trTrack = trBand(x, -6.2, 8.2, fw);
  trRun = trBand(x, -10.6, -6.4, fw) + trBand(x, 8.4, 16.2, fw);
  trGrass = clamp(1. - trLine - trTrack - trRun, 0., 1.);
  float lowN = trNoise(vec2(x * .25, along * .125), 80.);
  float midN = trNoise(vec2(x * 1.3, along * .5), 320.);
  float racing = exp(-x * x / 5.1);
  float grooves = exp(-pow((abs(x) - .76) / .22, 2.));
  float tar = det.r * trTrack, repair = det.g, skid = det.b * trTrack;
  // Albedo de asfalto velho (≈ .03): o AgX do pós levanta o preto, então o valor nasce baixo.
  vec3 road = vec3(.03, .031, .033) * (.45 + 1.1 * agg.r) * (.82 + .36 * lowN);
  road *= 1. - .3 * racing - .2 * grooves * (.6 + .4 * midN);
  road = mix(road, road * vec3(1.18, 1.16, 1.12), repair * .7);
  road *= (1. - .6 * tar) * (1. - .55 * skid);
  vec3 runoff = vec3(.07, .072, .075) * (.5 + 1. * agg.r) * (.88 + .24 * lowN);
  float wear = smoothstep(.3, .8, trNoise(vec2(x * 6., along * 3.), 1920.));
  vec3 paint = mix(vec3(.6, .61, .6) * (.8 + .3 * agg.r), road * 1.6, wear * .3);
  vec3 grass = vec3(.016, .024, .017) * (.6 + .8 * agg.r);
  diffuseColor.rgb *= road * trTrack + runoff * trRun + paint * trLine + grass * trGrass;
  trRough = .84 - .2 * racing - .1 * grooves + .22 * (agg.b - .5);
  trRough = mix(trRough, .3, tar);
  trRough = mix(trRough, .62, skid * .6);
  trRough = mix(trRough, .58, trLine);
  trRough = mix(trRough, .97, trGrass);
  trRough = clamp(trRough, .2, 1.);
}`)
        .replace('#include <roughnessmap_fragment>', 'float roughnessFactor = trRough;')
        .replace('#include <normal_fragment_maps>', /* glsl */`
{
  vec3 tn = textureGrad(uAsphaltN, trUv, trGx, trGy).xyz * 2. - 1.;
  float k = .7 * trTrack + .9 * trRun + .3 * trLine + .5 * trGrass;
  vec3 nW = normalize(vec3(tn.x * k, 1., -tn.y * k));
  normal = normalize((viewMatrix * vec4(nW, 0.)).xyz);
}`)
        // As direcionais da cena foram afinadas para o carro e lavariam o chão por igual; no asfalto
        // elas descem e as poças das torres (analíticas, todas as torres) desenham o ritmo de claro e escuro.
        .replace('#include <lights_fragment_end>', /* glsl */`#include <lights_fragment_end>
// Em ângulo rasante o especular largo das direcionais e do ambiente vira um véu cinza no asfalto
// (medido: é a maior parcela do brilho do chão). O difuso e o especular descem; as poças ficam.
reflectedLight.directDiffuse *= .2;
reflectedLight.directSpecular *= .3;
reflectedLight.indirectSpecular *= .55;
reflectedLight.directDiffuse += uPoolColor * trPools(vTrackW.z + uTravel, vTrackW.x, vTrackW.z, 0.) * 7. * material.diffuseColor;`);
    };
    material.customProgramCacheKey = () => 'track-ground-v1';
    own(materials, material);
    const ground = new THREE.Mesh(own(geometries, new THREE.PlaneGeometry(140, 320, 1, 1).rotateX(-Math.PI / 2)), material);
    ground.position.x = 2; ground.name = 'Asfalto, zebras pintadas e grama'; ground.receiveShadow = true;
    root.add(ground);
  }

  // -------------------------------------------------------------- zebras
  {
    const positions = [], normals = [], colors = [];
    const red = new THREE.Color('#b5121f'), white = new THREE.Color('#d4d6d4');
    const profile = [[0, 0], [.06, .026], [.45, .038], [1.12, .044], [1.2, 0]];
    for (let k = 0; k < 12; k++) {
      const z0 = k - 6 + .012, z1 = k - 5 - .012, c = k % 2 ? white : red;
      for (let s = 0; s < profile.length - 1; s++) {
        const [xa, ya] = profile[s], [xb, yb] = profile[s + 1];
        const nx = -(yb - ya), ny = xb - xa, len = Math.hypot(nx, ny);
        const quad = [[xa, ya, z0], [xb, yb, z1], [xb, yb, z0], [xa, ya, z0], [xa, ya, z1], [xb, yb, z1]];
        for (const [px, py, pz] of quad) { positions.push(px, py, pz); normals.push(nx / len, ny / len, 0); colors.push(c.r, c.g, c.b); }
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const material = rolling(new THREE.MeshStandardMaterial({vertexColors: true, roughness: .55, metalness: 0, envMapIntensity: .7}), 'kerb');
    const right = [406, 418, 430, 442, 454], left = [6, 18, 30, 42, 54, 66, 470, 482, 494, 506];
    const mesh = instanced(geometry, material, right.length + left.length, 'Zebras');
    right.forEach((a, i) => place(mesh, i, 8.4, 0, a));
    left.forEach((a, i) => place(mesh, right.length + i, -6.4, 0, a, {ry: Math.PI}));
    mesh.receiveShadow = true;
  }

  // ------------------------------------------------------ barreira Tecpro
  const tecproCount = rowCount('tecpro');
  {
    const geometry = mobile ? new THREE.BoxGeometry(1, 1.1, 1.56) : new RoundedBoxGeometry(1, 1.1, 1.56, 1, .07);
    const material = rolling(new THREE.MeshStandardMaterial({color: '#ffffff', roughness: .62, metalness: 0, envMapIntensity: .6}), 'tecpro');
    const mesh = instanced(geometry, material, tecproCount, 'Barreira Tecpro');
    const tones = [new THREE.Color('#1b2126'), new THREE.Color('#262d33'), new THREE.Color('#1b2126'), new THREE.Color('#5a1018')];
    for (let i = 0; i < tecproCount; i++) { place(mesh, i, -11.1, .55, i * TRACK_ROWS.tecpro.spacing); mesh.setColorAt(i, tones[i % 4]); }
    mesh.receiveShadow = true;
  }

  // ------------------------------------------------- faixas e placas (atlas)
  const atlasCanvas = document.createElement('canvas');
  const atlasScale = mobile ? .5 : 1;
  atlasCanvas.width = ATLAS.w * atlasScale; atlasCanvas.height = ATLAS.h * atlasScale;
  const atlas = own(textures, new THREE.CanvasTexture(atlasCanvas));
  atlas.colorSpace = THREE.SRGBColorSpace; atlas.anisotropy = 8;
  const redrawAtlas = () => { drawAtlas(atlasCanvas.getContext('2d'), atlasScale); atlas.needsUpdate = true; };
  redrawAtlas();
  let fontReady = Promise.resolve();
  try {
    if (typeof FontFace !== 'undefined') {
      const face = new FontFace(BOARD_FONT, `url(${import.meta.env?.BASE_URL ?? './'}fonts/BebasNeue-Regular.woff2)`);
      document.fonts.add(face);
      fontReady = face.load().then(redrawAtlas).catch(() => {});
    }
  } catch { /* a pilha de reserva já desenhou as placas */ }
  {
    const bannerCount = rowCount('banner'), boards = [[100, 0], [200, 1], [300, 2]];
    const geometry = new THREE.PlaneGeometry(1, 1);
    const rects = new Float32Array((bannerCount + boards.length) * 4);
    // Placas de LED do perímetro: acesas, viram riscos de luz quando o mundo corre.
    const material = rolling(new THREE.MeshStandardMaterial({map: atlas, emissiveMap: atlas, emissive: '#ffffff', emissiveIntensity: .85, roughness: .72, metalness: 0, envMapIntensity: .4}), 'atlas');
    material.userData.extraVertex = shader => {
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nattribute vec4 aRect;')
        .replace('#include <uv_vertex>', '#include <uv_vertex>\n#ifdef USE_MAP\nvMapUv = aRect.xy + uv * aRect.zw;\n#endif\n#ifdef USE_EMISSIVEMAP\nvEmissiveMapUv = aRect.xy + uv * aRect.zw;\n#endif');
    };
    const mesh = instanced(geometry, material, bannerCount + boards.length, 'Faixas INTEIA e placas de frenagem');
    const brand = rect(ATLAS.brand), plain = rect(ATLAS.plain);
    for (let i = 0; i < bannerCount; i++) {
      place(mesh, i, -10.58, .56, i * TRACK_ROWS.banner.spacing + 6.4, {ry: Math.PI / 2, sx: 9.6, sy: .9});
      rects.set(i % 3 === 1 ? brand : plain, i * 4);
    }
    boards.forEach(([along, cell], k) => {
      place(mesh, bannerCount + k, 12.5, 1.3, along, {ry: Math.PI, sx: 1.4, sy: 1.0});
      rects.set(rect(ATLAS.boards[cell]), (bannerCount + k) * 4);
    });
    geometry.setAttribute('aRect', new THREE.InstancedBufferAttribute(rects, 4));
    const backs = mergeGeometries([new THREE.BoxGeometry(1.52, 1.1, .05).translate(0, 1.3, .035), new THREE.BoxGeometry(.06, .76, .06).translate(-.5, .38, .05), new THREE.BoxGeometry(.06, .76, .06).translate(.5, .38, .05)]);
    const steelDark = rolling(new THREE.MeshStandardMaterial({color: '#15191c', roughness: .6, metalness: .5, envMapIntensity: .6}), 'steel-dark');
    const backMesh = instanced(backs, steelDark, boards.length, 'Suportes das placas');
    boards.forEach(([along], k) => place(backMesh, k, 12.5, 0, along));
  }

  // ---------------------------------------------------------- alambrado
  {
    const material = own(materials, new THREE.ShaderMaterial({
      fog: true, transparent: true, depthWrite: false, side: THREE.DoubleSide,
      uniforms: {...FOG_UNIFORMS(THREE), ...roll, ...pools},
      vertexShader: /* glsl */`
        varying vec3 vW;
        #include <fog_pars_vertex>
        void main(){
          vW = (modelMatrix * vec4(position, 1.)).xyz;
          vec4 mv = modelViewMatrix * vec4(position, 1.);
          gl_Position = projectionMatrix * mv;
        #ifdef USE_FOG
          vFogDepth = -mv.z;
        #endif
        }`,
      fragmentShader: /* glsl */`
        uniform float uTravel;
        varying vec3 vW;
        ${FOG_FRAGMENT}
        ${WIPE_SHADER_CHUNK}
        ${POOLS_GLSL}
        void main(){
          wipeDiscard();
          float along = vW.z + uTravel;
          vec2 p = vec2(along, vW.y) / .065;
          vec2 d = vec2(p.x + p.y, p.x - p.y) * .70710678;
          vec2 fw = max(fwidth(d), vec2(1e-4));
          vec2 dist = .5 - abs(fract(d) - .5);
          // Arame de 3 mm numa malha de 65 mm: abaixo de um pixel, a linha alarga até 1 px
          // e a intensidade cai na mesma proporção (cobertura média ≈ 2·w, não uma parede).
          const float W = .025;
          vec2 ww = max(vec2(W), fw * .5);
          vec2 cov = (1. - smoothstep(ww - fw * .5, ww + fw * .5, dist)) * (W / ww);
          float c = max(cov.x, cov.y);
          float top = smoothstep(4.25, 4.1, vW.y);
          float light = .02 + trPools(along, vW.x, vW.z, 0.) * .8;
          vec3 col = vec3(.62, .66, .7) * light;
          float fog = fogAmount();
          gl_FragColor = vec4(mix(col, fogColor, fog), c * top * .9 * (1. - fog * .6));
        }`,
    }));
    const fence = new THREE.Mesh(own(geometries, new THREE.PlaneGeometry(320, 4.3).rotateY(Math.PI / 2).translate(-12.1, 2.15, 0)), material);
    fence.name = 'Alambrado'; fence.renderOrder = 2;
    root.add(fence);
    const posts = mergeGeometries([
      new THREE.BoxGeometry(.08, 4.5, .08).translate(0, 2.25, 0),
      new THREE.BoxGeometry(.06, .06, 1.3).rotateY(Math.PI / 2).rotateZ(-.6).translate(.5, 4.75, 0),
    ]);
    const steel = rolling(new THREE.MeshStandardMaterial({color: '#6d767d', roughness: .45, metalness: .85, envMapIntensity: .9}), 'steel');
    const count = rowCount('fencePost'), mesh = instanced(posts, steel, count, 'Postes do alambrado');
    for (let i = 0; i < count; i++) place(mesh, i, -12.15, 0, i * TRACK_ROWS.fencePost.spacing + 1);
    const armcoPosts = instanced(new THREE.BoxGeometry(.1, .9, .16).translate(0, .45, 0), steel, rowCount('armcoPost'), 'Postes do guard-rail');
    for (let i = 0; i < rowCount('armcoPost'); i++) place(armcoPosts, i, 16.35, 0, i * TRACK_ROWS.armcoPost.spacing);
    // Guard-rail duplo e tubos do alambrado: contínuos, não precisam rolar.
    const wShape = new THREE.Shape();
    const W = [[0, 0], [.07, .02], [.1, .08], [.07, .14], [.07, .17], [.1, .23], [.07, .29], [0, .31]];
    wShape.moveTo(0, 0); W.forEach(([x, y]) => wShape.lineTo(x, y)); for (let i = W.length - 1; i >= 0; i--) wShape.lineTo(W[i][0] + .005, W[i][1]);
    const beam = y => new THREE.ExtrudeGeometry(wShape, {depth: 320, bevelEnabled: false, curveSegments: 1}).translate(0, 0, -160).rotateY(Math.PI).translate(16.25, y, 0);
    const railParts = [beam(.42), beam(.82), new THREE.CylinderGeometry(.04, .04, 320, 6).rotateX(Math.PI / 2).translate(-12.1, 4.3, 0), new THREE.CylinderGeometry(.03, .03, 320, 6).rotateX(Math.PI / 2).translate(-12.1, .08, 0)];
    const railMaterial = own(materials, new THREE.MeshStandardMaterial({color: '#8b949a', roughness: .38, metalness: .9, envMapIntensity: 1}));
    const rail = new THREE.Mesh(own(geometries, mergeGeometries(railParts.map(g => g.index ? g.toNonIndexed() : g))), railMaterial);
    railParts.forEach(g => g.dispose());
    rail.name = 'Guard-rail e tubos'; root.add(rail);
  }

  // -------------------------------------------------- torres de iluminação
  const towerAlong = [];
  for (let k = 0; k < TRACK_LOOP / 80; k++) { towerAlong.push([-15, 40 + k * 80, -2]); towerAlong.push([24, k * 80, 5]); }
  {
    const steel = rolling(new THREE.MeshStandardMaterial({color: '#20272c', roughness: .5, metalness: .7, envMapIntensity: .7}), 'tower');
    const poles = instanced(new THREE.CylinderGeometry(.18, .32, 25, mobile ? 6 : 10).translate(0, 12.5, 0), steel, towerAlong.length, 'Mastros das torres');
    towerAlong.forEach(([x, a], i) => place(poles, i, x, 0, a));

    const lampCanvas = document.createElement('canvas');
    lampCanvas.width = 256; lampCanvas.height = 128;
    {
      const g = lampCanvas.getContext('2d');
      g.fillStyle = '#05070a'; g.fillRect(0, 0, 256, 128);
      for (let j = 0; j < 3; j++) for (let i = 0; i < 6; i++) {
        const cx = 22 + i * 42.4, cy = 22 + j * 42, rg = g.createRadialGradient(cx, cy, 0, cx, cy, 19);
        rg.addColorStop(0, '#ffffff'); rg.addColorStop(.55, '#dfe8ff'); rg.addColorStop(.8, 'rgba(120,140,170,.35)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = rg; g.fillRect(cx - 20, cy - 20, 40, 40);
      }
    }
    const lampMap = own(textures, new THREE.CanvasTexture(lampCanvas));
    lampMap.colorSpace = THREE.SRGBColorSpace;
    const lampMaterial = rolling(new THREE.MeshBasicMaterial({map: lampMap, color: new THREE.Color(1, 1, 1).multiplyScalar(9)}), 'lamp');
    const frames = instanced(new THREE.BoxGeometry(5.4, 2.9, .4), steel, towerAlong.length, 'Cabeças das torres');
    const lamps = instanced(new THREE.PlaneGeometry(5, 2.5).translate(0, 0, .21), lampMaterial, towerAlong.length, 'Refletores');
    const beaconMaterial = rolling(new THREE.MeshBasicMaterial({color: new THREE.Color(1, .05, .06).multiplyScalar(5)}), 'beacon');
    const beacons = instanced(new THREE.IcosahedronGeometry(.16, 0), beaconMaterial, towerAlong.length, 'Balizamento');
    const beamMaterial = own(materials, new THREE.ShaderMaterial({
      fog: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      uniforms: {...FOG_UNIFORMS(THREE), ...roll, uGain: {value: mobile ? .03 : .04}, uColor: {value: new THREE.Color('#cfdcff')}},
      vertexShader: /* glsl */`
        uniform float uTravel, uLoop;
        varying float vLen;
        varying vec3 vN, vV;
        #include <fog_pars_vertex>
        void main(){
          vec3 transformed = position;
          ${ROLL_VERTEX}
          vec4 mv = modelViewMatrix * instanceMatrix * vec4(transformed, 1.);
          gl_Position = projectionMatrix * mv;
          vLen = position.z;
          vN = normalize(normalMatrix * mat3(instanceMatrix) * normal);
          vV = -mv.xyz;
        #ifdef USE_FOG
          vFogDepth = -mv.z;
        #endif
        }`,
      fragmentShader: /* glsl */`
        uniform float uGain;
        uniform vec3 uColor;
        varying float vLen;
        varying vec3 vN, vV;
        ${FOG_FRAGMENT}
        ${WIPE_SHADER_CHUNK}
        void main(){
          wipeDiscard();
          float facing = abs(dot(normalize(vN), normalize(vV)));
          // Some antes do chão e perto da lente: dentro do cone a câmera veria só um polígono.
          float along = pow(1. - vLen, 1.6) * smoothstep(0., .06, vLen);
          float a = pow(facing, 3.) * along * smoothstep(14., 45., length(vV)) * uGain;
          gl_FragColor = vec4(uColor * a * (1. - fogAmount() * .8), 1.);
        }`,
    }));
    const beamGeometry = new THREE.ConeGeometry(1, 1, mobile ? 12 : 20, 1, true).translate(0, -.5, 0).rotateX(-Math.PI / 2);
    const beams = instanced(beamGeometry, beamMaterial, towerAlong.length, 'Fachos de luz');
    beams.renderOrder = 3;
    const target = new THREE.Vector3();
    towerAlong.forEach(([x, a, cx], i) => {
      helper.position.set(x, 24.4, a); helper.scale.set(1, 1, 1);
      helper.lookAt(target.set(cx, 0, a + 4)); helper.updateMatrix();
      frames.setMatrixAt(i, helper.matrix); lamps.setMatrixAt(i, helper.matrix);
      const length = helper.position.distanceTo(target);
      helper.scale.set(6.5, 5, length); helper.updateMatrix(); beams.setMatrixAt(i, helper.matrix);
      place(beacons, i, x, 26.1, a);
    });
    root.userData.beaconMaterial = beaconMaterial;
  }

  // ------------------------------------------------------- arquibancada
  {
    const seats = new THREE.Shape([[-22.6, 0], [-22.6, 1.7], ...Array.from({length: 15}, (_, k) => [[-23.4 - k * 1.2, 1.7 + k * .72], [-23.4 - k * 1.2, 2.42 + k * .72]]).flat(), [-41.6, 12.5], [-42.4, 12.5], [-42.4, 0]].map(([x, y]) => new THREE.Vector2(x, y)));
    const roof = new THREE.Shape([[-21, 17.6], [-43.5, 18.8], [-43.5, 19.3], [-21, 18]].map(([x, y]) => new THREE.Vector2(x, y)));
    const parts = [seats, roof].map(shape => new THREE.ExtrudeGeometry(shape, {depth: 96, bevelEnabled: false}).translate(0, 0, -48));
    for (const x of [-42, -30]) for (let z = -44; z <= 44; z += 22) parts.push(new THREE.BoxGeometry(.5, 19, .5).translate(x, 9.5, z));
    const geometry = mergeGeometries(parts.map(g => g.index ? g.toNonIndexed() : g));
    parts.forEach(g => g.dispose());
    const material = own(materials, new THREE.ShaderMaterial({
      fog: true,
      uniforms: {...FOG_UNIFORMS(THREE), ...roll},
      vertexShader: /* glsl */`
        uniform float uTravel, uLoop;
        varying vec3 vL;
        #include <fog_pars_vertex>
        void main(){
          vec3 transformed = position;
          ${ROLL_VERTEX}
          vL = position;
          vec4 mv = modelViewMatrix * instanceMatrix * vec4(transformed, 1.);
          gl_Position = projectionMatrix * mv;
        #ifdef USE_FOG
          vFogDepth = -mv.z;
        #endif
        }`,
      fragmentShader: /* glsl */`
        varying vec3 vL;
        ${FOG_FRAGMENT}
        ${WIPE_SHADER_CHUNK}
        void main(){
          wipeDiscard();
          vec3 col = vec3(.011, .013, .015);
          // Degraus iluminados de cima: a cobertura acende a parte alta.
          float rows = smoothstep(.5, .9, fract(vL.y / .72)) * step(1.7, vL.y) * step(vL.y, 12.5) * step(vL.x, -22.7);
          col += vec3(.05, .045, .04) * rows * smoothstep(1., 12., vL.y);
          float aisle = step(.93, fract(vL.z / 8.));
          col *= 1. - .6 * aisle;
          // Linha de luz sob a cobertura (âmbar) e uma lâmpada fria por vão.
          float under = smoothstep(.35, 0., abs(vL.y - 17.75)) * step(vL.x, -21.2);
          float bays = .6 + .4 * smoothstep(.2, 0., abs(fract(vL.z / 11.) - .5));
          col += vec3(1., .62, .28) * under * bays * 2.4;
          col += vec3(.02, .025, .03) * step(18.2, vL.y);
          float fog = fogAmount();
          gl_FragColor = vec4(mix(col, fogColor, fog * .92), 1.);
        }`,
    }));
    const mesh = instanced(own(geometries, geometry), material, 2, 'Arquibancada');
    place(mesh, 0, 0, 0, 160); place(mesh, 1, 0, 0, 480);
  }

  // ----------------------------------------------------- luzes distantes
  {
    const count = mobile ? 60 : 130, r = rng(9901);
    const pos = new Float32Array(count * 3), color = new Float32Array(count * 3), size = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const left = r() < .55;
      pos[i * 3] = left ? -55 - r() * 45 : 45 + r() * 60;
      pos[i * 3 + 1] = 1.5 + r() * r() * 22;
      pos[i * 3 + 2] = r() * TRACK_LOOP;
      const warm = r() < .6, k = .8 + r() * 2.2;
      color.set(warm ? [1 * k, .56 * k, .24 * k] : [.7 * k, .82 * k, 1 * k], i * 3);
      size[i] = .5 + r() * 1.1;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(color, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    const material = own(materials, new THREE.ShaderMaterial({
      fog: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: {...FOG_UNIFORMS(THREE), ...roll, uResY: {value: 900}},
      vertexShader: /* glsl */`
        uniform float uTravel, uLoop, uResY;
        attribute vec3 aColor;
        attribute float aSize;
        varying vec3 vColor;
        #include <fog_pars_vertex>
        void main(){
          vec3 p = position;
          p.z = mod(p.z - uTravel + .5 * uLoop, uLoop) - .5 * uLoop;
          vec4 mv = modelViewMatrix * vec4(p, 1.);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = clamp(aSize * projectionMatrix[1][1] * uResY * .5 / max(-mv.z, 1.), 2., 12.);
          vColor = aColor;
        #ifdef USE_FOG
          vFogDepth = -mv.z;
        #endif
        }`,
      fragmentShader: /* glsl */`
        varying vec3 vColor;
        ${FOG_FRAGMENT}
        ${WIPE_SHADER_CHUNK}
        void main(){
          wipeDiscard();
          vec2 q = gl_PointCoord - .5;
          float a = exp(-dot(q, q) * 22.);
          gl_FragColor = vec4(vColor * a * (1. - fogAmount() * .55), 1.);
        }`,
    }));
    const points = new THREE.Points(own(geometries, geometry), material);
    points.name = 'Luzes distantes'; points.frustumCulled = false;
    root.add(points);
    root.userData.distantLights = material;
  }

  // ---------------------------------------------------------- luzes reais
  const spots = [[-15, 40, -2, 1100], [24, 0, 5, 800]].map(([x, along, cx, intensity]) => {
    const light = new THREE.SpotLight('#e2ebff', 0, 0, .62, .85, 2);
    light.position.set(x, 24.4, 0);
    light.target.position.set(cx, 0, 4);
    light.userData = {along, cx, intensity};
    light.name = 'Refletor da torre mais próxima';
    root.add(light, light.target);
    return light;
  });

  clip.patchObject(root);

  // ------------------------------------------------ ambiente para PMREM
  let envTarget = null;
  const envScene = new THREE.Scene();
  {
    const Y = -.55;
    const add = (geometry, color, position, rotation) => {
      const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color, side: THREE.DoubleSide}));
      mesh.position.set(...position);
      if (rotation) mesh.rotation.set(...rotation);
      envScene.add(mesh);
      return mesh;
    };
    const dome = new THREE.SphereGeometry(600, 32, 16), cols = [];
    const horizon = new THREE.Color('#0b1014'), zenith = new THREE.Color('#040608'), glow = new THREE.Color('#ff8a2a').multiplyScalar(.12), tmp = new THREE.Color();
    const p = dome.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const el = Math.max(0, p.getY(i) / 600);
      tmp.copy(horizon).lerp(zenith, Math.min(1, el * 2.2)).add(new THREE.Color().copy(glow).multiplyScalar(Math.exp(-el * 12)));
      cols.push(tmp.r, tmp.g, tmp.b);
    }
    dome.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    const domeMesh = add(dome, '#ffffff', [0, 0, 0]);
    domeMesh.material.vertexColors = true; domeMesh.material.side = THREE.BackSide;
    add(new THREE.PlaneGeometry(1200, 1200), new THREE.Color('#050607'), [0, Y - .01, 0], [-Math.PI / 2, 0, 0]);
    add(new THREE.PlaneGeometry(14.6, 1200), new THREE.Color('#0d0f11'), [1, Y, 0], [-Math.PI / 2, 0, 0]);
    // Fileiras de refletores ao longo de Z: na pintura viram riscos compridos.
    add(new THREE.BoxGeometry(1.2, .7, 1200), new THREE.Color('#dfe8ff').multiplyScalar(9), [-15, 24.4 + Y, 0]);
    add(new THREE.BoxGeometry(1.2, .7, 1200), new THREE.Color('#dfe8ff').multiplyScalar(6), [24, 24.4 + Y, 0]);
    add(new THREE.BoxGeometry(.8, .25, 1200), new THREE.Color('#ffa257').multiplyScalar(2.2), [-24, 17.7 + Y, 0]);
    add(new THREE.BoxGeometry(.2, .35, 1200), new THREE.Color('#d92135').multiplyScalar(.45), [-10.6, .56 + Y, 0]);
    add(new THREE.BoxGeometry(.2, .12, 1200), new THREE.Color('#9aa3a9').multiplyScalar(.5), [16.2, .8 + Y, 0]);
    if (renderer) {
      const pmrem = new THREE.PMREMGenerator(renderer);
      envTarget = pmrem.fromScene(envScene, .035, .1, 1400);
      pmrem.dispose();
    }
    envScene.traverse(o => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
  }

  root.traverse(o => { if (o.isMesh) o.castShadow = false; });
  const beaconBase = root.userData.beaconMaterial.color.clone();
  const buffer = new THREE.Vector2();

  return {
    root,
    clip,
    envTexture: envTarget?.texture ?? null,
    fog: {color: '#0b1014', near: 16, far: 120},
    cameraFar: 150,
    motion,
    lights: spots,
    // uTravel/uTime/uSmear compartilhados e o ganho das poças das torres (dimmer no wipe, se preciso).
    uniforms: {roll, pools},
    ready: fontReady,
    get wheelAngle() { return motion.wheelAngle; },
    update(time, dt, speed) {
      motion.step(dt, speed);
      roll.uTravel.value = motion.travel;
      roll.uTime.value = time;
      // Meio quadro a 60 fps de arrasto na amostragem do asfalto (antisserrilhado, não o blur).
      roll.uSmear.value = Math.min(1.2, motion.velocity / 120);
      for (const light of spots) {
        const u = light.userData;
        let z = (u.along - motion.travel + 40) % 80;   // wrapAlong(along, travel, 80) sem chamada
        if (z < 0) z += 80;
        z -= 40;
        light.position.z = z;
        light.target.position.z = z + 4;
        const w = Math.min(1, Math.max(0, (Math.abs(z) - 25) / 15));
        light.intensity = u.intensity * (1 - w * w * (3 - 2 * w));
      }
      const blink = Math.sin(time * Math.PI * .9) > .2 ? 1 : .06;
      root.userData.beaconMaterial.color.copy(beaconBase).multiplyScalar(blink);
      if (renderer) root.userData.distantLights.uniforms.uResY.value = renderer.getDrawingBufferSize(buffer).y;
      return motion;
    },
    dispose() {
      root.removeFromParent();
      root.traverse(o => { if (o.geometry) geometries.add(o.geometry); if (o.material) materials.add(o.material); if (o.isLight) o.dispose?.(); });
      geometries.forEach(g => g.dispose());
      materials.forEach(m => m.dispose());
      textures.forEach(t => t.dispose());
      envTarget?.dispose();
    },
  };
}
