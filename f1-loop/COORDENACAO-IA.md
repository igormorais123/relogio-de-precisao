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

## Regras

1. Antes de editar, `git pull` e confira quem é dono do arquivo nesta rodada; edite só o que for seu.
2. Toda mudança visual é verificada por captura real (`tools/shot.mjs`) olhada com visão; juízes independentes avaliam em `planejamento/07-avaliacao-cinema/rodada-N/`.
3. `npm test` e `npm run build` precisam passar; testes originais não são alterados para passar.
4. Fatos de F1 só com fonte primária; rótulos de honestidade ("não é CFD", "modelo didático", "não verificado automaticamente") são obrigatórios.
5. Nada é publicado em GitHub Pages sem consolidação e aprovação do Igor.
