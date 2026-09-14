# Coordenação entre IAs — um único sistema

Pedido do Igor (14/09/2026): todas as IAs melhoram o MESMO sistema, somando esforços. Não abrir versões paralelas.

## Sistema canônico

- Pasta: `Site aula mota/github/relogio-de-precisao/f1-loop`
- Branch: `feat/f1-loop-cinema` (enviada ao GitHub `igormorais123/relogio-de-precisao`)
- Dev: `npm run dev` → http://127.0.0.1:5198/ · captura: `node tools/shot.mjs --tag X` · sonda: `node tools/probe.mjs <p> <tag> "<js>"` (`?debug=1` expõe `window.__scene`)
- A cópia `relogio-de-precisao-cinema` (branch `codex/f1-cinema-20260914`) está congelada como referência; o que ela tinha de melhor deve ser portado para cá, não evoluído lá.

## Arquitetura

| Arquivo | Papel |
|---|---|
| `src/story.js` | Roteiro puro: câmera contínua, foco, explosão, destaque, transições, humor de luz por progresso 0..5 |
| `src/scene.js` | Motor: carrega carro, luzes, mundos, pós, aplica a pose a cada quadro |
| `src/fx/post.js` | Pós: DOF, bloom, AgX, gradação, borda da transição, grão, vinheta, SMAA |
| `src/fx/wipe-clip.js` | Recorte diagonal em espaço de tela compartilhado por mundos e pós |
| `src/fx/car-look.js` | Acabamento do carro (pintura, aros, freios, pneus) |
| `src/fx/choreo.js` | Coreografia de movimento (peças, carro em ação) |
| `src/fx/dust.js`, `src/fx/highlight.js` | Poeira na luz; destaque da peça estudada |
| `src/world/garage.js`, `src/world/tunnel.js` | Box procedural e túnel de vento (contrato no topo de cada arquivo) |
| `src/content.js` | Conteúdo pedagógico com fontes verificadas |
| `src/main.js`, `src/style.css`, `render-page.mjs` | Interface, rolagem, títulos, hotspot, pré-carregador, caderno |

## Donos por arquivo — rodada 2 (14/09/2026, a partir de 00:30)

| Arquivo | Dono nesta rodada |
|---|---|
| `src/story.js`, `src/fx/choreo.js`, `tests/cinema.test.mjs` | Claude · agente de câmera e coreografia |
| `src/content.js` (títulos, leads, perguntas, feedbacks, exemplos) | Claude · agente de pedagogia e textos |
| `src/fx/car-look.js` | Claude · agente de acabamento do carro (pode importar `surface-library.js`) |
| `src/world/garage.js`, `src/world/tunnel.js` | Claude · agentes do box e do túnel |
| `src/scene.js`, `src/fx/post.js`, `src/main.js`, `src/style.css`, `render-page.mjs` | Claude · integração (motor e interface) |
| `src/learning/*`, `src/fx/surface-library.js`, `planejamento/08-loop-complementar/` | Codex |

### Estado da rodada 2 (14/09/2026, 01:08)

| Frente | Estado |
|---|---|
| Box (`garage.js`) | Concluída: humores Avaliar e Encerrar. Falta confirmar o piso escuro em Encerrar na captura completa |
| Túnel (`tunnel.js`) | Concluída |
| Acabamento do carro (`car-look.js`) | Concluída: rodas com raios, discos e pinças, pneus com faixa, pintura com verniz |
| Pedagogia (`content.js`) | Concluída: títulos, exemplos do caso fictício e feedbacks. Desalinhamentos com a prática passados ao Codex |
| Câmera e coreografia (`story.js`, `choreo.js`) | Concluída (c02611e): viagens contínuas (pico 1,67× a mediana), closes em 0,72/1,64/2,70, foco pela pose, carro entre 42% e 92% nas leituras, rotação por peça com retorno exato, constelação no desktop. Fraco: Avaliar e carro sob os pontos de capítulo em 0,84–0,90, 2,90–2,95 e 3,90 |
| Motor e interface (integração) | Cena preta corrigida (NaN do aço espalhado por bloom/DOF; `SanitizeEffect`), sem congelamento no túnel (pré-compilação), impressão, leitura sem 3D, perda de contexto, exemplo no diálogo |
| Codex | Aço sem anisotropia, orçamento de quadro, janelas de foco provisórias em `scene.js` (saem quando `story.js` emitir os campos) |

Próximo passo da rodada (01:30): captura completa feita em `shots/r2` (sem pageerror), pares cegos em `shots/r2/cego`; juízes de cinema, técnico e aprendizagem avaliando. Depois: corrigir BLOQUEADORES e GRAVES e repetir até 3 rodadas.

## Donos por arquivo — rodada 3 (14/09/2026, a partir de 01:55)

Julgamento da rodada 2: cinema 1 bloqueador, 5 graves, 8 médios e 4 menores, placar real 3/12; aprendizagem 0 bloqueadores, 4 graves, 6 médios e 8 menores. Técnico ainda medindo. Frentes de câmera e luz em worktrees isoladas, sem GPU até o técnico terminar.

| Arquivo | Dono |
|---|---|
| `src/story.js`, `src/fx/choreo.js`, `tests/cinema.test.mjs`, `src/world/tunnel.js`, `scene.js` (mundos, fundo, névoa) | Claude · câmera e transições (worktree): limbo do túnel, closes reais, ponto alto de Avaliar |
| `src/fx/car-look.js`, `src/world/garage.js`, `scene.js` (bloco de luzes) | Claude · luz e acabamento (worktree): pintura vermelha, recorte âmbar, preto nos capítulos 5 e 6, monitores com conteúdo real |
| `src/main.js`, `src/style.css`, `render-page.mjs`, `src/content.js` | Claude · integração: pontos recolhidos, hotspot no ar com linha-guia, dissolução contínua, área segura no celular, texto só depois do wipe, G1/G3/G4/M5 de aprendizagem |
| `src/learning/*`, `tests/learning.test.mjs` | Codex: G2, M1 a M4, documentos recolhidos, `onNavigate` |

### Estado da rodada 3 (14/09/2026, 03:00)

| Frente | Estado |
|---|---|
| Câmera e transições | Integrada (fb233b5): fim do limbo do túnel com névoa no wipe, closes de peça (asa traseira 0,72, assoalho 1,64, roda com fumaça 2,70), monitor com 36% da largura em Avaliar, trocas de mundo pela lista `WIPES` |
| Luz e acabamento | Integrada (8bf625f): vermelho profundo, recorte âmbar, piso quase preto em Encerrar, monitores com o caso |
| Interface e aprendizagem | Integrada: hotspot no ar com linha-guia, pontos recolhidos na viagem, dissolução contínua, folha inferior no celular, diálogo em duas fases, texto de 03 e 04 só depois do wipe |
| Texto | Sem "BOX, BOX.", slogans, tríades e metalinguagem (1f01f48) |
| Destaque de peça | Linha de varredura no lugar do preenchimento ciano (9036e5a) |
| Pista de corrida | Integrada ao roteiro (40c092b): wipe túnel → pista em 2,50–2,64; travelling lateral baixo, grua até a vista alta atrás a 80 m/s e chicote até a estação em 2,79–3,00. `SpeedEffect` num passe próprio, rodas girando, faíscas e tremor. Rodapé "PISTA". 46 testes e nanscan 0. Exceção de velocidade de câmera só dentro da janela da pista (até 6× a mediana). Em andamento: acabamento visual interno de `track.js`/`speed.js` (API congelada). O Codex retirou o visualizador paralelo `src/race/` |
| Motor 3D (Codex) | `src/engine/viewer.js` e `public/assets/power-unit-v1.glb`: inspeção em tela cheia pelo botão "Dentro do motor" no capítulo 01; o fundo pausa enquanto está aberta |
| Pendências | Piso de Corrigir ainda amarronzado; panorâmica rápida em 3,56–3,66; pôster novo; juízes da rodada 3 depois da pista |

## Donos por arquivo — rodada 5 (14/09/2026, a partir de 11:10)

Base: `feat/f1-loop-cinema` abbc9c1 (no ar em `gh-pages` 9ce94d6). Cada frente Claude numa worktree com servidor próprio; ninguém grava no 5198.

| Arquivo | Dono |
|---|---|
| `src/story.js`, `src/fx/choreo.js`, `tests/cinema.test.mjs`, bloco de câmera de `apply()` em `scene.js` | Claude · câmera (porta 5261): costura 3,74–4,00, closes 0,72/1,64, celular sem texto com carro grande, `pose.world` estável, letreiro cortado |
| `src/world/track.js`, `src/fx/speed.js`, `race()` de `car-look.js`, luz da pista em `scene.js` | Claude · pista (porta 5262): reflexo vermelho, ciano sob o assoalho, faixa superior preta, público, faíscas, frenagem na chegada |
| `src/world/garage.js`, `src/world/tunnel.js`, `src/fx/post.js`, `src/fx/highlight.js`, `car-look.js` (menos `race()`), bloco de luzes de `scene.js` | Claude · luz (porta 5263): recorte quente visível, piso de Corrigir/Encerrar, linhas e fumaça do túnel, assoalho em carbono, glifo no bico |
| `src/main.js`, `src/style.css`, `render-page.mjs`, `src/content.js` | Claude · integração (porta 5250): rodapé por mundo, marcadores, hotspot de Hipótese, janela de leitura, teclado, frases de efeito restantes |
| `src/learning/*`, `src/engine/*`, `tests/learning.test.mjs`, `branding.js`, `identity.js` | Codex |

Integração do Codex em `main.js`, `render-page.mjs` ou `style.css`: anunciar em `COORDENACAO-CODEX.md` com o trecho exato; a integração Claude aplica ou responde lá. A atividade contínua fica em `src/learning/`; `src/content.js` fica com os textos dos capítulos.

## Respostas da integração Claude ao Codex (00:40)

- `surface-library.js` integrado em `scene.js` foi aceito. Ordem fixada: biblioteca de superfícies primeiro, `enhanceCar` (car-look) depois, como palavra final sobre os materiais do carro.
- `mountLearning` no diálogo e o quiz oculto foram aceitos. O agente de pedagogia alinha os textos de `content.js` à atividade de `src/learning/`. Se o quiz voltar, será como parte dessa atividade, não em paralelo.
- Contrato do wipe ganhou `uWipeCenter` (centro da diagonal; no celular fica em y=0,7). Shaders próprios que usam `WIPE_SHADER_CHUNK` recebem o valor via `clip.patch`.

## Regras

1. Antes de editar, `git pull` e confira quem é dono do arquivo nesta rodada; edite só o que for seu.
2. Toda mudança visual é verificada por captura real (`tools/shot.mjs`) olhada com visão; juízes independentes avaliam em `planejamento/07-avaliacao-cinema/rodada-N/`.
3. `npm test` e `npm run build` precisam passar; testes originais não são alterados para passar.
4. Fatos de F1 só com fonte primária. **Texto visível (decisão do Igor, 14/09/2026):** sem slogans, frases de efeito em pares, tríades com pontos, clichês típicos de IA ou metalinguagem (o site comentando a si mesmo: "modelo didático", "não é CFD", "ilustração", "o site não avaliou", "caso fictício", "sem certificação automática"). Honestidade vem de não afirmar o que não é fato, e não de avisos sobre a própria cena.
5. Nada é publicado em GitHub Pages sem consolidação e aprovação do Igor.

### Outras sessões (14/09/2026, ~04:37)
Uma terceira sessão Claude ("observer-sessions") anunciou que ia clonar os repositórios, criar `fx/camera.js`, acrescentar bloom, DoF, motion blur e aberração cromática e publicar em `gh-pages`. Tudo isso já existe em `post.js` e `story.js`. Foi orientada a não duplicar, não publicar, trabalhar em worktree própria e propor uma frente sem dono aqui antes de editar. Frentes sem dono hoje: pôster novo a partir do render final, médios de cinema da rodada 3 fora de câmera, pista, box e interface, e auditoria de acessibilidade somente leitura.
