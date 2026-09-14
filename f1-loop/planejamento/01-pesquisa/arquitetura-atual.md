# Arquitetura atual do site (`relogio-de-precisao`) — mapa para a narrativa F1

Data: 2026-09-12. Fonte: leitura direta de `src/main.js`, `src/core/*.js`, `src/data/*.js`, `src/ui/ui.js`, `src/watch/Watch.js`, `src/fx/*.js`, `index.html`, `tests/*.test.js`, `package.json`, `.github/workflows/ci.yml`.

Stack: Vite 8, three 0.186, postprocessing 6.39, troika-three-text 0.52, Lenis 1.3, GSAP 3.15 (só ScrollTrigger). Testes: `node --test tests/*.test.js` (Node 22 no CI, seguido de `vite build`). Fontes: Bebas Neue (títulos, TTF em `/fonts/`) e Lato (corpo).

---

## 1. Fluxo de dados: do scroll ao quadro

```
DOM #scroll (6 <section>, alturas = PESOS[i] × 100svh)
   │  Lenis (suaviza a roda; lerp 0.11; 1.0 em reduced-motion)
   │  ScrollTrigger (start 'top top', end 'bottom bottom', snap: false) — SÓ OBSERVA
   ▼
Scroll.apply(progress 0..1, velocity)
   │  resolveChapter(progress, bounds) → { progress, chapter, local }
   │  bounds = stitchBounds(offsetTop/range de cada section)  (medido no DOM, re-medido em refresh)
   │  listeners: ui.js (HUD) — Director NÃO é listener: lê scroll.chapter/local todo quadro
   ▼
App.tick (renderer.setAnimationLoop)  →  updaters em ordem de registro (main.js):
   1. director.update(dt, t)
        a. sampleCameraPose(ch, local, {portrait, reduced})  ← cameraPath.js (função pura)
        b. titles[i].set(reveal, leave)                       ← Title.js (troika, cena overlay)
        c. bg.set(corA, acentoA, corB, acentoB, mix)          ← Background.js (wipe diagonal)
        d. zera todos os fx; switch(ch) escreve watch.state + fx.*.set(v)   (coreografia por capítulo)
        e. contrato de layout (herói à direita do texto, escala clamp 0.46..0.84)
        f. suaviza câmera/herói/luz (k = 1 − 0.0015^dt), watch.update(dt, t, pointer)
        g. post.focus(distância câmera→herói), post.setBokeh, post.setBloom
        h. camera.lookAt + updateMatrixWorld (fx que projetam para a tela rodam DEPOIS)
   2. dust.update (Particles, poeira ambiente)
   3. constellation.update(t)
   4. fx[*].update(dt, t)  (Hotspots, Reference, Curve, Finale, Fog, Blueprint, Sparks, CrownDrag, Plate, Callouts)
   ▼
Post.render: RenderPass(scene) → EffectPass(DOF, Bloom) → Chroma (desktop) → RenderPass(overlay, sem clear: títulos nítidos)
              → EffectPass(ACES, Noise 0.08, Vignette 0.62) → SMAA
```

Pontos de atenção do fluxo:

- **Uma cena, uma câmera, um herói.** `Watch` é um `THREE.Group` único que atravessa os seis capítulos; a câmera vive na cena `overlay` (os títulos troika são filhos da câmera, por isso ficam sempre nítidos depois do DOF).
- **Estado é função do scroll, sem memória de quadro anterior** (exceto suavização por lerp). `cameraPath.js` é puro; o teste exige que voltar o scroll reproduza exatamente a mesma pose.
- **Defaults por quadro:** o Director zera `scatter/opened/running/health/wind` e chama `fx.*.set(0)` em todo quadro; cada `case` só escreve o que difere. Efeitos que não recebem `set()` fora do seu capítulo têm um *gate* interno por capítulo (Fog, Sparks, Blueprint) — padrão a manter nos fx novos.
- **UI em DOM** lê `scroll.onChange(s)`: pontos de capítulo, menu, ficha (essência + lições + F1), aprofundamentos (`PAGINAS`) sobrepostos ao percurso, cenários (só no capítulo 4), registro (localStorage), créditos, `body.dataset.chapterIndex`, classe `chapter-text-right` para capítulos ímpares.
- **Fallback sem WebGL** (`main.js → fallback()`): despeja `CAPITULOS` e `PAGINAS` como HTML puro. A narrativa precisa ler bem em texto corrido.
- **Acessibilidade:** `Scroll` gera `.sr-only` por seção com `nome + titulo (sem \n) + corpo + hotspots + essencia + licoes + f1`.

---

## 2. Schema exato de `CAPITULOS` e `PAGINAS` e quem consome cada campo

### 2.1 `CAPITULOS[i]` (`src/data/narrativa.js`, `N = CAPITULOS.length`)

| Campo | Tipo | Obrigatório | Consumidores |
|---|---|---|---|
| `id` | string (ex.: `"avaliacao"`) | sim (teste) | só o teste; não é usado no motor |
| `slug` | string (`"capitulo-N"`) | sim | `Scroll` (id da `<section>`, `aria-labelledby`), `ui.js` (href dos pontos/menu, `history.replaceState('#slug')`, deep link inicial), `main.js` fallback não usa |
| `nome` | string curta (1 palavra) | sim | `ui.js`: pontos laterais, menu, ficha (`"Essência · 01 Nome"`), mapa do ciclo (rótulos do mostrador, painel); `Scroll` `.sr-only` `<h2>`; fallback |
| `titulo` | string, **3 linhas separadas por `\n`, caixa alta** | sim | `Director → new Title({text})` (troika SDF, `fontSize 0.5`, `maxWidth 3.5`, contorno que se preenche); `Scroll` e fallback substituem `\n` por espaço |
| `corpo` | string, uma frase | sim | `Title({body})` (Lato 0.115, `maxWidth 3.1`); `.sr-only`; fallback |
| `cor` | number (hex decimal) | sim, de fato | `Director → bg.set(...)`: cor de fundo A/B do wipe diagonal |
| `acento` | number (hex decimal) | sim, de fato | `Title` (linha de regra colorida), `Background` (glow/mist), `Watch.backdropMat` (poça de luz atrás do herói, ×0.4), `Hotspots` (cor dos anéis) |
| `essencia` | string, uma frase | sim (teste) | `ui.js` ficha (`#ficha-essencia`), mapa (`.ess`), `.sr-only` `<h3>`, fallback |
| `licoes` | array **≥ 3** de `{ termo, texto, pagina? }` | sim (teste) | `ui.js` ficha (lista com numerais romanos I..V — só 5 romanos definidos), mapa; `pagina` (string `"loop"`/`"grafo"`) vira `li.has-pagina[data-pagina]` clicável que rola para o aprofundamento; `.sr-only`; fallback |
| `hotspots` | array opcional de `{ id, nome, texto }` (máx. **4**) | não | `Hotspots.js`: lê só `CAPITULOS[1]` e `CAPITULOS[2]`, mapeia por índice às peças em `ANCORAS[k]` (`'ponteiro-segundos','balanco','caixa','coroa'` / `'tambor-da-mola','roda-escape','balanco','roda-central'`); `nome`+`texto` vão para `#tooltip` e para o `registro`; `id` não é usado pelo motor; `.sr-only` `<ul>` |
| `cenarios` | objeto `{ frio, calor, impacto, posicao }` cada um `{ desvio:number, texto }` | só em `CAPITULOS[4]` (teste) | `ui.js`: botões `#scenarios[data-scenario]` (nomes fixos no HTML), `#deviation` (`fmt(desvio)` em s/dia), gráfico de deriva SVG (forma da curva hardcoded por nome), `registro`; `Director case 4`: `health` por nome, `fx.reference.set(v, desvio, nome)` |
| `f1` | `{ termo, texto }` | sim (teste) | `ui.js` ficha (`#ficha-f1`), painel do mapa; `.sr-only` `<p>`; fallback |

Observações que afetam a escrita:

- **Número de capítulos = 6 está hardcoded** em: `Scroll.PESOS` (6 pesos; `PESOS[6]` seria `undefined` → altura `NaN`), `cameraPath` (`Math.min(5, chapter)`, `switch` 0..5), `Director.switch` 0..5, `Registro.FASES` (6 nomes), `Callouts.ROTULOS` 0..5, `ui.js` (`s.chapter === 5`, `>= 4`, `CAPITULOS[4].cenarios`, `id === 'loop' ? 4 : 5`), teste `N === 6`.
- **Índices com semântica fixa:** capítulo 4 = cenários + referência; capítulos 4 e 5 = aprofundamento (`PAGINAS`) em `local ≥ 0.64` e ficha antecipada (`0.36–0.63` em vez de `0.50–0.98`); capítulo 5 = registro automático + créditos em `local > 0.97` + `finale`. Capítulos ímpares trocam o herói de lado (paisagem).
- **Conjunto de caracteres pré-carregado** (`Title.preloadFonts`): título `A–Z Á É Í Ó Ú Â Ê Ô Ã Õ Ç 0–9 . , : ; + - % / espaço`; corpo idem em minúsculas e mais `( )`. Caracteres fora disso (`?`, `!`, `—`, `“ ”`, `À`, `Ü`, dígitos com vírgula decimal são OK) rasterizam tarde ou não rasterizam no primeiro quadro. Títulos sem `?`/`!`/travessão.
- **Larguras:** título `maxWidth 3.5` unidades a `fontSize 0.5` (≈ 14–16 caracteres Bebas por linha em caixa alta antes de quebrar); corpo `maxWidth 3.1` a `0.115` (≈ 60–70 caracteres antes de segunda linha). O texto atual tem 3 linhas de até 16 caracteres e corpo de até ~48 caracteres.

### 2.2 `PAGINAS[id]` (`src/data/paginas.js`)

| Campo | Tipo | Consumidores |
|---|---|---|
| `rotulo` | string (`"Avaliação · aprofundamento"`) | `ui.js` `<small>` do slide |
| `titulo` | string | `<h2>`; fallback |
| `lead` | string curta | `.lead`; fallback |
| `imagem` | nome de arquivo em `public/` | `<img src=BASE_URL+imagem>`; teste exige `loop.imagem` `.jpg` e `grafo.imagem === 'pagina-grafo-final.png'` |
| `alt` | string | `alt` da imagem |
| `metafora` | string | `<figcaption>` |
| `secoes` | array de `{ titulo, itens: string[] }` (4 × 3 no atual) | grade `.aula-grid`; fallback |

Ligação: `licoes[k].pagina = "loop"` → `openPagina('loop')` → `scroll.to(4, 0.78)`. O mapa `id → capítulo` (`loop→4`, `grafo→5`) está hardcoded em `ui.js`.

---

## 3. Contrato de coreografia

### 3.1 Progresso

- `scroll.progress` global 0..1 sobre `scrollHeight − innerHeight`.
- `scroll.chapter` = índice da seção; `scroll.local` = 0..1 dentro da seção (bounds costurados: fim de i = início de i+1, último termina em 1).
- Alturas: `PESOS = [2.8, 3.4, 3.4, 3.6, 5.0, 5.0]` × `100svh` (+1 tela na última). Peso maior = mais rolagem por unidade de `local` = leitura mais longa. Capítulos com aprofundamento pesam 5.0.
- Navegação: `scroll.to(i, t = 0.26)` (título já visível); mapa usa `t = 0.56` (ficha visível); aprofundamento `t = 0.78`.

### 3.2 Helpers (Director e cameraPath)

- `seg(L, a, b)` = clamp linear de `L` entre `a` e `b`; `ease(x)` = smoothstep. `segment(v, a, b)` no cameraPath já inclui o smoothstep.
- Toda visibilidade é `ease(seg(L, in0, in1)) * (1 − ease(seg(L, out0, out1)))` — janela com rampas. É o idioma a manter nos dados v2.

### 3.3 Janelas fixas por capítulo (progresso local `L`)

| Janela | Capítulos 0–3 | Capítulos 4–5 |
|---|---|---|
| Transição de câmera (órbita) | `L < 0.18` (`TRANSITION`) | idem |
| Título entra | `seg(L, 0.08, 0.24)` (cap. 0 e retrato: `0.02–0.20`) | idem |
| Título sai | `seg(L, 0.40, 0.50)` | `seg(L, 0.30, 0.36)` |
| Ficha (essência + 3 lições + F1) | entra `0.50–0.62`, sai `0.88–0.98` | entra `0.36–0.43`, sai `0.58–0.63` |
| Callout (rótulo de peça) | `0.30–0.42` entra, `~0.78–0.86` sai (cap. 3: sai `0.60–0.68`) | cap. 5 sai `0.72–0.80` |
| Aprofundamento (`PAGINAS`) | — | `L ≥ 0.64`; zera callouts/reference/curve/finale em `L ≥ 0.62` |
| Wipe de fundo para o próximo | `seg(L, 0.86, 1)` (ângulo −0.35 rad, borda com fbm) | idem; último capítulo não faz wipe |
| Cenários (HUD) | — | cap. 4: `0.18 < L < 0.58` |
| Créditos | — | cap. 5: `L > 0.97` |

### 3.4 Transição de 18 %

`sampleCameraPose(ch, L)`: se `ch > 0` e `L < 0.18`, mistura `pose(ch−1, 1)` → `pose(ch, 0.18)` com `smooth(L/0.18)` em **todas** as chaves numéricas/arrays da pose (`camera, target, light, heroX, heroY, rotation, yaw, bokeh, bloom, side, radius, maxScale, layoutWeight, portraitScale`), mais uma órbita `sin²(π·blend)` (amplitude 0.4 em x alternando lado, 0.14 em y, +0.22 em z) com velocidade zero nas pontas. Consequências:

- **Cada capítulo começa exatamente na pose final do anterior** (teste `deepEqual`).
- A pose de um capítulo em `L = 0.18` deve ser uma "vista estável" — entre 0.18 e as janelas de saída a câmera fica parada para leitura (teste: `pose(ch, 0.5) === pose(ch, 0.7)` para 0, 1, 2, 4).
- Restrições numéricas testadas: `camera.z ∈ [6.4, 7.82]`, `|camera.x| ≤ 1.2`, tudo finito; `side` cruza 0 em `L = 0.09` e é ±1 fora da transição, alternando por paridade em paisagem, sempre +1 em retrato.
- `reduced` (prefers-reduced-motion): câmera fixa `[0, 0.2, 7.3]`, alvo `[0,0,0]`, rotação 0, bokeh 1.8, bloom 0.1 — a narrativa precisa funcionar sem movimento de câmera.

### 3.5 Estado do herói (`watch.state`) escrito pelo Director

`explode` (0 montado → 1 explodido em ordem de montagem, com escalonamento), `scatter` (peças em constelação), `opened`, `wind`, `running`, `health`, `spinCrown` (só CrownDrag). O Director só escreve o que muda; a escala do herói vem do contrato de layout (herói nunca cobre a coluna de texto em paisagem; retrato usa `portraitScale`).

### 3.6 Suavização

Câmera, alvo, herói, luz, yaw, rotação z, bokeh, bloom: `lerp` com `k = 1 − 0.0015^dt` (~ 0,25 s). Escala do herói: `k = 1 − 0.001^dt`. Isso significa que cortes secos não existem — para "corte" é preciso wipe de fundo + fade de efeito, não teleporte de câmera.

---

## 4. O que os testes exigem da narrativa

`tests/narrativa.test.js` (falha o CI se não cumprir):

1. `N === 6` e `CAPITULOS.length === 6`.
2. Para cada capítulo: `id`, `slug`, `nome`, `titulo`, `corpo` truthy; `essencia` truthy; `licoes` é array com `length ≥ 3`; `f1.termo` e `f1.texto` truthy.
3. `CAPITULOS[4].cenarios` tem exatamente as chaves `frio`, `calor`, `impacto`, `posicao`, cada uma com `desvio` numérico, `texto` truthy e **sem** campo `descricao`.
4. `PAGINAS.loop.imagem` termina em `.jpg`; `PAGINAS.grafo.imagem === 'pagina-grafo-final.png'`.

Os outros testes não leem dados, mas restringem o motor que a narrativa vai pilotar:

- `cameraPath.test.js`: 6 capítulos (`ch < 6`), continuidade em fronteiras, câmera dentro de `z ∈ [6.4, 7.82]`, `|x| ≤ 1.2`, pose estacionária durante leitura, reversibilidade, lados alternados, reduced-motion fixo.
- `scroll.test.js`: `stitchBounds`/`resolveChapter` com 6 seções.
- `registro.test.js`: `FASES[4]`, `FASES[5] === 'Aprendizado'` (nomes de fase hardcoded — a versão F1 precisará de sua própria lista e chave de storage).
- `webgl.test.js`: detecção; não afeta narrativa.

Não há teste de número de linhas do título nem de comprimento; a restrição de **3 linhas** é convenção (`\n`) + largura do troika (`maxWidth 3.5`). O briefing pede 2–3 linhas; 2 linhas cabem no mesmo bloco (a regra e o corpo ficam em posições fixas `y = −1.02 / −1.16`, então um título de 2 linhas deixa um vão — aceitável, ou ajustar `Title.setLayout`).

---

## 5. O que estender ou substituir para um carro de F1 (só apontar)

| Peça atual | Destino F1 | O que muda |
|---|---|---|
| `src/watch/Watch.js` + `gear.js` | `src/car/Car.js` (+ `parts.js`) | Herói continua um `Group` com `parts[]` nomeadas, `userData.home/apart`, `assemblyOrder`, `state` contínuo. Estado novo: `explode`, `scatter`, `bodywork` (carenagem aberta), `wheelsOn`, `rpm/speed` (giro das rodas, vibração), `rain`, `damage`, `drs`, `pitJack` (carro erguido). Geometria: modelo GLTF (carro realista exige asset, não procedural) com nós nomeados (asa dianteira/traseira, assoalho, sidepods, rodas ×4, halo, motor, câmbio, suspensão). `Constellation` lê `watch.parts` — mantém a interface. `backdropMat` e sombra de contato viram sombra de pista/box. |
| `cameraPath.js` | `cameraPath.js` (reescrito por capítulo) | Manter `sampleCameraPose` puro, `TRANSITION`, poses por capítulo com `L`; ampliar limites de z (carro é longo: fov 32 a z=7 enquadra ~4 un.) e atualizar os testes numéricos. Adicionar `fov` ou `dolly` na pose se o Corn pede close ↔ grande plano. |
| `Background.js` | `Environment.js` ou vários fundos | Hoje o fundo é um shader 2D de gradiente + wipe. Ambientes (túnel de vento, simulador, garagem, pit lane, pista, sala de debrief) pedem: continuar com o wipe diagonal (`uMix`, `uAngle`) mas trocando **placas** (fotos/renders, como `Plate.js` já faz) ou ambientes 3D leves por capítulo. `Plate.js` (`FOTOS` map) é o caminho de menor custo: uma placa por ambiente + DOF. |
| `Director.js` | `Director.js` orientado a dados | Hoje a coreografia é um `switch` com números literais. Para a narrativa F1, migrar para leitura de `capitulo.coreografia` (janelas `[a, b]` em `L`) ou manter o `switch` e usar o schema v2 como documentação. Manter defaults por quadro e gates. |
| `fx/Fog, Sparks, Blueprint, Curve, Finale, Reference, CrownDrag, Plate, Callouts, Hotspots` | fx novos com a mesma interface `(app, hero, scroll)`, `set(...)`, `update(dt, t)` | Candidatos: `WindTunnel` (linhas de fluxo/fumaça sobre o carro), `Rain`/`Spray` (partículas + gotas na lente), `TyreSmoke`, `PitCrew` (silhuetas/luzes de pistola), `Telemetry` (traço de volta/gráfico 3D, substitui `Reference`+`Curve`), `Wipe` (já existe no Background), `Debrief` (linha do tempo), `DRS/Sparks` (faíscas de assoalho reaproveitando `Sparks`). `Hotspots.ANCORAS` e `Callouts.ROTULOS` passam a nomear peças do carro; mover para os dados (`hotspots[i].peca`). |
| `ui.js` cenários | HUD de telemetria | `#scenarios` tem 4 botões fixos no HTML e gráfico com formas hardcoded por nome; a F1 troca por cenários como `pneu-duro/médio/macio`, `chuva`, `asa +1`, com `desvio` em segundos por volta (delta) e gráfico por volta. Generalizar `drawDrift` para ler uma série `[n]` dos dados. |
| `ui.js` ficha / mapa | Ficha idêntica (essência, 3 lições, "Na Fórmula 1"); mapa do ciclo vira "mapa do loop" (anel de 4 fases ou pit board) | `ROMANOS` tem 5; `fichaMapa` só no último capítulo; nomes de fase de `Registro.FASES` a trocar. |
| `Registro.js` | mesmo módulo, `CHAVE` e `FASES` próprias | Sugerido: `f1-loop:registro`, fases = nomes dos capítulos novos. |
| `index.html` | novo `index.html` na pasta F1 | Logo/nome, dica "Role para dar corda" → "Role para sair dos boxes", meta, favicon, `#scenarios` gerado por JS a partir dos dados. |
| `Title.js` | igual | Preload de caracteres: adicionar `?`, `!`, `—` se a narrativa usar. |
| `styles.css` | paleta própria | Variáveis `--gold`, `--ink`, `--steel`; `chapter-text-right`, `is-aula-slide`. |

Regra de ouro: **o motor não precisa mudar de forma para a narrativa nascer** — se a narrativa v2 se expressa como `capitulo × L → estado do herói + pose + fx + HUD`, a fase de código é substituição de módulos, não redesenho.

---

## 6. Schema proposto v2 (narrativa F1) — compatível com o Director atual

Princípios: (a) todos os campos v1 continuam com o mesmo nome e tipo, então `Scroll`, `ui.js`, `Title`, fallback e testes atuais funcionam sem alteração; (b) tudo o que é novo é opcional e descrito como **janelas em progresso local** `[inicio, fim]` (0..1) com o idioma `ease(seg(L,a,b))`; (c) nada exige vídeo ou asset impossível — só GLTF do carro, placas de ambiente (imagens) e partículas/shaders.

```jsonc
{
  // ---------- v1 (obrigatório; consumido por Scroll, Director, Title, ui.js, fallback, testes) ----------
  "id": "uma-volta",
  "slug": "capitulo-1",
  "nome": "Uma volta",
  "titulo": "UMA VOLTA\nNÃO É\nUMA OPINIÃO.",              // 2–3 linhas, caixa alta, sem ? ! —, ≤ 16 caracteres por linha
  "corpo": "Produza, critique, revise só o necessário e verifique no cronômetro.", // 1 frase, ≤ ~70 caracteres
  "cor": 0x0b1016,                                          // fundo base do wipe
  "acento": 0xe10600,                                       // regra do título, glow, hotspots, poça de luz
  "essencia": "Uma volta fecha só quando o resultado foi verificado.",
  "licoes": [
    { "termo": "Produzir e criticar", "texto": "Saída e crítica no mesmo ciclo." },
    { "termo": "Revisar o necessário", "texto": "Mude uma variável por volta." },
    { "termo": "Verificar o resultado", "texto": "O delta de volta decide.", "pagina": "loop" }
  ],
  "f1": {
    "termo": "Pit stop de 1,80 s",
    "texto": "McLaren, GP do Catar 2023: recorde obtido após centenas de ensaios cronometrados, uma variável por vez.",
    "fonte": "…",                                           // NOVO opcional: referência verificável (não renderizada pelo motor v1)
    "ano": 2023, "equipe": "McLaren"                        // NOVO opcional: metadados para o avaliador
  },
  "hotspots": [                                             // máx. 4; NOVO campo `peca` substitui ANCORAS hardcoded
    { "id": "asa-dianteira", "nome": "Asa dianteira", "texto": "…", "peca": "asa-dianteira" },
    { "id": "pneu-de", "nome": "Pneu dianteiro", "texto": "…", "peca": "roda-de" }
  ],
  "cenarios": {                                             // só onde houver HUD de cenários; chaves livres em v2 (v1 exige frio/calor/impacto/posicao no cap. 4)
    "duro":  { "desvio": 0.0,  "texto": "Referência: composto duro, 20 voltas.", "serie": [0,0,0,0,0,0,0,0,0,0,0,0] },
    "macio": { "desvio": -0.8, "texto": "Ganha 0,8 s por volta e degrada após a volta 8.", "serie": [-0.9,-0.9,-0.85,-0.8,-0.7,-0.5,-0.2,0.1,0.5,0.9,1.3,1.8] },
    "chuva": { "desvio": 12.0, "texto": "…", "serie": [ /* 12 amostras */ ] }
  },

  // ---------- v2 (novo; ignorado pelo motor v1, lido pelo Director/Car/fx da versão F1) ----------
  "ambiente": {
    "id": "garagem",                                        // túnel-de-vento | simulador | garagem | pit-lane | pista | debrief
    "placa": "ambiente-garagem.jpg",                        // Plate.js: fundo fotográfico desfocado pelo DOF
    "luz": { "chave": [3, 4, 5], "cor": 0xfff1d6, "rim": 0x9fc4ff, "intensidade": 1.0 },
    "particulas": { "tipo": "poeira", "densidade": 0.6 },   // poeira | chuva | faíscas | fumaça | neve-de-borracha
    "audioSugerido": "…"                                    // documentação; sem áudio no site
  },
  "camera": {                                               // pose estável do capítulo (o cameraPath ainda faz a órbita de 18 %)
    "pose": { "camera": [0.9, 0.6, 7.2], "target": [0.2, 0.1, 0], "yaw": 0.85, "rotation": -0.1, "bokeh": 2.4, "bloom": 0.1 },
    "movimento": [                                          // opcional: dolly/crane dentro do capítulo, sempre em função de L e reversível
      { "de": 0.18, "ate": 0.40, "camera": [0.9, 0.6, 6.6], "target": [0.2, 0.1, 0] }
    ],
    "lado": -1,                                             // +1 herói à direita, −1 à esquerda (paisagem); v1 decide por paridade
    "retrato": { "escala": 0.62 }
  },
  "carro": {                                                // estado do herói por janela; fora das janelas o valor volta ao padrão
    "padrao": { "explode": 0, "scatter": 0, "bodywork": 0, "wheelsOn": 1, "speed": 0, "rain": 0, "damage": 0, "pitJack": 0 },
    "janelas": [
      { "prop": "bodywork", "de": 0.05, "ate": 0.30, "para": 1 },
      { "prop": "explode",  "de": 0.30, "ate": 0.55, "para": 0.6 },
      { "prop": "explode",  "de": 0.70, "ate": 0.92, "para": 0 },
      { "prop": "speed",    "de": 0.92, "ate": 1.00, "para": 0.4 }
    ]
  },
  "efeitos": [                                              // fx.<nome>.set(v[, args]) com v = janela de entrada × (1 − janela de saída)
    { "fx": "callouts",  "entra": [0.30, 0.42], "sai": [0.78, 0.86], "peca": "pistola-pneumatica", "nome": "Pistola", "sub": "uma variável por volta" },
    { "fx": "hotspots",  "entra": [0.35, 0.60], "sai": [0.82, 0.95] },
    { "fx": "telemetry", "entra": [0.15, 0.40], "sai": [0.88, 1.00], "args": { "serie": "cenarios" } },
    { "fx": "plate",     "entra": [0.06, 0.30], "sai": [0.86, 1.00], "args": { "foto": "macro-pneu.jpg", "blur": 2.6 }, "opacidade": 0.45 }
  ],
  "texto": {                                                // opcional: sobrescreve as janelas padrão do título/ficha
    "tituloEntra": [0.08, 0.24], "tituloSai": [0.40, 0.50],
    "fichaEntra": [0.50, 0.62], "fichaSai": [0.88, 0.98],
    "callout": { "peca": "pistola-pneumatica", "nome": "Pistola", "sub": "uma variável por volta" }
  },
  "transicao": {
    "entrada": { "tipo": "orbita", "duracao": 0.18 },       // fixo pelo cameraPath; documentar a intenção
    "saida":   { "tipo": "wipe", "de": 0.86, "angulo": -0.35, "paraAmbiente": "pit-lane" },
    "imagemChave": "O carro erguido no macaco, uma roda no ar, o cronômetro do box em 0,00.",
    "porque": "A volta só existe se for medida."           // critério 3 do briefing
  },
  "aprofundamento": "loop",                                 // id em PAGINAS; ativa slide em L ≥ 0.64 (v1 só aceita nos capítulos 4 e 5)
  "peso": 3.6,                                              // altura da seção em telas (v1: Scroll.PESOS hardcoded)
  "registro": { "gatilho": "entrada", "titulo": "Uma volta fechada", "detalhe": "…", "tipo": "decisao" } // v1 só registra no cap. 5
}
```

Regras de compatibilidade do v2:

1. **Nomes e tipos v1 intocados**: `id, slug, nome, titulo, corpo, cor, acento, essencia, licoes[≥3]{termo,texto,pagina?}, hotspots[≤4]{id,nome,texto}, cenarios{*:{desvio,texto}}, f1{termo,texto}`.
2. Campos novos são **opcionais e ignoráveis**: o Director v1 nunca lê `ambiente/camera/carro/efeitos/texto/transicao/aprofundamento/peso/registro`.
3. Toda animação nova é declarada como **janela `[de, ate]` em `L`** ou como `entra/sai` — nunca em segundos, nunca dependente do quadro anterior (reversível ao rolar para trás).
4. `carro.padrao` faz o papel dos "defaults por quadro" do Director; `janelas` são interpoladas com `ease(seg(L, de, ate))` do valor anterior para `para`.
5. `camera.pose` é a vista estável em `L = 0.18`; `movimento[]` só pode existir entre `0.18` e o início da saída, com tangente suave, e deve manter `camera.z` e `|camera.x|` dentro dos limites que os testes de câmera adotarem.
6. `transicao.saida.de` ≥ 0.86 e sempre wipe; `transicao.entrada` é sempre a órbita de 18 % (a pose inicial é a final do capítulo anterior por construção).
7. `hotspots[i].peca` e `efeitos[].peca` referem-se a **nós nomeados do GLTF do carro** (`assemblyOrder` do `Car.js`); a narrativa deve usar uma lista fechada de nomes de peça.
8. `cenarios` só fazem sentido em um capítulo com HUD de cenários (no v1 é o índice 4); em v2 o HUD é gerado a partir das chaves, com `serie` opcional para o gráfico.
