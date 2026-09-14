import { SOURCE, CLAIMS, CORRECTIONS, STAGES, SIMULATION_REQUEST, createLearningState, checkClaims, applyLearningAction } from './model.js';
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const option = (value, text) => `<option value="${value}">${esc(text)}</option>`;
const select = (name, text, options) => name === 'correction' ? `<fieldset class="lr-corrections"><legend>${text}</legend>${options.map(([v,t])=>`<label class="lr-check lr-version"><input type="radio" name="correction" value="${v}"><span><strong>Versão ${Number(v)+1}</strong><br>${esc(t)}</span></label>`).join('')}</fieldset>` : `<label class="lr-field">${text}<select name="${name}">${option('', 'Escolha após conferir a fonte')}${options.map(([v,t])=>option(v,t)).join('')}</select></label>`;
const check = (name, text) => `<label class="lr-check"><input type="checkbox" name="${name}"><span>${text}</span></label>`;
const written = (name, label, hint) => `<label class="lr-field">${label}<textarea name="${name}" rows="3" maxlength="2000" placeholder="${esc(hint)}"></textarea></label>`;
const stage = (i, text, fields, action) => `<section class="lr-step" data-lr-stage="${i}"><h4>${i+1}. ${STAGES[i]}</h4><p>${text}</p>${fields}<button class="lr-action" type="button" data-lr-submit="${i}">${action}</button></section>`;
/** Static content stays readable without JS. Mount adds one active stage at a time. */
export function renderLearningMarkup() {
  return `<section class="lr-lab" data-learning-root aria-label="Prática de revisão com fonte"><p class="lr-tag">CASO PARA PRATICAR</p><h3>O teste melhorou. O comunicado está correto?</h3><p>Você revisa um comunicado interno sobre um formulário de atendimento. Compare a fonte com a candidata, registre os erros e decida o que o texto permite comunicar.</p><details data-lr-documents open><summary>Rever fonte e candidata</summary><div class="lr-docs"><article><h4>Fonte · registro do teste</h4><ol>${SOURCE.map(s=>`<li>${esc(s)}</li>`).join('')}</ol></article><article><h4>Candidata · ainda sem revisão</h4><ol>${CLAIMS.map(c=>`<li>${esc(c.text)}</li>`).join('')}</ol></article></div></details><p class="lr-progress" data-lr-progress>Comece pelo critério do comunicado.</p>
${stage(0,'Escreva com suas palavras o que fará o comunicado estar pronto e o que não pode piorar. Use como referência a data, os grupos, as medianas e a distinção entre observação, causa e autorização.',written('criterion','Critério do caso','Está pronto quando… Não pode piorar…')+check('self-review','Eu revisei meu critério: outra pessoa consegue conferir o que escrevi na fonte.')+'<section class="lr-self-review" data-lr-self-review><h4>Compare com um critério-modelo</h4><p data-lr-criterion-comparison>Compare o modelo com seu texto antes de guardar.</p><p><strong>Critério-modelo:</strong> Cada afirmação deve ter apoio na fonte; preservar 14 de maio de 2026, os dois grupos de 50 pedidos e as medianas de 12 e 9 minutos, sem atribuir causa ou acrescentar adoção ou treinamento não confirmados.</p>'+check('review-source','Outra pessoa consegue conferir meu critério na fonte?')+check('review-data','Meu critério preserva data, grupos e medianas?')+check('review-cause','Meu critério separa observação de causa e de informação sem confirmação?')+'<p>Marque apenas o que você mesmo conferiu.</p></section>','Guardar meu critério')}
${stage(1,'Qual mudança você testaria no comunicado? Compare a previsão e o resultado que faria abandonar cada hipótese.',select('hypothesis','Minha hipótese',[['fidelidade','Se eu exigir apoio na fonte para cada afirmação, espero preservar os dados e retirar os excessos. Desisto da hipótese se restar afirmação sem apoio ou se um dado for alterado ou omitido.'],['efeito','Se eu mantiver só os números e atribuir a diferença ao formulário, espero explicar o resultado. Desisto se as medianas ou os grupos divergirem da fonte.'],['opiniao','Se eu retirar a data de adoção, espero resolver todas as afirmações sem apoio. Desisto se ainda houver uma data de adoção no comunicado.']]),'Registrar hipótese')}
${stage(2,'Você recebeu este comunicado e vai começar a revisão. Qual registro permitirá conferir depois o que aconteceu nesta tentativa?',`<h4>Pedido usado</h4><blockquote class="lr-request">${esc(SIMULATION_REQUEST)}</blockquote><p>A resposta é a candidata de quatro frases acima. O pedido é adequado, mas a candidata pode descumpri-lo: é isso que você vai conferir.</p>${select('archive-choice','Qual registro você guardará antes de avaliar?', [['corrigida','Pedido e fonte com a candidata já corrigida nos pontos que parecem óbvios.'],['substituir','Pedido e fonte com a nova versão substituindo a candidata anterior.'],['intacta','Pedido exato, fonte e candidata intacta, em registro separado da futura correção.']])}`,'Registrar minha escolha')}
${stage(3,'Sustentada: a fonte apoia a frase. Não sustentada: a fonte trata do assunto, mas não permite afirmar isso. Não verificada: a fonte não trata do assunto e falta consultar outro documento. Ausência de confirmação não prova falsidade.',CLAIMS.map((c,i)=>`<details class="lr-claim" data-lr-claim="${i}" open><summary><span data-lr-summary="${i}">Frase ${i+1}</span><span class="lr-claim-summary-text"> · ${esc(c.text)}</span></summary><p class="lr-claim-original">${esc(c.text)}</p><div class="lr-claim-fields">${select(`verdict-${i}`,'Classificação',[['sustentada','Sustentada'],['nao-sustentada','Não sustentada'],['nao-verificada','Não verificada']])}${select(`source-${i}`,'Trecho da fonte',[...SOURCE.map((_,j)=>[String(j+1),`Frase ${j+1}`]),['nenhuma','Nenhuma frase do registro trata disso']])}</div><p class="lr-detail" data-lr-finding="${i}"></p></details>`).join(''),'Conferir meus achados')}
${stage(4,'Escolha a correção completa e justifique. Volte à fonte para conferir também o que precisava permanecer igual.',select('correction','Versão corrigida',CORRECTIONS.map((s,i)=>[String(i),s]))+select('reason','Por que esta correção atende aos critérios do caso?',[['limites','Mantém os dados e deixa explícitos os limites de causa e de adoção.'],['diferenca','Permite destacar a diferença de 3 minutos entre as medianas.'],['data','Organiza os resultados e as ressalvas em uma sequência fácil de ler.']]),'Conferir correção e motivo')}
${stage(5,'Há mais de uma saída legítima. Indique qual questão você está encerrando e por quê. A coerência conferida aqui é entre alternativas, não uma avaliação do seu texto livre.',select('decision','Minha decisão',[['comunicar','Comunicar somente os resultados observados e seus limites.'],['inconclusivo','Encerrar como inconclusiva a questão indicada no motivo.'],['decisao-necessaria','Encaminhar a adoção para decisão de quem tem competência.']])+select('decision-reason','Motivo e limite desta decisão',[['observacao','Os dados permitem descrever a comparação, sem atribuir causa ou autorizar adoção.'],['causa-pendente','Para decidir se o formulário causou o ganho, falta um teste que isole a mudança.'],['data-pendente','Para informar uma data, falta o documento que a confirme.'],['autorizacao','Para adotar o formulário, falta decisão da autoridade responsável.']])+written('decision-note','Minha próxima ação ou ressalva (opcional)','O que vou pedir, conferir ou encaminhar?')+check('responsibility','Distingo minha decisão daquilo que esta fonte ainda não permite concluir.'),'Registrar decisão e limite')}
<p class="lr-feedback" data-lr-feedback role="status" aria-live="polite"></p><div class="lr-controls"><button class="lr-action" type="button" data-lr-resume hidden>Ir à etapa pendente deste exercício</button><button class="lr-action" type="button" data-lr-next hidden>Continuar exercício</button></div><details class="lr-record"><summary>Ações realizadas nesta sessão</summary><p data-lr-criterion></p><ol data-lr-history><li>Nenhuma ação registrada.</li></ol><details data-lr-archive hidden><summary>Pedido e documentos guardados</summary><p data-lr-request></p><h4>Fonte guardada</h4><ol data-lr-source></ol><h4>Candidata intacta guardada</h4><ol data-lr-candidate></ol></details><p data-lr-corrected></p><p data-lr-decision></p><p>Fechar e reabrir a atividade preserva o progresso; recarregar a página reinicia.</p></details><noscript><p>Sem JavaScript, escreva seu critério, copie o pedido e a candidata, compare a fonte e responda às seis etapas em papel.</p></noscript></section>`;
}

/** Pass the data-learning-root element OR a container that contains it. */
export function mountLearning(container, { chapterIndex = 0, onNavigate } = {}) {
  const root = container.matches('[data-learning-root]') ? container : container.querySelector('[data-learning-root]');
  if (!root) throw new Error('Learning markup is missing');
  if (root.learningController) return root.learningController;
  let state = createLearningState(), current = 0;
  const $ = selector => root.querySelector(selector);
  const feedback = $('[data-lr-feedback]');
  const get = name => root.querySelector(name === 'correction' ? '[name="correction"]:checked' : `[name="${name}"]`)?.value || '';
  const checked = name => !!root.querySelector(`[name="${name}"]`)?.checked;
  function draw() {
    root.classList.add('lr-mounted');
    root.querySelectorAll('[data-lr-stage]').forEach(el => { el.hidden = Number(el.dataset.lrStage) !== current; });
    const pending = state.completed.length;
    $('[data-lr-progress]').textContent = pending === 6 ? 'Percurso registrado: fonte, candidata, achados, correção e decisão.' : `${STAGES[current]} · Próxima ação: ${STAGES[pending]}.`;
    root.querySelectorAll('[data-lr-submit]').forEach(button => { button.disabled = Number(button.dataset.lrSubmit) !== pending; });
    $('[data-lr-resume]').hidden = pending === 6 || current === pending;
    $('[data-lr-next]').hidden = pending === 6 || !state.completed.includes(current);
    $('[data-lr-history]').innerHTML = state.history.length ? state.history.map(h=>`<li><strong>${esc(h.stage)}:</strong> ${esc(h.action)}</li>`).join('') : '<li>Nenhuma ação registrada.</li>';
    $('[data-lr-corrected]').textContent = state.correctedText ? `Versão que você conferiu: ${state.correctedText}` : '';
    $('[data-lr-criterion]').textContent = state.criterion ? `Seu critério: ${state.criterion}` : '';
    root.querySelector('[name="criterion"]').readOnly = state.completed.includes(0);
    $('[data-lr-self-review]').hidden = false;
    $('[data-lr-criterion-comparison]').textContent = state.criterion ? `Seu critério: ${state.criterion}` : 'Compare o modelo com seu texto antes de guardar.';
    $('[data-lr-next]').textContent = `Ir ao capítulo ${String(pending+1).padStart(2,'0')} · ${STAGES[pending] || 'Encerrar'}`;
    $('[data-lr-archive]').hidden = !state.execution;
    if (state.execution) {
      $('[data-lr-request]').textContent = state.execution.request;
      for (const [key,selector] of [['source','[data-lr-source]'],['candidate','[data-lr-candidate]']]) $(selector).innerHTML = state.execution[key].map(t=>`<li>${esc(t)}</li>`).join('');
    }
    const label = (name,value) => root.querySelector(`[name="${name}"] option[value="${value}"]`)?.textContent || '';
    $('[data-lr-decision]').textContent = state.decision ? `Decisão: ${label('decision',state.decision)} Motivo: ${label('decision-reason',state.decisionReason)} Sua ressalva: ${state.decisionNote || 'Não registrada.'}` : '';
  }
  function updateChapter(index) { current = Math.max(0, Math.min(5, Number.isFinite(index) ? Math.floor(index) : 0)); feedback.textContent = ''; draw(); $('[data-lr-documents]').open = current === 0 || current === 3 || current === 4; }
  function handle(event) {
    const button = event.target.closest('button');
    if (!button || !root.contains(button)) return;
    if (button.matches('[data-lr-resume],[data-lr-next]')) {
      updateChapter(state.completed.length);
      if (typeof onNavigate === 'function') onNavigate(current);
      const heading = root.querySelector('.lr-step:not([hidden]) h4');
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
        heading.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
      return;
    }
    if (!button.matches('[data-lr-submit]')) return;
    const action = { stage: Number(button.dataset.lrSubmit), criterion:get('criterion'), selfReview:checked('self-review'), hypothesis: get('hypothesis'), archive:Number(button.dataset.lrSubmit)===2, archiveChoice:get('archive-choice'), answers: CLAIMS.map((_,i)=>({verdict:get(`verdict-${i}`),source:get(`source-${i}`)})), choice:get('correction'),reason:get('reason'),decision:get('decision'),decisionReason:get('decision-reason'),decisionNote:get('decision-note'),responsibility:checked('responsibility') };
    if (action.stage === 3 && state.completed.length === 3) checkClaims(action.answers, (state.claimAttempts || 0) + 1).findings.forEach(f=>{
      $(`[data-lr-finding="${f.index}"]`).textContent = f.message;
      const claim = $(`[data-lr-claim="${f.index}"]`);
      claim.dataset.passed = String(f.passed); claim.open = !f.passed;
      $(`[data-lr-summary="${f.index}"]`).textContent = `Frase ${f.index+1}${f.passed ? ' · Conferido' : ' · Rever'}`;
    });
    const result = applyLearningAction(state, action); state = result.state;
    draw(); feedback.textContent = result.message;
    root.dispatchEvent(new CustomEvent('learning-action', { bubbles:true, detail:{passed:result.passed, stage:action.stage, completed:state.completed.length} }));
    if (result.passed) {
      const next = $('[data-lr-next]');
      if (!next.hidden) next.focus();
      else { feedback.tabIndex = -1; feedback.focus(); }
    }
  }
  function resetFinding(event) {
    const claim = event.target.closest('[data-lr-claim]');
    if (!claim || state.completed.includes(3)) return;
    const index = Number(claim.dataset.lrClaim);
    delete claim.dataset.passed;
    claim.open = true;
    $(`[data-lr-summary="${index}"]`).textContent = `Frase ${index+1} · Alterada, confira novamente`;
    $(`[data-lr-finding="${index}"]`).textContent = '';
  }
  root.addEventListener('change', resetFinding);
  root.addEventListener('click', handle);
  const controller = { updateChapter, getState:()=>structuredClone(state), destroy(){root.removeEventListener('change',resetFinding);root.removeEventListener('click',handle);delete root.learningController;} };
  root.learningController = controller; updateChapter(chapterIndex); return controller;
}

