// Dois slides integrados ao percurso de rolagem, com atalhos opcionais.
export const PAGINAS = {
  loop: {
    rotulo: 'Avaliação · aprofundamento', titulo: 'Engenharia de loop',
    lead: 'Produzir. Criticar. Revisar. Verificar.', imagem: 'pagina-loop.jpg',
    alt: 'Engrenagens douradas organizadas em um ciclo de revisão.',
    metafora: 'Medir. Regular. Medir de novo.',
    secoes: [
      { titulo: 'Preparar', itens: ['Referência real', 'Critério verificável', 'Tarefas delimitadas'] },
      { titulo: 'Uma volta', itens: ['Produzir e criticar', 'Revisar o necessário', 'Verificar o resultado'] },
      { titulo: 'Controlar', itens: ['Crítico independente', 'Evidência conferida', 'Reverter regressões'] },
      { titulo: 'Encerrar', itens: ['Critério atingido', 'Risco identificado', 'Limite: inconclusivo'] },
    ],
  },
  grafo: {
    rotulo: 'Aprendizado · aprofundamento', titulo: 'Engenharia de grafo',
    lead: 'Um segundo cérebro para conectar o que você sabe.', imagem: 'pagina-grafo-final.png',
    alt: 'Grafo de conhecimento em forma de cérebro, com comunidades, nós centrais e um caminho destacado entre memórias e ideias.',
    metafora: 'Conecte memórias. Recupere caminhos.',
    secoes: [
      { titulo: 'O que é', itens: ['Nó: documento ou decisão', 'Ligação: cita, depende, responde', 'Origem: extraída ou inferida'] },
      { titulo: 'Navegar', itens: ['Pergunta orienta o caminho', 'Vizinhos relevantes', 'Cada passo com fonte'] },
      { titulo: 'Construir', itens: ['Inventariar a pasta', 'Extrair e conferir relações', 'Atualizar a cada ciclo'] },
      { titulo: 'Recuperar contexto', itens: ['Grafo organiza relações', 'Busca encontra trechos', 'Medir custo e precisão'] },
    ],
  },
}
