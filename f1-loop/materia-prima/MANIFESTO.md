# Matéria-prima do F1 Loop (Laboratório 3D INTEIA)

Prioridade: **a aula de Engenharia de Loop**. Tudo aqui é meio, não fim. Cada asset só entra se ajudar o aluno a entender e aplicar o loop (preparar, uma volta, controlar, encerrar).

Atualizado em 2026-09-13 com o papel pedagógico por capítulo da narrativa consolidada (`planejamento/03-narrativa/NARRATIVA.md`).

## O que está nesta pasta

| Pasta / arquivo | O que é | Papel pedagógico | Capítulos |
|---|---|---|---|
| `identidade/` | Marca INTEIA (SVG principal, negativo, monocromático, símbolo). Racing Red `#D92135`, Graphite `#202930`, Ice White `#F0F2F3` | Paleta do herói e do HUD; logo no canto; placa do box. Sem propaganda no carro. | todos |
| `modulos-lab/mechanics.js` | `createMechanics(model)`: explodir por categoria, rodas, esterço, DRS, isolar peça | Estado do herói por `L`: montar/desmontar = produzir/revisar; isolar = tarefa delimitada; DRS fecha antes de frear = parar de adicionar antes de medir | 1, 3, 4, 7 |
| `modulos-lab/garage.js` | Box-laboratório procedural (bancadas, monitores, rack, macaco, placa INTEIA) | Ambiente de Hipótese, Peça, Correlação e Legado. Monitores = dossiê diegético. Prateleira = último estado verde. | 1, 3, 5, 7 |
| `modulos-lab/tunnel-visual.js`, `wind-tunnel.js`, `flow-detail.js`, `aero-physics.mjs` | Túnel com 7.200 partículas, leitura por região, ensaio por coeficientes | Ambiente de Túnel (orçamento, uma variável por run). Leitura do assoalho = verificação. Sempre rotulado "não é CFD". | 2 |
| `modulos-lab/studio.js`, `branding.js`, `identity.js` | Estúdio, materiais, marca em canvas | Vazio cinematográfico dos títulos; Racing Red no proxy e no GLB | todos |
| `ambientes/INTEIA-box-laboratorio.glb` (≈10 MB) | Box exportado com telas e luzes | **Não carregar no primeiro quadro do scroll.** Referência de layout; fallback: `garage.js` procedural. Close-up / aprofundamento só depois de LOD. | 3, 7 (close-up) |
| `texturas/INTEIA_Carbono_BaseColor.png` | Carbono portátil | Asas e assoalho do proxy e do LOD | 3, 4, 6 |
| `docs-lab/componentes-origem.json` | 97 peças com pivôs e nomes em português | Nomes reais dos hotspots (`Assoalho · 02`, `Flap traseiro DRS`, `Display do volante`) | todos |
| `docs-lab/*.md` | Integração, box, aero, arquitetura, direitos | Limites técnicos e de licença | — |
| `THREE-LICENSE.txt` | Three.js MIT | Créditos | — |

## O que NÃO foi copiado (referenciar, não duplicar)

Caminho canônico: `C:\Users\igorm\projetos\INTEIA-laboratorio-3d`

| Asset | Caminho | Por que fica lá |
|---|---|---|
| Carro móvel | `web\assets\carro-movable.glb` (26 MB, 752.823 tris, 97 meshes) | Pesado demais para o scroll com DOF + bloom + partículas. Sem LOD. |
| Carro estático | `modelos\INTEIA_F1_estatico.glb` | Mesma geometria; útil para bake, não para o primeiro quadro. |
| Master Blender | `modelos\INTEIA_F1_Master.blend` | Fonte de LOD futuro. |
| Box com carro | `ambientes\INTEIA_Box_com_carro.blend` | Cena de produção, não runtime. |

Não afirmar afiliação FIA/equipes. Sem stickers FIA, F1 ou Pirelli no modelo publicado.

## Plano de LOD (obrigatório antes de importar o GLB)

| Faixa | Uso | Meta | Quando |
|---|---|---|---|
| **Proxy** (agora) | Scroll inteiro, 7 capítulos | Geometria procedural < 8 k tris, 1 draw call por material, Racing Red | MVP do `site/` |
| **Low** | Scroll desktop, vistas médias | 80–150 k tris, Draco + KTX2, ≤ 4 MB, materiais agrupados | Próxima fase |
| **Mid** | Close-up de assoalho, asa, volante (caps. 3, 4, 7) | 150–300 k tris, ≤ 8 MB | Depois do low validado |
| **High** | Fora do scroll (laboratório, isolate) | 752 k, o GLB original | Nunca no primeiro quadro |

Regras: no máximo dois efeitos caros por capítulo; `setAmount` do `mechanics.js` mapeia em `explode` 0..1 contínuo; `setSpin` precisa aceitar velocidade 0..1 (hoje é booleano — adaptar na integração, não no GLB). Mobile: proxy only, sem túnel de 7.200 partículas (usar 800).

Licença: titularidade INTEIA (o próprio autor); geometria derivada de tutorial público sem licença documentada (`docs-lab/DIREITOS-E-PROCEDENCIA.md`). Three.js MIT.
