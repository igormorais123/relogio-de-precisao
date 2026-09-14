import { SOURCE, CLAIMS, CORRECTIONS, STAGES, createLearningState, checkClaims, applyLearningAction } from './model.js';
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const option = (value, text) => `<option value="${value}">${esc(text)}</option>`;
const select = (name, text, options) => `<label class="lr-field">${text}<select name="${name}">${option('', 'Escolha após conferir a fonte')}${options.map(([v,t])=>option(v,t)).join('')}</select></label>`;
const check = (name, text) => `<label class="lr-check"><input type="checkbox" name="${name}"><span>${text}</span></label>`;
const stage = (i, text, fields, action) => `<section class="lr-step" data-lr-stage="${i}"><h4>${i+1}. ${STAGES[i]}</h4><p>${text}</p>${fields}<button class="lr-action" type="button" data-lr-submit="${i}">${action}</button></section>`;
/** Static content stays readable without JS. Mount adds one active stage at a time. */
export function renderLearningMarkup() {
  return `<section class="lr-lab" data-learning-root aria-label="Prática de revisão com fonte"><p class="lr-tag">CASO DIDÁTICO · INTEIRAMENTE FICTÍCIO</p><h3>O teste melhorou. O comunicado está correto?</h3><p>Você revisa um comunicado interno sobre um serviço de demonstração. Compare a fonte com a candidata, registre os erros e decida o que o texto permite comunicar.</p><div class="lr-docs"><article><h4>Fonte · registro do teste</h4><ol>${SOURCE.map(s=>`<li>${esc(s)}</li>`).join('')}</ol></article><article><h4>Candidata · ainda sem revisão</h4><ol>${CLAIMS.map(c=>`<li>${esc(c.text)}</li>`).join('')}</ol></article></div><p class="lr-progress" data-lr-progress>O avanço depende das ações do exercício. Não há nota de IA nem aprovação automática.</p>
${stage(0,'Defina o que uma revisão pode mudar sem distorcer o registro.',check('preserve','Preservar a data do teste, as duas medianas e os grupos de 50 consultas.')+check('limits','Separar resultado observado de causa demonstrada e de autorização de produção.'),'Registrar critérios')}
${stage(1,'Escolha uma hipótese sobre a revisão que possa ser conferida na fonte.',select('hypothesis','Minha hipótese',[['fidelidade','Retirar causa e data sem suporte, mantendo os dados, tornará o comunicado fiel.'],['tom','Um tom mais confiante tornará o comunicado verdadeiro.']]),'Registrar hipótese')}
${stage(2,'A candidata acima é a versão de trabalho. Ela permanece visível e intacta durante a revisão.',check('inspect','Li a candidata e iniciei sua comparação com o registro fonte.'),'Iniciar comparação')}
${stage(3,'Para cada frase da candidata, identifique se há suporte e indique a frase da fonte que decide a questão.',CLAIMS.map((c,i)=>`<fieldset class="lr-claim"><legend>${i+1}. ${esc(c.text)}</legend>${select(`verdict-${i}`,'A afirmação é',[['sustentada','Sustentada pela fonte'],['nao-sustentada','Não sustentada pela fonte']])}${select(`source-${i}`,'Base da minha conclusão',SOURCE.map((_,j)=>[String(j+1),`Frase ${j+1} da fonte`]))}<p class="lr-detail" data-lr-finding="${i}"></p></fieldset>`).join(''),'Conferir meus achados')}
${stage(4,'Escolha a correção completa e justifique. Volte à fonte para conferir também o que precisava permanecer igual.',select('correction','Versão corrigida',CORRECTIONS.map((s,i)=>[String(i),s]))+select('reason','Por que esta correção atende aos critérios?',[['limites','Mantém os dados e deixa explícitos os limites de causa e de produção.'],['tom','Parece mais profissional.'],['ia','Se está entre as opções, uma IA já aprovou.']]),'Conferir correção e motivo')}
${stage(5,'Decida o uso da versão corrigida dentro do alcance deste registro.',select('decision','Minha decisão',[['comunicar','Comunicar somente os resultados observados e seus limites.'],['producao','Liberar a candidata para produção.'],['causa','Informar que o cache causou a melhora.']])+check('responsibility','Eu conferi a fonte e assumo esta decisão no exercício; ela não aprova uma tarefa real.'),'Registrar minha decisão')}
<p class="lr-feedback" data-lr-feedback role="status" aria-live="polite"></p><div class="lr-controls"><button class="lr-action" type="button" data-lr-resume hidden>Ir à etapa pendente deste exercício</button><button class="lr-action" type="button" data-lr-next hidden>Continuar exercício</button></div><details class="lr-record"><summary>Ações realizadas nesta sessão</summary><ol data-lr-history><li>Nenhuma ação registrada.</li></ol><p data-lr-corrected></p><p>O exercício fica apenas nesta sessão. Fechar e reabrir a atividade preserva o progresso; recarregar a página reinicia. Não utiliza IA nem envia respostas.</p></details><noscript><p>Sem JavaScript, compare os documentos e responda às seis etapas por escrito. Não há registro automático.</p></noscript></section>`;
}

/** Pass the data-learning-root element OR a container that contains it. */
export function mountLearning(container, { chapterIndex = 0 } = {}) {
  const root = container.matches('[data-learning-root]') ? container : container.querySelector('[data-learning-root]');
  if (!root) throw new Error('Learning markup is missing');
  if (root.learningController) return root.learningController;
  let state = createLearningState(), current = 0;
  const $ = selector => root.querySelector(selector);
  const feedback = $('[data-lr-feedback]');
  const get = name => root.querySelector(`[name="${name}"]`)?.value || '';
  const checked = name => !!root.querySelector(`[name="${name}"]`)?.checked;
  function draw() {
    root.classList.add('lr-mounted');
    root.querySelectorAll('[data-lr-stage]').forEach(el => { el.hidden = Number(el.dataset.lrStage) !== current; });
    const pending = state.completed.length;
    $('[data-lr-progress]').textContent = pending === 6 ? 'Percurso registrado: fonte → candidata → achados → correção → decisão. Sem certificação automática.' : `Etapa exibida: ${STAGES[current]}. Próxima ação pendente: ${STAGES[pending]}. Navegar não registra conclusão.`;
    root.querySelectorAll('[data-lr-submit]').forEach(button => { button.disabled = Number(button.dataset.lrSubmit) !== pending; });
    $('[data-lr-resume]').hidden = pending === 6 || current === pending;
    $('[data-lr-next]').hidden = pending === 6 || !state.completed.includes(current);
    $('[data-lr-history]').innerHTML = state.history.length ? state.history.map(h=>`<li><strong>${esc(h.stage)}:</strong> ${esc(h.action)}</li>`).join('') : '<li>Nenhuma ação registrada.</li>';
    $('[data-lr-corrected]').textContent = state.correctedText ? `Versão que você conferiu: ${state.correctedText}` : '';
  }
  function updateChapter(index) { current = Math.max(0, Math.min(5, Number.isFinite(index) ? Math.floor(index) : 0)); feedback.textContent = ''; draw(); }
  function handle(event) {
    const button = event.target.closest('button');
    if (!button || !root.contains(button)) return;
    if (button.matches('[data-lr-resume],[data-lr-next]')) { updateChapter(state.completed.length); return; }
    if (!button.matches('[data-lr-submit]')) return;
    const action = { stage: Number(button.dataset.lrSubmit), preserve: checked('preserve'), limits: checked('limits'), hypothesis: get('hypothesis'), inspect: checked('inspect'), answers: CLAIMS.map((_,i)=>({verdict:get(`verdict-${i}`),source:get(`source-${i}`)})), choice:get('correction'),reason:get('reason'),decision:get('decision'),responsibility:checked('responsibility') };
    if (action.stage === 3 && state.completed.length === 3) checkClaims(action.answers).findings.forEach(f=>{ $(`[data-lr-finding="${f.index}"]`).textContent = `${f.passed ? 'Conferido.' : 'Reveja sua resposta.'} ${f.message}`; });
    const result = applyLearningAction(state, action); state = result.state;
    draw(); feedback.textContent = result.message;
    root.dispatchEvent(new CustomEvent('learning-action', { bubbles:true, detail:{passed:result.passed, stage:action.stage, completed:state.completed.length} }));
  }
  root.addEventListener('click', handle);
  const controller = { updateChapter, getState:()=>structuredClone(state), destroy(){root.removeEventListener('click',handle);delete root.learningController;} };
  root.learningController = controller; updateChapter(chapterIndex); return controller;
}
