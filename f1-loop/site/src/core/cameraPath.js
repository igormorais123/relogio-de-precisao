import { N } from '../data/narrativa.js'

const clamp = (v) => Math.max(0, Math.min(1, v))
const smooth = (v) => { const x = clamp(v); return x * x * (3 - 2 * x) }
const segment = (v, a, b) => smooth((v - a) / (b - a))
const mix = (a, b, t) => a + (b - a) * t
const TRANSITION = 0.18

function pose(chapter, local, portrait) {
  const p = { camera: [0, 0.35, 7.2], target: [0, 0.15, 0], light: [3.2, 4.2, 5.2], heroX: 1, heroY: 1, rotation: 0, yaw: 0.35, bokeh: 2.8, bloom: 0.18, side: 1 }
  switch (chapter) {
    case 0:
      p.camera = [0.25, 0.28 + 0.22 * segment(local, 0.18, 0.5), 7.15]
      p.rotation = mix(-0.55, -0.2, segment(local, 0.05, 0.55))
      p.yaw = mix(0.15, 0.4, segment(local, 0.2, 0.7))
      p.bokeh = 3.1
      break
    case 1:
      p.camera = [-1.05, 0.82, 7.05]
      p.target = [0.1, 0.1, 0]
      p.light = [-2.5, 5, 3]
      p.rotation = 0.15
      p.yaw = 1.15
      p.bokeh = 2.2
      p.side = -1
      break
    case 2:
      p.camera = [0.95, 0.62, 6.95]
      p.light = [4, 3.2, 5]
      p.rotation = -0.18
      p.yaw = 0.55
      p.bloom = 0.16
      break
    case 3:
      p.camera = [-1.0, mix(0.85, 0.38, segment(local, 0.45, 0.7)), 7.15]
      p.target = [0.15, 0.08, 0]
      p.rotation = mix(0.1, 0.35, segment(local, 0.3, 0.7))
      p.yaw = mix(0.9, 0.2, segment(local, 0.2, 0.75))
      p.side = -1
      break
    case 4:
      p.camera = [-0.85, 1.15, 7.05]
      p.target = [0, 0.2, 0]
      p.light = [-3, 4, 4]
      p.bokeh = mix(2.4, 1.6, segment(local, 0.5, 0.65))
      p.side = -1
      break
    case 5:
      p.camera = [1.05, 1.45, 7.35]
      p.target = [0.2, 0.1, 0]
      p.rotation = -0.08
      p.yaw = 0.25
      break
    case 6:
      p.camera = [mix(0.45, -0.2, segment(local, 0.7, 0.95)), mix(0.55, 1.8, segment(local, 0.72, 0.97)), mix(6.7, 8.4, segment(local, 0.72, 0.97))]
      p.bloom = 0.18 + segment(local, 0.75, 1) * 0.4
      p.rotation = mix(-0.1, 0, segment(local, 0.8, 1))
      break
  }
  if (portrait) {
    p.camera[2] += 0.4
    p.camera[1] += 0.15
  }
  return p
}

export function sampleCameraPose(chapter, local, { portrait = false, reduced = false } = {}) {
  const last = Math.max(0, N - 1)
  const ch = Math.max(0, Math.min(last, Math.trunc(chapter)))
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
    const arc = Math.sin(Math.PI * blend) ** 2
    current.camera[0] += (ch % 2 ? 1 : -1) * arc * (portrait ? 0.12 : 0.38)
    current.camera[1] += arc * 0.28
  }
  if (reduced) {
    current.camera = [0, 0.35, 7.4]
    current.target = [0, 0.15, 0]
    current.rotation = 0
    current.yaw = 0.2
    current.bokeh = 1.6
    current.bloom = 0.12
  }
  return current
}
