import { CAPITULOS, N } from '../data/narrativa.js'
import { registro } from '../core/Registro.js'
import { PAGINAS } from '../data/paginas.js'

// HUD em DOM: pontos de capítulo, menu, dica de scroll, cenários, tooltip. Fora do canvas, como no Corn Revolution.
export function setupUI(scroll, director) {
  const dots = document.getElementById('dots')
  const menuList = document.getElementById('menu-list')
  const menu = document.getElementById('menu')
  const menuBtn = document.getElementById('menu-btn')
  const hint = document.getElementById('hint')
  const scenarios = document.getElementById('scenarios')
  const deviation = document.getElementById('deviation')

  // Gráfico de deriva (inspiração F1: ritmo ao longo das voltas): 24 h do relógio contra o padrão atômico.
  const drift = document.getElementById('drift')
  const drawDrift = (nome) => {
    const cen = CAPITULOS[4].cenarios[nome]
    const W = 280, H = 64, x0 = 30, x1 = W - 6, yMid = 34, esc = 3.0
    const pts = []
    for (let h = 0; h <= 24; h++) {
      const t = h / 24
      const forma = nome === 'impacto' ? (t < 0.3 ? t / 0.3 * 0.25 : 0.25 + (t - 0.3) / 0.7 * 0.75) : nome === 'posicao' ? t + Math.sin(t * Math.PI * 4) * 0.08 : t + Math.sin(t * Math.PI * 2) * 0.05
      pts.push([x0 + t * (x1 - x0), yMid - cen.desvio * forma * esc])
    }
    const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
    const area = `${d} L${x1} ${yMid} L${x0} ${yMid} Z`
    drift.innerHTML = `<line class="eixo" x1="${x0}" y1="${yMid}" x2="${x1}" y2="${yMid}"/><path class="area" d="${area}"/><path class="padrao" d="M${x0} ${yMid} L${x1} ${yMid}"/><path class="relogio" d="${d}"/>` +
      `<text x="${x0}" y="${H - 2}">0 h</text><text x="${x1}" y="${H - 2}" text-anchor="end">24 h</text><text x="0" y="${yMid + 3}" class="ouro">0</text><text x="${x1}" y="${Math.min(H - 12, Math.max(8, pts[24][1] - 6))}" text-anchor="end" class="ouro">${fmt(cen.desvio)}</text>`
  }

  // Registro do ciclo: gaveta à direita, contador no HUD, exportação JSON.
  const reg = document.getElementById('registro'), regBtn = document.getElementById('reg-btn'), regList = document.getElementById('registro-list')
  const regEmpty = document.getElementById('registro-empty'), regCount = document.getElementById('reg-count')
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
  const renderReg = () => {
    const itens = registro.lista()
    regCount.textContent = String(itens.length).padStart(2, '0')
    regEmpty.hidden = itens.length > 0
    regList.innerHTML = itens.slice().reverse().map((r) => `<li class="is-${r.tipo}"><small>${esc(r.fase)}</small><b>${esc(r.titulo)}</b>${r.detalhe ? `<span>${esc(r.detalhe)}</span>` : ''}</li>`).join('')
  }
  const openReg = () => { reg.hidden = false; regBtn.setAttribute('aria-expanded', 'true'); renderReg() }
  const closeReg = () => { reg.hidden = true; regBtn.setAttribute('aria-expanded', 'false') }
  regBtn.addEventListener('click', () => (reg.hidden ? openReg() : closeReg()))
  document.getElementById('reg-close').addEventListener('click', closeReg)
  document.getElementById('reg-export').addEventListener('click', () => registro.exportar())
  document.getElementById('reg-clear').addEventListener('click', () => { registro.limpar(); renderReg() })
  addEventListener('registro', renderReg)
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !reg.hidden) closeReg() })
  renderReg()

  CAPITULOS.forEach((c, i) => {
    const a = document.createElement('a'); a.href = `#${c.slug}`; a.innerHTML = `<span>${c.nome}</span><i></i>`
    a.addEventListener('click', (e) => { e.preventDefault(); scroll.to(i) })
    dots.appendChild(a)
    const li = document.createElement('li'); const m = document.createElement('a'); m.href = `#${c.slug}`; m.textContent = c.nome
    m.addEventListener('click', (e) => { e.preventDefault(); closeMenu(); scroll.to(i) })
    li.appendChild(m); menuList.appendChild(li)
  })
  const dotEls = [...dots.children], menuEls = [...menuList.querySelectorAll('a')]

  const openMenu = () => { menu.hidden = false; menuBtn.setAttribute('aria-expanded', 'true'); menuBtn.textContent = 'Fechar'; scroll.lenis.stop(); menuEls[scroll.chapter]?.focus() }
  const closeMenu = () => { menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.textContent = 'Capítulos'; scroll.lenis.start(); menuBtn.focus() }
  menu.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return
    const items = [...menu.querySelectorAll('a,button,[tabindex="0"]')]
    const first = items[0], last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  })
  menuBtn.addEventListener('click', () => (menu.hidden ? openMenu() : closeMenu()))
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) closeMenu() })

  const fmt = (v) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(1).replace('.', ',')} s/dia`
  scenarios.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
    scenarios.querySelectorAll('button').forEach((x) => x.classList.toggle('is-active', x === b))
    director.setScenario(b.dataset.scenario)
    deviation.textContent = fmt(CAPITULOS[4].cenarios[b.dataset.scenario].desvio)
    drawDrift(b.dataset.scenario)
    const cen = CAPITULOS[4].cenarios[b.dataset.scenario]
    registro.registrar(4, `Cenário ${b.textContent.trim().toLowerCase()}: ${fmt(cen.desvio)}`, cen.texto || cen.descricao || 'Desvio medido contra o padrão atômico.', 'resultado')
  }))
  deviation.textContent = fmt(CAPITULOS[4].cenarios.frio.desvio)
  drawDrift('frio')
  const progressBar = document.querySelector('#progress i'), creditos = document.getElementById('creditos')

  // Aprofundamentos aparecem no próprio percurso; atalhos só avançam a rolagem.
  const aula = document.createElement('aside')
  aula.id = 'aula-pagina'; aula.className = 'aula-pagina'; aula.hidden = true
  aula.setAttribute('aria-label', 'Aprofundamento da aula')
  aula.innerHTML = Object.entries(PAGINAS).map(([id, p]) => `<article class="aula-slide" data-aula="${id}" hidden><header><small>${esc(p.rotulo)}</small><h2>${esc(p.titulo)}</h2><p class="lead">${esc(p.lead)}</p></header><figure><img src="${import.meta.env.BASE_URL}${p.imagem}" alt="${esc(p.alt)}" decoding="async" /><figcaption>${esc(p.metafora)}</figcaption></figure><div class="aula-grid">${p.secoes.map(sc => `<section><h3>${esc(sc.titulo)}</h3><ul>${sc.itens.map(it => `<li>${esc(it)}</li>`).join('')}</ul></section>`).join('')}</div><p class="aula-continue">${id === 'loop' ? 'Role para o aprendizado' : 'O aprendizado orienta o próximo ciclo'} <span aria-hidden="true">↓</span></p></article>`).join('')
  document.body.appendChild(aula)
  const openPagina = (id) => {
    if (!PAGINAS[id]) return
    if (!mapa.hidden) closeMapa()
    if (!menu.hidden) closeMenu()
    scroll.to(id === 'loop' ? 4 : 5, .78)
  }
  const ligarPaginas = (root) => root.querySelectorAll('li[data-pagina]').forEach((li) => {
    li.setAttribute('role', 'button'); li.tabIndex = 0
    li.addEventListener('click', () => openPagina(li.dataset.pagina))
    li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPagina(li.dataset.pagina) } })
  })
  const updateAula = (s) => {
    const id = s.chapter >= 4 && s.local >= .64 ? (s.chapter === 4 ? 'loop' : 'grafo') : null
    aula.hidden = !id
    document.body.classList.toggle('is-aula-slide', Boolean(id))
    for (const article of aula.children) article.hidden = article.dataset.aula !== id
  }

  // Ficha de ensino: segundo tempo do capítulo (50–62% entra, 88–98% sai), linhas em cascata.
  const ficha = document.getElementById('ficha'), fichaFase = document.getElementById('ficha-fase')
  const fichaF1 = document.getElementById('ficha-f1'), fichaF1Termo = document.getElementById('ficha-f1-termo'), fichaF1Texto = document.getElementById('ficha-f1-texto')
  const fichaEss = document.getElementById('ficha-essencia'), fichaList = document.getElementById('ficha-list'), fichaMapa = document.getElementById('ficha-mapa')
  const ROMANOS = ['I', 'II', 'III', 'IV', 'V']
  const sm = (t, a, b) => { const x = Math.min(1, Math.max(0, (t - a) / (b - a))); return x * x * (3 - 2 * x) }
  let fichaCap = -1
  const renderFicha = (i) => {
    fichaCap = i
    const c = CAPITULOS[i]
    fichaFase.textContent = `Essência · ${String(i + 1).padStart(2, '0')} ${c.nome}`
    fichaEss.textContent = c.essencia || ''
    fichaList.innerHTML = (c.licoes || []).map((l, k) => `<li${l.pagina ? ` class="has-pagina" data-pagina="${l.pagina}"` : ''}><i>${ROMANOS[k]}</i><div><b>${esc(l.termo)}</b><span>${esc(l.texto)}</span></div></li>`).join('')
    fichaMapa.hidden = i !== N - 1
    fichaF1.hidden = !c.f1
    if (c.f1) { fichaF1Termo.textContent = c.f1.termo; fichaF1Texto.textContent = c.f1.texto }
    ligarPaginas(fichaList)
  }
  const updateFicha = (s) => {
    if (s.chapter !== fichaCap) renderFicha(s.chapter)
    const vis = s.chapter >= 4 ? sm(s.local, .36, .43) * (1 - sm(s.local, .58, .63)) : sm(s.local, .5, .62) * (1 - sm(s.local, .88, .98))
    ficha.setAttribute('aria-hidden', vis < 0.01 ? 'true' : 'false')
    const head = sm(vis, 0, 0.6)
    fichaFase.style.opacity = head; fichaEss.style.opacity = head
    fichaEss.style.transform = `translateY(${(1 - head) * 14}px)`
    ;[...fichaList.children].forEach((li, k) => {
      const v = sm(vis, 0.15 + k * 0.14, 0.55 + k * 0.14)
      li.style.opacity = v; li.style.transform = `translateY(${(1 - v) * 16}px)`
    })
    const vf = sm(vis, 0.62, 1)
    fichaF1.style.opacity = vf; fichaF1.style.transform = `translateY(${(1 - vf) * 16}px)`
    fichaMapa.style.opacity = sm(vis, 0.7, 1)
  }
  renderFicha(0); updateFicha(scroll); updateAula(scroll)

  // Mapa do ciclo: mostrador com seis horas (uma por fase), ponteiro na fase lida, painel com essência e termos.
  const mapa = document.getElementById('mapa'), mapaBtn = document.getElementById('mapa-btn'), mapaSvg = document.getElementById('mapa-svg'), mapaPanel = document.getElementById('mapa-panel')
  const NS = 'http://www.w3.org/2000/svg'
  const el = (tag, attrs = {}, parent = mapaSvg) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e }
  const C = 200, R = 168
  el('circle', { class: 'ring', cx: C, cy: C, r: R })
  el('circle', { class: 'arrow', cx: C, cy: C, r: R - 22 })
  for (let m = 0; m < 60; m++) {
    const a = (m / 60) * Math.PI * 2 - Math.PI / 2, hora = m % 10 === 0, len = hora ? 12 : 6
    el('line', { class: `tick${hora ? ' is-hour' : ''}`, x1: C + Math.cos(a) * (R - 4), y1: C + Math.sin(a) * (R - 4), x2: C + Math.cos(a) * (R - 4 - len), y2: C + Math.sin(a) * (R - 4 - len) })
  }
  const hand = el('line', { class: 'hand', x1: C, y1: C, x2: C, y2: C - (R - 40) })
  el('line', { class: 'hand-tail', x1: C, y1: C, x2: C, y2: C + 26 })
  el('circle', { class: 'pin', cx: C, cy: C, r: 5 })
  const phs = CAPITULOS.map((c, i) => {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2, x = C + Math.cos(a) * R, y = C + Math.sin(a) * R
    const g = el('g', { class: 'ph', 'data-i': i, role: 'button', tabindex: 0, 'aria-label': c.nome })
    el('circle', { cx: x, cy: y, r: 7 }, g)
    const lx = C + Math.cos(a) * (R + 26), ly = C + Math.sin(a) * (R + 26)
    const t = el('text', { x: lx, y: ly + 4, 'text-anchor': Math.abs(Math.cos(a)) < 0.2 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end' }, g)
    const n = document.createElementNS(NS, 'tspan'); n.setAttribute('class', 'n'); n.textContent = `${String(i + 1).padStart(2, '0')} `; t.appendChild(n)
    t.appendChild(document.createTextNode(c.nome))
    g.addEventListener('mouseenter', () => selectMapa(i)); g.addEventListener('click', () => selectMapa(i))
    g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectMapa(i) } })
    return g
  })
  let mapaSel = -1
  const selectMapa = (i) => {
    if (i === mapaSel) return
    mapaSel = i
    const c = CAPITULOS[i]
    phs.forEach((g, k) => g.classList.toggle('is-active', k === i))
    const deg = (i / N) * 360
    hand.style.transform = `rotate(${deg}deg)`; hand.nextSibling.style.transform = `rotate(${deg}deg)`
    mapaPanel.innerHTML = `<small>Fase ${String(i + 1).padStart(2, '0')} de ${N}</small><h2>${esc(c.nome)}</h2><p class="ess">${esc(c.essencia || '')}</p><ol>${(c.licoes || []).map((l, k) => `<li${l.pagina ? ` class="has-pagina" data-pagina="${l.pagina}"` : ''}><i>${ROMANOS[k]}</i><div><b>${esc(l.termo)}</b><span>${esc(l.texto)}</span></div></li>`).join('')}</ol>${c.f1 ? `<p class="mapa__f1"><small>Na Fórmula 1</small><b>${esc(c.f1.termo)}</b><span>${esc(c.f1.texto)}</span></p>` : ''}<button class="ir" type="button">Ir ao capítulo</button>`
    mapaPanel.querySelector('.ir').addEventListener('click', () => { closeMapa(); scroll.to(i, 0.56) })
    ligarPaginas(mapaPanel)
  }
  let mapaInvoker
  const openMapa = () => { mapaInvoker = document.activeElement; mapa.hidden = false; mapaBtn.setAttribute('aria-expanded', 'true'); scroll.lenis.stop(); selectMapa(scroll.chapter); document.getElementById('mapa-close').focus() }
  const closeMapa = () => { mapa.hidden = true; mapaBtn.setAttribute('aria-expanded', 'false'); scroll.lenis.start(); (mapaInvoker?.isConnected ? mapaInvoker : mapaBtn).focus() }
  mapa.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return
    const items = [...mapa.querySelectorAll('button,a,[tabindex="0"]')]
    const first = items[0], last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  })
  mapaBtn.addEventListener('click', () => (mapa.hidden ? openMapa() : closeMapa()))
  document.getElementById('mapa-close').addEventListener('click', closeMapa)
  fichaMapa.addEventListener('click', (e) => { e.preventDefault(); openMapa() })
  document.getElementById('menu-mapa').addEventListener('click', (e) => { e.preventDefault(); closeMenu(); openMapa() })
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !mapa.hidden) closeMapa() })

  const syncLayout = (s) => {
    document.body.dataset.chapterIndex = String(s.chapter)
    document.body.classList.toggle('chapter-text-right', s.chapter % 2 === 1)
  }
  syncLayout(scroll)
  let last = -1
  scroll.onChange((s) => {
    if (s.chapter !== last) {
      last = s.chapter
      syncLayout(s)
      dotEls.forEach((d, i) => d.classList.toggle('is-active', i === s.chapter))
      menuEls.forEach((d, i) => d.classList.toggle('is-active', i === s.chapter))
      history.replaceState(null, '', `#${CAPITULOS[s.chapter].slug}`)
      if (s.chapter === 5) registro.registrar(5, 'Ciclo percorrido até o aprendizado', 'A curva de desvios vira a próxima calibração. O que ficou registrado orienta o próximo ciclo.', 'decisao')
    }
    hint.classList.toggle('is-hidden', s.progress > 0.02)
    progressBar.style.transform = `scaleX(${s.progress.toFixed(4)})`; progressBar.style.width = '100%'
    const final = s.chapter === N - 1 && s.local > .97
    creditos.style.opacity = final ? '1' : '0'
    creditos.setAttribute('aria-hidden', String(!final))
    updateFicha(s)
    updateAula(s)
    const showScenarios = s.chapter === 4 && s.local > 0.18 && s.local < 0.58
    scenarios.hidden = !showScenarios
  })

  // Setas do teclado navegam por capítulo.
  addEventListener('keydown', (e) => {
    if (!menu.hidden || !mapa.hidden || (e.target.closest && e.target.closest('input,textarea,select,button,a,[role=button],[contenteditable=true]'))) return
    if (e.key === 'ArrowRight') { e.preventDefault(); scroll.to(Math.min(N - 1, scroll.chapter + 1)) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); scroll.to(Math.max(0, scroll.chapter - 1)) }
  })

  // Deep link inicial
  const hash = location.hash.slice(1)
  const idx = CAPITULOS.findIndex((c) => c.slug === hash)
  if (idx > 0) setTimeout(() => scroll.to(idx), 300)
  if (PAGINAS[hash]) setTimeout(() => openPagina(hash), 300)
}
