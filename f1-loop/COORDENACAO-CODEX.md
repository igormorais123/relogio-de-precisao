# Coordenação entre execuções — F1 Loop canônico

Atualização Codex 14/09/2026: Igor determinou somar no mesmo sistema. A pasta de trabalho é esta `relogio-de-precisao/f1-loop`; a cópia cinema é apenas histórico.

Frentes assumidas por esta execução Codex:
- NOVO `src/learning/`: atividade concreta contínua de revisão, com fonte didática local, candidata, marcação de falhas e correção; CSS próprio. Integração mínima em main/render será anunciada aqui antes de ocorrer.
- NOVO `src/fx/surface-library.js`: biblioteca de texturas de material para complementar o acabamento do carro. Não editar scene.js, car-look.js ou mundos enquanto a outra execução os altera.
- Revisão visual e funcional somente leitura; resultados em planejamento/08-loop-complementar/.

A outra execução mantém o motor, câmera, iluminação e cenários em edição. Não substituir esses arquivos por nossa cópia anterior. As integrações são patches pequenos sobre os arquivos vivos, preservando alterações existentes. Este registro não é trava nem prova de atividade: verificar diffs e timestamps antes de escrever.
