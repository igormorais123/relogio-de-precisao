// Três descobertas opcionais, adaptadas do material de aula do professor.
const segredos = {
  1: { titulo: 'Desenhe a entrega antes do pedido', texto: 'Dizer o assunto não basta. Explique para quem é a resposta, qual formato você espera e o que precisa conferir no resultado.', exemplo: '“Prepare um roteiro de 5 minutos para iniciantes. Use três exemplos e termine com uma atividade. Sinalize o que depende de confirmação.”' },
  2: { titulo: 'Use uma colher, não uma pá', texto: 'Uma tarefa grande fica mais fácil de conferir quando vira pequenas entregas. Resolva uma etapa, confira o resultado e só então avance.', exemplo: '“Primeiro, organize os fatos que forneci. Separe dúvidas e lacunas. Espere minha revisão antes de escrever a conclusão.”' },
  4: { titulo: 'Dê um ponto final ao aperfeiçoamento', texto: 'Revisar sem critério pode virar um ciclo sem fim. Defina o que precisa estar correto e encerre quando os critérios forem atendidos.', exemplo: '“Confira fidelidade aos dados, clareza e atendimento ao pedido. Corrija falhas concretas; se os critérios estiverem atendidos, indique que a entrega está pronta.”' },
}

export function setupEasterEggs(scroll) {
  const marca = document.createElement('button')
  marca.className = 'segredo-marca'; marca.type = 'button'; marca.hidden = true
  marca.textContent = '✧'; marca.title = 'Uma pequena descoberta'
  marca.setAttribute('aria-label', 'Descobrir conteúdo extra da aula')
  marca.setAttribute('aria-haspopup', 'dialog')
  const dialog = document.createElement('dialog')
  dialog.className = 'segredo-dialog'; dialog.setAttribute('aria-labelledby', 'segredo-titulo')
  dialog.setAttribute('data-lenis-prevent', '')
  dialog.innerHTML = '<button class="segredo-fechar" type="button" aria-label="Fechar descoberta">×</button><small>Entre as engrenagens</small><h2 id="segredo-titulo"></h2><p class="segredo-texto"></p><blockquote></blockquote><p class="segredo-fonte">Do material de aula do professor · IA na resolução de problemas</p>'
  document.body.append(marca, dialog)
  let atual
  const update = (s) => {
    atual = segredos[s.chapter]
    marca.hidden = !atual || s.local < .36 || s.local > (s.chapter === 4 ? .58 : .88)
  }
  marca.addEventListener('click', () => {
    if (!atual || dialog.open) return
    dialog.querySelector('h2').textContent = atual.titulo
    dialog.querySelector('.segredo-texto').textContent = atual.texto
    dialog.querySelector('blockquote').textContent = atual.exemplo
    scroll.lenis.stop(); dialog.showModal()
  })
  dialog.querySelector('button').addEventListener('click', () => dialog.close())
  dialog.addEventListener('keydown', e => {
    e.stopPropagation()
    if (e.key === 'Tab') { e.preventDefault(); dialog.querySelector('button').focus() }
  })
  dialog.addEventListener('click', e => { if (e.target === dialog) {
    const r = dialog.getBoundingClientRect()
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close()
  } })
  dialog.addEventListener('close', () => { scroll.lenis.start(); if (!marca.hidden) marca.focus() })
  update(scroll); scroll.onChange(update)
}
