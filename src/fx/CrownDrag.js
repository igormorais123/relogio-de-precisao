import * as THREE from 'three'
import { registro } from '../core/Registro.js'

// Capítulo 3 — dar corda com a mão. Arrastar verticalmente sobre a coroa gira a coroa
// (`watch.state.spinCrown`, com inércia) e soma corda (`watch.state.wind`).
// O Director reescreve `wind` todo quadro no capítulo 3, então a contribuição do arraste
// fica guardada em `this.extraWind` e é somada aqui no update, que roda depois do Director.

const RAIO_PX = 60
const POR_PX = 0.002

export class CrownDrag {
  constructor(app, watch, scroll) {
    this.app = app; this.watch = watch; this.scroll = scroll
    this.active = false
    this.dragging = false
    this.extraWind = 0
    this.spinVel = 0
    this.jaArrastou = false
    this.lastY = 0
    this.pointerId = null
    this.tela = new THREE.Vector2(-1, -1)
    this.tmp = new THREE.Vector3()

    this.hint = document.createElement('div')
    this.hint.className = 'crown-hint'
    this.hint.textContent = 'A rolagem dá corda ao mecanismo'
    this.hint.style.cssText = [
      'position:fixed', 'left:0', 'top:0', 'z-index:22', 'pointer-events:none',
      'font-family:"Lato","Helvetica Neue",Arial,sans-serif', 'font-size:10px',
      'letter-spacing:.2em', 'text-transform:uppercase', 'color:#e9e4d8',
      'opacity:0', 'white-space:nowrap', 'transform:translate(-50%,-190%)',
      'padding:8px 12px', 'border:1px solid rgba(211,169,79,.55)', 'background:rgba(6,8,11,.72)',
      'text-shadow:0 1px 8px rgba(6,8,11,.9)', 'transition:opacity .45s ease',
    ].join(';')
    document.body.appendChild(this.hint)

    this.onDown = this.onDown.bind(this)
    this.onMove = this.onMove.bind(this)
    this.onUp = this.onUp.bind(this)
    addEventListener('pointerdown', this.onDown, { passive: true })
    addEventListener('pointermove', this.onMove, { passive: true })
    addEventListener('pointerup', this.onUp, { passive: true })
    addEventListener('pointercancel', this.onUp, { passive: true })
    addEventListener('blur', () => this.encerrar())
  }

  set(v) {
    const a = v > 0
    if (a === this.active) return
    this.active = a
    if (!a) {
      this.encerrar()
      this.extraWind = 0
      this.hint.style.opacity = '0'
    }
  }

  // Projeta a coroa para coordenadas de tela (px). Retorna false se estiver atrás da câmera.
  projetar() {
    if (!this.watch.crown) return false
    this.watch.crown.getWorldPosition(this.tmp)
    this.tmp.project(this.app.camera)
    if (this.tmp.z > 1) return false
    this.tela.set((this.tmp.x * 0.5 + 0.5) * innerWidth, (-this.tmp.y * 0.5 + 0.5) * innerHeight)
    return true
  }

  onDown(e) {
    if (!this.active || this.dragging || (e.button != null && e.button !== 0)) return
    if (e.target && e.target.closest && e.target.closest('button,a,input,.menu')) return
    if (!this.projetar()) return
    if (Math.hypot(e.clientX - this.tela.x, e.clientY - this.tela.y) > RAIO_PX) return
    this.dragging = true
    this.pointerId = e.pointerId
    this.lastY = e.clientY
    this.lastT = performance.now()
    this.jaArrastou = true
    this.hint.style.opacity = '0'
    this.scroll?.lenis?.stop()
    document.body.style.cursor = 'grabbing'
  }

  onMove(e) {
    if (!this.dragging || (this.pointerId != null && e.pointerId !== this.pointerId)) return
    const dy = e.clientY - this.lastY
    this.lastY = e.clientY
    // Para baixo dá corda; a coroa gira no mesmo sentido do gesto.
    const giro = dy * 0.012
    const now = performance.now(), dtE = Math.min(0.1, Math.max(0.004, (now - (this.lastT || now)) / 1000)); this.lastT = now
    this.watch.state.spinCrown += giro
    this.spinVel = giro / dtE // rad/s medido pelo intervalo real entre eventos
    this.extraWind = THREE.MathUtils.clamp(this.extraWind + Math.abs(dy) * POR_PX, 0, 1)
  }

  onUp(e) { if (!this.dragging || (this.pointerId != null && e && e.pointerId != null && e.pointerId !== this.pointerId)) return; this.encerrar() }

  encerrar() {
    if (this.extraWind > 0.35) registro.registrar(3, 'Corda dada pela coroa', `Arraste manual levou a corda a ${Math.round(Math.min(1, this.extraWind) * 100)}%. Execução é intervir na realidade.`, 'resultado')
    if (!this.dragging) return
    this.dragging = false
    this.pointerId = null
    this.scroll?.lenis?.start()
    document.body.style.cursor = ''
  }

  update(dt, t) {
    if (!this.active) {
      if (this.extraWind !== 0) this.extraWind = 0
      // Inércia residual da coroa mesmo fora do capítulo.
      this.spinVel *= Math.pow(0.02, dt)
      this.watch.state.spinCrown += this.spinVel * dt
      return
    }

    // Inércia amortecida depois de soltar.
    if (!this.dragging) {
      this.spinVel *= Math.pow(0.015, dt)
      this.watch.state.spinCrown += this.spinVel * dt
    } else {
      this.spinVel *= Math.pow(0.5, dt)
    }

    // `extraWind` é a contribuição pública do arraste. O Director já a soma em `watch.state.wind`
    // antes de atualizar o relógio; esta linha é só a rede de segurança para quando ele não somar.
    // A comparação evita acumular a mesma contribuição duas vezes por quadro.
    const atual = this.watch.state.wind || 0
    if (this.extraWind > 0 && atual + 1e-6 < this.extraWind) {
      this.watch.state.wind = Math.min(1, atual + this.extraWind)
    }

    // Dica: só antes do primeiro arraste, colada na coroa.
    if (!this.jaArrastou && this.projetar()) {
      // Clampa dentro do viewport: a coroa fica na borda direita e o texto sairia da tela.
      const meia = this.hint.offsetWidth / 2 || 120
      this.watch.group.getWorldPosition(this.tmp); this.tmp.project(this.app.camera)
      const cx = (this.tmp.x * 0.5 + 0.5) * innerWidth, cy = (-this.tmp.y * 0.5 + 0.5) * innerHeight
      const raio = Math.hypot(this.tela.x - cx, this.tela.y - cy) * 1.02
      const x = THREE.MathUtils.clamp(cx, meia + 16, innerWidth - meia - 16)
      const y = THREE.MathUtils.clamp(cy + raio + 18, 90, innerHeight - 60)
      this.hint.style.transform = `translate(-50%,0) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`
      this.hint.style.opacity = '0.92'
    } else {
      this.hint.style.opacity = '0'
    }
  }
}
