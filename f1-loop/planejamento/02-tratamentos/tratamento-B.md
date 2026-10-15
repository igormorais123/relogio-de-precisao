# Tratamento B — "VOLTA ÚNICA"

Data: 2026-09-12. Contrato: `00-briefing.md`. Pesquisa: `01-pesquisa/` (engenharia-de-loop, f1-licoes, gramatica-visual, arquitetura-atual, modelos-3d-f1, assets-locais-f1-2026).
Ângulo deste tratamento: **uma única volta como estrutura**. A câmera dá uma volta completa num circuito; cada setor é um princípio da engenharia de loop; o pit stop no meio da volta é a "volta" do loop; a linha de chegada é o critério de saída. **O carro nunca sai de quadro e nunca para de se mover** — quando a câmera precisa parar para leitura, ela se tranca ao carro e o mundo passa por ele.

Convenções: `L` = progresso local do capítulo (0..1). Toda animação é função de `L` e reversível (contrato de `Director.js`/`cameraPath.js`). Estados do herói e movimentos de câmera usam os nomes do catálogo de `gramatica-visual.md` (§2.5 e §3). Fatos de F1 citam o número da tabela de `f1-licoes.md` (`#n`).

---

## 1. Título e logline

**Título:** VOLTA ÚNICA

**Logline:** Um carro de Fórmula 1 dá uma volta inteira — grid, curvas rápidas, freada, box, fantasma, chuva e bandeira — e a cada setor você aprende uma regra para iterar com IA sem mentir para si mesmo; o cronômetro decide, e o registro da volta é o começo da próxima.

Frase de abertura na tela (subtítulo sob o título, como "Corn. Revolutionized."): *Produzir. Criticar. Revisar. Verificar. Em uma volta.*

---

## 2. Tese pedagógica

O aluno sai sabendo **fechar uma volta de trabalho com IA de forma que ela conte**: antes de pedir qualquer coisa ao Claude Code, escrever o alvo e o comando que o julga; mudar uma variável por vez e deixar cada passo desfazível; exigir a saída do comando em vez do relatório em prosa; separar quem produz de quem critica e de quem verifica; comparar a versão nova com a anterior e reverter quando piorou; contar falhas em voz alta (duas = reset com prompt refinado, três = parar e perguntar); e encerrar nomeando uma das três saídas legítimas — critério atingido, risco identificado, limite inconclusivo — deixando uma linha de registro que vira a entrada da próxima sessão.

Gesto mais transformador da aula (etapa 1 da progressão pedagógica): *escreva o teste que falha antes de pedir a correção*. Ele aparece na primeira cena e é cobrado na última.

O que a estrutura em volta única ensina por si: **um loop tem começo, meio e fim escritos antes de rodar** — o grid define o alvo, o box é a única intervenção, a bandeira é a única saída. Quem aprende a volta aprende o loop.

---

## 3. Arco em três atos

**O circuito.** "Anel de Precisão", circuito noturno fictício com sete nós: Grid, Setor 1 (curvas rápidas), Setor 2 (freada), Box, Setor 3-A (a curva cega, onde corre o fantasma), Setor 3-B (a última curva, onde chega a chuva) e Chegada. Licença poética única e declarada nos créditos: a entrada dos boxes fica **no meio** da volta, entre o setor 2 e o 3 — porque o loop para no meio, não no fim.

**Ato I — Preparar (capítulos 0–2: Grid, Setor 1, Setor 2).** O que está em jogo: uma volta que ainda não existe. O carro entra em quadro como planta técnica ciano rolando na volta de apresentação; no pit board, o alvo e o juiz já estão escritos antes das luzes apagarem. No setor 1 o carro aprende a mudar uma coisa por curva; no setor 2, sob a freada mais forte do circuito, o carro se dissolve em 250 pontos de sensor e o olhar sai da sensação e vai ao dado. Tensão do ato: a velocidade parece boa — mas *parecer* não é medida.

**Ato II — A volta (capítulos 3–4: Box, Fantasma).** O ponto de virada é o pit stop: 1,80 segundo em que o carro para e o cronômetro não. Vinte pessoas, um dono por tarefa; troca-se só o planejado. O carro sai do box e, no setor 3-A, encontra o próprio fantasma ciano — a versão anterior, correndo ao lado. Tensão: se o fantasma passa, a mudança piorou o carro; a resposta não é insistir, é reverter ao último estado verde.

**Ato III — Encerrar (capítulos 5–6: Chuva, Chegada).** Chega a chuva no setor 3-B: o contexto degrada como pneu, a visibilidade cai, a bandeira amarela sobe. Duas falhas: blackout e reset — o carro reaparece com intermediários verdes, carregando o que aprendeu. Três: bandeira vermelha, parar e perguntar. A chegada: o carro cruza a linha, o flash dos fotógrafos dispara uma única vez, o pit board que estava vazio no grid recebe o número, e a especificação congela em parc fermé. O carro não para — entra na volta de desaceleração sob a luz dos monitores do debrief, e o livro de bordo que se preencheu ao longo da volta vira a primeira linha da próxima.

**Como a última cena responde à primeira:** a mesma reta, a mesma pose de câmera baixa, o mesmo pit board. No grid ele mostrava `ALVO 1:38.500 · JUIZ: CRONÔMETRO · DESEMPATE: QUEM FEZ PRIMEIRO` e um tempo em branco `-:--.---`. Na chegada ele mostra `1:38.412 · CRITÉRIO ATINGIDO` e, um instante depois, vira: `PRÓXIMA VOLTA · ENTRADA: REGISTRO DESTA`. A promessa "nenhuma volta começa sem saber o fim" é cumprida e devolvida ao começo.

Ritmo (R7): em cada capítulo o texto ocupa no máximo 35% de `L`; o resto é viagem de câmera com o mundo passando.

---

## 4. Capítulos

Sete capítulos (N = 7; ver §8 sobre o `N = 6` hardcoded). Pesos sugeridos de rolagem (telas): `[2.8, 3.2, 3.6, 4.2, 5.0, 4.4, 5.0]`.

Janelas fixas herdadas do motor: título entra `0.08–0.24` (cap. 0: `0.02–0.20`) e sai `0.40–0.50`; ficha (essência, lições, fato de pista) `0.50–0.62` até `0.88–0.98`; aprofundamento em `L ≥ 0.64` nos capítulos com `aprofundamento`; wipe de saída `0.86–1.00`. Pose de leitura estável em `0.18–0.50` (câmera trancada ao carro; o mundo rola). Movimento de câmera declarado como `camera.movimento[]` entre `0.50` e `0.86`.

**Herói: o modelo local.** O carro é o F1 2026 genérico em Blender que o autor já tem (`assets-locais-f1-2026.md`, `F1_2026_tutorial_part7_textures.blend`): peças separadas e nomeadas, sem livery de equipe; stickers de terceiros (FIA, F1, Pirelli) trocados pela identidade da aula. A lista fechada de nós usada nos hotspots, callouts e na coreografia de explodir/montar é a lista de objetos do `.blend`, agrupada por função do Director (rodas e suspensão têm quatro instâncias, sufixo `DE/DD/TE/TD`):

| Grupo (Director) | Nós do modelo (`hotspots[i].peca`) | Estado do herói que os move |
|---|---|---|
| `asa_dianteira` | `front_wing_bottom`, `front_wing_middle`, `front_wing_top` (flap ajustável), `front_wing_side_plates`, `front_wing_mount`, `front_flap_detail` | `explode`, `swap`, `flapAngle` |
| `asa_traseira` | `rear_wing_main_part`, `rear_wing_drs`, `drs_mechanism`, `drs_holder`, `rear_wing_side`, `rear_wing_top_mount`, `rear_wing_holder`, `rear_wing_bottom_holder`, `rear_led` | `explode`, `drs` (0 fechado → 1 aberto, rotação de `rear_wing_drs` sobre `drs_mechanism`), `ledLevel` |
| `corpo` | `main_body`, `main_body_inside`, `main_body_glass`, `top_intake_details`, `side_mirrors`, `antennas`, `exhaust` | `explode`, `blueprint`, `sensors`, `silhouette` |
| `assoalho` | `floor` | `swap` (troca de piso), `sparks` (origem das faíscas), `squat` |
| `suspensao_D` / `suspensao_T` | `front_control_arms`, `front_pushrod` / `rear_control_arms`, `rear_driveshaft` | `explode`, `squat`, `pitJack` |
| `rodas` | `front_tire`, `rear_tire`, `front_wheel_cover`, `rear_wheel_cover`, `inside_cover` (tambor/freio dianteiro), `rear_inside_cover` (tambor/freio traseiro) | `wheelSpin`, `steer`, `wear`, `brakeHeat` (emissivo em `inside_cover`/`rear_inside_cover`), `pit` (saída lateral das quatro rodas) |
| `cockpit` / `volante` | `steering_wheel_main`, `steering_wheel_handles`, `steering_wheel_buttons`, `steering_wheel_leds`, `lcd_screen`, `sw_connection` | `steer`, `ledLevel` (LEDs de giro como barra de `speed`), `lcd` (o display mostra o delta da volta) |

Objetos de cena fora do carro, também clicáveis: `pit board` (placa no muro), `painel de bandeira`. O que o modelo não tem (motor, câmbio, radiadores, disco de freio visível) **não** recebe hotspot nem callout: o calor de freio vive nos tambores (`inside_cover`), os internos aparecem só como `main_body_inside`.

---

### Capítulo 0 — GRID

- **id:** `grid` · **slug:** `capitulo-0` · **nome:** Grid
- **Título:**
  ```
  NENHUMA VOLTA
  COMEÇA SEM
  SABER O FIM.
  ```
- **Corpo:** Antes das luzes apagarem, o alvo e o cronômetro já estão escritos.
- **Essência:** Escreva o alvo e o comando que o julga antes da primeira volta.
- **Lições:**
  1. **Referência real** — A volta compara com algo fora do loop: um teste que falha, um dado medido, um documento.
  2. **Critério verificável** — Uma frase que um comando ou uma pessoa sem contexto julga verdadeira ou falsa.
  3. **Tarefa delimitada** — O que está dentro, o que está fora e o que é proibido, antes de tocar no carro.
- **Fato de pista (F1):** **O cronômetro e o desempate vêm antes da volta** — GP da Europa 1997, Jerez: Villeneuve, Schumacher e Frentzen marcaram exatamente **1:21.072** na classificação; o desempate foi por regra escrita antes — quem fez o tempo primeiro larga na frente (`#12`, formula1.com / Wikipedia). O critério e a regra de desempate se definem antes da volta, não pela sensação de quem foi mais rápido.
- **Ambiente 3D:** reta dos boxes ao anoitecer (hora azul), asfalto seco `#1a1b1d`, muro dos boxes à esquerda com o pit board diegético, holofotes âmbar dos boxes acendendo ao fundo como discos de bokeh, painel de largada com cinco luzes vermelhas apagadas acima da pista. Fundo `#0c0f13` (grafite de boxes). Poeira ambiente ligada.
- **Estado do carro — início:** planta técnica: carroceria como wireframe ciano `#38e8ff` semitransparente (`blueprint = 1`, aplicado por nó do `main_body` às asas em camadas), rodas já sólidas girando devagar (`speed = 0.12`, volta de apresentação), suspensão em altura estática, `drs = 0`, `steer = 0`, `steering_wheel_leds` apagados. **Fim:** carro inteiramente materializado — carbono sarjado (bake do "Carbon Fiber Procedural"), pintura azul-petróleo com flakes sobre `texture_main_color` recolorida, faixa de composto vermelha (macio) — `blueprint = 0`, `speed = 0.55`, LEDs do volante subindo com o giro, largada.
- **Coreografia de câmera (função de `L`):**
  - `0.00–0.18` — Sem capítulo anterior; a câmera nasce no **dolly de nariz a asa traseira** (mov. 1): 0,45 u do chão, 1,2 u lateral, deslizando do bico à asa traseira enquanto o wireframe rola na volta de apresentação. DOF curto (range 1,5), bokeh 3,2. Título entra em `0.02–0.20` como contorno ciano, preenche em marfim.
  - `0.18–0.50` — **Contra-plongée de lançamento** (mov. 2), estável: câmera no asfalto (y 0,15), 2 u à frente do bico, 12° para cima; asa dianteira no terço inferior, halo e asa traseira alinhados em cima; o muro e o pit board à esquerda, na coluna de texto (R4). O mundo rola devagar sob o carro.
  - `0.50–0.80` — `camera.movimento`: recuo lento de 1,2 u e subida de 0,4 u (o carro vira "inteiro" no quadro). Materialização: `blueprint` 1 → 0 do bico para a asa traseira (varredura por eixo X, a mesma direção do dolly inicial). Pit board acende: `ALVO 1:38.500 · JUIZ: CRONÔMETRO`.
  - `0.80–0.86` — As cinco luzes vermelhas acendem uma a uma (emissivo `#ff3b1a`, uma por 1,2% de `L`).
  - `0.86–1.00` — Luzes apagam juntas em `0.86`; `speed` sobe a 0,55; **chicote lateral** de 30° para a direita motiva o **wipe diagonal** para o setor 1 (a diagonal entra na direção do pan). Rótulo `SETOR 1` aparece junto ao nó ativo do traçado durante a varredura.
- **Efeitos e partículas:** poeira ambiente; `blueprint` (linhas ciano com `uProgress`); `callouts` em `0.30–0.42` → `0.78–0.86` apontando o **pit board** ("Alvo", sub "escrito antes da volta"); bokeh de holofotes ao fundo; `sparks` zero; bloom 0,12 subindo a 0,3 nas luzes vermelhas.
- **Hotspots diegéticos (anel ciano, R5):**
  1. `pit board` (âncora no muro, objeto de cena) — **Alvo** — "1:38.500 é uma frase que o cronômetro julga verdadeira ou falsa. 'Ficar mais rápido' não é."
  2. `antennas` — **Referência** — "As antenas mandam a telemetria ao muro. É contra o dado gravado, não contra a memória do piloto, que o setup será conferido."
  3. `front_wing_top` — **Delimitação** — "Nesta volta só o flap superior da asa pode mudar. O resto está fora do escopo — e escrito."
  4. `floor` — **O que não pode piorar** — "Aston Martin, Canadá 2023: o piso deu downforce e tirou o carro da janela; Krack: 'não antecipamos os efeitos colaterais' (`#28`). O critério diz também o que não pode regredir."
- **Imagem-chave:** *Um carro de Fórmula 1 desenhado a linhas ciano rolando na hora azul, e o pit board com o tempo em branco — o alvo escrito antes de o carro existir.*
- **Transição de saída:** wipe diagonal padrão (−20°, borda fbm) motivado pelo chicote lateral, para o **Setor 1** noturno sob holofotes.
- **Emoção:** expectativa contida. Silêncio antes das luzes; a promessa de que a volta terá um fim conhecido.

---

### Capítulo 1 — SETOR 1

- **id:** `setor-1` · **slug:** `capitulo-1` · **nome:** Curvas
- **Título:**
  ```
  UMA CURVA,
  UMA MUDANÇA,
  UM MOTIVO.
  ```
- **Corpo:** Mexa numa variável por volta e saiba o que causou o quê.
- **Essência:** Altere uma variável por volta e deixe cada passo desfazível.
- **Lições:**
  1. **Ensaiar a volta** — Antes de gastar a volta, percorra-a: pontos-chave e o que muda em relação ao run anterior.
  2. **Uma mudança por volta** — Três correções juntas não têm causa; aplique a primeira, verifique, depois a segunda.
  3. **Passo reversível** — O tamanho certo da volta é o maior passo que ainda cabe num git revert.
- **Fato de pista (F1):** **A volta na cabeça é um plano diferencial** — Sebastian Vettel senta no carro parado, de olhos fechados, no sábado: "a classificação é muito crua, então você gasta tempo percorrendo a volta. Quais são os pontos-chave? Onde tem de melhorar em relação ao run anterior?"; Charles Leclerc "imagina a volta perfeita" antes da classificação (`#21`, formula1.com). Ensaiar é listar o que muda em relação à volta anterior — e só isso.
- **Ambiente 3D:** sequência de curvas rápidas à noite, holofotes 3.200 K de cima-atrás em 45° (silhueta com borda dourada), céu `#080a0e`, zebras vermelhas e brancas passando em riscos, guard-rail e postes instanciados que se teleportam à frente (o carro fica na origem, o mundo passa). Fundo breu de pit lane. Poeira estica em riscos na direção da velocidade.
- **Estado do carro — início:** montado, `speed = 0.55`, pintura completa, `drs = 0`. **Meio:** o **flap superior da asa dianteira** se destaca sozinho — `swap = 1`, `swapSet = [front_wing_top]`: contorno âmbar, afasta 0,15 u, o resto do carro escurece 40% — e gira 2° sobre o `front_wing_mount` (`flapAngle`, a única mudança da volta). **Fim:** flap reencaixado, `steer` oscilando com a curva (o `steering_wheel_main` gira junto com `front_tire`), `squat = 0.7` na curva rápida, `floor` tocando o chão, faíscas; na reta que fecha o setor, `drs` 0 → 1 (`rear_wing_drs` abre sobre o `drs_mechanism`); `speed = 0.75`.
- **Coreografia de câmera:**
  - `0.00–0.18` — Órbita de transição herdada (18%), da contra-plongée do grid para a vista de leitura.
  - `0.18–0.50` — **Chase lateral-traseiro 3/4** estável, 5 u, altura 1,1 u, trancado ao carro; a pista curva sob ele (UV do asfalto com curvatura animada), o holofote entra e sai pelo quadro a cada poste. Título à esquerda, dissolvendo em partículas na direção do movimento ao sair (R3).
  - `0.50–0.70` — `movimento`: **push-in** de 5 u para 2,2 u na asa dianteira; DOF fecha para range 0,8. `swap` sobe em `0.52–0.60`: o flap se destaca, callout "Flap dianteiro · +2°, a única variável". Ghost sutil (`ghost = 0.3`, `ghostOffset` −0,4 u) mostra o carro da volta anterior levemente atrás: a diferença de uma variável.
  - `0.70–0.86` — Flap reencaixa (`swap` → 0), câmera recua e desce ao nível do asfalto lateral, `squat` sobe: o carro comprime na curva rápida, faíscas do skid block em leque para trás. Ghost some.
  - `0.86–1.00` — A curva termina em reta; o DRS abre (`drs` 0 → 1 em `0.86–0.92`, a asa traseira "respira" de perfil); a câmera desliza para trás e para dentro (posição de freada); **wipe motivado por objeto**: a placa de 100 m de frenagem passa em primeiro plano desfocada e cobre o quadro por 8% de `L`; atrás dela, o setor 2. Rótulo `SETOR 2`.
- **Efeitos e partículas:** poeira estirada; `sparks` (origem `floor`, 3–6 u/s, ricochete) em `0.72–0.86`; `ghost` 0,3 em `0.52–0.70`; `swap` no `front_wing_top`; `steer`; `drs`; `callouts`; holofotes como bokeh de disco; grão 0,10.
- **Hotspots:**
  1. `front_wing_top` — **Uma variável** — "+2° no flap. Se a volta melhorar, foi isso. Se piorar, foi isso. Três mudanças juntas não têm autor."
  2. `floor` — **Passo pequeno** — "O assoalho raspa o asfalto e solta faíscas: o passo mais curto que ainda deixa marca. Commit por volta verificada, mensagem que diz o que a volta testou."
  3. `steering_wheel_main` — **Ensaio** — "Antes da volta, o piloto percorre a volta. Antes do prompt, leia os arquivos: 'me diga como isso funciona hoje, não edite nada ainda'."
- **Imagem-chave:** *Sob o holofote, um único flap de asa se solta em contorno âmbar de um carro escurecido a 200 km/h — a única coisa que mudou nesta volta.*
- **Transição de saída:** wipe motivado por objeto (placa de frenagem em primeiro plano) para o **Setor 2**.
- **Emoção:** precisão alegre. A velocidade é bonita, mas o que importa cabe em 2°.

---

### Capítulo 2 — SETOR 2

- **id:** `setor-2` · **slug:** `capitulo-2` · **nome:** Freada
- **Título:**
  ```
  O CRONÔMETRO
  NÃO TEM
  OPINIÃO.
  ```
- **Corpo:** A volta só conta depois que o comando rodou e a saída foi lida.
- **Essência:** Rode a verificação inteira e leia a saída antes de acreditar.
- **Lições:**
  1. **Verificar o resultado** — Rodar a referência: o teste, o comando, a medição; cole as últimas linhas da saída.
  2. **Evidência conferida** — Saída de comando, log, número, diff. "Parece certo" e "deve funcionar" não são prova.
  3. **Suíte inteira** — A verificação roda tudo o que já estava verde, não só o teste da volta.
- **Fato de pista (F1):** **Precisão não é opinião** — a Mercedes roda com mais de **250 sensores** no carro num fim de semana, **17 barramentos CAN**, cerca de **30 MB por volta**, latência de **10 ms** nas corridas europeias; a decisão de setup nasce do dado cruzado, não da impressão (`#3`, mercedesamgf1.com). E quando o dado real contradiz o modelo, o dado vence: Hungria 2022, a Ferrari pôs Leclerc em pneus duros porque a simulação previa ganho; a pista já dizia o contrário; P1 virou P6 (`#30`).
- **Ambiente 3D:** a freada mais forte do circuito: reta longa terminando numa chicane, marcas de 100/50 m, holofotes brancos frios 6.500 K de cima (a única cena de key fria antes do túnel de vento imaginário — aqui a frieza é do dado), fundo aço `#0a1218`. À direita da pista, um plano invisível onde as ribbons de telemetria se desenham.
- **Estado do carro — início:** `speed = 0.75`, montado, `drs = 1` (aberto na reta). **Meio:** o DRS fecha primeiro (`drs` 1 → 0 em `0.18–0.22`: fecha-se a asa antes de frear — para de adicionar antes de medir); `brakeHeat` 0 → 1 (tambores `inside_cover` de `#2a2a2c` a brasa `#ff3b1a` → `#ff8a2a`, emissivo > 1,0, heat haze nas rodas dianteiras); em seguida o carro **vira constelação de sensores**: `sensors` 0 → 1 — carroceria a 15% de opacidade, 250 pontos ciano nos nós do modelo (`front_tire`/`rear_tire`, `inside_cover`, `front_pushrod`, `front_control_arms`, `rear_control_arms`, camadas da asa dianteira, `rear_wing_main_part`, `floor`, `main_body_inside`, `exhaust`), cada um ligado por fio fino à ribbon correspondente (`Constellation` reutilizada com máscara de progresso). **Fim:** carroceria volta, `brakeHeat` cai a 0,3, `speed = 0.45` entrando na chicane, `telemetry = 1` acompanhando o carro, `lcd_screen` mostrando o delta.
- **Coreografia de câmera:**
  - `0.00–0.18` — Órbita de transição.
  - `0.18–0.50` — **Push-in macro no tambor de freio** (mov. 5) já na pose final: 0,5 u da roda dianteira direita, target no centro do `inside_cover`, `worldFocusRange` 0,4; a fenda do tambor, o `front_wheel_cover` e os flakes da pintura em primeiro plano; o tambor esquenta durante a leitura do título (`brakeHeat` 0 → 1 em `0.18–0.42`, com o brilho vazando pela fenda). Título à esquerda em metal escovado (R3).
  - `0.50–0.66` — `movimento`: recuo para 3/4 traseiro a 5 u (pose do mov. 6). `sensors` 0 → 1: a carroceria some, os 250 pontos acendem do freio para o resto.
  - `0.66–0.86` — **Rack focus de telemetria** (mov. 6): câmera parada, só `worldFocusDistance` viaja do carro para as ribbons a 1,5 u da lente — velocidade (ciano), freio (âmbar), acelerador (verde), delta (roxo/verde/amarelo). As ribbons atravessam o carro (`depthTest false`). Callout "Sensor de pressão de freio · dado, não sensação".
  - `0.86–1.00` — `sensors` → 0 (a carroceria volta de fora para dentro), foco volta ao carro, a chicane termina em reta de boxes; **passagem de fumaça** curta dos pneus travando (2 quads de tela com fbm) cobre o quadro; atrás, o pit lane. Rótulo `BOX`.
- **Efeitos e partículas:** `brakeHeat` com haze (desktop) e 30 brasas subindo; `sensors` + `constellation`; `telemetry` ribbons; `callouts`; grão 0,10; bloom threshold 1,0 (só o disco passa); aberração cromática 0,0012 durante o rack focus.
- **Hotspots:**
  1. `inside_cover` (DD) — **Medido, não sentido** — "O tambor em brasa. Nenhum piloto lê temperatura; o sensor lê. 'Os testes passam' sem a saída colada é opinião."
  2. `lcd_screen` — **Suíte inteira** — "O display do volante mostra o delta da volta toda, não da curva boa. `npm test` completo, nunca um arquivo isolado."
  3. `front_pushrod` (DD) — **Dado vence o modelo** — "Hungria 2022: a simulação dizia que o pneu duro funcionaria; os outros carros na pista já mostravam que não. A Ferrari seguiu o modelo (`#30`)."
  4. `front_wing_side_plates` — **Calibrar o verificador** — "Nenhum túnel correlaciona 100% (Smedley). Flow-vis e rakes medem na pista os mesmos pontos do túnel (`#4`). Um teste que não reflete a realidade é pior que nenhum."
- **Imagem-chave:** *Na freada, o carro se dissolve em 250 pontos ciano presos por fios a fitas de luz, e o foco abandona o disco em brasa para pousar no número.*
- **Transição de saída:** passagem de fumaça dos pneus para o **Box** (pit lane noturno).
- **Emoção:** sobriedade. O calor é bonito, mas o que decide é frio.

---

### Capítulo 3 — BOX

- **id:** `box` · **slug:** `capitulo-3` · **nome:** Box
- **Título:**
  ```
  1,80 SEGUNDOS
  PARA TROCAR
  SÓ O PLANEJADO.
  ```
- **Corpo:** Produza, critique e troque só o que a crítica apontou.
- **Essência:** Produza, critique com evidência e revise só o apontado — cada papel com um dono.
- **Lições:**
  1. **Produzir e criticar** — Gere a versão candidata e pergunte onde ela falha, antes de aceitá-la.
  2. **Revisar o necessário** — Cada mudança tem um problema listado como origem; reescrever tudo destrói o que estava certo.
  3. **Um dono por tarefa** — Produtor, crítico e verificador são papéis separados; o executor é escolhido pela tarefa.
- **Fato de pista (F1):** **A intervenção mínima, cronometrada** — McLaren, GP do Catar 2023, volta 27, Lando Norris: quatro pneus trocados em **1,80 s**, recorde mundial, batendo os **1,82 s** da Red Bull (Brasil 2019) com pneus de 18 polegadas maiores e mais pesados (`#1`, formula1.com). Cerca de **20 pessoas**, **3 por roda** (porca, tira, põe), 2 macacos, 2 estabilizadores, 2 na asa dianteira, 1 sinaleiro (`#2`, mercedesamgf1.com). Ninguém "melhora o carro" no box: troca-se o planejado e o cronômetro mede.
- **Ambiente 3D:** pit lane à noite, carro no limitador de velocidade; asfalto molhado de lavagem refletindo âmbar em listras (reflexo planar a 0,35 de resolução, só aqui e na chuva); a garagem aberta à esquerda com luz de painel fria `#3a5a78` e uma lâmpada de trabalho âmbar; pistolas pneumáticas e macacos entram como silhuetas (planos com alpha), sem mecânicos modelados. Semáforo do box no alto. Fundo `#080a0e`.
- **Estado do carro — início:** `speed` 0,45 → 0,12 (limitador), rodas quentes com graining (`wear = 0.6`). **Meio:** `pit` 0 → 1 — carro para (a única parada da experiência: exatamente 1,80 s de tempo de mundo, o cronômetro do box em display grande), macacos sobem 5 cm, **as quatro rodas saem em explosão lateral curta**, quatro rodas novas entram (composto médio, faixa amarela), flap dianteiro ajustado pelas duas silhuetas da asa (a única outra mudança permitida), macacos descem. **Fim:** carro sai do box, `speed = 0.5`, `wear = 0`, rodas novas girando, `swapSet = [front_tire×2, rear_tire×2, front_wheel_cover×2, rear_wheel_cover×2, front_wing_top]` com contorno âmbar que se apaga na saída. O `pit` ergue o carro pelos pontos de macaco (translação em y do `main_body` e das asas; `front_control_arms`/`rear_control_arms` estendem, as rodas ficam no lugar até saírem).
- **Coreografia de câmera:**
  - `0.00–0.18` — Órbita de transição enquanto o carro desacelera no limitador; a cabine do sinaleiro passa.
  - `0.18–0.50` — Vista de leitura: **altura de mecânico** (1,4 u, 3 u lateral, ligeiramente de frente), estável, trancada ao carro que desliza devagar pelo pit lane até a marca do box. Título à esquerda, sobre a porta da garagem. Cronômetro do box em `0.000`.
  - `0.50–0.62` — Carro chega à marca; `pit` sobe: macacos erguem (a câmera sente o solavanco: 2 cm de y). Início do **crane sobre o pit stop** (mov. 4).
  - `0.62–0.78` — Crane sobe em arco até 6 u quase vertical sobre o carro: as quatro rodas saem ao mesmo tempo em leque lateral (`explode` local nas rodas, 0,9 u) e as novas entram; cronômetro do box corre `0.000 → 1.800` mapeado em `L` (reversível ao rolar para trás — rolar para trás "desfaz" o pit stop). Callouts simultâneos nas quatro rodas: "porca · tira · põe".
  - `0.78–0.90` — Crane desce do outro lado; macacos descem; semáforo do box verde; o carro sai, contornos âmbar apagam; cronômetro congela `1.800` e ganha o rótulo `VERIFICADO`.
  - `0.86–1.00` — O carro acelera pela saída dos boxes; a **parede do pit wall** passa em primeiro plano desfocada e cobre o quadro (wipe motivado por objeto); atrás, o setor 3-A sob a ponte. Rótulo `SETOR 3`.
- **Efeitos e partículas:** reflexo planar do asfalto (desktop); `pit` (rodas, macacos, silhuetas de pistola com flash de luz âmbar em cada porca); `callouts` ×4; `swap` na saída; brasa fraca dos freios; sem haze (regra dos dois efeitos caros: reflexo + DOF curto). Grão 0,12 (cena escura).
- **Hotspots:**
  1. `front_tire` (DD) — **Um dono** — "Três pessoas nesta roda: uma solta a porca, uma tira, uma põe. Ninguém faz duas coisas. Produtor, crítico e verificador em três prompts separados."
  2. `front_wing_top` — **Só o apontado** — "O flap muda porque a telemetria do setor 2 apontou subesterço. Nada mais se toca. 'Corrija apenas os itens 1 e 3 da revisão.'"
  3. `front_control_arms` (DE) — **Pré-condição** — "Mônaco 2022: a Ferrari chamou os dois carros com 5 s de intervalo quando o double stack pedia 6; o 'stay out' chegou tarde; Leclerc caiu de P1 para P4 (`#29`). Se a pré-condição cai, a ação não começa."
- **Imagem-chave:** *Vista de cima, o carro erguido nos macacos com as quatro rodas suspensas no ar em leque, silhuetas de pistolas a faiscar, e o cronômetro do box congelado em 1.800.*
- **Transição de saída:** wipe motivado por objeto (pit wall) para o **Setor 3-A**.
- **Emoção:** concentração coletiva. Vinte pessoas e nenhuma opinião; só gesto e cronômetro.

---

### Capítulo 4 — FANTASMA

- **id:** `fantasma` · **slug:** `capitulo-4` · **nome:** Fantasma
- **Título:**
  ```
  SE O FANTASMA
  PASSAR,
  VOLTE ATRÁS.
  ```
- **Corpo:** Compare com a versão anterior; se piorou, reverta antes de corrigir.
- **Essência:** Critique em contexto separado e reverta ao último estado verde se piorou.
- **Lições:**
  1. **Crítico independente** — Quem critica não viu a justificativa de quem produziu: subagente ou sessão nova, só artefato e critério, partindo de "há um defeito".
  2. **Não mexer no teste** — Teste falha, problema no código; afrouxar a asserção é enganar o critério (Goodhart). Confira `git diff tests/`.
  3. **Reverter regressões** — Se a suíte inteira piorou, volte ao último estado verde antes de pensar em corrigir.
- **Fato de pista (F1):** **Reverter é o manual** — Ferrari SF-24, 2024: o piso de Barcelona deu mais downforce e induziu bouncing em curvas rápidas; em Silverstone a equipe fez A/B na sexta e **voltou ao piso e carroceria antigos nos dois carros**; a causa era uma **anomalia no túnel de vento**; o piso novo só chegou em Monza, onde Leclerc venceu (`#27`, the-race.com / motorsport.com). Rollback não é derrota: preserva o que funcionava enquanto se conserta o verificador.
- **Ambiente 3D:** setor 3-A, "a curva cega": trecho sob uma ponte/túnel curto de concreto com luzes de teto ciano `#38e8ff` em fila (rims), fundo aço; a saída da ponte abre para uma curva de raio longo. Aqui vive o **HUD de Condições** (§6). Fundo `#0a1218`.
- **Estado do carro — início:** rodas novas, `speed = 0.5`, `swapSet = [floor]` fraco (o piso é a peça sob suspeita). **Meio:** `ghost` 0 → 1 — segunda instância do carro em material aditivo ciano a 25%, na mesma posição, deslocada `ghostOffset` proporcional ao delta escolhido nas Condições (o fantasma é a **versão anterior**, a referência). Se o delta é positivo, o fantasma **passa** o carro; se negativo, fica para trás. **Reversão:** `swap = 1` no `floor` → o piso novo se solta 0,2 u, ganha contorno amarelo, e o piso antigo (mesma geometria com material escurecido, contorno verde) desliza de baixo para o lugar — metamorfose reversível ao rolar para trás. **Fim:** `ghost` 0, piso antigo instalado, `speed = 0.6`, saindo da ponte para a luz.
- **Coreografia de câmera:**
  - `0.00–0.18` — Órbita de transição por trás do pit wall; entrada na ponte.
  - `0.18–0.36` — **Travelling lateral** (mov. 7) exatamente perpendicular ao carro, 4,5 u, altura 0,9 u, estável, trancado; as luzes de teto passam em ritmo constante; o carro é cromo sob os rims ciano. Título entra `0.08–0.24`, sai `0.30–0.36` (janela antecipada do capítulo com aprofundamento, como o cap. 4 atual).
  - `0.36–0.63` — Ficha antecipada. `ghost` sobe em `0.36–0.44`. **Órbita A/B** (mov. 9) reduzida: meia órbita de 90° em torno de carro + fantasma, raio 7 u; no meio do arco a câmera passa entre os dois (o fantasma atravessa a lente em ciano aditivo). Callout "Assoalho · versão de Barcelona vs. anterior".
  - `0.58–0.63` — Ficha sai; `L ≥ 0.64` abre o **aprofundamento "Anatomia de uma volta"** (§5) sobreposto ao percurso, com o carro e o fantasma girando devagar atrás em bokeh.
  - `0.72–0.84` — Aprofundamento fecha; câmera baixa para o nível do assoalho; **reversão**: o piso troca (`swap`), o fantasma desacelera e recua até desaparecer atrás do carro (`ghostOffset` → −2 u, `ghost` → 0).
  - `0.86–1.00` — Saída da ponte: a última lâmpada ciano estoura em flare e o céu está fechado — **corte por luz**: rims apagam (4% de `L`), 2% de escuro só com o LED traseiro vermelho, e a luz cinza-azulada da chuva acende. Rótulo `CHUVA`.
- **Efeitos e partículas:** `ghost`; `swap` no `floor` com contorno amarelo/verde (cores de setor: piorou/melhorou); `telemetry` de delta por setor (linha do fantasma tracejada, linha âmbar do carro); poeira; rims ciano; grão 0,10. Sem reflexo, sem haze.
- **Hotspots:**
  1. `floor` — **Reverter** — "Silverstone 2024: A/B na sexta, piso antigo nos dois carros, causa achada no túnel. `git revert` custa segundos; perseguir quebras em cascata custa a temporada."
  2. `side_mirrors` — **Crítico independente** — "No espelho, o fantasma. Ele não sabe por que você mudou o piso; só corre. O revisor recebe o diff e o critério; nunca a justificativa."
  3. `rear_led` — **Evidência com placar bom** — "Red Bull RB20 2024, Waché: 'detectamos, mas o carro era rápido e não quisemos modificá-lo'. Custou o título de Construtores (`#26`)."
  4. `drs_mechanism` — **Não mexer no teste** — "Afrouxar a asserção é travar o DRS aberto na curva: a volta fica mais rápida no papel e o carro continua errado. Confira `git diff tests/`."
- **Imagem-chave:** *Sob uma fila de luzes ciano, o carro e seu fantasma translúcido correm lado a lado, e o piso novo se solta em contorno amarelo enquanto o antigo desliza de volta ao lugar.*
- **Transição de saída:** corte por luz (blackout com LED vermelho) para a **Chuva**.
- **Emoção:** humildade. Ser passado pelo próprio fantasma dói menos que insistir.

---

### Capítulo 5 — CHUVA

- **id:** `chuva` · **slug:** `capitulo-5` · **nome:** Chuva
- **Título:**
  ```
  DUAS FALHAS,
  RESET.
  TRÊS, PARE.
  ```
- **Corpo:** O orçamento acaba antes da teimosia: troque o contexto, não o alvo.
- **Essência:** Fixe o orçamento; na segunda falha, reset com o que aprendeu; na terceira, pergunte.
- **Lições:**
  1. **Orçamento de volta** — Teto explícito de voltas, tokens e minutos, declarado antes; contexto acima de 40% pede corte.
  2. **Regra 2 e 3** — Duas falhas seguidas no mesmo problema: `/clear` com prompt refinado. Três: parar e perguntar.
  3. **Reset com prompt refinado** — O novo prompt carrega o erro exato, os arquivos, a hipótese descartada e o comando de verificação.
- **Fato de pista (F1):** **Bandeiras são critérios de parada graduados** — regulamento FIA: amarela simples, perigo no setor, proibido ultrapassar; amarela dupla, prepare-se para parar; safety car, posições congeladas; vermelha, sessão interrompida, todos ao pit lane; ultrapassar sob amarela custa penalidade de tempo ou exclusão (`#11`, astonmartinf1.com). E o limite se fixa antes da deriva virar falha: Catar 2023, microsseparação no flanco do pneu pelos zebras de 50 mm, FIA impôs **máximo de 18 voltas por jogo** e ao menos 3 paradas em 57 voltas (`#14`, autosport.com).
- **Ambiente 3D:** setor 3-B, a última curva, céu fechado; luz ambiente cinza-azulada `#4a5c6e` de todos os lados, sem sombras duras; asfalto molhado `#0e1013` (roughness 0,12, reflexo planar a 0,35); painéis de bandeira na lateral (LED amarelo, depois vermelho); torre do safety car ao longe. Fundo cinza-tempestade `#0d1216`. Gotas na lente (shader herdado de `Fog.js`).
- **Estado do carro — início:** `rain` 0 → 1 em `0.05–0.30`: spray traseiro (rooster tail), `rear_led` piscando (`ledLevel` intermitente), `drs = 0` travado, pneus médios lisos deslizando, `wear` sobe rápido (0 → 0,8: graining, o contexto degrada). **Meio — falha 1:** aquaplanagem leve, `squat` negativo, o carro sai 0,3 u da trajetória e volta; bandeira amarela. **Falha 2:** o carro perde 0,6 u, spray cobre a lente; amarela dupla; **blackout** (corte por luz) = reset; a luz volta e o carro reaparece **com intermediários** (faixa verde) e `wear = 0`: o mesmo carro, com o que aprendeu sobre a pista. **Falha 3 (mostrada como hipótese, não vivida):** bandeira vermelha nos painéis, o HUD mostra "PARAR E PERGUNTAR"; o carro segue em ritmo de safety car. **Fim:** `rain` 0,6 (chuva diminuindo), intermediários, `speed = 0.45`, `wear = 0.2`.
- **Coreografia de câmera:**
  - `0.00–0.18` — Órbita de transição no escuro, luz subindo; o spray já entra pela borda.
  - `0.18–0.36` — **Onboard (câmera T)** (mov. 8): posição da T-cam, FOV 70°, olhando à frente; gotas escorrem na lente e limpam rastros; a pista rola sob o carro, spray do próprio carro não aparece (está atrás). Título entra `0.08–0.24`, sai `0.30–0.36` (janela antecipada: capítulo com aprofundamento).
  - `0.36–0.63` — Ficha antecipada. **Falha 1** em `0.40–0.46`: deriva lateral; painel amarelo. **Falha 2** em `0.50–0.56`: deriva maior, o spray cobre a lente (passagem de spray); painel amarelo duplo; em `0.56–0.58` blackout; em `0.58–0.63` a luz volta, câmera recua da T-cam para 3/4 traseiro a 4 u (o carro inteiro, intermediários verdes, spray retroiluminado pelos holofotes dos boxes ao longe).
  - `L ≥ 0.64` — **Aprofundamento "Quatro armadilhas"** (§5) sobre o percurso; o carro segue em ritmo constante atrás, em bokeh.
  - `0.74–0.84` — Aprofundamento fecha; câmera lateral baixa; painéis mostram bandeira vermelha por 6% de `L` como hipótese (o HUD explica "terceira falha: parar e perguntar"); o carro não acelera — mantém ritmo de safety car. Callout "Painel · a bandeira vem antes da teimosia".
  - `0.86–1.00` — A chuva abre; a última curva termina na reta de chegada; **passagem de spray** engrossa e dissipa revelando a reta seca com flashes ao longe. Rótulo `CHEGADA`.
- **Efeitos e partículas:** `rain` (rooster tail 2.000 sprites, gotas na lente, roughness do asfalto), reflexo planar (desktop), `wear`, painéis de bandeira emissivos (`#ffd23f` / `#ff3b1a`), corte por luz, `callouts`, grão 0,12, aberração 0,0015 no blackout. Sem haze, sem ghost.
- **Hotspots:**
  1. `rear_tire` (TE) — **Limite antes da deriva** — "Catar 2023: 18 voltas por jogo, fixadas antes da corrida, não quando o pneu abriu. Contexto degrada em silêncio; fixe o teto antes."
  2. `rear_led` — **Bandeira** — "Amarela: não avance escopo. Dupla: prepare o reset. Vermelha: pare e nomeie o que interrompeu. Ultrapassar sob amarela é penalidade — insistir também."
  3. `antennas` — **Prompt refinado** — "O reset não é repetir. Copie antes do `/clear`: erro exato, arquivos, hipótese descartada, comando de verificação. O carro voltou com intermediários porque o rádio trouxe a leitura da pista."
  4. `main_body_inside` — **Orçamento** — "Red Bull estourou o teto de 2021 em £1,864 mi: US$ 7 mi de multa e 10% a menos de túnel por 12 meses (`#10`). Gastar além do orçamento custa iterações futuras."
- **Imagem-chave:** *Pela lente da câmera T, gotas escorrendo, o painel amarelo dobra e o mundo apaga — e volta com o mesmo carro sobre pneus de faixa verde, o spray retroiluminado como uma cortina.*
- **Transição de saída:** passagem de spray para a **Chegada**.
- **Emoção:** alívio disciplinado. Parar no tempo certo é uma habilidade, não uma derrota.

---

### Capítulo 6 — CHEGADA

- **id:** `chegada` · **slug:** `capitulo-6` · **nome:** Bandeira
- **Título:**
  ```
  A BANDEIRA
  DECIDE.
  O REGISTRO FICA.
  ```
- **Corpo:** Resultado, risco ou limite: a volta termina nomeada e anotada.
- **Essência:** Encerre nomeando a saída e registre a volta para a próxima.
- **Lições:**
  1. **Critério atingido** — Verificação final colada, suíte verde, crítico sem defeito com evidência; depois disso, congele.
  2. **Risco identificado** — A volta revelou algo que muda a decisão: interface, dados, custo; o loop para e devolve a decisão ao humano.
  3. **Limite: inconclusivo** — Orçamento acabou; relatório de três partes: tentado, descartado, a decidir. É a entrada da próxima sessão.
- **Fato de pista (F1):** **Critério atingido é congelar** — parc fermé, regra FIA: a partir da classificação a especificação fica congelada até a largada; permitido só pneus, combustível, sangria de freios e ângulo da asa dianteira; mudar o setup significa **largar do pit lane** (`#9`). "Só mais um ajuste" depois da verificação reabre o ciclo inteiro. E o risco não declarado custa caro: Abu Dhabi 2021, a Mercedes manteve Hamilton na pista com pneus de 44 voltas apostando que a corrida acabaria sob safety car; a relargada veio na última volta (`#31`).
- **Ambiente 3D:** a mesma reta dos boxes do capítulo 0, agora à noite, seca; o pit board no muro à esquerda; linha de chegada com bandeira quadriculada; flashes de fotógrafos na arquibancada como bokeh branco; depois, na volta de desaceleração, a luz do mundo se apaga e sobram **três monitores do pit wall** (ciano, magenta, marfim) refletidos no carro — o ambiente de debrief sem trocar de lugar. Fundo preto-vinho `#0c0a0d` no final.
- **Estado do carro — início:** intermediários, `speed = 0.45`, `rain = 0.2` secando. **Meio:** cruza a linha em `speed = 0.7`, `drs = 1` na reta, `steering_wheel_leds` todos acesos; flash único de fotógrafos (o único da experiência) no instante do cronômetro; o setor 3 do HUD fica **roxo**. Em seguida o DRS fecha e trava (`drs` → 0, o `drs_mechanism` recebe o mesmo contorno âmbar) e `silhouette` 0 → 1: key apaga, três rims coloridos sobem, o carro vira contra-luz; o `front_wing_top` ganha um lacre âmbar (parc fermé: a única peça que ainda pode mudar é a que fica marcada). **Fim:** silhueta rolando devagar (`speed = 0.15`, volta de desaceleração), `telemetry = 1` (a volta inteira como fita ao lado do carro), bloom subindo a 0,55; o carro não para.
- **Coreografia de câmera:**
  - `0.00–0.18` — Órbita de transição saindo do spray para a reta seca.
  - `0.18–0.50` — **Contra-plongée de lançamento** (mov. 2), a **mesma pose** do capítulo 0 (`camera [0, 0.15, z]`, 12° para cima), estável, trancada ao carro; o muro e o pit board à esquerda mostrando ainda `-:--.---`. Título entra `0.08–0.24`, sai `0.30–0.36` (janela antecipada).
  - `0.36–0.63` — Ficha antecipada. Em `0.44` o carro cruza a linha: flash de fotógrafos (2 frames a 60% de branco, aberração 0,004 por 0,2 s), pit board vira `1:38.412 · CRITÉRIO ATINGIDO`, setor 3 roxo no HUD, lacre âmbar na asa. Registro automático da volta no livro de bordo (§6).
  - `L ≥ 0.64` — Sem aprofundamento próprio; em vez disso, o **mapa do loop** (anel de 4 fases: Preparar, Uma volta, Controlar, Encerrar) abre sobre o percurso com as três saídas como três luzes do painel de largada: verde (resultado), âmbar (risco), vermelha (limite) — o aluno clica cada uma e o pit board mostra o texto correspondente.
  - `0.72–0.97` — **Recuo de debrief** (mov. 10): a câmera parte de um close na viseira e recua 12 u em linha reta; a luz do mundo apaga, os três monitores acendem, o carro vira silhueta pequena e viva no centro, ribbons da volta inteira ao lado; o pit board, por último, vira: `PRÓXIMA VOLTA · ENTRADA: REGISTRO DESTA`.
  - `0.97–1.00` — Créditos. Sem wipe: o carro continua rolando em silhueta, ao infinito, sob o grão.
- **Efeitos e partículas:** flash de fotógrafos (uma vez); `silhouette`; `telemetry` completa; `finale` (bloom 0,55); poeira; lacre âmbar no `front_wing_top` e no `drs_mechanism`; grão 0,12; vinheta forte.
- **Hotspots:**
  1. `front_wing_top` — **Parc fermé** — "Depois da classificação, só pneus, combustível, freios e este ângulo. Mudar o resto é largar do pit lane. Depois do verde, não se 'melhora' sem reabrir o ciclo."
  2. `rear_tire` (TD) — **Risco identificado** — "Abu Dhabi 2021: pneus de 44 voltas, safety car, a aposta de que a corrida acabaria assim. O risco não nomeado decidiu o título (`#31`). Resultado parcial não é final."
  3. `steering_wheel_main` — **Debrief** — "McLaren, 2026: o diretor de engenharia abre pelas mudanças de setup, depois os engenheiros, depois a impressão dos pilotos — dado antes de sensação (`#8`). O registro que ninguém lê não existe."
- **Imagem-chave:** *O mesmo ângulo baixo do grid: o carro cruza a linha sob um único flash, o pit board que estava vazio recebe o número, e o carro segue como silhueta iluminada por três monitores, com a volta inteira escrita em luz ao seu lado.*
- **Transição de saída:** nenhuma; fim aberto sobre a silhueta rolando (o carro não para).
- **Emoção:** quietude ganha. A volta acabou porque foi nomeada; a próxima já tem a primeira linha.

---

### Verificação de não redundância (critério 5 do briefing)

| Cap. | Termos ensinados | Bloco do site |
|---|---|---|
| 0 Grid | Referência real · Critério verificável · Tarefa delimitada | Preparar (3/3) |
| 1 Curvas | Ensaiar a volta · Uma mudança por volta · Passo reversível | extras 3.3, 3.4 e 3.14 (ensaio = plano diferencial, F1 `#21`) |
| 2 Freada | Verificar o resultado · Evidência conferida · Suíte inteira | Uma volta (1/3) + Controlar (1/3) + extra 3.15 |
| 3 Box | Produzir e criticar · Revisar o necessário · Um dono por tarefa | Uma volta (2/3) + extras 3.10/3.17 |
| 4 Fantasma | Crítico independente · Não mexer no teste · Reverter regressões | Controlar (2/3) + extra 3.2 |
| 5 Chuva | Orçamento de volta · Regra 2 e 3 · Reset com prompt refinado | extras 3.5, 3.6, 3.7 |
| 6 Bandeira | Critério atingido · Risco identificado · Limite: inconclusivo | Encerrar (3/3) |

Os 12 princípios do site aparecem uma vez cada; nenhum termo se repete. Registro de volta (3.16) e portão humano (3.11) entram pelo HUD e pelos hotspots do capítulo 6; reproduzir antes de corrigir (3.12) e causa raiz (3.13) entram no aprofundamento "Anatomia de uma volta".

Fatos F1 por capítulo (todos de `f1-licoes.md`, sem itens [NÃO CONFIRMADO]): Jerez 1997 (#12) · Vettel/Leclerc (#21) · Telemetria Mercedes (#3) + Hungria 2022 (#30) · McLaren 1,80 s (#1) + 20 pessoas (#2) · Ferrari SF-24 (#27) · Bandeiras (#11) + Catar 18 voltas (#14) · Parc fermé (#9) + Abu Dhabi 2021 (#31). Hotspots usam #28, #4, #29, #26, #10, #8.

---

## 5. Aprofundamentos

Dois slides no padrão de `PAGINAS` (rótulo, título, lead, imagem, metáfora, 4 seções × 3 itens). O primeiro abre no capítulo 4 (Fantasma), o segundo no capítulo 5 (Chuva) — os dois capítulos de peso 5.0, como os índices 4 e 5 do site atual.

### 5.1 `volta` — Anatomia de uma volta

- **Rótulo:** Fantasma · aprofundamento
- **Título:** Anatomia de uma volta
- **Lead:** Produzir. Criticar. Revisar. Verificar.
- **Imagem:** `pagina-volta.jpg` — render do carro visto de cima com o traçado do Anel de Precisão desenhado em âmbar ao redor, os sete nós marcados, o box no meio.
- **Metáfora:** Uma volta, um cronômetro, uma decisão.
- **Seções:**
  1. **Antes da largada** — Reproduza o erro antes de corrigir · Escreva o teste que falha · Declare o teto: voltas, tokens, minutos
  2. **Na pista** — Uma variável por volta · Commit por volta verificada · Suíte inteira, nunca um arquivo só
  3. **No box** — Crítico recebe só diff e critério · Corrija só os itens listados · Cole a saída do comando
  4. **Na chegada** — Causa raiz, não sintoma · Uma linha de registro por volta · Nomeie a saída: resultado, risco ou limite

### 5.2 `armadilhas` — Quatro armadilhas

- **Rótulo:** Chuva · aprofundamento
- **Título:** Quatro armadilhas
- **Lead:** Cada armadilha é um princípio que faltou.
- **Imagem:** `pagina-armadilhas.jpg` — quatro painéis de bandeira lado a lado (amarela, amarela dupla, safety car, vermelha) refletidos no asfalto molhado.
- **Metáfora:** A bandeira sobe antes da batida.
- **Seções:**
  1. **Loop que não converge** — Diff cresce a cada volta · Suíte oscila sem tendência · Reverter ao verde e dividir a tarefa
  2. **Avaliador complacente** — Crítico com o contexto do produtor · Aprovação sem arquivo e linha · Plante um defeito e veja se ele acha
  3. **Overfitting ao critério** — Teste afrouxado, skip, mock · Passa o critério, falha o uso · Proíba editar tests e peça a causa
  4. **Custo explodindo** — Contexto acima de 60% · Horas no mesmo tópico · Teto antes, reset nos gatilhos, registro

---

## 6. HUD e interações

Pele nova sobre a estrutura do `index.html` atual (dots, menu, ficha, registro, tooltip, progresso, dica, créditos, `.sr-only`).

- **Pontos de capítulo → traçado do Anel de Precisão.** SVG de ≈120×160 px à direita: linha fina `#8a9099` com o desenho do circuito e sete nós (Grid, S1, S2, Box, S3-A, S3-B, Chegada); o box é um desvio da linha principal, no meio. O trecho percorrido colore-se de âmbar; o nó ativo recebe o anel giratório do hotspot; durante o wipe, o rótulo do próximo nó aparece à esquerda (como "REAL WORLD TESTING" em corn-12) e some depois de 2 s.
- **Barra de progresso → cronômetro de volta.** Fio âmbar de 2 px no topo; ao lado do logo, `output` em Bebas com `tabular-nums` correndo de `0:00.000` a `1:38.412` em função do progresso global — com uma pausa de 1,800 s de "tempo de mundo" durante o pit stop (o cronômetro da volta continua; o do box aparece separado). É diegético: "o cronômetro manda".
- **Pit board diegético (novo).** Placa no muro, objeto 3D com textura canvas; recebe estados por capítulo: alvo (cap. 0), `+2° FLAP` (cap. 1), `SENSORES 250` (cap. 2), `BOX 1.800` (cap. 3), `DELTA` da condição escolhida (cap. 4), `AMARELA / DUPLA / VERMELHA` (cap. 5), resultado e "próxima volta" (cap. 6). Em retrato, o pit board vira faixa no topo, sobre o texto.
- **Livro de bordo (registro).** A gaveta `.registro` mantém lista, exportação JSON e limpar; tipos `leitura | mudança | volta`. Cada capítulo grava automaticamente uma linha ao entrar na ficha (`gatilho: ficha`): hipótese, mudança, comando, resultado, decisão — as cinco colunas do registro de volta. Cap. 0: "Alvo 1:38.500; juiz: cronômetro". Cap. 1: "Flap +2°; reversível". Cap. 2: "Freio DD em brasa; suíte inteira verde". Cap. 3: "4 pneus + flap; 1,800 s; verificado". Cap. 4: "Piso novo +0,18 s vs fantasma; revertido". Cap. 5: "2 aquaplanagens; reset; intermediários". Cap. 6: "1:38.412; critério atingido; congelado". Delta com cor de setor (roxo/verde/amarelo). Exportar JSON = "levar o debrief para casa". Chave de storage própria: `f1-loop:livro-de-bordo`.
- **Condições (cenários) — capítulo 4.** Substitui `frio/calor/impacto/posicao` por quatro variantes com `desvio` em segundos por volta e `serie` de 12 amostras (delta por trecho) para o gráfico `#drift`: `piso-novo` (+0,18 s: mais downforce, bouncing na curva rápida; o fantasma passa), `piso-antigo` (0,00 s: referência; o fantasma cola), `asa-mais-1` (−0,06 s: melhora e some a folga na reta), `macio` (−0,80 s até a volta 8, depois +1,8 s: degrada). Cada botão escreve `ghostOffset`, `swapSet` e `wear` no herói; o gráfico mostra a linha tracejada do fantasma e a âmbar do carro. O aluno **vê** quando reverter: sempre que a linha âmbar cruza para cima da tracejada.
- **Bandeiras (capítulo 5, interação leve).** Três botões diegéticos no painel lateral (amarela, amarela dupla, vermelha). Clicar move o scroll para o trecho da falha correspondente (como `scroll.to(i, t)`) e o pit board explica a regra: 1 = não avance escopo; 2 = `/clear` com prompt refinado; 3 = parar e perguntar. Não há estado próprio: é navegação.
- **Três saídas (capítulo 6).** Sobre o mapa do loop, três luzes do painel de largada (verde, âmbar, vermelha). Clicar mostra no pit board o texto de encerramento correspondente e grava no livro de bordo uma linha `decisão` com o tipo escolhido. É o único lugar onde o aluno "decide"; a experiência não julga a escolha, mostra o que cada uma exige (verificação colada / plano para o humano / relatório de três partes).
- **Hotspots.** Anéis ciano (R5) ancorados por `hotspots[i].peca` na lista fechada de nós; tooltip DOM com nome + texto; cada clique grava `leitura` no livro de bordo. Variante grande com texto dentro (`ABRIR A ANATOMIA`, `VER AS ARMADILHAS`) nos capítulos 4 e 5, em `L ≈ 0.58`, para abrir os aprofundamentos.
- **Dica de scroll:** "Role para sair do grid"; seta de pit lane âmbar. Em mobile retrato: texto no topo, carro embaixo, pit board como faixa.
- **Ficha:** layout à esquerda (R4); bloco "Fato de pista" com borda âmbar e `small` com equipe e ano; lições com numerais romanos I–III.
- **Acessibilidade:** `.sr-only` por seção com nome, título, corpo, hotspots, essência, lições e fato de pista; `prefers-reduced-motion`: câmera fixa `[0, 0.2, 7.3]`, mundo parado, estados do carro por cross-fade de opacidade (blueprint, sensores, ghost, silhueta), sem spray/faíscas/haze; a narrativa lê inteira sem movimento. Fallback sem WebGL: texto corrido de `CAPITULOS` + os dois aprofundamentos.
- **Créditos:** "Fatos de pista verificáveis (fontes em f1-licoes.md); tempos de volta, deltas e o Anel de Precisão são ilustrativos. Licença poética: a entrada dos boxes fica no meio da volta."

---

## 7. Paleta e tipografia

Base de `gramatica-visual.md` §2.1, com uma temperatura por capítulo (R12: três cores por ambiente).

| Papel | Nome | Hex |
|---|---|---|
| Fundo base (`--bg`) | Asfalto noturno | `#07090c` |
| Tinta (`--ink`) | Marfim de pit wall | `#ebe6dc` |
| Secundário | Cinza de fita de carbono | `#8a9099` |
| Acento quente (`--amber`) | Âmbar incandescente | `#ff8a2a` |
| Acento extremo | Brasa de freio | `#ff3b1a` |
| Acento frio (`--cyan`) | Ciano de telemetria | `#38e8ff` |
| Setor roxo | Melhor de todos | `#b04cff` |
| Setor verde | Melhorou | `#4dffb0` |
| Setor amarelo | Piorou / bandeira | `#ffd23f` |
| Pintura do carro | Azul-petróleo metálico | `#0f3a47` base / `#2c7a8c` flake |
| Carbono | Carbono nu | `#15171a` / `#3b3f45` |

Temperatura por capítulo (`cor` de fundo do wipe / acento):

| Cap. | Fundo | Acento | Luz |
|---|---|---|---|
| 0 Grid | `#0c0f13` | ciano `#38e8ff` (blueprint) → âmbar na largada | hora azul + holofotes âmbar |
| 1 Curvas | `#080a0e` | âmbar `#ff8a2a` | holofotes 3.200 K de cima-atrás |
| 2 Freada | `#0a1218` | brasa `#ff3b1a` → ciano nas ribbons | key branca fria 6.500 K |
| 3 Box | `#080a0e` | âmbar `#ff8a2a` | lâmpada de trabalho âmbar + painel frio |
| 4 Fantasma | `#0a1218` | ciano `#38e8ff` / amarelo-verde de setor | rims ciano de teto |
| 5 Chuva | `#0d1216` | amarelo `#ffd23f` → vermelho `#ff3b1a` | ambiente cinza-azulado, LED traseiro |
| 6 Bandeira | `#07090c` → `#0c0a0d` | roxo `#b04cff` → monitores ciano/magenta/marfim | flash único, depois só monitores |

Regra R10 sempre: sujeito quente, mundo frio — exceto o capítulo 6, onde o calor migra do carro para o dado (monitores).

Materiais (§2.2 da gramática): carbono sarjado procedural com clearcoat; pintura com flakes por `clearcoatNormalMap` e iridescência 0,15; borracha com sheen e `uWear`; discos com rampa de corpo negro e emissivo > 1,0; titânio raspado na prancha; viseira com `transmission`. Blueprint: segundo material de linhas (`EdgesGeometry` ou wireframe com `uProgress`) ciano aditivo. Fantasma: mesma geometria, material aditivo ciano a 25%.

Tipografia: **Bebas Neue** para títulos 3D (troika, `fontSize 0.5`, `maxWidth 3.5`, tracking 0,01, contorno → cheio → metal escovado → dissolução), pit board e cronômetro (`tabular-nums`); **Lato** para corpo (`0.115`, `maxWidth 3.1`) e ficha; rótulos em caixa alta com `letter-spacing .22em`. Títulos usam só o conjunto pré-carregado (A–Z, acentos, dígitos, `. , : ; + - % /`); a vírgula decimal de "1,80" está no conjunto.

Pele de filme (R9): grão 0,10 (0,12 no box, chuva e final), vinheta 0,62, aberração 0,0008 (picos de 0,0015 no rack focus e 0,004 no flash).

---

## 8. Riscos e o que é caro de fazer

1. **N = 7 capítulos.** O site atual tem `N = 6` hardcoded em `Scroll.PESOS`, `cameraPath` (clamp 0..5), `Director.switch`, `Registro.FASES`, `Callouts.ROTULOS`, `ui.js` e no teste. Mudar para 7 toca todos esses pontos. Alternativa de contingência sem perder o ângulo: fundir **Setor 1 e Setor 2** num capítulo "Setores" com quatro lições (uma mudança por volta, passo reversível, verificar o resultado, evidência conferida) — a ficha aceita até cinco romanos. Recomendação: ir para 7 e parametrizar `N` de uma vez (é uma constante por módulo).
2. **Pose de leitura versus câmera em movimento.** O teste atual exige `pose(0.5) === pose(0.7)`. Este tratamento mantém a câmera estável em `0.18–0.50` e declara `movimento[]` só em `0.50–0.86`; o teste precisa ser ajustado para "estável na janela do título" em vez de "estável até a saída". O carro "nunca para" porque o mundo rola (UV do asfalto, postes instanciados), não porque a câmera se move — isso preserva reversibilidade e legibilidade.
3. **Mundo que passa pelo carro.** Não existe pista: 40 u de asfalto com UV animado, curvatura simulada por deformação do trecho (shader de bend leve), guard-rail e postes em 20 instâncias que se teleportam. A "curva" dos setores 1 e 3 é o asfalto se dobrando, não a câmera virando. Custo baixo; risco de parecer esteira se a curvatura e a luz dos postes não estiverem sincronizadas — protótipo cedo com o Kenney Car Kit (CC0), como sugere `modelos-3d-f1.md`.
4. **Pit stop em 1,80 s reversível.** O cronômetro do box mapeado em `L` significa que rolar para trás desmonta o pit stop; é correto para o contrato e pedagógico (a volta desfeita). Sem mecânicos: pistolas e macacos como silhuetas; o crane e o flash de cada porca vendem a cena. Risco: parecer vazio — mitigar com os quatro callouts simultâneos e o som visual do flash.
5. **Fantasma e A/B.** Segunda `Mesh` com a mesma geometria (custo de GPU não duplica), material aditivo; a órbita A/B reduzida a 90° cabe nos limites de `|x| ≤ 1.2` se a órbita for feita deslocando o **par** de carros e não a câmera — decidir na fase de código. Em retrato, o fantasma sobreposto substitui o lado a lado.
6. **Chuva.** Spray (2.000 sprites, 1 draw call) + gotas na lente (shader herdado de `Fog.js`) + reflexo planar a 0,35. É o capítulo mais caro junto com o box (reflexo). Regra dos dois efeitos caros: chuva desliga haze e ghost; em mobile, sem reflexo planar (só `clearcoat` no asfalto).
7. **Constelação de sensores (cap. 2).** 250 pontos + fios até ribbons: `Constellation.js` já faz segmentos instanciados; as âncoras são os nós nomeados do modelo local (tabela do §4). A separação de peças, maior incerteza em `modelos-3d-f1.md`, está resolvida pelo `.blend` do autor — resta confirmar no Blender que as rodas/suspensões são instâncias separáveis em quatro (DE/DD/TE/TD) e não uma malha espelhada por modificador.
8. **Blueprint (cap. 0).** Wireframe com varredura por eixo exige `EdgesGeometry` por peça (o modelo tem ≈45 objetos: dobra os draw calls) ou um shader de linhas em `onBeforeCompile` sobre a malha (custo zero de draws, qualidade menor). Decidir por protótipo.
9. **Modelo do carro e licença.** Herói = o F1 2026 genérico do autor (`assets-locais-f1-2026.md`, part7 texturizado): peças separadas e nomeadas, DRS articulável, suspensão, rodas, volante com LEDs e display. Trabalho de pipeline: bake do carbono procedural (o Blender não exporta procedural para glTF), troca das stickers de terceiros (`texture_main_stickers.png`, `pzero_white.png`, `f1_fia_logo.png`) pela identidade da aula, recolorir `texture_main_color.png` para azul-petróleo, Subdivision fixa + Decimate nos internos, glTF Draco + KTX2, teste automático de nós obrigatórios e ausência de marcas. Riscos próprios: licença dos project files do tutorial não localizada (confirmar na descrição do canal; alternativa: re-modelar detalhes e tornar autoral); dependências externas ausentes (`Roughness_2K.jpg`, HDRI BlenderKit); realismo "tutorial de alta qualidade" — o fotorrealismo virá da luz, do pós e do carbono baked, não da malha. Plano B: W13 Concept (nickbroad, CC BY) re-texturizado. Nenhuma marca no modelo; equipes e anos só no texto da aula. Metas: ≤ 6 MB desktop / ≤ 3 MB mobile, ≤ 250k / 80k tris, < 100 draw calls.
10. **Licença poética do box no meio da volta.** Declarada nos créditos e no `.sr-only`. Alternativa fiel à F1 (box no fim da volta, antes da chegada) quebraria o ângulo "o loop para no meio"; manter a licença, explicada.
11. **Reduced-motion e fallback.** Todo o ângulo é movimento; em `prefers-reduced-motion` o carro fica parado e os estados trocam por cross-fade — a narrativa precisa ler bem assim (por isso os títulos e corpos não dependem de "veja o carro passar"). Fallback sem WebGL: texto corrido; o pit board vira texto.
12. **Títulos e caracteres.** Nenhum título usa `?`, `!` ou travessão; "1,80 SEGUNDOS" usa vírgula e dígitos do conjunto pré-carregado; linhas ≤ 16 caracteres ("O REGISTRO FICA." tem exatamente 16 — verificar largura no troika).
13. **Fatos de F1.** Todos vêm da tabela-mestra e das histórias de falha de `f1-licoes.md`, com número da linha; nenhum item [NÃO CONFIRMADO] foi usado (sem "tire the race in your head", sem citação de Stella, sem valor da AOM, sem protesto do DAS). O caso Racing Bulls 2026 (`#7`) não foi usado por prudência com datas recentes.
