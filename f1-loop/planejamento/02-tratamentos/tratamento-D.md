# Tratamento D — "BOX, BOX."

Ângulo deste tratamento: **o pit stop como microcosmo e a noite da garagem.** Começa no caos de um carro parado às três da manhã, peças no chão; cada capítulo é uma decisão dos engenheiros; o clímax é um pit stop de 1,80 s em que cada pessoa tem uma tarefa e um critério; termina com o carro cruzando a linha ao amanhecer. Foco em pessoas, ritmo e disciplina.

Fontes: `00-briefing.md` (contrato), `01-pesquisa/engenharia-de-loop.md` (princípios, progressão pedagógica), `01-pesquisa/f1-licoes.md` (todos os fatos de F1 citados aqui têm linha nessa tabela; nada de item [NÃO CONFIRMADO]), `01-pesquisa/gramatica-visual.md` (regras R1–R12, movimentos de câmera 1–10, catálogo de estados, transições 1–6), `01-pesquisa/arquitetura-atual.md` (janelas de progresso local, limites, schema v2), `01-pesquisa/modelos-3d-f1.md` e `assets-locais-f1-2026.md` (peças nomeadas do modelo).

Convenções: `L` = progresso local do capítulo (0..1). Toda animação é função de `L`, reversível, sem tempo em segundos. Cada capítulo começa exatamente na pose final do anterior e gasta `L < 0.18` em órbita de transição. Janelas herdadas do motor: título entra 0.08–0.24 e sai 0.40–0.50; ficha 0.50–0.62 até 0.88–0.98 (capítulos com aprofundamento: ficha 0.36–0.63, slide a partir de `L ≈ 0.64` — Parada usa 0.72 para deixar o pit stop terminar, Amanhecer usa 0.62); wipe de saída em 0.86–1.00. A câmera fica **estacionária entre 0.50 e 0.86** em todo capítulo (é a janela de leitura); os movimentos vivem entre 0.18 e 0.50 e no chicote final.

---

## 1. Título e logline

**Título:** BOX, BOX.

**Logline:** Às três da manhã um carro de Fórmula 1 está em pedaços no chão da garagem; até o sol nascer, uma equipe o devolve à pista uma decisão verificada por vez, e um pit stop de 1,80 s revela o loop inteiro em um único gesto: cada pessoa uma tarefa, cada tarefa um critério, e o cronômetro decidindo.

Por que "BOX, BOX.": é a chamada de rádio que manda o carro parar. Na aula, é a ordem que o aluno aprende a dar a si mesmo — parar a volta, medir, decidir. O título tem dois estados na tela: contorno (a ordem ainda não foi dada) e cheio (foi).

---

## 2. Tese pedagógica

O aluno sai sabendo **fechar uma volta com IA sem se enganar**. Em termos operacionais, amanhã ele faz sete coisas que hoje não faz:

1. Antes de pedir a correção, **reproduz a falha** e escreve o critério em uma frase que um comando julga (cap. Madrugada).
2. Pede **uma mudança por volta**, exige a saída do comando colada e recusa "deve funcionar" (cap. Turno).
3. Manda o diff para um **crítico sem contexto** (subagente ou sessão nova) com a instrução "assuma que há um defeito" e proíbe editar testes (cap. Tinta).
4. Quando o teste novo passa e um antigo quebra, **reverte ao último verde** antes de corrigir e procura a causa, não o sintoma (cap. Retorno).
5. Declara o **teto de voltas** antes de começar; na segunda falha seguida dá `/clear` com prompt refinado; na terceira para e pergunta (cap. Limite).
6. Só declara "pronto" quando **todas as verificações chegaram**; se uma falta, segura a entrega e devolve a decisão a uma pessoa (cap. Parada).
7. Deixa um **registro de volta** de cinco colunas que sobrevive ao reset e é a entrada do próximo turno (cap. Amanhecer).

A metáfora é honesta nos dois sentidos: o pit stop de 1,80 s não "melhora" o carro — executa o planejado, com um dono por parafuso e um cronômetro; é exatamente o que uma volta de loop bem feita é. E a noite da garagem é o que acontece quando não há número: ninguém pode decidir nada.

---

## 3. Arco em três atos

**O que está em jogo:** o carro precisa estar na pista quando o sol nascer. São 03:12. Não há número nenhum — só peças, cansaço e opinião.

**Ato I — A noite (Madrugada, Turno).** O carro está em pedaços porque foi otimizado para o verificador, não para a pista (Ferrari 2020). A primeira decisão da equipe não é consertar: é decidir contra o que medir. O ato termina com o simulador fechando o ciclo de madrugada — a primeira volta pequena que fecha com um número. Tensão: cada hora sem referência é uma hora perdida.

**Ato II — A prova (Tinta, Retorno, Limite).** Amanhece azul. O carro vai à pista para ser julgado por quem não o fez (a tinta de flow-vis não tem opinião). A melhora traz uma regressão (mais asa, mais salto) e a equipe reverte ao último verde antes de corrigir. Depois vem o limite: dezoito voltas, nem uma a mais — o teto escrito antes da falha. Tensão: a tentação permanente de "só mais uma volta" e de acreditar no resultado bonito.

**Ato III — O gesto (Parada, Amanhecer).** O pit stop de 1,80 s é o loop inteiro em uma respiração: vinte pessoas, um critério cada, e a luz verde que só abre quando os quatro sinais chegam. O carro sai, dá a volta ao sol nascendo e cruza a linha às 06:31. Resolução: a mesma peça que estava no chão às três agora tem um número, uma fonte e uma decisão.

**Como a última cena responde à primeira:** a abertura é "Três da manhã. Peças no chão. Nenhum número." O encerramento, ao cruzar a linha, acende por um instante uma etiqueta numerada em cada uma das mesmas trinta peças — o carro inteiro, cada peça verificada. O relógio da garagem que marcava 03:12 marca 06:31. O que mudou entre as duas imagens não foi o carro; foi que cada decisão passou a ter um registro.

Linha do tempo (o relógio de parede é elemento do HUD, ver seção 6): Madrugada 03:12 · Turno 04:10 · Tinta 05:05 · Retorno 05:30 · Limite 05:50 · Parada 06:05 · Amanhecer 06:31.

---

## 4. Capítulos

Sete capítulos (índices 0–6). Cada um ensina três princípios diferentes dos outros; os 21 termos não se repetem. O mundo é um só (R1): a garagem, sua baia de setup, o pit lane à frente, a reta principal e a linha de chegada. O carro fica sempre na origem; quando "corre", o mundo passa por ele (trecho de 40 u de asfalto com UV animado, postes instanciados). A luz do céu é função do progresso global: breu → cobalto → laranja → sol.

Lista fechada de peças nomeadas (nós do GLTF, a partir do modelo F1 2026 local + peças procedurais): `asa-dianteira` (front_wing_bottom/middle/top/side_plates/mount), `bico`, `asa-traseira`, `drs`, `assoalho` (floor), `carroceria` (main_body), `tampa-motor`, `espelhos`, `antenas`, `escape`, `roda-DE`, `roda-DD`, `roda-TE`, `roda-TD` (tire + wheel_cover + inside_cover), `suspensao-D` (front_control_arms + front_pushrod), `suspensao-T` (rear_control_arms + rear_driveshaft), `volante` (steering_wheel_*), `display` (lcd_screen), `led-traseiro` (rear_led). Procedurais (não existem no modelo): `disco-freio-DE/DD/TE/TD`, `pinca`, `prancha` (skid block), `rake-aero`, `macaco-D`, `macaco-T`, `pistola` ×4, `pit-board`, `bandeira`, `semaforo`.

---

### Capítulo 0 — Madrugada

- **id:** `madrugada` · **nome:** Madrugada · **relógio:** 03:12
- **título:**
  ```
  TRÊS DA MANHÃ.
  PEÇAS NO CHÃO.
  NENHUM NÚMERO.
  ```
- **corpo:** Antes de tocar em qualquer peça, a equipe decide contra o que vai medir.
- **essência:** Reproduza a falha e escreva o critério antes da primeira volta.
- **lições:**
  - **Referência real** — Compare com a volta que falhou, não com a opinião de quem vai corrigir.
  - **Critério verificável** — Uma frase que um comando julga verdadeiro ou falso: `npm test` verde.
  - **Tarefa delimitada** — Diga o que entra, o que fica de fora e o que é proibido tocar.
- **lição F1:** **Ferrari SF1000, 2020** — Binotto admitiu uma descorrelação entre projeto e pista: o carro empurrado para o máximo de downforce no túnel era "frágil em robustez aero" na pista, e a revisão grande só chegou no GP da Hungria. Otimizar para o verificador, não para a realidade, é o que põe um carro no chão. (f1-licoes #24, Autosport.)
- **ambiente 3D:** garagem fechada. Piso epóxi cinza com reflexo borrado. LEDs do teto apagados. Uma única lâmpada de trabalho âmbar no chão, à esquerda, iluminando de raspão; ao fundo, o chassi nu no cavalete de setup; um monitor apagado no carrinho de ferramentas. Poeira densa no feixe. Grão 0,12, vinheta forte. Temperatura: frio de breu com uma ilha âmbar.
- **estado do carro:** *início* — `explode = 1` + estado novo `floor = 1` (as peças explodidas caem ao plano do piso, deitadas e giradas ao acaso; o chassi fica no cavalete). Disposição no chão, da lente para o fundo: as quatro rodas (`front_tire`/`rear_tire` com `wheel_cover`) encostadas de pé na parede à esquerda; `front_wing_bottom`, `front_wing_middle` e `front_wing_top` separados em leque no primeiro plano, como três lâminas; `front_wing_side_plates` de lado; `rear_wing_main_part` e `rear_wing_drs` com o `drs_mechanism` solto ao lado; `floor` deitado como uma prancha de surfe; `front_control_arms`, `front_pushrod` e `rear_control_arms` em pilha; `steering_wheel_main` sobre o carrinho de ferramentas com o `lcd_screen` apagado. O carro não existe; existe um inventário. *fim* — `floor = 0`, `scatter = 1` (as peças sobem e ficam suspensas em constelação de diagnóstico ao redor do chassi, ligadas por linhas; cada uma com etiqueta), LEDs acesos, monitor ligado com o traço da volta que falhou.
- **câmera (capítulo 0, sem órbita de entrada; título 0.02–0.20):**
  - `0.00–0.14` macro no chão: o disco de freio dianteiro direito ainda morno em primeiro plano (`brakeHeat 0.15 → 0`), uma porca de roda ao lado. `worldFocusRange 0.4`, bokeh 3.4. O aluno não sabe ainda que é um carro.
  - `0.14–0.42` dolly baixo (y 0.3 u) atravessando o campo de peças em direção ao chassi (movimento 1 adaptado ao chão); o título entra sobre o dolly e sai em 0.40–0.50 dissolvendo em partículas na direção do avanço (R3).
  - `0.42–0.50` crane sobe a 1.6 u e trava em 3/4 dianteiro a 7.0 u; as três fileiras de LED acendem em `L` 0.40, 0.45 e 0.50 (intensidade `ease(seg)` por fileira), o azul do monitor entra em 0.55.
  - `0.50–0.86` pose estável (ficha). As peças sobem do chão em 0.50–0.70 (`floor 1 → 0`, `scatter 0 → 1`) e a constelação liga peça a peça em 0.60–0.86.
  - `0.86–1.00` chicote lateral de 30° para a direita e wipe.
- **efeitos e partículas:** poeira ambiente densa (densidade 1.2) no feixe da lâmpada; brasa residual do disco (30 partículas subindo devagar, 0–0.14); callouts por peça em foco (0.30–0.42 entra: "asa dianteira · quebrou na volta 31"); `reference` no monitor (0.55+): o traço de velocidade da volta 31 com a curva 9 marcada, a referência real; `constellation` (0.60–0.86); hotspots (0.35–0.60 entra / 0.82–0.95 sai).
- **hotspots:**
  1. **Disco de freio** (`disco-freio-DD`) — "Ainda morno: o último dado real da noite. Reproduzir a falha é a primeira volta, não a correção."
  2. **Display do volante** (`display`) — "A volta 31 no traço: 0,4 s perdidos na curva 9. Sem este traço, qualquer conserto é opinião. (Dados de telemetria ilustrativos.)"
  3. **Assoalho** (`assoalho`) — "Quadro de tarefas: assoalho dentro, asa traseira fora, suspensão proibida. O que não está escrito não entra na volta."
  4. **Etiqueta da asa dianteira** (`asa-dianteira`) — "Critério: cinco voltas sem oscilação acima do limite. Uma frase que o cronômetro julga."
- **imagem-chave:** Uma lâmpada de trabalho no chão ilumina de raspão trinta peças de carbono espalhadas pelo epóxi; ao fundo, o chassi nu no cavalete, e o único brilho frio da garagem é o display do volante com o traço da volta que falhou.
- **transição de saída:** wipe diagonal padrão (−20°, borda fbm, sobre a cena inteira), motivado pelo chicote; do outro lado da diagonal já se vê o ciano do simulador. Rótulo "TURNO" aparece junto ao ponto ativo durante a varredura. Pose final = 3/4 dianteiro a 7.0 u, altura 1.6 u, é a pose inicial do capítulo 1.
- **emoção:** desorientação que vira calma no instante em que aparece o primeiro número.

---

### Capítulo 1 — Turno

- **id:** `turno` · **nome:** Turno · **relógio:** 04:10
- **título:**
  ```
  QUATRO E DEZ.
  O SIMULADOR
  NÃO DORME.
  ```
- **corpo:** Uma volta fecha quando a mudança foi feita, criticada e medida.
- **essência:** Produza, critique, mude uma coisa e leia o número antes de aceitar.
- **lições:**
  - **Produzir e criticar** — Gere a versão e pergunte onde ela falha antes de perguntar se está boa.
  - **Revisar o necessário** — Uma variável por volta; reescrever tudo apaga o que já estava certo.
  - **Verificar o resultado** — A volta só conta com a saída do comando lida; "deve funcionar" não fecha nada.
- **lição F1:** **Mercedes, simulador de madrugada** — Na sexta-feira de GP, a equipe de simulador em Brackley trabalha no fuso da pista, muitas vezes de madrugada no Reino Unido: testa mudanças de setup com os dados de FP1 e FP2 em pistas escaneadas a lidar e devolve recomendações antes do FP3, com o loop fechado pela correlação com os dados de pista. (f1-licoes #6, mercedesamgf1.com.)
- **ambiente 3D:** a baia de setup da mesma garagem, agora com os LEDs acesos (5.600 K, contraste baixo) e o monitor ciano dominando o lado direito. O carro sobre a plataforma de setup, sem rodas; as quatro rodas no cavalete ao lado. Um "carro fantasma" ciano — a volta do simulador — sobreposto ao real. Poeira fina. Temperatura: frio neutro com key âmbar de uma lâmpada de trabalho na traseira.
- **estado do carro:** *início* — peças em constelação (`scatter = 1`). *fim* — carro montado (`explode = 0`, `scatter = 0`) sobre a plataforma, `wheelsOn = 0` (rodas ao lado), `ghost = 1` com `ghostOffset` = +0.3 u (o fantasma meio corpo à frente: a volta do simulador ficou 0,08 s mais rápida), três fitas de telemetria atravessando o cockpit.
- **câmera:**
  - `0.00–0.18` órbita de transição: da 3/4 dianteira gira para 3/4 traseira a 6.8 u, altura 1.2 u.
  - `0.18–0.50` travelling lateral lento de trás para a frente a 4.8 u (movimento 7, sem túnel) enquanto as peças voltam da constelação para o carro na ordem de montagem (`explode 1 → 0` em 0.18–0.45, `scatter 1 → 0` em 0.18–0.30). Ordem de montagem (`assemblyOrder`, escalonada dentro de 0.18–0.45): `floor` assenta no chassi → `main_body` e `main_body_inside` fecham por cima → `top_intake_details`, `exhaust`, `side_mirrors`, `antennas` → `front_control_arms` e `front_pushrod`, depois `rear_control_arms` e `rear_driveshaft` → asa dianteira em camadas, de baixo para cima (`front_wing_mount`, `front_wing_bottom`, `front_wing_middle`, `front_wing_top`, `front_wing_side_plates`, `front_flap_detail`) → asa traseira (`rear_wing_holder`, `rear_wing_bottom_holder`, `rear_wing_main_part`, `rear_wing_side`, `rear_wing_top_mount`, `drs_holder`, `drs_mechanism`, `rear_wing_drs`, `rear_led`) → por último o cockpit (`steering_wheel_main`, `steering_wheel_handles`, `steering_wheel_buttons`, `steering_wheel_leds`, `lcd_screen` acendendo em ciano no encaixe). As rodas ficam de fora de propósito: entram só no capítulo 2. O título entra em 0.08 (ainda na órbita) e sai em 0.40–0.50 virando metal escovado antes de dissolver.
  - `0.50–0.86` estável 3/4 traseiro a 6.8 u. Aqui acontecem as três "voltas" do turno, uma por faixa de `L`: 0.50–0.62, 0.62–0.74, 0.74–0.86. Em cada faixa: uma peça pisca em âmbar (a variável mudada), as fitas de telemetria se redesenham (`uProgress` da frente para trás), e o fantasma ciano avança ou recua (`ghostOffset` −0.1 → +0.1 → +0.3). Rack focus (movimento 6) em 0.62–0.80: o foco sai do carbono e cai na fita âmbar do freio — o olhar deixa a sensação e vai ao dado.
  - `0.86–1.00` chicote para a esquerda e transição.
- **efeitos e partículas:** `constellation` apagando conforme monta; `ghost` (0.40–0.86); `telemetry` (três ribbons: velocidade ciano, freio âmbar, delta em cor de setor; `depthTest false`, atravessam o carro); callouts por volta ("asa dianteira +1 · −0,08 s", "freio: pressão −2% · +0,03 s", "asa dianteira +1 mantida · −0,08 s"); poeira ambiente 0.6; hotspots.
- **hotspots:**
  1. **Asa dianteira** (`asa-dianteira`) — "Volta 1 do turno: ângulo +1. Só isso. O fantasma avança 0,08 s. Se tivéssemos mudado três coisas, não saberíamos qual delas foi."
  2. **Suspensão dianteira** (`suspensao-D`) — "Crítica: onde falha? A frenagem da curva 9 ainda trava. A resposta é o que falta, não o que está bom."
  3. **Display do volante** (`display`) — "Verificação: o delta lido, não estimado. Sem este número, a volta não aconteceu."
  4. **Carro fantasma** (`carroceria`, instância ghost) — "O simulador é a volta barata. Só vale se correlacionar com a pista; se não correlaciona, é ruído com aparência de dado."
- **imagem-chave:** O carro montado e sem rodas sobre a plataforma; sobre ele, um carro fantasma ciano meio corpo à frente, e três fitas de luz atravessando o cockpit — o foco abandona o carbono e cai na fita âmbar do freio.
- **transição de saída:** wipe motivado por objeto (tipo 2): a porta do box sobe em primeiro plano desfocado (plano simples, 8% de `L`), e atrás dela o pit lane em azul-cobalto de 05:05, holofotes dos boxes ainda acesos. As rodas rolam do cavalete para o carro já do outro lado da porta. Pose final: 3/4 traseiro a 6.8 u = pose inicial do capítulo 2.
- **emoção:** hipnose de turno; o ritmo de quem repete o gesto com atenção; a primeira vitória pequena.

---

### Capítulo 2 — Tinta

- **id:** `tinta` · **nome:** Tinta · **relógio:** 05:05
- **título:**
  ```
  A TINTA
  NÃO TEM
  OPINIÃO.
  ```
- **corpo:** Outro engenheiro, sem o histórico, procura o defeito e confere a prova.
- **essência:** Entregue ao crítico só a peça e o critério, e exija a evidência.
- **lições:**
  - **Crítico independente** — Contexto limpo: subagente ou sessão nova, sem a justificativa de quem produziu.
  - **Evidência conferida** — Um verificador que não reflete a realidade é pior que nenhum: calibre o sensor na pista.
  - **Não mexer no teste** — Teste falha, o problema é o código; afrouxar a asserção é trapacear o critério.
- **lição F1:** **Flow-vis e correlação** — Rob Smedley: "nenhum túnel de vento correlaciona 100%". Por isso as equipes pintam flow-vis (tinta fluorescente que mostra a direção real do fluxo) nas asas e montam rakes aero com sondas atrás das rodas nos testes e no FP1, medindo na pista os mesmos pontos do túnel para saber se o verificador merece confiança. (f1-licoes #4 e #22, F1.com e Motorsport.com.)
- **ambiente 3D:** pit lane, primeira luz. Céu cobalto (`#1b2f4a`) baixo; holofotes de sódio dos boxes ainda acesos em âmbar vindo de cima-atrás a 45° (silhueta com borda dourada); asfalto com orvalho (`roughness 0.3`) devolvendo o âmbar em listras. O rake aero montado atrás da roda dianteira esquerda. Temperatura: azul dominante com key âmbar.
- **estado do carro:** *início* — montado, rodas entrando (`wheelsOn 0 → 1` em 0.18–0.30, as quatro rodas rolam para os cubos). *fim* — carro parado no pit lane, coberto de estrias de flow-vis verde sob luz UV (`flowVis = 1`), rake aero acoplado, streamlines ciano passando por ele (`tunnel = 1`, aqui como "o ar da pista passa"), e um segundo carro (`ab = 1`) ao lado com a asa dianteira antiga — o baseline.
- **câmera:**
  - `0.00–0.18` órbita: sai por baixo da porta e assenta em 3/4 dianteiro a 6.6 u.
  - `0.18–0.34` push-in macro na asa dianteira (movimento 5 adaptado): de 3 u a 0.6 u do bordo de ataque, foco 0.5, enquanto a tinta é aplicada (`flowVisPaint 0 → 1`: uma camada opaca verde-amarela cobre a asa do bordo de ataque ao de fuga, pincelada por pincelada em máscara UV). O título entra durante o push-in.
  - `0.34–0.50` recuo até a perpendicular exata a 4.5 u, altura 0.9 u (movimento 7). Os rims ciano "UV" sobem; as streamlines começam a passar. O carro não se move: o mundo o testa.
  - `0.50–0.86` estável perpendicular. As estrias de flow-vis são reveladas do bordo de ataque ao de fuga (`flowVis 0 → 1` em 0.50–0.70): a tinta mostra para onde o ar foi. O carro B entra deslizando da direita (`ab 0 → 1` em 0.56–0.66) com a asa antiga contornada em âmbar (`swapSet = [asa-dianteira]` no B).
  - `0.86–1.00` a câmera avança para dentro da fumaça.
- **efeitos e partículas:** `flowVis` (pintura 0.18–0.34, revelação 0.50–0.70); rims ciano (0.36+); `tunnel` ribbons de streamline (40 linhas, 0.36–0.86) mais 3 ribbons brancas de fumaça de traçado; `ab` (0.56–0.86) com `swap` na asa do B; callout "rake aero · 64 sondas Kiel"; poeira; hotspots. Máximo de dois efeitos caros: streamlines + orvalho refletindo (sem haze, sem spray).
- **hotspots:**
  1. **Asa dianteira, carro A** (`asa-dianteira`) — "As estrias dizem para onde o ar foi, não para onde o projetista queria. A tinta não conhece a justificativa: é o crítico."
  2. **Rake aero** (`rake-aero`) — "Sondas atrás da roda medem os mesmos pontos do túnel. Se não bate, quem está errado é o verificador, não a pista."
  3. **Asa dianteira, carro B** (`asa-dianteira`, instância B) — "Mesma pista, mesma hora, peça antiga: o baseline. Sem ele, 'melhorou' é opinião. (Racing Bulls, Spa 2026: só um jogo de peças; quem classificou na frente em Silverstone levou o upgrade.)"
  4. **Assoalho** (`assoalho`) — "Regra: a tinta não se limpa para o resultado parecer bonito. Não se edita o teste para ele passar."
- **imagem-chave:** Dois carros lado a lado no pit lane azul de cinco da manhã; um deles listrado de tinta verde fluorescente que escorre do bico à asa traseira sob luz ultravioleta, enquanto fios de fumaça ciano passam por ele parado.
- **transição de saída:** passagem de fumaça (tipo 4): as ribbons brancas engrossam e sobem até cobrir o quadro (alpha 0.9) em 0.86–0.94; atrás, o mundo já é a curva rápida da pista cinza de 05:30 e o carro já está em movimento; a fumaça dissipa em 0.94–1.00. Pose final: perpendicular a 4.5 u, altura 0.9 u = pose inicial do capítulo 3.
- **emoção:** exposição; a peça sob o olhar de quem não a fez, e o alívio de que a tinta não mente.

---

### Capítulo 3 — Retorno

- **id:** `retorno` · **nome:** Retorno · **relógio:** 05:30
- **título:**
  ```
  MAIS ASA.
  MAIS SALTO.
  VOLTA AO VERDE.
  ```
- **corpo:** Se a volta quebrou o que já funcionava, reverta antes de corrigir.
- **essência:** Rode a suíte inteira; se o antigo quebrou, volte ao último verde e ache a causa.
- **lições:**
  - **Reverter regressões** — Voltar ao último estado verificado é uma volta, não uma derrota: `git revert`.
  - **Suíte inteira** — Verifique tudo o que já passava, não só o teste da volta; regressão é silenciosa.
  - **Causa raiz** — Corrigir o sintoma faz o teste passar e o erro voltar com outra cara.
- **lição F1:** **Ferrari SF-24, Silverstone 2024** — O piso novo de Barcelona deu mais downforce e induziu bouncing em curvas rápidas; em Silverstone, após os treinos de sexta, a Ferrari voltou ao piso e à carroceria anteriores nos dois carros ("não é mais rápido, mas é mais dirigível", Sainz), identificou uma anomalia no túnel de vento e só trouxe a versão corrigida em Monza, onde Leclerc venceu. (f1-licoes #27, The Race, Motorsport.com, F1.com.)
- **ambiente 3D:** pista, curva rápida. Trecho de 40 u de asfalto rolando sob o carro, guard-rail e postes instanciados que se teleportam à frente, névoa `#0d1216` a 30 u. Céu cinza-azulado de antes do sol (luz ambiente `#4a5c6e`, sem key dura, sem sombras duras). O contraste vem das faíscas. Temperatura: a cena mais fria da experiência.
- **estado do carro:** *início* — em movimento (`speed = 0.7`), assoalho novo destacado (`swap = 1`, `swapSet = [assoalho]`, contorno âmbar), suspensão oscilando (`squat = sin(L · 28) · amp`, com `amp` subindo de 0 a 1 em 0.18–0.40 — função de `L`, reversível), faíscas fortes. *fim* — assoalho antigo de volta, oscilação zero, carro assentado em velocidade, faíscas raras; o assoalho rejeitado flutua ao lado em constelação com a etiqueta "anomalia do túnel".
- **câmera:**
  - `0.00–0.18` órbita: da perpendicular sobe para a posição da T-cam.
  - `0.18–0.40` onboard (movimento 8): FOV 70°, olhando à frente; o horizonte sobe e desce com o bouncing (a oscilação do carro é a oscilação do quadro); postes passam. O título entra sobre a pista rolando e sai em 0.40–0.50.
  - `0.40–0.50` desce em arco para lateral baixa a 0.45 u do chão, 1.2 u ao lado (movimento 1, de nariz a asa traseira), mostrando a prancha raspar o asfalto a cada oscilação.
  - `0.50–0.86` estável 3/4 traseiro baixo a 6.6 u. A troca acontece em 0.58–0.70: o assoalho novo escurece 40%, se afasta 0.15 u e sai para a constelação lateral; o assoalho antigo entra deslizando por baixo (o mesmo `swap` em reverso). A oscilação amortece em 0.66–0.80 (`amp 1 → 0`). Faíscas passam de leque contínuo a raras.
  - `0.86–1.00` chicote para a direita e wipe.
- **efeitos e partículas:** `sparks` da prancha (forte 0.18–0.66, amortecendo até 0.80; ricochete no asfalto); `squat` oscilante; `speed` (rodas com raio borrado, asfalto rolando, poeira em riscos); `swap`; `constellation` só para a peça rejeitada; `telemetry` como fita de altura do assoalho contra uma linha de limite tracejada (a fita cruza o limite a cada salto — a suíte inteira reclamando); hotspots.
- **hotspots:**
  1. **Assoalho novo** (`assoalho`) — "Mais downforce e um salto por curva: o critério 'mais carga' passou; o critério que não foi escrito, 'continua dirigível', falhou. Escreva também o que não pode piorar. (Aston Martin, Canadá 2023: 'não antecipamos os efeitos colaterais', Krack.)"
  2. **Prancha** (`prancha`) — "As faíscas são a suíte inteira reclamando: o teste novo passou, o antigo quebrou. Red Bull 2024 detectou a descorrelação e não mexeu porque o carro era rápido; perdeu o título de Construtores."
  3. **Assoalho antigo** (`assoalho`, após a troca) — "Último verde. Só daqui se procura a causa; nunca de uma base já quebrada. O rollback custou quatro GPs à Ferrari; a você custa um `git revert`."
  4. **Volante** (`volante`) — "Registro da volta: piso B descartado; hipótese: anomalia do túnel; decisão: reverter e calibrar o verificador."
- **imagem-chave:** Câmera colada ao asfalto na curva rápida cinza de cinco e meia: o assoalho novo, contornado em âmbar, bate no chão e solta um leque de faíscas a cada oscilação, enquanto o assoalho antigo desliza por baixo e o carro assenta.
- **transição de saída:** wipe diagonal padrão; do outro lado, o muro do pit wall com bandeiras e o céu já laranja no horizonte. Rótulo "LIMITE". Pose final: 3/4 traseiro baixo a 6.6 u = pose inicial do capítulo 4.
- **emoção:** humildade; o alívio físico de sentir o carro assentar.

---

### Capítulo 4 — Limite

- **id:** `limite` · **nome:** Limite · **relógio:** 05:50
- **título:**
  ```
  DEZOITO VOLTAS.
  NEM UMA A MAIS.
  ```
- **corpo:** O teto de voltas e a regra de parar são escritos antes da primeira.
- **essência:** Declare o orçamento; na segunda falha, reset com prompt refinado; na terceira, pare e pergunte.
- **lições:**
  - **Orçamento de volta** — Teto explícito de voltas, tokens e minutos; sem teto o custo sobe e a qualidade para.
  - **Regra 2 e 3** — Duas falhas seguidas: `/clear` e prompt novo; três: parar e perguntar a uma pessoa.
  - **Reset com prompt refinado** — O prompt novo carrega o erro exato, os arquivos e a hipótese já descartada.
- **lição F1:** **Catar 2023, dezoito voltas por jogo** — Após o FP1, a Pirelli encontrou microsseparação no flanco dos pneus causada pelas zebras-pirâmide de 50 mm; a FIA impôs um máximo de 18 voltas por jogo, o que numa corrida de 57 voltas obrigou pelo menos três paradas. O limite foi fixado antes da falha, não descoberto nela. (f1-licoes #14, Autosport, Pirelli.)
- **ambiente 3D:** reta dos boxes vista do pit wall. O muro com monitores e o pit board em primeiro plano, bandeiras nos postes; o céu começa a ficar laranja no horizonte (`#f2a25c` baixo, cobalto em cima); os holofotes dos boxes apagam ao longo do capítulo (intensidade `1 − ease(seg(L, 0.3, 0.8))`). Temperatura: âmbar nascente com sombras azuis.
- **estado do carro:** *início* — em movimento na reta (`speed = 0.5`), pneus novos (`wear = 0`), DRS aberto (`drs = 1`: `rear_wing_drs` girado em torno do `drs_mechanism`, a fenda visível contra o céu — é a reta dos boxes, zona de DRS). *fim* — pneus com graining visível (`wear = 1`, traseiros cinzentos), DRS fechando (`drs 1 → 0` em 0.78–0.86, a aba baixa quando o carro deixa de atacar), o carro desacelerando para a entrada do pit lane (`speed 0.5 → 0.1`), pit board com "18 · BOX".
- **câmera:**
  - `0.00–0.18` órbita para altura de pit wall (1.4 u), lateral a 5.5 u.
  - `0.18–0.50` travelling paralelo ao muro: bandeiras e monitores passam em primeiro plano desfocado (bokeh 3.0), o carro passa repetidamente — cada passagem é uma "volta" (o mundo rola; o contador do pit board sobe 1 → 14 com `floor(L · k)`), e o graining dos pneus cresce a cada passagem. Título entra e sai.
  - `0.50–0.86` estável 3/4 dianteiro alto (vista de quem está no muro). O HUD de condições fica ativo (0.18–0.58, ver seção 6). Em 0.70 o contador marca 18 e o pit board vira: "BOX". Em 0.78 a bandeira amarela balança no poste ao fundo (plano com alpha, ondulação função de `L`).
  - `0.86–1.00` o carro vira para a entrada do pit lane; a parede do pit passa em primeiro plano e motiva o wipe.
- **efeitos e partículas:** `wear` (graining procedural em `roughnessMap`, marcas de borracha no assoalho); `telemetry` delta por setor mudando de roxo → verde → amarelo ao longo do stint; pit board (placa DOM/Plate com fonte display, `tabular-nums`); bandeira amarela; poeira; a luz do amanhecer subindo. Sem faíscas, sem chuva: capítulo "de leitura".
- **hotspots:**
  1. **Pneu traseiro esquerdo** (`roda-TE`) — "Graining na volta 14: a deriva não avisa; o limite avisa. Dezoito, nem uma a mais. O contexto degrada como pneu — fixe o limite antes, não depois."
  2. **Pit board** (`pit-board`) — "Segunda falha seguida: BOX. Não é desistir; é trocar o contexto por um limpo, levando o que se aprendeu: o erro exato, os arquivos, a hipótese descartada."
  3. **Bandeira** (`bandeira`) — "Amarela: não avance o escopo. Safety car: congele as posições. Vermelha: pare e nomeie o que interrompeu. Ultrapassar sob amarela é penalizado."
  4. **Display do volante** (`display`) — "Orçamento é regra, não humor: 320 runs e 80 h de vento por período, 70% para o líder. Quem tem menos voltas precisa de hipóteses melhores, não de mais tentativas."
- **cenários (HUD "Condições", só neste capítulo):** `duro` (referência, 18 voltas, desvio 0,00 s/volta), `medio` (−0,4 s até a volta 10, depois +0,6), `macio` (−0,9 s até a volta 6, depois +1,8), `chuva` (+12 s, série irregular). Cada condição escreve `wear`, `rain` e `brakeHeat` no carro e redesenha o gráfico de delta por volta com a linha tracejada do teto em 18. O aluno vê onde a curva cruza o limite e por que o limite é escrito antes.
- **imagem-chave:** O pit wall passa em primeiro plano desfocado, uma bandeira amarela tremula contra o céu que começa a ficar laranja, e o carro, com os pneus traseiros já cinzentos de graining, passa sob um pit board estendido sobre o muro que mostra 18 e a palavra BOX.
- **transição de saída:** wipe motivado por objeto (tipo 2): a parede do pit lane passa em primeiro plano; atrás dela, o box iluminado de 06:05 com a luz rasante do sol entrando pelo pit lane. Rótulo "PARADA". Pose final: 3/4 dianteiro alto a 6.4 u, altura 1.4 u = pose inicial do capítulo 5 (altura de mecânico).
- **emoção:** disciplina; a tentação de "só mais uma volta" e o alívio de já ter a regra escrita.

---

### Capítulo 5 — Parada

- **id:** `parada` · **nome:** Parada · **relógio:** 06:05
- **título:**
  ```
  1,80 SEGUNDOS.
  VINTE PESSOAS.
  UM CRITÉRIO.
  ```
- **corpo:** Cada um tem uma tarefa e um sinal; a luz só abre quando chegam os quatro.
- **essência:** Encerre só quando cada verificação chegou; se uma falta, segure o carro.
- **lições:**
  - **Executor certo** — Um dono por tarefa: quem critica não produz, quem verifica não opina.
  - **Critério atingido** — A luz verde só acende quando todos os sinais chegaram e a verificação final foi colada.
  - **Risco identificado** — Uma roda sem sinal: segurar o carro e devolver a decisão a uma pessoa vale mais que largar.
- **lição F1:** **McLaren, 1,80 s, Catar 2023** — Na volta 27, a troca dos quatro pneus de Lando Norris levou 1,80 s, recorde mundial, batendo os 1,82 s da Red Bull com Verstappen no Brasil 2019 — e com os pneus de 18 polegadas, maiores e mais pesados. Ninguém melhorou o carro ali: cerca de vinte pessoas (três por roda, dois macacos e dois reservas, dois estabilizadores, dois na asa dianteira, um sinaleiro) executaram o planejado, e o cronômetro mediu. (f1-licoes #1 e #2, F1.com, mercedesamgf1.com.)
- **ambiente 3D:** o box. LEDs do teto acesos, marcas de posição no chão, e o sol nascente entrando rasante pelo pit lane (key âmbar real, quase horizontal, sombras longas). Vinte silhuetas de mecânicos como planos com alpha nas posições reais; pistolas e macacos como geometria simples. Temperatura: âmbar quente contra o interior frio do box.
- **estado do carro:** *início* — entrando no box (`speed 0.1 → 0`), discos em brasa (`brakeHeat = 0.8`, a evidência do que aconteceu na pista). *fim* — quatro rodas novas, macacos descidos, semáforo verde, o carro saindo (`speed 0 → 0.6`), brasa apagando.
- **câmera:**
  - `0.00–0.18` órbita à altura de mecânico (1.4 u, 3 u lateral): o carro entra e para na marca.
  - `0.18–0.50` crane sobre o pit stop (movimento 4): sobe em arco de 1.4 u a 6 u de altura, quase vertical sobre o carro, chegando ao topo em 0.50. A sequência `pit 0 → 1` é **dilatada** sobre 0.30–0.70 — os 1,80 s reais viram 40% do capítulo, para que o olho leia cada posição: para (0.30–0.34), macacos sobem 5 cm (0.34–0.38), as quatro rodas saem em explosão lateral curta (0.38–0.50), as quatro novas entram (0.50–0.62), macacos descem (0.62–0.66), sinais chegam um a um e a luz abre (0.66–0.70). Título 0.08–0.24, sai 0.30–0.36 (janela antecipada, capítulo com aprofundamento).
  - `0.50–0.86` estável quase vertical: a vista em que as vinte posições se leem como um diagrama — três por roda, dois macacos, dois estabilizadores no meio, dois na asa dianteira, o sinaleiro à frente. Ficha em 0.36–0.63. Em 0.68–0.70, **flash de fotógrafos** (tipo 5, único da experiência): dois quadros a 60% de branco, aberração cromática a 0,004 — o instante "critério atingido". O carro sai em 0.70–0.78. Slide "Engenharia de loop" em `L ≥ 0.72`.
  - `0.86–1.00` wipe sob o slide.
- **efeitos e partículas:** `pit` (sequência); silhuetas da equipe (20 planos, entram em 0.22–0.30 e "levantam a mão" — um brilho ciano por posição quando a sua tarefa termina); cronômetro do box no HUD (`0,00 → 1,80`, proporcional a `L` em 0.30–0.70, `tabular-nums`); semáforo (vermelho → verde em 0.70); `brakeHeat` 0.8 → 0 com 30 brasas subindo de cada disco; `sparks` fraca na saída; flash; poeira na luz rasante; hotspots. Máximo de dois caros: DOF curto do crane + brasa (sem haze em celular).
- **hotspots:**
  1. **Roda dianteira direita** (`roda-DD`) — "Três pessoas: porca, tira, põe. Cada uma faz uma coisa e levanta a mão quando a sua acabou. Ninguém faz duas."
  2. **Macaco dianteiro** (`macaco-D`) — "Dois macacos e dois reservas: o passo reversível. Se a pistola falha, o carro desce e volta ao estado anterior sem drama."
  3. **Sinaleiro / semáforo** (`semaforo`) — "Quatro sinais, uma luz. Um sinal a menos e o carro fica: risco identificado vale mais que largar cedo."
  4. **Disco de freio em brasa** (`disco-freio-DE`) — "Parc fermé do gesto: depois da luz verde, ninguém ajusta mais nada — só pneus, combustível, freios e ângulo da asa; mudar setup é largar do pit lane. 'Só mais um ajuste' reabre o ciclo inteiro."
- **interação própria do capítulo (opcional, barata, DOM):** o semáforo do HUD só passa de vermelho a verde quando o aluno visitou os quatro hotspots das rodas (ou os quatro hotspots acima). Enquanto falta um, o rótulo diz "3 de 4 sinais". É a lição "critério atingido" vivida no gesto, sem quebrar a reversibilidade (o estado do herói continua função de `L`; só a cor do semáforo do HUD depende da visita).
- **imagem-chave:** Vista quase vertical de um box às seis da manhã: o carro suspenso nos macacos, quatro rodas no ar num mesmo instante, vinte silhuetas em posições fixas como notas numa partitura, o cronômetro do muro em 1,80 e o sol entrando rasante pelo pit lane.
- **transição de saída:** wipe diagonal padrão; o carro já sai pela esquerda do quadro; do outro lado, a reta ao sol. Rótulo "AMANHECER". Pose final: quase vertical a 6 u de altura — a órbita do capítulo 6 desce daqui para a T-cam.
- **emoção:** precisão coletiva; o tempo dilatado; a vibração de uma coisa perfeita e curta.

---

### Capítulo 6 — Amanhecer

- **id:** `amanhecer` · **nome:** Amanhecer · **relógio:** 06:31
- **título:**
  ```
  CRUZAR A LINHA
  NÃO ENCERRA.
  ESCREVER, SIM.
  ```
- **corpo:** O que a noite ensinou vira a primeira linha do próximo turno.
- **essência:** Registre hipótese, mudança, comando, resultado e decisão; dado antes da sensação.
- **lições:**
  - **Registro de volta** — Cinco colunas por volta: hipótese, mudança, comando, resultado, decisão.
  - **Debrief** — Dado primeiro, sensação depois; o registro só existe se o próximo contexto o lê.
  - **Inconclusivo é resultado** — Ao bater o teto, o relatório em três partes: tentado, descartado, a decidir.
- **lição F1:** **Debrief: dado antes da sensação** — No debrief da McLaren, o diretor de engenharia abre pelas mudanças de setup que a equipe precisa saber, depois vêm os relatórios dos engenheiros de corrida e dos departamentos e só então a impressão dos pilotos, com telemetria sobreposta a GPS e vídeo onboard curva a curva e a fábrica ligada por intercom; Schumacher levava a telemetria para casa para "destrinchar o dia com os engenheiros". (f1-licoes #8, mclaren.com, F1.com.)
- **ambiente 3D:** reta principal e linha de chegada. O sol nasce exatamente atrás da faixa quadriculada; o orvalho da reta vira ouro (asfalto `roughness 0.2`, reflexo do sol como listra); céu de cobalto a salmão; postes com sombras longas. Bloom sobe de 0.1 a 0.55 ao longo do capítulo. Temperatura: a única cena com key branca-dourada de frente — o calor migrou do freio para o dado, e agora para o sol.
- **estado do carro:** *início* — saindo do box (`speed 0.6 → 0.8`), rodas novas, freios frios. *fim* — cruzando a linha a `speed = 0.9`, DRS abrindo na reta (`drs 0 → 1` em 0.82–0.88, a aba `rear_wing_drs` levanta e o sol passa pela fenda: a última transformação visível do carro), `steering_wheel_leds` percorrendo verde → vermelho → azul em função de `speed`, e, por um instante (0.90–0.96), cada uma das peças acende sua etiqueta numerada (`callouts` em todas as 30 peças ao mesmo tempo, com números 01–30): as mesmas que estavam no chão às três, agora no carro, cada uma com um número.
- **câmera:**
  - `0.00–0.18` órbita: desce do alto do box para a T-cam.
  - `0.18–0.40` onboard (movimento 8) na out-lap, com o sol nascendo à frente e as fitas de telemetria sendo "escritas" à frente do carro conforme ele avança (`uProgress` acompanha `L`): o registro é escrito durante a volta, não depois. Título entra 0.08–0.24 e sai 0.30–0.36.
  - `0.40–0.62` estável 3/4 traseiro alto a 7.2 u, altura 2 u (o carro corre, a reta rola). Ficha em 0.36–0.63. O HUD "Livro de bordo" recebe automaticamente as entradas do turno (uma por capítulo) em 0.44–0.60, uma a uma.
  - `0.62–0.88` slide "Livro de bordo" (aprofundamento); atrás do slide o carro continua em silhueta contra o sol (`silhouette 0.6`).
  - `0.88–1.00` a câmera desce ao asfalto na linha (contra-plongée de lançamento, movimento 2: y 0.15 u, 2 u à frente do bico, 12° para cima): o carro cruza a faixa em 0.96 com o sol exatamente atrás da asa traseira; etiquetas numeradas em 0.90–0.96; bloom 0.55; créditos em `L > 0.97`. Última pose: parada, o carro passando pela lente.
- **efeitos e partículas:** `telemetry` da volta inteira com setores roxo/verde/amarelo (roxo no setor final: critério atingido); `silhouette` (0.62–0.88); `callouts` numerados (0.90–0.96, 30 rótulos, um draw call via atlas); poeira em riscos dourada; reflexo do sol no orvalho (uma renderização espelhada a 0,35 de resolução, só aqui); `finale` (bloom). Sem flash (já foi usado).
- **hotspots:**
  1. **LED traseiro** (`led-traseiro`) — "A luz que pisca na chuva é a mesma que diz: volta registrada. Sem registro, a volta 5 repete a volta 2."
  2. **Display do volante** (`display`) — "O relatório inconclusivo tem três partes: o que foi tentado, o que foi descartado, o que falta decidir. E nenhum 'quase lá'."
  3. **Asa dianteira** (`asa-dianteira`) — "A mesma peça que estava no chão às três. Agora tem um número, uma fonte e uma decisão."
  4. **Disco de freio frio** (`disco-freio-DD`) — "Abu Dhabi 2021: Hamilton em pneus duros de 44 voltas, safety car, relargada na última volta. 'Critério atingido' só vale quando a sessão acabou; até lá, o risco identificado precisa de um plano."
- **imagem-chave:** Do asfalto, na linha de chegada: o carro cruza a faixa quadriculada com o sol nascendo exatamente atrás da asa traseira, e por um instante cada peça acende sua etiqueta com um número — as mesmas trinta que estavam no chão às três da manhã.
- **transição de saída:** nenhuma (último capítulo). Créditos: "Fatos verificáveis; dados de telemetria ilustrativos."
- **emoção:** calma conquistada; a resposta à primeira imagem.

---

### Verificação de não redundância (21 termos)

| Cap. | Lição 1 | Lição 2 | Lição 3 | Bloco do loop |
|---|---|---|---|---|
| 0 Madrugada | Referência real | Critério verificável | Tarefa delimitada | Preparar |
| 1 Turno | Produzir e criticar | Revisar o necessário | Verificar o resultado | Uma volta |
| 2 Tinta | Crítico independente | Evidência conferida (calibrar) | Não mexer no teste | Controlar I |
| 3 Retorno | Reverter regressões | Suíte inteira | Causa raiz | Controlar II |
| 4 Limite | Orçamento de volta | Regra 2 e 3 | Reset com prompt refinado | Interlúdio de custo |
| 5 Parada | Executor certo | Critério atingido | Risco identificado | Encerrar I |
| 6 Amanhecer | Registro de volta | Debrief | Inconclusivo é resultado | Encerrar II |

Segue a progressão pedagógica da pesquisa (etapas 0–8): referência e critério primeiro; a volta; crítico; regressão; orçamento e reset; encerramento por último; as armadilhas aparecem como recapitulação dentro dos hotspots (Ferrari 2020 = referência falsa; Red Bull 2024 = placar bom escondendo regressão; Aston 2023 = critério incompleto; Abu Dhabi 2021 = encerrar cedo demais).

Estados do carro por capítulo (transformação de verdade): peças no chão → constelação → montagem sem rodas com fantasma → rodas, tinta e carro B → em movimento com bouncing e troca de assoalho → DRS aberto, desgaste e entrada no pit → pit stop com rodas no ar → linha de chegada com DRS abrindo e etiquetas. Nenhum capítulo tem o carro parado com texto ao lado.

---

## 5. Aprofundamentos

### Slide 1 — "Engenharia de loop" (capítulo 5 Parada, `L ≥ 0.72`)

- **rótulo:** Parada · aprofundamento
- **título:** Engenharia de loop
- **lead:** Produzir. Criticar. Revisar. Verificar.
- **imagem:** `pagina-loop-pitstop.jpg` — diagrama pintado, vista de cima, do box com as vinte posições numeradas ao redor do carro, em âmbar sobre carbono.
- **metáfora:** Uma volta, um dono, um cronômetro.
- **seções:**
  1. **Preparar** — Referência real · Critério verificável · Tarefas delimitadas
  2. **Uma volta** — Produzir e criticar · Revisar o necessário · Verificar o resultado
  3. **Controlar** — Crítico independente · Evidência conferida · Reverter regressões
  4. **Encerrar** — Critério atingido · Risco identificado · Limite: inconclusivo

(Mantém o slide do site atual palavra por palavra nos 12 itens; muda a imagem e a metáfora. É o mapa que o aluno leva; o pit stop acabou de mostrar os quatro blocos em 1,80 s.)

### Slide 2 — "Livro de bordo" (capítulo 6 Amanhecer, `L ≥ 0.62`)

- **rótulo:** Amanhecer · aprofundamento
- **título:** Livro de bordo
- **lead:** O que sobrevive ao reset.
- **imagem:** `pagina-livro-de-bordo.jpg` — a página de um caderno de engenheiro com cinco colunas preenchidas, marcada de graxa, sob luz de amanhecer.
- **metáfora:** Dado primeiro. Sensação depois.
- **seções:**
  1. **Antes da volta** — Fonte de verdade em uma linha · Critério em uma frase · Teto de voltas declarado
  2. **Cada volta** — Hipótese e mudança · Comando e saída colada · Decisão: seguir, reverter, parar
  3. **Ao bater o teto** — O que foi tentado · O que foi descartado · O que falta decidir
  4. **Próximo turno** — Prompt refinado com o erro exato · Portões humanos listados · Registro lido antes de agir

Ligações: `licoes[2].pagina = "loop"` em Turno e Parada; `licoes[0].pagina = "bordo"` em Amanhecer e Limite.

---

## 6. HUD e interações

Mantém a estrutura do HUD atual (fixo, dots à direita, menu, ficha, registro, tooltip, progresso, dica, créditos, `.sr-only`) e troca a pele e a semântica:

- **Pontos de capítulo → o relógio da noite.** A coluna à direita vira uma linha do tempo vertical com sete nós e as horas ao lado (`03:12 · 04:10 · 05:05 · 05:30 · 05:50 · 06:05 · 06:31`), em fonte display, `tabular-nums`. O nó ativo tem o anel giratório do hotspot; o trecho percorrido colore-se de âmbar; durante o wipe, o rótulo do próximo capítulo ("TURNO", "TINTA"…) aparece à esquerda do nó e some depois (corn-12).
- **Barra de progresso → relógio de parede.** O fio de 2 px no topo continua, em âmbar; ao lado do logo, um `output` mostra a hora da garagem interpolada pelo progresso global (`03:12 → 06:31`). No capítulo Parada, o mesmo `output` vira cronômetro do box (`0,00 → 1,80`) e volta a ser relógio ao sair. Diegético: o cronômetro manda.
- **Registro → Livro de bordo do turno.** A gaveta mantém lista, exportação JSON e limpar. Tipos: `leitura | mudança | volta`. Cada entrada tem as cinco colunas (hipótese, mudança, comando, resultado, decisão); entradas de `volta` mostram delta com cor de setor. No capítulo Amanhecer, as sete entradas do turno entram automaticamente (0.44–0.60); o aluno pode exportar. Chave de storage própria (`f1-loop:bordo`), fases = nomes dos sete capítulos.
- **Cenários → Condições (capítulo Limite, 0.18 < L < 0.58).** Quatro botões gerados dos dados: Duro · Médio · Macio · Chuva. O gráfico de deriva vira delta por volta (linha tracejada = referência, linha âmbar = condição escolhida, linha vertical = teto em 18). `output` mostra `−0,90 s/volta`. Cada condição escreve `wear`, `rain` e `brakeHeat` no carro (a chuva liga spray e gotas na lente — o único momento de chuva da experiência, opcional e barato). Registra `leitura` no livro de bordo.
- **Semáforo (capítulo Parada).** Elemento novo do HUD, pequeno, ao lado do cronômetro: quatro pontos (as rodas) + luz. Visitar cada hotspot de roda acende um ponto; a luz abre com quatro. Não altera o estado do herói (que segue `L`); é feedback de leitura. Reduz para "luz sempre verde" em reduced-motion.
- **Hotspots.** Anel diegético (R5) em ciano; a variante grande com texto dentro ("ABRIR O LIVRO DE BORDO", "VER O LOOP") abre os aprofundamentos. Cada hotspot ancorado a `hotspots[i].peca` da lista fechada; tooltip com `nome` + `texto`; visita registra `leitura`.
- **Ficha.** Layout à esquerda (R4): essência, três lições com numerais romanos, bloco "Fato de pista" com equipe e ano em `small` e borda âmbar.
- **Dica de scroll:** "Role para acender a garagem." Seta de pit lane em âmbar.
- **O que o aluno pode mexer:** rolar (tudo), clicar hotspots (4 por capítulo, 28 no total), trocar condições no Limite, acender o semáforo na Parada, abrir os dois slides, exportar o livro de bordo, navegar pelo relógio da noite e pelo menu. Nada disso quebra a reversibilidade do scroll.
- **Acessibilidade:** `.sr-only` completo por capítulo (nome, título, corpo, hotspots, essência, lições, fato de pista); `prefers-reduced-motion` = câmera fixa por capítulo (pose estável de cada um), estados do carro por cross-fade, sem partículas narrativas; fallback sem WebGL = texto corrido de capítulos + slides.

---

## 7. Paleta e tipografia

Segue a gramática visual (sujeito quente, mundo frio; três cores por ambiente; uma temperatura por capítulo) e acrescenta o arco do amanhecer como variável global.

| Papel | Nome | Hex | Onde |
|---|---|---|---|
| Fundo base | Asfalto noturno | `#07090c` | `--bg`, todos os capítulos |
| Garagem fechada | Breu de garagem | `#08090b` | Madrugada |
| Garagem acesa | Grafite de boxes | `#0c0f13` | Turno |
| Pit lane à primeira luz | Cobalto de cinco da manhã | `#1b2f4a` (céu) / `#080a0e` (chão) | Tinta |
| Pista antes do sol | Cinza-tempestade | `#0d1216` / ambiente `#4a5c6e` | Retorno |
| Horizonte | Laranja nascente | `#f2a25c` | Limite (baixo do céu) |
| Sol | Ouro de amanhecer | `#ffd9a8` | Amanhecer (key), bloom |
| Acento quente | Âmbar incandescente | `#ff8a2a` | Título cheio, régua, pontos ativos, swap, faíscas |
| Acento extremo | Brasa de freio | `#ff3b1a` | Discos (emissivo > 1,0) |
| Acento frio | Ciano de telemetria | `#38e8ff` | Fantasma, ribbons, hotspots, rims UV |
| Flow-vis | Verde fluorescente | `#4dffb0` | Tinta; setor verde |
| Setor roxo | Roxo de volta mais rápida | `#b04cff` | Só quando um critério é atingido |
| Alerta | Amarelo de bandeira | `#ffd23f` | Bandeira, pit board, setor amarelo |
| Texto | Marfim de pit wall | `#ebe6dc` | `--ink`; nunca branco puro |
| Texto secundário | Cinza de fita de carbono | `#8a9099` | Rótulos, horas |
| Pintura do carro | Azul-petróleo metálico | `#0f3a47` base / `#2c7a8c` flake | Carroceria (livery própria "LOOP 26", sem marcas) |
| Carbono | Carbono nu | `#15171a` / `#3b3f45` | Asas, assoalho, chassi |
| Silhuetas | Sombra de mecânico | `#0b0d10` a 85% | Parada |

Temperatura por capítulo: Madrugada = breu + ilha âmbar; Turno = frio neutro + ciano; Tinta = cobalto + âmbar de sódio + UV ciano; Retorno = cinza sem key (a mais fria); Limite = âmbar nascente + sombras azuis; Parada = âmbar rasante contra box frio; Amanhecer = ouro de frente (a única key quente frontal).

Pele de filme sempre ligada (R9): grão 0,12 nas cenas escuras (Madrugada, Turno), 0,09 nas claras; vinheta 0,62; aberração cromática 0,0008 (0,004 só no flash).

Tipografia: **Bebas Neue** para títulos 3D (tracking 0.01, ≈9% da altura por linha), horas e cronômetro (`tabular-nums`); **Lato** para corpo, ficha e hotspots; rótulos pequenos em caixa alta com `letter-spacing .22em`. Caracteres dos títulos restritos ao conjunto pré-carregado (A–Z, acentos, dígitos, `. , : ; + - % /`) — os sete títulos deste tratamento já cumprem isso (sem `?`, `!`, travessão ou aspas; "1,80" usa vírgula e dígitos).

---

## 8. Riscos e o que é caro de fazer

| Risco / custo | Por que dói | Mitigação barata |
|---|---|---|
| **Sete capítulos** com `N = 6` hardcoded (Scroll.PESOS, cameraPath, Director, Registro.FASES, Callouts, ui.js, teste) | Mudar o número toca sete pontos e o CI | Decidir cedo: ou tocar os sete pontos de uma vez (uma volta só, com teste atualizado), ou fundir Madrugada+Turno ou Parada+Amanhecer para caber em 6. Este tratamento prefere 7; a fusão menos dolorosa seria Limite dentro de Retorno (o teto de voltas como saída do rollback), mantendo os 21 termos em 18. |
| **Estado `floor`** (peças no chão, cap. 0) não existe no catálogo | Precisa de pose "no chão" por peça (posição + rotação) além de `home`/`apart` | Terceira pose em `userData.floor` calculada uma vez no carregamento (projeção de `apart` no plano y = 0 + rotação aleatória fixa por seed); interpolar com o mesmo `ease(seg)` |
| **Peças procedurais** (discos de freio, prancha, rake, macacos, pistolas, pit board, semáforo) | O modelo local não tem freios nem ferramentas | Geometrias simples em three.js (cilindros, caixas, um `Plate`); os discos com o shader de furos e a rampa de corpo negro já descritos na gramática visual |
| **Vinte mecânicos** no pit stop | Personagens animados são inviáveis | Vinte planos com alpha (silhuetas em duas poses: agachado / mão erguida), posicionados no diagrama real; o crane, o cronômetro e o brilho por posição vendem a cena |
| **Pit stop dilatado** (1,80 s em 40% de `L`) e reversível | A sequência precisa rodar para trás sem quebrar | `pit` é um único parâmetro 0..1 com sub-janelas fixas; rodar para trás recoloca as rodas velhas — aceitável e até didático |
| **Bouncing** (cap. 3) como função de `L` | `sin(L · 28)` com amplitude por janela é puro e reversível; mas oscila rápido em scroll rápido | Limitar a frequência (≈ 6 ciclos no capítulo) e amortecer por `amp`; em reduced-motion, `amp = 0` e só as faíscas contam a história |
| **Dois carros (A/B, cap. 2) + fantasma (cap. 1)** | Dobra draw calls | Mesma geometria, segunda `Mesh`; `ab` só com `explode = 0`; em retrato, `ab` vira `ghost` |
| **Streamlines + orvalho refletindo** (cap. 2), **reflexo do sol** (cap. 6) | Reflexo planar = renderizar duas vezes | Reflexo a 0,35 de resolução só nesses dois capítulos; desligado em celular; envMap resolve o resto |
| **Céu que amanhece** ao longo da experiência | Trocar envMap por capítulo dá corte | Cinco envMaps 1K (breu, cobalto, laranja, ouro, box) interpolados por `uMix` em função do progresso global; wipe decide a paleta de pós por lado |
| **Wipe sobre a cena inteira** (não só o fundo) | O `Background.js` atual só varre o fundo | Passe de pós único que decide tint/vinheta/grão por lado da diagonal; luzes e envMap interpolam por `uMix` |
| **Câmeras fora dos limites testados** (macro a 0,35 u, T-cam, crane a 6 u, contra-plongée a y 0,15) | `cameraPath.test.js` exige `z ∈ [6.4, 7.82]`, `|x| ≤ 1.2` | Reescrever os limites do teste para o carro (o carro mede ≈5,6 u); manter os invariantes que importam: continuidade nas fronteiras, pose estacionária em 0.50–0.86, reversibilidade, finitude |
| **Texto que dissolve em partículas** e **título metálico** | Parece caro | Amostragem do título em canvas (≈3.000 pontos) + `Points`; material PBR no troika — ambos custo quase zero, já descritos na gramática visual |
| **Modelo 3D** | Realismo do modelo local é "tutorial de alta qualidade"; stickers de FIA/F1/Pirelli; licença não localizada | Realismo vem de luz, DOF, grão e sarjado baked; trocar stickers por livery "LOOP 26"; confirmar licença do tutorial ou re-modelar detalhes; plano B: showcar 2026 CC BY (Nimaxo / Abu Saif) re-texturizado |
| **Dados de telemetria** (volta 31, curva 9, deltas) | São ilustrativos, não fatos | Rotular sempre "dados ilustrativos"; só os fatos de F1 da ficha e dos hotspots são verificáveis, e todos têm linha em `f1-licoes.md` |
| **Chuva** (só como condição opcional no Limite) | Spray + gotas na lente + asfalto molhado são três efeitos | Implementar por último; se não couber no orçamento, a condição "Chuva" só altera o gráfico e o `wear`, sem partículas |
| **Celular em retrato** | Crane quase vertical e A/B não cabem | Retrato: texto no topo, herói embaixo; crane limitado a 4 u; `ab → ghost`; sem haze, sem reflexo; DOF a 0,5 de resolução, bokeh ≤ 1,8 |

Regra de viabilidade mantida: cada capítulo escolhe no máximo dois efeitos caros (Madrugada: poeira densa + DOF macro; Turno: fantasma + ribbons; Tinta: streamlines + orvalho; Retorno: faíscas + speed; Limite: nenhum caro; Parada: DOF do crane + brasa; Amanhecer: reflexo do sol + bloom), e o Director zera os demais no início de cada quadro.
