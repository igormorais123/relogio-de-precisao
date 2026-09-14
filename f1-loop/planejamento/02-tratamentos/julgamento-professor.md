# Julgamento — lente do PROFESSOR RIGOROSO de engenharia de loop

Data: 2026-09-12. Contrato: `00-briefing.md` (seção 5). Pesquisa lida: `01-pesquisa/engenharia-de-loop.md`, `f1-licoes.md`, `arquitetura-atual.md`, `gramatica-visual.md`, `assets-locais-f1-2026.md`, `laboratorio-3d-inteia.md`. Tratamentos lidos na íntegra: A ("Setor Roxo"), B ("Volta Única"), C ("Último Estado Verde"), D ("Box, Box.").

Lente declarada: julgo sobretudo **fidelidade ao conteúdo** (o aluno aprende o loop de verdade? cada capítulo ensina algo distinto e aplicável amanhã, com Claude Code aberto?), **progressão pedagógica** (a ordem respeita as etapas 0–8 de `engenharia-de-loop.md` §6?) e **economia** (títulos de 2–3 linhas, corpo de uma frase, três lições sem repetição). Os outros critérios (F1, cinema, viabilidade, arco) recebem nota, mas com peso de conferência, não de gosto.

Escala: 10 é raro e significa "não sei o que mudar". 8 é muito bom com defeitos nomeáveis. 6 é aprovado com retrabalho. Abaixo de 5, o critério falha.

---

## 0. Defeito comum aos quatro (desconta em viabilidade e fidelidade ao briefing)

O adendo do briefing (§7) é explícito: "**A narrativa deve partir desses ambientes e dessa marca**" — o Laboratório 3D INTEIA já tem carro de 97 peças com mecânica pronta (`setAmount`, DRS, esterço, isolar peça), box-laboratório com estação de três monitores, túnel de vento com 7.200 partículas e leitura por região, e identidade Racing Red `#D92135` / Graphite `#202930` / Ice White `#F0F2F3`, com o carro **vermelho** sem propaganda.

Nenhum dos quatro tratamentos cita `laboratorio-3d-inteia.md`. Todos:

- usam como herói o `part7_textures.blend` de ≈40 objetos (A: "≈40 objetos separados e nomeados"; B, C, D idem), ignorando o GLB de 97 componentes já validado em three.js;
- pintam o carro de "azul-petróleo metálico `#0f3a47`" com livery própria ("SETOR ROXO", "LOOP 26"), contra a instrução de manter o vermelho INTEIA como cor do herói;
- propõem paletas inteiras sem o Racing Red, o Graphite e o Ice White;
- não aproveitam a placa INTEIA nem os monitores do box como interface diegética (o laboratório já tem "uma tela que mostra a configuração real do visualizador").

Isso não invalida nenhum tratamento — os ambientes propostos (garagem, túnel, sala de monitores) são compatíveis com o que existe — mas é retrabalho certo na fase de narrativa consolidada, e pesa mais em quem se afasta mais do laboratório (B, que passa a experiência inteira na pista e nunca entra num box ou túnel).

Segundo defeito comum: **sete capítulos num motor de seis** (`N = 6` hardcoded em `Scroll.PESOS`, `cameraPath`, `Director`, `Registro.FASES`, `Callouts`, `ui.js` e no teste). Os quatro reconhecem o risco e propõem fusão de contingência; nenhum escolheu seis. Aceito, mas registro: a decisão foi empurrada para a fase de código nas quatro propostas.

---

## 1. Tratamento A — "SETOR ROXO" (fim de semana de corrida)

### Fidelidade ao conteúdo — 6

O que está certo: cobre os quatro blocos; a Regra 2 e 3 é encenada de verdade (contador de falhas → amarela → safety car → vermelha → ghost verde); "Pré-condição antes do gatilho" (Mônaco 2022) é uma lição que nenhum outro tratamento tem e que o aluno aplica amanhã; o hotspot "Piso de Barcelona: escreva também o que não pode piorar" é exato.

O que está errado, com trechos:

1. **Ordem ditada pelo calendário, não pela pedagogia.** "Critério atingido, congelar" aparece no capítulo 4 (Sábado) — um princípio de *Encerrar* — antes de "Passo pequeno reversível" (cap. 5) e de "Reverter regressões" (cap. 6). A pesquisa (§6, Etapa 2) coloca passo pequeno logo depois de referência e critério; A o ensina depois do crítico independente (cap. 3). O aluno aprende a congelar antes de aprender a desfazer.
2. **Duplicação de "critério atingido".** Cap. 4, lição III: "Critério atingido, congelar — Depois que passou, 'só mais um ajuste' reabre o ciclo inteiro". Cap. 7, lição I: "Três saídas legítimas — Critério atingido com a verificação colada". O mesmo termo ensinado duas vezes fere o critério 5 do briefing.
3. **"Desempate por regra prévia" (cap. 4, lição II)** é uma lição de F1 (Jerez 1997) disfarçada de lição de loop. A própria pesquisa avisa: "nem todo critério de loop é escalar como um tempo de volta; a lição é definir o critério antes da volta". Aplicabilidade amanhã: quase nula. Deveria ser hotspot, não lição.
4. **Tema "evidência" repetido em três capítulos:** cap. 2 lição III ("Verificar o resultado — a saída foi lida"), cap. 3 lição II ("Revisão adversária... com arquivo e linha"), cap. 4 lição I ("Evidência versus opinião"). São graus do mesmo princípio.
5. Faltam como termo "Revisar o necessário" e "Tarefas delimitadas" (substituído por "Orçamento e escopo", que mistura dois princípios distintos da pesquisa: 2.1 e 3.5).

### Verdade na F1 — 8

Todos os fatos têm linha na tabela-mestra e os números conferem (1,80 s / 1,82 s; 320 runs / 80 h; 1:21.072 e Hill a 0,058 s; 18 voltas / 57; 44 voltas). O próprio tratamento sinaliza reconfirmar Racing Bulls Bélgica 2026 (#7), usado como fato principal do cap. 2 — prudência correta, mas é o fato mais frágil da tabela na posição mais exposta. A analogia "setor roxo = critério atingido" é boa; "capa do carro" e "lacre de parc fermé" como transição são exatas. Pequena imprecisão: parc fermé começa na classificação, e o cap. 4 acerta isso.

### Força cinematográfica — 9

As sete imagens-chave são memoráveis e distintas: inventário flutuante sob LED com só a flow-vis brilhando; dois carros com um assoalho ardendo em âmbar; gêmeo digital dois dedos fora do lugar; T-cam com setor roxo e flash; pit stop de cima; golfinho na chuva com fantasma verde; peças rotuladas no debrief. Transições variadas e motivadas (porta do box, corte por luz, capa do carro, pit wall, spray). É o tratamento mais "Corn" em jogo de câmera. Desconto: cap. 2 e cap. 4 repetem a mesma gramática (carro em movimento → parado com peça contornada).

### Viabilidade — 6

Honesto na seção 8, mas acumula o pacote mais caro: T-cam fora dos limites de câmera, A/B (dobra draw calls), chuva + DOF + faíscas + ghost no mesmo capítulo, reflexo planar, halo a separar no Blender, `esqueleto` interno a fabricar, `rake` e `macaco` a modelar. Não usa o box nem o túnel do laboratório. Sete capítulos.

### Economia — 6

Títulos corretos (2–3 linhas, caixa alta, ≤ 16 caracteres). Corpos ≤ 72. Mas: 28 hotspots, todos no máximo permitido e vários com três frases; os rótulos do traçado repetem dias ("QUI · SEX · SEX (noite) · SÁB · DOM · DOM · DOM (noite)") — três "DOM" numa coluna de sete não orienta ninguém; as repetições de lição apontadas acima.

### Arco — 8

Quinta (quarenta peças que não sabem nada) → debrief (as mesmas peças com uma linha do livro de bordo cada) responde bem à primeira cena. Tensão clara no Ato III. Desconto: a chuva chega "junto com um piso novo" sem que o piso novo tenha sido decidido em cena — o Ato III depende de um evento não preparado.

**Total A: 43 / 60.**

---

## 2. Tratamento B — "VOLTA ÚNICA" (uma volta de circuito)

### Fidelidade ao conteúdo — 8

O que está certo: é o mapeamento mais limpo dos 12 princípios (cada um exatamente uma vez, com tabela de verificação); os hotspots traduzem cada lição para o prompt que o aluno escreve amanhã ("`npm test` completo, nunca um arquivo isolado"; "Corrija apenas os itens 1 e 3 da revisão"; "me diga como isso funciona hoje, não edite nada ainda"; "Confira `git diff tests/`"); o aprofundamento "Quatro armadilhas" é exatamente a Etapa 8 da pesquisa (armadilha = princípio que faltou); "Ensaiar a volta" (Vettel/Leclerc, #21) é a única lição de *explorar antes de agir* entre os quatro; a tese "escreva o teste que falha" aparece na primeira cena e é cobrada na última.

O que está errado:

1. **Verificar antes de produzir.** Cap. 2 (Freada) ensina "Verificar o resultado · Evidência conferida · Suíte inteira"; cap. 3 (Box) ensina "Produzir e criticar · Revisar o necessário". O bloco *Uma volta* é produzir → criticar → revisar → verificar; B inverte porque a freada vem antes do box na geografia. O aluno aprende a ler a saída antes de aprender o ciclo ao qual a saída pertence.
2. **"Produzir e criticar" forçado sobre o pit stop.** Título do cap. 3: "1,80 SEGUNDOS / PARA TROCAR / SÓ O PLANEJADO." e o próprio fato de pista diz "Ninguém 'melhora o carro' no box: troca-se o planejado". Um pit stop não produz nem critica; executa. A crítica aconteceu no setor 2 (hotspot 2: "O flap muda porque a telemetria do setor 2 apontou subesterço"). A cena ilustra "revisar o necessário" e "um dono por tarefa"; a lição I está fora do lugar.
3. **"Não mexer no teste" ancorado ao DRS** (cap. 4, hotspot 4): "Afrouxar a asserção é travar o DRS aberto na curva". DRS aberto na curva é perigo/ilegalidade, não adulteração do critério. Analogia forçada, o que o critério 2 proíbe. D tem a versão correta ("a tinta não se limpa para o resultado parecer bonito").
4. Cap. 5 mostra a terceira falha "como hipótese, não vivida" — correto pedagogicamente, mas a regra fica mais fraca que no cap. 6 de A, onde o contador chega a 3.

### Verdade na F1 — 7

Fatos corretos e citados por número; evitou o #7 por prudência; usou #10, #26, #28, #29 nos hotspots com exatidão. Dois descontos: (a) **licença poética estrutural** — "a entrada dos boxes fica no meio da volta" e um circuito fictício "Anel de Precisão": é uma falsidade de F1 declarada nos créditos, mas o critério 2 pede verdade, e o ângulo inteiro depende dela; (b) cap. 4 afirma "em Silverstone a equipe fez A/B na sexta" — a linha #27 diz que a Ferrari "voltou ao piso... nos dois carros após os treinos de sexta"; o tratamento C avisa corretamente "não afirmar que houve A/B em Silverstone". B afirma.

### Força cinematográfica — 8

Abertura em blueprint ciano com pit board vazio e cinco luzes vermelhas; flap solto em âmbar a 200 km/h; carro dissolvendo em 250 pontos de sensor com rack focus; fantasma passando sob luzes de teto; blackout na chuva pela T-cam; chegada no mesmo ângulo do grid com o pit board recebendo o número. A tese "o carro nunca para de se mover" é uma ideia de direção forte e coerente. Desconto: como o carro nunca para, as vistas de leitura são todas "chase" trancado ao carro — menos variedade de altura e distância que A e D; a órbita A/B "reduzida a 90°" e a T-cam quebram os limites de câmera testados.

### Viabilidade — 5

O mais caro em mundo: precisa de pista inteira que passa (asfalto com UV animado, postes instanciados, "shader de bend" para curvas), blueprint por peça (`EdgesGeometry` em ≈45 objetos, dobra draw calls), fantasma + A/B, reflexo planar em dois capítulos, chuva com gotas na lente, T-cam. E é o único tratamento que **nunca usa garagem nem túnel** — zero aproveitamento do box-laboratório e do túnel INTEIA prontos. Reduced-motion contradiz o ângulo ("todo o ângulo é movimento"). Sete capítulos.

### Economia — 8

Títulos exatos (o próprio tratamento confere "O REGISTRO FICA." = 16 caracteres). Corpos de uma frase. Três a quatro hotspots. Uma única redundância de HUD: pit board + cronômetro de volta + cronômetro do box + livro de bordo automático — quatro instrumentos contando a mesma volta.

### Arco — 8

O pit board vazio no grid e preenchido na chegada, na mesma pose baixa, é o melhor "última cena responde a primeira" dos quatro em precisão de gesto. Desconto: o arco depende da licença poética do box no meio; sem ela, o Ato II perde o ponto de virada.

**Total B: 44 / 60.**

---

## 3. Tratamento C — "ÚLTIMO ESTADO VERDE" (ciclo de vida de um upgrade)

### Fidelidade ao conteúdo — 8

O que está certo — e é o que decide este julgamento:

- **A experiência inteira é um único loop com consequências.** Hipótese → orçamento → peça → evidência → divergência → reversão → verificador corrigido → dossiê. Os outros três mostram o loop como lista de princípios distribuída num calendário; C mostra o loop como ciclo fechado, e o aluno vê o que acontece quando o critério escrito passa e o não escrito falha.
- **"Último estado verde" como objeto persistente.** O `floor@velho` fica visível na prateleira do cap. 3 ao cap. 7: "é o último estado verde. `git revert` custa segundos porque a versão anterior existe." É o melhor dispositivo didático dos quatro tratamentos — a Lei 3 do INTEIA (reset > correção) vira coisa que se vê.
- **A tese da aula é a mais precisa:** "a resposta do modelo é o CFD; a pista é `npm test`" — nomeia o erro central de quem itera com IA (confundir previsão convincente com verificação).
- **Aprofundamento "Calibrar o verificador"** traz a nuance que falta nos outros: "Consertar o verificador é legítimo quando há evidência de que ele mede errado (a anomalia do túnel) — não quando ele só incomoda." É a versão adulta de "não mexer no teste".
- **MANTER / REVERTER** (cap. 6) é o único exercício real de decisão: o aluno escolhe, vê o bouncing continuar, o contador ir a 3 em vermelho e o registro gravar "risco aceito sem causa raiz" — vive o caso RB20 em vez de ler sobre ele.
- Progressão: Preparar (1–2) → Uma volta (3–4) → Controlar (5–6) → Encerrar (7), sem que um princípio de Encerrar apareça antes da hora.

O que está errado:

1. **Lições quase duplicadas.** Cap. 1, lição III: "Uma peça por ciclo — Só o assoalho muda... para que o resultado tenha um dono." Cap. 2, lição II: "Uma mudança por run — Se três coisas mudam... ninguém sabe qual reverter." São o mesmo princípio (3.3) com dois nomes. O quadro de não repetição não pegou.
2. **Três lições orbitando "evidência":** cap. 1 "Referência real", cap. 4 "Evidência fotografável", cap. 5 "Dado antes de sensação". Cada uma tem um matiz, mas o aluno recebe três vezes "o dado vence a opinião" e uma vez só "produzir e criticar".
3. **Crítico independente pouco encenado** (cap. 5): a lição diz "quem mede não é quem projetou", mas a cena mostra a divergência, não quem a encontra. A (piloto do simulador que "não recebe a opinião de quem rodou") e B (o fantasma "não sabe por que você mudou o piso") encenam melhor.
4. **Distância do gesto diário.** CFD, runs de túnel, laminação a ±45°, autoclave: o aluno de Claude Code precisa de uma tradução a mais em cada cena. Os hotspots fazem essa tradução, mas a ficha (a parte que fica) fala a língua da fábrica.
5. Orçamento (Etapa 6 na pesquisa) ensinado no cap. 2: defensável como *Preparar — orçamento finito* (bloco PREPARAR de `f1-licoes.md` §3), mas chega antes de o aluno ter sentido o custo crescer.

### Verdade na F1 — 9

O mais cuidadoso: coluna vertebral (SF-24 2024, #27) narrada com os fatos na ordem certa (Barcelona → Silverstone → anomalia → Monza); ATR com todos os números da linha #5 (320 runs, 80 h, 400 h, 6 MAUh, 60%, 50 m/s); SF1000 com a citação exata de Binotto; Newey citado como está na fonte; e a única ressalva metodológica entre os quatro: "A fonte diz que a Ferrari reverteu os dois carros após a sexta; não afirma A/B formal... não afirmar no texto que houve A/B em Silverstone." Cenários de correlação rotulados como ilustrativos. Não é 10 porque o uso do #7 (Racing Bulls 2026) no hotspot do cap. 3 é forçado ("o carro sobe em pontos definidos... Racing Bulls, Spa 2026: só havia um jogo de peças") — o fato não ilustra "ponto de macaco".

### Força cinematográfica — 7

Imagens-chave boas (nuvem ciano virando assoalho; carro a 60% no túnel com contador âmbar parando em 320; dois carros nos macacos trocando assoalhos sob bandeira vermelha; nuvem âmbar final). Mas:

- **Câmera parada demais.** "Vista estável (câmera parada) de 0.18 até 0.72; a transformação nesse trecho é sempre do carro, nunca da câmera; movimento de respiro só em 0.72–0.86." É 54% de cada capítulo com câmera fixa. O briefing pede "o mesmo jogo de câmeras" da referência; C troca jogo de câmera por jogo de peça.
- **Encenação falha no cap. 4:** a câmera fica na T-cam enquanto o carro-gêmeo desliza ao lado e a lâmpada UV acende — "pela borda do halo" o aluno vê a imagem-chave (dois carros, flow-vis sob UV) só no respiro de 0.72–0.86. O texto do tratamento ainda carrega o rascunho da dúvida: "em 0.50–0.56 a câmera 'se solta' da T-cam? Não — R1: a câmera não teleporta." Isso é anotação de trabalho, não tratamento.
- Cap. 1 é frio de ponta a ponta por decisão ("a hipótese não tem calor") — coerente, mas abre a experiência sem o sujeito quente/mundo frio que a gramática (R10) pede para a primeira impressão.

### Viabilidade — 7

O mais compatível com o que existe: túnel de vento (cap. 2) e sala de simulação/correlação (caps. 1, 5, 7) são o túnel e o box-laboratório do INTEIA (que já tem estação com três monitores e leitura por região com "assoalho/difusor verde-claro, carroceria transparente" — a imagem do cap. 1 já está renderizada em `lab-fluxo-assoalho.png`). Elimina explicitamente o maior risco da pesquisa de modelos ("não precisa de motor, câmbio ou radiadores"). Custos próprios: carro-gêmeo em dois capítulos, prateleira e `floor@velho` como objetos persistentes com estado por capítulo, escala 60% contra o contrato de layout, T-cam no cap. 4, sete capítulos. Não cita o laboratório nem a marca (defeito comum).

### Economia — 7

Títulos corretos e curtos ("A TINTA / NÃO OPINA." é o melhor título dos quatro). Mas os corpos estouram o limite de uma frase curta (≈ 72 caracteres, referência do site atual ≈ 48): cap. 3 "O carbono sobe camada por camada, é criticado antes de montar, e o assoalho antigo não é destruído." (98); cap. 5 (94); cap. 7 (88); cap. 4 (86). E as duas duplicações de lição apontadas acima.

### Arco — 9

É o único arco que **é** um loop: a primeira imagem é uma hipótese virando forma (nuvem ciano); a última é um registro virando a próxima hipótese (nuvem âmbar, "dado medido, não previsão"). Tensão real no Ato II ("o carro mais rápido carrega um erro, e o dado não deixa fingir que não") e resolução que não é vitória, é verificador consertado. Falta só o que impede o 10: o "flash de fotógrafos = critério atingido" chega no cap. 7 sem uma cena de pista que o mereça (o carro é lacrado, não corre).

**Total C: 47 / 60.**

---

## 4. Tratamento D — "BOX, BOX." (a noite da garagem)

### Fidelidade ao conteúdo — 8

O que está certo: os 12 princípios, uma vez cada, **na ordem canônica da pesquisa** (Preparar → Uma volta → Controlar I → Controlar II → interlúdio de custo → Encerrar I → Encerrar II — é literalmente o "mapeamento sugerido" do §6); a tese pedagógica é a mais operacional dos quatro ("amanhã ele faz sete coisas que hoje não faz", enumeradas com o capítulo de origem); o slide 1 mantém os 12 itens do site atual palavra por palavra (o mapa que o aluno leva); o semáforo que só abre quando os quatro hotspots das rodas foram visitados encena "critério atingido" sem quebrar a reversibilidade; "não mexer no teste" tem a melhor analogia ("a tinta não se limpa para o resultado parecer bonito").

O que está errado:

1. **Rótulo de lição não bate com o conteúdo** em três lugares. Cap. 2, lição II: "Evidência conferida — Um verificador que não reflete a realidade é pior que nenhum: calibre o sensor na pista." Isso é *calibrar o verificador* (#22), não *evidência conferida* (saída de comando, log, número). Cap. 5, lição III: "Risco identificado — Uma roda sem sinal: segurar o carro" — sinal faltando é *critério não atingido*; *risco identificado* na pesquisa é "a volta revelou algo que muda a decisão (interface, deleção, custo)". Cap. 1, lição II: "Revisar o necessário — Uma variável por volta" mistura 2.2 e 3.3.
2. **"Debrief" como lição (cap. 6, lição II)** sobrepõe-se a "Registro de volta" (lição I): as duas dizem "documente para o próximo ciclo".
3. **"Parc fermé do gesto" num disco de freio** (cap. 5, hotspot 4) é a analogia mais forçada do tratamento — o disco não tem nada a ver com congelamento de especificação.
4. Cap. 3 (Retorno) ensina reverter + suíte inteira + causa raiz: excelente trio, mas "Suíte inteira" já é o que a pesquisa liga a *verificar o resultado* (3.15), ensinado no cap. 1 — leve sobreposição.

### Verdade na F1 — 7

Os fatos citados são corretos e numerados (#24, #6, #4/#22, #27, #14, #1/#2, #8), e os dados de telemetria são rotulados "ilustrativos". O problema é o **quadro**: uma equipe monta um carro a partir de peças no chão às 03:12, roda flow-vis e rake na pista às 05:05, faz um stint de 18 voltas às 05:50, um pit stop de corrida às 06:05 e "cruza a linha" às 06:31. Nenhuma sessão de F1 acontece assim; flow-vis e rakes são ferramentas de FP1; um pit stop de 1,80 s com sinaleiro é de corrida. B declara sua licença poética nos créditos; D não declara nada — apresenta a ficção como se fosse um procedimento real. Para o critério 2 ("cada lição de F1 é um fato verificável e a analogia é exata"), os fatos passam e o enredo não.

### Força cinematográfica — 9

A abertura é a melhor das quatro: macro num disco de freio ainda morno, uma porca ao lado, "o aluno não sabe ainda que é um carro", e o dolly baixo pelo campo de peças até o chassi. O pit stop visto de cima com vinte silhuetas "como notas numa partitura" e o 1,80 s dilatado em 40% do capítulo é a melhor encenação do pit stop (A e B têm a mesma cena, sem as vinte posições). A luz que amanhece como variável global (breu → cobalto → laranja → sol) costura os sete capítulos sem trocar de mundo. Trinta etiquetas numeradas acendendo na linha de chegada respondem à abertura com precisão. "Nenhum capítulo tem o carro parado com texto ao lado" é verdade e é raro. Desconto: três das seis transições são "wipe diagonal padrão" — A e B variam mais.

### Viabilidade — 6

Garagem em três capítulos (Madrugada, Turno, Parada) e sala com monitor: compatível com o box-laboratório INTEIA, embora não o cite. Mas a lista de coisas a fabricar é a maior dos quatro: estado `floor` (pose no chão por peça, "não existe no catálogo"), discos de freio ×4, pinça, prancha, rake, macacos, pistolas ×4, pit board, bandeira, semáforo, vinte silhuetas, cinco envMaps interpolados, reflexo planar em dois capítulos, T-cam em dois capítulos (Retorno e Amanhecer), macro a 0,35 u e crane a 6 u fora dos limites testados. Usa nomes de grupo (`asa-dianteira`, `roda-DD`) em vez dos nós reais do modelo, o que empurra o mapeamento para a fase de código. Sete capítulos.

### Economia — 8

Títulos corretos e memoráveis ("TRÊS DA MANHÃ. / PEÇAS NO CHÃO. / NENHUM NÚMERO."; "DEZOITO VOLTAS. / NEM UMA A MAIS."). Corpos curtos, todos de uma frase. 28 hotspots, mas mais curtos que os de A. Desconto pelas sobreposições de lição (Debrief/Registro; Suíte inteira/Verificar).

### Arco — 8

"03:12, peças no chão, nenhum número" → "06:31, as mesmas trinta peças, cada uma com número, fonte e decisão" é um arco limpo e a frase "o que mudou não foi o carro; foi que cada decisão passou a ter um registro" é a melhor síntese de aprendizado entre os quatro. Desconto: o que o carro está fazendo às 06:31 (corrida? volta de teste?) nunca é dito, e a motivação "precisa estar na pista quando o sol nascer" não existe na F1 — o arco funciona como fábula, não como caso.

**Total D: 46 / 60.**

---

## 5. Quadro comparativo

| Critério | A Setor Roxo | B Volta Única | C Último Estado Verde | D Box, Box. |
|---|---|---|---|---|
| Fidelidade ao conteúdo | 6 | 8 | 8 | 8 |
| Verdade na F1 | 8 | 7 | 9 | 7 |
| Força cinematográfica | 9 | 8 | 7 | 9 |
| Viabilidade | 6 | 5 | 7 | 6 |
| Economia | 6 | 8 | 7 | 8 |
| Arco | 8 | 8 | 9 | 8 |
| **Total (60)** | **43** | **44** | **47** | **46** |

Leitura da tabela pela minha lente: em fidelidade, B, C e D empatam em 8 por razões diferentes — B tem os termos mais limpos e os hotspots mais aplicáveis, D tem a ordem mais correta e a tese mais operacional, C tem a única estrutura em que o aluno **vê um loop inteiro fechar** e o único exercício de decisão com consequência. O que desempata a favor de C é o conjunto: melhor verdade de F1, melhor arco (o arco é o loop), melhor aproveitamento possível do túnel e do box já construídos. O que C precisa receber dos outros está na seção 7.

---

## 6. Vencedor

**Tratamento C — "ÚLTIMO ESTADO VERDE".**

Justificativa em uma frase: é o único tratamento em que a metáfora e o conteúdo são a mesma coisa — o ciclo de vida de um upgrade **é** um loop de engenharia (hipótese, orçamento, peça, evidência, divergência, reversão, verificador corrigido, registro), e o aluno sai com o gesto que mais falta a quem usa IA: guardar o último estado verde e desconfiar do verificador antes de desconfiar da pista.

Condições para a fase de narrativa consolidada (não negociáveis):

1. Trocar o herói e a marca para o Laboratório INTEIA (carro de 97 peças, vermelho Racing Red, box-laboratório e túnel de vento existentes; paleta a partir de `#D92135` / `#202930` / `#F0F2F3`, acrescentando só as temperaturas por capítulo). Os nomes de peça nos hotspots passam a ser os do `componentes-origem.json` ("Assoalho · 02", "Flap traseiro DRS", "Display do volante").
2. Eliminar as duas duplicações de lição: fundir "Uma peça por ciclo" (cap. 1) e "Uma mudança por run" (cap. 2) numa só, abrindo vaga no cap. 1 para "Tarefa delimitada" com escopo escrito (o que entra, o que fica de fora, o que é proibido); reduzir o trio "referência real / evidência fotografável / dado antes de sensação" a dois termos distintos (referência real no cap. 1; verificar o resultado no cap. 4), deixando o cap. 5 para crítico independente + o que não pode piorar + calibrar o verificador.
3. Cortar os corpos dos caps. 3, 4, 5 e 7 para ≤ 72 caracteres, uma frase.
4. Reescrever a encenação do cap. 4: a câmera desce da T-cam **antes** de o gêmeo entrar e da UV acender, para que a imagem-chave aconteça na janela de leitura, não no respiro; apagar a anotação "a câmera 'se solta' da T-cam? Não —".
5. Dar movimento de câmera dentro da janela 0.18–0.72 em pelo menos quatro capítulos (ver enxertos de A e D), sem quebrar a reversibilidade.
6. Retirar o Racing Bulls 2026 (#7) do hotspot "ponto de macaco" (analogia forçada e fato recente); se ficar, mover para o cap. 4 como exemplo de A/B com um único jogo de peças.

---

## 7. Enxertos (as melhores ideias dos perdedores, com origem)

Ordenados por valor pedagógico; cada um diz onde entra em C.

1. **[D, §2] Tese pedagógica como sete gestos de amanhã.** Reescrever a tese de C no formato de D ("amanhã ele faz sete coisas que hoje não faz", uma por capítulo, com o comando ou prompt correspondente). Entra na seção 2 de C e vira o texto do fallback sem WebGL.
2. **[B, §5.2] Aprofundamento "Quatro armadilhas"** (loop que não converge, avaliador complacente, overfitting ao critério, custo explodindo) como recapitulação da Etapa 8 da pesquisa. Substitui ou complementa o slide 2 de C ("Dossiê"): sugestão de manter "Calibrar o verificador" no cap. 5 e trocar o slide do cap. 7 por "Dossiê + quatro armadilhas" em 4 × 3.
3. **[A, cap. 5, hotspot 2 / f1-licoes #29] Lição "Pré-condição antes do gatilho"** com Mônaco 2022 (double stack com 5 s onde eram precisos 6; o "stay out" chegou tarde). Entra no cap. 3 de C (Peça), no hotspot do ponto de macaco, no lugar do Racing Bulls 2026 — "se a pré-condição cai, a ação não começa" é o que a montagem sobre macacos ilustra de verdade.
4. **[A, cap. 6] Contador de falhas encenado com bandeiras e ghost verde:** falha 1 = amarela, falha 2 = safety car e reset, falha 3 = vermelha e "o que interrompeu" vai para o registro; botão "tentar de novo" que sobe o contador e botão "reverter" que traz o fantasma verde. Entra no cap. 6 de C (Decisão), onde hoje o contador para em 2 sem interação; o MANTER de C vira a terceira falha vivida.
5. **[D, cap. 5] Pit stop visto de cima com vinte silhuetas em posições fixas e o 1,80 s dilatado em 40% do capítulo, mais o semáforo do HUD que só abre quando os quatro sinais (hotspots das rodas) foram visitados.** C não tem pit stop; entra como cena de "montagem v2" no cap. 7 (Legado), antes do lacre de parc fermé: o assoalho corrigido é montado como um pit stop — cada pessoa uma tarefa, a luz verde só com todos os sinais. Fatos #1 e #2 (McLaren Catar 2023) passam a ter cena.
6. **[D, cap. 0] Abertura em macro num disco de freio ainda morno entre peças no chão, dolly baixo pelo inventário até o chassi ("o aluno não sabe ainda que é um carro").** Alternativa à nuvem de pontos fria de C para o primeiro plano: abrir no box INTEIA real, com peças no chão sob a lâmpada de trabalho, e só depois a nuvem ciano do CFD nascer sobre o assoalho. Resolve o cap. 1 "frio inteiro" e ancora a experiência no laboratório existente.
7. **[B, cap. 0 e cap. 6] Pit board diegético com o alvo em branco na abertura e o número preenchido no fim** (`ALVO 1:38.500 · JUIZ: CRONÔMETRO` → `1:38.412 · CRITÉRIO ATINGIDO` → `PRÓXIMA VOLTA · ENTRADA: REGISTRO DESTA`). Em C, a placa INTEIA da parede do box ou um dos três monitores da estação de engenharia faz esse papel: no cap. 1 mostra "ALVO: +18 pt · NÃO PODE PIORAR: dirigível em curva rápida · JUIZ: FP1"; no cap. 7 mostra o resultado e a linha do próximo carro.
8. **[B, cap. 1 / f1-licoes #21] Lição "Ensaiar a volta"** (Vettel de olhos fechados: "o que muda em relação ao run anterior?") como *explorar antes de agir* — o único princípio do INTEIA (Lei 4) que C não ensina. Entra no cap. 2 de C (Túnel), no lugar da lição duplicada "Uma mudança por run": antes de gastar um run, listar o que muda em relação ao anterior.
9. **[B, hotspots] Estilo de hotspot que termina no prompt que o aluno escreve amanhã** ("`npm test` completo, nunca um arquivo isolado"; "Corrija apenas os itens 1 e 3 da revisão"; "me diga como isso funciona hoje, não edite nada ainda"; "Confira `git diff tests/`"). Aplicar como regra de redação a todos os hotspots de C: cada hotspot fecha com a frase de Claude Code correspondente.
10. **[A, cap. 2] Interação "escolher quem leva a peça":** dois botões A e B; dar o assoalho novo aos dois carros mostra "comparação morta" e a fita de telemetria some. Entra no cap. 4 de C (Pista), que já tem o carro-gêmeo mas nenhuma interação.
11. **[D, §4 e §7] Luz do céu como função do progresso global** (breu → cobalto → laranja → sol) costurando os capítulos sem trocar de mundo. Em C, aplicar ao arco "o calor migra" que já existe: a temperatura global sobe do ciano do cap. 1 ao âmbar do cap. 7, interpolando envMaps por `uMix`.
12. **[A, caps. 2–4 e D, cap. 3] Movimentos de câmera dentro da janela de leitura:** travelling lateral baixo com o mundo passando (A, cap. 2), crane curto durante a montagem (A, cap. 5), onboard com o horizonte oscilando com o bouncing (D, cap. 3: "a oscilação do carro é a oscilação do quadro"). C precisa de ao menos quatro capítulos com câmera em movimento entre 0.18 e 0.72; o cap. 5 de C (bouncing) deve ganhar a onboard oscilante de D antes do rack focus.
13. **[D, cap. 6] Trinta etiquetas numeradas acendendo em todas as peças na última cena.** Em C, antes de o carro se dissolver na nuvem âmbar (cap. 7), cada peça acende a linha do dossiê — C já tem "um callout por peça"; a versão de D (número + fonte + decisão, "as mesmas peças que estavam no chão") é mais forte se a abertura for a do enxerto 6.
14. **[A, §6] Rótulos do traçado com o nome do próximo capítulo aparecendo durante o wipe e o ponto "QUINTA" piscando no fim convidando a rolar de volta** ("a reversibilidade do motor é a mensagem"). Em C, o fio de retorno tracejado da linha de fábrica (estações 7 → 1) pode piscar no fim com o mesmo convite.

---

## 8. Veredito

Os quatro tratamentos cumprem o essencial do briefing: cobrem os quatro blocos, citam só fatos com linha na tabela-mestra, descrevem tudo como função de `L` e têm última cena respondendo à primeira. Nenhum usa o Laboratório INTEIA nem a marca, e todos empurram a decisão de seis ou sete capítulos para a fase de código — isso é retrabalho garantido, seja qual for o vencedor.

Pela lente do professor de engenharia de loop, **C vence (47/60)** porque é o único em que o aluno assiste a um loop inteiro fechar com consequências — critério escrito que passa, critério não escrito que falha, reversão ao último estado verde que fica visível na prateleira, verificador consertado antes da segunda tentativa, registro que vira a próxima hipótese — e porque é o mais rigoroso com a F1 e o mais próximo do túnel e do box que já existem. **D (46)** perde por pouco: tem a ordem pedagógica mais correta e a melhor cinematografia, mas três rótulos de lição errados e um enredo de F1 que não existe (flow-vis às cinco da manhã, corrida ao amanhecer) sem declarar a licença. **B (44)** tem os termos mais limpos e os hotspots mais aplicáveis, mas inverte verificar/produzir, força "produzir e criticar" sobre um pit stop, apoia o arco numa falsidade de circuito e ignora por completo os ambientes prontos. **A (43)** é o mais cinematográfico junto com D, mas ensina na ordem do calendário, duplica "critério atingido", promove uma regra de desempate a lição e é o mais caro de construir.

Regra para a narrativa consolidada: partir de C, aplicar as seis condições da seção 6 e os enxertos 1–9 (obrigatórios) e 10–14 (recomendados). O resultado esperado é um C com a tese de D, as armadilhas de B, a pré-condição e o contador de falhas de A, e o carro vermelho do laboratório.
