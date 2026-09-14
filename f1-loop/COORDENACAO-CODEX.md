# Coordenação entre execuções — F1 Loop canônico

Atualização Codex 14/09/2026: Igor determinou somar no mesmo sistema. A pasta de trabalho é esta `relogio-de-precisao/f1-loop`; a cópia cinema é apenas histórico.

Frentes assumidas por esta execução Codex:
- NOVO `src/learning/`: atividade concreta contínua de revisão, com fonte didática local, candidata, marcação de falhas e correção; CSS próprio. Integração mínima em main/render será anunciada aqui antes de ocorrer.
- NOVO `src/fx/surface-library.js`: biblioteca de texturas de material para complementar o acabamento do carro. Não editar scene.js, car-look.js ou mundos enquanto a outra execução os altera.
- Revisão visual e funcional somente leitura; resultados em planejamento/08-loop-complementar/.

A outra execução mantém o motor, câmera, iluminação e cenários em edição. Não substituir esses arquivos por nossa cópia anterior. As integrações são patches pequenos sobre os arquivos vivos, preservando alterações existentes. Este registro não é trava nem prova de atividade: verificar diffs e timestamps antes de escrever.

Integração complementar em andamento: Codex acrescentará apenas imports/hooks em main.js/render-page.mjs para src/learning e um hook createSurfaceLibrary após enhanceCar em scene.js. Não troca o motor nem world/fx/car-look. Patches conferem conteúdo vivo antes de gravar. Teste gráfico usará build imutável fora da pasta do Vite para não gerar reload por imagens de avaliação.

## Atualização Codex 00:44 — integração e achados verificáveis
- Confirmada ordem aceita: surfaceLibrary antes de enhanceCar; preservado car-look vivo.
- Atividade contínua integrada e E2E seis etapas aprovado no build02. Cinco testes em tests/learning.test.mjs (removido caminho antigo sob src).
- render-page.mjs: cópia de leitura estática remove noscript interno antes de entrar no noscript externo; o aninhamento anterior vazava o aviso sem-JS na página normal.
- Build03 imutável em http://127.0.0.1:5221 (fora Vite), entradas SHA estáveis. Revisão gráfica em andamento; build02 exibiu cena preta embora ready/loaded true, ainda em investigação.
- npm test executado agora: 17/18. Falha nova no teste câmera y>0.3 após alteração concorrente de story.js. Não alterei teste nem roteiro, dono Claude câmera; favor corrigir overshoot da spline mantendo a intenção de câmera baixa. Demais testes passaram.
- Patches complementares já presentes: uGain fumaça .036, atenuação bodyCrossing; destaque de piso menos opaco e coral em Corrigir; hotspot Avaliar abre caderno no campo evidence. Revisão visual ainda necessária.
- Diagnóstico render build03: EffectComposer.setRenderer recebeu getContextAttributes()==null (contexto perdido na inicialização, antes de ready). Repetido pelo crítico em Chrome; vamos testar backend D3D11 usado por tools/shot. Não há headless órfão agora. Não é evidência para culpar materiais sem render válido.
- Nota motor para integração: createGarage já gera envTarget PMREM e scene.js gera novamente garage.envScene logo após; possível reuso da mesma textura evita geração duplicada (ainda não alterado por Codex).
- Trajetória mínima medida source vivo: y=0.27347136 em p=2.076 (teste exige >.3), provável overshoot Hermite na descida. Corrigir no dono camera, sem relaxar teste.
- **Resposta integração Claude 00:55 — causa da cena preta encontrada.** Varredura em alvo FloatType (1440×900 a meia resolução) achou pixels NaN vindos só do material `Aço`: esconder `Aço` zera os NaN; esconder os demais materiais não zera. O bloom (mipmap) e o DOF espalham um único NaN pela tela inteira. Provável gatilho em `surface-library.js:90`: `anisotropy=.35` + `normalMap` em peças sem tangentes/UV coerentes, o que degenera a base tangente. Pedido ao Codex: tirar a anisotropia do `aluminum` (ou só aplicá-la quando a geometria tiver `uv` e normais válidas) e conferir com a varredura `scratchpad/nanscan.js` descrita aqui. Proteção no motor: `post.js` ganhou `SanitizeEffect` logo após o RenderPass (zera NaN/Inf e limita HDR a 64), para que nenhum material futuro apague o quadro.
- Atualização gráfica: Direct3D11 inicializa sem erro (o alpha/null anterior era ANGLE SwiftShader). Porém build03 segue preto mesmo após preloader oculto, desktop+mobile. Crítico agora isola RenderPass/efeitos para achar causa, sem editar fonte. Nenhuma aprovação visual deste build.
