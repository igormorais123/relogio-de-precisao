import * as THREE from 'three'
import { Text, preloadFont } from 'troika-three-text'

export const FONT_DISPLAY = '/fonts/BebasNeue-Regular.ttf'
export const FONT_BODY = '/fonts/Lato-Regular.ttf'

const withTimeout = (p, ms, label) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('tempo esgotado: ' + label)), ms))])

export function preloadFonts() {
  return Promise.all([
    withTimeout(new Promise((r) => preloadFont({ font: FONT_DISPLAY, characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÂÊÔÃÕÇ0123456789.,:;+-%/ ' }, r)), 15000, 'fonte de título'),
    withTimeout(new Promise((r) => preloadFont({ font: FONT_BODY, characters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZáéíóúâêôãõçÁÉÍÓÚÂÊÔÃÕÇ0123456789.,:;+-%/() ' }, r)), 15000, 'fonte de corpo'),
  ])
}

export class Title {
  constructor(scene, { text, body, accent = 0xd92135 }) {
    this.group = new THREE.Group()
    this.title = new Text()
    this.title.text = text
    this.title.font = FONT_DISPLAY
    this.title.fontSize = 0.48
    this.title.lineHeight = 0.92
    this.title.letterSpacing = 0.02
    this.title.anchorX = 'left'
    this.title.anchorY = 'middle'
    this.title.color = 0xf0f2f3
    this.title.strokeColor = 0xf0f2f3
    this.title.strokeWidth = '2.5%'
    this.title.fillOpacity = 0
    this.title.strokeOpacity = 1
    this.title.material.toneMapped = false
    this.title.material.transparent = true
    this.title.material.depthWrite = false
    this.title.material.depthTest = false

    this.body = new Text()
    this.body.text = body
    this.body.font = FONT_BODY
    this.body.fontSize = 0.115
    this.body.lineHeight = 1.5
    this.body.maxWidth = 3.1
    this.body.anchorX = 'left'
    this.body.anchorY = 'top'
    this.body.color = 0xf0f2f3
    this.body.fillOpacity = 0
    this.body.material.toneMapped = false
    this.body.material.transparent = true
    this.body.material.depthWrite = false
    this.body.material.depthTest = false

    this.rule = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.012), new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0, toneMapped: false, depthTest: false, depthWrite: false }))
    this.rule.geometry.translate(0.5, 0, 0)

    this.group.add(this.title, this.body, this.rule)
    this.group.renderOrder = 5
    scene.add(this.group)
    this.title.sync()
    this.body.sync()
    this.setLayout(false)
  }

  setLayout(isPortrait) {
    if (isPortrait) {
      this.title.fontSize = 0.4
      this.title.maxWidth = 3.1
      this.body.fontSize = 0.15
      this.body.maxWidth = 3.0
      this.title.position.set(0, 0, 0)
      this.rule.position.set(0, -0.82, 0)
      this.rule.scale.x = 0.55
      this.body.position.set(0, -0.94, 0)
    } else {
      this.title.fontSize = 0.48
      this.title.maxWidth = 3.5
      this.body.fontSize = 0.115
      this.body.maxWidth = 3.1
      this.title.position.set(0, 0.18, 0)
      this.rule.position.set(0, -0.98, 0)
      this.rule.scale.x = 0.85
      this.body.position.set(0, -1.12, 0)
    }
    this.title.sync()
    this.body.sync()
  }

  set(reveal, leave = 0) {
    const r = THREE.MathUtils.smoothstep(reveal, 0, 1)
    const l = THREE.MathUtils.smoothstep(leave, 0, 1)
    const vis = r * (1 - l)
    this.title.fillOpacity = vis * vis
    this.title.strokeOpacity = Math.min(1, vis * 1.4)
    this.body.fillOpacity = vis * 0.85
    this.rule.material.opacity = vis
    this.group.position.y = (1 - r) * 0.12 + l * 0.18
    this.group.visible = vis > 0.01
  }
}
