import test from 'node:test';
import assert from 'node:assert/strict';
import { createLearningState, applyLearningAction, checkClaims, checkCorrection, CORRECTIONS } from '../src/learning/model.js';
import { renderLearningMarkup } from '../src/learning/index.js';
const validAnswers = [{verdict:'sustentada',source:'2'},{verdict:'nao-sustentada',source:'3'},{verdict:'nao-sustentada',source:'4'}];
test('navigation, skipped stages and incomplete criteria do not produce progress',()=>{
 const s=createLearningState();
 for(const action of [{stage:5,decision:'comunicar',responsibility:true},{stage:0,preserve:true,limits:false}]){
  const r=applyLearningAction(s,action);assert.equal(r.passed,false);assert.strictEqual(r.state,s);assert.deepEqual(s.history,[]);
 }
});
test('classification requires evidence for each claim, not just correct verdicts',()=>{
 assert.equal(checkClaims(validAnswers).passed,true);
 for(let i=0;i<3;i++){const a=structuredClone(validAnswers);a[i].source='1';assert.equal(checkClaims(a).passed,false);assert.equal(checkClaims(a).findings[i].passed,false);}
 assert.equal(checkClaims([]).passed,false);
});
test('preserving numbers alone does not repair unsupported causality; correction also requires reason',()=>{
 assert.equal(checkCorrection('1','limites').passed,false);
 assert.equal(checkCorrection('0','ia').passed,false);
 assert.equal(checkCorrection('0','limites').passed,true);
});
test('complete human action sequence records correction and bounded decision without granting production',()=>{
 let s=createLearningState();
 const actions=[{stage:0,preserve:true,limits:true},{stage:1,hypothesis:'fidelidade'},{stage:2,inspect:true},{stage:3,answers:validAnswers},{stage:4,choice:'0',reason:'limites'}];
 for(const a of actions){const r=applyLearningAction(s,a);assert.equal(r.passed,true);s=r.state;}
 assert.equal(s.correctedText,CORRECTIONS[0]);
 assert.equal(applyLearningAction(s,{stage:5,decision:'producao',responsibility:true}).passed,false);
 assert.equal(s.completed.length,5);
 const result=applyLearningAction(s,{stage:5,decision:'comunicar',responsibility:true});assert.equal(result.passed,true);
 assert.equal(result.state.history.length,6);assert.match(result.message,/não autoriza adoção definitiva/);
 assert.equal(applyLearningAction(result.state,{stage:5,decision:'comunicar',responsibility:true}).passed,false);
});
test('static markup contains fictional source, candidate and all six stages without global dialog',()=>{
 const html=renderLearningMarkup();assert.match(html,/INTEIRAMENTE FICTÍCIO/);assert.match(html,/12 minutos/);assert.match(html,/20 de maio/);
 assert.equal((html.match(/data-lr-stage=/g)||[]).length,6);assert.doesNotMatch(html,/<dialog|<script/);assert.match(html,/<noscript>/);
});

