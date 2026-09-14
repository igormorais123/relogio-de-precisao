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
  { text: 'O formulário será adotado definitivamente em 20 de maio de 2026.', verdict: 'nao-verificada', source: '4', explanation: 'Não verificada: a frase 4 registra a ausência de data e autorização. Não há fonte para confirmar o dia 20; isso não prova uma data alternativa. Retire a data do comunicado até obter o documento competente.' },
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
  const guides = ['Confira separadamente os dois valores e o tamanho de cada grupo.', 'Quantas condições mudaram juntas? O teste separou seus efeitos?', 'O que este registro permite afirmar sobre a data? Qual documento seria necessário para confirmá-la?', 'Alguma frase do registro menciona capacitação? Que documento permitiria conferir essa informação?'];
  const findings = CLAIMS.map((claim, i) => {
    const answer = answers[i];
    const passed = answer?.source === claim.source && (answer?.verdict === claim.verdict || (i === 2 && answer?.verdict === 'nao-sustentada'));
    const explanation = i === 2 && answer?.verdict === 'nao-sustentada' ? 'Não sustentada por este registro: a frase 4 não fornece data nem autorização. A verdade externa sobre data e adoção segue não verificada até obter o ato competente; ausência de apoio não prova falsidade.' : claim.explanation;
    return { index: i, passed, message: passed || attempt >= 2 ? explanation : guides[i] };
  });
  return { passed: findings.every(f => f.passed), findings };
}
export function checkCorrection(choice, reason) {
  if (!choice) return { passed: false, message: 'Escolha uma versão para corrigir a candidata.' };
  if (choice !== '0') return { passed: false, message: choice === '1' ? 'A data e as medianas foram preservadas, mas faltam os grupos de 50 pedidos. O formulário ainda recebe uma causa não isolada pelo teste. Corrija os dois pontos.' : 'A diferença e os grupos aparecem, mas as duas medianas desapareceram. Recomendar adoção só pela diferença ignora as mudanças simultâneas e a falta de autorização.' };
  if (reason !== 'limites') return { passed: false, message: !reason ? 'Escolha o motivo da sua correção.' : reason === 'diferenca' ? 'A diferença pode ser calculada, mas destacá-la não explica por que a versão é fiel: confira também grupos, data e limites da conclusão.' : 'Organizar informações ajuda a leitura, mas não demonstra fidelidade. O motivo precisa ligar os dados e os limites à fonte.' };
  return { passed: true, message: 'Você preservou data, medianas e grupos, retirou a causa não isolada e a data sem confirmação e a afirmação de treinamento sem fonte. Esta conferência cobre as alternativas deste exercício.' };
}
export function checkDecision(decision, reason, responsibility) {
  const reasons = { comunicar: ['observacao'], inconclusivo: ['causa-pendente', 'data-pendente'], 'decisao-necessaria': ['autorizacao'] };
  if (!reasons[decision]?.includes(reason)) return { passed: false, message: 'Decisão e motivo não correspondem. A observação permite um comunicado limitado; a causa ou a data podem permanecer inconclusivas; adotar o formulário exige decisão de quem tem competência.' };
  if (!responsibility) return { passed: false, message: 'Confirme que você distingue a decisão registrada daquilo que a fonte ainda não permite concluir.' };
  const messages = { comunicar: 'Você escolheu comunicar somente a observação corrigida.', inconclusivo: 'Você encerrou como inconclusiva a questão indicada, preservando os resultados observados.', 'decisao-necessaria': 'Você encaminhou a adoção para decisão competente, sem tratar o teste como autorização.' };
  return { passed: true, message: `${messages[decision]} O exercício confere apenas a coerência entre alternativas e fonte. Não autoriza adoção definitiva nem certifica uma tarefa real.` };
}
export function applyLearningAction(state, action) {
  const index = state.completed.length;
  if (action.stage !== index) return { state, passed: false, message: index === 6 ? 'O percurso desta sessão já foi registrado. Revise o histórico abaixo.' : `Antes desta ação, conclua ${STAGES[index]}. Abrir um capítulo não conclui a atividade.` };
  let message = '', valid = false;
  if (index === 0) { valid = typeof action.criterion === 'string' && action.criterion.trim().length > 0 && action.criterion.length <= 2000 && action.selfReview === true; message = valid ? 'Seu critério foi guardado literalmente. Você declarou que o revisou; o site não avaliou o significado nem a qualidade do texto livre.' : 'Escreva seu critério e confirme sua própria revisão. O site verifica somente preenchimento e confirmação, não a qualidade do critério.'; }
  if (index === 1) { valid = action.hypothesis === 'fidelidade'; message = valid ? 'Hipótese registrada: aplicar uma regra de revisão — exigir apoio na fonte para cada afirmação — deve preservar dados e retirar excessos. Será refutada se restar afirmação sem apoio ou se um dado for alterado ou omitido.' : !action.hypothesis ? 'Escolha uma hipótese antes de registrar.' : action.hypothesis === 'efeito' ? 'O fato de o texto ficar mais fácil de ler não refuta uma atribuição causal indevida. A refutação precisa conferir o conteúdo na fonte.' : 'Uma discordância pessoal não mostra se o comunicado ficou fiel. Defina uma falha observável nos dados ou no apoio documental.'; }
  if (index === 2) { valid = action.archive === true && action.archiveChoice === 'intacta'; message = valid ? 'Pedido exato da simulação, fonte e candidata intacta guardados no registro desta sessão. Nenhuma IA foi executada; a candidata é um exemplo previamente escrito.' : !action.archiveChoice ? 'Escolha o que guardar antes da avaliação.' : action.archiveChoice === 'corrigida' ? 'Corrigir antes de guardar apaga a evidência do que a candidata realmente respondeu. Preserve o original para comparar depois.' : 'Substituir a versão de partida elimina a comparação. Guarde pedido, fonte e candidata intactos em um registro separado.'; }
  if (index === 3) { const result = checkClaims(action.answers, (state.claimAttempts || 0) + 1); valid = result.passed; message = valid ? 'Quatro achados conferidos. Treinamento exige ficha de capacitação ausente. A data não tem apoio neste registro e permanece não verificada externamente; isso não prova que seja falsa.' : 'Há uma classificação ou referência a rever. Confira a pergunta-guia de cada afirmação; na segunda tentativa, a explicação completa ficará disponível.'; }
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
