// Seis etapas para uma aula falada; o relógio é a metáfora visual.
export const CAPITULOS = [
  {
    "id": "problema",
    "slug": "capitulo-0",
    "nome": "Problema",
    "titulo": "TODO PROBLEMA\nÉ UM RELÓGIO\nPARADO.",
    "corpo": "Antes de tocar nas peças, nomeie o problema.",
    "cor": 395275,
    "acento": 9413560,
    "essencia": "Defina o que precisa mudar.",
    "licoes": [
      {
        "termo": "Sintoma ≠ causa",
        "texto": "O atraso pede investigação."
      },
      {
        "termo": "Problema em uma frase",
        "texto": "O que deve mudar?"
      },
      {
        "termo": "Critério de pronto",
        "texto": "Como verificar o resultado?"
      }
    ],
    "f1": {
      "termo": "Bandeira vermelha",
      "texto": "Antes de mexer no carro, o diretor nomeia o que parou a sessão."
    }
  },
  {
    "id": "pesquisa",
    "slug": "capitulo-1",
    "nome": "Pesquisa",
    "titulo": "ANTES DE\nCONSERTAR,\nENTENDER.",
    "corpo": "Escute o tique. Cruze as pistas.",
    "cor": 461586,
    "acento": 9413560,
    "essencia": "Pesquise em três lugares.",
    "licoes": [
      {
        "termo": "Na internet",
        "texto": "Fontes e documentação."
      },
      {
        "termo": "Nos seus arquivos",
        "texto": "Documentos e dados existentes."
      },
      {
        "termo": "Na sua cabeça",
        "texto": "A IA entrevista você."
      }
    ],
    "hotspots": [
      {
        "id": "sintoma",
        "nome": "Sintoma",
        "texto": "O relógio atrasa. A causa ainda precisa ser investigada."
      },
      {
        "id": "causa",
        "nome": "Hipótese",
        "texto": "A espiral pode estar alterando o ritmo."
      },
      {
        "id": "contexto",
        "nome": "Contexto",
        "texto": "Uso diário, temperatura e impactos."
      },
      {
        "id": "restricao",
        "nome": "Restrição",
        "texto": "Peças, orçamento e prazo."
      }
    ],
    "f1": {
      "termo": "Telemetria",
      "texto": "Cruzar sensores, boxes e piloto antes de mudar o setup."
    }
  },
  {
    "id": "planejamento",
    "slug": "capitulo-2",
    "nome": "Planejamento",
    "titulo": "UMA SOLUÇÃO\nÉ UMA HIPÓTESE\nCOM PEÇAS.",
    "corpo": "Projete o encaixe antes de apertar.",
    "cor": 592397,
    "acento": 13871439,
    "essencia": "Invista capacidade nas decisões.",
    "licoes": [
      {
        "termo": "PRD",
        "texto": "Requisitos: o quê e por quê."
      },
      {
        "termo": "TDD",
        "texto": "Documento de desenho técnico: como fazer."
      },
      {
        "termo": "Contexto relevante",
        "texto": "Fontes, restrições e critérios."
      }
    ],
    "hotspots": [
      {
        "id": "mola",
        "nome": "Mola = energia",
        "texto": "A mola real armazena a energia da corda. No método, é o recurso que move a intervenção."
      },
      {
        "id": "escape",
        "nome": "Escape = ritmo",
        "texto": "O escape libera a energia em passos iguais. É o cronograma que impede a solução de disparar."
      },
      {
        "id": "balanco",
        "nome": "Balanço = precisão",
        "texto": "O balanço oscila em frequência fixa. É o critério que define se a solução está certa."
      },
      {
        "id": "rubis",
        "nome": "Rubis = atrito",
        "texto": "Os rubis reduzem o atrito nos eixos. São as decisões que evitam desgaste na execução."
      }
    ],
    "f1": {
      "termo": "Estratégia de pit",
      "texto": "Uma hipótese com pneus, voltas e janela — não um chute."
    }
  },
  {
    "id": "execucao",
    "slug": "capitulo-3",
    "nome": "Execução",
    "titulo": "EXECUTAR É\nINTERVIR NA\nREALIDADE.",
    "corpo": "Monte, confira e registre cada passo.",
    "cor": 657671,
    "acento": 13871439,
    "essencia": "Escolha o executor pela tarefa.",
    "licoes": [
      {
        "termo": "Modelo capaz",
        "texto": "Valide antes de ampliar."
      },
      {
        "termo": "Gestão de tokens",
        "texto": "Custo, qualidade e retrabalho."
      },
      {
        "termo": "Passos verificáveis",
        "texto": "Prepare como desfazer quando possível."
      }
    ],
    "f1": {
      "termo": "Parada nos boxes",
      "texto": "Intervenção cronometrada: cada parafuso tem dono e tempo."
    }
  },
  {
    "id": "avaliacao",
    "slug": "capitulo-4",
    "nome": "Avaliação",
    "titulo": "PRECISÃO\nNÃO É\nOPINIÃO.",
    "corpo": "Compare o desvio com o padrão.",
    "cor": 461328,
    "acento": 9413560,
    "essencia": "Critique com critérios e evidências.",
    "licoes": [
      {
        "termo": "Revisão adversária",
        "texto": "Procure falhas; confira as provas."
      },
      {
        "termo": "Engenharia de loop",
        "texto": "Produzir, criticar, revisar, verificar.",
        "pagina": "loop"
      },
      {
        "termo": "Critério de saída",
        "texto": "Resultado, risco ou limite."
      }
    ],
    "cenarios": {
      "frio": {
        "desvio": 3.2,
        "texto": "A espiral encolhe no frio e o relógio adianta."
      },
      "calor": {
        "desvio": -4.8,
        "texto": "No calor a espiral alonga, cada oscilação demora mais e o relógio atrasa."
      },
      "impacto": {
        "desvio": 9.5,
        "texto": "Um impacto desloca a espiral do centro e o ritmo perde simetria."
      },
      "posicao": {
        "desvio": 1.4,
        "texto": "Na vertical a gravidade puxa o balanço e altera a amplitude."
      }
    },
    "f1": {
      "termo": "Delta de volta",
      "texto": "O cronômetro manda. Sensação de velocidade não conta."
    }
  },
  {
    "id": "aprendizado",
    "slug": "capitulo-5",
    "nome": "Aprendizado",
    "titulo": "O QUE APRENDEMOS\nVIRA A PRÓXIMA\nPEÇA.",
    "corpo": "O que funcionou orienta a próxima regulagem.",
    "cor": 395275,
    "acento": 13871439,
    "essencia": "Documente para o próximo ciclo.",
    "licoes": [
      {
        "termo": "Documentação",
        "texto": "Decisões, resultados e falhas."
      },
      {
        "termo": "Engenharia de grafo",
        "texto": "Documentos ligados por relações.",
        "pagina": "grafo"
      },
      {
        "termo": "Contexto recuperável",
        "texto": "Caminhos úteis; fontes conferidas."
      }
    ],
    "f1": {
      "termo": "Debrief",
      "texto": "O que a sessão ensinou vira a próxima peça do setup."
    }
  }
]

export const N = CAPITULOS.length
