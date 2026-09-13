// Registro do ciclo: evidências, decisões e resultados que o visitante produz ao interagir.
// Guardado em localStorage (nada sai do navegador), exportável em JSON. Van Aken: a documentação acompanha todas as fases.
const CHAVE = 'relogio-de-precisao:registro'
export const FASES = ['Problema', 'Pesquisa', 'Planejamento', 'Execução', 'Avaliação', 'Aprendizado']

function storageOk(storage) {
  return Boolean(storage && typeof storage.getItem === 'function' && typeof storage.setItem === 'function')
}

export function criarRegistro(storage) {
  const ler = () => {
    if (!storageOk(storage)) return []
    try { return JSON.parse(storage.getItem(CHAVE) || '[]') } catch { return [] }
  }
  const gravar = (lista) => {
    if (!storageOk(storage)) return
    try { storage.setItem(CHAVE, JSON.stringify(lista)) } catch { /* modo privado: fica só em memória */ }
  }
  const emit = (detail) => {
    if (typeof dispatchEvent === 'function' && typeof CustomEvent === 'function') {
      dispatchEvent(new CustomEvent('registro', { detail }))
    }
  }

  let memoria = ler()

  return {
    fases: FASES,
    lista() { return memoria.slice() },
    // registrar(capitulo, titulo, detalhe, tipo): ignora repetição imediata do mesmo título dentro da mesma fase.
    registrar(capitulo, titulo, detalhe = '', tipo = 'evidencia') {
      const ultimo = memoria[memoria.length - 1]
      if (ultimo && ultimo.capitulo === capitulo && ultimo.titulo === titulo && ultimo.detalhe === detalhe) return ultimo
      const item = { id: `${Date.now().toString(36)}-${memoria.length}`, capitulo, fase: FASES[capitulo] || '', titulo, detalhe, tipo, quando: new Date().toISOString() }
      memoria.push(item); gravar(memoria)
      emit(item)
      return item
    },
    limpar() { memoria = []; gravar(memoria); emit(null) },
    exportar() {
      const blob = new Blob([JSON.stringify({ site: 'Relógio de Precisão', exportadoEm: new Date().toISOString(), registros: memoria }, null, 2)], { type: 'application/json' })
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
      a.download = `relogio-de-precisao-registro-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    },
  }
}

export const registro = criarRegistro(typeof localStorage === 'undefined' ? null : localStorage)
