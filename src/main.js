import { CAPITULOS } from './data/narrativa.js'
import { PAGINAS } from './data/paginas.js'

// Preloader com progresso real: cada etapa pesa o que custa (fontes, módulos 3D, ambiente, compilação de shaders, primeiro quadro).
const pct = document.getElementById('preloader-pct')
const arc = document.querySelector('.preloader__arc')
const preloader = document.getElementById('preloader')
let shown = 0, target = 0
const setProgress = (v) => { target = Math.max(target, Math.min(100, v)) }
const tickProgress = () => {
  shown += (target - shown) * 0.12
  pct.textContent = Math.round(shown)
  arc.style.strokeDashoffset = 326.7 * (1 - shown / 100)
  if (shown < 99.5 || target < 100) requestAnimationFrame(tickProgress)
  else { pct.textContent = '100'; arc.style.strokeDashoffset = 0 }
}
tickProgress()

function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!c.getContext('webgl2') } catch { return false }
}

function fallback() {
  preloader.classList.add('is-done')
  document.getElementById('gl').hidden = true
  document.querySelector('.hud').hidden = true
  document.getElementById('dots').hidden = true
  const u = document.getElementById('unsupported'); u.hidden = false
  const list = document.getElementById('unsupported-list')
  CAPITULOS.forEach((c) => { const li = document.createElement('li'); li.innerHTML = `<b>${c.nome}.</b> ${c.titulo.replace(/\n/g, ' ')} ${c.corpo}${c.essencia ? ` <em>${c.essencia}</em> ${(c.licoes || []).map((l) => `${l.termo}: ${l.texto}`).join(' ')}` : ''}`; list.appendChild(li) })
  // O conteúdo completo continua disponível mesmo sem a cena 3D.
  Object.values(PAGINAS).forEach((p) => {
    const li = document.createElement('li')
    li.innerHTML = `<h2>${p.titulo}</h2><p>${p.lead}</p><img src="${import.meta.env.BASE_URL}${p.imagem}" alt="${p.alt}" style="display:block;max-width:100%;height:auto" />${p.secoes.map((s) => `<h3>${s.titulo}</h3><ul>${s.itens.map((item) => `<li>${item}</li>`).join('')}</ul>`).join('')}`
    list.appendChild(li)
  })
}

async function boot() {
  if (!hasWebGL()) return fallback()
  setProgress(6)
  const [{ App }, { Scroll }, { Watch }, { Background }, { Director }, { Particles }, { Constellation }, { setupUI }, { preloadFonts }, fxExtra] = await Promise.all([
    import('./core/App.js'), import('./core/Scroll.js'), import('./watch/Watch.js'), import('./core/Background.js'),
    import('./core/Director.js'), import('./fx/Particles.js'), import('./fx/Constellation.js'), import('./ui/ui.js'), import('./core/Title.js'),
    import('./fx/index.js').catch(() => ({ createExtraFx: () => ({}) })),
  ])
  setProgress(38)
  await preloadFonts().catch(() => {})
  await Promise.race([Promise.all([document.fonts.load('40px "Bebas Neue"'), document.fonts.load('16px Lato')]), new Promise((r) => setTimeout(r, 6000))]).catch(() => {})
  setProgress(52)

  const app = new App(document.getElementById('gl'))
  setProgress(62)
  const background = new Background(app.scene)
  const watch = new Watch(app.scene, { isMobile: app.isMobile })
  const dust = new Particles(app.scene, { count: app.isMobile ? 300 : 650 })
  const constellation = new Constellation(app.scene, watch.parts)
  setProgress(74)
  const scroll = new Scroll(document.getElementById('scroll'))
  const fx = { constellation, ...(fxExtra.createExtraFx ? fxExtra.createExtraFx(app, watch, scroll) : {}) }
  const director = new Director(app, scroll, watch, background, fx)
  setupUI(scroll, director)
  setProgress(84)
  await app.compile()
  setProgress(94)

  app.onUpdate((dt, t) => {
    director.update(dt, t)
    dust.update(t, scroll.reduced ? director.zeroPointer : app.pointerSmooth, (scroll.reduced ? 0.35 : 0.6) + 0.4 * Math.abs(Math.min(1, scroll.velocity)), app.dpr)
    dust.uniforms.uLight.value.copy(app.key.position)
    constellation.update(t)
    for (const f of Object.values(fx)) if (f && f !== constellation && typeof f.update === 'function') f.update(dt, t)
  })
  app.start()
  // Primeiro quadro renderizado: só então o preloader sai.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    setProgress(100)
    setTimeout(() => preloader.classList.add('is-done'), 500)
  }))
  window.__app = { app, scroll, watch, director, fx }
}

boot().catch((err) => { console.error(err); fallback() })
