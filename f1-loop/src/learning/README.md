# Prática contínua de revisão

Fonte inteiramente fictícia: setor de atendimento compara formulários, com 50 pedidos por versão e medianas de 12 e 9 minutos. Formulário e equipe mudam juntos; não há causa isolada, data ou autorização para adoção definitiva.

## Integração

No renderizador, importar `renderLearningMarkup` de `./src/learning/index.js` e inserir a string após `#dialog-body`, dentro do diálogo existente. Carregar `./src/learning/learning.css` depois dos estilos da aula.

No cliente, importar `mountLearning` de `./learning/index.js`. Montar uma vez: `const learning = mountLearning(document.querySelector('#lesson-dialog'), {chapterIndex: 0})`. Ao abrir cada capítulo, chamar `learning.updateChapter(index)`. O controlador não abre ou fecha diálogos e não altera o capítulo da página. O quiz anterior pode ser ocultado pelo integrador quando o laboratório estiver montado.

Apenas uma etapa aparece de cada vez. Fonte e candidata ficam juntas; ações futuras permanecem bloqueadas até o aluno executar as anteriores. O botão interno permite retornar à etapa pendente. As ações corretas disponibilizam Continuar exercício. A candidata original não é substituída pela correção. A versão corrigida e o histórico aparecem no registro expansível.

O estado vive na instância montada. Reabrir o diálogo preserva o percurso; recarregar reinicia. `getState()` retorna uma cópia. `destroy()` remove o listener. O evento DOM `learning-action` informa `{passed, stage, completed}`; não é autorização para marcar uma tarefa real como aprovada.

Sem JavaScript, o HTML contém fonte, candidata e seis etapas legíveis, mas o integrador precisa expor esse conteúdo se o diálogo hospedeiro estiver oculto no modo sem JavaScript. Não há IA, transmissão de dados ou pontuação.

## Verificação executada

`node --test tests/learning.test.mjs`: 5 testes passaram, cobrindo bloqueio de avanço sem ação, suporte por fonte, justificativa da correção, decisão limitada e HTML estático. Validação visual e fluxo dentro do diálogo final devem ocorrer após a integração.
