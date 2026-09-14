import test from 'node:test';
import assert from 'node:assert/strict';
import { createLearningState, applyLearningAction, checkClaims, checkCorrection, checkDecision, CORRECTIONS, SIMULATION_REQUEST, CLAIMS, SOURCE } from '../src/learning/model.js';
import { renderLearningMarkup } from '../src/learning/index.js';
const validAnswers = [{verdict:'sustentada',source:'2'},{verdict:'nao-sustentada',source:'3'},{verdict:'nao-sustentada',source:'4'},{verdict:'nao-verificada',source:'nenhuma'}];
test('navigation, skipped stages and incomplete criteria do not produce progress',()=>{
 const s=createLearningState();
 for(const action of [{stage:5,decision:'comunicar',responsibility:true},{stage:0,criterion:'   ',selfReview:true},{stage:0,criterion:'Manter dados',selfReview:false}]){
  const r=applyLearningAction(s,action);assert.equal(r.passed,false);assert.strictEqual(r.state,s);assert.deepEqual(s.history,[]);
 }
});
test('classification requires evidence for each claim, not just correct verdicts',()=>{
 assert.equal(checkClaims(validAnswers).passed,true);
 for(let i=0;i<4;i++){const a=structuredClone(validAnswers);a[i].source='1';assert.equal(checkClaims(a).passed,false);assert.equal(checkClaims(a).findings[i].passed,false);}
 assert.equal(checkClaims([]).passed,false);
});
test('preserving numbers alone does not repair unsupported causality; correction also requires reason',()=>{
 assert.equal(checkCorrection('1','limites').passed,false);
 assert.equal(checkCorrection('0','data').passed,false);
 assert.equal(checkCorrection('0','limites').passed,true);
});
test('complete human action sequence records correction and bounded decision without granting production',()=>{
 let s=createLearningState();
 const actions=[{stage:0,criterion:'Manter datas e dados da fonte.',selfReview:true},{stage:1,hypothesis:'fidelidade'},{stage:2,archive:true,archiveChoice:'intacta'},{stage:3,answers:validAnswers},{stage:4,choice:'0',reason:'limites'}];
 for(const a of actions){const r=applyLearningAction(s,a);assert.equal(r.passed,true);s=r.state;}
 assert.equal(s.correctedText,CORRECTIONS[0]);
 assert.equal(applyLearningAction(s,{stage:5,decision:'producao',responsibility:true}).passed,false);
 assert.equal(s.completed.length,5);
 const result=applyLearningAction(s,{stage:5,decision:'comunicar',decisionReason:'observacao',responsibility:true});assert.equal(result.passed,true);
 assert.equal(result.state.history.length,6);assert.match(result.message,/Não autoriza adoção definitiva/);
 assert.equal(applyLearningAction(result.state,{stage:5,decision:'comunicar',responsibility:true}).passed,false);
});
test('free criterion is preserved literally without keyword grading or claim of semantic approval',()=>{
 const criterion='  Meu critério próprio <não avaliado>\nsegunda linha  ';
 const result=applyLearningAction(createLearningState(),{stage:0,criterion,selfReview:true});
 assert.equal(result.passed,true);assert.equal(result.state.criterion,criterion);assert.equal(result.state.criterionReview,'not-assessed');assert.match(result.message,/Critério guardado/);
});
test('Execute archives exact simulation request, source and intact candidate only on explicit save action',()=>{
 let s=createLearningState();s=applyLearningAction(s,{stage:0,criterion:'Conferir',selfReview:true}).state;s=applyLearningAction(s,{stage:1,hypothesis:'fidelidade'}).state;
 assert.equal(s.execution,null);assert.equal(applyLearningAction(s,{stage:2,inspect:true}).passed,false);
 s=applyLearningAction(s,{stage:2,archive:true,archiveChoice:'intacta'}).state;assert.equal(s.execution.request,SIMULATION_REQUEST);assert.deepEqual(s.execution.source,SOURCE);assert.deepEqual(s.execution.candidate,CLAIMS.map(c=>c.text));
 assert.notStrictEqual(s.execution.source,SOURCE);assert.equal(s.execution.kind,'prewritten-simulation');
});
test('each claim requires the one classification and source supported by the case',()=>{
 const expected=[['sustentada','2'],['nao-sustentada','3'],['nao-sustentada','4'],['nao-verificada','nenhuma']];
 for(let i=0;i<4;i++) for(const verdict of ['sustentada','nao-sustentada','nao-verificada']) for(const source of ['1','2','3','4','nenhuma']) {
  const answers=structuredClone(validAnswers);answers[i]={verdict,source};
  assert.equal(checkClaims(answers).passed, verdict===expected[i][0]&&source===expected[i][1],`claim ${i+1}: ${verdict}/${source}`);
 }
 assert.match(checkClaims(validAnswers).findings[2].message,/não prova que a data seja falsa/);
});

test('three legitimate outcomes require a coherent scope/reason pair, never a general approval',()=>{
 for(const [decision,reason] of [['comunicar','observacao'],['inconclusivo','causa-pendente'],['inconclusivo','data-pendente'],['decisao-necessaria','autorizacao']]){
  assert.equal(checkDecision(decision,reason,true).passed,true);assert.equal(checkDecision(decision,reason,false).passed,false);
 }
 for(const [decision,reason] of [['comunicar','autorizacao'],['inconclusivo','observacao'],['decisao-necessaria','causa-pendente'],['producao','observacao']]) assert.equal(checkDecision(decision,reason,true).passed,false);
});
test('static markup contains fictional source, candidate and all six stages without global dialog',()=>{
 const html=renderLearningMarkup();assert.match(html,/CASO PARA PRATICAR/);assert.match(html,/12 minutos/);assert.match(html,/20 de maio/);
 assert.equal((html.match(/data-lr-stage=/g)||[]).length,6);assert.doesNotMatch(html,/<dialog|<script/);assert.match(html,/<noscript>/);
});


test('empty hypothesis differs from faulty refutation and archive requires an intact version choice',()=>{
 let s=applyLearningAction(createLearningState(),{stage:0,criterion:'Conferir',selfReview:true}).state;
 assert.match(applyLearningAction(s,{stage:1}).message,/Escolha uma hipótese/);
 for(const hypothesis of ['efeito','opiniao']) assert.equal(applyLearningAction(s,{stage:1,hypothesis}).passed,false);
 s=applyLearningAction(s,{stage:1,hypothesis:'fidelidade'}).state;
 for(const archiveChoice of ['', 'corrigida','substituir']) { const r=applyLearningAction(s,{stage:2,archive:true,archiveChoice});assert.equal(r.passed,false);assert.equal(r.state.execution,null); }
 assert.equal(applyLearningAction(s,{stage:2,archive:true}).passed,false);
});
test('first wrong classification guides without solution; second explains without advancing',()=>{
 let s={...createLearningState(),completed:[0,1,2]};
 const wrong=[{verdict:'nao-verificada',source:'1'},{verdict:'sustentada',source:'1'},{verdict:'sustentada',source:'1'},{verdict:'sustentada',source:'1'}];
 const first=checkClaims(wrong,1);assert.doesNotMatch(first.findings.map(f=>f.message).join(' '),/frase [234]|Não verificada:/);
 let r=applyLearningAction(s,{stage:3,answers:wrong});assert.equal(r.state.claimAttempts,1);assert.equal(r.state.completed.length,3);assert.equal(r.state.history.length,0);
 r=applyLearningAction(r.state,{stage:3,answers:wrong});assert.equal(r.state.claimAttempts,2);assert.equal(r.state.completed.length,3);
 assert.match(checkClaims(wrong,2).findings[1].message,/frase 3/);
 assert.match(checkClaims(validAnswers,1).findings[0].message,/frase 2/);
});

test('training needs missing capacity record; unsupported date and unverified training remain distinct',()=>{
 const answers=structuredClone(validAnswers);answers[2].verdict='nao-sustentada';assert.equal(checkClaims(answers).passed,true);
 answers[3].verdict='nao-sustentada';assert.equal(checkClaims(answers).passed,false);
 assert.equal(CLAIMS.length,4);assert.match(CLAIMS[3].text,/recebeu treinamento/);assert.doesNotMatch(CORRECTIONS[0],/recebeu treinamento/);
 const html=renderLearningMarkup();assert.match(html,/quatro frases/);assert.match(html,/Nenhuma frase do registro trata disso/);assert.match(html,/data-lr-documents open/);assert.match(html,/Critério-modelo/);assert.equal((html.match(/name="review-/g)||[]).length,3);
});

test('static preparation offers the model before save and evaluation keeps four expandable claims',()=>{
 const html=renderLearningMarkup();
 assert.ok(html.indexOf('Critério-modelo:')<html.indexOf('Guardar meu critério'));
 assert.doesNotMatch(html,/dois eixos|ambos os rótulos|aceitamos dois/i);
 assert.match(html,/a fonte trata do assunto, mas não permite afirmar isso/);
 assert.match(html,/a fonte não trata do assunto e falta consultar outro documento/);
 assert.equal((html.match(/data-lr-claim="[0-3]" open/g)||[]).length,4);
 assert.match(html,/>Registrar minha escolha<\/button>/);
});
