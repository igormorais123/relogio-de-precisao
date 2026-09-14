# Avaliação técnica — rodada 1 ("BOX, BOX.")

Juiz técnico independente. Data: 14/09/2026. Nenhum arquivo do projeto foi alterado além deste relatório. `npm run build` regenera `index.html` via `render-page.mjs`; o hash ficou idêntico antes e depois.

## Veredito

**REPROVA.** Há 2 achados GRAVES: um congelamento de 3 s na primeira entrada no túnel e a impressão que perde dois capítulos. O critério de parada do plano (nenhum bloqueador ou grave) não foi atingido.

| Gravidade | Quantidade |
|---|---:|
| BLOQUEADOR | 0 |
| GRAVE | 2 |
| MÉDIO | 6 |
| MENOR | 11 |

## Como foi medido

- Navegador: Chrome estável via Playwright 1.59.1, headless, ANGLE/D3D11. GPU efetiva: **NVIDIA GeForce RTX 3060 Ti**. Os tempos de quadro valem para essa GPU e **não representam celular real**. O "celular" é emulação 390×844 com DPR 3 (o `pixelRatio` do renderer fica em 1,25), e a CPU foi desacelerada 4× só onde indicado.
- Build de produção servido por `vite preview` na porta 5213 (encerrado ao final). Também houve medições no servidor dev (5198), marcadas como tal.
- Scripts, JSONs e capturas ficam em `C:\Users\IgorPC\AppData\Local\Temp\claude\juiz-tecnico\` (abaixo, `JT\`).
- `npm test`: **13/13 passaram**. `npm run build`: ok, com aviso de chunk acima de 500 kB.

## Métricas principais

| Métrica | Desktop 1440×900 | Celular 390×844 |
|---|---:|---:|
| Transferido (produção, sem cache) | **2,63 MB** | **1,78 MB** |
| — GLB | 2.293.571 B (`carro-aula-v2.glb`) | 1.407.103 B (`carro-aula-mobile-v2.glb`) |
| — JS (gzip) | 323.479 B (scene 313.332 + index 10.147) | 323.479 B |
| — Fontes WOFF2 | 68.539 B | 68.539 B |
| — Imagens (pôster WebP + SVG) | 57.689 B | 57.689 B |
| — CSS / HTML (gzip) | 4.838 / 5.396 B | 4.838 / 5.396 B |
| Tempo até `__aula.ready` sem limitação | 2.876 ms | 1.907 ms |
| Tempo até `ready` com 20 Mbps (desktop) / 9 Mbps (celular) | 1.850 ms | 2.669 ms |
| Draw calls por quadro (faixa dos capítulos) | 239–324 | 185–307 |
| Triângulos por quadro (inclui passe de sombra) | 383.619–510.450 | 166.171–247.352 |
| Quadro médio, rolagem real, cena já aquecida | 6,36–6,43 ms (p99 12,5; máx 25,0) | 6,29–6,35 ms (máx 31,3) |
| **Primeira passada fria: maior quadro** | **3.056,9 ms em p≈2,08** e 1.613 ms em p≈2,27 | **2.925,8 ms em p≈1,98** (CPU 4×) |
| Memória após 3 idas e voltas 0→5→0 | heap 19,07→19,10 MB; geometrias 231→231; texturas 61→61; programas 68→68 | heap 14,36→14,38 MB; 226/52/58 estáveis |
| NaN no hotspot ou na câmera (501 amostras) | 0 | 0 |
| Custo de 30 eventos `resize` seguidos | 2,0 ms de JS; próximos 2 quadros em 8,7 ms | 1,1 ms |

Na servidora dev, sem bundle, o JS transferido chega a 9,43 MB e o pré-carregador fica em "00" por 9,3 s a 9 Mbps. Isso só afeta o desenvolvimento, não produção.

## O que passou (com evidência)

- **Vazamento:** nenhum. Heap, geometrias, texturas, programas e nós DOM ficaram estáveis em 3 ciclos (`JT\perf-desktop.json`, `JT\perf-mobile.json`).
- **Continuidade:** voltar com a roda à mesma posição de rolagem devolve a pose do `goto`, com diferença ≤ 0,037 m (a amplitude da "respiração" da câmera é 0,025 m). O caso p=4,5 deu 3,26 m, mas é artefato do teste: a rolagem bateu no fim da página e voltou para outro `scrollY`.
- **Hotspot:** 171 amostras visíveis no desktop, 0 sobrepostas ao texto, 0 fora da tela, 0 NaN. Continua no lugar depois do resize (0,2 px de desvio). No celular fica oculto por decisão de código (`main.js:42`).
- **Resize:** o buffer acompanha 1280×800, 1024×700, 1920×1080 e 1440×900, e o maior quadro foi de 12,6 ms.
- **Teclado:** 44 paradas de Tab no desktop e no celular, todas dentro da tela, com opacidade efetiva 1 e contorno de 2 px `#ffbd77`. A copy dissolvida recupera a opacidade com `:focus-within`. No diálogo, Enter abre com o foco no botão fechar, e Esc fecha e devolve o foco a "Escrever minha hipótese".
- **ARIA:** os 6 títulos divididos em letras mantêm `aria-label` com o texto correto, e os spans filhos têm `aria-hidden="true"`. As regiões `section` recebem nome pelo título. O hotspot é `aria-hidden` com `tabindex=-1`, e cada capítulo tem um botão equivalente acessível.
- **Sem JavaScript:** 6 capítulos com opacidade 1, pré-carregador `display:none`, 0 elementos `.js-only` visíveis, aviso `noscript` presente (`JT\fb-nojs-desktop.jpg`).
- **Sem WebGL (`getContext` anulado):** entra em modo leitura com "3D indisponível · aula em modo leitura", sem baixar GLB (`JT\fb-sem-webgl.jpg`).
- **prefers-reduced-motion:** abre em modo leitura com 0 GLB e 0 chunk de cena baixados (desktop e celular).
- **Contraste do lead:** pior caso 8,45:1 no desktop (p=2,05) e 13,45:1 no celular. Títulos: pior caso 6,36:1 no desktop (p95 do fundo).
- **Honestidade:** o rodapé mostra "TÚNEL · VISUALIZAÇÃO DIDÁTICA, NÃO É CFD", "ESTAÇÃO · REGISTRO DO ALUNO" e "BOX · PEÇA REVISADA (ILUSTRAÇÃO)" no desktop e no celular (`JT\a11y-mobile-honestidade-tunel.jpg`). O estado de carga diz "97 peças · modelo didático". O monitor desenha "Registro do aluno · não verificado automaticamente" (`garage.js:538`), e campos vazios aparecem como "— sem registro —". O estêncil do piso lê na direção certa (`JT\estencil-2.5.png`). A exportação traz a origem "não verificadas automaticamente" e os testes cobrem isso. Nada simula medição: as trajetórias vêm de um envelope geométrico ilustrativo (`tunnel.js:5-6`).

---

## Achados

### GRAVE 1 — Congelamento de 3 s na primeira entrada no túnel

- **Local:** `src/scene.js:203-213` e ausência de pré-compilação em `src/scene.js` (não há `compileAsync`/`compile` em `src/`).
- **Evidência:** `JT\firstpass.json`, com carga fresca e rolagem imediata pela roda.
  - Desktop (RTX 3060 Ti): quadro de **3.056,9 ms em p≈2,08** e de **1.613 ms em p≈2,27**; long tasks de 3.062 ms e 1.618 ms.
  - Celular com CPU 4×: quadro de **2.925,8 ms em p≈1,98**; long task de 2.932 ms.
  - Os programas WebGL crescem de 36 (p 0,2–0,8) para 55 (p 1,95) e 67 (p 2,5) (`JT\perf-desktop.json`, `chapters[].programs`).
  - Depois do aquecimento, a mesma rolagem não passa de 25 ms.
- **Causa:** `garage.root` e `tunnel.root` alternam `visible`, e as luzes práticas estão dentro deles (`garage.js:345-354`, `tunnel.js:686-690`). Quando a contagem de luzes muda, o three.js gera novos programas para todos os materiais iluminados. Somam-se os shaders do túnel (fumaça, fitas, colmeia, ventilador), compilados pela primeira vez no quadro em que aparecem. A página inteira, inclusive a rolagem, trava no meio da aula. [Inferência] Em GPU móvel real o travamento tende a ser maior que os 2,9 s emulados.
- **Menor correção:**
  1. Antes de `onProgress(1, 'Pronto')`, deixar os dois ambientes e todas as luzes visíveis, `await renderer.compileAsync(scene, camera)`, e restaurar a visibilidade.
  2. Parar de mudar a contagem de luzes: manter as luzes práticas fora dos grupos que somem e zerar só a `intensity` do ambiente ausente.
- **Critério de aceite:** repetir `JT\firstpass.mjs` com nenhum quadro acima de 100 ms e `programs` constante do primeiro ao último capítulo.

### GRAVE 2 — Imprimir no modo cinema perde "Corrigir" e "Encerrar"

- **Local:** `src/style.css:6` (`@media print`) não neutraliza as regras de `src/style.css:14-17`.
- **Evidência:** `JT\impressao.pdf`, gerado depois de rolar até p=2,3 e emular impressão.
  - O PDF tem 6 páginas; **as páginas 5 e 6 saem em branco** (texto extraído vazio; `JT\impressao-p5.png` e `JT\impressao-p6.png`).
  - O estilo computado em impressão dá `.copy` com opacidade **0** em `#corrigir` e `#encerrar`, e `.t-char` com opacidade 0 em `#encerrar` (`JT\fallback.json`, `print`).
  - A partir do modo leitura a impressão sai completa: 4 páginas, 3.969 caracteres, com CORRIJA e DECIDA (`JT\impressao-modo-leitura.pdf`).
  - Os capítulos 1–4 imprimem porque já tinham sido "revelados" pela rolagem.
- **Menor correção:** acrescentar em `@media print`: `.copy,.copy>*,.t-char{opacity:1!important;transform:none!important;filter:none!important;letter-spacing:normal!important}`.

### MÉDIO 1 — "Ler a aula sem 3D" não cancela o carregamento

- **Local:** `src/main.js:61` e `src/main.js:83`.
- **Evidência** (produção, 3 Mbps; `JT\load-prod.json`, `readWithout3D`):
  - Ao clicar, o GLB já tinha 786.817 B baixados. O download **continuou até o fim** (`glbFinished: true`), e 20 s depois havia um `<canvas>` WebGL criado em `#stage` com a cena montada, embora o usuário tenha escolhido ler sem 3D.
  - Com o modo leitura ativo, `#load-state` mostrou "Carregando o carro…": `onProgress` sobrescreve a mensagem.
  - O foco foi para `BODY`, porque o botão focado some com o pré-carregador.
  - O botão, o percentual e o modo leitura em si funcionam (`JT\load-prod-ler-sem-3d.jpg`).
- **Menor correção:**
  - Guardar um `AbortController` em `loadScene`, passá-lo a `createScene` e abortá-lo em `#preload-read`.
  - Em `onProgress`, não escrever `#load-state` quando `state.reading` for verdadeiro.
  - Depois do clique, focar `#title-preparar` (com `tabindex=-1`) ou `main`.

### MÉDIO 2 — Contexto WebGL perdido deixa uma tela branca e muda de capítulo

- **Local:** `src/scene.js:69` e `src/main.js:59` e `src/main.js:83`.
- **Evidência:** em p=2,5, `WEBGL_lose_context.loseContext()` leva ao modo leitura, o que está correto. Mas o botão "Modo cinema" continua disponível. Ao clicar nele:
  - A página volta ao cinema com o canvas perdido, **tela branca** e "97 peças · modelo didático" no rodapé.
  - O aluno cai no capítulo **05** em vez do 03 (`JT\fb-contexto-perdido-volta-cinema.jpg`), porque `onError` chama `setReading(true)` sem preservar o capítulo e o `scene` antigo não é descartado.
- **Menor correção:** em `onError`, chamar `scene?.dispose()`, fazer `scene=null` e rolar até `CHAPTERS[state.chapter].id`. A alternativa é tratar `webglcontextrestored`. [Inferência] Em celular, a perda de contexto acontece ao trocar de aba ou app.

### MÉDIO 3 — Viagem de câmera concentrada entre p 2,8 e 3,2

- **Local:** `src/story.js:19-21` (chaves 2,80 → 3,00 → 3,50).
- **Evidência** (cálculo direto de `sampleStory`; capítulo desktop de 1.980 px):
  - A câmera percorre **9,11 m** e o alvo **5,48 m** entre p 2,8 e 3,2.
  - Pico de **2,88 m por 100 px de rolagem** em p=2,90; o alvo chega a 1,58 m/100 px.
  - Nos outros capítulos o máximo é 0,84–1,21 m/100 px.
  - Com rolagem real, o salto por quadro foi de **0,68 m** em 6 ms (scrollY 5.670; `JT\perf-desktop.json`, `camJumps`); a 60 Hz isso vira cerca de 1,5–2 m por quadro.
  - A continuidade formal está garantida pelos testes. O problema é a velocidade: uma volta de roda vira um corte brusco.
- **Menor correção:** acrescentar uma chave intermediária perto de 2,90 e distribuir a travessia por 2,70–3,20 (casando com o wipe 2,88–3,12), ou limitar a velocidade angular do alvo no follow amortecido (`main.js:53`).

### MÉDIO 4 — Custo por quadro alto para celular; qualidade adaptativa só observa a abertura

- **Local:** `src/scene.js:115-121` (sombra) e `src/scene.js:240-247` (`adapt`).
- **Evidência** (`JT\breakdown.json`):
  - Em p=0,2 no desktop: 322 draw calls. Sem o passe de sombra são 181; com ele, 289; o pós-processamento soma o resto.
  - O carro tem 142 malhas visíveis, e **99 projetam sombra**. O celular usa o mesmo corte e fica em 307 draw calls e 247.352 triângulos por quadro.
  - `adapt()` mede só os primeiros 120 quadros, depois faz `samples=-1` para sempre. Um aparelho que só fique lento no túnel (fumaça aditiva de 2.500 pontos no celular) nunca reduz a resolução.
  - [Não verificado] Não houve teste em celular físico; a GPU usada é de desktop.
- **Menor correção:**
  - No celular, subir o limite de `castShadow` de 0,09 m para cerca de 0,3 m (`scene.js:119`), ou congelar a sombra com `shadowMap.autoUpdate=false` enquanto `explode` estiver parado.
  - Fazer `adapt()` amostrar continuamente, em janelas, em vez de desligar após a primeira.
  - Validar em um Android intermediário real antes de publicar.

### MÉDIO 5 — `.principle` com contraste abaixo do mínimo AA sobre o túnel

- **Local:** `src/style.css:2` (`.principle{font-size:10px;color:#e0abae}`) e o degradê em `src/style.css:12`.
- **Evidência** (`JT\visual-desktop.json`, `contrast`): fundo medido sem o texto, percentil 95.
  - Razão de **3,25:1 em p=2,20**, 3,64:1 em p=2,35 e 3,97:1 em p=2,05, abaixo de 4,5:1 para texto de 10 px.
  - Captura: `JT\vis-desktop-contraste-pior-principle-2.2.png`, com as fitas de fluxo atrás do texto.
  - No celular o pior caso é 9,72:1 (passa).
  - Há ainda 9–10 px no desktop e 8–9 px no celular em `.eyebrow`, `.principle`, `#scene-label`, `#load-state` e rodapé (`JT\a11y.json`, `smallText`).
- **Menor correção:** reforçar a segunda parada do degradê de `.shade` (de `#070b0e55` em 40% para cerca de `#070b0e99`) ou clarear `.principle` para cerca de `#f3cdd0`, com tamanho mínimo de 11–12 px.

### MÉDIO 6 — Animação infinita apesar de `prefers-reduced-motion`

- **Local:** `src/style.css:5` e `src/style.css:28`.
- **Evidência:** com `reducedMotion:'reduce'`, `getComputedStyle(span,'::after').animationName` retorna **`nav-spin`** (`JT\fallback.json`, `reduced_*.navSpin`). O seletor `*` da regra reduzida não alcança `::after`, então o arco da navegação gira sem parar (2,8 s por volta). Conflita com WCAG 2.2.2 e com a intenção declarada de pausar o movimento.
- **Menor correção:** trocar a regra por `*,*::before,*::after{animation:none!important;transition:none!important}`.

### MENOR 1 — Deploy de 33,07 MB para 2,63 MB efetivamente usados

- **Local:** `public/assets/` e `public/fonts/`.
- **Evidência:** `dist` tem 33,07 MB. Estão lá `box-aula-referencia.glb` (10.302.288 B, sem nenhuma referência em `src/`), `carro-aula.glb` (10.407.208 B) e `carro-aula-mobile.glb` (7.309.200 B), que só entram se o v2 der 404 (`scene.js:96`), além de `box-poster.png` (875.057 B) e dois TTF (718 KB).
- **Correção:** retirar os arquivos sem uso de `public/` (movê-los para `materia-prima/`). Remover o fallback de 10 MB ou trocá-lo por falha explícita com modo leitura.

### MENOR 2 — Luz de um ambiente vaza levemente no outro durante o wipe

- **Local:** `src/scene.js:204-207`.
- **Evidência:** no meio do wipe (p=2,0, desktop), esconder só as luzes práticas do box muda o lado do túnel em média 2,73 níveis de luminância, com 11,8% dos pixels acima de 8 níveis. O controle sem mudança dá 0,00. As luzes do túnel alteram 1,27% do lado do box. No celular, as luzes do box mudam 12,9% do lado de saída. Visualmente é sutil (`JT\vis-desktop-leak-2-base.png` vs `JT\vis-desktop-leak-2-sem-luzes-box.png`). Recorte da diagonal correto e sem objetos flutuando (`JT\vis-desktop-wipe-2.00.png`, `JT\vis-desktop-wipe-3.00.png`).
- **Correção:** escalar as intensidades das luzes práticas de cada mundo pelo seu peso (`t` ou `1-t`), o que também resolve a contagem de luzes do GRAVE 1.

### MENOR 3 — Troca seca do environment map no meio do wipe

- **Local:** `src/scene.js:213`.
- **Evidência:** o intervalo que cruza `tunnel=0,5` (1,998→2,002) altera **25,5%** dos pixels acima de 8 níveis, contra **16,0%** no intervalo de controle de mesmo tamanho (1,994→1,998) (`JT\visual-desktop.json`, `envPop`). Em 3,0 a diferença é desprezível (15,5% vs 15,0%).
- **Correção:** fazer crossfade da `environmentIntensity`, ou trocar o mapa quando o carro estiver sob a faixa escura do wipe.

### MENOR 4 — No celular em retrato, o wipe acontece atrás do bloco de texto

- **Local:** `src/fx/wipe-clip.js:21` (centro em `uWipeRes/2`) e `src/scene.js:163` (deslocamento de vista de `height*.2` no celular).
- **Evidência:** em p=2,00 no celular, a metade superior, onde o 3D é legível, ainda mostra só o box, e a diagonal passa sob o degradê do texto (`JT\vis-mobile-wipe-2.00.png`). Em 3,00 a metade superior mostra só o túnel (`JT\vis-mobile-wipe-3.00.png`).
- **Correção:** deslocar o centro da diagonal para a região visível do celular (cerca de +0,25 em `p.y`) ou ajustar `WIPE_RANGE` por proporção de tela.

### MENOR 5 — PMREM do box gerado duas vezes

- **Local:** `src/world/garage.js:366-369` e `src/scene.js:142`.
- **Evidência:** a mesma `garage.envScene` passa por `fromScene` duas vezes. Os materiais do box usam uma cópia e o carro usa a outra.
- **Correção:** reutilizar o `envTarget` do box em `scene.js`.

### MENOR 6 — Pré-carregador mede só o GLB

- **Local:** `src/main.js:83` e `src/scene.js:97`.
- **Evidência:**
  - Em produção a 9 Mbps, o percentual fica em "00" até 904 ms, anda de 1 a 80 durante o GLB, e salta de 84 para 100 em 133 ms (`JT\load-prod.json`). O chunk de cena (313 KB gzip) e as fontes não contam.
  - O percentual avança de verdade: 177 amostras distintas a 9 Mbps.
- **Correção:** somar o `import('./scene.js')` como primeiros 10%.

### MENOR 7 — Sem WebGL, "Modo cinema" continua oferecido e repete o erro

- **Local:** `src/main.js:59` e `src/main.js:83`.
- **Evidência:** cada clique gera outra vez 2 erros no console ("Error creating WebGL context") e a página permanece em leitura (`JT\fallback.json`, `noWebGL`).
- **Correção:** guardar `webglUnavailable=true` no `catch` e desabilitar ou ocultar `#reading`.

### MENOR 8 — Aviso `noscript` sobreposto à navegação no celular

- **Local:** `src/style.css:2` (`.noscript{bottom:60px}`) versus `.chapters-nav{bottom:45px}` na media query de celular.
- **Evidência:** a segunda linha do aviso fica coberta pelos círculos 01–06 (`JT\fb-nojs-mobile.jpg`).
- **Correção:** `@media(max-width:760px){.noscript{bottom:100px;left:20px}}`.

### MENOR 9 — Hotspot de "Avaliar" flutua acima dos monitores

- **Local:** `src/scene.js:177` (deslocamento `+0,72 y`, `-1,9 z` a partir do monitor).
- **Evidência:** em p=3,22, "CONFERIR A PROVA" fica cerca de 150 px acima da borda superior dos monitores, sobre a faixa vermelha da parede (`JT\vis-desktop-hotspot-3.22.png`). Nos capítulos 2 e 3 está sobre o assoalho destacado e sobre o carro (`JT\vis-desktop-hotspot-1.22.png`, `JT\vis-desktop-hotspot-2.22.png`).
- **Correção:** reduzir o deslocamento para cerca de `+0,42 y` e `-1,35 z`, com o disco ainda tocando a moldura do monitor central.

### MENOR 10 — Texto e rodapé fora de sincronia com o ambiente antes do wipe

- **Local:** `src/main.js:30` (entrada da copy) e `src/main.js:36` (rótulo por `floor(p)`).
- **Evidência:** em p=1,95 o título "03 / TÚNEL DE ENSAIO" já está legível sobre o box, e o rodapé ainda diz "BANCADA · UMA MUDANÇA POR VEZ" (`JT\vis-desktop-wipe-1.95.png`).
- **Correção:** trocar o rótulo e liberar a copy pelo `pose.tunnel ≥ 0,5`.

### MENOR 11 — Avisos de console e chunk grande

- **Evidência:**
  - Em toda carga desktop aparece 1 aviso "THREE.WebGLProgram: Program Info Log … warning X4122" (ANGLE/HLSL, benigno). Nenhum erro de console no fluxo normal.
  - O build avisa `scene-*.js` com 1.063,89 kB (314,59 kB gzip).
- **Correção:** opcional. Importar de `three` apenas o necessário não reduz muito com `import *`; aceitável para a aula.

---

## Pendências de verificação

- [Não verificado] Tempo de quadro e compilação em celular físico. A emulação usa GPU de desktop.
- [Não verificado] Leitores de tela reais (NVDA/VoiceOver). A árvore acessível foi conferida pelo `ariaSnapshot` do Chromium.

## Próxima ação única

Corrigir os dois GRAVES: pré-compilação com contagem de luzes constante, e reset de opacidade no `@media print`. Depois, rerodar `JT\firstpass.mjs` e `JT\fallback.mjs` como critério de aceite.
