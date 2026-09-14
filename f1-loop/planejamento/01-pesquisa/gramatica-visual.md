# Gramática visual — do milho ao carro de F1

Data: 2026-09-12. Autor do documento: direção de fotografia e direção de arte da fase de planejamento.
Fontes: `referencias/corn-00.jpeg` … `corn-12.jpeg` (1440×900, sequência real), seção 4 do briefing, e o código atual (`src/core/cameraPath.js`, `src/core/Director.js`, `src/core/Post.js`, `src/core/Background.js`, `src/fx/index.js`, `src/fx/Sparks.js`, `src/fx/Fog.js`, `src/fx/Hotspots.js`, `src/fx/Constellation.js`, `src/styles.css`, `index.html`).

Como ler: a seção 1 são regras (R1…R12) extraídas da referência, escritas para serem reutilizadas por quem escreve capítulos. As seções 2 a 6 traduzem as regras para o carro. Cada item cita a captura ou o arquivo de onde a observação veio.

---

## 1. Gramática visual da referência (Corn Revolution, Resn)

### R1. Uma câmera, um mundo, nenhuma seção
Não existe "página 2". A rolagem só faz uma coisa: avançar a câmera por um trajeto contínuo dentro de um único espaço 3D (corn-00 → corn-12 é uma tomada só). Nada corta; tudo se transforma diante da lente. Regra prática: todo capítulo começa exatamente na pose em que o anterior terminou (é o que `sampleCameraPose` já garante com `TRANSITION = 0.18` e a órbita de amplitude zero nas pontas). Se uma cena precisa de outro lugar, a câmera vai até lá ou o lugar vem até a câmera; nunca se "troca de cena".

### R2. Herói sempre em quadro, sempre mudando de natureza
O milho nunca sai de cena, mas nunca é o mesmo objeto: espiga (corn-00) → fita de DNA em partículas douradas (corn-01/02) → constelação de nós (corn-03/04) → grãos caindo (corn-05/06) → semente em vaso (corn-06) → planta (corn-07/08/09) → campo em parcelas (corn-10/11) → grão em close (corn-12). Cada metamorfose é um **estado** endereçável por progresso local, não uma troca de modelo. A regra: um único grafo de cena com estados contínuos (explosão 0..1, dispersão 0..1, crescimento 0..1), interpoláveis para frente e para trás.

### R3. Texto é objeto de cena, com massa e morte
O título "FIRST, A SOLID FOUNDATION." (corn-01) está no plano do herói, à esquerda, e quando a câmera parte ele **vira metal escovado** (corn-03: superfície áspera, brilho especular) e depois **dissolve em partículas** (corn-09: "WE TAKE IT TO THE FIELD" aparece só como contorno fantasma, meio corroído). O texto tem dois estados de vida (contorno → cheio, como o `Title.js` atual faz com `fillOpacity`) e um estado de morte (dissolução em pontos que seguem a direção da câmera). O parágrafo em fonte humanista, pequeno, à esquerda, nunca compete com o herói.

### R4. Composição em terços: texto à esquerda, herói à direita, CTA no terço direito
Em todas as paradas com texto (corn-01, corn-02, corn-03) o bloco ocupa a coluna esquerda (≈8% a 42% da largura), o herói o centro-direita, e o hotspot fica em ≈70% da largura, na altura do meio. Os pontos de capítulo ficam colados à direita (≈97%). Logo e hambúrguer no canto superior esquerdo. Nada no rodapé além de cookies. Regra: a tela tem três colunas de leitura e o olho anda da esquerda para a direita, terminando no hotspot ou nos pontos de capítulo.

### R5. Hotspot circular diegético
"EXPLORE THE LIBRARY" (corn-01/02/03): disco escuro semitransparente (≈140 px), dois anéis finos concêntricos com arco parcial que **gira devagar** (o anel externo é um arco de ≈300°, não um círculo fechado), texto em caixa alta condensada dentro. Ele continua visível quando o título já dissolveu (corn-04: sobra só o disco e os arcos, o texto foi). É o único elemento clicável dentro do mundo; abre um aprofundamento. O `Hotspots.js` atual (anel externo com lóbulos, anel interno pulsante, ponto central, flipbook) já é essa linguagem — falta só a versão "grande" com texto dentro.

### R6. Wipe diagonal de ≈22° como única transição de ambiente
Entre mundos, uma diagonal escura varre a tela (corn-07 canto superior esquerdo, corn-10 triângulo escuro superior esquerdo, corn-12 diagonal completa do canto inferior esquerdo ao superior direito). A borda é levemente suja/granulada, não geométrica. O próximo ambiente já está renderizado do outro lado da diagonal (corn-12: o campo em cima, o grão dourado sob luz laranja embaixo). O `Background.js` atual faz exatamente isso (`uAngle = -0.35 rad ≈ -20°`, borda com `fbm`), mas só no fundo; a referência varre **a cena inteira**, herói incluído. O rótulo do capítulo ("REAL WORLD TESTING") aparece junto ao ponto ativo **durante** o wipe (corn-12), e some depois.

### R7. Respiro obrigatório entre paradas
Entre cada parada com texto há trechos de pura viagem de câmera sem nenhuma palavra: corn-04, 05, 06, 07, 08, 10, 11 não têm título. A proporção aproximada é 1 parada de leitura para 2 a 3 telas de viagem. Regra: dentro de cada capítulo, o texto ocupa no máximo ≈35% do progresso local; o resto é câmera + herói. O `Director.js` atual já respeita isso (título em `seg(L, 0.08, 0.24)`, ficha em `seg(L, 0.4, 0.5)`, fundo em `seg(L, 0.86, 1)`).

### R8. Profundidade de campo como narrador
O DOF é agressivo e conta a história: em corn-07 a planta está nítida contra um campo totalmente desfocado em bokeh oval; em corn-06 os grãos que caem estão nítidos e o vaso levemente fora de foco; em corn-01 a fita de DNA fica nítida no centro e dissolve em bokeh nas pontas. O foco está sempre no herói, nunca no texto (o texto é desenhado depois do DOF, como o `overlay` do `Post.js`). Regra: `worldFocusDistance` = distância câmera→herói; `worldFocusRange` curto (≈1,5 a 2,5 unidades) em closes, longo em planos gerais.

### R9. Grão, vinheta, aberração: a pele de filme
Todas as capturas têm grão fino visível (mais forte nas sombras, corn-07/08), vinheta escura pronunciada nos cantos (corn-00, corn-04) e leve aberração cromática nas bordas de alto contraste. É o que faz o 3D parecer fotografado. O `Post.js` atual tem `NoiseEffect` (0,08), `VignetteEffect` (offset 0,28, darkness 0,62) e `ChromaticAberrationEffect` (0,0008). Regra: manter, e subir o grão para ≈0,10–0,12 nas cenas escuras (garagem, chuva).

### R10. Luz lateral quente contra fundo frio
O esquema de luz é sempre o mesmo: key lateral quente (dourado/laranja, vindo de cima-direita ou cima-esquerda), fundo frio (verde-preto, teal) e partículas que pegam a key. Corn-00: espiga iluminada de cima, fundo verde escuro. Corn-12: o grão recebe luz laranja de trás, o restante é teal profundo. A regra é temperatura: **sujeito quente, mundo frio**. Nunca luz branca neutra.

### R11. Partículas flutuantes em toda cena, como poeira em raio de luz
Não há um único quadro sem partículas em suspensão (pontos verdes e vermelhos minúsculos em corn-01 a corn-06; bokeh de poeira em corn-07/08). Elas dão escala, movimento em repouso e "ar" ao espaço. São de dois tipos: **poeira ambiente** (pequena, lenta, sempre) e **partículas narrativas** (a fita de DNA, os nós da constelação, os grãos) que pertencem ao herói. Regra: um sistema de poeira global sempre ligado, mais sistemas narrativos por capítulo.

### R12. Paleta escura, três cores, uma temperatura por capítulo
A paleta inteira do site cabe em: preto-esverdeado (`#0a1a14` aproximado), teal (`#1f5f52`), dourado (`#e0a24a`), branco quente para texto (`#f2ede4`) e dois acentos minúsculos nas partículas (verde `#4dff9a`, vermelho `#ff4d4d`). Cada capítulo desloca a temperatura (Science: teal + ouro; Testing: verde-oliva + laranja; Result: teal + ouro de novo). Tipografia: display condensada em caixa alta com tracking apertado (semelhante a Bebas / Tungsten), corpo em geométrica humanista (semelhante a Sofia Pro / Gilroy), rótulos pequenos em caixa alta com tracking largo (`letter-spacing ≈ .2em`). Tamanho do título: ≈9% da altura da tela por linha, 2 linhas.

---

## 2. Tradução para um carro de F1 ultra-realista

### 2.1 Paleta proposta (com hex)

Princípio: a referência usa a cor do sujeito (dourado do milho) como acento. Aqui o sujeito é carbono, então o acento vem do **calor** (freio, faísca, escapamento) e da **telemetria** (ciano/magenta). O ouro do site atual (`#d3a94f`) cede lugar ao âmbar incandescente; o aço (`#8fa3b8`) cede ao ciano de telemetria.

| Papel | Nome | Hex | Uso |
|---|---|---|---|
| Fundo base | Asfalto noturno | `#07090c` | `--bg`; fundo de todos os capítulos, ancora a paleta |
| Fundo garagem | Grafite de boxes | `#0c0f13` | Capítulo Preparar; luz fria de painel |
| Fundo túnel de vento | Aço frio | `#0a1218` | Capítulo Controlar; azul dessaturado |
| Fundo pit lane noturno | Breu de pit lane | `#080a0e` | Capítulo Uma volta; poças refletem âmbar |
| Fundo chuva | Cinza-tempestade | `#0d1216` | Cena de chuva; tudo levemente azulado |
| Fundo debrief | Preto-vinho | `#0c0a0d` | Capítulo Encerrar; monitores como única luz |
| Acento quente (primário) | Âmbar incandescente | `#ff8a2a` | Título cheio, régua, pontos ativos, faíscas |
| Acento quente (extremo) | Brasa de freio | `#ff3b1a` | Disco de freio a 900 °C, emissivo > 1,0 para o bloom pegar |
| Acento frio (telemetria) | Ciano de telemetria | `#38e8ff` | Linhas de dados, hotspots, streamlines do túnel |
| Acento frio (setor) | Roxo de volta mais rápida | `#b04cff` | Só quando um critério é atingido (convenção F1: setor roxo = melhor de todos) |
| Acento verde | Verde de melhora pessoal | `#4dffb0` | Setor verde = melhorou; flow-vis sob luz UV |
| Alerta | Amarelo de setor lento | `#ffd23f` | Setor amarelo = piorou; bandeira |
| Tinta (texto) | Marfim de pit wall | `#ebe6dc` | `--ink`; nunca branco puro |
| Texto secundário | Cinza de fita de carbono | `#8a9099` | Rótulos, legendas |
| Pintura do carro | Azul-petróleo metálico | `#0f3a47` (base) / `#2c7a8c` (flake) | Ver 2.2; não copia nenhuma pintura real |
| Carbono | Carbono nu | `#15171a` (base) / `#3b3f45` (fio claro do sarjado) | Asas, assoalho, chassi |

Regra de temperatura por ambiente: garagem = frio neutro com key âmbar; pit lane = âmbar dominante com sombras azuis; túnel = ciano dominante com key branca fria; chuva = azul-cinza com faróis/reflexos âmbar; debrief = magenta/ciano de monitores com sombra vinho.

### 2.2 Materiais

Todos em `MeshPhysicalMaterial` (three.js), sem texturas 4K: o realismo vem de normal maps procedurais em shader e de um `envMap` HDR por ambiente (ver seção 6).

- **Fibra de carbono (asas, assoalho, chassi, halo):** base `#15171a`, `roughness 0.32`, `metalness 0.0`, `clearcoat 1.0`, `clearcoatRoughness 0.08`. O sarjado (twill 2×2) é um normal map procedural em `onBeforeCompile`: duas ondas senoidais cruzadas a ±45°, frequência ≈ 320 fios por metro, com `anisotropy 0.6` orientada ao longo dos fios. Sob a key âmbar, o clearcoat devolve um reflexo alongado; à sombra, o sarjado só aparece de raspão. Nunca preto chapado.
- **Pintura com flakes (carenagem, tampa do motor):** base `#0f3a47`, `metalness 0.85`, `roughness 0.28`, `clearcoat 1.0`, `clearcoatRoughness 0.05`. Os flakes são um `clearcoatNormalMap` de ruído de alta frequência (hash 3D por fragmento, amplitude 0,04) mais `iridescence 0.15` com `iridescenceIOR 1.3` para o brilho mudar do azul ao verde no raspão. Em close (freio, halo), os flakes cintilam com o movimento da câmera: é o detalhe que diz "ultra-realista".
- **Pneus:** borracha `#141416`, `roughness 0.88`, `metalness 0`, `sheen 0.35` com `sheenColor #3a3a3c` (o brilho fosco de borracha nova). Faixa de composto na lateral (a cor do composto como emissivo fraco: vermelho macio `#e0202a`, amarelo médio `#ffd23f`, branco duro `#dcdcdc`, verde intermediário, azul chuva). Textura de "graining" quando o pneu está gasto: ruído em `roughnessMap` procedural que sobe com um uniform `uWear` (0..1). Pneu quente brilha mais (`roughness` cai para 0,7 e `sheen` sobe).
- **Discos de freio (carbono-carbono):** disco cinza-grafite `#2a2a2c` com 1.100 furos radiais (textura procedural de anéis de furos, não geometria). Emissivo por temperatura: rampa de corpo negro `#000000 → #6b1000 → #ff3b1a → #ff8a2a → #ffe9c9` mapeada de 300 °C a 1.000 °C num uniform `uBrakeTemp`. Emissivo acima de 1,0 em luminância para o `BloomEffect` (threshold 1,0) acender só o disco. Pinça em titânio `#6e6a63`, `metalness 0.9`, `roughness 0.45`.
- **Halo:** titânio com pintura fosca `#1c1e22`, `roughness 0.6`, `clearcoat 0.3`. É a "moldura" do cockpit: nas cenas de close, a câmera usa o halo como primeiro plano desfocado.
- **Rodas (aros):** magnésio anodizado escuro `#1a1c20`, `metalness 0.95`, `roughness 0.35`, com marcas de calor azuladas perto do freio (gradiente `iridescence` local).
- **Suspensão e barras:** carbono liso (sem sarjado visível), `roughness 0.25`.
- **Skid block (prancha de titânio sob o assoalho):** titânio raspado `#8c8780`, `roughness 0.5`, com arranhões direcionais. Origem das faíscas.
- **Viseira e cockpit:** viseira `transmission 0.9`, `ior 1.5`, tint escuro `#0a0d10`; volante com display emissivo ciano.
- **Asfalto:** `#1a1b1d` seco / `#0e1013` molhado. Molhado: `roughness 0.12`, `clearcoat 1.0`, normal map de ondulação para as poças (ver 6 para reflexo).

### 2.3 Iluminação (por ambiente)

Setup base (herda do `App.js`: uma `key` direcional que o `Director` move por capítulo) mais um `envMap` por ambiente e um `fill` fraco. A regra R10 vale sempre: sujeito quente, mundo frio.

- **Garagem (Preparar):** key = painel LED de teto 5.600 K simulado com uma `RectAreaLight` 2×4 m acima do carro (ou plano emissivo grande no envMap), intensidade média; fill = azul frio `#3a5a78` de baixo (reflexo do piso epóxi cinza-claro); rim âmbar `#ff8a2a` de uma lâmpada de trabalho na traseira. O piso é epóxi com reflexo levemente borrado (ver 6). Sombras suaves, contraste baixo: é a cena "de leitura".
- **Pit lane à noite (Uma volta):** key = holofotes de sódio/LED 3.200 K do topo dos boxes, vindo de cima-atrás em 45° (silhueta com borda dourada); fill = luz fria `#2a3d5a` do céu noturno; luz prática = faróis dos boxes ao fundo como bokeh de disco. Asfalto molhado devolve o âmbar em listras. Contraste alto, sombras densas.
- **Túnel de vento (Controlar):** key = branco frio 6.500 K de cima, dura; dois rims ciano `#38e8ff` laterais (a luz que faz o carbono ler como cromo); fundo em névoa `#0a1218` sem horizonte. A fumaça de traçado só pega a luz nos rims: linhas brancas contra escuro.
- **Pista com chuva:** céu fechado = luz ambiente cinza-azulada `#4a5c6e` de todos os lados, key fraca; o contraste vem dos reflexos: luz de chuva do carro (LED vermelho `#ff1a1a` traseiro), spray retroiluminado pela luz dos boxes. Sem sombras duras.
- **Sala de debrief (Encerrar):** três monitores como únicas luzes (ciano `#38e8ff`, magenta `#ff3d8a`, branco `#ebe6dc`), o carro reduzido a silhueta com três rims coloridos; fundo preto-vinho. É o único ambiente sem key quente, de propósito: o calor foi para o dado.

### 2.4 Partículas e efeitos

Regra R11: poeira ambiente sempre ligada (500 pontos, `AdditiveBlending`, `depthWrite false`, mesmo padrão de `Sparks.js`) + um ou dois sistemas narrativos por capítulo.

- **Faíscas do skid block:** origem na prancha de titânio, quando o carro comprime (curva rápida, frenagem, lombada). Mesmo sistema de `Sparks.js` (120 pontos, gravidade, arrasto, cor quente→fria `#ffe9c9 → #ff8a2a`) com velocidade inicial maior (3–6 u/s), leque para trás e para baixo, vida 0,3–0,8 s, e um "ricochete" no asfalto (inverte `vel.y` uma vez com perda). É a assinatura da cena noturna.
- **Spray de chuva:** dois sistemas. (a) *Rooster tail*: cone de 2.000 sprites brancos semitransparentes `#dfe8f0` saindo das rodas traseiras, retroiluminados, `alpha 0.08`, tamanho crescente com a vida. (b) *Gotas na lente*: quad em tela cheia com o shader do `Fog.js` (fbm + gotas que escorrem com cauda) reaproveitado: `uV` sobe quando o carro entra na chuva. Gota que escorre limpa o rastro: o mesmo truque que hoje limpa o cristal.
- **Calor dos freios:** (a) emissivo do disco (2.2); (b) *heat haze*: distorção de tela por ruído numa máscara circular em torno de cada roda dianteira (um passe de pós com `uv += noise * 0,006 * uBrakeTemp`, ver 6); (c) 30 partículas de brasa que sobem devagar do disco quando parado no box.
- **Flow-vis:** tinta fluorescente `#4dffb0` (verde) ou `#ffd23f` (amarelo) sobre as asas, aplicada como máscara em `emissiveMap` procedural: estrias na direção do fluxo (UV × ruído alongado). Uniform `uFlowVis` (0..1) revela as estrias do bordo de ataque ao de fuga; sob "luz UV" (rims ciano do túnel) o emissivo sobe. É a imagem-chave de "evidência conferida".
- **Linhas de fluxo do túnel:** o `Constellation.js` já desenha segmentos instanciados com máscara de progresso; aqui viram ribbons (tiras de 24 segmentos) que seguem streamlines pré-calculadas em torno do carro (curvas Catmull-Rom autorais: 40 linhas, cada uma com 24 pontos, armazenadas em `Float32Array`). Cor ciano `#38e8ff`, alpha 0,18, `uProgress` desenha da frente para trás. Fumaça de traçado = 3 ribbons brancas mais largas com `fbm` na borda.
- **Telemetria como linhas luminosas:** curvas de velocidade, throttle, freio e delta desenhadas em 3D sobre um plano invisível ao lado do carro (ou "coladas" à pista como fita), com o mesmo shader de ribbon; ciano para velocidade, âmbar para freio, verde para throttle, roxo/verde/amarelo para o delta de setor. Elas entram por `uProgress` sincronizado com o scroll e podem **atravessar** o carro (`depthTest false`).
- **Explosão de peças (constelação):** o estado `explode` do `Watch.js` atual (peças afastam do centro ao longo de eixos) aplicado a ≈40 grupos do carro: asa dianteira, bico, pontas do assoalho, sidepods, tampa do motor, asa traseira, 4 rodas, 4 freios, halo, suspensões. Com `scatter`, as peças flutuam em nuvem e o `Constellation` liga peça a peça.
- **Bandeira/pit board (opcional):** placa de pit board em DOM (`Plate.js` mostra que um plano com foto/cover é barato) com o tempo de volta em fonte display.
- **Flash de fotógrafos:** 2–3 frames de branco `#ebe6dc` a 60% na borda de um wipe (ver 4).

### 2.5 Dez movimentos de câmera (nomeados, com quando usar)

Todos são poses `(camera, target, light, bokeh, bloom)` em função de `local` (0..1), como `cameraPath.js`. Distâncias em unidades da cena com o carro medindo ≈5,6 u de comprimento (escala 1:1 m).

1. **Dolly de nariz a asa traseira.** Câmera a 0,45 u do chão, 1,2 u lateral ao carro, travelling paralelo do bico à asa traseira em 60% do progresso; target acompanha 0,8 u à frente da câmera. DOF curto (range 1,5), bokeh 3,4. *Quando:* abertura (revelar o herói sem mostrá-lo inteiro) e reentrada após uma explosão (o carro "reaparece" peça a peça enquanto a câmera passa).
2. **Contra-plongée de lançamento.** Câmera no asfalto (y 0,15), 2 u à frente do bico, olhando para cima em 12°; a asa dianteira ocupa o terço inferior, o halo e a asa traseira se alinham em cima. *Quando:* primeira imagem inteira do carro montado; momento "critério atingido".
3. **Orbit em explosão de peças.** Órbita de 140° a 7 u de raio, altura 1,6 u, enquanto `explode` vai de 0 a 1 nos primeiros 40% e `scatter` sobe em seguida. Velocidade angular constante para as peças parecerem paradas e a câmera viva. *Quando:* Preparar (diagnóstico, "referência real") e qualquer momento de inventário.
4. **Crane sobre o pit stop.** Começa em altura de mecânico (1,4 u, 3 u lateral), sobe em arco até 6 u de altura quase vertical sobre o carro em 50% do progresso, e desce do outro lado. As quatro rodas trocam durante a subida. *Quando:* Uma volta ("produzir, criticar, revisar" em 2,3 s); é a imagem-chave do loop curto.
5. **Push-in macro no disco de freio.** De 3 u a 0,35 u da roda dianteira direita, target no centro do disco; `worldFocusRange` cai para 0,4; o disco vai de `#2a2a2c` a brasa. Flakes da pintura e furos do disco em primeiro plano. *Quando:* "Verificar o resultado" e "precisão não é opinião": o calor é medido, não sentido.
6. **Rack focus de telemetria.** Câmera parada, 3/4 traseiro a 5 u. O foco sai do carro (nítido) e vai para as ribbons de telemetria a 1,5 u da câmera (que estavam em bokeh). Só `worldFocusDistance` muda, ao longo de 25% do progresso. *Quando:* Avaliar/Controlar: o olhar deixa a sensação e vai ao dado.
7. **Travelling lateral no túnel de vento.** Câmera exatamente perpendicular ao carro a 4,5 u, altura 0,9 u, deslizando de trás para frente **contra** o fluxo das streamlines (o carro parado, o ar passando). *Quando:* Controlar ("crítico independente", "evidência conferida"): o carro não se move; o mundo o testa.
8. **Onboard (câmera T).** Câmera na posição da T-cam (acima do halo, 0,3 u atrás), FOV 70°, olhando à frente; a pista rola sob o carro (asfalto com UV animado), chuva ou faíscas entram pela borda. *Quando:* "Uma volta" em movimento; e no clímax, a volta com critério atingido (setor roxo).
9. **Órbita A/B.** Meia órbita de 180° em torno de dois carros lado a lado (ou carro + ghost sobreposto), raio 9 u, altura 2 u; no meio da órbita a câmera passa entre os dois. *Quando:* comparação de versão (peça trocada destacada), "reverter regressões".
10. **Recuo de debrief.** Câmera parte de um close (viseira ou volante) e recua em linha reta 12 u ao longo de 70% do progresso, revelando monitores, a sala e por fim o carro pequeno e imóvel no centro; bloom sobe de 0,1 a 0,55 no final (como o capítulo 5 atual). *Quando:* Encerrar: a última imagem responde à primeira (o mesmo carro, agora entendido).

Movimento de ligação, não numerado: **chicote lateral** (pan rápido de 30° em 6% do progresso) que motiva o wipe diagonal — o wipe entra na direção do pan.

---

## 3. Catálogo de estados do herói (endereçáveis por scroll)

Todos são uniforms/propriedades contínuas 0..1, reversíveis, escritas pelo `Director` por capítulo (padrão `w.explode = ease(seg(L, a, b))`). Combináveis, exceto onde indicado.

| Estado | Parâmetro | O que acontece | Combina com |
|---|---|---|---|
| Montado | `explode = 0`, `scatter = 0` | Carro íntegro no chão, suspensão em altura estática | todos |
| Explodido em peças | `explode` 0..1 | ≈40 grupos afastam do centro ao longo do próprio eixo (asas para frente/trás, rodas para os lados, tampa para cima), rotação leve por peça | `scatter`, `constellation`, `hotspots`, `blueprint` |
| Constelação | `scatter` 0..1 | Peças explodidas flutuam em nuvem com deriva senoidal; `Constellation` liga pares | `explode = 1` |
| Em movimento | `speed` 0..1 | Rodas giram (rpm ∝ speed; acima de 0,4 troca para textura de raio borrado), asfalto rola sob o carro, poeira estica em riscos, suspensão vibra 2 mm, pneus deformam 1% no contato | `rain`, `sparks`, `onboard` |
| Compressão (curva/freada) | `squat` -1..1 | Suspensão comprime (dianteira na freada, traseira na aceleração), assoalho toca o chão → faíscas | `speed`, `brakeHeat` |
| Freios incandescentes | `brakeHeat` 0..1 | Rampa emissiva do disco, heat haze, brasa | todos |
| Em túnel com fumaça | `tunnel` 0..1 | Ribbons de streamline e 3 ribbons de fumaça; rodas giram sobre esteira; rims ciano sobem | `flowVis` |
| Flow-vis | `flowVis` 0..1 | Estrias fluorescentes aparecem do bordo de ataque ao de fuga | `tunnel` |
| Sob chuva | `rain` 0..1 | Asfalto molhado (roughness ↓), spray traseiro, gotas na lente, LED traseiro pisca, luz ambiente azula | `speed` |
| Peças trocadas destacadas | `swap` 0..1 + `swapSet` (lista de peças) | As peças listadas ganham contorno âmbar (segundo material com `side BackSide` e escala 1,02) e se afastam 0,15 u; o resto escurece 40% | `explode` até 0,3 |
| Comparação lado a lado A/B | `ab` 0..1 | Segunda instância do carro entra deslizando de 3 u à direita; diferenças entre A e B destacadas com `swapSet` no B | `orbit A/B` |
| Ghost car sobreposto | `ghost` 0..1 | Segunda instância na mesma posição, material aditivo ciano `#38e8ff` a 25%, deslocada `ghostOffset` u à frente/atrás (delta de tempo) | `speed`, `telemetry` |
| Telemetria viva | `telemetry` 0..1 | Ribbons de dados entram e acompanham o carro | todos |
| Pit stop | `pit` 0..1 | Sequência: carro para (0–0,1), macacos sobem 5 cm (0,1–0,2), 4 rodas saem em explosão lateral curta (0,2–0,5), 4 rodas novas entram (0,5–0,8), macacos descem (0,8–0,9), carro sai (0,9–1) | `crane`, `sparks` fraca |
| Silhueta de debrief | `silhouette` 0..1 | Key apaga, 3 rims coloridos sobem, carro fica em contra-luz | `telemetry` |
| Desgaste | `wear` 0..1 | Graining dos pneus, sujeira no assoalho, marcas de borracha | `speed` |

Regra de exclusão: `explode > 0,3` desliga `speed`; `ab` e `ghost` não coexistem; `tunnel` e `rain` não coexistem.

---

## 4. Tipos de transição entre ambientes

A referência usa um único tipo (R6). Propomos o wipe diagonal como padrão e três variantes motivadas, todas nos últimos 14% do capítulo (`seg(L, 0.86, 1)`), com o rótulo do próximo capítulo aparecendo junto ao ponto ativo durante a varredura.

1. **Wipe diagonal padrão (a regra).** Diagonal a −20° varre do canto inferior esquerdo ao superior direito, borda com `fbm` como no `Background.js`, mas aplicada **à imagem inteira** como passe de pós: a cena A e a cena B são o mesmo mundo com dois conjuntos de uniforms (envMap, luzes, fundo, estado do herói) — renderiza-se uma vez com um `uMix` que interpola o fundo e as luzes, e a diagonal só decide **qual paleta de pós** (tint, vinheta, grão) vale em cada lado. Custo: um passe extra de tela cheia. Usar em: garagem → pit lane, pista → debrief.
2. **Wipe motivado por objeto.** Um elemento da cena passa em primeiro plano desfocado e cobre a tela por ≈8% do progresso: a porta do box descendo, a parede do pit wall, um mecânico com o macaco, a lateral de outro carro. Atrás dele, a troca de ambiente acontece. Custo: um plano/geometria simples em primeiro plano. Usar em: pit lane → pista (a parede do pit passa), túnel → garagem (a porta).
3. **Corte por luz (blackout).** As luzes do ambiente apagam (`key` e envMap a zero em 4% do progresso, sobra só o emissivo do freio ou os LEDs), 2% de escuro, e as luzes do novo ambiente acendem em sequência (rims ciano do túnel acendem um por um). Custo: zero. Usar em: garagem → túnel de vento; debrief → final.
4. **Passagem de fumaça/spray.** A fumaça de traçado ou o spray de chuva sobe até cobrir 100% do quadro (as ribbons brancas engrossam, alpha a 0,9), o ambiente troca por trás, a fumaça dissipa. Custo: as mesmas ribbons/sprites, mais quads de tela. Usar em: túnel → pista com chuva; pista com chuva → pit lane.
5. **Flash de fotógrafos (pontuação).** Não é transição, é acento: 2 frames a 60% de branco na borda de um wipe, com aberração cromática subindo a 0,004 por 0,2 s. Usar uma vez por experiência, no momento "critério atingido".
6. **Dissolução de texto como ponte (R3).** Sempre que a câmera parte de uma parada, o título dissolve em partículas na direção do movimento — não é uma transição de ambiente, mas é o que costura a leitura à viagem. Implementação em 6.

---

## 5. HUD proposto (o que muda em relação ao atual)

Manter o que já funciona no `index.html`/`styles.css` (HUD fixo, dots à direita, menu, ficha, registro, tooltip, progress, hint, creditos, acessibilidade `.sr-only`) e mudar a pele e a semântica:

- **Pontos de capítulo → setores de uma pista.** O `.dots` vira um traçado em miniatura (SVG de ≈120×160 px, linha fina `#8a9099`) com 4 a 6 nós nos pontos de capítulo; o nó ativo recebe o anel giratório (mesmo desenho do hotspot); o trecho percorrido colore-se de âmbar. Durante o wipe, o rótulo do próximo capítulo aparece à esquerda do nó (como "REAL WORLD TESTING" em corn-12) e some 2 s depois — hoje o `span` só aparece em hover.
- **Barra de progresso → cronômetro de volta.** O fio dourado de 2 px no topo continua, em âmbar `#ff8a2a`; ao lado do logo, um `output` com fonte display mostra o progresso como tempo de volta (`1:23.456`, `font-variant-numeric: tabular-nums`, como o `#deviation` atual). É diegético e reforça "o cronômetro manda".
- **Registro → Livro de bordo da sessão.** A gaveta `.registro` mantém a estrutura (lista, export JSON, limpar), mas os tipos `evidencia | decisao | resultado` viram `leitura | mudança | volta`. Cada volta registrada mostra delta com cor de setor (roxo/verde/amarelo). Borda esquerda em ciano `#38e8ff` em vez de dourado.
- **Cenários (frio/calor/impacto/posição) → Condições.** O bloco `.scenarios` vira `Seco · Chuva · Pneu duro · Pneu macio` e o gráfico de deriva (`#drift`, 280×64) vira gráfico de delta por setor: linha de referência tracejada (a volta de referência) e a linha âmbar da volta atual. O `output` mostra `−0,312 s` em vez de `s/dia`. Cada condição escreve `rain`, `wear` e `brakeHeat` no herói.
- **Dica de scroll:** "Role para dar corda" → "Role para sair dos boxes"; o traço animado vira uma seta de pit lane (linha + ponta) em âmbar.
- **Hotspots:** o anel do `Hotspots.js` fica como está (é fiel à R5); adicionar a variante grande com texto dentro (`EXPLORAR A TELEMETRIA`, `ABRIR O DEBRIEF`) para os aprofundamentos, em DOM sobre a projeção 3D (como o tooltip já faz). Cor ciano, não dourado.
- **Callouts (`.callout__label`):** manter a linha-guia + anel + rótulo; cor da linha em marfim, rótulo em display, subtítulo em ciano. Na explosão de peças, um callout por peça em foco.
- **Ficha:** manter o layout esquerdo (R4) e o bloco "Na Fórmula 1" com borda vermelha `--ruby` → trocar por borda âmbar e rótulo "Fato de pista" com equipe e ano em `small`.
- **Tipografia:** manter Bebas Neue (display) e Lato (corpo) — coincidem com a referência (condensada em caixa alta + humanista). Ajustar `letter-spacing` dos rótulos pequenos para `.22em` e dos títulos 3D para `0.01` (mais apertado, como a referência).
- **Cor de marca no HUD:** `--gold: #d3a94f` → `--amber: #ff8a2a`; `--steel: #8fa3b8` → `--cyan: #38e8ff`; `--ruby` → `#ff3b1a`.
- **Menu de capítulos:** manter o outline → cheio no hover; numeração `01`… em âmbar.
- **Créditos:** "Dados ilustrativos" → "Fatos verificáveis; dados de telemetria ilustrativos".

---

## 6. Restrições de viabilidade (o que é caro em WebGL e como simular barato)

Orçamento alvo: 60 fps em laptop integrado, 30 fps em celular médio, ≤ 120 draw calls por quadro, ≤ 40 MB de assets, sem vídeo.

| Desejo | Custo real | Como simular barato |
|---|---|---|
| Carro ultra-realista | Um GLTF de 1,5 M triângulos e texturas 4K trava o carregamento e o DOF | Modelo autoral de ≈180 k triângulos (Draco), ≈40 grupos separados para explodir, LOD de 60 k para celular. Materiais procedurais (sarjado, flakes, furos do disco) em shader, sem texturas grandes. Um `envMap` HDR 1 K por ambiente (5 arquivos, ≈1,5 MB cada em `.hdr` comprimido) trocado por `uMix`. |
| Reflexos no asfalto molhado / piso epóxi | Reflexo planar exige renderizar a cena duas vezes; SSR é instável | Uma única renderização espelhada em resolução 0,35 só na cena de pit lane e chuva (o carro parado ou com pouca geometria visível), borrada por `roughness` no shader do piso. Nos outros ambientes, o envMap basta. |
| Motion blur | Por-objeto é caro e ruidoso | Rodas: acima de `speed 0,4`, trocar o material do raio por textura pré-borrada (3 estágios) e girar o aro; pista: UV do asfalto rola; poeira: partículas alongadas na direção da velocidade (o `gl_PointSize` já é por profundidade; esticar via quad instanciado). Nunca um passe de blur de tela. |
| Fumaça volumétrica no túnel | Raymarching de volume é proibitivo em celular | Ribbons de fumaça (3 tiras largas com `fbm` na borda) + 2 quads de tela com ruído lento. Em celular, só as ribbons. |
| Chuva | Física de gotas, colisão com carroceria | Sprites do rooster tail (2.000, um draw call) + shader de gotas na lente (reaproveitar `Fog.js`) + `roughness` do asfalto. Sem gotas no carro; o brilho molhado vem de `clearcoat` a 1,0 e `roughness` 0,05. |
| Freios incandescentes | Emissivo forte estoura o bloom em tudo | Bloom com `luminanceThreshold 1.0` (já é assim): só o disco passa. Heat haze como passe de pós mascarado (círculo de raio 0,5 u projetado em torno de cada roda, `uv += noise * 0,006`), custo de um passe de tela. Em celular, sem haze. |
| Faíscas | Sistema de física | O `Sparks.js` já resolve (120 pontos, integração simples); só mudam origem, velocidade e o ricochete. |
| Texto que dissolve em partículas | Simular cada glifo | No construtor, rasterizar o título num canvas (como `Hotspots._buildAtlas`), amostrar ≈3.000 pixels opacos e guardar as posições. O estado "dissolvendo" (0..1) troca o `Text` do troika por `Points` nessas posições, com deslocamento = `noise * t` na direção da câmera e alpha `1 − t`. Um draw call por título; texturas zero. |
| Título metálico (R3, corn-03) | Material PBR no SDF do troika | O troika aceita `material` customizado: `MeshStandardMaterial` com `metalness 0.9`, `roughness 0.35` e o mesmo envMap do ambiente, fundido com o `fillOpacity` atual. Custo zero extra. |
| Explosão de ≈40 peças + constelação | Muitos draw calls | As 40 peças são filhos de um grupo; cada peça mantém material compartilhado (4 materiais no total: carbono, pintura, borracha, metal), então o custo é ≈40 draws; a constelação é 1 draw (já é). Aceitável. |
| Ghost car / A/B | Dobra a geometria | Mesma `BufferGeometry`, segunda `Mesh` com material aditivo (ghost) ou os mesmos 4 materiais (A/B). Geometria não duplica na GPU. A/B só quando `explode = 0`. |
| Pista inteira | Cenário enorme | Não existe pista: um trecho de 40 u de asfalto com UV animado, guard-rail e postes instanciados (20 instâncias) que se teleportam para a frente, névoa `#0d1216` a 30 u. O carro fica sempre na origem; o mundo passa por ele. |
| Pit stop com mecânicos | Personagens animados | Sem mecânicos: as pistolas e os macacos entram como silhuetas (2 planos com alpha) e as rodas trocam sozinhas. A câmera em crane (mov. 4) e o som/timing vendem a cena. |
| Flow-vis | Pintura simulada | Máscara emissiva procedural (estrias por UV × ruído alongado) com `uFlowVis` como limiar; custo zero. |
| Telemetria e streamlines | Curvas por frame | Ribbons instanciadas (mesmo padrão do `Constellation.js`), pontos pré-calculados em `Float32Array` no carregamento; 1 draw call por conjunto. |
| Wipe sobre a cena inteira | Renderizar duas cenas | Renderizar uma vez e decidir a paleta de pós por lado da diagonal (tint, vinheta, grão) + interpolar luzes/envMap por `uMix`. O que muda de fato entre lados é cor e luz, não geometria. |
| DOF forte (R8) | O DOF do `postprocessing` a 0,6 de resolução já é o passe mais caro | Manter `resolutionScale 0.6` desktop / 0.5 celular; `bokehScale` ≤ 1,8 em celular (regra já existente no `Director`). Nunca combinar DOF + haze + reflexo planar no mesmo capítulo em celular: o `Director` desliga haze e reflexo quando `isMobile`. |
| Partículas com `depthWrite false` viram borrão no DOF | Já documentado em `Sparks.js` | Manter brilho alto (lê como cintilação) e `depthWrite true / depthTest false` nos anéis de hotspot (como `Hotspots.js`), para o DOF saber a profundidade. |
| Carregamento | 5 envMaps + modelo + fontes | Preloader com porcentagem (já existe); envMaps carregam em ordem de capítulo, o primeiro bloqueia, os outros em segundo plano; `import.meta.glob` de `fx/index.js` continua tolerando módulo ausente. |
| `prefers-reduced-motion` | Todo o acima é movimento | Como hoje: câmera fixa, `bokeh 1.8`, sem partículas narrativas, sem haze; o carro só troca de estado por cross-fade de opacidade. Narrativa completa em `.sr-only`. |
| Mobile em retrato | A referência pede paisagem | Aceitar retrato: texto no topo, herói embaixo (o `Director.layout()` já faz), estados `ab` e `orbit A/B` substituídos por `ghost` (cabe na tela estreita). |

Regra final de viabilidade: cada capítulo escolhe **no máximo dois** efeitos caros (reflexo planar, haze, fumaça, spray, DOF curto) e o `Director` zera todos os outros no início do quadro, como já faz com `fx.*.set(0)`.
