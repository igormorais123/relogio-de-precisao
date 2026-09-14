# F1 Loop — uma decisão melhor a cada volta

Consolidação pedagógica proposta em 13/09/2026. Este documento complementa os tratamentos A–D e os três julgamentos; os originais permanecem preservados. É um roteiro para implementação, não um relatório de funcionalidades concluídas ou de ensaios executados.

**Estado:** a aula em `f1-loop/site/` preserva as **sete estações** de `capitulos/*.md` e `04-dados/narrativa-f1.draft.js`. A implementação complementar na raiz de `f1-loop/` já apresenta os **seis capítulos** deste arco, com modelo real, atividades e registro. Consulte `../../COMPLEMENTO-ESTRATEGIA.md`. As duas implementações convivem; não foram fundidas automaticamente.

## Decisão editorial

Usar **C, “Último Estado Verde”**, como espinha: preparar uma mudança, produzir uma candidata, confrontar o resultado, corrigir e decidir. Aproveitar de D a abertura próxima da matéria e o retorno ao mesmo enquadramento; de B os prompts que o aluno pode usar no dia seguinte e o quadro inicial que recebe a decisão final; de A a atenção às pré-condições e ao limite de tentativas.

A prioridade é o aprendizado. A experiência tem **seis capítulos e uma atividade contínua**, em vez de sete capítulos e uma coleção de cenas de corrida. O box, o túnel e o estúdio do Laboratório INTEIA bastam para o arco principal. Pista, chuva, mecânicos, pódio e pit stop completo ficam fora desta primeira narrativa: acrescentá-los depende de ganho pedagógico demonstrado e de orçamento visual.

O carro preservado representa a versão de referência; a peça destacada representa o escopo da mudança; o retorno ao box representa a decisão. O espectador entende a comparação antes de aprender mais terminologia. “Verde” significa **verificado para os critérios e condições registrados**, não garantia universal de qualidade.

## O que a análise corrige no material de origem

1. **Os julgamentos não são provas.** As três lentes ajudam a selecionar o roteiro, mas não verificam aprendizagem, física ou funcionamento no navegador. As notas são avaliações editoriais, não medições; maioria de agentes não confirma um fato.
2. **A metáfora precisa de fronteira.** Uma resposta de IA não é CFD; uma suíte de testes não é a pista inteira; uma fumaça desenhada não mede forças. A aproximação útil é formular, comparar e decidir. Nenhuma decisão visual comprova ganho aerodinâmico.
3. **Divergência pede investigação.** Um resultado ruim pode vir da candidata, da referência, do instrumento, das condições ou de uma interpretação errada. Não ensinar “a pista discordou, logo o verificador estava errado”.
4. **Separar papéis não garante independência.** Outro contexto ou modelo pode encontrar problemas novos e também repetir erros. O revisor deve receber artefato, critérios, fontes e contexto necessário para entender o uso; pedir “encontre obrigatoriamente um defeito” incentiva crítica inventada. Aceitar “não encontrei falha”, com o alcance da revisão.
5. **O tipo de evidência depende da pergunta.** Um teste automatizado pode verificar transformação de dados; a legibilidade pede leitura e observação no dispositivo. Não existe hierarquia universal “testes > screenshots > manual”. Nem todo ajuste exige uma suíte completa: a verificação deve cobrir o comportamento alterado e as regressões relevantes.
6. **Critérios podem ser corrigidos com fundamento.** Não afrouxar uma exigência só para a candidata passar. Se a exigência mede o problema errado, documentar a evidência, atualizar a versão do critério e comparar novamente a base e a candidata.
7. **A regra 2/3 é uma heurística do curso.** Duas falhas semelhantes motivam reformulação; na terceira, encerrar a tentativa e registrar o que precisa ser decidido. Isso não é uma lei de probabilidade sobre modelos, nem uma regra universal de F1. Não associar o contador a bandeiras ou decisões da direção de prova.
8. **Restaurar exige preservar trabalho.** Guardar a versão anterior é útil. Reverter não significa apagar alterações concorrentes, executar comandos destrutivos ou descartar toda a tarefa porque um teste falhou.

Esses ajustes corrigem generalizações presentes em `01-pesquisa/engenharia-de-loop.md` e nos julgamentos; não alteram a intenção original de exigir referência, evidência e limites.

## Promessa ao aluno

Ao final, o aluno consegue escrever um pedido delimitado, distinguir hipótese de resultado observado, produzir uma candidata, conferir a saída contra uma fonte real, corrigir uma falha demonstrada e encerrar o trabalho com um registro verificável. Isso precisa aparecer em sua atividade; rolar até o final ou visitar hotspots não comprova aprendizado.

Definição central: **engenharia de loop é organizar tentativas com referência, critérios, verificação e uma decisão explícita sobre o próximo passo.**

O ciclo operacional é produzir → criticar → revisar → verificar. Preparação, orçamento e registro mantêm esse ciclo útil. A crítica pode levar diretamente à aceitação se não houver correção necessária; a narrativa não exige inventar um erro para completar uma volta.

## Textos finais em `src/content.js` (14/09/2026)

Público: doutorandos em gestão pública; o objeto de trabalho é documento, pasta e processo. Os títulos abaixo substituem os das seções seguintes quando divergirem; `src/content.js` é a fonte viva.

| Capítulo | Título | Lead | Princípio |
|---|---|---|---|
| Preparar | ANTES DE PEDIR, / DEFINA O PRONTO. | Sem critério escrito, qualquer resposta da IA parece boa. Decida antes como vai conferir. | Fonte · critério · o que não pode piorar |
| Hipótese | UMA MUDANÇA. / UMA PREVISÃO. | Diga o que espera ver antes de ver. E o que provaria que você errou. | Uma mudança · efeito esperado · como refutar |
| Executar | RODE O TESTE. / GUARDE A BASE. | A resposta da IA só vale ao lado da fonte. Guarde as duas antes de mexer. | Pedido registrado · fonte · resposta intacta |
| Avaliar | PARECE BOM. / MAS PASSOU? | Texto bem escrito não é evidência. Confira cada frase na fonte. | Sustentada · não sustentada · não verificada |
| Corrigir | CORRIJA O ERRO. / NÃO O CRITÉRIO. | Conserte a falha demonstrada e confira de novo o que já estava certo. | Falha demonstrada · menor correção · reconferir |
| Encerrar | DECIDA COM PROVA. / REGISTRE A VOLTA. | A decisão é sua, não da IA. Diga o que a evidência permite e o que ainda não permite. | Decisão · evidência · próxima volta |

**Caso contínuo (fictício).** Os exemplos resolvidos (`example`) usam o mesmo caso da prática de `src/learning/model.js`: um comunicado interno sobre o teste de um formulário de atendimento. O registro diz que 50 pedidos por versão tiveram medianas de 12 e 9 minutos, que formulário e equipe mudaram juntos e que não há data nem autorização de adoção. A candidata atribui a causa ao formulário e inventa a data de adoção. Em cada capítulo, o exemplo mostra como fica bem escrito o campo do registro: critério (Preparar), hipótese, teste, evidência por frase, correção e decisão com pendência.

**Quiz.** `question`, `choices`, `correct`, `feedback` e `feedbacks` (uma explicação por alternativa) continuam no conteúdo como situações avulsas de gestão pública com IA (resumo de processo para despacho). A integração de 14/09 oculta o quiz e usa a prática contínua no lugar.

**Fatos de F1.** Reconferidos nas fontes primárias em 14/09/2026, sem fato novo: configuração de partida no simulador (Mercedes); correlação, flow-vis e aero rakes (Rob Smedley, F1, 21/02/2020); mais de 250 sensores e priorização dos dados (Mercedes); piso da Ferrari em Monza contra o quicar da atualização de Barcelona, com a ressalva de não confundir coincidência com causa (Hughes e Piola, F1, 05/09/2024); debrief estruturado entre sessões (McLaren, 19/05/2026).

## Arco

**Abertura:** um detalhe do carro vermelho no box revela gradualmente o conjunto. No painel, os campos “Referência”, “Critério” e “Decisão” estão vazios. A primeira tarefa não é acelerar: é preencher o que permitirá avaliar uma mudança.

**Tensão:** uma peça se destaca, uma candidata é apresentada e o túnel produz uma imagem convincente. O painel separa “representação visual”, “hipótese” e “resultado observado”. O aluno precisa perceber que o movimento do carro ou da fumaça ainda não responde à pergunta de sua atividade.

**Resolução:** o mesmo carro volta ao enquadramento inicial; a versão anterior continua disponível e o painel mostra a decisão e sua evidência. Quando não houver resultado suficiente, o painel permanece “Inconclusivo”. Não há vitória automática. O final oferece um próximo loop com o registro como entrada.

## Seis capítulos

### 1. Preparar — `preparar`

**Título:** ANTES DE MUDAR, / DEFINA O PRONTO.

**Corpo:** Registre a referência, o critério e o que deve permanecer.

**Três lições:** referência real; critério verificável; tarefa delimitada.

**Cena:** detalhe da pintura vermelha; recuo lento revela o carro montado e o box. Uma ficha de trabalho se abre junto ao carro. A referência fica marcada como “Base”, sem números de performance.

**Ação do aluno:** escolher um artefato real e escrever objetivo, fonte, duas condições de aceitação e uma propriedade a preservar. A atividade guiada usa o documento local do Laboratório INTEIA para preparar uma apresentação curta do túnel, conforme o arquivo de critérios.

**Prompt transferível:** “Leia esta fonte e descreva o estado atual. Objetivo: [resultado]. A mudança se limita a [escopo]. Preserve [propriedade]. Critérios: [condições verificáveis]. Antes de produzir, indique o que falta para avaliar a saída.”

**Evidência de aprendizagem:** outra pessoa consegue dizer o que conta como pronto sem adivinhar a intenção do aluno.

### 2. Hipótese — `hipotese`

**Título:** UMA IDEIA. / UM TESTE.

**Corpo:** Diga o que espera observar e como pode estar errado.

**Três lições:** hipótese explícita; verificação adequada; orçamento definido.

**Cena:** na bancada do box, o carro se abre em vista explodida vista do alto e só o assoalho recebe destaque; um hotspot "UMA MUDANÇA" marca a peça. O resto permanece estável. Sem mapa de pressão nem número de carga inventado.

**Ação do aluno:** escrever “Se eu mudar X, espero observar Y; vou conferir com Z”. Definir um teto antes da geração. A sugestão didática é duas revisões ou dez minutos, ajustável pelo professor; não apresentar esse teto como duração real já consumida.

**Prompt transferível:** “Minha hipótese é [mudança → efeito esperado]. O que observar para refutá-la? Qual é a verificação mais simples que responde à pergunta e o que ela não consegue provar?”

**Evidência de aprendizagem:** o aluno explica uma observação que faria rejeitar sua hipótese, além de explicar como ela poderia passar.

### 3. Executar — `executar`

**Título:** MUDE POUCO. / GUARDE A VERSÃO.

**Corpo:** Produza uma candidata e preserve a base de comparação.

**Três lições:** produzir uma candidata; preservar a base; manter o escopo.

**Cena:** um corte diagonal troca o box pelo túnel de ensaio; a câmera passa rente ao carro montado enquanto a fumaça contorna a carroceria, com o rótulo "visualização didática, não é CFD" no rodapé e no piso. O movimento ilustra a observação produzida por um teste; não mede o escoamento deste carro.

**Ação do aluno:** executar o pedido na ferramenta de IA disponível, salvar a saída real e registrar o que mudou. O site só pode dizer que executou uma IA se houver integração real; copiar um prompt ou escolher um botão não é execução.

**Prompt transferível:** “Produza uma candidata conforme os critérios. Use somente as fontes fornecidas. Quando a fonte não sustentar uma afirmação, omita-a ou sinalize a lacuna. Entregue o artefato e a lista curta das mudanças.”

**Evidência de aprendizagem:** base e candidata podem ser comparadas; nenhuma declaração de “verificado” aparece antes da conferência.

### 4. Avaliar — `avaliar`

**Título:** PARECE BOM. / MAS PASSOU?

**Corpo:** Confronte a candidata com a fonte e com o uso real.

**Três lições:** crítico separado; evidência conferida; verificador com limites.

**Cena:** um segundo corte diagonal devolve o box; na estação de engenharia, o foco sai do carro, que fica desfocado em primeiro plano, e vai para três monitores com o registro do próprio aluno (critério, evidência, decisão). Campo vazio aparece como "sem registro". A imagem bonita do carro não é evidência.

**Ação do aluno:** revisar afirmação por afirmação e registrar “Atende”, “Não atende” ou “Não verificado”. Explicar qual critério permite a classificação. Testar também a propriedade que deveria permanecer.

**Prompt transferível:** “Revise esta candidata com estes critérios e estas fontes. Para cada achado, mostre o trecho e a evidência. Separe falha confirmada, hipótese e limitação da revisão. Se não encontrar falhas, diga quais verificações fez e o que ficou sem verificar.”

**Evidência de aprendizagem:** o aluno rejeita uma aprovação sem suporte e consegue reconhecer uma candidata correta sem fabricar problemas.

### 5. Corrigir — `corrigir`

**Título:** CORRIJA O ERRO. / CONFIRA DE NOVO.

**Corpo:** Revise a falha demonstrada e procure novas regressões.

**Três lições:** revisar o necessário; verificar novamente; reverter regressões.

**Cena:** retorno ao carro no box; a carroceria se ergue e o mesmo assoalho da hipótese aparece destacado como peça revisada, rotulada como ilustração sem ganho aerodinâmico demonstrado. Não pintar o carro de verde por simples chegada do scroll.

**Ação do aluno:** corrigir somente um achado confirmado ou justificar a aceitação sem revisão. Repetir a verificação que falhou e as verificações relevantes para o que já funcionava. Se o instrumento estiver errado, apresentar a evidência disso antes de mudar o critério.

**Prompt transferível:** “Corrija o achado [trecho + evidência]. Preserve os itens já aprovados. Mostre o que mudou, repita a verificação necessária e diga se apareceu alguma regressão.”

**Evidência de aprendizagem:** cada revisão resolve um problema identificado; a nova versão não perde uma condição que a anterior atendia.

**Limite:** se a mesma falha reaparecer, reformular o pedido com os fatos aprendidos. Contadores só avançam quando uma tentativa real é registrada, não quando o aluno retorna ao capítulo.

### 6. Encerrar e recomeçar — `encerrar`

**Título:** DECIDA. REGISTRE. / RECOMECE MELHOR.

**Corpo:** Encerre com evidência ou diga exatamente o que faltou.

**Três lições:** critério atingido; risco ou limite reconhecido; registro reutilizável.

**Cena:** câmera retorna à composição de abertura. Os campos vazios recebem os dados efetivamente registrados pelo aluno. O carro montado encerra a coreografia independentemente de a decisão ser aceitar, revisar depois ou inconclusivo.

**Ação do aluno:** escolher a saída e justificar: “Aceitar” quando os critérios forem verificados; “Decisão necessária” quando houver consequência fora do escopo autorizado; “Inconclusivo” quando faltar evidência ou terminar o orçamento. A conclusão abre o registro para a próxima tarefa.

**Prompt transferível:** “Registre objetivo, hipótese, mudança, verificação, resultado, limite e decisão. Não declare sucesso se faltou evidência. Se o trabalho continuar, escreva a próxima pergunta com o que já foi aprendido.”

**Evidência de aprendizagem:** a decisão decorre do registro; outro aluno consegue retomar o trabalho sem repetir as hipóteses já descartadas.

## Ritmo, câmera e acesso ao conteúdo

O conteúdo essencial vive em HTML, com navegação por teclado e modo de leitura sem WebGL. A coreografia chama atenção para uma mudança por capítulo; o texto permanece legível durante movimentos lentos, com botão de pausa e alternativa de movimento reduzido. Abrir um aprofundamento não obriga acompanhar simultaneamente uma animação explicativa.

| Progresso local | Intenção de cena | Conteúdo |
|---|---|---|
| 0,00–0,18 | Transição contínua a partir da pose anterior | Nome do capítulo e orientação |
| 0,18–0,45 | Pequeno movimento que revela a mudança | Título e frase central |
| 0,45–0,78 | Composição estável ou movimento discreto | Três lições e ação do aluno |
| 0,78–1,00 | Preparação visual da próxima cena | Saída e navegação |

Essas janelas são parâmetros propostos; precisam de teste real de leitura e enquadramento. Recuar no scroll recompõe a cena, mas não apaga a atividade, repete geração, aumenta contadores ou altera uma decisão salva. Câmera e estado de aprendizagem são coisas diferentes.

Não exigir a visita de quatro rodas ou de todos os hotspots para “aprovar” a atividade: esse gesto mede navegação. Os hotspots são opcionais, com nomes de peças confirmados no modelo efetivamente carregado. Cores têm rótulos textuais; vermelho institucional não significa automaticamente erro.

## Interface pedagógica mínima

- Seis capítulos acessíveis por navegação e um painel de leitura.
- Uma ficha contínua com referência, critério, hipótese, candidata, avaliação e decisão.
- Campo de evidência vazio até o aluno registrar uma fonte ou resultado.
- Aprofundamentos opcionais: “O que uma evidência prova”, “Quatro armadilhas” e “Como continuar depois do limite”.
- Comandos honestos: “Copiar prompt”, “Registrar resultado”, “Comparar versões”, “Exportar registro”. Um botão só deve ser exibido como funcional quando sua ação existir.
- Rótulo junto do túnel: “Visualização didática de fluxo; não é CFD nem telemetria de pista”. Não esconder essa limitação nos créditos.

As quatro armadilhas resumidas são: repetir sem hipótese nova; aceitar elogio como verificação; adaptar o critério apenas para passar; consumir orçamento sem registrar ganho ou próximo passo. Cada uma deve apontar para um gesto corretivo que já foi praticado na atividade.

## Capacidades existentes e trabalho futuro

O inventário local de 12/09, em `01-pesquisa/laboratorio-3d-inteia.md`, descreve carro segmentado, destaque/isolamento de peça, explosão, box, estúdio e túnel visual. Isso fornece matéria-prima, mas não confirma que tudo esteja integrado e validado na aula de seis capítulos. Esta consolidação não executou os ensaios do laboratório.

| Camada | Base descrita nos arquivos locais | O que ainda é proposta nesta narrativa |
|---|---|---|
| Carro e ambientes | Carro INTEIA, box, estúdio e túnel visual | Composição e câmera dos seis capítulos |
| Peças | Seleção, isolamento e explosão | Relação clara entre peça, escopo e comparação |
| Túnel | Fumaça procedural; ensaio por coeficientes descrito como “não é CFD” | Uso pedagógico e limites explícitos no capítulo Avaliar |
| Conteúdo | Briefing, pesquisa e tratamentos | Textos consolidados, atividade, critérios e modo de leitura |
| Trabalho do aluno | Há referência ao registro do site do relógio | Integração, persistência, exportação e avaliação da ficha nesta aula |
| IA em execução | Não demonstrada por este documento | Qualquer integração de geração ou revisão por modelo |
| Evidência de aprendizagem | Não coletada | Aplicação da rubrica e teste com alunos |

Casos históricos de F1 permanecem em `01-pesquisa/f1-licoes.md` como dossiê de pesquisa. Antes de entrar na aula como fato, cada caso precisa de fonte primária conferida, recorte claro e distinção entre ocorrência e explicação causal. Não transportar automaticamente números, regulamentos de uma temporada ou a causalidade da vitória para a nova narrativa.

## Rastreabilidade editorial

| Origem local | O que foi aproveitado | O que foi ajustado |
|---|---|---|
| `00-briefing.md`, §§1–2 e adendo §7 | Loop como conteúdo; preparação, controle e encerramento; identidade INTEIA | Seis capítulos; aprendizagem observável |
| `01-pesquisa/engenharia-de-loop.md` | Referência, revisão, limite, regressão e registro | Absolutos sobre testes, independência, causa raiz e regra 2/3 |
| `02-tratamentos/tratamento-A.md` | Pré-condições e limite de tentativas | Sem bandeiras como contador da IA |
| `02-tratamentos/tratamento-B.md` | Prompts transferíveis e quadro inicial/final | Sem cronômetro ou resultado inventado |
| `02-tratamentos/tratamento-C.md` | Base preservada, candidata, comparação e retorno | Sem equivalência CFD/IA; sem concluir a causa da divergência antecipadamente |
| `02-tratamentos/tratamento-D.md` | Detalhe inicial, retorno ao box e gestos de amanhã | Sem cronologia fictícia de uma sessão oficial de F1 |
| `02-tratamentos/julgamento-professor.md` | Prioridade ao loop completo com consequências | Aprendizado avaliado pela atividade, não pelas notas do juiz |
| `02-tratamentos/julgamento-engenheiro-f1.md` | Fronteiras da metáfora e adequação ao laboratório | Fatos pendentes não entram como confirmação desta consolidação |
| `02-tratamentos/julgamento-cineasta.md` | Abertura, continuidade e retorno visual | Movimento subordinado à leitura; não importar todos os enxertos |

Critérios para verificar esta proposta: `CRITERIOS-DE-APRENDIZAGEM.md`.
