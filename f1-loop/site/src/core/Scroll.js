import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { N, CAPITULOS, PESOS } from '../data/narrativa.js'

gsap.registerPlugin(ScrollTrigger)

export function stitchBounds(raw) {
  const bounds = raw.map(([a, b]) => [a, b])
  for (let i = 0; i < bounds.length - 1; i++) bounds[i][1] = bounds[i + 1][0]
  if (bounds.length) bounds[bounds.length - 1][1] = 1
  return bounds
}

export function resolveChapter(progress, bounds) {
  const n = bounds.length
  const p = Math.min(1, Math.max(0, progress))
  let i = bounds.findIndex(([a, b]) => p >= a && p < b)
  if (i < 0) i = p >= 1 ? n - 1 : 0
  const [a, b] = bounds[i]
  return { progress: p, chapter: i, local: Math.min(1, Math.max(0, (p - a) / Math.max(1e-6, b - a))) }
}

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
      s.style.height = `${((PESOS[i] ?? 3.4) + (i === N - 1 ? 1 : 0)) * 100}svh`
      s.dataset.index = i
      s.setAttribute('aria-labelledby', `${c.slug}-titulo`)
      const hs = (c.hotspots || []).map((h) => `<li><b>${h.nome}.</b> ${h.texto}</li>`).join('')
      const ls = (c.licoes || []).map((l) => `<li><b>${l.termo}.</b> ${l.texto}</li>`).join('')
      const f1 = c.f1 ? `<p>Fato de pista. ${c.f1.termo}: ${c.f1.texto}</p>` : ''
      s.innerHTML = `<div class="sr-only"><h2 id="${c.slug}-titulo">${c.nome}. ${c.titulo.replace(/\n/g, ' ')}</h2><p>${c.corpo}</p>${hs ? `<ul>${hs}</ul>` : ''}${c.essencia ? `<h3>${c.essencia}</h3><ul>${ls}</ul>` : ''}${f1}</div>`
      root.appendChild(s)
      this.sections.push(s)
    })

    this.lenis = new Lenis({ lerp: this.reduced ? 1 : 0.11, wheelMultiplier: 1, touchMultiplier: 1, smoothWheel: !this.reduced, syncTouch: false, prevent: (node) => !!node.closest?.('.pagina, .registro, .menu, .decisao, .scenarios') })
    this.lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((t) => this.lenis.raf(t * 1000))
    gsap.ticker.lagSmoothing(0)

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
      snap: false,
    })
  }

  measure() {
    const range = Math.max(1, document.documentElement.scrollHeight - innerHeight)
    this.range = range
    this.bounds = stitchBounds(this.sections.map((s) => [Math.min(1, s.offsetTop / range), Math.min(1, (s.offsetTop + s.offsetHeight) / range)]))
  }

  apply(progress, velocity) {
    this.velocity = velocity
    const resolved = resolveChapter(progress, this.bounds)
    this.progress = resolved.progress
    this.chapter = resolved.chapter
    this.local = resolved.local
    for (const fn of this.listeners) fn(this)
  }

  localOf(chapterIndex, t = 0) {
    const index = Math.min(N - 1, Math.max(0, Math.trunc(chapterIndex)))
    const [a, b] = this.bounds[index]
    return a + (b - a) * Math.min(1, Math.max(0, t))
  }

  onChange(fn) { this.listeners.push(fn) }

  to(chapterIndex, t = 0.26) {
    const px = this.localOf(chapterIndex, t) * this.range
    this.lenis.scrollTo(px, this.reduced ? { immediate: true } : { duration: 1.05, easing: (x) => x * x * (3 - 2 * x) })
  }
}
