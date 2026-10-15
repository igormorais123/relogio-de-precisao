// Schema compatível com o Director do relógio (id, slug, nome, titulo, corpo, cor, acento,
// essencia, licoes, hotspots, f1) + campos do loop F1 (bloco, peca, fonte).
// Fonte narrativa: planejamento/03-narrativa/NARRATIVA.md. Fatos: 01-pesquisa/f1-licoes.md.

export const BLOCOS = ['preparar', 'uma-volta', 'controlar', 'encerrar']
export const PESOS = [2.8, 3.4, 3.6, 3.8, 5.0, 3.8, 5.0]

export const CAPITULOS = [
  {
    id: 'hipotese',
    slug: 'capitulo-0',
    nome: 'Hipótese',
    estacao: 'CFD',
    bloco: 'preparar',
    titulo: 'A PEÇA NASCE\nCOMO HIPÓTESE.',
    corpo: 'O CFD desenha um assoalho; a pista ainda não viu nenhum.',
    cor: 0x07090c,
    acento: 0x38e8ff,
    essencia: 'Trate a primeira resposta como hipótese: fixe a referência, o critério e o escopo antes do run.',
    licoes: [
      { termo: 'Referência real', texto: 'Compare com a pista, não com outra previsão: teste que falha, dado medido, documento.' },
      { termo: 'Critério verificável', texto: 'Uma frase que um comando ou uma pessoa sem contexto julga verdadeira ou falsa.' },
      { termo: 'Tarefa delimitada', texto: 'O que entra, o que fica de fora e o que é proibido, escritos antes de tocar no carro.' },
    ],
    hotspots: [
      { id: 'cfd', peca: 'floor', nome: 'Assoalho · 02', texto: 'Até 2.000 geometrias de CFD por período ATR: barato, rápido e não é a pista.' },
      { id: 'escopo', peca: 'main_body', nome: 'Carroceria', texto: 'Fora do escopo fica fantasma. Se duas peças mudam, o delta não tem dono.' },
      { id: 'jerez', peca: 'pit-board', nome: 'Alvo', texto: 'Jerez 1997: três pilotos em 1:21.072; o desempate estava escrito antes da volta.' },
    ],
    f1: {
      termo: 'Ferrari SF1000, 2020',
      texto: 'Binotto: descorrelação do projeto para a pista. Otimizar para o túnel produziu um carro frágil em robustez aero.',
      fonte: 'f1-licoes.md #24',
    },
  },
  {
    id: 'tunel',
    slug: 'capitulo-1',
    nome: 'Túnel',
    estacao: 'TÚNEL',
    bloco: 'preparar',
    titulo: '320 RUNS.\n80 HORAS\nDE VENTO.',
    corpo: 'Cada run é contado e cada run muda uma coisa só.',
    cor: 0x0a1218,
    acento: 0xff8a2a,
    essencia: 'Declare o orçamento antes da primeira volta e gaste-o no instrumento mais barato que responde.',
    licoes: [
      { termo: 'Orçamento de volta', texto: 'Teto explícito de voltas, tokens ou minutos; sem teto o custo cresce e a qualidade para.' },
      { termo: 'Ensaiar a volta', texto: 'Antes de gastar o run, percorra os pontos-chave e o que muda em relação ao anterior.' },
      { termo: 'Instrumento certo', texto: 'CFD, túnel ou pista; subagente ou contexto principal: o mais barato que ainda responde.' },
    ],
    hotspots: [
      { id: 'variante', peca: 'floor', nome: 'Assoalho', texto: 'Três variantes em três runs, não três mudanças num run. O delta tem dono.' },
      { id: 'smedley', peca: 'front_tire', nome: 'Pneu dianteiro', texto: 'Nenhum túnel correlaciona 100%. A esteira tenta parecer pista.' },
      { id: 'ensaio', peca: 'steering_wheel_main', nome: 'Volante', texto: 'Vettel: quais os pontos-chave? O que muda em relação ao run anterior?' },
      { id: 'teto', peca: 'rear_wing_main_part', nome: 'Asa traseira', texto: 'Red Bull 2021: estouro do teto custou 10% de túnel por 12 meses.' },
    ],
    f1: {
      termo: 'ATR, 2022–2025',
      texto: 'Base por período: 320 runs, 80 h de vento, modelo a 60% e 50 m/s. Menos runs pedem hipóteses melhores.',
      fonte: 'f1-licoes.md #5',
    },
  },
  {
    id: 'peca',
    slug: 'capitulo-2',
    nome: 'Peça',
    estacao: 'PEÇA',
    bloco: 'uma-volta',
    titulo: 'UMA PEÇA.\nA VELHA FICA\nNA PRATELEIRA.',
    corpo: 'Critique a peça antes de montar; a antiga fica na prateleira.',
    cor: 0x0c0f13,
    acento: 0xd92135,
    essencia: 'Produza, critique antes de instalar, revise só o apontado e guarde a versão anterior.',
    licoes: [
      { termo: 'Produzir e criticar', texto: 'A peça vai ao inspetor antes de tocar o carro: onde isso falha, nunca se está bom o bastante.' },
      { termo: 'Revisar o necessário', texto: 'Retrabalha-se o bordo apontado, não a peça inteira.' },
      { termo: 'Passo reversível', texto: 'A peça velha vai para a prateleira: um commit por volta verificada.' },
    ],
    hotspots: [
      { id: 'laminado', peca: 'floor', nome: 'Assoalho novo', texto: 'Um diff pequeno é um laminado fino: dá para inspecionar.' },
      { id: 'prateleira', peca: 'floor@velho', nome: 'Último estado verde', texto: 'git revert custa segundos porque a versão anterior existe.' },
      { id: 'precondicao', peca: 'front_wing_mount', nome: 'Ponto de macaco', texto: 'Mônaco 2022: 5 s onde pedia 6. Se a pré-condição cai, a ação não começa.' },
    ],
    f1: {
      termo: 'Newey, evolução',
      texto: 'A evolução é a chave depois que a faísca de uma boa direção foi definida. Revisões pequenas sobre uma base que passou.',
      fonte: 'f1-licoes.md #23',
    },
  },
  {
    id: 'pista',
    slug: 'capitulo-3',
    nome: 'Pista',
    estacao: 'PISTA',
    bloco: 'uma-volta',
    titulo: 'A TINTA\nNÃO OPINA.',
    corpo: 'Flow-vis, rakes e um gêmeo: evidência que dá para ler.',
    cor: 0x080a0e,
    acento: 0x4dffb0,
    essencia: 'Leve a peça ao mundo real, compare com o baseline na mesma sessão e leia a saída.',
    licoes: [
      { termo: 'Verificar o resultado', texto: 'A volta só conta quando o comando rodou e a saída foi lida.' },
      { termo: 'Baseline na mesma sessão', texto: 'O outro carro com a peça antiga, mesma pista, mesmo dia.' },
      { termo: 'Não mexer no teste', texto: 'A tinta não se limpa para parecer bonito. Teste falha: o problema está no código.' },
    ],
    hotspots: [
      { id: 'tinta', peca: 'floor', nome: 'Flow-vis', texto: 'A tinta escorre para onde o ar foi. É a saída de comando colada.' },
      { id: 'rake', peca: 'front_tire', nome: 'Rake', texto: 'A suíte inteira, não só a peça nova.' },
      { id: 'gemeo', peca: 'side_mirrors', nome: 'Gêmeo', texto: 'Racing Bulls, Spa 2026: um só pacote; a regra de quem o recebe foi escrita antes.' },
      { id: 'goodhart', peca: 'front_wing_top', nome: 'Tinta', texto: 'Não se limpa a tinta para parecer bonito. Não se edita o teste para ele passar.' },
    ],
    f1: {
      termo: 'Smedley, correlação',
      texto: 'Nenhum túnel correlaciona 100%. Flow-vis e rakes medem na pista os mesmos pontos do túnel.',
      fonte: 'f1-licoes.md #4',
    },
  },
  {
    id: 'correlacao',
    slug: 'capitulo-4',
    nome: 'Correlação',
    estacao: 'DADOS',
    bloco: 'controlar',
    titulo: 'O TÚNEL PREVIU.\nA PISTA\nDISCORDOU.',
    corpo: 'O fantasma é plano; o real oscila onde os dois divergem.',
    cor: 0x0c0a0d,
    acento: 0xff8a2a,
    essencia: 'Entregue a comparação a quem não projetou e cheque também o que não podia piorar.',
    aprofundamento: 'verificador',
    licoes: [
      { termo: 'Crítico independente', texto: 'Subagente ou sessão nova: só artefato e critério, nunca a justificativa.', pagina: 'verificador' },
      { termo: 'O que não pode piorar', texto: 'Mais downforce passou; dirigível em curva rápida não estava escrito.' },
      { termo: 'Calibrar o verificador', texto: 'Um teste que não reflete a realidade é pior que nenhum. Plante um defeito.' },
    ],
    hotspots: [
      { id: 'divergencia', peca: 'floor', nome: 'Divergência', texto: 'O túnel previu estável; a pista mediu oscilação. O problema é o verificador.' },
      { id: 'piloto', peca: 'steering_wheel_main', nome: 'Volante', texto: 'Se o piloto sente risco, você tem de ouvir. Dado primeiro, sensação depois.' },
      { id: 'sensores', peca: 'antennas', nome: 'Sensores', texto: 'Mais de 250 sensores, cerca de 30 MB por volta. Instrumente o que decide.' },
    ],
    cenarios: {
      cfd: { rotulo: 'CFD', desvio: 0, texto: 'Previsão. Número ilustrativo.' },
      tunel: { rotulo: 'Túnel 60%', desvio: -4, texto: 'Modelo a 60%. Número ilustrativo.' },
      pista: { rotulo: 'Pista seca', desvio: -11, texto: 'Bouncing medido. Número ilustrativo.' },
      piso: { rotulo: 'Piso novo', desvio: 3, texto: 'Melhora 4 voltas e degrada. Série ilustrativa.' },
    },
    f1: {
      termo: 'Aston Martin, Canadá 2023',
      texto: 'O piso deu downforce e tirou o carro da janela. Krack: não antecipamos os efeitos colaterais.',
      fonte: 'f1-licoes.md #28',
    },
  },
  {
    id: 'decisao',
    slug: 'capitulo-5',
    nome: 'Decisão',
    estacao: 'DECISÃO',
    bloco: 'controlar',
    titulo: 'VOLTE AO ÚLTIMO\nESTADO VERDE.',
    corpo: 'Se o novo quebrou o antigo, reverta antes de corrigir.',
    cor: 0x0d1216,
    acento: 0x4dffb0,
    essencia: 'Reverta primeiro, conte as falhas e procure a causa no verificador, não no sintoma.',
    licoes: [
      { termo: 'Reverter regressões', texto: 'Se a suíte inteira piorou, volte ao último verde antes de pensar em corrigir.' },
      { termo: 'Regra 2 e 3', texto: 'Duas falhas seguidas: reset com prompt refinado. Três: parar e perguntar.' },
      { termo: 'Causa raiz', texto: 'Reproduza o bouncing. Não suba a altura para esconder. Ache a anomalia no túnel.' },
    ],
    hotspots: [
      { id: 'regressao', peca: 'floor', nome: 'Regressão', texto: 'Passou no escrito, falhou no não escrito. Vai para a prateleira, não para o lixo.' },
      { id: 'verde', peca: 'floor@velho', nome: 'Último verde', texto: 'Reverter não é derrota: preserva o que funcionava.' },
      { id: 'placar', peca: 'side_mirrors', nome: 'Placar', texto: 'RB20 2024: detectamos, mas o carro era rápido. Custou o título de Construtores.' },
    ],
    f1: {
      termo: 'Ferrari SF-24, Silverstone 2024',
      texto: 'Piso de Barcelona deu bouncing. Rollback nos dois carros. Causa: anomalia no túnel. v2 em Monza.',
      fonte: 'f1-licoes.md #27',
    },
  },
  {
    id: 'legado',
    slug: 'capitulo-6',
    nome: 'Legado',
    estacao: 'DOSSIÊ',
    bloco: 'encerrar',
    titulo: 'O REGISTRO É\nO PRÓXIMO\nCARRO.',
    corpo: 'Encerre nomeado; o dossiê vira a entrada do próximo.',
    cor: 0x07090c,
    acento: 0xd92135,
    essencia: 'Encerre por uma das três saídas, congele o que passou e escreva o que o próximo contexto lê.',
    aprofundamento: 'dossie',
    licoes: [
      { termo: 'Critério atingido', texto: 'Verificação final colada, suíte verde, crítico sem defeito com evidência. Depois, congelar.', pagina: 'dossie' },
      { termo: 'Risco identificado', texto: 'Interface, deleção ou custo acima do teto: o loop para e uma pessoa decide.' },
      { termo: 'Limite: inconclusivo', texto: 'Tentado, descartado, a decidir. Quase lá não é saída.' },
    ],
    hotspots: [
      { id: 'v2', peca: 'floor', nome: 'Assoalho v2', texto: 'Monza 2024: piso corrigido depois do túnel consertado. Leclerc venceu.' },
      { id: 'flap', peca: 'front_wing_top', nome: 'Flap dianteiro', texto: 'O único ajuste de asa permitido sob parc fermé. Nomeie o que ainda pode mudar.' },
      { id: 'debrief', peca: 'lcd_screen', nome: 'Display', texto: 'McLaren 2026: setup, engenheiros, piloto. Dado antes de sensação — e por escrito.' },
      { id: 'risco', peca: 'rear_tire', nome: 'Pneu', texto: 'Abu Dhabi 2021: resultado parcial tratado como final. Até a bandeira, o risco precisa de plano.' },
    ],
    f1: {
      termo: 'Parc fermé',
      texto: 'Depois da classificação só pneus, combustível, freios e ângulo de asa. Mudar setup é largar do pit lane.',
      fonte: 'f1-licoes.md #9',
    },
  },
]

export const N = CAPITULOS.length

export const PAGINAS = {
  verificador: {
    rotulo: 'Correlação · aprofundamento',
    titulo: 'Calibrar o verificador',
    lead: 'Prever. Medir. Comparar os mesmos pontos.',
    metafora: 'Nenhum túnel correlaciona 100%. Nenhum avaliador de IA também.',
    secoes: [
      {
        titulo: 'O verificador também erra',
        itens: [
          'Um teste que não reflete a realidade é pior que nenhum.',
          'Sinal: o critério passa e o uso real falha.',
          'Plante um defeito conhecido; se o crítico aprova, o crítico está quebrado.',
        ],
      },
      {
        titulo: 'Crítico independente',
        itens: [
          'Contexto separado: só artefato e critério, nunca a justificativa.',
          'Instrução adversária: assuma um defeito; cite arquivo e linha.',
          'O mesmo contexto que produziu tende a aprovar.',
        ],
      },
      {
        titulo: 'Dado antes de sensação',
        itens: [
          'Ordem do debrief: o instrumento; depois, o executor.',
          'Evidência: saída de comando, log, diff, número. Opinião: parece, deve, acredito.',
          'Divergência entre executor e instrumento é sinal, não voto.',
        ],
      },
      {
        titulo: 'Não mexer no teste',
        itens: [
          'Teste falha: o problema está no código, não no teste.',
          'Consertar o verificador é legítimo com evidência de que ele mede errado.',
          'Confira git diff tests/ a cada volta.',
        ],
      },
    ],
  },
  dossie: {
    rotulo: 'Legado · aprofundamento',
    titulo: 'O dossiê e as quatro armadilhas',
    lead: 'Hipótese. Mudança. Comando. Resultado. Decisão.',
    metafora: 'Se não foi escrito, não existe para o próximo contexto.',
    secoes: [
      {
        titulo: 'Cinco colunas por volta',
        itens: [
          'Hipótese: o que se esperava e por quê.',
          'Mudança e comando: o que mudou e como foi verificado.',
          'Resultado e decisão: número medido; seguir, reverter ou parar.',
        ],
      },
      {
        titulo: 'Três saídas, nenhuma outra',
        itens: [
          'Critério atingido: verificação colada, suíte verde, congelar.',
          'Risco identificado: o loop para e uma pessoa decide.',
          'Limite: tentado, descartado, a decidir. Nunca quase lá.',
        ],
      },
      {
        titulo: 'Reset sem perder a volta',
        itens: [
          'Duas falhas: /clear com erro exato, arquivos e hipótese descartada.',
          'Três falhas: o que tentei, o que vi, o que preciso decidir.',
          'O registro é o que sobrevive ao reset.',
        ],
      },
      {
        titulo: 'Quatro armadilhas',
        itens: [
          'Loop que não converge: reverter ao verde e dividir a tarefa.',
          'Avaliador complacente: crítico separado, defeito plantado.',
          'Overfitting ao critério: nunca editar o teste. Custo: teto e reset.',
        ],
      },
    ],
  },
}
