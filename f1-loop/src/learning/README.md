# Prática contínua de revisão

Caso inteiramente fictício: setor de atendimento compara formulários em 14 de maio de 2026, com 50 pedidos por versão e medianas de 12 e 9 minutos. Formulário e equipe mudam juntos. O registro não informa data nem autorização para adoção definitiva.

## Contrato pedagógico

1. Preparar: o aluno escreve o próprio critério (até 2.000 caracteres) e confirma que o revisou. O site confere apenas preenchimento e confirmação. Não avalia significado, qualidade ou palavras-chave. O texto é preservado literalmente e fica somente leitura após registro. Depois, compara o próprio texto ao critério-modelo e marca três autoconferências, sem nota ou bloqueio semântico.
2. Hipótese: escolher entre três previsões completas com mudança, efeito esperado e refutação; envio vazio tem orientação própria. Uma regra de revisão pode retirar diferentes excessos sem trocar os critérios.
3. Executar: a escolha de preservar o original, seguida da ação explícita, guarda `SIMULATION_REQUEST`, cópia da fonte e as quatro frases intactas da candidata em `state.execution`. A interface mostra o pedido antes da ação e expõe as cópias no histórico. É simulação previamente escrita; nenhuma IA foi executada.
4. Avaliar: dados sustentados na frase 2; inferência causal não sustentada na frase 3; data não sustentada por este registro OU não verificada externamente, ambas com frase 4; treinamento não verificado, com fonte `nenhuma` (a ficha de capacitação não foi aberta). Na primeira tentativa, erros recebem perguntas-guia; no acerto ou a partir da segunda tentativa recebem explicações completas. Tentativas não contam como conclusão. Ausência documental não prova falsidade ou uma data alternativa. A correção retira a data até sua confirmação.
5. Corrigir: opções plausíveis preservam alguns elementos, mas podem omitir medianas/grupos ou exceder os limites causais. O retorno identifica exatamente o que não atende aos critérios explícitos do caso, sem fingir avaliar o critério livre do aluno.
6. Encerrar: comunicar observação com limites; declarar inconclusiva a causa ou a data; encaminhar adoção para decisão competente. A saída exige motivo compatível e reconhecimento do limite. A ressalva livre é guardada sem avaliação. Não há aprovação de tarefa real.

## Integração existente

`renderLearningMarkup()` retorna HTML estático. `mountLearning(container,{chapterIndex:0,onNavigate})` retorna `updateChapter(index)`, `getState()` e `destroy()`. Fonte e candidata ficam em details aberto sem JS, na primeira abertura e sempre em Avaliar/Corrigir; nas demais reaberturas ficam recolhidas. Só uma etapa ativa aparece. Navegar não conclui ações. Continuar/Retomar chama o callback síncrono opcional `onNavigate(chapterIndex)` para o integrador atualizar todo o contexto via `openLesson`. Sem callback, atualiza apenas a etapa local. Após callback, foca o h4 e o coloca à vista; `updateChapter` externo nunca move foco.

Carregar `learning.css` depois dos estilos globais. O controlador não abre diálogos. O estado dura enquanto a instância estiver montada: reabrir preserva; recarregar reinicia. O evento `learning-action` informa `{passed,stage,completed}` e jamais certifica o trabalho do aluno. Sem rede, IA ou armazenamento persistente.

Sem JavaScript, as seis etapas, o pedido exato, a fonte e as opções permanecem no HTML para leitura e resposta em papel. A cópia externa em `noscript` é responsabilidade do renderizador; ele remove o `noscript` interno para não aninhar essas tags. As cópias do registro só aparecem após uma ação com JavaScript.

## Verificação

`node --test tests/learning.test.mjs`: contratos de progressão, texto livre não avaliado, pedido e candidata preservados, distinção epistemológica, correção e motivos de três saídas. O fluxo completo também é exercitado pela máquina de estado. A validação visual do novo build ocorre após integração; testes do módulo não comprovam aparência nem experiência em aparelho real.

## Integração da rodada 2

G1: o exemplo deve distinguir apoio neste registro de confirmação externa, incluir treinamento e usar o pedido literal de `SIMULATION_REQUEST`. G4: o integrador organiza as duas fases do diálogo e os campos da tarefa real; o módulo fornece Critério do caso e documentos recolhíveis. M5: conectar `onNavigate` ao capítulo completo, de forma síncrona, preservando a instância. Não criar outro modal.

Verificação planejada no próximo build imutável: guardar critério e conferir contraste/autoconferência; hipótese vazia e refutação; arquivo errado bloqueia e intacto guarda quatro frases; primeira tentativa errada não revela gabarito, segunda explica; ambas classificações da data com frase 4 passam, treinamento só com documento ausente; Continuar/Retomar sincronizam contexto e foco; documentos recolhem ao reabrir, exceto Avaliar/Corrigir; noJS preserva todo conteúdo.
