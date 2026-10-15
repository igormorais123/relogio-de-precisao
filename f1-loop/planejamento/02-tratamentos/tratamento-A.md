# Tratamento A — "SETOR ROXO"

Ângulo: **o loop é um fim de semana de corrida.** Quinta (preparar) → sexta, treinos livres (voltas de iteração) → madrugada no simulador (crítico independente) → sábado, classificação (critério) → domingo, pit stop e chuva (controle sob pressão) → domingo à noite, debrief (encerrar).
Data: 2026-09-12. Contrato: `00-briefing.md`. Fontes de fato: `01-pesquisa/f1-licoes.md` (números da tabela-mestra, #1–#31). Gramática: `01-pesquisa/gramatica-visual.md` (R1–R12, movimentos 1–10, estados do herói). Motor: `01-pesquisa/arquitetura-atual.md` (janelas de L, limites de câmera, schema v2).

Convenções deste documento: `L` = progresso local do capítulo (0..1). Toda animação é função de `L` e reversível. Distâncias em unidades de cena com o carro medindo ≈5,6 u.

**Peças do herói (nomes de nó).** O herói é o modelo local `F1_2026_tutorial_part7_textures.blend` (`01-pesquisa/assets-locais-f1-2026.md`): carro genérico das regras 2026, sem livery de equipe, com ≈40 objetos separados e nomeados. Hotspots, callouts, `swapSet` e a ordem de explodir/montar usam **exatamente esses nomes**, agrupados assim:

| Grupo de coreografia | Nós do modelo |
|---|---|
| `asa_dianteira` | `front_wing_bottom`, `front_wing_middle`, `front_wing_top` (flap ajustável), `front_wing_side_plates`, `front_wing_mount`, `front_flap_detail` |
| `asa_traseira` | `rear_wing_main_part`, `rear_wing_drs` (aba móvel), `drs_mechanism`, `drs_holder`, `rear_wing_side`, `rear_wing_top_mount`, `rear_wing_holder`, `rear_wing_bottom_holder`, `rear_led` |
| `corpo` | `main_body`, `main_body_inside`, `main_body_glass`, `top_intake_details` (airbox), `side_mirrors`, `antennas`, `exhaust` |
| `assoalho` | `floor` |
| `suspensao_D` / `suspensao_T` | `front_control_arms`, `front_pushrod` / `rear_control_arms`, `rear_driveshaft` |
| `rodas` | `front_tire`, `rear_tire`, `front_wheel_cover`, `rear_wheel_cover`, `inside_cover`, `rear_inside_cover` (instâncias esquerda/direita: sufixo `_L`/`_R` na exportação) |
| `cockpit` / `volante` | `steering_wheel_main`, `steering_wheel_handles`, `steering_wheel_buttons`, `steering_wheel_leds`, `lcd_screen`, `sw_connection` |
| **a fabricar** | `rake_DE`, `rake_DD` (grade de sondas, cap. 1), `macaco_D`, `macaco_T` (cap. 5), `esqueleto` (motor, câmbio e radiadores estilizados dentro de `main_body_inside`, caps. 1 e 7) |

O halo não é objeto separado (faz parte de `main_body`); onde a narrativa precisa do halo como âncora, usa `main_body_glass` (viseira/para-brisa) ou separa a sub-malha no Blender (ver riscos). Não há disco de freio: o calor de freio é emissivo em `inside_cover` / `rear_inside_cover`.

---

## 1. Título e logline

**Título:** SETOR ROXO
(na F1, setor roxo = melhor tempo de todos naquele trecho; na aula, roxo = critério atingido com número na tela.)

**Logline:** Da garagem de quinta ao debrief de domingo, um carro de Fórmula 1 é desmontado, testado contra a pista, cronometrado, revertido e registrado, para ensinar a única coisa que fecha um loop com IA: evidência, não sensação.

---

## 2. Tese pedagógica

O aluno sai sabendo **conduzir uma volta de trabalho com IA como uma equipe conduz um fim de semana**: antes de pedir qualquer coisa, fixa a referência real, o critério verificável e o orçamento (quinta); pede uma mudança por volta e lê a saída do comando antes de decidir (sexta); manda o artefato e o critério para um crítico que não escreveu o código (madrugada); aceita só o número, com a regra de desempate escrita antes, e congela o que passou (sábado); faz voltas pequenas e reversíveis, com um dono por tarefa e a pré-condição checada (pit stop); quando o novo quebra o antigo, volta ao último estado verde e conta as falhas: duas pedem reset com prompt refinado, três pedem uma pessoa (chuva); e encerra por uma das três saídas legítimas, deixando um livro de bordo que é a entrada do próximo ciclo (debrief).

Gesto mais transformador, ensinado cedo e repetido pelo carro: **"escreva o teste que falha antes de pedir a correção"** = "monte o rake aero antes de sair do box".

---

## 3. Arco em três atos

**O que está em jogo.** Um fim de semana tem um número finito de voltas, e o carro chega da fábrica sem saber se os números do túnel são verdade. Cada sessão é uma chance de aprender ou de se enganar com a mesma quantidade de dados. O aluno, com IA, vive o mesmo: contexto finito, respostas convincentes, e nada garante que "corrigi" corresponde ao mundo.

**Ato I — A pista ainda não falou (Quinta, Sexta).** O carro aparece em peças, um inventário flutuando na garagem. A tensão nasce da distância entre previsão e realidade: o túnel disse uma coisa, a pista ainda não disse nada. Na sexta a primeira volta é feita do jeito certo: dois carros, uma peça diferente, o mesmo asfalto. O ato fecha com um delta que tem dono.

**Ato II — O número contra a sensação (Madrugada, Sábado, Pit stop).** O carro vira gêmeo digital numa sala escura, e o gêmeo diverge do real: o verificador está errado, não a pista. No sábado, a volta perfeita é filmada da câmera T e termina num setor roxo e num lacre (parc fermé). No domingo, a volta mínima do loop, 1,80 s, mostra que iterar bem é executar o planejado e medir. O ato fecha com o carro saindo do box com pneus novos e a corrida aberta.

**Ato III — Volte ao último estado verde (Chuva, Debrief).** A chuva chega junto com um piso novo que passou no critério escrito e falhou no que não foi escrito. O carro salta, o contador de falhas sobe, a bandeira vermelha cai, e a resposta é reverter, não insistir. À noite, na sala de debrief, o carro se desmonta outra vez em peças flutuantes, como na quinta; mas agora cada peça carrega uma linha do livro de bordo. **A última cena responde à primeira:** na quinta, quarenta peças que não sabiam nada; no debrief, as mesmas quarenta peças, cada uma com o que aprendeu, montando-se sozinhas para o próximo fim de semana. O loop não termina, ele recomeça com uma entrada melhor.

---

## 4. Capítulos (7)

Janelas fixas herdadas do motor, salvo onde indicado: transição de câmera `L < 0.18`; título entra `0.08–0.24` (cap. 1: `0.02–0.20`), sai `0.40–0.50`; ficha `0.50–0.62 → 0.88–0.98`; wipe de saída `0.86–1.00`. Capítulos com aprofundamento (5 e 7): título sai `0.30–0.36`, ficha `0.36–0.63`, slide em `L ≥ 0.64`. Vista estável obrigatória entre `0.50` e `0.72` (teste `pose(0.5) === pose(0.7)`). Herói sempre à direita do texto em paisagem, lados alternando por paridade; retrato = texto em cima, carro embaixo.

### Capítulo 1 — `quinta` · Quinta

- **Título:** `QUINTA.\nA PISTA AINDA\nNÃO FALOU.`
- **Corpo:** O túnel previu; a referência real só existe onde o carro roda.
- **Essência:** Antes da primeira volta, fixe contra o que comparar, como saber que acabou e quanto pode gastar.
- **Lições:**
  - I. **Referência real** — Compare com a pista, não com outra previsão: teste que falha, dado medido, documento.
  - II. **Critério verificável** — Uma frase que um comando ou uma pessoa sem contexto julga verdadeiro ou falso.
  - III. **Orçamento e escopo** — Runs contados e diff pequeno, decididos antes de rodar; o que não está no programa não roda.
- **Lição F1:** **Nenhum túnel correlaciona 100%** — Rob Smedley (F1.com): a equipe mede os mesmos pontos de pressão no túnel e na pista, com rakes aero (grades de sondas Kiel atrás das rodas) e flow-vis (tinta que mostra a direção real do fluxo) nos testes e no FP1. O orçamento também é fixado antes: pelas regras ATR 2022–25, a base por período é 320 runs, 80 h de vento e 400 h de ocupação, escalonada de 70% (1º colocado) a 115% (10º). [f1-licoes #4, #5]
- **Ambiente 3D:** garagem na noite de quinta. Piso epóxi cinza-claro com reflexo borrado, painel LED de teto 5.600 K (RectAreaLight 2×4 m) como key fria, rim âmbar `#ff8a2a` de uma lâmpada de trabalho na traseira, fill azul `#3a5a78` de baixo. Fundo grafite `#0c0f13`. Poeira ambiente densa (0,8). Contraste baixo: é a cena de leitura.
- **Estado do carro:** **início** explodido em constelação (`explode 1`, `scatter 1`): ≈40 peças flutuam em nuvem com deriva senoidal em `L`, ligadas por fios finos (`Constellation`), com a carroceria em carbono nu e a pintura azul-petróleo ainda sem brilho. **Fim** montado (`explode 0`), com rake aero acoplado atrás das rodas dianteiras (peças próprias `rake_DE`/`rake_DD`, malha de sondas instanciada) e flow-vis verde `#4dffb0` fresca nas três camadas da asa dianteira (`front_wing_bottom/middle/top`; `flowVis 0.3`, estrias ainda curtas, molhadas).
- **Câmera por L:**
  - `0.00–0.18` (abertura, sem capítulo anterior): **dolly de nariz a asa traseira** (mov. 1) a 0,45 u do chão, atravessando as peças flutuantes; DOF curtíssimo (range 1,5), bokeh 3,4. O título entra em `0.02–0.20` sobre a nuvem.
  - `0.18–0.40` vista estável A: 3/4 frontal-esquerdo à altura de mecânico (câmera `[-0.9, 0.7, 7.4]`, alvo `[0.3, 0.2, 0]`), peças ainda em nuvem; callouts nomeiam cinco peças (`floor`, `front_wing_top`, `main_body_glass`, `front_tire`, `esqueleto`).
  - `0.40–0.50` título dissolve em partículas na direção da órbita; **órbita de 60°** (mov. 3) enquanto `explode 1 → 0` começa em `0.30` e termina em `0.70` na ordem de montagem: `floor` → `main_body` + `main_body_inside` (com o `esqueleto` dentro) → `rear_driveshaft`, `rear_control_arms`, `front_control_arms`, `front_pushrod` → `inside_cover`, `rear_inside_cover`, `front_tire`, `rear_tire`, `front_wheel_cover`, `rear_wheel_cover` → `front_wing_mount`, `front_wing_bottom`, `front_wing_middle`, `front_wing_top`, `front_wing_side_plates`, `front_flap_detail` → `rear_wing_holder`, `rear_wing_bottom_holder`, `rear_wing_top_mount`, `rear_wing_main_part`, `rear_wing_side`, `drs_holder`, `drs_mechanism`, `rear_wing_drs`, `rear_led` → `steering_wheel_main` e filhos, `lcd_screen` → `main_body_glass`, `side_mirrors`, `antennas`, `top_intake_details`, `exhaust`. O carro se monta diante da lente, de baixo para cima e de dentro para fora.
  - `0.50–0.72` vista estável B: 3/4 traseiro-direito baixo (câmera `[1.1, 0.5, 7.0]`, alvo `[-0.2, 0.3, 0]`); ficha entra. O rake sobe do chão e trava nas rodas em `0.70–0.80`; a flow-vis é "pincelada" nas asas em `0.78–0.86` (uniform `flowVis` sobe com estrias curtas).
  - `0.72–0.86` push-in leve para a asa dianteira (z 7,0 → 6,6) para ler a tinta molhada.
  - `0.86–1.00` wipe.
- **Efeitos e partículas:** poeira ambiente; `constellation` (`0.05–0.55`); `blueprint` (linhas de cota sobre as peças, `0.20–0.45`); `callouts`; `hotspots` (`0.55–0.86`); brilho úmido da flow-vis sob a rim; sem faíscas, sem haze.
- **Hotspots:**
  1. `rake_DE` — **Rake aero**: "Grade de sondas atrás da roda: mede na pista os mesmos pontos que o túnel mediu. Sem isso, o túnel é opinião."
  2. `front_wing_top` — **Flow-vis**: "A tinta escorre para onde o ar foi de verdade. A foto de amanhã é a referência real, não o CFD."
  3. `steering_wheel_main` — **Programa de sexta**: "A lista do que será testado, um item por run, com o tempo-alvo escrito. O que não está aqui não roda."
  4. `floor` — **Orçamento**: "320 runs por período, 80 h de vento. Quem tem menos runs precisa de hipóteses melhores, não de mais tentativas."
- **Imagem-chave:** Sob o LED frio da garagem, quarenta peças de carbono flutuam em silêncio como um inventário, ligadas por fios finos; a asa dianteira, ainda molhada de flow-vis verde, é a única coisa que brilha.
- **Transição de saída:** **wipe motivado por objeto** + diagonal: a porta de enrolar do box sobe em primeiro plano desfocado (`0.86–0.94`), e por trás dela o wipe diagonal a −20° revela o pit lane ao sol baixo; o rótulo "SEXTA · TREINOS" surge junto ao ponto ativo durante a varredura.
- **Emoção:** expectativa contida; o silêncio de quem ainda não mediu nada.

### Capítulo 2 — `sexta` · Treinos

- **Título:** `SEXTA.\nUMA MUDANÇA\nPOR VOLTA.`
- **Corpo:** Dois carros, uma peça diferente, a mesma pista: o delta ganha dono.
- **Essência:** Produza, critique contra a versão anterior, mude só o necessário e leia o cronômetro antes de decidir.
- **Lições:**
  - I. **Produzir e criticar** — A crítica pergunta "onde isso falha", nunca "está bom".
  - II. **Uma mudança por volta** — Troque uma variável; se mudar três, não sabe qual ajudou nem qual reverter.
  - III. **Verificar o resultado** — A volta só conta quando o comando rodou e a saída foi lida; "deve passar" não fecha volta.
- **Lição F1:** **A/B com dois carros** — Prática padrão dos treinos livres: um carro roda a peça nova e o outro a antiga na mesma sessão (Ferrari: Sainz com peças novas, Leclerc na especificação anterior; McLaren: Norris com o piso novo, Piastri no antigo no FP2). Racing Bulls, GP da Bélgica 2026: só havia um conjunto de peças e Alan Permane decidiu que quem classificasse na frente em Silverstone levaria o upgrade; Lindblad venceu e recebeu o pacote em Spa, Lawson só na Hungria. [f1-licoes #7]
- **Ambiente 3D:** pit lane e trecho de pista no fim da tarde de sexta. Key = sol baixo âmbar `#ff8a2a` a 15° do horizonte, vindo de trás-direita (borda dourada na carroceria); fill = céu frio `#2a3d5a`; fundo breu de pit lane `#080a0e` com bokeh das luzes dos boxes. Asfalto seco `#1a1b1d` com UV rolando quando o carro anda. Poeira estica em riscos com a velocidade.
- **Estado do carro:** **início** montado com rake e flow-vis fresca (herdado). **Meio** em movimento (`speed 0.7`, rodas com raio borrado, suspensão vibrando 2 mm, pneus deformando 1% no contato): a flow-vis "se revela" (`flowVis 0.3 → 1.0`, estrias alongam do bordo de ataque ao de fuga). **Fim** parado no pit lane ao lado de um segundo carro idêntico (`ab 1`); o carro B tem o `floor` em contorno âmbar (`swap 1`, `swapSet = [floor]`), o resto escurece 40%; fita de telemetria entre os dois, nascendo no `rear_led` de cada carro.
- **Câmera por L:**
  - `0.00–0.18` órbita de transição do 3/4 traseiro da garagem para lateral baixa esquerda do carro já rolando (`speed 0 → 0.7` em `0.10–0.22`).
  - `0.18–0.40` vista estável A: **travelling lateral baixo** (mov. 1 em movimento): câmera `[-1.2, 0.35, 7.2]`, alvo `[0.4, 0.2, 0]`, o mundo passa, o carro fixo na origem. Título à esquerda, flow-vis revelando-se sobre a asa.
  - `0.40–0.50` título dissolve para trás (direção do vento); a câmera sobe em crane curto (y 0,35 → 1,4) enquanto o carro desacelera (`speed 0.7 → 0`) e entra nas marcas do box.
  - `0.50–0.72` vista estável B: 3/4 frontal alto (câmera `[0.9, 1.4, 7.5]`, alvo `[0.6, 0.1, 0]`); ficha entra. O carro B desliza de 3 u à direita e para ao lado (`ab 0 → 1` em `0.52–0.64`); o assoalho do B acende (`swap 0 → 1` em `0.64–0.72`).
  - `0.72–0.86` **meia órbita A/B** (mov. 9): a câmera passa entre os dois carros; a fita de telemetria (delta de setor) entra por `uProgress` sincronizado, verde no setor 1 e amarela no setor 3.
  - `0.86–1.00` transição.
- **Efeitos e partículas:** poeira em riscos; `flowVis`; `telemetry` (`0.66–0.86`, série de 3 setores); `callouts` ("A · baseline", "B · piso novo"); `hotspots` (`0.55–0.86`); brasa fraca dos freios ao parar (`brakeHeat 0.3`, sem haze).
- **Hotspots:**
  1. `floor` (carro B) — **Peça nova**: "Só no carro B; o A é o baseline. Se os dois mudam, a comparação morre."
  2. `rear_led` — **Delta de setor**: "Verde melhorou, amarelo piorou. O número entra no relatório; o relato do rádio, não."
  3. `front_wing_top` — **Flow-vis lida**: "A tinta escorreu para onde o ar foi. A foto colada no relatório é a evidência; 'parecia bom' não é."
  4. `steering_wheel_main` — **Rádio**: "O piloto diz 'está melhor'. O engenheiro responde com o tempo de setor. Os dois precisam concordar."
- **Imagem-chave:** Dois carros idênticos parados lado a lado no pit lane ao sol baixo, e só o assoalho do segundo arde em contorno âmbar; entre eles, uma fita de telemetria verde e amarela diz quem ganhou.
- **Transição de saída:** **corte por luz**: o sol some e as luzes do pit lane apagam em `0.86–0.92` (key e envMap a zero, sobra a brasa dos freios), 2% de breu, e em `0.94–1.00` os monitores da sala de simulador acendem um a um (rims ciano) sobre o mesmo carro. Rótulo "MADRUGADA · SIMULADOR".
- **Emoção:** curiosidade competitiva; o prazer de descobrir quem ganhou.

### Capítulo 3 — `madrugada` · Simulador

- **Título:** `MADRUGADA.\nQUEM CRITICA\nNÃO DIRIGIU.`
- **Corpo:** A fábrica recebe só os dados e o critério, nunca a justificativa.
- **Essência:** Separe quem produz de quem critica: contexto limpo, só o artefato e o critério, e um verificador calibrado antes de ser confiado.
- **Lições:**
  - I. **Crítico independente** — Subagente ou sessão nova: recebe o diff e o critério, não o histórico de decisões.
  - II. **Revisão adversária** — Parta da hipótese de que há um defeito e procure a evidência dele, com arquivo e linha.
  - III. **Calibrar o verificador** — Simulador que não correlaciona é ruído; teste que não reflete a realidade é pior que nenhum.
- **Lição F1:** **O loop fecha de madrugada** — Mercedes: na sexta do GP, a equipe do simulador driver-in-the-loop em Brackley trabalha no fuso da pista, muitas vezes de madrugada no Reino Unido, testando mudanças de setup com os dados de FP1/FP2 e devolvendo recomendações antes do FP3; "o loop é fechado com a correlação dos dados de pista". Equipes admitem que "certos simuladores não correlacionam de jeito nenhum", e aí a volta barata vira ruído. [f1-licoes #6, #22]
- **Ambiente 3D:** hangar do simulador, madrugada. Fundo aço frio `#0a1218` sem horizonte, névoa baixa. Key branca fria 6.500 K dura de cima, dois rims ciano `#38e8ff` laterais (o carbono lê como cromo). Nenhuma luz quente: o único calor é o que ficou nos discos de freio, apagando. Poeira fina e lenta.
- **Estado do carro:** **início** montado, real, à meia-luz. **Meio** vira gêmeo digital: os materiais desbotam para aditivo ciano (`ghost 0 → 1`, o carro real fica a 30% de opacidade), streamlines de dados envolvem a carroceria (`tunnel 0.4`), fitas de telemetria (velocidade, freio, throttle) se enrolam no carro. **Fim** o gêmeo se desloca do real (`ghostOffset 0 → 0.3 u`, asa traseira do gêmeo dois dedos fora): a descorrelação visível.
- **Câmera por L:**
  - `0.00–0.18` órbita de transição para 3/4 frontal alto, "sala de controle".
  - `0.18–0.40` vista estável A: câmera `[-1.0, 1.6, 7.6]`, alvo `[0.3, 0.2, 0]`; o carro real vira gêmeo (`ghost` sobe em `0.18–0.40`), os rims ciano sobem junto.
  - `0.40–0.50` o título dissolve em pontos que **entram nas fitas de telemetria** (variante da R3: as partículas do texto seguem as ribbons); **rack focus** (mov. 6): o foco sai do carro e vai para as fitas a 1,5 u da lente.
  - `0.50–0.72` vista estável B: lateral pura, perpendicular, a 4,5 u, altura 0,9 u (**travelling do túnel**, mov. 7, parado nesta janela): o carro imóvel, o mundo de dados passando. Ficha entra.
  - `0.72–0.86` a câmera desliza 1,2 u contra o fluxo enquanto o gêmeo se desloca do real (`ghostOffset` sobe): o desvio na asa traseira fica evidente; um callout ciano marca "Δ 0,3 u · túnel ≠ pista".
  - `0.86–1.00` transição.
- **Efeitos e partículas:** `telemetry` (`0.30–0.86`); `tunnel` (streamlines, `0.35–0.80`); `constellation` de pontos de dados que saem do título; `ghost`; `hotspots` (`0.55–0.86`); brasa residual dos freios (`brakeHeat 0.3 → 0`).
- **Hotspots:**
  1. `lcd_screen` — **Piloto do simulador**: "Outro piloto, outro contexto. Recebe o mesmo circuito e o mesmo critério; não recebe a opinião de quem rodou na pista."
  2. `steering_wheel_main` — **Só o critério**: "O brief da madrugada é o dado de FP2 e o tempo-alvo. A justificativa de quem escreveu fica de fora, de propósito."
  3. `rear_wing_main_part` (gêmeo) — **Descorrelação**: "Onde o gêmeo e o carro divergem, o verificador está errado, não a pista. Calibre antes de confiar."
- **Imagem-chave:** Num hangar preto, o carro real e o seu gêmeo de luz ciano se sobrepõem quase perfeitamente; a asa traseira do gêmeo está dois dedos fora do lugar, e é esse desvio que a sala inteira olha.
- **Transição de saída:** **corte por luz** invertido: os rims ciano apagam em `0.86–0.90`; em `0.90–1.00` a luz de sábado entra como key âmbar baixa por trás do carro, o gêmeo se funde ao real (`ghost → 0`) e o wipe diagonal revela o grid ao entardecer. Rótulo "SÁBADO · CLASSIFICAÇÃO".
- **Emoção:** frieza e concentração; a solidão útil do turno da noite.

### Capítulo 4 — `sabado` · Classificação

- **Título:** `SÁBADO.\nO CRONÔMETRO\nMANDA.`
- **Corpo:** Sensação não conta: critério e desempate foram escritos antes da volta.
- **Essência:** Verifique contra o número, com a regra de desempate definida antes, e congele o que passou.
- **Lições:**
  - I. **Evidência versus opinião** — "Parece rápido" não entra no relatório; o setor roxo e a saída do comando entram.
  - II. **Desempate por regra prévia** — Quando dois resultados empatam, decide a regra escrita antes da volta, não o gosto.
  - III. **Critério atingido, congelar** — Depois que passou, "só mais um ajuste" reabre o ciclo inteiro; nomeie o que ainda pode mudar.
- **Lição F1:** **1:21.072, três vezes** — GP da Europa 1997, Jerez: Villeneuve, Schumacher e Frentzen marcaram exatamente 1:21.072 na classificação; o desempate foi pela regra prévia (quem fez o tempo primeiro larga na frente). Hill ficou a 0,058 s. E, a partir da classificação, o parc fermé congela o carro: só pneus, combustível, sangria de freios e o ângulo da asa dianteira podem mudar; alterar suspensão ou asas custa largar do pit lane. [f1-licoes #12, #9]
- **Ambiente 3D:** pista ao entardecer de sábado. Key âmbar baixa de trás, sombras longas azuis `#2a3d5a`, céu fechando em petróleo; asfalto seco com UV rolando a `speed 1`; guard-rail e postes instanciados que se teleportam à frente; névoa a 30 u. Trecho final: grid e pit lane sob os primeiros holofotes.
- **Estado do carro:** **início** parado no fim do pit lane, montado, sem rake, pintura limpa. **Meio** volta lançada (`speed 1`, `squat` oscilando com as "curvas" mapeadas em `L`, `brakeHeat 0.9` nas frenagens, faíscas do skid block nas compressões, DRS aberto na reta: `drs 1` gira `rear_wing_drs` em torno do eixo do `drs_mechanism`). **Fim** parado sob parc fermé: carro lacrado, `swap 1` com `swapSet = [front_wing_top, front_tire, rear_tire]` em contorno âmbar (o que ainda pode mudar: o flap ajustável e os pneus); todo o resto escurece 40% e recebe um "selo" (callout "PARC FERMÉ").
- **Câmera por L:**
  - `0.00–0.18` órbita de transição para o asfalto.
  - `0.18–0.40` vista estável A: **contra-plongée de lançamento** (mov. 2): câmera no chão (y 0,15), 2 u à frente do bico, olhando 12° para cima; a asa dianteira no terço inferior, halo e asa traseira alinhados. Título à esquerda. O carro está parado; a suspensão "arma" (squat −0,2) em `0.36–0.40`.
  - `0.40–0.50` largada: o título dissolve para trás no rastro; a câmera sobe e recua por cima do halo até a **posição T-cam** (mov. 8, FOV 70°). `speed 0 → 1`.
  - `0.50–0.72` vista estável B: onboard. O mundo rola; o cronômetro do HUD avança com `L` (`1:21.072` como alvo ilustrativo); setores colorem: S1 verde em `0.56`, S2 amarelo em `0.62`, **S3 roxo em `0.68`** com o **flash de fotógrafos** (único da experiência: 2 quadros a 60% de branco, aberração cromática a 0,004). Faíscas entram pela borda inferior nas compressões.
  - `0.72–0.86` a câmera se solta da T-cam e recua em arco para um 3/4 frontal a 7,2 u enquanto o carro desacelera (`speed 1 → 0`) e para no pit lane; `swap` sobe em `0.78–0.86`: o lacre.
  - `0.86–1.00` transição.
- **Efeitos e partículas:** `sparks` (skid block, com ricochete); `brakeHeat` + heat haze nas dianteiras (desktop); `drs`; `telemetry` como delta ao vivo (`0.50–0.72`); flash; `callouts` de setor; `hotspots` (`0.74–0.90`).
- **Hotspots:**
  1. `lcd_screen` — **Display**: "O delta ao vivo é o instrumento. O corpo do piloto é hipótese; a tela é evidência."
  2. `inside_cover` — **Disco incandescente**: "O disco brilha porque o sensor diz. Calor é medido, não sentido."
  3. `front_wing_top` — **Parc fermé**: "Só o ângulo deste flap, pneus, combustível e sangria de freio podem mudar. O resto está lacrado até a largada."
  4. `rear_tire` — **Setor roxo**: "Melhor de todos. O critério foi atingido e o número está na tela; a sensação ficou no rádio."
- **Imagem-chave:** Pela câmera T, acima do halo, a reta se estreita ao entardecer, o skid block risca faíscas laranja no asfalto azul e, no canto, o setor vira roxo no mesmo instante em que o flash dos fotógrafos queima a borda do quadro.
- **Transição de saída:** **wipe motivado por objeto**: a capa do carro (um plano escuro com alpha) desce sobre o carro lacrado em primeiro plano em `0.86–0.93`; atrás dela, o wipe diagonal troca o entardecer pelos holofotes de sódio do pit lane de domingo. Rótulo "DOMINGO · PIT STOP".
- **Emoção:** adrenalina precisa; o alívio de um número.

### Capítulo 5 — `domingo` · Boxes (com aprofundamento 1)

- **Título:** `DOMINGO.\n1,80 SEGUNDO.\nVINTE DONOS.`
- **Corpo:** Ninguém melhora o carro no box: executa o planejado e o cronômetro mede.
- **Essência:** Faça a volta menor que caiba em um desfazer, com um dono por tarefa e a pré-condição checada antes do gatilho.
- **Lições:**
  - I. **Passo pequeno reversível** — Um commit por volta verificada; o tamanho certo da volta é o maior passo que cabe num revert sem dor.
  - II. **Um dono por tarefa** — Escolha o executor pela tarefa: subagente para explorar e criticar, contexto principal para o que precisa do histórico.
  - III. **Pré-condição antes do gatilho** — Se a condição de entrada não está satisfeita, a ação não começa; a correção depois do gatilho chega tarde.
- **Lição F1:** **1,80 s, vinte pessoas, uma tarefa cada** — McLaren, GP do Catar 2023, volta 27, Norris: troca de quatro pneus em 1,80 s, recorde mundial, batendo os 1,82 s da Red Bull (Brasil 2019) com pneus de 18 polegadas maiores e mais pesados. Cerca de 20 pessoas: 3 por roda (solta a porca, tira, põe), 2 macacos mais 2 reservas, 2 estabilizadores, 2 na asa dianteira, 1 sinaleiro; ninguém faz duas coisas. [f1-licoes #1, #2]
- **Ambiente 3D:** pit lane sob holofotes de sódio 3.200 K vindos de cima-atrás a 45° (silhueta com borda dourada), fill frio `#2a3d5a`, fundo breu `#080a0e`, asfalto seco com marcas do box. Uma renderização espelhada a 0,35 de resolução para o reflexo do piso (permitido: o carro está parado).
- **Estado do carro:** **início** entrando no box (`speed 0.5 → 0`), pneus macios vermelhos gastos (`wear 0.7`, graining). **Meio** sequência `pit 0 → 1`: para nas marcas (0–0,1), `macaco_D` e `macaco_T` sobem 5 cm (0,1–0,2), as quatro rodas (`front_tire` + `front_wheel_cover`, `rear_tire` + `rear_wheel_cover`, esquerda e direita) saltam para fora em explosão lateral curta (0,2–0,5), quatro rodas novas de composto duro (faixa branca) entram em espelho (0,5–0,8), macacos descem (0,8–0,9), o carro sai (0,9–1). Duas silhuetas na asa dianteira dão uma volta de chave: `front_wing_top` gira 2° em torno do próprio eixo (o único ajuste permitido, e ele estava no plano). **Fim** saindo do box com pneus novos (`wear 0`), `speed 0 → 0.6`.
- **Câmera por L (capítulo com aprofundamento: título sai `0.30–0.36`, ficha `0.36–0.63`, slide `L ≥ 0.64`):**
  - `0.00–0.18` órbita de transição para a altura de mecânico, lateral direita.
  - `0.18–0.30` vista estável A: câmera `[1.2, 1.3, 7.3]`, alvo `[0.2, 0.3, 0]`; o carro entra e para (`pit 0 → 0.1`); o cronômetro do box no HUD marca `0,00`.
  - `0.30–0.36` título dissolve para cima; **crane sobre o pit stop** (mov. 4) começa a subir.
  - `0.36–0.63` vista estável B: **topo quase vertical** (câmera `[0.3, 6.0, 6.6]`, alvo `[0, 0, 0]`): `pit 0.1 → 0.9` mapeado em `0.40–0.60`; as rodas trocam como uma explosão ensaiada; callouts "porca · tira · põe" em cada roda; o cronômetro do HUD corre de `0,00` a `1,80` com `L`; ficha à esquerda.
  - `0.63–0.72` o crane desce pelo outro lado enquanto o carro cai dos macacos e sai (`pit 0.9 → 1`, `speed → 0.6`); o slide do aprofundamento 1 sobe em `0.64` com o carro em movimento ao fundo, desfocado.
  - `0.72–0.86` vista estável de fundo para o slide: 3/4 traseiro baixo, o carro rolando pelo pit lane com rodas novas.
  - `0.86–1.00` transição.
- **Efeitos e partículas:** strobes âmbar das pistolas pneumáticas (2–3 quadros por roda, sincronizados com `pit`); silhuetas dos macacos e das pistolas (planos com alpha); brasa dos freios (`brakeHeat 0.6`) e 30 brasas subindo devagar enquanto parado; faíscas fracas na saída; sinal verde do semáforo em `pit 0.9`; `hotspots` (`0.40–0.62`).
- **Hotspots:**
  1. `front_tire` — **Três por roda**: "Um solta a porca, um tira, um põe. Cada gesto tem dono e tempo; ninguém faz dois."
  2. `macaco_D` — **Macaco**: "Sobe só quando o carro parou nas marcas. Mônaco 2022: a Ferrari chamou o double stack com 5 s onde eram precisos 6; o 'stay out' chegou tarde e Leclerc caiu de P1 para P4." [f1-licoes #29]
  3. `front_wing_top` — **Volta de chave**: "Dois mecânicos, um ajuste de ângulo no flap. A única 'melhoria' permitida no box, e ela estava no plano."
  4. `lcd_screen` — **Sinal verde**: "O display só fica verde quando as quatro rodas reportaram. A suíte inteira, não só o pneu novo."
- **Imagem-chave:** Vista de cima, quase vertical, o carro erguido nos macacos sob luz de sódio, as quatro rodas velhas saltando para fora e as novas entrando em espelho, como uma explosão ensaiada; o cronômetro do box marca 1,80.
- **Transição de saída:** **wipe motivado por objeto**: o muro do pit wall passa em primeiro plano desfocado quando o carro reentra na pista (`0.86–0.93`); atrás dele o céu fecha, os holofotes ganham halos e o spray começa. Rótulo "DOMINGO · CHUVA".
- **Emoção:** tensão coreografada; precisão coletiva que dura um suspiro.

### Capítulo 6 — `chuva` · Bandeira

- **Título:** `CHUVA.\nVOLTE AO ÚLTIMO\nESTADO VERDE.`
- **Corpo:** Se o novo quebrou o antigo, reverta antes de corrigir e conte as falhas.
- **Essência:** Quando a volta piora o que estava certo, volte ao último estado verificado; duas falhas pedem reset, três pedem gente.
- **Lições:**
  - I. **Reverter regressões** — A suíte inteira piorou: rollback ao último verde e só depois conserte o verificador que deixou passar.
  - II. **Regra 2 e 3** — Duas falhas seguidas, reset com prompt refinado que carrega o erro exato e as hipóteses descartadas; três, parar e perguntar.
  - III. **Limite antes da deriva** — Contexto degrada como pneu: fixe o máximo de voltas por jogo antes de sair, não quando falhar.
- **Lição F1:** **Rollback em Silverstone** — Ferrari SF-24, 2024: o piso de Barcelona deu mais downforce e induziu bouncing em curvas rápidas; em Silverstone, após os treinos de sexta, os dois carros voltaram ao piso e carroceria pré-Barcelona; a causa era uma anomalia no túnel de vento; o piso corrigido chegou em Monza e Leclerc venceu. Catar 2023: microsseparação no flanco dos pneus levou a FIA a impor máximo de 18 voltas por jogo, obrigando 3 ou mais paradas em 57 voltas. [f1-licoes #27, #14]
- **Ambiente 3D:** pista sob chuva, cinza-tempestade `#0d1216`; luz ambiente azulada `#4a5c6e` de todos os lados, key fraca; contraste vem dos reflexos: LED traseiro vermelho `#ff1a1a` piscando, spray retroiluminado pelos holofotes; asfalto molhado (`roughness 0.12`, clearcoat 1, poças com normal map); gotas na lente.
- **Estado do carro:** **início** em movimento com o piso novo em contorno âmbar (`swap 1`, `swapSet = [floor]`), entrando na chuva (`rain 0 → 1` em `0.18–0.35`; o `rear_led` começa a piscar). **Meio** bouncing: `squat` oscila como função de `L` (seno de alta frequência em `0.35–0.62`, amplitude crescente), o `floor` toca a água e cospe faíscas; o contador de falhas do HUD marca 1 em `0.44` (bandeira amarela), 2 em `0.54` (safety car, `speed 1 → 0.4`), 3 em `0.62` (bandeira vermelha, `speed → 0`). **Rollback** (`0.64–0.80`): o piso novo se solta e sai por baixo (`explode` parcial só do `floor`), um **ghost verde** `#4dffb0` do carro no último estado verificado se sobrepõe e o piso antigo desliza para o lugar (`swap → 0`); o ghost e o real se fundem. **Fim** relargada lisa (`speed 0 → 0.8` em `0.80–0.86`), sem bouncing, ainda na chuva.
- **Câmera por L:**
  - `0.00–0.18` órbita de transição para 3/4 traseiro-esquerdo (o spray na lente).
  - `0.18–0.40` vista estável A: câmera `[-1.1, 0.9, 7.4]`, alvo `[0.2, 0.2, 0]`; a chuva chega, o carro começa a saltar. Título à direita (paridade ímpar).
  - `0.40–0.50` título dissolve no spray; a câmera desce ao nível do asfalto (y 0,9 → 0,2), foco no assoalho batendo.
  - `0.50–0.72` vista estável B: perfil baixo (câmera `[-1.2, 0.2, 7.0]`, alvo `[0.3, 0.15, 0]`), a água espelhando o LED vermelho; as bandeiras caem no HUD; ficha entra. O rollback acontece diante da lente.
  - `0.72–0.86` **órbita de 120°** em torno do carro e do ghost enquanto se alinham (mov. 9 com `ghost` em vez de `ab`); ao final, um único carro liso relarga.
  - `0.86–1.00` transição.
- **Efeitos e partículas:** `rain` (rooster tail 2.000 sprites + gotas na lente via shader do `Fog.js`); LED traseiro piscando por `L`; `sparks` do assoalho na água; `ghost` verde; HUD de bandeiras (amarela → safety car → vermelha) e contador de falhas; `hotspots` (`0.56–0.84`). Sem haze e sem reflexo planar neste capítulo (orçamento: chuva + DOF).
- **Hotspots:**
  1. `floor` — **Piso de Barcelona**: "Mais carga e bouncing: o critério-alvo passou, o critério que ninguém escreveu falhou. Escreva também o que não pode piorar."
  2. `rear_tire` — **18 voltas**: "O pneu degrada antes de falhar. Limite fixo por jogo, troca planejada; não 'aguenta mais um pouco'."
  3. `rear_led` — **Bandeiras**: "Amarela: não avance o escopo. Safety car: congele posições. Vermelha: pare e nomeie o que interrompeu."
  4. `main_body` (ghost) — **Ghost verde**: "O último estado verificado, sobreposto ao carro. É para cá que se volta antes de corrigir qualquer coisa."
- **Imagem-chave:** Sob chuva retroiluminada, o carro salta como um golfinho e o assoalho novo, em contorno âmbar, cospe faíscas na água; atrás dele, um fantasma verde do mesmo carro roda liso, e é para ele que a câmera se vira.
- **Transição de saída:** **passagem de spray**: o spray sobe e cobre o quadro (`0.86–0.93`, ribbons a alpha 0,9), o ambiente troca por trás, e o spray se dissipa (`0.93–1.00`) já dentro da sala escura de debrief, com o carro molhado pingando. Rótulo "DEBRIEF".
- **Emoção:** pânico controlado; a coragem de voltar atrás.

### Capítulo 7 — `debrief` · Debrief (com aprofundamento 2)

- **Título:** `DEBRIEF.\nRESULTADO,\nRISCO OU LIMITE.`
- **Corpo:** Dado primeiro, sensação depois: o que a volta ensinou entra na próxima.
- **Essência:** Encerre por uma das três saídas, registre hipótese, mudança, comando, resultado e decisão, e entregue ao próximo ciclo.
- **Lições:**
  - I. **Três saídas legítimas** — Critério atingido com a verificação colada; risco devolvido a uma pessoa; limite com relatório honesto do tentado, descartado e a decidir.
  - II. **Registro de volta** — Cinco colunas por volta: hipótese, mudança, comando, resultado, decisão. É o que sobrevive ao reset.
  - III. **Não declarar antes da bandeira** — Resultado parcial não é final; risco identificado exige plano até a quadriculada.
- **Lição F1:** **Dado antes da sensação** — McLaren (2026): o debrief abre pelas mudanças de setup que a equipe precisa saber, depois os relatórios dos engenheiros, depois a impressão dos pilotos, com telemetria sobreposta a GPS e onboard, curva a curva. E o encerramento precoce: Abu Dhabi 2021, a Mercedes manteve Hamilton na pista com pneus duros de 44 voltas apostando que a corrida terminaria sob safety car; a relargada veio na última volta e Verstappen ultrapassou. [f1-licoes #8, #31]
- **Ambiente 3D:** sala de debrief, preto-vinho `#0c0a0d`. Três monitores como únicas luzes: ciano `#38e8ff`, magenta `#ff3d8a`, marfim `#ebe6dc`; o carro reduzido a silhueta com três rims coloridos (`silhouette 1`). Sem key quente, de propósito: o calor migrou para o dado. Poeira lenta.
- **Estado do carro:** **início** montado, molhado (`rain 0.2 → 0`), gasto (`wear 0.6`), em silhueta. **Meio** as fitas de telemetria do fim de semana inteiro se enrolam no carro (`telemetry 1`), e então o carro se desmonta lentamente em constelação (`explode 0 → 1` em `0.44–0.70`, `scatter 0 → 1` em `0.60–0.80`), **como na quinta**; mas agora cada peça recebe um callout do livro de bordo ("hipótese", "mudança", "comando", "resultado", "decisão") e as ligações da constelação se colorem por decisão (roxo seguir, amarelo reverter, ciano parar). **Fim** durante o recuo, as peças se montam sozinhas (`explode 1 → 0`, `scatter → 0` em `0.88–0.97`), a pintura limpa (`wear → 0`), o carro pequeno e inteiro no centro da sala, pronto para a próxima quinta.
- **Câmera por L (capítulo com aprofundamento: título sai `0.30–0.36`, ficha `0.36–0.63`, slide `L ≥ 0.64`, créditos `L > 0.97`):**
  - `0.00–0.18` órbita de transição para um close da viseira/volante.
  - `0.18–0.30` vista estável A: close (câmera `[0.6, 0.6, 6.5]`, alvo no `steering_wheel_main`), o `lcd_screen` mostra o delta do dia; título à esquerda.
  - `0.30–0.36` título dissolve em pontos que viram fitas de telemetria; **rack focus** (mov. 6) para as fitas.
  - `0.36–0.63` vista estável B: 3/4 frontal médio (câmera `[-0.9, 1.0, 7.3]`, alvo `[0.2, 0.3, 0]`); ficha entra; o carro se desmonta e as peças recebem os callouts do livro de bordo.
  - `0.63–0.97` **recuo de debrief** (mov. 10): a câmera recua em linha reta 12 u, revelando os monitores, a sala e por fim o carro pequeno; bloom sobe de 0,1 a 0,55; o slide do aprofundamento 2 ocupa a esquerda a partir de `0.64`; em `0.88–0.97` as peças se montam ao fundo.
  - `0.97–1.00` créditos; sem wipe (último capítulo).
- **Efeitos e partículas:** `telemetry` (`0.30–0.90`); `constellation` colorida por decisão (`0.55–0.95`); `callouts` do registro; `silhouette`; `finale` (bloom); `hotspots` (`0.40–0.62`); poeira. O HUD do traçado completa a volta e o cronômetro para no tempo final; a gaveta do livro de bordo abre sozinha em `0.90`.
- **Hotspots:**
  1. `lcd_screen` — **Ordem do debrief**: "Setup primeiro, engenheiros depois, piloto por último. Dado antes de sensação, sempre nessa ordem."
  2. `rear_tire` — **44 voltas**: "Resultado parcial tratado como final; risco identificado sem plano. Até a quadriculada, o risco precisa de resposta."
  3. `antennas` — **Livro de bordo**: "Hipótese, mudança, comando, resultado, decisão. Cinco colunas que a antena transmitiu, que sobrevivem ao /clear e abrem a próxima sessão."
  4. `floor` — **Inconclusivo**: "Tentado, descartado, a decidir. Também é resultado; 'quase lá' não é."
- **Imagem-chave:** Numa sala preta iluminada por três monitores, o carro volta a ser quarenta peças suspensas como na quinta, mas agora cada peça carrega uma linha do livro de bordo; a câmera recua até o carro caber na palma da mão, e ele se monta sozinho para o próximo fim de semana.
- **Transição de saída:** nenhuma; fim da experiência. Sugestão de retorno: o ponto "QUINTA" do traçado pisca em âmbar, convidando a rolar de volta (a reversibilidade do motor é a mensagem).
- **Emoção:** serenidade e fechamento; a promessa de recomeçar com entrada melhor.

### Quadro de não repetição (o que cada capítulo ensina)

| Cap. | Bloco | Princípios exclusivos | Estado do carro dominante |
|---|---|---|---|
| 1 Quinta | Preparar | referência real, critério verificável, orçamento e escopo | constelação → montado com rake e flow-vis |
| 2 Treinos | Uma volta | produzir e criticar, uma mudança por volta, verificar o resultado | em movimento → A/B lado a lado |
| 3 Simulador | Controlar (quem) | crítico independente, revisão adversária, calibrar o verificador | real → gêmeo digital divergente |
| 4 Classificação | Controlar (o quê) | evidência versus opinião, desempate por regra prévia, critério atingido = congelar | volta lançada onboard → parc fermé |
| 5 Boxes | Uma volta (tamanho) | passo pequeno reversível, um dono por tarefa, pré-condição antes do gatilho | pit stop completo em crane |
| 6 Bandeira | Controlar (quando piora) | reverter regressões, Regra 2 e 3, limite antes da deriva | bouncing na chuva → rollback com ghost verde |
| 7 Debrief | Encerrar | três saídas, registro de volta, não declarar antes da bandeira | silhueta → constelação rotulada → montado |

---

## 5. Aprofundamentos

### Slide 1 — `volta` (capítulo 5, `L ≥ 0.64`)

- **Rótulo:** Boxes · aprofundamento
- **Título:** Anatomia de uma volta
- **Lead:** Produzir. Criticar. Revisar. Verificar. Em 1,80 s ou em 20 minutos, a forma é a mesma.
- **Metáfora:** Parar. Trocar. Medir. Sair.
- **Imagem:** o carro nos macacos visto de cima, quatro rodas no ar, cronômetro em 1,80 (render do próprio capítulo).
- **Seções:**
  1. **Antes de largar** — Referência real nomeada · Critério em uma frase testável · Teto de voltas, tokens e minutos
  2. **Dentro da volta** — Uma mudança por volta · Crítica que procura a falha · Comando rodado, saída lida
  3. **Quem faz o quê** — Produtor, crítico e verificador separados · Subagente para explorar e criticar · Contexto principal só para o que precisa de histórico
  4. **Fechar a volta** — Suíte inteira, não só o teste novo · Commit pequeno com mensagem do que testou · Uma linha no livro de bordo

### Slide 2 — `bordo` (capítulo 7, `L ≥ 0.64`)

- **Rótulo:** Debrief · aprofundamento
- **Título:** Livro de bordo e as três saídas
- **Lead:** Parar bem é habilidade. O registro é a entrada do próximo ciclo.
- **Metáfora:** Dado primeiro. Sensação depois. Decisão por escrito.
- **Imagem:** constelação de peças com fios coloridos por decisão (roxo, amarelo, ciano) sobre a sala escura.
- **Seções:**
  1. **Cinco colunas** — Hipótese · Mudança e comando · Resultado e decisão
  2. **Regra 2 e 3** — Duas falhas: reset com prompt refinado · O prompt novo leva o erro exato e o que foi descartado · Três falhas: parar e perguntar
  3. **Três saídas** — Critério atingido, verificação colada · Risco identificado, decisão devolvida ao humano · Limite: tentado, descartado, a decidir
  4. **Armadilhas** — Loop que não converge: reverter e dividir · Avaliador complacente: crítico separado · Overfitting ao critério: nunca editar o teste

---

## 6. HUD e interações

- **Pontos de capítulo → traçado do fim de semana.** SVG de ≈120×160 px à direita, linha fina `#8a9099`, com 7 nós no traçado de uma pista estilizada; rótulos de dia em caixa alta com tracking `.22em`: QUI · SEX · SEX (noite) · SÁB · DOM · DOM · DOM (noite). O nó ativo recebe o anel giratório (mesmo desenho do hotspot); o trecho percorrido colore-se de âmbar; durante o wipe, o rótulo do próximo capítulo aparece à esquerda do nó e some depois. No debrief o traçado completa a volta.
- **Barra de progresso → cronômetro de volta.** Fio âmbar de 2 px no topo e, ao lado do logo, um `output` em Bebas com `tabular-nums` que mostra o progresso global como tempo de volta (`0:00.000` → `1:21.072`); dentro do capítulo 4 ele vira o cronômetro da volta lançada e no 5 o cronômetro do box (`0,00` → `1,80`). Diegético: "o cronômetro manda".
- **Setores.** Três faixas finas sob o cronômetro que colorem por capítulo: verde (melhorou), amarelo (piorou), roxo (critério atingido). O roxo acende uma única vez, no capítulo 4.
- **Hotspots diegéticos.** Anel circular ciano `#38e8ff`, dois anéis finos e arco parcial girando, texto em caixa alta dentro; único clicável no mundo; abre o tooltip e grava uma leitura no livro de bordo. Variante grande com texto ("ABRIR A VOLTA", "ABRIR O LIVRO DE BORDO") para os dois aprofundamentos.
- **Livro de bordo (registro).** Gaveta lateral com borda ciano; fases = nomes dos sete capítulos; tipos `leitura | mudança | volta`; cada volta mostra o delta com cor de setor; exportação JSON e limpar. Chave de storage própria (`f1-loop:bordo`). No capítulo 7 a gaveta abre sozinha em `L = 0.90` com o resumo do fim de semana.
- **Condições (cenários, capítulo 6).** Botões `Seco · Chuva · Pneu duro · Pneu macio · Piso novo` gerados a partir dos dados; cada um escreve `rain`, `wear`, `swap` no carro e um `desvio` em segundos por volta (delta contra a volta de referência) com série de 12 voltas no gráfico de delta (linha tracejada = referência; linha âmbar = atual). "Piso novo" mostra a série que melhora nas 4 primeiras voltas e degrada depois: a regressão que o placar esconde.
- **O que o aluno pode mexer:**
  1. **Capítulo 2 — escolher quem leva a peça.** Dois botões "A" e "B": só um carro recebe o assoalho novo; tentar dar aos dois mostra a mensagem "comparação morta" e a fita de telemetria some.
  2. **Capítulo 4 — parc fermé.** Toggle "o que ainda pode mudar": realça asa dianteira, pneus, combustível e freios; clicar numa peça lacrada mostra "largada do pit lane".
  3. **Capítulo 6 — contador de falhas.** Botão "tentar de novo": a primeira e a segunda tentativa levantam amarela e safety car; a terceira levanta a vermelha e abre o campo "o que interrompeu", que vai para o livro de bordo. Botão "reverter" traz o ghost verde.
  4. **Capítulo 7 — exportar o livro de bordo** como JSON com as cinco colunas por volta registrada.
- **Dica de scroll:** "Role para sair dos boxes", com seta de pit lane em âmbar.
- **Acessibilidade e fallback:** narrativa completa em `.sr-only` por seção (nome, título, corpo, hotspots, essência, lições, fato de pista); `prefers-reduced-motion` = câmera fixa `[0, 0.2, 7.3]`, estados do carro por cross-fade de opacidade, sem partículas narrativas, sem chuva na lente; fallback sem WebGL = texto corrido dos sete capítulos e dos dois slides.

---

## 7. Paleta e tipografia

| Papel | Nome | Hex |
|---|---|---|
| Fundo base | Asfalto noturno | `#07090c` |
| Garagem (cap. 1) | Grafite de boxes | `#0c0f13` |
| Pit lane (caps. 2 e 5) | Breu de pit lane | `#080a0e` |
| Simulador (cap. 3) | Aço frio | `#0a1218` |
| Pista ao entardecer (cap. 4) | Petróleo | `#0b1418` |
| Chuva (cap. 6) | Cinza-tempestade | `#0d1216` |
| Debrief (cap. 7) | Preto-vinho | `#0c0a0d` |
| Acento quente | Âmbar incandescente | `#ff8a2a` |
| Acento quente extremo | Brasa de freio | `#ff3b1a` |
| Acento frio | Ciano de telemetria | `#38e8ff` |
| Critério atingido | Roxo de setor | `#b04cff` |
| Melhorou / último verde | Verde de setor | `#4dffb0` |
| Piorou / bandeira | Amarelo de setor | `#ffd23f` |
| Tinta | Marfim de pit wall | `#ebe6dc` |
| Secundário | Cinza de fita de carbono | `#8a9099` |
| Pintura do carro | Azul-petróleo metálico | `#0f3a47` base / `#2c7a8c` flake |
| Carbono | Carbono nu | `#15171a` / `#3b3f45` |

Temperatura por capítulo (R10, sujeito quente, mundo frio): 1 frio neutro com rim âmbar · 2 âmbar dominante (sol baixo) · 3 ciano, sem calor · 4 âmbar baixo com sombras azuis e o único roxo · 5 sódio âmbar com sombras densas · 6 azul-cinza com LED vermelho · 7 ciano/magenta de monitores, sem key quente.

Materiais: fibra de carbono com sarjado procedural e clearcoat; pintura com flakes e iridescência leve; borracha com sheen e faixa de composto emissiva (vermelho macio, branco duro); discos de freio com rampa de corpo negro em `uBrakeTemp`; halo em titânio fosco; skid block de titânio raspado; asfalto seco e molhado. Sem logos reais no carro (livery própria "SETOR ROXO"); marcas só no texto.

Tipografia: **Bebas Neue** para títulos 3D (caixa alta, tracking 0.01, 2–3 linhas, ≈9% da altura por linha), cronômetro e rótulos do traçado; **Lato** para corpo, ficha e livro de bordo; rótulos pequenos em caixa alta com `letter-spacing .22em`. Conjunto de caracteres dos títulos restrito ao pré-carregado (sem `?`, `!`, travessão, aspas ou `À`).

Pele de filme sempre ligada (R9): grão 0,10 (0,12 na garagem, na chuva e no debrief), vinheta 0,62, aberração cromática 0,0008 (0,004 só no flash do capítulo 4), ACES.

---

## 8. Riscos e o que é caro

1. **Sete capítulos num motor de seis.** `N = 6` está hardcoded em `Scroll.PESOS`, `cameraPath`, `Director`, `Registro.FASES`, `Callouts`, `ui.js` e no teste. Este tratamento exige generalizar para `N = CAPITULOS.length` e mover os índices com semântica fixa (aprofundamento nos caps. 5 e 7, cenários no 6, créditos no 7) para os dados (`aprofundamento`, `cenarios`, `registro` do schema v2). Alternativa barata se o prazo apertar: fundir os capítulos 5 e 6 num só "Domingo" (pit stop na primeira metade, chuva e rollback na segunda), o que devolve `N = 6` ao custo de perder o crane do pit stop como cena inteira.
2. **Modelo do carro e licença.** O herói é o `part7_textures.blend` local (carro genérico 2026, ≈40 objetos separados e nomeados, materiais PBR já pensados): resolve a explosão por peça sem kitbash. O que ele **não** tem e este tratamento usa: halo como objeto separado (está soldado em `main_body`; separar a sub-malha no Blender ou aceitar `main_body_glass` como âncora), discos de freio (o calor vira emissivo em `inside_cover`/`rear_inside_cover`), internos (motor, câmbio, radiadores: fabricar o `esqueleto` estilizado dentro de `main_body_inside`, senão a explosão dos caps. 1 e 7 mostra só casca), `rake_DE/DD` e `macaco_D/T` (peças próprias). Pendências do asset: confirmar a licença dos project files do tutorial na descrição do vídeo; trocar as stickers FIA/F1/Pirelli por marcas da aula ("SETOR ROXO", INTEIA); fazer bake da fibra de carbono procedural (não exporta para glTF); medir triângulos após Subdivision fixa e Decimate (meta < 300 k, glTF Draco + KTX2, < 15 MB); resolver dependências externas ausentes (Roughness_2K, garage_floor, assets BlenderKit). Plano B da pesquisa: W13 Concept CC BY re-texturizado.
3. **Onboard (câmera T) no capítulo 4.** Quebra o contrato de layout (texto à esquerda, herói à direita) e os limites de câmera testados (`z ∈ [6.4, 7.82]`, `|x| ≤ 1.2`). Proposta: durante `0.50–0.72` a ficha fica em faixa inferior (retrato-like) e os limites do teste ganham uma exceção declarada por capítulo (`camera.limites`). Se não couber, substituir por um 3/4 traseiro colado ao carro a 6,4 u com FOV maior; a imagem-chave perde força mas mantém o setor roxo e o flash.
4. **A/B dobra a geometria em tela (cap. 2).** Mesma `BufferGeometry`, segunda `Mesh` com os quatro materiais: ≈80 draw calls só de carro. Aceitável em desktop; em celular, trocar `ab` por `ghost` (um carro com contorno da peça) como a gramática já prevê para retrato.
5. **Chuva + DOF + faíscas + ghost (cap. 6).** É o capítulo mais caro. Regra: sem haze e sem reflexo planar; em celular, sem gotas na lente e rooster tail reduzido a 600 sprites. O bouncing por seno em `L` é reversível por construção; a amplitude deve ser suavizada pelo lerp de estado para não "tremer" ao rolar devagar.
6. **Reflexo planar no pit lane (cap. 5).** Uma renderização espelhada a 0,35 de resolução, só enquanto `pit > 0` e `speed < 0.1`; desligar em celular.
7. **Wipe sobre a cena inteira e transições motivadas.** O `Background.js` atual varre só o fundo; a referência varre tudo. Precisa de um passe de pós que decida a paleta por lado da diagonal (um quad de tela). As transições por objeto (porta do box, capa do carro, pit wall) são planos simples com alpha, baratos; o corte por luz custa zero; a passagem de spray reaproveita as ribbons.
8. **Título que dissolve em partículas.** Rasterizar o título num canvas, amostrar ≈3.000 pixels, `Points` com deslocamento por ruído na direção da câmera. Um draw call por título; a variante do capítulo 3 (pontos entrando nas fitas) exige que as posições-alvo venham das ribbons já calculadas.
9. **Fatos com data recente ou sensíveis.** Racing Bulls, Bélgica 2026 (#7) é fato de poucos meses: reconfirmar na fonte antes de publicar. Abu Dhabi 2021 (#31): usar só a decisão de não parar, nunca a controvérsia de direção de prova (a pesquisa já limita assim). Números de sensores não entram (fontes divergem). Nenhuma frase "[NÃO CONFIRMADO]" da pesquisa foi usada.
10. **Ritmo de leitura versus viagem (R7).** As janelas herdadas dão ao texto mais de 35% de cada capítulo (título 0.08–0.50, ficha 0.50–0.98). Para chegar à proporção da referência, os pesos dos capítulos devem crescer (sugestão: `[3.2, 3.8, 3.4, 4.2, 5.0, 4.6, 5.0]` telas) e as janelas v2 `texto.fichaEntra/fichaSai` devem encurtar a ficha (`0.52–0.60 → 0.80–0.88`) onde há viagem de câmera depois dela (caps. 1, 2, 4, 6).
11. **Pit crew sem personagens.** Silhuetas de pistola e macaco como planos com alpha, strobes de luz e o crane vendem a cena; se parecer vazio, adicionar duas silhuetas animadas por `L` na asa dianteira (a "volta de chave"), ainda como planos.
12. **Verificação automática desde já.** Teste de dados: sete capítulos com campos obrigatórios, títulos com 2–3 linhas e ≤ 16 caracteres por linha só com o conjunto pré-carregado, corpo ≤ 72 caracteres, `hotspots[].peca` na tabela de nós do modelo (seção de convenções), `f1.fonte` presente; teste do GLB: tamanho, nós obrigatórios (os do `part7` mais `rake_DE`, `rake_DD`, `macaco_D`, `macaco_T`, `esqueleto`), ausência de strings de marca (FIA, F1, Pirelli, P Zero) em nomes de nó, materiais e texturas.
