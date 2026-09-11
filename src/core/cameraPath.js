// Pure choreography. Local progress is reversible; no previous-frame state is needed.
const clamp = (v) => Math.max(0, Math.min(1, v))
const smooth = (v) => { const x = clamp(v); return x * x * (3 - 2 * x) }
const segment = (v, a, b) => smooth((v - a) / (b - a))
const mix = (a, b, t) => a + (b - a) * t
const TRANSITION = 0.18

function pose(chapter, local, portrait) {
  const p = { camera: [0, 0.2, 7], target: [0, 0, 0], light: [3, 4, 5], heroX: 1, heroY: 1, rotation: 0, yaw: 0, bokeh: 3.4, bloom: 0.1, side: 1, radius: 1.6, maxScale: 0.84, layoutWeight: 1, portraitScale: chapter === 4 ? 0.54 : 0.62 }
  switch (chapter) {
    case 0:
      p.camera = [0.35, 0.3, 6.9 - 0.4 * segment(local, 0.05, 0.4)]
      p.heroX = portrait ? 1 : mix(0.45, 1, segment(local, 0.05, 0.4))
      p.rotation = mix(-0.35, -0.15, segment(local, 0.05, 0.4)); p.bokeh = 2.8
      break
    case 1:
      p.camera = [-0.6, 0.8, 7.6]; p.target = [0, 0.1, 0]; p.light = [-3, 5, 4]
      p.heroX = 0.55; p.heroY = 0.75; p.bokeh = 2.2; p.layoutWeight = 0
      break
    case 2:
      p.camera = [0.9, -0.5, 7.3]; p.target = [0.2, 0, 0]; p.light = [4, 2, 6]
      p.heroX = 1.1; p.heroY = 0.95; p.rotation = -0.1; p.yaw = 0.85; p.bokeh = 2.4; p.radius = 2; p.maxScale = 0.72
      break
    case 3: {
      const assembly = segment(local, 0.05, 0.75)
      p.camera = [0.5, 0.1, 7.1 - assembly * 0.4]; p.light = [2, 5, 4]
      p.rotation = mix(-0.4, 0, assembly)
      break
    }
    case 4:
      p.camera = [0, 0.1, 7]; p.light = [-2.5, 4.5, 5]
      p.heroY = portrait ? 1.42 : 0.95; p.rotation = 0.15; p.bokeh = 2.6
      break
    case 5:
      p.camera = [-0.4, 0.6, 7.1 - segment(local, 0.85, 1) * 0.7]; p.light = [3, 6, 3]
      p.heroY = 0.95; p.rotation = -0.2 + segment(local, 0.8, 1) * 0.2
      p.bloom = 0.1 + segment(local, 0.75, 1) * 0.45
      break
  }
  if (!portrait && chapter % 2 === 1) {
    p.side = -1
    p.camera[0] = -p.camera[0] || 0; p.target[0] = -p.target[0] || 0; p.light[0] = -p.light[0] || 0
    p.rotation = -p.rotation || 0; p.yaw = -p.yaw || 0
  }
  return p
}

export function sampleCameraPose(chapter, local, { portrait = false, reduced = false } = {}) {
  const ch = Math.max(0, Math.min(5, Math.trunc(chapter)))
  const t = clamp(local)
  const current = pose(ch, t, portrait)
  if (ch > 0 && t < TRANSITION) {
    const previous = pose(ch - 1, 1, portrait)
    const next = pose(ch, TRANSITION, portrait)
    const blend = smooth(t / TRANSITION)
    for (const key of Object.keys(current)) {
      current[key] = Array.isArray(current[key])
        ? previous[key].map((v, i) => mix(v, next[key][i], blend))
        : mix(previous[key], next[key], blend)
    }
    // Gentle orbit between two stable views. Zero amplitude and speed at either end.
    const arc = Math.sin(Math.PI * blend) ** 2
    const amplitude = portrait ? 0.12 : 0.4
    current.camera[0] += (ch % 2 ? 1 : -1) * arc * amplitude
    current.camera[1] += arc * amplitude * 0.35
    if (!portrait) current.camera[2] += arc * 0.22
  }
  if (reduced) {
    current.camera = [0, 0.2, 7.3]
    current.target = [0, 0, 0]
    current.rotation = 0
    current.bokeh = 1.8
    current.bloom = 0.1
  }
  return current
}
