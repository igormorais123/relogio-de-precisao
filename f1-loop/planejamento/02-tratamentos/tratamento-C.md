# Tratamento C — "ÚLTIMO ESTADO VERDE"

Ângulo: **o loop é a engenharia de fábrica — o ciclo de vida de um único upgrade.** Uma peça nasce como hipótese no CFD, ganha corpo no túnel de vento, é laminada em carbono, montada no carro, pintada com flow-vis na pista, confrontada com a simulação, mantida ou revertida, e documentada para o próximo carro. A experiência inteira segue **uma peça só: o assoalho novo**. O carro se transforma porque a peça atravessa estados de matéria (dado → modelo → carbono → evidência → registro), e a câmera acompanha a peça, não a corrida.

Coluna vertebral factual: Ferrari SF-24, 2024 — piso novo em Barcelona (junho) deu downforce e bouncing; em Silverstone, depois dos treinos de sexta, os dois carros voltaram ao piso anterior; a causa foi uma anomalia no túnel de vento; o piso corrigido chegou em Monza e Leclerc venceu (`01-pesquisa/f1-licoes.md`, #27). Os outros fatos (SF1000 2020, ATR, Newey, Smedley, Aston Martin 2023, parc fermé, RB20, W13, teto orçamentário, debrief McLaren) vêm da mesma tabela-mestra e são citados por número.

Data: 2026-09-12. Contrato: `00-briefing.md`. Gramática: `01-pesquisa/gramatica-visual.md` (R1–R12, movimentos 1–10, catálogo de estados). Motor: `01-pesquisa/arquitetura-atual.md` (janelas de `L`, limites de câmera, schema v2). Peças: `01-pesquisa/assets-locais-f1-2026.md` (nomes dos objetos do `.blend` part7).

Convenções: `L` = progresso local do capítulo (0..1); toda animação é função de `L` e reversível; nada depende de segundos nem do quadro anterior. Nomes de peça são os **objetos reais do modelo Blender do autor**: `front_wing_bottom`, `front_wing_middle`, `front_wing_top`, `front_wing_side_plates`, `front_wing_mount`, `front_flap_detail`, `rear_wing_main_part`, `rear_wing_drs`, `drs_mechanism`, `drs_holder`, `rear_wing_side`, `rear_wing_top_mount`, `rear_wing_holder`, `rear_wing_bottom_holder`, `rear_led`, `main_body`, `main_body_inside`, `main_body_glass`, `floor`, `top_intake_details`, `side_mirrors`, `antennas`, `exhaust`, `front_tire`, `rear_tire`, `front_wheel_cover`, `rear_wheel_cover`, `inside_cover`, `rear_inside_cover`, `front_control_arms`, `rear_control_arms`, `front_pushrod`, `rear_driveshaft`, `steering_wheel_main`, `steering_wheel_handles`, `steering_wheel_buttons`, `steering_wheel_leds`, `lcd_screen`, `sw_connection`. Duas instâncias do assoalho existem na cena do começo ao fim: `floor` (o novo, protagonista) e `floor@velho` (o antigo, o "último estado verde", que nunca é destruído). Distâncias em unidades de cena com o carro medindo ≈5,6 u (1 u ≈ 1 m).

---

## 1. Título e logline

**Título:** ÚLTIMO ESTADO VERDE
(na fábrica, é a última especificação que passou na pista; no loop com IA, é o último commit em que a suíte inteira estava verde — o lugar para onde se volta quando a volta seguinte piora.)

**Logline:** Um assoalho de Fórmula 1 atravessa o ciclo completo de um upgrade — hipótese no CFD, túnel de vento, carbono, pista, correlação, reversão e dossiê — para ensinar que iterar com IA é fabricar evidência, guardar o que funcionava e escrever para o próximo carro.

---

## 2. Tese pedagógica

O aluno sai sabendo **conduzir uma mudança com IA como uma fábrica de F1 conduz um upgrade**: trata a primeira resposta do modelo como hipótese (CFD), não como resultado; fixa antes o que é a referência real (a pista), o critério verificável (o número, com o que não pode piorar) e o escopo (uma peça por ciclo); gasta um orçamento contado de runs mudando uma variável por vez, no instrumento mais barato que responde à pergunta; produz o artefato e o critica antes de montar; guarda a versão anterior em vez de destruí-la (commit pequeno = assoalho velho na prateleira); leva a peça para o mundo real e colhe evidência que dá para fotografar (flow-vis, saída de comando) contra um baseline na mesma sessão; entrega a comparação a quem não projetou a peça e lê o dado antes da sensação; quando a pista discorda do modelo, reverte ao último estado verde, conta as falhas (duas = reset com prompt refinado; três = pessoa), e procura a causa raiz no verificador, não no sintoma; e encerra por uma das três saídas legítimas, congelando o que passou e escrevendo o dossiê que será a entrada do próximo ciclo.

Gesto mais transformador, ensinado cedo e repetido pela peça: **"a resposta do modelo é o CFD; a pista é `npm test`"** — nada é verdade até rodar no mundo real, e o que rodou é guardado antes de se tentar a próxima mudança.

---

## 3. Arco em três atos

**O que está em jogo.** Uma equipe tem um orçamento finito de runs de túnel, um teto de custo e uma temporada de vinte e tantas corridas. Cada upgrade que chega ao carro custou meses; cada upgrade errado custa corridas e, pior, esconde o erro dentro do carro mais rápido do grid. O aluno vive a mesma economia com IA: contexto finito, respostas convincentes, e a tentação de aceitar "melhorei" sem levar a peça à pista.

**Ato I — A peça ainda não existe (Hipótese, Túnel, Peça).** Abre no breu de uma sala de simulação: uma nuvem de pontos ciano se adensa e vira o assoalho de um carro fantasma. É bonito e ainda não é verdade. O túnel de vento dá corpo à hipótese, mas com escassez: 320 runs, 80 horas de vento, um carro a 60%. Na garagem a peça finalmente vira carbono, camada por camada, e é montada com o ventre do carro aberto — enquanto o assoalho velho desliza para uma prateleira iluminada, onde vai ficar visível pelo resto da experiência. O ato fecha com o carro descendo dos macacos com a peça nova e a velha guardada. Tensão: tudo o que sabemos veio de instrumentos que não são a pista.

**Ato II — A pista discorda (Pista, Correlação).** O carro sai para o FP1 com tinta flow-vis e rakes de sondas; ao lado, o carro-gêmeo com o assoalho antigo, sem tinta. Sob luz UV, as estrias verdes dizem para onde o ar foi de verdade. Na sala de correlação, o carro real e o seu fantasma de CFD se sobrepõem — e divergem: o fantasma é plano, o real oscila; a traseira do assoalho pulsa âmbar onde os dois discordam. O critério escrito ("mais downforce") foi atingido; o critério que ninguém escreveu ("dirigível em curva rápida") foi violado. O ato fecha com a divergência congelada na tela e ninguém querendo admitir que o carro mais rápido carrega um erro.

**Ato III — Volte ao último estado verde (Decisão, Legado).** Sob céu de chumbo em Silverstone, a decisão que o placar bom torna difícil: reverter. O assoalho novo sai com contorno âmbar; o velho volta da prateleira para os dois carros; a bandeira vermelha desce sobre o pit wall. O contador de falhas marca duas, e a resposta não é insistir: é achar a causa no túnel — o verificador estava errado — e refazer a peça com o verificador corrigido. Em Monza, o assoalho v2 é montado e lacrado pelo parc fermé; o único ajuste permitido é o ângulo do flap. **A última cena responde à primeira:** o carro lacrado se dissolve em uma nuvem de pontos, como na abertura — mas agora os pontos são âmbar, porque são dado medido, não previsão — e a nuvem se reorganiza no assoalho de um carro que ainda não existe. O primeiro plano da experiência era uma hipótese virando forma; o último é um registro virando a próxima hipótese. O loop não termina: recomeça com uma entrada melhor.

---

## 4. Capítulos (7)

Janelas herdadas do motor, salvo onde indicado: transição de câmera `L < 0.18` (órbita, pose inicial = pose final do capítulo anterior); título entra `0.08–0.24` (cap. 1: `0.02–0.20`), sai `0.40–0.50`; ficha (essência, lições, fato de pista) `0.50–0.62 → 0.88–0.98`; hotspots ativos `0.35–0.82`; wipe de saída `0.86–1.00`. Capítulos com aprofundamento (5 e 7): título sai `0.30–0.36`, ficha `0.36–0.63`, slide em `L ≥ 0.64`. **Vista estável** (câmera parada) de `0.18` até `0.72`; a transformação nesse trecho é sempre do carro, nunca da câmera (R1: "o lugar vem até a câmera"); movimento de respiro só em `0.72–0.86`. Herói sempre à direita do texto em paisagem, lados alternando por paridade; retrato = texto em cima, carro embaixo.

Ritmo de cada capítulo (R7): texto ocupa ≈35% de `L`; o resto é peça + câmera.

### Capítulo 1 — `hipotese` · Hipótese

- **Título:** `A PEÇA NASCE\nCOMO HIPÓTESE.`
- **Corpo:** O CFD desenha um assoalho perfeito; a pista ainda não viu nenhum.
- **Essência:** Trate a primeira resposta como hipótese: fixe a referência real, o critério e a peça antes de gastar um run.
- **Lições:**
  - I. **Referência real** — A pista, não o modelo: teste que falha, dado medido, documento; comparar saída de IA com saída de IA é eco.
  - II. **Critério verificável** — Uma frase que um comando ou uma pessoa sem contexto julga verdadeiro ou falso, escrita antes da primeira volta.
  - III. **Uma peça por ciclo** — Só o assoalho muda; asas, suspensão e motor ficam congelados para que o resultado tenha um dono.
- **Lição F1:** **Projeto que não correlaciona é frágil** — Ferrari SF1000, 2020: Binotto admitiu "descorrelação do projeto para a pista"; a equipe "empurrou muito o projeto buscando downforce" e tudo o que desenvolveu era "frágil em robustez aero" na pista; a revisão grande só veio no GP da Hungria. Otimizar para o verificador (túnel) em vez de para a realidade (pista) produz peças que passam no teste e falham no uso. (`f1-licoes.md` #24, Autosport.)
- **Ambiente 3D:** sala de simulação — breu `#07090c`, um grid fino de chão em ciano a 8% de opacidade que some em névoa a 30 u, sem paredes, sem horizonte. Nenhuma key quente ainda: a única luz é a que os pontos emitem. É o único capítulo frio de ponta a ponta, de propósito — a hipótese não tem calor.
- **Estado do carro — início:** não há carro. Há uma nuvem de ≈12.000 pontos ciano `#38e8ff` em suspensão (Constellation em modo "malha": os pontos são vértices amostrados do GLTF, `scatter = 1`, `explode = 1`, materiais a 0% de opacidade). **Fim:** o carro inteiro existe como fantasma translúcido (`ghost`-material aditivo ciano a 25%, `explode = 0`, `scatter = 0`) e só o `floor` está sólido, com mapa de pressão procedural (gradiente azul `#1a4dff` → vermelho `#ff3b1a` ao longo do comprimento, mais ruído) — a única peça "resolvida" do carro é a peça em estudo.
- **Coreografia de câmera:**
  - `0.00–0.18`: sem transição (é o primeiro capítulo). Câmera a 7,3 u, altura 0,4 u, contra-plongée leve (mov. 2 adaptado), target no vazio onde o assoalho vai nascer.
  - `0.02–0.20`: título entra sobre a nuvem, em contorno; a nuvem começa a se adensar (`scatter` 1 → 0,6).
  - `0.18–0.50`: vista estável. A nuvem "cai" para as posições `home` dos vértices (`scatter` 0,6 → 0; `explode` 1 → 0 escalonado por `assemblyOrder`, asas por último); o `floor` solidifica primeiro (opacidade 0 → 1 em `0.28–0.40`) e o resto do carro vira fantasma aditivo (`0.36–0.50`). Título sai em partículas na direção do chão (R3).
  - `0.50–0.72`: vista estável mantida; ficha à esquerda. O mapa de pressão desliza sobre o `floor` como uma varredura (`uProgress` 0 → 1, do bordo de ataque à saída do difusor). Hotspots ativos.
  - `0.72–0.86`: respiro — push-in lento (mov. 5 suave) de 7,3 u a 6,6 u sobre a traseira do `floor`, `worldFocusRange` de 2,4 → 1,2: o mapa de pressão vira a imagem inteira.
  - `0.86–1.00`: saída (abaixo).
- **Efeitos e partículas:** poeira ambiente global (500 pontos, ciano frio, muito lenta); constelação de vértices (sistema narrativo 1); mapa de pressão procedural no `floor` (sistema 2); grão 0,10, vinheta forte, bokeh 2,2 (ponta da nuvem em bokeh, R8). Bloom 0,18 para os pontos.
- **Hotspots:**
  - `floor` — **Malha do CFD** — "Até 2.000 geometrias por período de ATR: o CFD é barato, rápido e não é a pista. É a primeira resposta do modelo." (`f1-licoes.md` #5.)
  - `main_body` — **Fora do escopo** — "Tudo o que não é o assoalho fica fantasma: congelado, sem mudar. Se duas peças mudam no mesmo ciclo, o delta não tem dono."
  - `front_wing_bottom` — **Um resultado, uma direção** — "Mercedes W13, 2022: 'um resultado na simulação nos fez escolher uma direção ligeiramente diferente' — 3 ou 4 décimos e dois anos de carro (Mike Elliott). Um número de simulação não é referência." (`f1-licoes.md` #25.)
- **Imagem-chave:** Uma nuvem de pontos ciano suspensa no breu se adensa e vira o assoalho de um carro que, fora da peça, é só fantasma; no chão, apenas a grade fina de um laboratório que some na névoa.
- **Transição de saída:** **wipe diagonal padrão** em `0.86–1.00` (−20°, borda fbm) que leva o breu do CFD para o aço frio do túnel; durante a varredura, os pontos remanescentes da nuvem se esticam em riscos horizontais (a poeira vira fluxo de ar), e o rótulo "TÚNEL" aparece junto ao nó ativo dos pontos de capítulo. O carro fantasma segue em quadro.
- **Emoção:** ambição contida — a ideia é bonita e ainda não é verdade.

### Capítulo 2 — `tunel` · Túnel

- **Título:** `320 RUNS.\n80 HORAS\nDE VENTO.`
- **Corpo:** O túnel dá corpo à hipótese, mas cada run é contado e cada run muda uma coisa.
- **Essência:** Declare o orçamento antes da primeira volta e gaste-o uma variável por vez, no instrumento mais barato que responde.
- **Lições:**
  - I. **Orçamento de runs** — Teto explícito de voltas, tokens ou minutos, declarado antes; sem teto o custo cresce enquanto a qualidade estagna.
  - II. **Uma mudança por run** — Se três coisas mudam e o resultado melhora, ninguém sabe qual ajudou; se piora, ninguém sabe qual reverter.
  - III. **Instrumento certo** — CFD, túnel ou pista; subagente ou contexto principal: escolha o executor mais barato que ainda responde à pergunta da volta.
- **Lição F1:** **ATR: a escala deslizante de testes aerodinâmicos** — desde 2021 o teste aero é limitado pela posição no Mundial de Construtores: em 2022–2025, 70% da base para o 1º colocado até 115% para o 10º, em degraus de 5%; base por período de ≈8 semanas: 320 runs, 80 h de "wind on", 400 h de ocupação, CFD de 6 MAUh; modelo a no máximo 60% de escala e vento a 50 m/s. Menos runs exigem hipóteses melhores, não mais tentativas. (`f1-licoes.md` #5, F1.com / The Race / RaceFans.)
- **Ambiente 3D:** túnel de vento — aço frio `#0a1218`, key branca fria 6.500 K dura de cima, dois rims ciano `#38e8ff` laterais, esteira rolante escura sob o carro, névoa sem horizonte. Na parede do fundo, fora de foco, um contador de runs em âmbar (`Plate.js`, plano emissivo): é a única cor quente do capítulo.
- **Estado do carro — início:** fantasma ciano em escala 1 (herdado). **Fim:** modelo sólido de carbono a **60% de escala** (`escala 0.6` — a regra do modelo de túnel vira gesto: o carro encolhe), preso por um pedestal traseiro (geometria simples, cilindro + braço) sobre a esteira, rodas girando na esteira (`speed 0.3` só nas rodas), `tunnel = 1` (40 ribbons de streamline + 3 ribbons de fumaça), `floor` com uma versão por run: a cada 25 runs do contador o `floor` troca de "variante" por morph sutil (três `morphTargets` no bordo do difusor — uma mudança por run, literal).
- **Coreografia de câmera:**
  - `0.00–0.18`: órbita de transição (motor) para a vista lateral do túnel: câmera perpendicular ao carro a 4,5 u (mov. 7), altura 0,9 u, esquerda do quadro (paridade). Durante a órbita o fantasma vira carbono (`ghost` 1 → 0, materiais 0 → 100%) e encolhe para 0,6 (`0.06–0.18`); os rims ciano acendem um por um.
  - `0.18–0.50`: vista estável lateral. `tunnel` 0 → 1 em `0.18–0.34`: as ribbons desenham-se da frente para trás (`uProgress`), a fumaça de traçado engrossa; contador de runs no fundo avança `0 → 96` proporcional a `L` (é o "cronômetro" do capítulo). Título entra e sai (dissolve para trás, na direção do fluxo).
  - `0.50–0.72`: vista estável. A cada 25 runs o `floor` muda de variante (morph `0.50 / 0.58 / 0.66`); um callout ciano marca "run 25 · difusor +2 mm" e some. Ficha à esquerda; hotspots.
  - `0.72–0.86`: respiro — travelling lateral de trás para frente contra o fluxo (mov. 7), 0,8 u de deslocamento, o pedestal passa em primeiro plano desfocado; contador chega a `320 · 80 h` em âmbar e **para**: orçamento acabou.
  - `0.86–1.00`: saída (abaixo).
- **Efeitos e partículas:** ribbons de streamline (1 draw call), 3 ribbons de fumaça (fbm na borda), poeira em riscos horizontais (velocidade do vento), contador de runs em plano emissivo, rims ciano; bloom 0,12; bokeh 2,0; grão 0,08 (cena mais limpa: laboratório).
- **Hotspots:**
  - `floor` — **Uma variante por run** — "Três versões do difusor em três runs, não três mudanças num run só: o delta de cada run tem um dono."
  - `front_tire` — **Esteira rolante** — "As rodas giram sobre a esteira para o chão se mover como na pista: o túnel tenta parecer referência, mas 'nenhum túnel correlaciona 100%' (Rob Smedley, F1.com)." (`f1-licoes.md` #4.)
  - `rear_wing_main_part` — **O que o estouro custa** — "Red Bull, 2021: £1,864 mi acima do teto de US$ 145 mi; pena de US$ 7 mi e 10% menos teste aerodinâmico por 12 meses. Gastar além do orçamento custa iterações futuras." (`f1-licoes.md` #10.)
- **Imagem-chave:** Um carro de carbono a 60%, preso por um pedestal sobre uma esteira escura, atravessado por quarenta fitas de fumaça branca que só acendem ao cruzar os rims ciano, e na parede do fundo um contador de runs âmbar, desfocado, que acaba de parar em 320.
- **Transição de saída:** **corte por luz** (tipo 3) em `0.86–1.00`: key e rims apagam em `0.86–0.92` (sobra só o contador âmbar e as ribbons se dissolvendo), 2% de escuro em que o carro volta a escala 1 e sai do pedestal (invisível), e em `0.94–1.00` acende uma lâmpada de trabalho âmbar `#ff8a2a` vinda da traseira — a primeira luz quente da experiência. Rótulo "PEÇA" nos pontos de capítulo durante o escuro.
- **Emoção:** disciplina sob escassez — cada run conta, e o contador não negocia.

### Capítulo 3 — `peca` · Peça

- **Título:** `UMA PEÇA.\nA VELHA FICA\nNA PRATELEIRA.`
- **Corpo:** O carbono sobe camada por camada, é criticado antes de montar, e o assoalho antigo não é destruído.
- **Essência:** Produza, critique antes de instalar, revise só o que a crítica apontou, e guarde a versão anterior para poder voltar.
- **Lições:**
  - I. **Produzir e criticar** — A peça sai do molde e vai ao inspetor antes de tocar o carro: "onde isso falha?", não "está bom?".
  - II. **Revisar o necessário** — Retrabalha-se o bordo apontado, não a peça inteira; reescrever tudo a cada volta destrói o que estava certo.
  - III. **Passo reversível** — A peça velha vai para a prateleira, não para o lixo: um commit pequeno por volta verificada é o que torna a reversão barata.
- **Lição F1:** **Evolução depois da faísca** — Adrian Newey, *How to Build a Car*: "A evolução costuma ser a chave, uma vez que a faísca de uma boa direção foi definida"; e "não é nada fácil traduzir resultados de túnel no artigo final". Depois de uma direção validada, o loop avança por revisões pequenas sobre uma base que passou, não por reinvenção a cada volta. (`f1-licoes.md` #23, Goodreads.)
- **Ambiente 3D:** garagem-fábrica — grafite de boxes `#0c0f13`, piso epóxi com reflexo borrado (reflexo planar a 0,35 de resolução, único efeito caro do capítulo), key = painel LED de teto frio, rim âmbar da lâmpada de trabalho na traseira, uma **prateleira iluminada** à esquerda do quadro (plano + luz de tira âmbar) que vai existir até o capítulo 7. Ao fundo, desfocado, o brilho laranja de uma porta de autoclave (plano emissivo).
- **Estado do carro — início:** montado, escala 1, no chão, `floor@velho` instalado, `floor` novo ainda não existe. **Fim:** montado com `floor` novo instalado, descendo dos macacos (`pitJack` 1 → 0), `floor@velho` repousando na prateleira à esquerda, iluminado, com um callout "v1 · último estado verde".
- **Coreografia de câmera:**
  - `0.00–0.18`: órbita de transição para a vista 3/4 dianteira baixa (câmera a 6,8 u, altura 0,7 u, direita do quadro). A lâmpada âmbar termina de acender; o carro está inteiro e parado.
  - `0.18–0.50`: vista estável. **Laminação** (`0.20–0.42`): ao lado do carro, sobre um molde (plano simples), o `floor` novo nasce camada por camada — 6 fatias por plano de recorte (`clippingPlanes` ou `uProgress` no shader do sarjado), cada camada com o tecido a ±45° alternado, sob o brilho laranja do autoclave. **Inspeção** (`0.42–0.50`): uma linha ciano varre a peça (verificação dimensional contra o CAD: o fantasma ciano da peça, vindo do cap. 1, sobrepõe-se por 4% de `L` e coincide); um pequeno callout âmbar aponta "bordo · retrabalho 0,4 mm" e some. Título dissolve para cima.
  - `0.50–0.72`: vista estável. **Montagem**: `pitJack` 0 → 1 (`0.50–0.56`, o carro sobe 12 cm nos macacos dianteiro/traseiro — pontos `front_wing_mount` e `rear_wing_bottom_holder`); explosão parcial vertical (`explode` 0 → 0,35 só para `main_body`, `main_body_inside`, `exhaust`, `rear_driveshaft`, que sobem; rodas e asas ficam); `floor@velho` desliza para a esquerda até a prateleira (`swap` 0 → 1 em `0.56–0.64`, trajetória em arco, contorno verde `#4dffb0` fino ao pousar); `floor` novo sobe do molde e encaixa (`0.64–0.72`), `explode` volta a 0. Ficha à esquerda; hotspots.
  - `0.72–0.86`: respiro — crane curto (mov. 4 reduzido): a câmera sobe de 0,7 u a 2,2 u em arco enquanto `pitJack` 1 → 0 e o carro pousa; o reflexo no epóxi mostra o ventre novo por um instante. A prateleira com o `floor@velho` entra no canto esquerdo do quadro e fica.
  - `0.86–1.00`: saída (abaixo).
- **Efeitos e partículas:** poeira âmbar (pega a lâmpada de trabalho), 30 partículas de brasa que sobem do autoclave, camadas de carbono por clipping, linha de inspeção ciano, contorno de swap, reflexo planar borrado; grão 0,12 (cena escura); bokeh 2,6; bloom 0,10.
- **Hotspots:**
  - `floor` — **Camada por camada** — "Tecido a ±45° alternado, seis camadas: a peça é produzida numa ordem que dá para inspecionar. Um diff pequeno é um laminado fino."
  - `floor@velho` — **Prateleira** — "O assoalho v1 fica visível até o fim da aula: é o último estado verde. `git revert` custa segundos porque a versão anterior existe."
  - `front_wing_mount` — **Ponto de macaco** — "O carro sobe em pontos definidos, não em qualquer lugar: intervenção delimitada. Racing Bulls, Spa 2026: só havia um jogo de peças e a regra de quem o receberia foi decidida antes, pela classificação em Silverstone (Alan Permane)." (`f1-licoes.md` #7.)
  - `exhaust` — **O que sobe e o que fica** — "Só o que precisa sair para o assoalho entrar se move; asas, rodas e suspensão não são tocadas: não refatorar o adjacente."
- **Imagem-chave:** Na penumbra de uma garagem, o carro erguido nos macacos com o ventre aberto, o assoalho velho deslizando em arco para uma prateleira iluminada à esquerda e o novo, ainda com o brilho laranja do autoclave, subindo do molde para o encaixe.
- **Transição de saída:** **wipe motivado por objeto** (tipo 2) em `0.86–1.00`: a porta do box sobe em primeiro plano desfocado (plano escuro que ocupa a tela por ≈8% de `L`), e atrás dela o grafite da garagem vira o breu do pit lane noturno com luzes UV; o carro começa a rolar (`speed` 0 → 0,25) enquanto a porta termina de subir. Rótulo "PISTA" nos pontos de capítulo.
- **Emoção:** cuidado de artesão — a peça nasce, e a anterior é guardada com respeito.

### Capítulo 4 — `pista` · Pista

- **Título:** `A TINTA\nNÃO OPINA.`
- **Corpo:** Flow-vis, rakes e um carro-gêmeo com a peça antiga: evidência que dá para fotografar.
- **Essência:** Leve a peça ao mundo real, colha evidência que outros possam ler, e compare com o baseline na mesma sessão — medindo o carro inteiro.
- **Lições:**
  - I. **Evidência fotografável** — A volta só conta quando a verificação rodou e a saída foi lida: tinta na asa, saída de comando, log; ordem de confiança testes > linter > screenshot > manual.
  - II. **Baseline na mesma sessão** — O outro carro com a peça antiga, mesma pista, mesmo dia: a revisão só existe em comparação com a saída anterior sob o mesmo teste.
  - III. **Suíte inteira** — Os rakes medem o carro todo, não só o assoalho: cada volta roda tudo o que já estava verde, porque a regressão silenciosa mora no que "não mudou".
- **Lição F1:** **Flow-vis e rakes aero: os mesmos pontos, no túnel e na pista** — Rob Smedley (F1.com): "nenhum túnel de vento correlaciona 100%"; dados de pressão são coletados nos mesmos pontos na pista e no túnel para comparação direta; flow-vis (tinta fluorescente que mostra a direção real do fluxo) e rakes aero (grades de sondas Kiel atrás das rodas e da asa) são usados em testes e no FP1. O verificador precisa ser calibrado contra a realidade antes de ser confiado. (`f1-licoes.md` #4, F1.com / Motorsport.com.)
- **Ambiente 3D:** pit lane à noite no FP1 — breu `#080a0e`, holofotes dos boxes de cima-atrás em 45° (silhueta com borda dourada), asfalto seco `#1a1b1d`, e no fim do capítulo uma **lâmpada UV** (rim ciano-violeta frio) que faz o flow-vis brilhar. Ao fundo, bokeh de discos dos faróis dos boxes. Guard-rail e postes instanciados para a parte em movimento.
- **Estado do carro — início:** montado com `floor` novo, `speed` 0,25 (saindo do box). **Fim:** parado no pit lane sob UV, `flowVis = 1` (estrias verde-fluorescentes `#4dffb0` do bordo de ataque à saída do difusor no `floor`, mais na `front_wing_side_plates`), rake de sondas (grade instanciada de 60 hastes finas) montado atrás de `front_tire` esquerdo, e o **carro-gêmeo** (`ab = 1`) parado 3 u à esquerda com `floor@velho` — sem tinta, sem rake, 40% mais escuro.
- **Coreografia de câmera:**
  - `0.00–0.18`: órbita de transição para a onboard (mov. 8): câmera na posição da T-cam acima do halo (`main_body_glass` como primeiro plano desfocado), FOV 70°, olhando à frente. `speed` 0,25 → 0,8: a pista rola sob o carro, postes passam, faíscas leves do skid block (`squat` +0,4 numa compressão em `0.12–0.16`).
  - `0.18–0.50`: vista estável onboard. Uma volta de instalação: `speed` 0,8 constante, `brakeHeat` sobe numa frenagem (`0.30–0.36`, brasa no `front_wheel_cover` visível pela borda), suspensão vibra, poeira em riscos. Título entra por cima do halo e dissolve para trás. Em `0.44–0.50` `speed` 0,8 → 0,1: o carro entra no pit lane; a tinta já está no assoalho, mas ainda não brilha (sem UV).
  - `0.50–0.72`: vista estável, mas o **mundo muda**: em `0.50–0.56` a câmera "se solta" da T-cam? Não — R1: a câmera não teleporta. A pose onboard é mantida e o carro para; o que entra é o **carro-gêmeo** deslizando pela esquerda (`ab` 0 → 1 em `0.52–0.60`) e a lâmpada UV acendendo (`0.58–0.64`): pela borda do halo, o `front_wing_side_plates` e o começo do `floor` explodem em verde fluorescente (`flowVis` 0 → 1). Ficha à esquerda; hotspots.
  - `0.72–0.86`: respiro — a câmera desce da T-cam em crane invertido (mov. 4 ao contrário: de 1,1 u de altura para 0,3 u, recuando 5 u) até a vista lateral baixa dos dois carros lado a lado, e faz um push-in curto no `floor` do carro A: as estrias verdes ocupam o quadro; o carro B, ao fundo, sem tinta, em bokeh. `worldFocusRange` 0,8.
  - `0.86–1.00`: saída (abaixo).
- **Efeitos e partículas:** asfalto com UV animado, postes instanciados, faíscas do skid block (Sparks com ricochete), brasa no freio, poeira em riscos, flow-vis como máscara emissiva procedural no `floor`/`front_wing_side_plates`, rake instanciado, segunda instância do carro (mesma geometria, mesmos 4 materiais); grão 0,10; bokeh 2,4 na onboard, 3,0 no push-in; bloom 0,2 (UV + brasa). Em retrato ou mobile, `ab` vira `ghost` (o gêmeo sobreposto em aditivo, sem segunda posição).
- **Hotspots:**
  - `floor` — **Flow-vis** — "Tinta fluorescente que escorre para onde o ar foi de verdade. Ela não opina: é uma fotografia do fluxo. É a saída de comando colada no fim da resposta."
  - `front_tire` — **Rake de sondas** — "Sessenta sondas Kiel atrás da roda medem a esteira inteira, não só a peça nova: a suíte completa roda a cada volta."
  - `side_mirrors` — **O carro-gêmeo** — "McLaren, GP da Áustria 2023: o primeiro pacote (piso, sidepods, cobertura do motor) foi só para o carro de Norris (P4); em Silverstone, os dois (Norris P2); 9 pódios na segunda metade. Testa-se num carro contra o outro antes de adotar nos dois." (`f1-licoes.md` #17.)
  - `antennas` — **A única volta real** — "Desde 2009 não há testes em temporada: o treino livre é o único laboratório real. Cada FP1 é um experimento planejado, com rakes, tinta e A/B." (`f1-licoes.md` #20.)
- **Imagem-chave:** Sob luz UV, um carro parado no pit lane à noite com estrias verde-fluorescentes escorrendo pelas bordas do assoalho e um rake de sondas atrás da roda dianteira; três metros à esquerda, o carro-gêmeo com o assoalho antigo, sem tinta, quase engolido pelo escuro.
- **Transição de saída:** **wipe diagonal padrão** em `0.86–1.00` — mas motivado pela tinta: as estrias verdes do flow-vis se desprendem do `floor` e viram ribbons de telemetria (a tinta vira dado), e a diagonal leva o pit lane ao preto-vinho da sala de correlação. Os dois carros seguem em quadro; a lâmpada UV apaga e três monitores acendem. Rótulo "CORRELAÇÃO".
- **Emoção:** expectativa de prova — a tinta vai contar, e não dá para discutir com ela.

### Capítulo 5 — `correlacao` · Correlação (com aprofundamento 1)

- **Título:** `O TÚNEL PREVIU.\nA PISTA\nDISCORDOU.`
- **Corpo:** O fantasma do CFD é plano; o carro real oscila; a traseira do assoalho pulsa onde os dois divergem.
- **Essência:** Entregue a comparação a quem não projetou a peça, leia o dado antes da sensação, e cheque também o que não podia piorar.
- **Lições:**
  - I. **Crítico independente** — Quem mede não é quem projetou: subagente ou sessão nova, só artefato e critério, partindo da hipótese de que há defeito.
  - II. **Dado antes de sensação** — O piloto sente mais grip; a telemetria mostra bouncing; quando dois observadores divergem é sinal, não ruído — investigue, não escolha um lado.
  - III. **O que não pode piorar** — "Mais downforce" foi atingido; "dirigível em curva rápida" nunca foi escrito. O critério completo diz o que ganha e o que não pode perder.
- **Lição F1:** **Upgrade que atingiu a métrica e piorou o carro** — Aston Martin AMR23, GP do Canadá 2023: pacote grande (piso, sidepods, cobertura do motor); Alonso P2 no Canadá e depois quatro corridas sem pódio. Mike Krack: "fizemos uma mudança antes e não antecipamos os efeitos colaterais" — o piso deu mais downforce, mas tornou o carro muito mais sensível, difícil de manter na janela. Critério de saída incompleto gera "sucesso" que é regressão: escreva também o que não pode piorar. (`f1-licoes.md` #28, GrandPrix247 / PlanetF1.)
- **Ambiente 3D:** sala de correlação — preto-vinho `#0c0a0d`, sem key quente: três monitores como únicas luzes (ciano `#38e8ff`, magenta `#ff3d8a`, marfim `#ebe6dc`), o carro em `silhouette = 1` com três rims coloridos; chão de reflexo fraco. A prateleira com o `floor@velho` continua no canto esquerdo, agora iluminada só pelo monitor magenta.
- **Estado do carro — início:** montado com `floor` novo, silhueta, carro-gêmeo saindo de quadro (`ab` 1 → 0 em `0.00–0.10`). **Fim:** carro real com **bouncing** (`squat` oscilando ±0,6 em função de `L`: `sin(L·48)` escalado pela janela — reversível), o **fantasma de CFD** (`ghost = 1`, ciano aditivo, plano, sem oscilar) sobreposto na mesma posição, e no `floor` real o mapa de pressão do cap. 1 de volta — agora com uma região âmbar `#ff8a2a` pulsante no terço traseiro, onde previsto e medido divergem. Ribbons de telemetria (ciano velocidade, âmbar altura do assoalho, verde throttle) coladas ao carro.
- **Coreografia de câmera:**
  - `0.00–0.18`: órbita de transição para o 3/4 traseiro a 5 u (mov. 6), altura 1,3 u, esquerda do quadro. Monitores acendem em sequência; o gêmeo sai; `silhouette` 0 → 1.
  - `0.18–0.36`: vista estável. `telemetry` 0 → 1: as ribbons entram por `uProgress` e atravessam o carro (`depthTest false`). Título entra e sai cedo (`0.30–0.36`, capítulo com aprofundamento), dissolvendo em direção aos monitores.
  - `0.36–0.63`: vista estável; ficha antecipada à esquerda. **A divergência**: `ghost` 0 → 1 (`0.36–0.42`), o fantasma coincide com o carro; em `0.44–0.56` o `squat` do carro real começa a oscilar (bouncing) enquanto o fantasma fica plano; em `0.50–0.60` a região âmbar acende no terço traseiro do `floor` e a ribbon âmbar de altura do assoalho vira serrote. **Rack focus** (`0.56–0.63`, mov. 6): a câmera não se move; só `worldFocusDistance` sai do carro (nítido) e vai para as ribbons a 1,5 u da lente. O olhar deixa a sensação e vai ao dado. Hotspots.
  - `0.63–0.86`: aprofundamento 1 sobreposto (`L ≥ 0.64`); callouts, ghost e ribbons zeram em `0.62`; o carro fica em silhueta oscilando devagar ao fundo, desfocado.
  - `0.86–1.00`: saída (abaixo).
- **Efeitos e partículas:** ribbons de telemetria (1 draw call por conjunto), ghost aditivo (mesma geometria), oscilação de `squat`, mapa de pressão com região âmbar (emissivo > 1,0 para o bloom), poeira quase parada (sala fechada), três rims; grão 0,10; bokeh 2,8 (rack focus é o efeito do capítulo); bloom 0,3.
- **HUD de cenários (só aqui):** botões **CFD · Túnel 60% · Pista seca · Pista com vento lateral**; `desvio` em pontos de downforce previsto − medido (CFD 0; túnel −4; pista seca −11 com bouncing; vento lateral −19). Cada cenário escreve `ghostOffset`, amplitude do `squat` e a extensão da região âmbar no `floor`; o gráfico mostra a curva prevista (tracejada) e a medida (âmbar) por setor. Entrada automática no registro: "leitura · correlação · {cenário} · {desvio}".
- **Hotspots:**
  - `floor` — **Onde os dois discordam** — "A traseira do assoalho pulsa âmbar: o túnel previu pressão estável; a pista mediu oscilação. O problema não é a pista — é o verificador."
  - `steering_wheel_main` — **O que o piloto sente** — "Newey: 'Se o piloto sente risco, você tem de ouvir.' No debrief, engenheiros primeiro (o dado), piloto depois (o sentido do dado). Dois observadores; a divergência é o sinal." (`f1-licoes.md` #15.)
  - `antennas` — **250 a 300 sensores** — "Mercedes: mais de 250 sensores, 17 barramentos CAN, ≈30 MB por volta, latência de 10 ms na Europa; F1/Forbes 2026 fala em ≈300. Instrumente o que decide, não tudo: cada verificação custa tokens." (`f1-licoes.md` #3.)
- **Imagem-chave:** Em uma sala escura iluminada por três monitores, o carro real em silhueta e o seu fantasma ciano sobrepostos: o fantasma plano, o real oscilando em bouncing, e a traseira do assoalho pulsando âmbar exatamente onde previsto e medido discordam.
- **Transição de saída:** **corte por luz** (tipo 3) em `0.86–1.00`: os três monitores apagam um a um (`0.86–0.92`), sobra a região âmbar do `floor` pulsando no escuro, e em `0.94–1.00` entra uma luz ambiente cinza-azulada de céu fechado vinda de todos os lados (Silverstone, sexta, sem sombras duras). Rótulo "DECISÃO".
- **Emoção:** desconforto honesto — o carro mais rápido carrega um erro, e o dado não deixa fingir que não.

### Capítulo 6 — `decisao` · Decisão

- **Título:** `VOLTE AO ÚLTIMO\nESTADO VERDE.`
- **Corpo:** O assoalho novo sai com contorno âmbar; o velho volta da prateleira para os dois carros.
- **Essência:** Quando o novo quebra o que o velho tinha certo, reverta primeiro, conte as falhas, e procure a causa raiz no verificador antes de tentar de novo.
- **Lições:**
  - I. **Reverter ao último verde** — Se a suíte inteira piorou, volta-se ao último estado verificado antes de pensar em corrigir; não se persegue quebras em cascata a partir de uma base errada.
  - II. **Regra 2 e 3** — Duas falhas seguidas no mesmo problema = reset com prompt refinado (erro exato, hipóteses descartadas); três = parar e perguntar a uma pessoa.
  - III. **Causa raiz, não sintoma** — Reproduza o bouncing antes de mexer; não "suba a altura" para esconder a oscilação: encontre a anomalia no túnel que produziu a peça errada.
- **Lição F1:** **Ferrari SF-24, Silverstone 2024: rollback como manual** — o piso novo de Barcelona (junho) deu mais downforce e induziu bouncing em curvas rápidas; em Silverstone, depois dos treinos de sexta, a Ferrari voltou ao piso e à carroceria pré-Barcelona nos dois carros; Sainz: a nova spec era "claramente pior que a antiga em Silverstone", reverter "não é mais rápido, mas é mais dirigível"; a causa foi uma anomalia no túnel de vento, identificada depois. O rollback preserva o que funcionava enquanto se conserta o verificador. (`f1-licoes.md` #27, The Race / Motorsport.com / F1.com.)
- **Ambiente 3D:** pit lane de Silverstone em tarde de sexta, céu de chumbo — cinza-tempestade `#0d1216`, luz ambiente `#4a5c6e` de todos os lados, key fraca, sem sombras duras; asfalto úmido (roughness 0,3, sem chuva caindo — o que caiu é decisão, não água). Pit wall em silhueta ao fundo com um mastro de bandeira (plano com alpha). A prateleira com o `floor@velho` está agora **ao lado do carro**, no pit lane: a garagem veio até a câmera.
- **Estado do carro — início:** montado com `floor` novo, bouncing residual (`squat` ±0,2), carro-gêmeo voltando pela direita (`ab` 0 → 1 em `0.04–0.16`), também com `floor` novo. **Fim:** os dois carros montados com **`floor@velho`** instalado (`swap` invertido), sem bouncing, parados; o `floor` novo repousa na prateleira com contorno âmbar apagando para cinza (arquivado, não destruído: vai voltar corrigido no cap. 7); um contador de falhas no HUD marca `2`.
- **Coreografia de câmera:**
  - `0.00–0.18`: órbita de transição para a órbita A/B (mov. 9, meia-volta reduzida a 40° para caber nos limites): câmera a 7,6 u, altura 1,8 u, direita do quadro, os dois carros lado a lado em plano geral. A luz de chumbo termina de subir.
  - `0.18–0.50`: vista estável. **Reprodução** (`0.20–0.32`): os dois carros "rodam parados" (`speed` 0,5 só nas rodas + asfalto rolando) e o carro A oscila (`squat` ±0,6) enquanto o B, sem tinta e sem rake, também oscila — o bug reproduzido nos dois. Bandeira amarela sobe no mastro (`0.28`). Contador de falhas: `1` em `0.30` (Barcelona), `2` em `0.42` (sexta em Silverstone) — cada número entra com um flash de 2 quadros de aberração cromática. Título entra e dissolve para baixo, para o asfalto. Bandeira vermelha desce em `0.44–0.50`; `speed` 0.
  - `0.50–0.72`: vista estável. **Reversão**: `pitJack` 0 → 1 nos dois carros (`0.50–0.54`); `swap` 1 → 0: o `floor` novo sai de cada carro com contorno âmbar `#ff8a2a` (`0.54–0.62`) e vai para a prateleira; o `floor@velho` deixa a prateleira com contorno verde `#4dffb0` e encaixa nos dois (`0.62–0.70`; no carro B é uma cópia instanciada); `pitJack` 1 → 0. O bouncing zera na hora em que o velho encaixa. Ficha à esquerda; hotspots.
  - `0.72–0.86`: respiro — a câmera atravessa entre os dois carros (o miolo do mov. 9): dolly de 2 u passando entre as rodas dianteiras dos dois, os `front_wing_side_plates` em primeiro plano desfocado; ao sair do outro lado, a bandeira vermelha em silhueta e a prateleira com o `floor` novo cinza. Contador `2` fixo em âmbar: não há terceira tentativa cega — a próxima volta parte do túnel.
  - `0.86–1.00`: saída (abaixo).
- **Efeitos e partículas:** segunda instância do carro (mobile: `ghost`), oscilação de `squat` em dois carros, contornos de swap (BackSide escala 1,02), bandeiras (planos com vento por vertex shader), flash de aberração cromática nos números do contador, poeira cinza pesada, asfalto úmido; grão 0,12; bokeh 2,2; bloom 0,08 (cena sem brilho: dia fechado).
- **Interação própria (decisão):** um hotspot grande diegético **MANTER / REVERTER** sobre o carro A em `0.40–0.50`. "Reverter" é o padrão do scroll; "Manter" é um estado de HUD que segura o `floor` novo no carro por todo o capítulo, mantém o bouncing, colore o contador de `3` em vermelho e escreve no registro "decisão · manter · risco aceito sem causa raiz" — o aluno vê a cena do RB20 (abaixo) com os próprios olhos. Reversível a qualquer momento; não altera a câmera.
- **Hotspots:**
  - `floor` — **Regressão detectada** — "Passou no critério escrito, falhou no não escrito. Contorno âmbar = versão que sai; ela vai para a prateleira, não para o lixo: vai voltar corrigida."
  - `floor@velho` — **Último estado verde** — "A versão que rodava. Reverter não é derrota: é a volta que preserva o que funcionava enquanto se conserta o verificador."
  - `side_mirrors` — **O que o placar esconde** — "Red Bull RB20, 2024, Pierre Waché: 'nós detectamos, mas o carro era rápido e não quisemos modificá-lo massivamente'; a descorrelação túnel/pista custou o título de Construtores. Evidência de regressão vale mesmo com placar bom." (`f1-licoes.md` #26.)
  - `rear_led` — **Uma temporada e meia sem reset** — "Mercedes W13/W14: porpoising 'impossível de replicar no túnel' (Wolff); conceito mantido em 2023 e abandonado só em Mônaco 2023; Allison: 'tudo que mudamos poderíamos ter feito com os sidepods antigos'. Duas falhas pedem reset; a causa não era a peça mais visível." (`f1-licoes.md` #25.)
- **Imagem-chave:** Sob céu de chumbo em Silverstone, dois carros lado a lado erguidos nos macacos; de cada um sai um assoalho com contorno âmbar e para cada um entra, da prateleira, um assoalho com contorno verde, enquanto uma bandeira vermelha desce sobre o pit wall em silhueta.
- **Transição de saída:** **wipe diagonal padrão** em `0.86–1.00`, na direção do pan: o céu de chumbo vira noite de Monza (asfalto noturno `#07090c`, key âmbar dos holofotes de volta pela primeira vez desde o cap. 4); o carro B sai de quadro pela direita durante a varredura (`ab` 1 → 0); a prateleira com o `floor` novo (agora cinza) atravessa a diagonal junto com o carro. Rótulo "LEGADO".
- **Emoção:** coragem humilde — reverter na frente de todo mundo, com o carro mais rápido do grid.

### Capítulo 7 — `legado` · Legado (com aprofundamento 2)

- **Título:** `O REGISTRO É\nO PRÓXIMO\nCARRO.`
- **Corpo:** O verificador corrigido, a peça refeita, o carro lacrado; o dossiê vira a hipótese do carro seguinte.
- **Essência:** Encerre por uma das três saídas, congele o que passou, e escreva o registro que será a entrada do próximo ciclo.
- **Lições:**
  - I. **Congelar o que passou** — Critério atingido com verificação final colada: depois disso, "só mais um ajuste" reabre o ciclo inteiro.
  - II. **Registro que sobrevive** — Cada volta deixa hipótese, mudança, instrumento, resultado e decisão; é o que sobrevive ao reset e vira a entrada do próximo carro.
  - III. **Três saídas legítimas** — Resultado (verificado), risco (uma pessoa decide no portão) ou limite (relatório do tentado, descartado e a decidir); "quase lá" não é saída.
- **Lição F1:** **Parc fermé: congelamento depois da classificação** — regra FIA: a partir da entrada na classificação a especificação fica congelada até a largada; permitido só pneus, combustível, sangria de freios, ajuste do ângulo da asa dianteira dentro de limites, reparo de dano comprovado e conforto do piloto; mudar setup (suspensão, altura, asas) = largar do pit lane. Critério atingido = congelar; o que ainda pode mudar é nomeado antes. (`f1-licoes.md` #9, PlanetF1 / Wikipedia.)
- **Ambiente 3D:** parc fermé em Monza à noite → sala de simulação. Começa em asfalto noturno `#07090c` com key âmbar de holofote e uma fita de parc fermé (linha ciano fina no chão em torno do carro, plano emissivo); termina no breu com grid ciano do cap. 1 — o mesmo ambiente da abertura, revelado pelo recuo da câmera. A prateleira, agora vazia, some no recuo.
- **Estado do carro — início:** montado com `floor@velho`, parado, key âmbar. **Fim:** não há carro — há uma nuvem de ≈12.000 pontos **âmbar** `#ff8a2a` (a mesma constelação do cap. 1, outra cor: dado medido, não previsão) que se reorganiza na forma de um assoalho — o do próximo carro. Entre início e fim: o fantasma ciano de CFD volta e, desta vez, **coincide** com o carro real (verificador corrigido); o `floor` v2 (o novo, corrigido, vindo da prateleira com o contorno cinza virando âmbar quente) é montado em montagem rápida; o carro é lacrado; o flash de fotógrafos acende uma vez.
- **Coreografia de câmera:**
  - `0.00–0.18`: órbita de transição para um close (mov. 10, ponto de partida): câmera a 6,4 u mas com target no `lcd_screen` do volante, `worldFocusRange` 0,5 — o display ciano do volante ocupa o terço direito. A key âmbar sobe.
  - `0.18–0.36`: vista estável no close. **Correlação corrigida** (`0.20–0.30`): o fantasma ciano entra (`ghost` 0 → 1) e coincide com o carro — nenhuma região âmbar no `floor`, a ribbon de altura do assoalho é uma linha reta. **Montagem v2** (`0.28–0.36`): `pitJack` rápido, `swap`: o `floor` v2 sai da prateleira (contorno cinza → âmbar) e encaixa; `floor@velho` vai para a prateleira uma última vez, com contorno verde. Título entra e sai cedo (`0.30–0.36`), dissolvendo para trás, na direção do recuo que vai vir.
  - `0.36–0.63`: vista estável; ficha antecipada à esquerda. **Lacre** (`0.38–0.46`): a fita de parc fermé acende no chão em torno do carro; o único movimento permitido acontece: `front_wing_top` gira 1,5° (ângulo do flap) e para. **Flash de fotógrafos** (`0.47`, uma vez na experiência inteira): 2 quadros a 60% de marfim, aberração cromática a 0,004 por 0,2 s — critério atingido. Em `0.50–0.63` o carro ganha, peça a peça, um callout de uma linha cada — "hipótese · run 96 · pista FP1 · −11 pt · reverter · túnel corrigido · v2 · Monza" — o dossiê escrito sobre o corpo do carro. Hotspots.
  - `0.63–0.86`: aprofundamento 2 sobreposto (`L ≥ 0.64`); callouts e ghost zeram em `0.62`; ao fundo, desfocado, começa o **recuo de debrief** (mov. 10): a câmera recua em linha reta de 6,4 u para 7,8 u ao longo do trecho (dentro do limite), o holofote âmbar apaga devagar e o grid ciano do cap. 1 aparece no chão — a sala de simulação estava ali o tempo todo.
  - `0.86–0.97`: sem wipe (último capítulo). **A resposta à abertura**: `explode` 0 → 1 e `scatter` 0 → 1 escalonados; os materiais apagam (opacidade 1 → 0) e a constelação reaparece — **âmbar**, não ciano — e, em `0.92–0.97`, os pontos se reorganizam (`scatter` → 0 sobre um segundo conjunto de `home`: os vértices do `floor` apenas, ligeiramente maior, deslocado para cima) na forma de um assoalho que ainda não pertence a nenhum carro. Bloom 0,1 → 0,55.
  - `0.97–1.00`: créditos sobre a nuvem parada; registro exportável.
- **Efeitos e partículas:** ghost coincidente, fita de parc fermé emissiva, rotação do `front_wing_top`, flash de fotógrafos, callouts de dossiê (um por peça, cor âmbar), recuo com mudança de envMap por `uMix`, constelação em âmbar (mesmo sistema do cap. 1, cor trocada), bloom subindo no final; grão 0,10; bokeh 2,8 no close → 1,6 no plano geral.
- **Hotspots:**
  - `floor` — **v2, lacrado** — "Monza 2024: piso novo com a 'canoa' central reformulada, depois de o túnel ser corrigido; Leclerc venceu o GP da Itália. A peça voltou da prateleira porque o verificador foi consertado, não porque insistiram." (`f1-licoes.md` #27.)
  - `front_wing_top` — **O único ajuste permitido** — "Sob parc fermé, só o ângulo do flap dianteiro, pneus, combustível e sangria de freios; suspensão ou altura = largar do pit lane. Nomeie antes o que ainda pode mudar depois do critério." (`f1-licoes.md` #9.)
  - `lcd_screen` — **Ordem do debrief** — "McLaren, 2026: o diretor de engenharia abre pelas mudanças de setup que a equipe precisa saber, depois os relatórios dos engenheiros, depois a impressão dos pilotos; telemetria sobreposta a GPS e vídeo, curva a curva. Dado primeiro, sensação depois — e por escrito, senão não existe para o próximo contexto." (`f1-licoes.md` #8.)
- **Imagem-chave:** O carro lacrado por uma linha ciano de parc fermé, sob um único holofote âmbar, se dissolve em uma nuvem de pontos — agora âmbar, como dado medido — que se reorganiza, no breu do laboratório da abertura, na forma do assoalho de um carro que ainda não existe.
- **Transição de saída:** nenhuma (último capítulo). A nuvem âmbar parada é a tela final; créditos em `L > 0.97`; o registro se abre com o dossiê completo das sete voltas e o botão de exportar.
- **Emoção:** serenidade com continuidade — nada acabou; a próxima hipótese já tem um dado para nascer.

### Quadro de não repetição (o que cada capítulo ensina)

| Cap. | Estado da peça | Bloco do loop | Lições (termos únicos) | Fato F1 (único) | Estado do carro: início → fim |
|---|---|---|---|---|---|
| 1 Hipótese | dado | Preparar | referência real · critério verificável · uma peça por ciclo | SF1000 2020 (#24) | nuvem ciano → fantasma com `floor` sólido |
| 2 Túnel | modelo | Preparar (orçamento) | orçamento de runs · uma mudança por run · instrumento certo | ATR (#5) | fantasma escala 1 → carbono a 60% no túnel com streamlines |
| 3 Peça | carbono | Uma volta (produzir) | produzir e criticar · revisar o necessário · passo reversível | Newey, evolução (#23) | montado com v1 → nos macacos, v1 na prateleira, v2 instalado |
| 4 Pista | evidência | Uma volta (verificar) | evidência fotografável · baseline na mesma sessão · suíte inteira | Smedley, flow-vis/rakes (#4) | em movimento (onboard) → parado sob UV com flow-vis, rake e gêmeo |
| 5 Correlação | divergência | Controlar (crítico/evidência) | crítico independente · dado antes de sensação · o que não pode piorar | Aston Martin Canadá 2023 (#28) | silhueta → bouncing com fantasma plano e região âmbar |
| 6 Decisão | regressão | Controlar (reverter) + Regra 2/3 | reverter ao último verde · regra 2 e 3 · causa raiz | Ferrari SF-24 Silverstone 2024 (#27) | dois carros com v2 oscilando → dois carros com v1, v2 na prateleira |
| 7 Legado | registro | Encerrar | congelar o que passou · registro que sobrevive · três saídas | Parc fermé (#9) | montado com v1 → v2 lacrado → nuvem âmbar em forma de assoalho |

Princípios cobertos nos hotspots e aprofundamentos (sem virar lição principal): explorar antes de agir, não mexer no teste (Goodhart), reproduzir antes de corrigir, portão humano, reset com prompt refinado, executor por tarefa, inconclusivo é resultado, avaliador complacente, teto orçamentário.

---

## 5. Aprofundamentos

### Slide 1 — `correlacao` (capítulo 5, `L ≥ 0.64`)

- **Rótulo:** Correlação · aprofundamento
- **Título:** Calibrar o verificador
- **Lead:** Prever. Medir. Comparar os mesmos pontos.
- **Metáfora (figcaption):** Nenhum túnel correlaciona 100%; nenhum avaliador de IA também. O verificador é a primeira coisa a ser verificada.
- **Seções (4 × 3):**
  1. **O verificador também erra**
     - Um teste que não reflete a realidade é pior que nenhum teste: aprova peças frágeis.
     - Sinal de verificador quebrado: o critério passa e o uso real falha (Ferrari 2020, Aston 2023).
     - Teste de controle: plante um defeito conhecido; se o crítico aprova, o crítico está quebrado.
  2. **Crítico independente**
     - Contexto separado: subagente ou sessão nova recebe só o artefato e o critério, nunca a justificativa.
     - Instrução adversária: "assuma que há um defeito; encontre-o; cite arquivo e linha".
     - Mesmo contexto que produziu tende a aprovar (viés de autopreferência): "revise seu código" não é revisão.
  3. **Dado antes de sensação**
     - Ordem do debrief: o que o instrumento mediu; depois, o que o executor sentiu.
     - Evidência: saída de comando, log, diff, número, tinta na asa. Opinião: "parece", "deve", "acredito".
     - Divergência entre executor e instrumento é sinal para investigar, não voto para desempatar.
  4. **Não mexer no teste**
     - Se o teste falha, o problema está no código, não no teste; edição em `tests/` para passar é Goodhart.
     - Consertar o verificador é legítimo quando há evidência de que ele mede errado (a anomalia do túnel) — não quando ele só incomoda.
     - Confira `git diff tests/` a cada volta; peça a explicação da causa junto com a correção.

### Slide 2 — `dossie` (capítulo 7, `L ≥ 0.64`)

- **Rótulo:** Legado · aprofundamento
- **Título:** O dossiê do upgrade
- **Lead:** Hipótese. Mudança. Instrumento. Resultado. Decisão.
- **Metáfora (figcaption):** O que a volta ensinou vira a primeira linha do próximo carro. Se não foi escrito, não existe para o próximo contexto.
- **Seções (4 × 3):**
  1. **Cinco colunas por volta**
     - Hipótese: o que se esperava e por quê (o CFD da volta).
     - Mudança e instrumento: o que mudou, onde, e com que comando ou sessão foi verificado.
     - Resultado e decisão: número medido; seguir, reverter ou parar — e o motivo.
  2. **Três saídas, nenhuma outra**
     - Critério atingido: verificação final colada, suíte inteira verde, diff pequeno, congelar.
     - Risco identificado: interface compartilhada, deleção, custo acima do teto — o loop para e uma pessoa decide.
     - Limite (inconclusivo): tentado com evidência, descartado com motivo, a decidir; nunca "quase lá".
  3. **Reset sem perder a volta**
     - Duas falhas seguidas: `/clear` com prompt que carrega erro exato, arquivos, hipótese descartada e comando de verificação.
     - Três falhas: três linhas para uma pessoa — o que tentei, o que vi, o que preciso decidir.
     - O registro é o que sobrevive ao reset; sem ele, a volta 5 repete a volta 2.
  4. **Congelar e nomear o que ainda pode mudar**
     - Depois do critério, só o "ângulo do flap": ajustes nomeados antes, seguros e reversíveis.
     - "Só mais um ajuste" não nomeado reabre o ciclo inteiro — e sem verificação vira deriva.
     - Commit por volta verificada, com mensagem que diz o que a volta testou.

---

## 6. HUD e interações

- **Pontos de capítulo → linha de fábrica.** Os `.dots` viram uma linha vertical fina de sete estações (`CFD · TÚNEL · PEÇA · PISTA · DADOS · DECISÃO · DOSSIÊ`) ligadas por um fio; a estação ativa recebe o anel giratório do hotspot; o trecho percorrido colore-se de âmbar; durante o wipe, o rótulo da próxima estação aparece à esquerda do nó (R6) e some 2 s depois. Entre as estações 6 e 1 há um fio de retorno tracejado, em ciano, que só acende no capítulo 7: o loop fecha visualmente.
- **Barra de progresso → contador de runs.** O fio de 2 px no topo continua, em âmbar; ao lado do logo, um `output` em fonte display mostra o orçamento gasto (`run 096/320 · 24 h/80 h`), proporcional ao progresso global. No capítulo 2 ele é diegético (coincide com o contador da parede); nos outros continua contando: o orçamento é da experiência inteira, não de um capítulo.
- **Registro → Dossiê do upgrade.** A gaveta mantém lista, exportação JSON e limpar; os tipos viram `hipótese | mudança | leitura | decisão`; cada capítulo grava automaticamente uma linha ao entrar (`gatilho: entrada`) com as cinco colunas do slide 2 preenchidas pela narrativa (cap. 1 "hipótese · assoalho v2 · CFD · +18 pt previstos · seguir"; cap. 6 "decisão · reverter · A/B sexta · bouncing reproduzido · último verde"). Borda esquerda ciano; a linha de decisão do cap. 6 muda conforme o aluno escolheu MANTER ou REVERTER.
- **Cenários → Correlação (capítulo 5).** Quatro botões gerados dos dados (`CFD · Túnel 60% · Pista seca · Pista com vento lateral`), `desvio` em pontos de downforce (previsto − medido), gráfico com curva prevista tracejada e medida em âmbar por setor; cada cenário escreve `ghostOffset`, amplitude de `squat` e extensão da região âmbar no `floor`. Tudo reversível e independente da câmera.
- **Decisão (capítulo 6).** Hotspot grande diegético `MANTER / REVERTER` (variante com texto dentro, R5). Estado de HUD que muda o que o carro mostra pelo resto do capítulo e a linha do registro. Padrão: reverter.
- **Hotspots.** Anel de dois arcos com arco parcial girando, ciano; 2–4 por capítulo, ancorados por `peca` aos nós do GLTF (nomes acima); tooltip com nome, texto e, quando houver, fonte em `small`. Sobrevivem à dissolução do título. Cada clique grava `leitura` no dossiê.
- **Callouts.** Linha-guia + anel + rótulo em display, subtítulo em ciano. No cap. 7, um callout por peça com a linha do dossiê — é a única cena com mais de um callout ao mesmo tempo.
- **Ficha.** Essência, três lições com numerais romanos, bloco "Fato de pista" com borda âmbar e `small` com equipe, ano e fonte.
- **Dica de scroll:** "Role para abrir o CFD"; seta de linha + ponta em âmbar.
- **O que o aluno pode mexer:** hotspots (todos os capítulos), cenários de correlação (cap. 5), decisão manter/reverter (cap. 6), gaveta do dossiê (ler, exportar, limpar), navegação por estações e menu, deep link por `#slug`. Reduced-motion: câmera fixa, carro troca de estado por cross-fade, HUD inteiro funcional. Sem WebGL: os sete capítulos e os dois slides em texto corrido, com o quadro de não repetição como sumário.

---

## 7. Paleta e tipografia

Base herdada de `gramatica-visual.md` §2.1, com as escolhas deste tratamento: **o calor migra**. Ciano é previsão; âmbar é medida. O carro começa ciano (cap. 1), ganha a primeira luz âmbar no fim do cap. 2, recebe o verde da evidência no cap. 4, pulsa âmbar onde a medida contradiz a previsão (cap. 5), e termina como nuvem âmbar (cap. 7). O verde `#4dffb0` é reservado para "último estado verde" e para o flow-vis; o roxo de setor não é usado — o "critério atingido" aqui é o flash de fotógrafos, uma vez.

| Papel | Hex | Uso neste tratamento |
|---|---|---|
| Asfalto noturno (base) | `#07090c` | caps. 1 e 7 (sala de simulação), fundo de todos os wipes |
| Aço frio | `#0a1218` | cap. 2, túnel |
| Grafite de boxes | `#0c0f13` | cap. 3, garagem-fábrica |
| Breu de pit lane | `#080a0e` | cap. 4, FP1 à noite |
| Preto-vinho | `#0c0a0d` | cap. 5, sala de correlação |
| Cinza-tempestade | `#0d1216` | cap. 6, Silverstone sob céu de chumbo |
| Âmbar incandescente | `#ff8a2a` | medida: contador de runs, lâmpada de trabalho, região de divergência, contorno da peça que sai, nuvem final |
| Brasa de freio | `#ff3b1a` | disco de freio na onboard, extremo do mapa de pressão |
| Ciano de telemetria | `#38e8ff` | previsão: nuvem de CFD, fantasma, streamlines, ribbons, hotspots, fita de parc fermé |
| Verde de último estado | `#4dffb0` | flow-vis sob UV, contorno da peça que volta, prateleira |
| Amarelo de bandeira | `#ffd23f` | bandeira amarela do cap. 6, callout de retrabalho |
| Magenta de monitor | `#ff3d8a` | só o cap. 5 (um dos três monitores) |
| Marfim de pit wall | `#ebe6dc` | texto; flash de fotógrafos |
| Cinza de fita de carbono | `#8a9099` | rótulos, peça arquivada na prateleira |
| Carbono nu | `#15171a` / `#3b3f45` | assoalho, asas, chassi (sarjado procedural, clearcoat 1,0) |
| Pintura do carro | `#0f3a47` / `#2c7a8c` | livery própria da aula em azul-petróleo metálico; stickers FIA/F1/Pirelli do `.blend` substituídos por "LOOP 26" e logotipo INTEIA |

Materiais: fibra de carbono com sarjado procedural e clearcoat (assoalho é a estrela: é a peça que a câmera mais aproxima); pintura com flakes por `clearcoatNormal` e `iridescence 0.15`; borracha com sheen; disco de freio com rampa de corpo negro; ghost = material aditivo ciano a 25% na mesma geometria; mapa de pressão e flow-vis = máscaras emissivas procedurais no `floor` (nenhuma textura extra). Regra R10 sempre: sujeito quente, mundo frio — exceto o cap. 1, frio inteiro por decisão (a hipótese não tem calor), e o cap. 5, onde o calor está só no dado.

Tipografia: Bebas Neue para títulos 3D (troika, caixa alta, tracking 0,01, 2–3 linhas ≤ 16 caracteres, só caracteres pré-carregados — os sete títulos acima usam apenas A–Z, acentos ÁÉÍÓÚÂÊÔÃÕÇ, dígitos e `.`), Lato para corpo e ficha, rótulos pequenos em caixa alta com tracking `.22em`, números do contador e do desvio em `tabular-nums`. Título metálico (R3): material `MeshStandardMaterial` com o envMap do ambiente quando cheio; dissolução em ≈3.000 pontos amostrados do canvas, sempre na direção em que a câmera vai partir (ou, quando a câmera fica, na direção do fluxo/da gravidade do capítulo).

---

## 8. Riscos e o que é caro de fazer

**Estrutura e motor**
- **Sete capítulos.** `N = 6` está hardcoded em `Scroll.PESOS`, `cameraPath` (clamp 0..5), `Director.switch`, `Registro.FASES`, `Callouts.ROTULOS`, `ui.js` e `tests/narrativa.test.js`. Pesos sugeridos: `[2.8, 3.4, 3.6, 3.6, 5.0, 3.8, 5.0]`. Os índices com semântica fixa (cenários no 4, aprofundamento no 4 e 5, registro no 5) precisam virar dados (`aprofundamento`, `cenarios`, `registro` no schema v2) — os aprofundamentos aqui estão nos índices 4 e 6.
- **Vista estável.** O teste atual exige `pose(0.5) === pose(0.7)`; este tratamento mantém a câmera parada de `0.18` a `0.72` e concentra a transformação no carro. Os movimentos de respiro ficam em `0.72–0.86`. Se a fase de código quiser mais câmera, o teste precisa ser reescrito com janelas por capítulo.
- **Limites de câmera.** Poses citadas respeitam `z ∈ [6.4, 7.82]` e `|x| ≤ 1.2`; o carro de 5,6 u é mais longo que o relógio, então FOV ou `dolly` na pose deve entrar no schema (a pesquisa de arquitetura já sugere). A onboard do cap. 4 (T-cam, FOV 70°) é a maior exceção: se não couber nos limites, cai para um 3/4 traseiro alto com a pista rolando.
- **Escala 60% no cap. 2.** Conflita com o contrato de layout (escala clamp 0,46–0,84 relativa à coluna de texto). Implementar como escala interna do grupo do carro (`carScale`), independente da escala de layout; se o efeito confundir, manter o carro em escala 1 e encolher o túnel (esteira e rims mais próximos).

**Cena e efeitos**
- **Duas instâncias de assoalho e uma prateleira persistentes.** `floor@velho` e a prateleira atravessam os caps. 3–7 e mudam de lugar (garagem → pit lane → parc fermé). Precisam ser objetos de cena com estado próprio por capítulo, escritos pelo Director como qualquer outro estado, e reversíveis (a prateleira em `L` do cap. 6 precisa saber onde estava no cap. 5).
- **Carro-gêmeo (A/B) em dois capítulos (4 e 6).** Dobra geometria visível (mesma `BufferGeometry`, sem custo de GPU extra, mas ≈2× draw calls). Em mobile e retrato vira `ghost` sobreposto, como a gramática já prevê; a órbita A/B do cap. 6 reduzida a 40° para caber nos limites.
- **Ghost + carro real + ribbons + rack focus (cap. 5).** É o capítulo mais carregado: ghost aditivo, oscilação de `squat`, mapa de pressão emissivo, ribbons e DOF com range curto. Respeitar a regra "no máximo dois efeitos caros por capítulo": aqui são DOF curto e ribbons; o ghost e o mapa são baratos. Sem reflexo planar.
- **Bouncing reversível.** A oscilação é `sin(L·k)` modulada por janela, não `sin(t)`. Ao rolar para trás, o carro oscila ao contrário — aceitável e até correto. Em reduced-motion, o bouncing vira um deslocamento fixo do fantasma (cross-fade), sem oscilar.
- **Laminação por camadas (cap. 3).** Seis planos de recorte no `floor` v2 sobre o molde: `clippingPlanes` do three.js ou `uProgress` no shader do sarjado (mais barato e sem `localClippingEnabled`). O molde é um plano com normal map; o brilho do autoclave é um plano emissivo. Nada de simular tecido.
- **Reflexo planar (cap. 3) e reflexo do asfalto úmido (cap. 6).** Um reflexo por capítulo, a 0,35 de resolução, borrado pela roughness; desligado em mobile.
- **Flow-vis, mapa de pressão, rake.** Máscaras emissivas procedurais e uma grade instanciada de 60 hastes: custo próximo de zero. O risco é estético (o flow-vis precisa parecer tinta escorrida, não gradiente): estrias por UV × ruído alongado com bordas irregulares, revelação por `uFlowVis`.
- **Nuvem de 12.000 pontos (caps. 1 e 7).** Um `Points` com posições amostradas do GLTF no carregamento e dois conjuntos de `home` (carro inteiro; só assoalho ampliado). Cor por uniform (ciano ↔ âmbar). Um draw call; barato. O risco é o carregamento: amostrar 12.000 vértices exige o GLTF decodificado antes do primeiro quadro — o preloader já bloqueia até isso.
- **Bandeiras e fita de parc fermé.** Planos com vento por vertex shader e plano emissivo: baratos.
- **Contador de runs na parede (cap. 2) e no HUD.** Plano emissivo com canvas texture (como o `Plate.js`) mais um `output` DOM; sincronizados com `L` global.

**Assets e licença**
- **Modelo Blender do autor.** As peças já vêm separadas e nomeadas (a coreografia usa esses nomes diretamente), mas: materiais procedurais do Blender (fibra de carbono) não exportam para glTF e precisam de bake; a contagem de polígonos é desconhecida (meta ≤ 250k tris desktop / ≤ 80k mobile, glTF Draco + KTX2, ≤ 6 MB / ≤ 3 MB); dependências externas (imperfeições, HDRI do BlenderKit) podem faltar; e a **licença dos project files do tutorial não foi localizada** — confirmar antes de publicar, ou re-modelar detalhes para tornar o modelo autoral.
- **Stickers de terceiros** (FIA, F1, "2026 Regulations", Pirelli P Zero) nas texturas `texture_main_stickers.png`, `pzero_white.png`, `f1_fia_logo.png`: substituir pela identidade da aula. Teste automático de ausência de marcas em nomes de nós, materiais e texturas.
- **Peças internas.** Este tratamento **não precisa** de motor, câmbio ou radiadores modelados: a explosão do cap. 3 é parcial e vertical (carroceria sobe, assoalho troca), e a constelação dos caps. 1 e 7 usa vértices, não peças internas. Isso elimina o maior risco apontado pela pesquisa de modelos.
- **Sem vídeo, sem mecânicos, sem pista inteira.** Silhuetas para pistolas e macacos (planos com alpha), 40 u de asfalto com UV animado e postes instanciados, pit wall como plano. Fotos de ambiente (`Plate.js`) só desfocadas.

**Conteúdo**
- **Fatos.** Todos os fatos citados têm número na tabela-mestra de `f1-licoes.md` (#3, #4, #5, #7, #8, #9, #10, #15, #17, #20, #23, #24, #25, #26, #27, #28). Nenhum item marcado [NÃO CONFIRMADO] foi usado. O caso Racing Bulls Spa 2026 (#7) é usado só em hotspot; o "Aston 2023" traz a citação de Krack como está na fonte. Os números do cenário de correlação (pontos de downforce, −4/−11/−19) são **ilustrativos** e devem ser rotulados assim nos créditos ("fatos verificáveis; dados de telemetria ilustrativos").
- **Bouncing "reproduzido nos dois carros" (cap. 6).** A fonte diz que a Ferrari reverteu os dois carros após a sexta; não afirma A/B formal com um carro em cada spec em Silverstone. A cena mostra os dois com a peça nova oscilando, o que é compatível com a fonte; não afirmar no texto que houve A/B em Silverstone.
- **Títulos.** Todos com 2–3 linhas, ≤ 16 caracteres por linha, sem `?`, `!`, travessão ou aspas; "DOSSIÊ" evitado no título por prudência de rasterização, mantido em corpo e HUD (Lato).
