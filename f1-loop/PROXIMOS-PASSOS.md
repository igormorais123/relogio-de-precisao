# F1 Loop — revisão de 13/09/2026 e plano para continuar

Documento de passagem para retomar o trabalho em outra máquina. Conduzido por Claude (Opus 5) após a revisão do trabalho de Fable 5.1 e do complemento Codex.

## Decisões fixadas

1. **Aula canônica = raiz de `f1-loop/`** ("BOX, BOX."): seis capítulos (Preparar, Hipótese, Executar, Avaliar, Corrigir, Encerrar), atividades com feedback, caderno do aluno, gerador de prompt, modo leitura, conteúdo sem JavaScript, nove testes.
2. **Herói = carro real do Laboratório 3D INTEIA** (97 peças, mecânica de montagem). O protótipo `site/` com carro procedural em blocos foi **rejeitado pelo autor** e fica só como arquivo histórico. Não publicar nem evoluir.
3. **Foco é aprendizado.** Cinema e 3D servem à lição; todo efeito precisa justificar o custo.
4. **Referência visual:** cornrevolution.resn.global (capturas em `planejamento/referencias/corn-*.jpeg`; regras R1–R12 em `planejamento/01-pesquisa/gramatica-visual.md`).

## Revisão do estado atual (capturas em `planejamento/referencias/revisao-*.jpeg`)

| Área | Achado | Gravidade |
|---|---|---|
| Cinema | Sem profundidade de campo, bloom, grão ou vinheta; luz chapada | Alta |
| Câmera | Seis poses fixas; câmera parada em 62% de cada capítulo; transição só no fim | Alta |
| Box | GLB de 10 MB escurecido (cor × 0,38); paredes escondidas deixam monitores e objetos flutuando | Alta |
| Túnel | Cinco pórticos brancos e 18 tubos quase invisíveis; pilar corta a silhueta do carro; fumaça de 7.200 partículas do laboratório não é usada | Alta |
| Transição | "Wipe" é um retângulo cinza translúcido em CSS, não revela novo ambiente | Média |
| Layout | Assinatura "BOX, BOX." colide com monitores/pilares; botão encosta no rodapé na transição 4→5 | Média |
| Coerência | `NARRATIVA.md` diz Hipótese com túnel ao fundo e Avaliar no túnel; `src/content.js` e a cena usam Túnel em Executar e estação de engenharia em Avaliar. O conteúdo do app é o mais coerente; alinhar o documento | Média |
| Peso | Carro 10,4 MB + box 10,3 MB + pôster PNG 855 KB + Lato TTF 641 KB | Alta |
| Pedagogia | Conteúdo verificado, atividades e caderno sólidos; manter | — |

## Matéria-prima: o que já foi medido

Teste com gltf-transform 4 sobre `public/assets/carro-aula.glb` (scratch, não aplicado):

| Etapa | Tamanho |
|---|---:|
| Original da aula | 10,41 MB |
| Texturas em até 2048 px | 8,31 MB |
| + WebP q88 | 7,21 MB |
| + meshopt (quantizado) | **2,48 MB** |

Critério de aceitação antes de trocar o asset: 97 peças, 20 ciclos de montagem com erro zero (`tools/verify-car.mjs` adaptado para `MeshoptDecoder`), DRS/rodas/isolamento funcionando, comparação visual lado a lado sem perda perceptível na pintura e no volante.

## Plano de construção (ordem e critérios)

### Fase 1 — matéria-prima (paralelo, arquivos disjuntos)
- **Carro:** gerar `carro-aula-v2.glb` (≤ 3 MB) e `carro-aula-mobile-v2.glb` (≤ 2 MB) com texturas redimensionadas, WebP e meshopt; atualizar proveniência e manifesto.
- **Box procedural:** `src/box.js` a partir de `materia-prima/modulos-atualizados/garage.js`, sem download, geometria estática mesclada por material (< 80 draw calls), paredes com ocultação ciente da câmera, sem objetos flutuando, luz cinematográfica escura; monitores como canvas que mostram o caderno do aluno (`setNotebook(values)`, campos vazios aparecem como vazios).
- **Fontes e pôster:** Bebas e Lato em WOFF2 com subconjunto pt-BR; pôster em WebP.
- **Direção de fotografia:** `planejamento/05-direcao/SHOTLIST.md` + `src/shots.js` com câmera contínua por capítulo nas coordenadas reais do carro (x ±0,92; y 0–1,1; z −2,55 a +2,56, frente em +Z), foco, bokeh, luz, momento do wipe, âncoras de hotspot por nome de peça; alinhar as cenas do `NARRATIVA.md` ao conteúdo.

### Fase 2 — integração (sequencial)
- **Motor:** pós-processamento (`postprocessing`: DOF, bloom, ACES, grão, vinheta, SMAA; versão leve no celular), câmera contínua a partir de `shots.js`, túnel com a fumaça do laboratório rotulada "visualização didática, não é CFD", poeira na luz, box procedural, assets v2. Manter `sampleStory` pura e os testes existentes (não alterar testes para passar).
- **Interface:** títulos com revelação/dissolução por letras ligada à rolagem (texto continua no DOM), wipe diagonal escuro que cobre a troca de ambiente, hotspots circulares opcionais projetados nas peças, preloader com progresso real, assinatura sem colisão, modo leitura e sem-JS preservados.

### Fase 3 — loop de avaliação (até 3 rodadas)
1. Captura no navegador: desktop 1440×900 nos pontos 0; 0,3; 0,7; 1,35; 2,2; 2,5; 3,4; 4,4; 5 e celular 390×844 em 0,3; 2,4; 4,4; diálogos, modo leitura, console, draw calls, tamanhos de rede, `npm test`, `npm run build`.
2. Três juízes independentes, só com os arquivos: **cinema** (fidelidade às regras R1–R12 da referência), **aprendizagem** (`planejamento/03-narrativa/CRITERIOS-DE-APRENDIZAGEM.md`), **técnica** (desempenho, acessibilidade, honestidade dos rótulos).
3. Corretor único aplica bloqueadores e graves, reexecuta testes e build, registra em `planejamento/06-avaliacao/rodada-N/`.
4. Parar quando não houver achado bloqueador ou grave.

## Como retomar no PC principal

```sh
git clone https://github.com/igormorais123/relogio-de-precisao.git
git clone https://github.com/igormorais123/INTEIA-laboratorio-3d.git
cd relogio-de-precisao/f1-loop
npm ci
npm test
npm run dev   # http://127.0.0.1:5198
```

Os dois repositórios devem ficar lado a lado: `tools/optimize-car.mjs`, `verify-car.mjs` e `audit-assets.mjs` leem `../../INTEIA-laboratorio-3d`. Publicação: cada push em `main` que toque `f1-loop/` dispara `.github/workflows/pages-f1-loop.yml` e atualiza a aula no GitHub Pages.

Para continuar com o mesmo método no Claude Code, peça: "leia `f1-loop/PROXIMOS-PASSOS.md` e execute o plano com ultracode, fase por fase, com avaliadores rigorosos".
