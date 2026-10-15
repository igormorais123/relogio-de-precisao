import {CHAPTERS,FIELDS} from './content.js';
import {sampleStory,assessChoice,exportNotebook} from './story.js';

document.body.classList.add('enhanced');
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),storageKey='inteia-f1-loop-notebook-v1';
const state={values:{},answers:{},chapter:0,reading:reduced.matches};
let frameId=null,loading=null;
let scene,positions=[],dirty=true,activeDialog=null,opener=null,currentLesson=0;
try{const saved=JSON.parse(localStorage.getItem(storageKey)||'{}');for(const [key] of FIELDS)if(typeof saved[key]==='string')state.values[key]=saved[key].slice(0,10000);if(['','aceitar','reverter','revisar','inconclusivo','decisao-necessaria'].includes(saved.decision))state.values.decision=saved.decision;}catch{/* Empty notebook is usable even when browser storage is unavailable. */}
function save(){try{localStorage.setItem(storageKey,JSON.stringify(state.values));$('#storage-state').textContent='Anotações salvas somente neste navegador.';return true;}catch{$('#storage-state').textContent='Este navegador não permitiu salvar. Baixe uma cópia para preservar suas anotações.';if(activeDialog?.id==='lesson-dialog')$('#feedback').textContent='Não foi possível salvar neste navegador. A nota continua nesta sessão: abra Meu registro e baixe uma cópia antes de sair.';return false;}}
function measure(){positions=$$('.chapter').map(s=>s.offsetTop);dirty=true;schedule();}
function progress(){const y=window.scrollY;let i=0;while(i<positions.length-1&&y>=positions[i+1])i++;return i===5?5:i+Math.max(0,Math.min(1,(y-positions[i])/(positions[i+1]-positions[i])));}
function paint(){if(!dirty)return;dirty=false;const p=progress(),pose=sampleStory(p);state.chapter=pose.index;$$('.chapters-nav a').forEach((a,i)=>{if(i===pose.index)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current');});$('#progress-bar').style.transform=`scaleX(${Math.min(1,p/5)})`;$('#scene-label').textContent=['BOX · REFERÊNCIA','BANCADA · HIPÓTESE','TRAÇOS ILUSTRATIVOS · SEM CFD','ENGENHARIA · EVIDÊNCIA','BOX · REVISÃO','DEBRIEF · PRÓXIMA DECISÃO'][pose.index];$('#wipe').style.opacity=state.reading?'0':pose.wipe;scene?.setPose(pose);}
function schedule(){if(frameId===null&&!document.hidden)frameId=requestAnimationFrame(frame);}
function frame(){frameId=null;paint();if(!state.reading)scene?.render();}
function setReading(on){state.reading=on;document.body.classList.toggle('reading',on);$('#reading').setAttribute('aria-pressed',String(on));$('#reading').textContent=on?'Modo cinema':'Modo leitura';$$('.lesson').forEach(d=>d.open=on);measure();if(on){$('#load-state').textContent='Leitura · movimento pausado';paint();}else{if(scene)$('#load-state').textContent='97 peças · modelo didático';else loadScene();schedule();}}
$('#reading').addEventListener('click',()=>{const id=CHAPTERS[state.chapter].id;setReading(!state.reading);document.getElementById(id).scrollIntoView();measure();paint();});
reduced.addEventListener('change',e=>setReading(e.matches));
function openDialog(dialog){opener=document.activeElement;activeDialog=dialog;document.body.classList.add('modal-open');dialog.showModal();}
function closeDialog(dialog){dialog.close();}
$$('dialog').forEach(d=>{d.addEventListener('close',()=>{document.body.classList.remove('modal-open');activeDialog=null;opener?.focus({preventScroll:true});measure();});d.querySelector('[data-close]').onclick=()=>closeDialog(d);});
function openLesson(index){currentLesson=index;const c=CHAPTERS[index];$('#dialog-step').textContent=`0${index+1} / ${c.name}`;$('#dialog-title').textContent=c.title.replaceAll('\n',' ');$('#dialog-body').textContent=c.body;$('#dialog-f1').textContent=c.lesson;$('#dialog-source').textContent=c.sourceName+' ↗';$('#dialog-source').href=c.source;$('#question').textContent=c.question;$('#quick-label').textContent=c.prompt;$('#quick-note').value=state.values[c.field]||'';$('#feedback').textContent='';$('#choices').replaceChildren();c.choices.forEach((choice,i)=>{const b=document.createElement('button');b.type='button';b.textContent=choice;b.setAttribute('aria-pressed','false');b.onclick=()=>{state.answers[c.id]=i;$$('#choices button').forEach((el,n)=>el.setAttribute('aria-pressed',String(n===i)));const result=assessChoice(c,i);$('#feedback').textContent=(result.correct?'Isso. ':'Reveja a decisão. ')+result.message;};$('#choices').append(b);});openDialog($('#lesson-dialog'));}
$$('[data-open]').forEach(b=>b.onclick=()=>openLesson(Number(b.dataset.open)));
$('#quick-note').addEventListener('input',e=>{state.values[CHAPTERS[currentLesson].field]=e.target.value;save();});
$('#save-note').onclick=()=>{state.values[CHAPTERS[currentLesson].field]=$('#quick-note').value;if(save())closeDialog($('#lesson-dialog'));};
$('#notebook').onclick=()=>{for(const [key] of FIELDS)$('#field-'+key).value=state.values[key]||'';$('#decision').value=state.values.decision||'';openDialog($('#notebook-dialog'));};
$('#notebook-form').addEventListener('input',e=>{if(e.target.name){state.values[e.target.name]=e.target.value;save();}});
$('#notebook-form').addEventListener('submit',e=>e.preventDefault());
$('#export').onclick=()=>{const data=exportNotebook(state.values);const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='meu-loop-inteia.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('#prompt').onclick=()=>{const v=k=>state.values[k]?.trim()||'[preencher]';$('#prompt-output').value=`Atue como revisor crítico da minha tarefa. Procure falhas concretas e confira a evidência disponível. Não invente resultados nem aprove pelo estilo do texto.\n\nTarefa: ${v('task')}\nFonte e versão: ${v('reference')}\nCritério e preservações: ${v('criterion')}\nHipótese: ${v('hypothesis')}\nTeste e limite: ${v('test')}\nEvidência já observada: ${v('evidence')}\nCorreção: ${v('correction')}\n\nPara cada crítica, indique o trecho ou teste que a sustenta. Separe observado, inferido e não verificado. Proponha a menor correção útil e como conferir regressões. Se faltar acesso à fonte ou execução, declare inconclusivo e diga o que falta. Não altere os critérios para acomodar a resposta. Termine com a próxima decisão que a evidência permite.`;$('#prompt-wrap').hidden=false;$('#prompt-output').focus();$('#prompt-output').select();};
window.addEventListener('scroll',()=>{dirty=true;schedule();},{passive:true});
window.addEventListener('resize',()=>{measure();scene?.resize();paint();});
window.addEventListener('hashchange',()=>{measure();paint();});
window.addEventListener('pageshow',()=>{measure();paint();});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!state.reading){dirty=true;schedule();}});
async function loadScene(){if(scene||state.reading||loading)return;loading=true;$('#load-state').textContent='Carregando o carro 3D…';try{const {createScene}=await import('./scene.js');scene=await createScene($('#stage'),{onProgress:text=>{$('#load-state').textContent=text;},onError:()=>{setReading(true);$('#load-state').textContent='3D indisponível · aula em modo leitura';}});dirty=true;schedule();$('#load-state').textContent=state.reading?'Leitura · movimento pausado':'97 peças · modelo didático';}catch(e){console.error('F1 Loop: falha na cena',e);setReading(true);$('#load-state').textContent='3D indisponível · aula em modo leitura';}finally{loading=false;}}
document.fonts.ready.then(()=>{measure();if(location.hash){const target=document.getElementById(location.hash.slice(1));target?.scrollIntoView();}paint();});
setReading(state.reading);measure();paint();
