import * as THREE from 'three'

// Engrenagem procedural: perfil dentado por Shape + furo central + raios opcionais, extrudada.
export function gearGeometry({ teeth = 24, radius = 1, depth = 0.08, toothHeight = 0.12, hole = 0.12, spokes = 0, spokeWidth = 0.14, rim = radius * 0.3 }) {
  const shape = new THREE.Shape()
  const steps = teeth * 4
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2
    const k = i % 4
    const r = radius + (k === 1 || k === 2 ? toothHeight : 0)
    const x = Math.cos(a) * r, y = Math.sin(a) * r
    if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y)
  }
  const holePath = new THREE.Path()
  holePath.absarc(0, 0, hole, 0, Math.PI * 2, true)
  shape.holes.push(holePath)
  const innerSpoke = hole + 0.08, outerSpoke = radius - rim
  if (spokes > 0 && outerSpoke > innerSpoke + 0.03) {
    const inner = innerSpoke, outer = outerSpoke
    for (let s = 0; s < spokes; s++) {
      const a0 = (s / spokes) * Math.PI * 2 + spokeWidth, a1 = ((s + 1) / spokes) * Math.PI * 2 - spokeWidth
      const p = new THREE.Path()
      p.moveTo(Math.cos(a0) * inner, Math.sin(a0) * inner)
      p.lineTo(Math.cos(a0) * outer, Math.sin(a0) * outer)
      p.absarc(0, 0, outer, a0, a1, false)
      p.lineTo(Math.cos(a1) * inner, Math.sin(a1) * inner)
      p.absarc(0, 0, inner, a1, a0, true)
      shape.holes.push(p)
    }
  }
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 2, curveSegments: 6 })
  geo.center()
  return geo
}

// Espiral do balanço (hairspring): tubo fino em espiral de Arquimedes.
export function hairspringGeometry({ turns = 9, r0 = 0.06, r1 = 0.42, tube = 0.006, segments = 600 }) {
  const pts = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const a = t * turns * Math.PI * 2
    const r = r0 + (r1 - r0) * t
    pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0))
  }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), segments, tube, 6, false)
}

// Coroa serrilhada.
export function crownGeometry({ radius = 0.16, height = 0.16, knurls = 28 }) {
  const shape = new THREE.Shape()
  const steps = knurls * 2
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2
    const r = radius + (i % 2 ? 0.014 : 0)
    if (i === 0) shape.moveTo(Math.cos(a) * r, Math.sin(a) * r); else shape.lineTo(Math.cos(a) * r, Math.sin(a) * r)
  }
  const geo = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2 })
  geo.center()
  geo.rotateY(Math.PI / 2)
  return geo
}

// Mostrador com índices e minuteria desenhados em canvas (textura).
export function dialTexture(size = 1024, accent = '#d3a94f') {
  const c = document.createElement('canvas'); c.width = c.height = size
  const g = c.getContext('2d')
  const cx = size / 2, R = size * 0.47
  const grad = g.createRadialGradient(cx, cx, R * 0.1, cx, cx, R)
  grad.addColorStop(0, '#12151a'); grad.addColorStop(1, '#070a0e')
  g.fillStyle = grad; g.beginPath(); g.arc(cx, cx, R, 0, Math.PI * 2); g.fill()
  // Textura de pincelado radial sutil
  g.globalAlpha = 0.06; g.strokeStyle = '#ffffff'; g.lineWidth = 1
  for (let i = 0; i < 720; i++) { const a = (i / 720) * Math.PI * 2; g.beginPath(); g.moveTo(cx + Math.cos(a) * R * 0.2, cx + Math.sin(a) * R * 0.2); g.lineTo(cx + Math.cos(a) * R, cx + Math.sin(a) * R); g.stroke() }
  g.globalAlpha = 1
  // Minuteria
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2 - Math.PI / 2
    const long = i % 5 === 0
    g.strokeStyle = long ? accent : 'rgba(233,228,216,.55)'; g.lineWidth = long ? size * 0.006 : size * 0.002
    const r0 = R * (long ? 0.86 : 0.9), r1 = R * 0.95
    g.beginPath(); g.moveTo(cx + Math.cos(a) * r0, cx + Math.sin(a) * r0); g.lineTo(cx + Math.cos(a) * r1, cx + Math.sin(a) * r1); g.stroke()
  }
  // Numerais 12, 3, 6, 9 e marca
  g.fillStyle = '#e9e4d8'; g.textAlign = 'center'; g.textBaseline = 'middle'
  g.font = `${size * 0.075}px "Bebas Neue", "Arial Narrow", sans-serif`
  const num = { 12: [0, -1], 3: [1, 0], 6: [0, 1], 9: [-1, 0] }
  for (const [n, [x, y]] of Object.entries(num)) g.fillText(n, cx + x * R * 0.74, cx + y * R * 0.74)
  g.font = `${size * 0.04}px "Bebas Neue", "Arial Narrow", sans-serif`; g.fillStyle = accent
  g.fillText('RELÓGIO DE PRECISÃO', cx, cx + R * 0.42)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 16
  return tex
}
