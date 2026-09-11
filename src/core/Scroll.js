import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { N, CAPITULOS } from '../data/narrativa.js'

gsap.registerPlugin(ScrollTrigger)

// Uma única autoridade move a página: Lenis suaviza a roda; touch e teclado seguem nativos.
// ScrollTrigger somente observa. Os capítulos especiais reservam espaço para leitura.
const PESOS = [2.8, 3.4, 3.4, 3.6, 5.0, 5.0]

export class Scroll {
  constructor(root) {
    this.progress = 0
    this.velocity = 0
    this.chapter = 0
    this.local = 0
    this.listeners = []
    this.sections = []

    this.motionPreference = matchMedia('(prefers-reduced-motion: reduce)')
    this.reduced = this.motionPreference.matches
    root.innerHTML = ''
    CAPITULOS.forEach((c, i) => {
      const s = document.createElement('section')
      s.id = c.slug
      // A última seção inclui a tela que permanece no viewport ao chegar ao fim.
      s.style.height = `${(PESOS[i] + (i === N - 1 ? 1 : 0)) * 100}svh`
      s.dataset.index = i
      s.setAttribute('aria-labelledby', `${c.slug}-titulo`)
      // Narrativa acessível: o canvas é decorativo; o texto real vive aqui, fora da tela.
      const hs = (c.hotspots || []).map((h) => `<li><b>${h.nome}.</b> ${h.texto}</li>`).join('')
      const ls = (c.licoes || []).map((l) => `<li><b>${l.termo}.</b> ${l.texto}</li>`).join('')
      s.innerHTML = `<div class="sr-only"><h2 id="${c.slug}-titulo">${c.nome}. ${c.titulo.replace(/\n/g, ' ')}</h2><p>${c.corpo}</p>${hs ? `<ul>${hs}</ul>` : ''}${c.essencia ? `<h3>${c.essencia}</h3><ul>${ls}</ul>` : ''}</div>`
      root.appendChild(s)
      this.sections.push(s)
    })

    this.lenis = new Lenis({ lerp: this.reduced ? 1 : 0.11, wheelMultiplier: 1, touchMultiplier: 1, smoothWheel: !this.reduced, syncTouch: false, prevent: (node) => !!node.closest?.('.pagina, .mapa, .registro, .menu') })
    this.lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((t) => this.lenis.raf(t * 1000))
    gsap.ticker.lagSmoothing(0)

    // Limites medidos nas seções reais, na mesma escala do progresso do ScrollTrigger (0..1 sobre docH − vh).
    this.bounds = []
    this.measure()
    addEventListener('resize', () => {
      cancelAnimationFrame(this.resizeFrame)
      this.resizeFrame = requestAnimationFrame(() => { this.lenis.resize(); ScrollTrigger.refresh() })
    })
    this.motionPreference.addEventListener('change', ({ matches }) => {
      this.reduced = matches
      this.lenis.options.smoothWheel = !matches
      this.lenis.options.lerp = matches ? 1 : 0.11
    })

    this.trigger = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => this.apply(self.progress, self.getVelocity() / 1000),
      onRefresh: (self) => { this.measure(); this.apply(self.progress, 0) },
      // Não mover a página depois que o usuário parou para ler.
      snap: false,
    })
  }

  measure() {
    const range = Math.max(1, document.documentElement.scrollHeight - innerHeight)
    this.range = range
    this.bounds = this.sections.map((s) => [Math.min(1, s.offsetTop / range), Math.min(1, (s.offsetTop + s.offsetHeight) / range)])
    // Sem sobreposição e sem buraco: o limite superior de cada capítulo é o inferior do próximo; o último fecha em 1.
    for (let i = 0; i < N - 1; i++) this.bounds[i][1] = this.bounds[i + 1][0]
    this.bounds[N - 1][1] = 1
  }

  apply(progress, velocity) {
    this.progress = Math.min(1, Math.max(0, progress))
    progress = this.progress
    this.velocity = velocity
    let i = this.bounds.findIndex(([a, b]) => progress >= a && progress < b)
    if (i < 0) i = progress >= 1 ? N - 1 : 0
    const [a, b] = this.bounds[i]
    this.chapter = i
    this.local = Math.min(1, Math.max(0, (progress - a) / Math.max(1e-6, b - a)))
    for (const fn of this.listeners) fn(this)
  }

  // Progresso global de um capítulo e sub-intervalo (0..1 dentro do capítulo).
  localOf(chapterIndex, t = 0) {
    const index = Math.min(N - 1, Math.max(0, Math.trunc(chapterIndex)))
    const [a, b] = this.bounds[index]
    return a + (b - a) * Math.min(1, Math.max(0, t))
  }

  onChange(fn) { this.listeners.push(fn) }

  // Navega para o ponto de entrada do capítulo (título visível), na mesma medida dos limites.
  to(chapterIndex, t = 0.26) {
    const px = this.localOf(chapterIndex, t) * this.range
    this.lenis.scrollTo(px, this.reduced ? { immediate: true } : { duration: 1.05, easing: (t) => t * t * (3 - 2 * t) })
  }
}
