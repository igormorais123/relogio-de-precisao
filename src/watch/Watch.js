import * as THREE from 'three'
import { gearGeometry, hairspringGeometry, crownGeometry, dialTexture } from './gear.js'

// Relógio mecânico procedural. Cada peça é um Group com posição montada (home) e posição explodida (apart).
// Estado contínuo: explode (0 montado, 1 explodido em ordem), scatter (0..1 peças espalhadas em constelação),
// wind (corda 0..1), running (balanço oscilando), health (1 saudável, 0 espiral morta), opened (tampa aberta).
export class Watch {
  constructor(scene, { isMobile = false } = {}) {
    this.group = new THREE.Group()
    this.mechTime = 0
    this.prevSpin = 0
    this.parts = []
    this.state = { explode: 0, scatter: 0, wind: 0, running: 0, health: 1, opened: 0, spinCrown: 0 }
    this.t = 0
    this.scatterSeeds = []

    const gold = new THREE.MeshPhysicalMaterial({ color: 0xd4a95a, metalness: 1, roughness: 0.36, clearcoat: 0, clearcoatRoughness: 0.2, envMapIntensity: 0.85, anisotropy: 0.3, anisotropyRotation: Math.PI / 2 })
    const steel = new THREE.MeshPhysicalMaterial({ color: 0xb9c3cc, metalness: 1, roughness: 0.3, envMapIntensity: 1.2 })
    const darkSteel = new THREE.MeshPhysicalMaterial({ color: 0x5d6770, metalness: 1, roughness: 0.42, envMapIntensity: 1.0 })
    const brass = new THREE.MeshPhysicalMaterial({ color: 0xc9a25a, metalness: 1, roughness: 0.32, envMapIntensity: 0.95, anisotropy: 0.4 })
    const ruby = new THREE.MeshPhysicalMaterial({ color: 0xc8283c, metalness: 0, roughness: 0.08, transmission: isMobile ? 0 : 0.55, thickness: 0.2, ior: 1.77, emissive: 0x9b1020, emissiveIntensity: 0.6 })
    const glass = isMobile
      ? new THREE.MeshPhysicalMaterial({ color: 0x000000, metalness: 0, roughness: 0.0, transparent: true, opacity: 0.35, envMapIntensity: 0.3, depthWrite: false, specularIntensity: 0.3 })
      : new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.0, transmission: 1.0, thickness: 0.02, ior: 1.5, transparent: true, opacity: 1, envMapIntensity: 0.3, depthWrite: false, specularIntensity: 0.25 })
    // Mostrador: fotografia gerada (guilloché, índices aplicados) substitui o canvas assim que carrega; o canvas fica de reserva.
    const dialMat = new THREE.MeshStandardMaterial({ map: dialTexture(1024), metalness: 0.08, roughness: 0.8 })
    new THREE.TextureLoader().load(`${import.meta.env.BASE_URL}mostrador.jpg`, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 16
      dialMat.map = tex; dialMat.roughness = 0.62; dialMat.metalness = 0.2; dialMat.needsUpdate = true
    })
    const handMat = new THREE.MeshPhysicalMaterial({ color: 0xe6e1d6, metalness: 0.7, roughness: 0.34, envMapIntensity: 1.2 })
    this.materials = { gold, steel, darkSteel, brass, ruby, glass, dialMat, handMat }
    this.crystalBaseOpacity = glass.opacity

    const add = (name, mesh, home, apart, extra = {}) => {
      const g = new THREE.Group()
      g.name = name
      g.add(mesh)
      g.userData = { home: new THREE.Vector3(...home), apart: new THREE.Vector3(...apart), rot: new THREE.Euler(), ...extra }
      this.group.add(g)
      this.parts.push(g)
      const rnd = () => { this._seed = (this._seed * 1664525 + 1013904223) >>> 0; return this._seed / 4294967296 }
      if (this._seed === undefined) this._seed = 7
      this.scatterSeeds.push(new THREE.Vector3(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1).normalize())
      return g
    }

    // Caixa: anel externo torneado (lathe), fundo e bisel
    const caseProfile = []
    for (let i = 0; i <= 16; i++) { const a = (i / 16) * Math.PI; caseProfile.push(new THREE.Vector2(1.32 + Math.sin(a) * 0.09, -0.14 + Math.cos(a) * 0.14)) }
    const caseRing = new THREE.Mesh(new THREE.LatheGeometry(caseProfile, 96), gold)
    caseRing.rotation.x = Math.PI / 2
    this.caseRing = add('caixa', caseRing, [0, 0, 0], [0, 0, -1.9])
    const back = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.06, 96), darkSteel)
    back.rotation.x = Math.PI / 2
    this.back = add('fundo', back, [0, 0, -0.17], [0, 0, -2.6])
    const bezel = new THREE.Mesh(new THREE.TorusGeometry(1.26, 0.05, 16, 96), gold)
    this.bezel = add('bisel', bezel, [0, 0, 0.16], [0, 0, 1.55])
    // Cristal de safira
    const R = 4.2, cap = Math.asin(1.24 / R)
    const crystal = new THREE.Mesh(new THREE.SphereGeometry(R, 96, 24, 0, Math.PI * 2, 0, cap), glass)
    crystal.rotation.x = Math.PI / 2
    crystal.position.z = -R
    this.crystal = add('cristal', crystal, [0, 0, 0.14], [0, 0, 2.1])
    // Mostrador
    const dial = new THREE.Mesh(new THREE.CircleGeometry(1.2, 96), dialMat)
    this.dial = add('mostrador', dial, [0, 0, 0.11], [0, 0, 1.05])
    // Ponteiros
    const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.62, 0.012), handMat); hourHand.position.y = 0.26
    const minHand = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.98, 0.012), handMat); minHand.position.y = 0.44
    const secHand = new THREE.Mesh(new THREE.BoxGeometry(0.014, 1.12, 0.008), brass); secHand.position.y = 0.42
    this.hour = add('ponteiro-horas', hourHand, [0, 0, 0.125], [0.8, 0.2, 1.35])
    this.min = add('ponteiro-minutos', minHand, [0, 0, 0.14], [-0.8, 0.4, 1.4])
    this.sec = add('ponteiro-segundos', secHand, [0, 0, 0.155], [0.3, -0.7, 1.45])
    // Máquina: platina, engrenagens, tambor da mola, balanço, espiral, escape, rubis
    // Platina: fotografia gerada (côtes de Genève, perlage, rubis) na face; latão procedural até carregar.
    const plateMat = new THREE.MeshPhysicalMaterial({ color: 0xc9a25a, metalness: 1, roughness: 0.32, envMapIntensity: 0.95 })
    new THREE.TextureLoader().load(`${import.meta.env.BASE_URL}platina.jpg`, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 16
      plateMat.map = tex; plateMat.color.set(0xffffff); plateMat.metalness = 0.75; plateMat.roughness = 0.42; plateMat.needsUpdate = true
    })
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 1.12, 0.04, 96), plateMat)
    plate.rotation.x = Math.PI / 2
    this.plate = add('platina', plate, [0, 0, -0.08], [0, 0, -0.9])
    const gearDefs = [
      { name: 'roda-central', teeth: 48, radius: 0.46, spokes: 5, pos: [0.05, 0.02, -0.02], ap: [0.1, 0.6, -0.55], speed: 1 },
      { name: 'roda-terceira', teeth: 30, radius: 0.28, spokes: 4, pos: [-0.62, 0.32, -0.02], ap: [-1.3, 1.1, -0.35], speed: -1.6 },
      { name: 'roda-quarta', teeth: 22, radius: 0.2, spokes: 0, pos: [-0.55, -0.42, -0.03], ap: [-1.2, -1.2, -0.45], speed: 2.2 },
      { name: 'roda-escape', teeth: 15, radius: 0.15, spokes: 0, pos: [0.42, -0.62, -0.02], ap: [1.2, -1.35, -0.5], speed: -3.4 },
    ]
    this.gears = gearDefs.map((d) => {
      const m = new THREE.Mesh(gearGeometry({ teeth: d.teeth, radius: d.radius, spokes: d.spokes, depth: 0.05, toothHeight: 0.045, hole: 0.05 }), d.name === 'roda-escape' ? steel : brass)
      const g = add(d.name, m, d.pos, d.ap, { speed: d.speed })
      const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.22, 12), steel); axle.rotation.x = Math.PI / 2; g.add(axle)
      const jewel = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 12), ruby); jewel.position.z = 0.05; g.add(jewel)
      return g
    })
    // Tambor: cilindro dentro de um Group para girar em torno de z sem inclinar o eixo.
    const barrelMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.08, 64), gold); barrelMesh.rotation.x = Math.PI / 2
    const barrelSpin = new THREE.Group(); barrelSpin.add(barrelMesh)
    const spring = new THREE.Mesh(hairspringGeometry({ turns: 5, r0: 0.05, r1: 0.36, tube: 0.011, segments: 320 }), steel); spring.position.z = 0.045
    barrelSpin.add(spring)
    this.barrel = add('tambor-da-mola', barrelSpin, [0.62, 0.48, -0.03], [1.5, 1.2, -0.6], { speed: 0.25 })
    // Balanço: aro + travessa + espiral
    const balanceWheel = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.028, 12, 72), gold)
    const cross = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.04, 0.03), gold)
    const cross2 = cross.clone(); cross2.rotation.z = Math.PI / 2
    const hair = new THREE.Mesh(hairspringGeometry({ turns: 7, r0: 0.06, r1: 0.4, tube: 0.009 }), steel)
    hair.position.z = 0.09
    this.hairspring = hair
    const balanceGroup = new THREE.Group(); balanceGroup.add(balanceWheel, cross, cross2)
    const balanceRoot = new THREE.Group(); balanceRoot.add(balanceGroup, hair)
    this.balance = add('balanco', balanceRoot, [-0.28, -0.12, -0.03], [-1.25, -0.1, 0.7])
    this.balanceWheelGroup = balanceGroup
    const bjewel = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 12), ruby); bjewel.position.z = 0.04; this.balance.add(bjewel)
    // Coroa
    const crown = new THREE.Mesh(crownGeometry({}), gold)
    this.crown = add('coroa', crown, [1.42, 0, -0.02], [2.4, 0, -0.02])
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.3, 12), steel); stem.rotation.z = Math.PI / 2; stem.position.x = -0.18; this.crown.add(stem)
    // Parafusos azulados na platina
    const screwMat = new THREE.MeshPhysicalMaterial({ color: 0x2a4a8a, metalness: 1, roughness: 0.25 })
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + 0.3
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 12), screwMat)
      s.rotation.x = Math.PI / 2; s.position.set(Math.cos(a) * 0.98, Math.sin(a) * 0.98, 0.03)
      this.plate.add(s)
    }

    // Vista explodida axial: cada peça se afasta ao longo de z na ordem de montagem, mantendo o eixo.
    {
      const ordem = this.assemblyOrder, n = ordem.length
      ordem.forEach((nome, i) => {
        const p = this.parts.find((q) => q.name === nome); if (!p) return
        const h = p.userData.home
        p.userData.apart.set(h.x * 1.08, h.y * 1.08, -1.5 + (i / (n - 1)) * 3.1)
      })
    }
    // Sombra de contato: disco radial escuro atrás do relógio, some quando as peças se soltam.
    const sc = document.createElement('canvas'); sc.width = sc.height = 256
    const sg = sc.getContext('2d'); const rg = sg.createRadialGradient(128, 128, 20, 128, 128, 128)
    rg.addColorStop(0, 'rgba(0,0,0,0.85)'); rg.addColorStop(0.55, 'rgba(0,0,0,0.35)'); rg.addColorStop(1, 'rgba(0,0,0,0)')
    sg.fillStyle = rg; sg.fillRect(0, 0, 256, 256)
    const shadowTex = new THREE.CanvasTexture(sc)
    this.shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0.7, depthWrite: false, toneMapped: false })
    this.shadow = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 4.4), this.shadowMat)
    this.shadow.position.set(0.12, -0.18, -0.55)
    this.shadow.renderOrder = -1
    this.group.add(this.shadow)

    // Pano de fundo: poça de luz quente atrás do herói (parede de estúdio). Sem ela, a sombra não tem onde cair.
    const bc = document.createElement('canvas'); bc.width = bc.height = 512
    const bg = bc.getContext('2d'); const brg = bg.createRadialGradient(256, 256, 20, 256, 256, 256)
    brg.addColorStop(0, 'rgba(255,255,255,0.9)'); brg.addColorStop(0.42, 'rgba(255,255,255,0.18)'); brg.addColorStop(1, 'rgba(255,255,255,0)')
    bg.fillStyle = brg; bg.fillRect(0, 0, 512, 512)
    { const id = bg.getImageData(0, 0, 512, 512), d = id.data; for (let i = 3; i < d.length; i += 4) d[i] = Math.max(0, Math.min(255, d[i] + (Math.random() * 6 - 3))); bg.putImageData(id, 0, 0) }
    this.backdropMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(bc), color: 0x6a5230, transparent: true, opacity: 0.34, depthWrite: false, toneMapped: false })
    this.backdrop = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 6.5), this.backdropMat)
    this.backdrop.renderOrder = -2
    scene.add(this.backdrop)

    this.group.scale.setScalar(0.9)
    scene.add(this.group)
  }

  // Ordem de montagem (execução): quem entra primeiro no encaixe.
  get assemblyOrder() { return ['fundo', 'caixa', 'platina', 'tambor-da-mola', 'roda-central', 'roda-terceira', 'roda-quarta', 'roda-escape', 'balanco', 'coroa', 'mostrador', 'ponteiro-horas', 'ponteiro-minutos', 'ponteiro-segundos', 'bisel', 'cristal'] }

  setVisible(v) { this.group.visible = v }

  update(dt, t, pointer) {
    this.t = t
    const s = this.state
    const order = this.assemblyOrder
    const n = order.length
    const tmp = new THREE.Vector3()
    this.parts.forEach((p, i) => {
      const { home, apart } = p.userData
      // Explosão ordenada com escalonamento por ordem de montagem
      const idx = order.indexOf(p.name)
      const stagger = idx / n
      const e = THREE.MathUtils.smoothstep(THREE.MathUtils.clamp((s.explode - stagger * 0.6) / 0.4, 0, 1), 0, 1)
      tmp.lerpVectors(home, apart, e)
      // Constelação: espalha a partir da posição explodida com deriva senoidal
      if (s.scatter > 0) {
        const seed = this.scatterSeeds[i]
        const drift = new THREE.Vector3(
          Math.sin(t * 0.5 + i * 1.7) * 0.25,
          Math.cos(t * 0.4 + i * 2.3) * 0.25,
          Math.sin(t * 0.35 + i) * 0.2,
        )
        const target = seed.clone().multiplyScalar(1.7 + (i % 3) * 0.35).add(drift)
        target.z *= 0.6
        // Peças grandes vão mais longe e para trás: ficam menores e não cobrem o texto.
        const lado = this.side ?? 1
        if (/caixa|fundo|bisel|cristal|mostrador|platina/.test(p.name)) { target.multiplyScalar(1.3); target.z = -1.8 - Math.abs(target.z); target.x = (Math.abs(target.x) + 0.4) * lado * (this.portrait ? 0.45 : 1); target.y = THREE.MathUtils.clamp(target.y, -1.4, 1.5) }
        // Em paisagem, nenhuma peça cruza para a coluna de texto.
        else if (!this.portrait) { target.x = (Math.abs(target.x) * 0.9 + 0.15) * lado; target.y = THREE.MathUtils.clamp(target.y, -1.85, 1.9) }
        // Em retrato, o texto ocupa o topo: as peças ficam abaixo dele.
        if (this.portrait) target.y = -Math.abs(target.y) * 0.8 + 0.6
        tmp.lerp(target, s.scatter)
        p.rotation.x = THREE.MathUtils.lerp(p.userData.rot.x, seed.y * 1.4 + t * 0.15, s.scatter)
        p.rotation.y = THREE.MathUtils.lerp(p.userData.rot.y, seed.x * 1.4 + t * 0.12, s.scatter)
      } else {
        p.rotation.x = p.userData.rot.x; p.rotation.y = p.userData.rot.y
      }
      p.position.copy(tmp)
      // Escala das peças grandes todo quadro (fora do bloco de dispersão, senão fica presa em 55% após o cap. 1).
      p.scale.setScalar(/caixa|fundo|bisel|mostrador|platina/.test(p.name) ? 1 - 0.45 * s.scatter : 1)
    })
    // Trem de engrenagens: gira quando o relógio está "running"
    const run = s.running
    this.mechTime += dt * run
    const dSpin = s.spinCrown - this.prevSpin; this.prevSpin = s.spinCrown
    this.gears.forEach((g) => { g.children[0].rotation.z += dt * g.userData.speed * 0.9 * run })
    this.barrel.children[0].rotation.z -= dt * 0.15 * run + dSpin * 0.35
    // Balanço: oscilação senoidal, 2,5 Hz visual; amplitude cai com health; assimetria com impacto
    const amp = (0.9 * run) * (0.55 + 0.45 * s.health)
    const phase = t * Math.PI * 2 * 2.5
    this.balanceWheelGroup.rotation.z = Math.sin(phase) * amp
    this.hairspring.scale.setScalar(1 + Math.sin(phase) * 0.06 * amp)
    this.hairspring.material = this.materials.steel
    // Ponteiros: hora fixa 10:09:xx no "problema", segundos correm quando running
    const sec = this.mechTime % 60
    this.hour.children[0].parent.rotation.z = -(10 / 12) * Math.PI * 2 - (9 / 60) * (Math.PI / 6)
    this.min.children[0].parent.rotation.z = -(9 / 60) * Math.PI * 2
    this.sec.children[0].parent.rotation.z = -(sec / 60) * Math.PI * 2
    // Coroa gira com a corda
    this.crown.children[0].rotation.x = s.wind * Math.PI * 6 + s.spinCrown
    // Tampa aberta: caixa/fundo deslizam
    this.back.position.z += -1.2 * s.opened
    this.crystal.position.z += 0.6 * s.opened
    this.bezel.position.z += 0.45 * s.opened
    this.crystal.children[0].material.opacity = this.crystalBaseOpacity * (1 - s.scatter); this.crystal.visible = s.scatter < 0.98
    this.shadowMat.opacity = 0.75 * (1 - Math.max(s.explode, s.scatter)) * (1 - s.opened * 0.5)
    this.backdrop.position.set(this.group.position.x + 0.2, this.group.position.y - 0.35, this.group.position.z - 1.6)
    this.backdropMat.opacity = 0.34 * (1 - s.scatter * 0.8)
    // Parallax pelo ponteiro
    this.group.rotation.y = THREE.MathUtils.lerp(this.group.rotation.y, (this.baseYaw || 0) + pointer.x * 0.25, 0.08)
    this.group.rotation.x = THREE.MathUtils.lerp(this.group.rotation.x, -pointer.y * 0.18, 0.08)
  }
}
