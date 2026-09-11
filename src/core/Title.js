import * as THREE from 'three'
import { Text, preloadFont } from 'troika-three-text'

// Fonte de display: Bebas Neue via Google Fonts (arquivo TTF público). Fallback: fonte padrão do troika.
export const FONT_DISPLAY = '/fonts/BebasNeue-Regular.ttf'
export const FONT_BODY = '/fonts/Lato-Regular.ttf'

const withTimeout = (p, ms, label) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('tempo esgotado: ' + label)), ms))])
export function preloadFonts() {
  return Promise.all([
    withTimeout(new Promise((r) => preloadFont({ font: FONT_DISPLAY, characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÂÊÔÃÕÇ0123456789.,:;+-%/ ' }, r)), 15000, 'fonte de título'),
    withTimeout(new Promise((r) => preloadFont({ font: FONT_BODY, characters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZáéíóúâêôãõçÁÉÍÓÚÂÊÔÃÕÇ0123456789.,:;+-%/() ' }, r)), 15000, 'fonte de corpo'),
  ])
}

// Título em SDF: contorno que se preenche conforme o progresso (0 = só contorno, 1 = cheio).
export class Title {
  constructor(scene, { text, body, accent = 0xd3a94f }) {
    this.group = new THREE.Group()
    this.title = new Text()
    this.title.text = text
    this.title.font = FONT_DISPLAY
    this.title.fontSize = 0.5
    this.title.lineHeight = 0.92
    this.title.letterSpacing = 0.02
    this.title.anchorX = 'left'
    this.title.anchorY = 'middle'
    this.title.color = 0xe9e4d8
    this.title.strokeColor = 0xe9e4d8
    this.title.strokeWidth = '2.5%'
    this.title.fillOpacity = 0
    this.title.strokeOpacity = 1
    this.title.material.toneMapped = false
    this.title.material.transparent = true
    this.title.material.depthWrite = false; this.title.material.depthTest = false

    this.body = new Text()
    this.body.text = body
    this.body.font = FONT_BODY
    this.body.fontSize = 0.115
    this.body.lineHeight = 1.5
    this.body.maxWidth = 3.1
    this.body.anchorX = 'left'
    this.body.anchorY = 'top'
    this.body.color = 0xe9e4d8
    this.body.fillOpacity = 0
    this.body.material.toneMapped = false
    this.body.material.transparent = true
    this.body.material.depthWrite = false; this.body.material.depthTest = false

    this.rule = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.012), new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0, toneMapped: false, depthTest: false, depthWrite: false }))
    this.rule.geometry.translate(0.5, 0, 0)

    this.group.add(this.title, this.body, this.rule)
    this.group.renderOrder = 5
    scene.add(this.group)
    this.title.sync(); this.body.sync()
    this.setLayout(false)
  }

  setLayout(isPortrait) {
    // Desktop: texto à esquerda, herói à direita. Retrato: texto no topo, herói embaixo.
    if (isPortrait) {
      // Largura menor que o frustum (1,9 un. por metade): deixa ~13% de folga à direita para os pontos de capítulo.
      this.title.fontSize = 0.44; this.title.maxWidth = 3.2
      this.body.fontSize = 0.16; this.body.maxWidth = 3.1
      this.title.position.set(0, 0, 0); this.rule.position.set(0, -0.86, 0); this.rule.scale.x = 0.6
      this.body.position.set(0, -0.98, 0)
    } else {
      this.title.fontSize = 0.5; this.title.maxWidth = 3.5
      this.body.fontSize = 0.115; this.body.maxWidth = 3.1
      this.title.position.set(0, 0.2, 0); this.rule.position.set(0, -1.02, 0); this.rule.scale.x = 0.9
      this.body.position.set(0, -1.16, 0)
    }
    this.title.sync(); this.body.sync()
  }

  // reveal: 0..1 entrada (contorno desenha e preenche); leave: 0..1 saída (desfaz para cima).
  set(reveal, leave = 0) {
    const r = THREE.MathUtils.smoothstep(reveal, 0, 1)
    const l = THREE.MathUtils.smoothstep(leave, 0, 1)
    const vis = r * (1 - l)
    this.group.visible = vis > 0.001
    this.title.strokeOpacity = Math.min(1, r * 2) * (1 - l)
    this.title.fillOpacity = THREE.MathUtils.clamp((r - 0.45) / 0.55, 0, 1) * (1 - l)
    this.body.fillOpacity = THREE.MathUtils.clamp((r - 0.6) / 0.4, 0, 1) * (1 - l)
    this.rule.material.opacity = THREE.MathUtils.clamp((r - 0.5) / 0.3, 0, 1) * (1 - l)
    this.rule.scale.x = 0.9 * THREE.MathUtils.clamp((r - 0.5) / 0.4, 0, 1)
    this.offsetY = (1 - r) * -0.25 + l * 0.6
  }
}
