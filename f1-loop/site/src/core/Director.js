import * as THREE from 'three'
import { CAPITULOS, N } from '../data/narrativa.js'
import { Title } from './Title.js'
import { sampleCameraPose } from './cameraPath.js'

const { lerp, clamp, smoothstep } = THREE.MathUtils
const ease = (t) => smoothstep(t, 0, 1)
const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1)

export class Director {
  constructor(app, scroll, car, background) {
    this.app = app
    this.scroll = scroll
    this.car = car
    this.bg = background
    app.overlay.add(app.camera)
    this.titles = CAPITULOS.map((c) => new Title(app.camera, { text: c.titulo, body: c.corpo, accent: c.acento }))
    this.camPos = new THREE.Vector3(0, 0.35, 7.2)
    this.heroPos = new THREE.Vector3()
    this.layoutSide = 1
    this.keepFloor = false
    this.scenario = 'cfd'
    this.zeroPointer = new THREE.Vector2()
    this.tmpColor = new THREE.Color()
    this.layout()
    addEventListener('resize', () => this.layout())
  }

  layout() {
    const p = this.app.isPortrait
    this.isPortrait = p
    this.titles.forEach((t) => t.setLayout(p))
    const cam = this.app.camera
    const dist = 5.6
    const halfH = dist * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2))
    const halfW = halfH * cam.aspect
    const scale = p ? Math.min(1, halfW / 1.9) : Math.min(0.9, halfW / 3.2)
    this.titles.forEach((t) => t.group.scale.setScalar(scale))
    this.textPos = p ? new THREE.Vector3(-halfW * 0.84, halfH * 0.48, -dist) : new THREE.Vector3(-halfW * 0.86, 0.08, -dist)
    this.heroSide = p ? new THREE.Vector3(0, -halfH * 0.42, 0) : new THREE.Vector3(halfW * 0.42, -0.08, 0)
  }

  setScenario(nome) { this.scenario = nome }
  setKeepFloor(v) { this.keepFloor = v }

  update(dt) {
    const s = this.scroll
    const ch = s.chapter
    const L = s.local
    const w = this.car.state
    const bgA = CAPITULOS[ch]
    const bgB = CAPITULOS[Math.min(N - 1, ch + 1)]
    const pose = sampleCameraPose(ch, L, { portrait: this.isPortrait, reduced: s.reduced })
    const k = 1 - Math.pow(0.0015, dt)
    this.layoutSide = lerp(this.layoutSide, pose.side, k)

    this.titles.forEach((title, i) => {
      const early = ch === 0 || this.isPortrait
      const aula = Boolean(CAPITULOS[ch].aprofundamento)
      if (i === ch) title.set(seg(L, early ? 0 : 0.08, early ? 0.14 : 0.24), aula ? seg(L, 0.30, 0.36) : seg(L, 0.4, 0.5))
      else title.set(0, 1)
      title.group.position.copy(this.textPos)
    })

    const mix = ch === N - 1 ? 0 : seg(L, 0.86, 1)
    this.bg.set(bgA.cor, bgA.acento, bgB.cor, bgB.acento, mix)
    this.bg.update(this.app.time, this.app.aspect || 1, s.reduced ? this.zeroPointer : this.app.pointerSmooth)

    w.explode = 0
    w.scatter = 0
    w.speed = 0
    w.ghost = 0
    w.squat = 0
    w.scale = 1
    w.drs = 0
    w.floorSwap = 0
    w.floorGlow = 0
    w.pitJack = 0
    w.tunnel = 0

    switch (ch) {
      case 0: {
        w.scatter = 0.72 * (1 - ease(seg(L, 0.12, 0.58)))
        w.explode = 0.85 * (1 - ease(seg(L, 0.16, 0.66)))
        w.ghost = ease(seg(L, 0.4, 0.7)) * 0.75
        w.floorGlow = ease(seg(L, 0.55, 0.8))
        break
      }
      case 1: {
        w.scale = lerp(1, 0.62, ease(seg(L, 0.05, 0.22)))
        w.tunnel = ease(seg(L, 0.18, 0.4))
        w.speed = 0.35
        w.floorGlow = 0.4 + 0.3 * Math.sin(L * Math.PI * 6)
        break
      }
      case 2: {
        w.pitJack = ease(seg(L, 0.48, 0.58)) * (1 - ease(seg(L, 0.74, 0.86)))
        w.explode = ease(seg(L, 0.5, 0.58)) * 0.28 * (1 - ease(seg(L, 0.64, 0.74)))
        w.floorSwap = 1 - ease(seg(L, 0.6, 0.72))
        w.floorGlow = 0.7
        break
      }
      case 3: {
        w.speed = lerp(0.2, 0.85, ease(seg(L, 0.08, 0.4))) * (1 - ease(seg(L, 0.48, 0.58)))
        w.drs = 1 - ease(seg(L, 0.28, 0.38))
        w.ghost = ease(seg(L, 0.52, 0.66))
        w.floorGlow = ease(seg(L, 0.55, 0.7))
        break
      }
      case 4: {
        const amp = this.scenario === 'cfd' ? 0 : this.scenario === 'tunel' ? 0.25 : 0.7
        w.ghost = 0.85
        w.squat = Math.sin(L * 28) * amp * ease(seg(L, 0.36, 0.5))
        w.floorGlow = 0.9
        w.floorSwap = this.scenario === 'piso' ? 1 : 0
        break
      }
      case 5: {
        const revert = this.keepFloor ? 0 : ease(seg(L, 0.52, 0.7))
        w.ghost = 0.2
        w.squat = this.keepFloor ? Math.sin(L * 22) * 0.55 : Math.sin(L * 22) * 0.55 * (1 - revert)
        w.floorSwap = this.keepFloor ? 1 : 1 - revert
        w.floorGlow = 0.85
        w.pitJack = ease(seg(L, 0.5, 0.56)) * (1 - ease(seg(L, 0.72, 0.8)))
        break
      }
      case 6: {
        w.ghost = ease(seg(L, 0.18, 0.28)) * (1 - ease(seg(L, 0.36, 0.46)))
        w.pitJack = ease(seg(L, 0.4, 0.48)) * (1 - ease(seg(L, 0.58, 0.64)))
        w.explode = ease(seg(L, 0.42, 0.5)) * 0.35 * (1 - ease(seg(L, 0.54, 0.62)))
        w.floorGlow = 0.6
        w.scatter = ease(seg(L, 0.86, 0.96))
        w.explode = Math.max(w.explode, ease(seg(L, 0.86, 0.95)))
        break
      }
    }

    this.camPos.lerp(new THREE.Vector3(...pose.camera), k)
    this.app.camera.position.copy(this.camPos)
    this.app.cameraTarget.lerp(new THREE.Vector3(...pose.target), k)
    this.app.key.position.lerp(new THREE.Vector3(...pose.light), k)
    this.app.post.setBokeh(pose.bokeh)
    this.app.post.setBloom(pose.bloom)
    this.app.post.focus(this.app.camera.position.distanceTo(this.app.cameraTarget), 2.3)

    const side = this.isPortrait ? new THREE.Vector3(0, this.heroSide.y, 0) : this.heroSide.clone().multiplyScalar(this.layoutSide)
    this.heroPos.lerp(side, k)
    this.car.group.position.x = this.heroPos.x
    this.car.group.position.z = this.heroPos.z
    this.car.group.rotation.y = pose.yaw
    this.car.group.rotation.z = pose.rotation * 0.15
    this.car.update(dt)
  }
}
