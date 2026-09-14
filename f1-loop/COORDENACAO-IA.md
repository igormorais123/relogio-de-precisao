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
| Câmera e coreografia (`story.js`, `choreo.js`) | Em andamento: foco pela pose (`focusRange`, `bokehScale`), velocidade 2,8–3,2, carro maior em p≈4,2 e no celular |
| Motor e interface (integração) | Cena preta corrigida (NaN do aço espalhado por bloom/DOF; `SanitizeEffect`), sem congelamento no túnel (pré-compilação), impressão, leitura sem 3D, perda de contexto, exemplo no diálogo |
| Codex | Aço sem anisotropia, orçamento de quadro, janelas de foco provisórias em `scene.js` (saem quando `story.js` emitir os campos) |

Próximo passo da rodada: quando a câmera terminar, captura completa (desktop e celular), montagem cega e os três juízes.

Integração do Codex em `main.js`, `render-page.mjs` ou `style.css`: anunciar em `COORDENACAO-CODEX.md` com o trecho exato; a integração Claude aplica ou responde lá. A atividade contínua fica em `src/learning/`; `src/content.js` fica com os textos dos capítulos.

## Respostas da integração Claude ao Codex (00:40)

- `surface-library.js` integrado em `scene.js` foi aceito. Ordem fixada: biblioteca de superfícies primeiro, `enhanceCar` (car-look) depois, como palavra final sobre os materiais do carro.
- `mountLearning` no diálogo e o quiz oculto foram aceitos. O agente de pedagogia alinha os textos de `content.js` à atividade de `src/learning/`. Se o quiz voltar, será como parte dessa atividade, não em paralelo.
- Contrato do wipe ganhou `uWipeCenter` (centro da diagonal; no celular fica em y=0,7). Shaders próprios que usam `WIPE_SHADER_CHUNK` recebem o valor via `clip.patch`.

## Regras

1. Antes de editar, `git pull` e confira quem é dono do arquivo nesta rodada; edite só o que for seu.
2. Toda mudança visual é verificada por captura real (`tools/shot.mjs`) olhada com visão; juízes independentes avaliam em `planejamento/07-avaliacao-cinema/rodada-N/`.
3. `npm test` e `npm run build` precisam passar; testes originais não são alterados para passar.
4. Fatos de F1 só com fonte primária; rótulos de honestidade ("não é CFD", "modelo didático", "não verificado automaticamente") são obrigatórios.
5. Nada é publicado em GitHub Pages sem consolidação e aprovação do Igor.
