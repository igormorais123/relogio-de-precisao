/** Exercise fixtures. Entirely fictional; no live F1 or engineering claims. */
export const SOURCE = [
  'Em 14 de maio de 2026, um setor fictício comparou dois formulários de atendimento.',
  'Na referência, 50 pedidos tiveram mediana de atendimento de 12 minutos. Na candidata, outros 50 pedidos tiveram mediana de 9 minutos.',
  'O formulário e a equipe de atendimento mudaram juntos. O teste não isolou a causa da diferença.',
  'O registro não informa data para adoção definitiva do formulário nem autoriza essa adoção.'
];
export const CLAIMS = [
  { text: 'A mediana passou de 12 minutos para 9 minutos, com 50 pedidos em cada versão.', verdict: 'sustentada', source: '2', explanation: 'A frase 2 sustenta os dois valores e os tamanhos dos grupos. Isso descreve a observação; não demonstra a causa.' },
  { text: 'O novo formulário causou a redução de 3 minutos.', verdict: 'nao-sustentada', source: '3', explanation: 'A frase 3 informa duas mudanças simultâneas. A diferença de 3 minutos existe, mas atribuí-la ao formulário ultrapassa a evidência.' },
  { text: 'O formulário será adotado definitivamente em 20 de maio de 2026.', verdict: 'nao-sustentada', source: '4', explanation: 'A frase 4 não oferece data nem autorização de adoção definitiva. O dia 20 foi inventado pela candidata.' }
];
export const CORRECTIONS = [
  'Em 14 de maio de 2026, observaram-se medianas de 12 minutos e 9 minutos, com 50 pedidos em cada versão. Formulário e equipe mudaram juntos; a causa não foi isolada. Não há data nem autorização de adoção definitiva no registro.',
  'Em 14 de maio de 2026, o formulário reduziu a mediana de 12 minutos para 9 minutos. A adoção definitiva ainda depende de autorização.',
  'A candidata ficou melhor e pode ser usada em breve.'
];
export const STAGES = ['Preparar', 'Hipótese', 'Executar', 'Avaliar', 'Corrigir', 'Encerrar'];
export function createLearningState() { return { completed: [], hypothesis: '', correctedText: '', decision: '', history: [] }; }
export function checkClaims(answers = []) {
  const findings = CLAIMS.map((claim, i) => ({ index: i, passed: answers[i]?.verdict === claim.verdict && answers[i]?.source === claim.source, message: claim.explanation }));
  return { passed: findings.every(f => f.passed), findings };
}
export function checkCorrection(choice, reason) {
  if (choice !== '0') return { passed: false, message: choice === '1' ? 'A data e as medianas foram preservadas, mas faltam os grupos de 50 pedidos. O formulário ainda recebe uma causa não isolada pelo teste. Corrija os dois pontos.' : 'A frase ficou vaga: perdeu data, valores, grupos de 50 pedidos e limites. Clareza não justifica apagar a evidência.' };
  if (reason !== 'limites') return { passed: false, message: 'A redação escolhida preserva o registro. Agora justifique pela manutenção dos dados e dos limites, não pelo tom ou pela suposta aprovação de uma IA.' };
  return { passed: true, message: 'Você preservou data, medianas e grupos, retirou a causa não isolada e a data inventada. Esta conferência cobre as alternativas deste exercício.' };
}
export function applyLearningAction(state, action) {
  const index = state.completed.length;
  if (action.stage !== index) return { state, passed: false, message: index === 6 ? 'O percurso desta sessão já foi registrado. Revise o histórico abaixo.' : `Antes desta ação, conclua ${STAGES[index]}. Abrir um capítulo não conclui a atividade.` };
  let message = '', valid = false;
  if (index === 0) { valid = action.preserve === true && action.limits === true; message = valid ? 'Critério registrado: manter os dados da fonte e distinguir observação, causa e autorização.' : 'Marque os dois critérios: preservar os dados e respeitar os limites da fonte.'; }
  if (index === 1) { valid = action.hypothesis === 'fidelidade'; message = valid ? 'Hipótese registrada: corrigir causa e data sem alterar os dados torna a comunicação fiel. A comparação com a fonte pode refutá-la.' : 'Trocar o tom não testa fidelidade. Escolha uma hipótese que a comparação com a fonte possa contrariar.'; }
  if (index === 2) { valid = action.inspect === true; message = valid ? 'Comparação iniciada por você. A candidata continua intacta para que seus achados possam ser conferidos.' : 'Leia as três frases da candidata e confirme que iniciou a comparação com a fonte.'; }
  if (index === 3) { const result = checkClaims(action.answers); valid = result.passed; message = valid ? 'Três afirmações confrontadas com as frases correspondentes da fonte. Dois achados delimitados: causa não isolada e data inventada.' : 'Há uma classificação ou referência a rever. Confira o retorno específico de cada afirmação.'; }
  if (index === 4) { const result = checkCorrection(action.choice, action.reason); valid = result.passed; message = result.message; }
  if (index === 5) { valid = action.decision === 'comunicar' && action.responsibility === true; message = valid ? 'Você decidiu usar a versão corrigida como comunicação limitada ao teste fictício. Isso não autoriza adoção definitiva nem certifica uma tarefa real.' : 'O registro sustenta comunicar a observação corrigida. Não sustenta liberar adoção definitiva ou confirmar a causa. Registre também que a decisão é sua.'; }
  if (!valid) return { state, passed: false, message };
  const next = { ...state, completed: [...state.completed, index], history: [...state.history, { stage: STAGES[index], action: message }] };
  if (index === 1) next.hypothesis = action.hypothesis;
  if (index === 4) next.correctedText = CORRECTIONS[0];
  if (index === 5) next.decision = action.decision;
  return { state: next, passed: true, message };
}


