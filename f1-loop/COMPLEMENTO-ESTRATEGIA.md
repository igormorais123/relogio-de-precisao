# Complemento ao trabalho do Fable 5.1 — F1 Loop / INTEIA

Revisão de 13/09/2026. Pedido: analisar a estratégia, aproveitar o trabalho existente e complementá-lo, mantendo **aprendizagem como finalidade**. O histórico fornecido também autorizou melhorar a matéria-prima e continuar a construção do site.

## Avaliação

O trabalho tem uma boa base: pesquisa em várias frentes, quatro tratamentos com identidades narrativas distintas, avaliações por três lentes e inventário do laboratório. A separação entre pesquisa, alternativas e julgamento permite rastrear decisões. C oferece a melhor espinha para verificação; D contribui com box/debrief e arco visual; B oferece formulações transferíveis para tarefas com IA.

O principal problema é de seleção e comprovação. Somar os efeitos e os enxertos sugeridos por todos os juízes produziria uma experiência cara e difícil de ler. Um parecer rigoroso também pode estar errado: notas e concordância entre agentes não demonstram que o conteúdo foi validado ou que o aluno aprendeu.

## O que precisava ser corrigido

| Lacuna observada | Complemento aplicado |
|---|---|
| Mistura entre tutorial antigo de aproximadamente 40 objetos e laboratório atual | O aplicativo usa os 97 componentes atuais, com versões, hashes e pivôs conferidos. |
| Cinema orientando a sequência pedagógica | Seis etapas: preparar, hipótese, executar, avaliar, corrigir, encerrar. Cada uma tem uma ação do aluno. |
| Sete capítulos dependentes de um motor anterior que fixava seis | Novo controlador por progresso absoluto, com seis etapas explícitas; o relógio não foi alterado. |
| Avaliação por notas/hotspots visitados | Questões com feedback e uma tarefa real registrada. Nenhuma aprovação automática por rolagem. |
| Independência confundida com “outro agente” | O texto exige critérios, fontes e conferência dos achados; admite que o crítico pode não encontrar falha. |
| Revisar por obrigação | Candidata já correta pode ser aceita com evidência; não se inventa correção para preencher o loop. |
| Fumaça, números e vitórias usados como prova | Visualização é identificada como ilustração. Fontes não sustentam inferência automática de causalidade. |
| Fim visual confundido com sucesso | Registro permite aceitar, reverter, revisar, parar inconclusivo ou indicar decisão necessária. |
| Asset pesado | Duas versões reduzidas do GLB, sem eliminar a separação das peças nem exigir decoder. |

## Complemento entregue

- [Narrativa e storyboard](planejamento/03-narrativa/NARRATIVA.md).
- [Critérios de aprendizagem e exercício com fonte real](planejamento/03-narrativa/CRITERIOS-DE-APRENDIZAGEM.md).
- [Seis fichas complementares](planejamento/03-narrativa/capitulos/complemento/01-preparar.md).
- [Verificação de fatos](planejamento/01-pesquisa/VERIFICACAO-FATOS-COMPLEMENTO.md).
- [Auditoria dos assets](planejamento/01-pesquisa/AUDITORIA-ASSETS-COMPLEMENTO.md).
- Aplicativo funcional: [index.html](index.html), conteúdo em [src/content.js](src/content.js).
- [Dados complementares](planejamento/04-dados/narrativa-f1.complemento.js): apontam para a fonte de conteúdo atual, sem duplicar textos.
- [Manifesto de procedência](public/assets/manifesto-assets.json) e ferramentas de reprodução em `tools/`.

Durante esta sessão surgiram sete fichas, um draft e uma implementação adicional em `site/`, com sete estações e carro procedural. Eles foram mantidos nos seus caminhos. A versão complementar da raiz usa o modelo real e seis etapas; as suas fichas ficam em `capitulos/complemento/` e os dados em `narrativa-f1.complemento.js`. O README foi atualizado para identificar corretamente as duas versões. Não foi realizada uma fusão automática entre os dois aplicativos.

## Experiência implementada

Rolagem nativa controla câmera e montagem de forma reversível. O mesmo progresso reconstrói a mesma pose; a cena final retorna à composição inicial por uma ação explícita. Não há loop infinito ou contagem fictícia de tentativas.

Carro vermelho INTEIA com materiais atuais e assinatura vetorial, montagem por categoria, box reaproveitado e túnel ilustrativo. Paredes e estruturas que ocultariam o carro foram retiradas da apresentação da cena, sem modificar o GLB original. Na tela estreita, usa o carro menor e não baixa o box.

Atividades em diálogo com teclado e Escape, seis questões com feedback, caderno persistente no navegador, exportação JSON e gerador de prompt. O prompt apenas prepara texto: não chama um modelo de IA. Campos começam vazios e as notas são identificadas como declarações do aluno, sem verificação automática.

Modo leitura responde à preferência de movimento reduzido. O HTML contém a aula e as fontes, inclusive sem JavaScript. Se o carro não carrega, a experiência retorna à leitura. A renderização ocorre quando a cena muda, sem trabalho contínuo da GPU enquanto ela está parada.

## Matéria-prima melhorada

| Versão | Tamanho do GLB | Triângulos da geometria |
|---|---:|---:|
| Fonte web do laboratório | 26.454.116 bytes | 752.824 |
| Aula desktop | 10.407.208 bytes | 260.023 |
| Aula tela estreita | 7.309.200 bytes | 130.357 |

As versões mantêm 97 componentes e 138 nós. O aplicativo acrescenta a assinatura INTEIA e elementos de cena, portanto sua contagem renderizada é maior que a do GLB. Os dois derivados passaram em 20 ciclos de montagem/desmontagem e testes de direção, DRS, isolamento, arraste e restauração sem desvio de retorno. Essa verificação não equivale a validar mecânica física.

## Fontes e limites das analogias

O conteúdo usa [Mercedes sobre o simulador](https://www.mercedesamgf1.com/news/feature-explaining-the-role-of-an-f1-sim-driver), [Formula 1 sobre correlação e instrumentos](https://www.formula1.com/en/latest/article/testing-explained-rob-smedley-on-correlation-aero-rakes-and-flow-vis-paint.5UTaH1q9iuQcXVjZXui3Fz), [Mercedes sobre dados](https://www.mercedesamgf1.com/news/feature-data-and-electronics-in-f1-explained), [a introdução pública da análise Ferrari/Monza](https://www.formula1.com/en/latest/article/tech-weekly-how-ferraris-monza-upgrades-helped-the-team-to-address-a-key.5UpzTp0C4wEAuH8HalwblV) e [McLaren sobre debrief](https://www.mclaren.com/racing/formula-1/2026/what-do-formula-1-drivers-do-between-sessions/).

Os instrumentos e as práticas de engenharia ajudam a explicar verificação e comparação. Não fornecem coeficientes, telemetria ou resultados de desempenho para este modelo. A vitória em Monza não demonstra, isoladamente, o efeito causal da atualização do carro. O relatório factual detalha o que cada fonte efetivamente sustenta.

## Validação e limites desta entrega

- Nove testes automatizados de progressão, reversão, emendas, limites e integridade da exportação passaram.
- Compilação passou; o pacote Three.js continua grande e é carregado separadamente da aula.
- Navegador: cena desktop e estreita, transição de montagem/túnel, retorno final, atividades, feedback, anotação, prompt, Escape, modo leitura, preferência de movimento reduzido e conteúdo sem JavaScript conferidos. Detalhes em [VALIDACAO-COMPLEMENTO.md](VALIDACAO-COMPLEMENTO.md).
- A inspeção estreita foi em viewport de navegador, não em aparelho físico. Não foi aferido FPS em celulares reais.
- O resultado é uma versão funcional de estudo, não comprovação de fotorrealismo ou reprodução integral da experiência Resn. Pós-processamento cinematográfico, texto WebGL/MSDF, fumaça volumétrica, pit stop coreografado e pista ainda pertencem ao plano de arte. Só devem entrar se contribuírem para a lição.
- O material de terceiros mantém sua própria procedência. A titularidade INTEIA não resolve automaticamente a licença da geometria derivada do tutorial.
- A entrega permanece local. Nenhum commit, push ou deploy foi realizado nesta revisão.

## Próxima rodada recomendada

1. Aplicar a atividade real com um aluno: recolher a candidata, a crítica e a decisão justificadas. Observar onde ele confunde previsão, evidência e aprovação.
2. Ajustar apenas os trechos que essa aplicação demonstrar difíceis. Preservar seis objetivos claros antes de ampliar efeitos.
3. Medir carregamento e renderização em celulares reais; então ajustar materiais, número de chamadas de desenho e qualidade por dispositivo.
4. Trabalhar uma passagem cinematográfica por vez, com comparação visual e critério de leitura. O carro deve sustentar a explicação, e cada novo efeito precisa justificar seu custo.
