import * as THREE from 'three'
import { Text } from 'troika-three-text'

// Capítulo 2 — "desenho técnico" atrás do relógio explodido.
// Uma única geometria de LineSegments: círculos concêntricos, eixos cruzados, marcas de escala
// e cinco cotas com setas ligando o centro às posições `apart` das peças. O traço aparece em
// sequência via geometry.setDrawRange(0, count * v); as etiquetas (troika) entram junto da sua cota.

const FONT_BODY = '/fonts/Lato-Regular.ttf'
const COR = 0x8fa3b8
const RAIOS = [0.6, 1.0, 1.4]
// Peças escolhidas por terem `apart` bem distribuído no plano xy (não colapsam no centro).
const COTAS = ['tambor-da-mola', 'roda-terceira', 'roda-quarta', 'roda-escape', 'coroa']
const SUB_HASTE = 13
const SEG_POR_COTA = SUB_HASTE + 3 // haste + 2 farpas da seta + travessão da ponta

const virg = (n, casas = 2) => n.toFixed(casas).replace('.', ',')

export class Blueprint {
  constructor(app, watch, scroll) {
    this.app = app; this.watch = watch; this.scroll = scroll
    this.v = 0
    this.shown = 0
    this.tmp = new THREE.Vector3()

    this.group = new THREE.Group()
    this.group.renderOrder = 2
    this.group.visible = false

    const segs = []
    const push = (x1, y1, x2, y2) => segs.push(x1, y1, 0, x2, y2, 0)

    // 1) Círculos concêntricos, do menor para o maior.
    const N = app.isMobile ? 48 : 72
    for (const r of RAIOS) {
      for (let i = 0; i < N; i++) {
        const a0 = (i / N) * Math.PI * 2, a1 = ((i + 1) / N) * Math.PI * 2
        push(Math.cos(a0) * r, Math.sin(a0) * r, Math.cos(a1) * r, Math.sin(a1) * r)
      }
    }
    // 2) Eixos cruzados, fatiados para nascerem varrendo.
    const EXT = 2.15, SUB = 20
    for (let i = 0; i < SUB; i++) {
      const t0 = -EXT + (2 * EXT * i) / SUB, t1 = -EXT + (2 * EXT * (i + 1)) / SUB
      push(t0, 0, t1, 0)
    }
    for (let i = 0; i < SUB; i++) {
      const t0 = -EXT + (2 * EXT * i) / SUB, t1 = -EXT + (2 * EXT * (i + 1)) / SUB
      push(0, t0, 0, t1)
    }
    // 3) Marcas de escala sobre os eixos, nos raios dos círculos.
    for (const r of RAIOS) {
      push(r, -0.07, r, 0.07); push(-r, -0.07, -r, 0.07)
      push(-0.07, r, 0.07, r); push(-0.07, -r, 0.07, -r)
    }

    this.staticCount = segs.length / 3
    this.cotaStart = this.staticCount
    const totalVerts = this.staticCount + COTAS.length * SEG_POR_COTA * 2
    const pos = new Float32Array(totalVerts * 3)
    pos.set(segs)

    const geo = new THREE.BufferGeometry()
    this.posAttr = new THREE.BufferAttribute(pos, 3)
    this.posAttr.setUsage(THREE.DynamicDrawUsage)
    geo.setAttribute('position', this.posAttr)
    geo.setDrawRange(0, 0)
    this.geometry = geo
    this.total = totalVerts

    const mat = new THREE.LineDashedMaterial({
      color: COR, dashSize: 0.05, gapSize: 0.03, linewidth: 1,
      transparent: true, opacity: 0.55, depthWrite: false,
      blending: THREE.AdditiveBlending, toneMapped: false,
    })
    this.lines = new THREE.LineSegments(geo, mat)
    this.lines.frustumCulled = false
    this.lines.computeLineDistances()
    this.group.add(this.lines)

    // Etiquetas de cota: aparecem quando o traço da sua cota termina de ser desenhado.
    this.labels = COTAS.map((nome, i) => {
      const part = watch.parts.find((p) => p.name === nome)
      const ap = part ? part.userData.apart : new THREE.Vector3()
      const rad = Math.hypot(ap.x, ap.y)
      const tx = new Text()
      tx.text = `Ø ${virg(rad * 2, 1)}\nz ${ap.z >= 0 ? '+' : '-'}${virg(Math.abs(ap.z))}`
      tx.font = FONT_BODY
      tx.fontSize = 0.07
      tx.lineHeight = 1.35
      tx.letterSpacing = 0.08
      tx.color = COR
      tx.anchorY = 'middle'
      tx.anchorX = ap.x >= 0 ? 'left' : 'right'
      tx.material.transparent = true
      tx.material.depthWrite = false
      tx.material.toneMapped = false
      tx.fillOpacity = 0
      tx.sync()
      this.group.add(tx)
      return { tx, part, limiar: (this.cotaStart + (i + 0.55) * SEG_POR_COTA * 2) / totalVerts }
    })

    app.scene.add(this.group)
  }

  set(v) { this.v = THREE.MathUtils.clamp(v, 0, 1) }

  // Reescreve as cinco cotas em coordenadas locais do desenho (o relógio gira, translada e escala).
  _cotas(escala) {
    const pos = this.posAttr.array
    const gp = this.watch.group.position
    let o = this.cotaStart * 3
    this.labels.forEach(({ part, tx }) => {
      let x = 0, y = 0
      if (part) {
        this.tmp.copy(part.userData.apart)
        this.watch.group.localToWorld(this.tmp)
        x = (this.tmp.x - gp.x) / escala
        y = (this.tmp.y - gp.y) / escala
      }
      const len = Math.hypot(x, y) || 1
      const dx = x / len, dy = y / len
      const x0 = dx * 0.16, y0 = dy * 0.16
      for (let k = 0; k < SUB_HASTE; k++) {
        const a = k / SUB_HASTE, b = (k + 1) / SUB_HASTE
        pos[o++] = x0 + (x - x0) * a; pos[o++] = y0 + (y - y0) * a; pos[o++] = 0
        pos[o++] = x0 + (x - x0) * b; pos[o++] = y0 + (y - y0) * b; pos[o++] = 0
      }
      // Farpas da seta na ponta (±150°) e travessão perpendicular.
      for (const ang of [2.618, -2.618]) {
        const ca = Math.cos(ang), sa = Math.sin(ang)
        pos[o++] = x; pos[o++] = y; pos[o++] = 0
        pos[o++] = x + (dx * ca - dy * sa) * 0.13; pos[o++] = y + (dx * sa + dy * ca) * 0.13; pos[o++] = 0
      }
      pos[o++] = x - dy * 0.09; pos[o++] = y + dx * 0.09; pos[o++] = 0
      pos[o++] = x + dy * 0.09; pos[o++] = y - dx * 0.09; pos[o++] = 0
      // Etiqueta sobre a própria linha de cota (convenção de desenho técnico) e dentro do quadro:
      // além da ponta da seta ela sairia da tela nos enquadramentos do capítulo 2.
      // As linhas ficam no plano do desenho (z −0,6 em mundo); a etiqueta sobe quase até o plano
      // focal, senão o DOF do capítulo transforma um texto de 9 px em borrão ilegível.
      tx.position.set(x - dy * 0.10, y + dx * 0.10, 0.48)
    })
    this.posAttr.needsUpdate = true
  }

  update(dt, t) {
    // O Director só chama set() no capítulo 2; fora dele o último valor ficaria preso.
    const alvo = this.scroll && this.scroll.chapter !== 2 ? 0 : this.v
    this.shown += (alvo - this.shown) * (1 - Math.pow(0.02, dt))
    const vis = this.shown > 0.004
    this.group.visible = vis
    if (!vis) return

    // Acompanha o herói: mesmo centro, meia unidade atrás, na escala do relógio.
    const escala = this.watch.group.scale.x / 0.9
    const gp = this.watch.group.position
    this.group.position.set(gp.x, gp.y, gp.z - 0.6)
    this.group.scale.setScalar(escala)
    this.group.rotation.z = Math.sin(t * 0.08) * 0.012 // respiração quase imperceptível

    // Recalcula cotas e distâncias só quando o herói se moveu (evita alocar um atributo novo por quadro).
    const g = this.watch.group
    const chave = `${escala.toFixed(3)}|${g.position.x.toFixed(3)}|${g.position.y.toFixed(3)}|${g.rotation.x.toFixed(3)}|${g.rotation.y.toFixed(3)}|${g.rotation.z.toFixed(3)}`
    if (chave !== this._chave) {
      this._chave = chave
      this._cotas(escala)
      this._distanciasInPlace()
    }
    const n = Math.floor(this.total * THREE.MathUtils.clamp(this.shown, 0, 1) / 2) * 2
    this.geometry.setDrawRange(0, n)
    this.lines.material.opacity = 0.7 * Math.min(1, this.shown * 2.2)

    const p = n / this.total
    for (const l of this.labels) {
      const o = THREE.MathUtils.clamp((p - l.limiar) / 0.015, 0, 1) * 0.9
      l.tx.fillOpacity = o
      l.tx.visible = o > 0.01
    }
  }
  // Equivalente a computeLineDistances() para LineSegments, escrevendo no atributo já alocado.
  _distanciasInPlace() {
    const pos = this.geometry.attributes.position
    let ld = this.geometry.attributes.lineDistance
    if (!ld || ld.count !== pos.count) { this.lines.computeLineDistances(); return }
    const arr = ld.array
    let acc = 0
    for (let i = 0; i < pos.count; i += 2) {
      const dx = pos.getX(i + 1) - pos.getX(i), dy = pos.getY(i + 1) - pos.getY(i), dz = pos.getZ(i + 1) - pos.getZ(i)
      const len = Math.sqrt(dx * dx + dy * dy + dz * dz)
      arr[i] = acc; arr[i + 1] = acc + len; acc += len
    }
    ld.needsUpdate = true
  }
}
