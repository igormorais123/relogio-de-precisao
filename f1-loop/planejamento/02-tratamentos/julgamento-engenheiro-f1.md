# Julgamento — lente do Engenheiro de F1 cético

Data: 2026-09-12. Juiz: engenheiro de F1 cético (verdade dos fatos, exatidão da analogia, alergia a clichê). Contrato: `00-briefing.md` §5. Fontes de conferência: `01-pesquisa/f1-licoes.md` (#1–#31), `01-pesquisa/assets-locais-f1-2026.md`, `01-pesquisa/laboratorio-3d-inteia.md`, e três buscas de confirmação (abaixo).

Escala: 0–10 por critério, total = soma (máx. 60). 10 é raro. Cada problema cita o trecho.

## 0. Conferências feitas antes de julgar

| Fato em dúvida | Resultado | Fonte |
|---|---|---|
| Racing Bulls, GP da Bélgica 2026: um só pacote, decidido por classificação em Silverstone (Lindblad × Lawson, Permane) | **Confirmado.** Lindblad bateu Lawson por 0,411 s (P9 × P10) e levou o pacote (sidepod, roll hoop, tambor de freio, asa traseira). Permane: "whoever qualifies in front in Silverstone gets the upgrade". | formula1.com ("How Racing Bulls decided who got the upgrades in Belgium"), the-race.com, planetf1.com |
| Ferrari, Silverstone 2024: houve A/B na sexta ou só reversão? | **Confirmado o A/B:** a Ferrari rodou o pacote de Barcelona e a especificação antiga na sexta, e depois pôs os dois carros na antiga pelo resto do fim de semana. | the-race.com ("Ferrari's 'downgrade' lays bare its big weakness") |
| Semáforo do pit stop só abre quando as quatro pistolas sinalizam | **Confirmado.** Sensor de porca em cada canto + botão do operador; luz verde só com os quatro OK e macacos soltos. | motorsport.com ("How F1 teams have pushed the boundaries with pitstops") |

Erros da tabela-mestra que nenhum tratamento cometeu: nenhum usou item [NÃO CONFIRMADO]; nenhum repetiu "Catar 2024".

## 1. Problema transversal (vale para os quatro, não diferencia a nota)

O adendo §7 do briefing manda **partir do Laboratório 3D INTEIA** (carro com 97 peças, box-laboratório, túnel de vento com 7.200 partículas e leitura por região, marca Racing Red `#D92135` / Graphite / Ice White). Os quatro tratamentos ignoram isso: todos usam o `.blend` do tutorial com "≈40 objetos", propõem livery **azul-petróleo** (`#0f3a47`) e não citam o box nem o túnel prontos. Quem for consolidar precisa: trocar a paleta do carro para Racing Red, usar os nomes reais do `componentes-origem.json` (assoalho em 3 partes, por exemplo), e mapear os capítulos de garagem/túnel para os ambientes já validados. Registro aqui; penalizo igualmente em viabilidade (−1 em todos) e sigo.

---

## 2. Tratamento A — "SETOR ROXO" (fim de semana de corrida)

| Critério | Nota | Justificativa |
|---|---|---|
| Fidelidade | 8 | Os 12 itens do loop aparecem uma vez cada, com extras bem escolhidos (pré-condição antes do gatilho, limite antes da deriva, três saídas). Gesto "monte o rake antes de sair do box = escreva o teste que falha" é exato. Perde ponto porque o capítulo 4 mistura "controlar" (evidência) com "encerrar" (congelar), e o 6 acumula três ideias pesadas (rollback, regra 2/3, deriva) numa cena só. |
| F1 | 5 | Fatos individuais corretos (1,80 s Catar 2023; Jerez 1997; ATR 320/80 h; parc fermé; Silverstone 2024). **Mas a estrutura se contradiz:** no cap. 4 o carro é lacrado em parc fermé ("Só o ângulo deste flap, pneus, combustível e sangria de freio podem mudar"); no cap. 6, **domingo, durante a corrida**, "o piso novo se solta e sai por baixo (...) o piso antigo desliza para o lugar". Isso é largar do pit lane, e no domingo nem isso: é impossível. Um engenheiro ri. Segundo: "o contador de falhas do HUD marca 1 (bandeira amarela), 2 (safety car), 3 (bandeira vermelha)" — bandeira e safety car vêm da direção de prova por perigo na pista, não da regressão de um piso; a própria pesquisa (#11) avisa que "no loop quem levanta a bandeira é o próprio operador". Terceiro: flow-vis "fresca (...) molhada" aplicada na **quinta** e lida na sexta — flow-vis é óleo com pigmento aplicado minutos antes do run; na quinta seca. Quarto: "hangar do simulador" na madrugada do GP — o DiL fica em Brackley, a pesquisa (#6) diz "fuso da pista"; o tratamento até escreve "A fábrica recebe só os dados", mas a cena parece estar no autódromo. Quinto: Silverstone 2024 na **chuva** — o bouncing do piso de Barcelona era em curva rápida a seco; a chuva é decoração que confunde a causa. Pontos a favor: Mônaco 2022 como pré-condição (5 s × 6 s) é a melhor analogia de "gatilho" dos quatro; Racing Bulls 2026 confirmado. |
| Cinema | 8 | Imagens-chave fortes e variadas: constelação sob LED frio, dois carros com o assoalho âmbar, gêmeo ciano com asa traseira "dois dedos fora", T-cam com setor roxo e flash, crane do pit stop, golfinho na chuva com fantasma verde, sala de debrief. Boa gramática de transições (porta do box, capa do carro, pit wall, spray). Desconto por repetir "constelação" nos caps. 1 e 7 (é intencional, mas o cap. 3 também é constelação de dados) e porque o setor roxo — o título — só aparece em uma cena. |
| Viabilidade | 5 | Exige fabricar `rake_DE/DD`, `macaco_D/T` e um `esqueleto` interno ("senão a explosão mostra só casca"); chuva + DOF + faíscas + ghost no cap. 6; A/B dobrando draw calls; T-cam fora dos limites de câmera; reflexo planar no 5. O próprio §8 lista 12 riscos. −1 pelo problema transversal. |
| Economia | 7 | Títulos em 2–3 linhas ok. Corpo de uma frase ok. Hotspots longos demais em vários casos (cap. 5 item 2 tem duas frases e uma citação). Há redundância: parc fermé em ficha do 4, hotspot do 4 e hotspot do 5; "setor roxo" já é título, marca do HUD e hotspot. |
| Arco | 8 | "Quarenta peças que não sabiam nada → as mesmas quarenta com uma linha do livro de bordo" responde à abertura com clareza. A tensão (túnel × pista) é real. Perde por o clímax emocional (chuva) ser justamente a cena factualmente impossível. |
| **Total** | **41** | |

**Pontos fortes:** melhor uso de Mônaco 2022 (pré-condição); pit stop com "volta de chave no flap" (o único ajuste permitido, e estava no plano) — exato; HUD de cronômetro que vira cronômetro de volta e de box; cenário "Piso novo" que melhora 4 voltas e degrada depois (a regressão que o placar esconde).

---

## 3. Tratamento B — "VOLTA ÚNICA" (uma volta, sete setores)

| Critério | Nota | Justificativa |
|---|---|---|
| Fidelidade | 8 | Mapeamento limpo (tabela de não redundância confere: 12 itens uma vez cada). Traz "ensaiar a volta", "não mexer no teste" (Goodhart) e "suíte inteira" como lições principais — três coisas que o aluno de Claude Code precisa amanhã. As "três saídas" viram interação (três luzes do painel) — bom. Desconto: cap. 2 junta "verificar o resultado" com "evidência conferida" (quase sinônimos na ficha) e o cap. 3 põe "um dono por tarefa" onde o briefing coloca "executor escolhido pela tarefa" (não é o mesmo: um é paralelismo, outro é escolha). |
| F1 | 5 | Acertos finos: "o DRS fecha primeiro (...) para de adicionar antes de medir" (o DRS fecha ao frear: exato e elegante); Jerez 1997 usado como **regra de desempate escrita antes** — a única leitura correta desse fato; composto médio faixa amarela; evitou o caso 2026 por prudência. **Erros:** (1) "Falha 3: bandeira vermelha nos painéis (...) o carro segue em ritmo de safety car" — sob vermelha o carro vai para o pit lane, e a própria ficha do capítulo diz isso duas linhas acima; contradição interna. (2) Reset na chuva: "o carro reaparece com intermediários" sem parar no box — troca de pneu por mágica. (3) Box "no meio da volta": licença declarada, mas continua sendo o pit lane no lugar errado; um engenheiro lê a legenda e mesmo assim estranha. (4) Hotspot `drs_mechanism`: "afrouxar a asserção é travar o DRS aberto na curva: a volta fica mais rápida no papel" — DRS aberto em curva não fica mais rápido em papel nenhum; perde carga e é perigoso. Analogia forçada. (5) Assoalho trocado em movimento sob a ponte (cap. 4): fantasia, embora bonita. (6) "Nenhum piloto lê temperatura; o sensor lê" — o piloto vê temperatura de freio no display. |
| Cinema | 8 | É o tratamento mais fiel à referência Resn: um mundo, uma câmera, o carro nunca sai de quadro. Imagens-chave: carro em wireframe ciano na hora azul com pit board vazio; um flap âmbar solto a 200 km/h; carro dissolvido em 250 sensores + rack focus; fantasma sob luzes ciano; T-cam com gotas e blackout; mesmo ângulo baixo na chegada. Desconto porque o cap. 5 (chuva) depende de um truque (blackout) para contar a lição, e porque o cap. 6 acumula chegada + parc fermé + debrief + mapa do loop numa cena. |
| Viabilidade | 5 | "O carro nunca para" contradiz o teste `pose(0.5) === pose(0.7)` (o §8 admite); mundo rolando com curvatura por shader (risco de parecer esteira, admitido); blueprint por `EdgesGeometry` dobra draw calls; chuva com reflexo planar; sete capítulos; pit board como objeto 3D com canvas. −1 transversal. |
| Economia | 8 | Títulos exatos e ≤ 16 caracteres por linha (o autor até mediu "O REGISTRO FICA."). Hotspots curtos. Ficha compacta. Pequena redundância: "Suíte inteira" no cap. 2 e "Corrija só os itens listados" no cap. 3 se sobrepõem ao aprofundamento. |
| Arco | 9 | O melhor mecanismo de fechamento dos quatro: o pit board `-:--.---` do grid vira `1:38.412 · CRITÉRIO ATINGIDO` e depois `PRÓXIMA VOLTA · ENTRADA: REGISTRO DESTA`, na mesma pose de câmera. Preciso, barato e memorável. |
| **Total** | **43** | |

**Pontos fortes:** pit board diegético com estado por capítulo; "DRS fecha antes de frear"; constelação de sensores; Jerez como regra prévia; "o cronômetro não tem opinião"; interação das três saídas.

---

## 4. Tratamento C — "ÚLTIMO ESTADO VERDE" (o ciclo de vida de um upgrade)

| Critério | Nota | Justificativa |
|---|---|---|
| Fidelidade | 9 | É o tratamento em que a metáfora **é** o conteúdo: CFD = primeira resposta do modelo; túnel = orçamento contado, uma variável por run; laminação = diff pequeno; prateleira = commit anterior; flow-vis = saída de comando colada; gêmeo = baseline; correlação = crítico independente + "o que não pode piorar"; reversão = rollback + causa raiz no verificador; dossiê = registro. "A resposta do modelo é o CFD; a pista é `npm test`" é a frase que o aluno leva. Falta: a regra "3 falhas = parar e perguntar" só vive em hotspot/aprofundamento (o cap. 6 para em 2, o que é coerente, mas o aluno não vê a terceira); "um dono por tarefa" também não é vivido. |
| F1 | 8 | Espinha real e documentada (Ferrari SF-24: Barcelona → Silverstone → anomalia do túnel → Monza, vitória de Leclerc — conferido). Ciclo de fábrica exato: CFD → túnel a 60% e 50 m/s → laminação em autoclave → montagem nos macacos → FP1 com flow-vis e rakes → correlação → A/B → reversão nos dois carros (A/B na sexta confirmado). ATR com números certos. Aston Martin Canadá 2023 como "critério incompleto" é a leitura correta. W13 (Elliott/Allison) e RB20 (Waché) nos hotspots certos. Cuidado do autor em não afirmar A/B em Silverstone (que, aliás, houve). **Nits:** (1) "modelo sólido de carbono a 60%" — modelo de túnel é resina/impressão 3D e alumínio sobre espinha metálica, não carbono; (2) "bandeira vermelha desce sobre o pit wall" e "bandeira amarela sobe no mastro" como símbolo de decisão da equipe — bandeira é de direção de prova; o sinal interno correto é a chamada de rádio ou o pit board; (3) macaco traseiro em `rear_wing_bottom_holder` — o macaco traseiro engata na estrutura de impacto traseira, não na asa; (4) "desde 2009 não há testes em temporada" — simplificação (houve testes de meio de temporada até 2019 e há testes de pneus da Pirelli); (5) Racing Bulls 2026 em hotspot, confirmado hoje, mas ainda recente. Nenhuma contradição interna. |
| Cinema | 7 | Imagens-chave fortes e originais: nuvem ciano virando assoalho; carro a 60% preso a um pedestal atravessado por quarenta fitas de fumaça; assoalho velho deslizando para uma prateleira iluminada; flow-vis sob UV com o gêmeo engolido pelo escuro; fantasma plano × carro saltando com a traseira pulsando âmbar; dois carros nos macacos trocando assoalhos sob céu de chumbo; nuvem âmbar. **Mas o carro quase não anda** (só a onboard do cap. 4) e a regra "câmera parada de 0.18 a 0.72" arrisca virar museu; não há pit stop, não há velocidade, não há chuva — para um site cujo herói é "um carro de F1 ultra-realista e lindo", falta a cena de adrenalina que A e B têm. Caps. 5 e 7 repetem "sala escura com monitores/close no display". |
| Viabilidade | 8 | O tratamento que mais se encaixa no que **já existe**: o túnel INTEIA (fumaça por região, leitura verde do assoalho/difusor, carroceria transparente) é literalmente o cap. 2 e o cap. 5; o box-laboratório é o cap. 3; `isolate()`/`select()` da mecânica são o `swap` do assoalho. Sem peças internas, sem chuva, sem mecânicos, ghost na mesma geometria, nuvem em um draw call. Riscos reais e bem mitigados: escala 60% × clamp de layout; prateleira persistente com estado por capítulo; A/B em dois capítulos. −1 transversal (não cita o laboratório, propõe azul-petróleo). |
| Economia | 8 | Títulos exatos ("A TINTA / NÃO OPINA." é o melhor dos 28). 21 termos únicos, tabela de não repetição confere. Descontos: fichas "Lição F1" longas (cap. 7 tem seis linhas); hotspot do Racing Bulls no cap. 3 está fora de lugar (ponto de macaco → decisão de quem recebe o upgrade é ligação fraca); "instrumento certo" e "orçamento de runs" no cap. 2 quase se sobrepõem. |
| Arco | 9 | Nuvem ciano (previsão) → nuvem âmbar (medida) na forma do assoalho do próximo carro; "o primeiro plano era uma hipótese virando forma; o último é um registro virando a próxima hipótese". O calor migra de ciano para âmbar ao longo da experiência — regra de paleta com sentido. Tensão real no ato II ("o carro mais rápido carrega um erro"). |
| **Total** | **49** | |

**Pontos fortes:** analogia exata em cada capítulo, sem forçar; caso real de ponta a ponta; hotspot MANTER/REVERTER que deixa o aluno viver o erro da Red Bull; contador de runs como barra de progresso; dossiê com cinco colunas escrito sobre o corpo do carro.

---

## 5. Tratamento D — "BOX, BOX." (a noite da garagem, 03:12 → 06:31)

| Critério | Nota | Justificativa |
|---|---|---|
| Fidelidade | 8 | Lista de "sete coisas que o aluno faz amanhã" é o melhor enunciado de tese dos quatro. 21 termos distintos, progressão pedagógica seguida. O semáforo que só abre com quatro sinais = "critério atingido = suíte inteira verde" é a analogia mais exata de encerramento em todos os tratamentos. Desconto: "Risco identificado — uma roda sem sinal: segurar o carro" é critério **não atingido**, não risco (risco é decisão devolvida a uma pessoa); "Interlúdio de custo" como bloco é remendo. |
| F1 | 3 | O premissa é impossível e um engenheiro sabe na primeira linha: **toque de recolher**. O regulamento esportivo proíbe pessoal de operação no circuito de madrugada (janela de ~8–9 h, duas exceções por temporada); uma equipe remontando o carro das 03:12 às 06:05 quebra o curfew. Pior: **não há carro em pista às 05:05, 05:30 ou 06:31** — não existe sessão ao amanhecer; "Tinta" no pit lane à primeira luz, "Retorno" em curva rápida às 05:30 e "cruza a linha às 06:31" são cenas que nunca aconteceram em F1. Também: "o carro está em pedaços porque foi otimizado para o verificador (Ferrari 2020)" — descorrelação aero não se resolve desmontando o carro na garagem; "streamlines ciano passam por ele parado (o ar da pista passa)" — em carro parado no pit lane não há fluxo e flow-vis só escorre com o carro andando; "flow-vis (...) sob luz UV" numa manhã de treino. Fatos pontuais estão certos (1,80 s; Catar 18 voltas; Silverstone 2024; McLaren debrief; Racing Bulls 2026 confirmado) e o mecanismo do semáforo é exato — mas a moldura contamina tudo, e o "BOX, BOX" do título (ordem de rádio de parar) é o **único** clichê de F1 que os quatro tratamentos usaram como título. |
| Cinema | 8 | Abertura excelente (macro no disco ainda morno, peças no chão sob uma lâmpada de raspão, o display com a volta que falhou); pit stop visto de cima "como notas numa partitura", vinte silhuetas erguendo a mão; sol nascendo atrás da asa traseira com trinta etiquetas numeradas acendendo. O amanhecer como variável global de luz é uma ideia de cinema. Desconto: os capítulos 2–4 são "carro na pista" genéricos (a tinta, o salto, o graining) sem um gesto de câmera que não esteja em A ou B. |
| Viabilidade | 5 | Estado `floor` (pose no chão por peça) novo; vinte planos com alpha; discos, pinças, prancha, rake, macacos, pistolas, pit board e semáforo procedurais; cinco envMaps interpolados; macro a 0,35 u e crane a 6 u fora dos limites; reflexo planar em dois capítulos. Mitigações honestas, mas é o tratamento com mais coisa a fabricar. −1 transversal (o box-laboratório INTEIA existe e caberia nos caps. 0, 1 e 5; não foi citado). |
| Economia | 7 | Títulos ok, mas "QUATRO E DEZ. / O SIMULADOR / NÃO DORME." gasta uma linha com a hora, que já está no HUD. 28 hotspots de 4, vários com duas ideias ("Parc fermé do gesto" no disco de freio mistura pit stop com parc fermé). O relógio de parede repete o HUD de pontos com horas. |
| Arco | 8 | 03:12 → 06:31, "peças no chão sem número → as mesmas peças com etiqueta" fecha bem. Mas o arco é construído sobre um relógio que a F1 real desmente, e a tensão ("o carro precisa estar na pista quando o sol nascer") não existe: ninguém corre ao nascer do sol. |
| **Total** | **39** | |

**Pontos fortes:** semáforo dos quatro sinais como critério atingido; abertura com o disco morno; pit stop como partitura; pit board "18 · BOX"; ordem "box, box" como sinal interno de parada (a resposta certa para o problema das bandeiras que A, B e C têm).

---

## 6. Quadro comparativo

| | Fidelidade | F1 | Cinema | Viabilidade | Economia | Arco | **Total** |
|---|---|---|---|---|---|---|---|
| A — Setor Roxo | 8 | 5 | 8 | 5 | 7 | 8 | **41** |
| B — Volta Única | 8 | 5 | 8 | 5 | 8 | 9 | **43** |
| **C — Último Estado Verde** | 9 | 8 | 7 | 8 | 8 | 9 | **49** |
| D — Box, Box. | 8 | 3 | 8 | 5 | 7 | 8 | **39** |

## 7. Vencedor: **C — "ÚLTIMO ESTADO VERDE"**

Por esta lente, C vence com folga e sem discussão: é o único em que **cada** analogia é exata — porque não é analogia, é o processo real de um upgrade de F1 contado como ele acontece, com um caso documentado de ponta a ponta. A, B e D compram força cinematográfica com cenas que um engenheiro de F1 desmonta na hora (piso trocado em corrida sob parc fermé; intermediários sem pit; carro em pista às cinco da manhã), e todos os três usam bandeira vermelha/safety car como se fosse decisão da equipe. C tem só nits de vocabulário (modelo de túnel "de carbono", bandeira como símbolo). O preço de C é cinema: o carro raramente anda e não há pit stop. Os enxertos abaixo corrigem exatamente isso, sem importar as mentiras.

## 8. Enxertos obrigatórios no vencedor (com origem)

1. **[D, cap. 5 + A, cap. 5] Pit stop de 1,80 s no cap. 7 (Monza, domingo), como a cena do "único ajuste permitido".** Depois do lacre e antes do flash: crane quase vertical, quatro rodas no ar, duas silhuetas dão a "volta de chave" no `front_wing_top` (A), e o **semáforo só abre quando os quatro sinais chegam** (D; conferido: sensores de porca + botão do operador). É factualmente perfeito no lugar: sob parc fermé só pneus e flap mudam, e o pit stop é exatamente isso. Resolve a falta de adrenalina de C e ensina "critério atingido = suíte inteira verde" com um gesto real.
2. **[D, título e cap. 4] "BOX, BOX" e o pit board "BOX" como sinal interno de parada, no lugar da bandeira vermelha do cap. 6.** A equipe não levanta bandeira; ela chama o carro. Trocar "bandeira vermelha desce sobre o pit wall" por pit board `2 · BOX` e a chamada de rádio no HUD mantém a regra 2/3 sem mentir sobre quem manda na bandeira. Manter a bandeira amarela **só** no hotspot de bandeiras (#11), como protocolo graduado.
3. **[B, HUD] Pit board diegético com estado por capítulo.** No cap. 1 mostra o alvo ("+18 pt · JUIZ: RAKE + FLOW-VIS"), no 2 o contador de runs, no 4 "A / B", no 6 "2 · BOX", no 7 o número medido. É o mecanismo de arco de B (vazio → preenchido) somado ao arco de C (nuvem ciano → âmbar).
4. **[B, cap. 0] Jerez 1997 como "regra de desempate escrita antes"** — hotspot ou fato de pista do cap. 1 de C ("critério verificável"), que hoje só tem SF1000. É a única leitura correta desse fato e C não o usa.
5. **[B, cap. 2] "O DRS fecha antes de frear: pare de adicionar antes de medir"** — um beat na onboard do cap. 4 de C (que já tem uma frenagem com `brakeHeat`). Custo zero, exatidão total.
6. **[B, cap. 2] Constelação de 250 sensores ligados a fitas + rack focus** — usar no cap. 4 → 5 de C, quando "a tinta vira dado": a carroceria some, os pontos acendem, o foco vai ao número. Substitui a repetição "sala escura com monitores" dos caps. 5 e 7 por uma metamorfose do carro.
7. **[A, cap. 5, hotspot 2] Mônaco 2022 como pré-condição antes do gatilho** — hotspot no pit stop enxertado (item 1) ou no cap. 3 (montagem só sobe nos macacos quando o carro está nas marcas). É a melhor analogia de "checar a pré-condição" dos quatro.
8. **[A, §6, cenários] Série "piso novo melhora 4 voltas e degrada depois"** — acrescentar aos cenários de correlação do cap. 5 de C: a regressão que o placar esconde, vista no gráfico (ponte direta com o hotspot do RB20).
9. **[A, §6, item 3] Contador de falhas interativo "tentar de novo"** — no cap. 6 de C, ao lado de MANTER/REVERTER: primeira e segunda tentativa = "2 · BOX" (reset com prompt refinado); terceira abre o campo "o que interrompeu" no dossiê (3 = parar e perguntar). Assim a terceira falha, que C não vive, fica visível sem trair o caso Ferrari (que parou em 2).
10. **[B, cap. 1] Vettel/Leclerc "percorrer a volta = plano diferencial"** — hotspot no cap. 2 de C (túnel): antes de gastar um run, listar o que muda em relação ao run anterior. Fato #21, confirmado em F1.com, e C não o usa.
11. **[D, cap. 2, hotspot 4] "A tinta não se limpa para o resultado parecer bonito = não se edita o teste"** — hotspot curto no cap. 4 de C; hoje "não mexer no teste" só está no aprofundamento.
12. **[D, cap. 0] Macro no disco de freio ainda morno** como primeiro plano da onboard do cap. 4 de C ("o último dado real") — imagem forte, barata (emissivo em `inside_cover`), sem o relógio impossível.

## 9. Correções obrigatórias no vencedor (fatos)

- Cap. 2: "modelo sólido de carbono a 60%" → "modelo de resina impressa e alumínio sobre espinha metálica, a 60%".
- Cap. 3: ponto do macaco traseiro não é `rear_wing_bottom_holder`; usar a estrutura traseira (`rear_driveshaft`/região do difusor) ou não nomear a peça.
- Cap. 4, hotspot `antennas`: "desde 2009 não há testes em temporada" → "desde 2009 os testes em temporada foram praticamente eliminados; o treino livre é o laboratório".
- Cap. 6: retirar bandeira vermelha e amarela como decisão da equipe (ver enxerto 2).
- Cap. 3, hotspot `front_wing_mount`: mover Racing Bulls 2026 para o cap. 4 (A/B, quem recebe a peça); em ponto de macaco é ligação forçada. Fato confirmado hoje, pode ficar.
- Transversal: livery Racing Red `#D92135`, nomes de peça do `componentes-origem.json` (assoalho em 3 partes), caps. 2 e 5 no túnel INTEIA existente, cap. 3 no box-laboratório existente, monitores do box exibindo o dossiê.

## 10. Fontes das conferências

- formula1.com — "How Racing Bulls decided who got the upgrades in Belgium" (2026); the-race.com — "The unusual way a Belgian GP car spec split was decided"; planetf1.com — "How Liam Lawson lost Belgian GP upgrade to Lindblad".
- the-race.com — "Ferrari's 'downgrade' lays bare its big weakness" (Silverstone 2024).
- motorsport.com — "How F1 teams have pushed the boundaries with pitstops" (sistema de luzes e sensores de porca).
