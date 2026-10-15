import { CAPITULOS, N, PAGINAS } from '../data/narrativa.js'
import { registro } from '../core/Registro.js'

const BOARDS = [
  'ALVO: +18 pt · JUIZ: FP1',
  'run 320 / 80 h',
  'v1 NA PRATELEIRA',
  'A / B · FLOW-VIS',
  'TÚNEL ≠ PISTA',
  '2 · BOX',
  'PRÓXIMA · ENTRADA: REGISTRO',
]

export function setupUI(scroll, director) {
  const dots = document.getElementById('dots')
  const menuList = document.getElementById('menu-list')
  const menu = document.getElementById('menu')
  const menuBtn = document.getElementById('menu-btn')
  const hint = document.getElementById('hint')
  const clock = document.getElementById('clock')
  const boardText = document.getElementById('board-text')
  const board = document.getElementById('board')
  const scenarios = document.getElementById('scenarios')
  const deviation = document.getElementById('deviation')
  const drift = document.getElementById('drift')
  const decisao = document.getElementById('decisao')
  const falhasOut = document.getElementById('falhas')
  let falhas = 0

  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

  const reg = document.getElementById('registro')
  const regBtn = document.getElementById('reg-btn')
  const regList = document.getElementById('registro-list')
  const regEmpty = document.getElementById('registro-empty')
  const regCount = document.getElementById('reg-count')
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
    const a = document.createElement('a')
    a.href = `#${c.slug}`
    a.innerHTML = `<span>${c.estacao || c.nome}</span><i></i>`
    a.addEventListener('click', (e) => { e.preventDefault(); scroll.to(i) })
    dots.appendChild(a)
    const li = document.createElement('li')
    const m = document.createElement('a')
    m.href = `#${c.slug}`
    m.textContent = `${c.nome} · ${c.bloco}`
    m.addEventListener('click', (e) => { e.preventDefault(); closeMenu(); scroll.to(i) })
    li.appendChild(m)
    menuList.appendChild(li)
  })
  const dotEls = [...dots.children]
  const menuEls = [...menuList.querySelectorAll('a')]

  const openMenu = () => { menu.hidden = false; menuBtn.setAttribute('aria-expanded', 'true'); menuBtn.textContent = 'Fechar'; scroll.lenis.stop(); menuEls[scroll.chapter]?.focus() }
  const closeMenu = () => { menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.textContent = 'Capítulos'; scroll.lenis.start(); menuBtn.focus() }
  menuBtn.addEventListener('click', () => (menu.hidden ? openMenu() : closeMenu()))
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) closeMenu() })

  const aula = document.createElement('aside')
  aula.id = 'aula-pagina'
  aula.className = 'aula-pagina'
  aula.hidden = true
  aula.setAttribute('aria-label', 'Aprofundamento da aula')
  aula.innerHTML = Object.entries(PAGINAS).map(([id, p]) => `<article class="aula-slide" data-aula="${id}" hidden><header><small>${esc(p.rotulo)}</small><h2>${esc(p.titulo)}</h2><p class="lead">${esc(p.lead)}</p></header><p class="metafora">${esc(p.metafora)}</p><div class="aula-grid">${p.secoes.map((sc) => `<section><h3>${esc(sc.titulo)}</h3><ul>${sc.itens.map((it) => `<li>${esc(it)}</li>`).join('')}</ul></section>`).join('')}</div></article>`).join('')
  document.body.appendChild(aula)

  const ficha = document.getElementById('ficha')
  const fichaFase = document.getElementById('ficha-fase')
  const fichaF1 = document.getElementById('ficha-f1')
  const fichaF1Termo = document.getElementById('ficha-f1-termo')
  const fichaF1Texto = document.getElementById('ficha-f1-texto')
  const fichaEss = document.getElementById('ficha-essencia')
  const fichaList = document.getElementById('ficha-list')
  const ROMANOS = ['I', 'II', 'III']
  const sm = (t, a, b) => { const x = Math.min(1, Math.max(0, (t - a) / (b - a))); return x * x * (3 - 2 * x) }
  let fichaCap = -1
  const ligarPaginas = (root) => root.querySelectorAll('li[data-pagina]').forEach((li) => {
    li.setAttribute('role', 'button')
    li.tabIndex = 0
    li.addEventListener('click', () => scroll.to(li.dataset.pagina === 'verificador' ? 4 : 6, 0.72))
    li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scroll.to(li.dataset.pagina === 'verificador' ? 4 : 6, 0.72) } })
  })
  const renderFicha = (i) => {
    fichaCap = i
    const c = CAPITULOS[i]
    fichaFase.textContent = `Essência · ${String(i + 1).padStart(2, '0')} ${c.nome} · ${c.bloco}`
    fichaEss.textContent = c.essencia || ''
    fichaList.innerHTML = (c.licoes || []).map((l, k) => `<li${l.pagina ? ` class="has-pagina" data-pagina="${l.pagina}"` : ''}><i>${ROMANOS[k]}</i><div><b>${esc(l.termo)}</b><span>${esc(l.texto)}</span></div></li>`).join('')
    fichaF1.hidden = !c.f1
    if (c.f1) { fichaF1Termo.textContent = c.f1.termo; fichaF1Texto.textContent = c.f1.texto }
    ligarPaginas(fichaList)
  }
  const updateFicha = (s) => {
    if (s.chapter !== fichaCap) renderFicha(s.chapter)
    const aulaCap = Boolean(CAPITULOS[s.chapter].aprofundamento)
    const vis = aulaCap ? sm(s.local, 0.36, 0.43) * (1 - sm(s.local, 0.58, 0.63)) : sm(s.local, 0.5, 0.62) * (1 - sm(s.local, 0.88, 0.98))
    ficha.setAttribute('aria-hidden', vis < 0.01 ? 'true' : 'false')
    const head = sm(vis, 0, 0.6)
    fichaFase.style.opacity = head
    fichaEss.style.opacity = head
    ;[...fichaList.children].forEach((li, k) => { li.style.opacity = sm(vis, 0.15 + k * 0.14, 0.55 + k * 0.14) })
    fichaF1.style.opacity = sm(vis, 0.62, 1)
  }

  const drawDrift = (nome) => {
    const cen = CAPITULOS[4].cenarios[nome]
    const W = 280, H = 64, x0 = 30, x1 = W - 6, yMid = 34
    const pts = []
    for (let i = 0; i <= 12; i++) {
      const t = i / 12
      const forma = nome === 'piso' ? (t < 0.33 ? -0.4 * (t / 0.33) : -0.4 + (t - 0.33) / 0.67 * 1.2) : t
      pts.push([x0 + t * (x1 - x0), yMid - cen.desvio * forma * 1.6])
    }
    const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
    drift.innerHTML = `<line class="eixo" x1="${x0}" y1="${yMid}" x2="${x1}" y2="${yMid}"/><path class="relogio" d="${d}"/><path class="padrao" d="M${x0} ${yMid} L${x1} ${yMid}"/>`
  }
  const fmt = (v) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v)} pt`
  scenarios.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
    scenarios.querySelectorAll('button').forEach((x) => x.classList.toggle('is-active', x === b))
    director.setScenario(b.dataset.scenario)
    const cen = CAPITULOS[4].cenarios[b.dataset.scenario]
    deviation.textContent = fmt(cen.desvio)
    drawDrift(b.dataset.scenario)
    registro.registrar(4, `Cenário ${cen.rotulo}`, cen.texto, 'leitura')
  }))
  drawDrift('cfd')

  decisao.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
    const acao = b.dataset.acao
    if (acao === 'tentar') {
      falhas = Math.min(3, falhas + 1)
      falhasOut.textContent = falhas >= 3 ? '3 · o que interrompeu?' : `falhas ${falhas} · BOX`
      registro.registrar(5, falhas >= 3 ? 'Parar e perguntar' : `Tentativa ${falhas}`, falhas >= 3 ? 'Terceira falha: devolver a uma pessoa.' : 'BOX. Reset com o que se aprendeu.', 'decisao')
      return
    }
    decisao.querySelectorAll('button[data-acao="reverter"], button[data-acao="manter"]').forEach((x) => x.classList.toggle('is-active', x === b))
    director.setKeepFloor(acao === 'manter')
    registro.registrar(5, acao === 'manter' ? 'Manter o piso novo' : 'Reverter ao último verde', acao === 'manter' ? 'Risco aceito sem causa raiz.' : 'Rollback. Causa no verificador.', 'decisao')
  }))

  const progressBar = document.querySelector('#progress i')
  const creditos = document.getElementById('creditos')
  const updateAula = (s) => {
    const id = s.chapter === 4 && s.local >= 0.64 ? 'verificador' : s.chapter === 6 && s.local >= 0.64 ? 'dossie' : null
    aula.hidden = !id
    document.body.classList.toggle('is-aula-slide', Boolean(id))
    for (const article of aula.children) article.hidden = article.dataset.aula !== id
  }

  let lastLogged = -1
  scroll.onChange((s) => {
    document.body.dataset.chapter = CAPITULOS[s.chapter].id
    document.body.dataset.chapterIndex = String(s.chapter)
    dotEls.forEach((el, i) => el.classList.toggle('is-active', i === s.chapter))
    clock.textContent = s.chapter === 6 && s.local > 0.4 && s.local < 0.64
      ? `${(Math.min(1.8, (s.local - 0.4) / 0.24 * 1.8)).toFixed(2).replace('.', ',')} s`
      : `run ${String(Math.round(s.progress * 320)).padStart(3, '0')}/320`
    boardText.textContent = BOARDS[s.chapter]
    board.setAttribute('aria-hidden', s.local < 0.2 ? 'true' : 'false')
    scenarios.hidden = s.chapter !== 4 || s.local < 0.36 || s.local > 0.63
    decisao.hidden = s.chapter !== 5 || s.local < 0.36 || s.local > 0.86
    hint.style.opacity = s.progress < 0.04 ? 1 : 0
    progressBar.style.transform = `scaleX(${s.progress})`
    creditos.setAttribute('aria-hidden', s.chapter === N - 1 && s.local > 0.96 ? 'false' : 'true')
    updateFicha(s)
    updateAula(s)
    if (s.chapter !== lastLogged && s.local > 0.5) {
      lastLogged = s.chapter
      const c = CAPITULOS[s.chapter]
      registro.registrar(s.chapter, c.nome, c.essencia, 'hipótese')
    }
  })
  renderFicha(0)
  updateFicha(scroll)
}
