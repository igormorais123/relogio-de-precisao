/** Exercise fixtures. Entirely fictional; no live F1 or engineering claims. */
export const SOURCE = [
  'Em 14 de maio de 2026, o setor de atendimento comparou dois formulários.',
  'Na referência, 50 pedidos tiveram mediana de atendimento de 12 minutos. Na candidata, outros 50 pedidos tiveram mediana de 9 minutos.',
  'O formulário e a equipe de atendimento mudaram juntos. O teste não isolou a causa da diferença.',
  'O registro não informa data para adoção definitiva do formulário nem autoriza essa adoção.'
];
export const CLAIMS = [
  { text: 'A mediana passou de 12 minutos para 9 minutos, com 50 pedidos em cada versão.', verdict: 'sustentada', source: '2', explanation: 'A frase 2 sustenta os dois valores e os tamanhos dos grupos. Isso descreve a observação; não demonstra a causa.' },
  { text: 'O novo formulário causou a redução de 3 minutos.', verdict: 'nao-sustentada', source: '3', explanation: 'A frase 3 informa duas mudanças simultâneas. A diferença de 3 minutos existe, mas atribuí-la ao formulário ultrapassa a evidência.' },
  { text: 'O formulário será adotado definitivamente em 20 de maio de 2026.', verdict: 'nao-sustentada', source: '4', explanation: 'A frase 4 trata da adoção e informa que este registro não fornece data nem autorização. Por isso, ele não sustenta a adoção em 20 de maio. Isso não prova que a data seja falsa, mas o comunicado não pode afirmá-la.' },
  { text: 'A equipe da versão candidata recebeu treinamento no novo formulário antes do teste.', verdict: 'nao-verificada', source: 'nenhuma', explanation: 'O registro não fala de treinamento. Decidir exige a ficha de capacitação da equipe, que não foi aberta. Não verificada não quer dizer falsa: retire a frase ou busque o documento.' }
];
export const SIMULATION_REQUEST = 'Redija um comunicado interno com base somente no registro de 14 de maio de 2026. Preserve a data, os grupos de 50 pedidos e as medianas de 12 e 9 minutos. Separe observação de causa. Não acrescente data ou autorização de adoção definitiva.';
export const CORRECTIONS = [
  'Em 14 de maio de 2026, observaram-se medianas de 12 minutos e 9 minutos, com 50 pedidos em cada versão. Formulário e equipe mudaram juntos; a causa não foi isolada. Não há data nem autorização de adoção definitiva no registro.',
  'Em 14 de maio de 2026, o formulário reduziu a mediana de 12 minutos para 9 minutos. A adoção definitiva ainda depende de autorização.',
  'Em 14 de maio de 2026, o atendimento ficou 3 minutos mais rápido, com 50 pedidos por versão. Como a diferença foi observada, recomenda-se a adoção definitiva; a data será definida depois.'
];
export const STAGES = ['Preparar', 'Hipótese', 'Executar', 'Avaliar', 'Corrigir', 'Encerrar'];
export function createLearningState() { return { completed: [], criterion: '', criterionReview: 'not-assessed', claimAttempts: 0, hypothesis: '', execution: null, correctedText: '', decision: '', decisionReason: '', decisionNote: '', history: [] }; }
export function checkClaims(answers = [], attempt = 1) {
  const guides = ['Confira separadamente os dois valores e o tamanho de cada grupo.', 'Quantas condições mudaram juntas? O teste separou seus efeitos?', 'Alguma frase do registro trata da adoção? O que ela diz sobre data e autorização?', 'Alguma frase do registro menciona capacitação? Que documento permitiria conferir essa informação?'];
  const findings = CLAIMS.map((claim, i) => {
    const answer = answers[i];
    const passed = answer?.source === claim.source && answer?.verdict === claim.verdict;
    const explanation = claim.explanation;
    return { index: i, passed, message: passed || attempt >= 2 ? explanation : guides[i] };
  });
  return { passed: findings.every(f => f.passed), findings };
}
export function checkCorrection(choice, reason) {
  if (!choice) return { passed: false, message: 'Escolha uma versão para corrigir a candidata.' };
  if (choice !== '0') return { passed: false, message: choice === '1' ? 'A data e as medianas foram preservadas, mas faltam os grupos de 50 pedidos. O formulário ainda recebe uma causa não isolada pelo teste. Corrija os dois pontos.' : 'A diferença e os grupos aparecem, mas as duas medianas desapareceram. Recomendar adoção só pela diferença ignora as mudanças simultâneas e a falta de autorização.' };
  if (reason !== 'limites') return { passed: false, message: !reason ? 'Escolha o motivo da sua correção.' : reason === 'diferenca' ? 'A diferença pode ser calculada, mas destacá-la não explica por que a versão é fiel: confira também grupos, data e limites da conclusão.' : 'Organizar informações ajuda a leitura, mas não demonstra fidelidade. O motivo precisa ligar os dados e os limites à fonte.' };
  return { passed: true, message: 'Você preservou data, medianas e grupos, retirou três afirmações sem apoio: a causa, a data de adoção e o treinamento.' };
}
export function checkDecision(decision, reason, responsibility) {
  const reasons = { comunicar: ['observacao'], inconclusivo: ['causa-pendente', 'data-pendente'], 'decisao-necessaria': ['autorizacao'] };
  if (!reasons[decision]?.includes(reason)) return { passed: false, message: 'Decisão e motivo não correspondem. A observação permite um comunicado limitado; a causa ou a data podem permanecer inconclusivas; adotar o formulário exige decisão de quem tem competência.' };
  if (!responsibility) return { passed: false, message: 'Confirme que você distingue a decisão registrada daquilo que a fonte ainda não permite concluir.' };
  const messages = { comunicar: 'Você escolheu comunicar somente a observação corrigida.', inconclusivo: 'Você encerrou como inconclusiva a questão indicada, preservando os resultados observados.', 'decisao-necessaria': 'Você encaminhou a adoção para decisão competente, sem tratar o teste como autorização.' };
  return { passed: true, message: `${messages[decision]} Não autoriza adoção definitiva.` };
}
export function applyLearningAction(state, action) {
  const index = state.completed.length;
  if (action.stage !== index) return { state, passed: false, message: index === 6 ? 'O percurso desta sessão já foi registrado. Revise o histórico abaixo.' : `Antes desta ação, conclua ${STAGES[index]}. Abrir um capítulo não conclui a atividade.` };
  let message = '', valid = false;
  if (index === 0) { valid = typeof action.criterion === 'string' && action.criterion.trim().length > 0 && action.criterion.length <= 2000 && action.selfReview === true; message = valid ? 'Critério guardado como você escreveu.' : 'Escreva seu critério e confirme sua própria revisão.'; }
  if (index === 1) { valid = action.hypothesis === 'fidelidade'; message = valid ? 'Hipótese registrada: aplicar uma regra de revisão — exigir apoio na fonte para cada afirmação — deve preservar dados e retirar excessos. Será refutada se restar afirmação sem apoio ou se um dado for alterado ou omitido.' : !action.hypothesis ? 'Escolha uma hipótese antes de registrar.' : action.hypothesis === 'efeito' ? 'Conferir só os números não testa a atribuição causal. O texto pode manter as medianas e ainda atribuir o ganho ao formulário sem apoio.' : 'Conferir a ausência da data não basta: outras afirmações podem continuar sem apoio. A previsão precisa poder falhar também nesses pontos.'; }
  if (index === 2) { valid = action.archive === true && action.archiveChoice === 'intacta'; message = valid ? 'Pedido, fonte e resposta candidata guardados sem edição.' : !action.archiveChoice ? 'Escolha o que guardar antes da avaliação.' : action.archiveChoice === 'corrigida' ? 'Corrigir antes de guardar apaga a evidência do que a candidata realmente respondeu. Preserve o original para comparar depois.' : 'Substituir a versão de partida elimina a comparação. Guarde pedido, fonte e candidata intactos em um registro separado.'; }
  if (index === 3) { const result = checkClaims(action.answers, (state.claimAttempts || 0) + 1); valid = result.passed; message = valid ? 'Quatro achados conferidos: os dados têm apoio; causa e data de adoção não são sustentadas pelo registro; treinamento não foi verificado por falta da ficha de capacitação. Nenhum desses limites prova, por si, falsidade.' : 'Há uma classificação ou referência a rever. Confira o retorno das frases em aberto.'; }
  if (index === 4) { const result = checkCorrection(action.choice, action.reason); valid = result.passed; message = result.message; }
  if (index === 5) { const result = checkDecision(action.decision, action.decisionReason, action.responsibility); valid = result.passed; message = result.message; }
  if (!valid) return { state: index === 3 ? { ...state, claimAttempts: (state.claimAttempts || 0) + 1 } : state, passed: false, message };
  const next = { ...state, completed: [...state.completed, index], history: [...state.history, { stage: STAGES[index], action: message }] };
  if (index === 0) next.criterion = action.criterion;
  if (index === 1) next.hypothesis = action.hypothesis;
  if (index === 2) next.execution = { request: SIMULATION_REQUEST, source: [...SOURCE], candidate: CLAIMS.map(c=>c.text), kind: 'prewritten-simulation' };
  if (index === 3) next.claimAttempts = (state.claimAttempts || 0) + 1;
  if (index === 4) next.correctedText = CORRECTIONS[0];
  if (index === 5) { next.decision = action.decision; next.decisionReason = action.decisionReason; next.decisionNote = typeof action.decisionNote === 'string' ? action.decisionNote.slice(0,2000) : ''; }
  return { state: next, passed: true, message };
}
