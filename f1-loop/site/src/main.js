import { CAPITULOS, PAGINAS } from './data/narrativa.js'
import { detectWebGL } from './core/webgl.js'

const pct = document.getElementById('preloader-pct')
const preloader = document.getElementById('preloader')
let shown = 0, target = 0
const setProgress = (v) => { target = Math.max(target, Math.min(100, v)) }
const tickProgress = () => {
  shown += (target - shown) * 0.12
  pct.textContent = Math.round(shown)
  if (shown < 99.5 || target < 100) requestAnimationFrame(tickProgress)
  else pct.textContent = '100'
}
tickProgress()

function fallback() {
  preloader.classList.add('is-done')
  document.getElementById('gl').hidden = true
  document.querySelector('.hud').hidden = true
  document.getElementById('dots').hidden = true
  const u = document.getElementById('unsupported')
  u.hidden = false
  const list = document.getElementById('unsupported-list')
  CAPITULOS.forEach((c) => {
    const li = document.createElement('li')
    li.innerHTML = `<b>${c.nome}.</b> ${c.titulo.replace(/\n/g, ' ')} ${c.corpo}${c.essencia ? ` <em>${c.essencia}</em> ${(c.licoes || []).map((l) => `${l.termo}: ${l.texto}`).join(' ')}` : ''}${c.f1 ? ` <em>Fato de pista. ${c.f1.termo}:</em> ${c.f1.texto}` : ''}`
    list.appendChild(li)
  })
  Object.values(PAGINAS).forEach((p) => {
    const li = document.createElement('li')
    li.innerHTML = `<h2>${p.titulo}</h2><p>${p.lead}</p>${p.secoes.map((s) => `<h3>${s.titulo}</h3><ul>${s.itens.map((item) => `<li>${item}</li>`).join('')}</ul>`).join('')}`
    list.appendChild(li)
  })
}

async function boot() {
  if (!detectWebGL()) return fallback()
  setProgress(8)
  const [{ App }, { Scroll }, { Car }, { Background }, { Director }, { setupUI }, { preloadFonts }] = await Promise.all([
    import('./core/App.js'),
    import('./core/Scroll.js'),
    import('./hero/Car.js'),
    import('./core/Background.js'),
    import('./core/Director.js'),
    import('./ui/ui.js'),
    import('./core/Title.js'),
  ])
  setProgress(36)
  await preloadFonts().catch(() => {})
  await Promise.race([
    Promise.all([document.fonts.load('40px "Bebas Neue"'), document.fonts.load('16px Lato')]),
    new Promise((r) => setTimeout(r, 4000)),
  ]).catch(() => {})
  setProgress(54)

  const app = new App(document.getElementById('gl'))
  setProgress(66)
  const background = new Background(app.scene)
  const car = new Car(app.scene, { isMobile: app.isMobile })
  const scroll = new Scroll(document.getElementById('scroll'))
  const director = new Director(app, scroll, car, background)
  setupUI(scroll, director)
  setProgress(84)
  await app.compile()
  setProgress(94)

  app.onUpdate((dt) => { director.update(dt) })
  app.start()
  requestAnimationFrame(() => requestAnimationFrame(() => {
    setProgress(100)
    setTimeout(() => preloader.classList.add('is-done'), 400)
  }))
  window.__app = { app, scroll, car, director }
}

boot().catch((err) => { console.error(err); fallback() })
