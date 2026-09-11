import * as THREE from 'three'
import { CAPITULOS, N } from '../data/narrativa.js'
import { Title } from './Title.js'
import { sampleCameraPose } from './cameraPath.js'

const { lerp, clamp, smoothstep } = THREE.MathUtils
const ease = (t) => smoothstep(t, 0, 1)
const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1)

// Coreografia: recebe (capítulo, progresso local, progresso global) e escreve o estado do relógio,
// da câmera, do fundo, do pós e dos títulos. Um único objeto herói atravessa os seis capítulos.
// Capítulos com texto à direita e herói à esquerda (só em paisagem).
// Pesquisa, execução e aprendizado trocam os lados; a posição é interpolada pelo percurso.

export class Director {
  constructor(app, scroll, watch, background, fx = {}) {
    this.app = app; this.scroll = scroll; this.watch = watch; this.bg = background; this.fx = fx
    // A câmera vive na cena de sobreposição: os títulos (filhos dela) são desenhados depois do DOF.
    app.overlay.add(app.camera)
    this.titles = CAPITULOS.map((c) => new Title(app.camera, { text: c.titulo, body: c.corpo, accent: c.acento }))
    this.camPos = new THREE.Vector3(0, 0.2, 7)
    this.camTarget = new THREE.Vector3()
    this.heroPos = new THREE.Vector3()
    this.layoutSide = 1
    this.desired = { cam: new THREE.Vector3(0, 0.2, 7), target: new THREE.Vector3(), hero: new THREE.Vector3(1.6, 0, 0), heroRot: 0, bokeh: 3.2, bloom: 0.9, ambient: 1 , light: new THREE.Vector3(3, 4, 5), yaw: 0 }
    this.scenario = 'frio'
    this.zeroPointer = new THREE.Vector2()
    this.tmpColor = new THREE.Color()
    this.layout()
    addEventListener('resize', () => this.layout())
  }

  layout() {
    const p = this.app.isPortrait
    this.isPortrait = p
    this.titles.forEach((t) => t.setLayout(p))
    this.watch.portrait = p
    // Texto à esquerda em paisagem; no topo em retrato. Medidas derivadas do frustum na profundidade do texto.
    const cam = this.app.camera
    const dist = 5.6, zText = -dist
    const halfH = dist * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)), halfW = halfH * cam.aspect
    this.frustum = { halfH, halfW }
    const scale = p ? Math.min(1, halfW / 1.9) : Math.min(0.9, halfW / 3.2)
    this.titles.forEach((t) => t.group.scale.setScalar(scale))
    if (p) {
      // Piso de 16 px no corpo: em telas estreitas a escala do bloco derruba o texto abaixo do legível.
      const pxPorUnidade = (innerHeight / 2) / halfH
      const bodyPx = 0.16 * scale * pxPorUnidade
      if (bodyPx < 16) this.titles.forEach((t) => { t.body.fontSize = 0.16 * (16 / bodyPx); t.body.sync() })
    }
    this.textPos = p ? new THREE.Vector3(-halfW * 0.84, halfH * 0.5, zText) : new THREE.Vector3(-halfW * 0.86, 0.05, zText)
    this.heroSide = p ? new THREE.Vector3(0, -halfH * 0.5, 0) : new THREE.Vector3(halfW * 0.56, -0.05, 0)
  }

  update(dt, t) {
    const s = this.scroll
    const g = s.progress
    const ch = s.chapter
    const L = s.local
    const w = this.watch.state
    const d = this.desired
    const bgA = CAPITULOS[ch], bgB = CAPITULOS[Math.min(N - 1, ch + 1)]

    const pose = sampleCameraPose(ch, L, { portrait: this.isPortrait, reduced: s.reduced })
    const k = 1 - Math.pow(0.0015, dt)
    this.layoutSide = lerp(this.layoutSide, pose.side, k)
    s.layoutSide = this.layoutSide

    // O título cede espaço à ficha; avaliação/aprendizado têm um quadro especial depois dela.
    this.titles.forEach((title, i) => {
      if (i === ch) title.set(seg(L, ch === 0 || this.isPortrait ? 0.02 : 0.08, ch === 0 || this.isPortrait ? 0.2 : 0.24), ch >= 4 ? seg(L, 0.30, 0.36) : seg(L, 0.4, 0.5))
      else title.set(0, 1)
      title.group.position.copy(this.textPos)
      if (!this.isPortrait) {
        const rightText = -this.textPos.x - 3.5 * title.group.scale.x
        title.group.position.x = lerp(this.textPos.x, rightText, (1 - this.layoutSide) * 0.5)
      }
      title.group.position.y += s.reduced ? 0 : title.offsetY || 0
    })

    // Fundo: transição diagonal no fim de cada capítulo.
    const mix = seg(L, 0.86, 1)
    this.bg.set(bgA.cor, bgA.acento, bgB.cor, bgB.acento, ch === N - 1 ? 0 : mix)
    // A poça de luz atrás do herói segue o acento do capítulo: arco cromático frio → ouro → frio → ouro.
    if (this.watch.backdropMat) this.watch.backdropMat.color.setHex(bgA.acento).lerp(this.tmpColor.setHex(bgB.acento), ch === N - 1 ? 0 : mix).multiplyScalar(0.4)

    // Defaults por quadro
    w.scatter = 0; w.opened = 0; w.running = 0; w.health = 1; w.wind = 0
    this.fx.constellation?.set(0)
    this.fx.hotspots?.setChapter(-1)
    this.fx.crownDrag?.set(ch === 3 ? 1 : 0)
    this.fx.fog?.set(0); this.fx.blueprint?.set(0); this.fx.sparks?.set(0); this.fx.reference?.set(0, 0, this.scenario); this.fx.curve?.set(0); this.fx.finale?.set(0); this.fx.plate?.set(null, 0); this.fx.callouts?.set(-1, 0)

    switch (ch) {
      case 0: { // Problema: relógio parado, vidro embaçado, close. Ao rolar, vidro abre e peças começam a soltar.
        w.explode = ease(seg(L, 0.55, 1)) * 0.35
        w.opened = ease(seg(L, 0.4, 0.8))
        w.running = 0
        this.fx.fog?.set(1 - ease(seg(L, 0.03, 0.17)))
        this.fx.callouts?.set(0, ease(seg(L, 0.2, 0.32)) * (1 - ease(seg(L, 0.5, 0.6))))
        break
      }
      case 1: { // Pesquisa: peças em constelação; linhas ligam peças; hotspots de diagnóstico.
        w.explode = 0.35 + 0.65 * ease(seg(L, 0, 0.25))
        w.opened = 1 - ease(seg(L, 0, 0.18))
        w.scatter = ease(seg(L, 0.05, 0.4)) * (1 - ease(seg(L, 0.88, 1)))
        this.fx.constellation?.set(ease(seg(L, 0.25, 0.55)) * (1 - ease(seg(L, 0.85, 1))))
        this.fx.hotspots?.setChapter(1, ease(seg(L, 0.35, 0.6)) * (1 - ease(seg(L, 0.82, 0.95))))
        this.fx.plate?.set('balanco', 0.45 * ease(seg(L, 0.06, 0.3)) * (1 - ease(seg(L, 0.86, 1))), 2.6)
        this.fx.callouts?.set(1, ease(seg(L, 0.3, 0.42)) * (1 - ease(seg(L, 0.78, 0.86))))
        break
      }
      case 2: { // Planejamento: explosão ordenada ao longo do eixo; hotspots por peça.
        w.explode = 1
        w.scatter = 0
        this.fx.hotspots?.setChapter(2, ease(seg(L, 0.3, 0.55)) * (1 - ease(seg(L, 0.82, 0.95))))
        this.fx.blueprint?.set(0.55 * ease(seg(L, 0.15, 0.5)) * (1 - ease(seg(L, 0.85, 1))))
        this.fx.callouts?.set(2, ease(seg(L, 0.3, 0.42)) * (1 - ease(seg(L, 0.78, 0.86))))
        break
      }
      case 3: { // Execução: o scroll monta. Rolar para trás desmonta. Corda pela coroa no fim.
        const a = ease(seg(L, 0.05, 0.75))
        w.explode = 1 - a
        w.wind = ease(seg(L, 0.72, 0.9))
        w.running = ease(seg(L, 0.85, 0.97))
        this.fx.sparks?.set(w.wind)
        this.fx.callouts?.set(3, ease(seg(L, 0.3, 0.42)) * (1 - ease(seg(L, 0.6, 0.68))))
        this.fx.plate?.set('mostrador', 0.7 * ease(seg(L, 0.7, 0.88)) * (1 - ease(seg(L, 0.95, 1))), 1.2)
        break
      }
      case 4: { // Avaliação: relógio montado, rodando, ao lado do padrão atômico; cenários alteram o desvio.
        w.explode = 0; w.running = 1; w.wind = 1
        const sc = CAPITULOS[4].cenarios[this.scenario]
        w.health = this.scenario === 'impacto' ? 0.35 : this.scenario === 'calor' ? 0.7 : 0.9
        this.fx.reference?.set(ease(seg(L, 0.15, 0.4)) * (1 - ease(seg(L, 0.88, 1))), sc.desvio, this.scenario)
        this.fx.callouts?.set(4, ease(seg(L, 0.3, 0.42)) * (1 - ease(seg(L, 0.78, 0.86))))
        break
      }
      case 5: { // Aprendizado: curva de desvios vira nova espiral; relógio reabre, troca, fecha, sincroniza.
        w.explode = 0; w.running = 1; w.wind = 1
        w.opened = ease(seg(L, 0.12, 0.3)) * (1 - ease(seg(L, 0.6, 0.8)))
        w.health = lerp(0.5, 1, ease(seg(L, 0.5, 0.8)))
        this.fx.curve?.set(ease(seg(L, 0.05, 0.48)))
        this.fx.plate?.set('balanco', 0.22 * ease(seg(L, 0.04, 0.25)) * (1 - ease(seg(L, 0.5, 0.7))), 3.2)
        this.fx.finale?.set(ease(seg(L, 0.82, 1)))
        this.fx.callouts?.set(5, ease(seg(L, 0.3, 0.42)) * (1 - ease(seg(L, 0.72, 0.8))))
        break
      }
    }

    // Cada capítulo começa exatamente na pose final do anterior. A transição tem
    // tangente nula nas pontas e um arco baixo; o restante do percurso fica estável para ler.
    d.cam.fromArray(pose.camera); d.target.fromArray(pose.target); d.light.fromArray(pose.light)
    d.hero.set(this.heroSide.x * Math.abs(pose.heroX), this.heroSide.y * pose.heroY, 0)
    d.heroRot = pose.rotation; d.yaw = pose.yaw; d.bokeh = this.app.isMobile ? Math.min(1.8, pose.bokeh) : pose.bokeh; d.bloom = pose.bloom
    if (ch >= 4 && L >= 0.62) {
      this.fx.callouts?.set(-1, 0)
      this.fx.reference?.set(0, 0, this.scenario)
      this.fx.curve?.set(0)
      this.fx.finale?.set(0)
    }

    // Contrato de layout (paisagem): o relógio fica à direita da coluna de texto visível; se não couber, encolhe.
    if (!this.isPortrait) {
      const cam = this.app.camera
      const titleVis = ch === 0 ? ease(seg(L, 0.05, 0.4)) : 1
      const scaleT = this.titles[ch].group.scale.x
      const textRight = this.textPos.x + 3.5 * scaleT           // borda direita do bloco de texto no plano do texto
      const camDist = d.cam.z                                     // herói em z≈0
      const halfWHero = camDist * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * cam.aspect
      const textRightHero = textRight * camDist / 5.6             // mesma borda projetada na profundidade do herói
      const margem = 0.18
      const margemDireita = 0.48                                 // preserva a coroa e o espaço dos marcadores de capítulo
      const disponivel = halfWHero - margemDireita - textRightHero - margem
      const R = pose.radius                              // raio do relógio na escala 1 (com coroa; pilha inclinada no cap. 2)
      const escala = clamp(disponivel / (2 * R), 0.46, 0.84)
      const centroMin = textRightHero + margem + R * escala
      const centroMax = halfWHero - margemDireita - R * escala
      const alvoX = clamp(d.hero.x, centroMin, centroMax)
      const layoutBlend = titleVis * pose.layoutWeight
      d.hero.x = lerp(d.hero.x, alvoX, layoutBlend) * pose.side
      this.heroScale = lerp(0.84, Math.min(escala, pose.maxScale), layoutBlend)
    } else this.heroScale = pose.portraitScale
    this.watch.side = pose.side
    this.watch.group.scale.setScalar(lerp(this.watch.group.scale.x, this.heroScale, 1 - Math.pow(0.001, dt)))

    // Suavização: câmera, herói e efeitos de pós seguem o desejado com amortecimento.
    this.camPos.lerp(d.cam, k); this.camTarget.lerp(d.target, k); this.heroPos.lerp(d.hero, k)
    this.app.key.position.lerp(d.light, k)
    this.watch.baseYaw = lerp(this.watch.baseYaw || 0, d.yaw, k)
    this.app.camera.position.copy(this.camPos)
    this.app.cameraTarget.copy(this.camTarget)
    this.watch.group.position.copy(this.heroPos)
    this.watch.group.rotation.z = lerp(this.watch.group.rotation.z, d.heroRot, k)
    // Corda manual (arraste da coroa) entra antes de o relógio e os efeitos lerem o estado.
    const extra = this.fx.crownDrag?.extraWind || 0
    if (extra) w.wind = Math.min(1, w.wind + extra)
    this.watch.update(dt, t, this.scroll.reduced ? this.zeroPointer : this.app.pointerSmooth)
    this.app.post.focus(this.camPos.distanceTo(this.watch.group.position) - 0.4, this.watch.state.scatter > 0.2 ? 5 : 1.7 + 1.3 * this.watch.state.opened)
    this.app.post.setBokeh(lerp(this.app.post.dof.bokehScale, d.bokeh, k))
    this.app.post.setBloom(lerp(this.app.post.bloom.intensity, d.bloom, k))
    this.bg.update(t, this.app.aspect, this.scroll.reduced ? this.zeroPointer : this.app.pointerSmooth)
    // Câmera finalizada aqui: os efeitos que projetam para a tela rodam depois deste update.
    this.app.camera.lookAt(this.app.cameraTarget)
    this.app.camera.updateMatrixWorld()
  }

  setScenario(name) { this.scenario = name }
}
