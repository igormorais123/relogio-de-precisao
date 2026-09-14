import {CHAPTERS,FIELDS} from './content.js';
import {sampleStory,assessChoice,exportNotebook} from './story.js';

document.body.classList.add('enhanced');
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),storageKey='inteia-f1-loop-notebook-v1';
const state={values:{},answers:{},chapter:-1,reading:reduced.matches};
const SCENE_LABELS=['BOX · REFERÊNCIA','BANCADA · UMA MUDANÇA POR VEZ','TÚNEL · VISUALIZAÇÃO DIDÁTICA, NÃO É CFD','ESTAÇÃO · REGISTRO DO ALUNO','BOX · PEÇA REVISADA (ILUSTRAÇÃO)','DEBRIEF · PRÓXIMA DECISÃO'];
const HOTSPOTS=['DEFINIR O PRONTO','UMA MUDANÇA','GUARDAR A VERSÃO','CONFERIR A PROVA','PEÇA REVISADA','REGISTRAR A DECISÃO'];
let frameId=null,loading=null,scene=null,positions=[],activeDialog=null,opener=null,currentLesson=0;
let targetP=0,shownP=0,lastTime=performance.now(),snap=true,pose=sampleStory(0);
try{const saved=JSON.parse(localStorage.getItem(storageKey)||'{}');for(const [key] of FIELDS)if(typeof saved[key]==='string')state.values[key]=saved[key].slice(0,10000);if(['','aceitar','reverter','revisar','inconclusivo','decisao-necessaria'].includes(saved.decision))state.values.decision=saved.decision;}catch{/* Empty notebook is usable even when browser storage is unavailable. */}
function save(){scene?.setNotebook(state.values,FIELDS);try{localStorage.setItem(storageKey,JSON.stringify(state.values));$('#storage-state').textContent='Anotações salvas somente neste navegador.';return true;}catch{$('#storage-state').textContent='Este navegador não permitiu salvar. Baixe uma cópia para preservar suas anotações.';if(activeDialog?.id==='lesson-dialog')$('#feedback').textContent='Não foi possível salvar neste navegador. A nota continua nesta sessão: abra Meu registro e baixe uma cópia antes de sair.';return false;}}

// Titles become per-letter spans for the reveal/dissolve; the heading keeps its text for assistive tech.
for(const h of $$('.chapter h1, .chapter h2')){
 const lines=h.innerHTML.split(/<br\s*\/?>/i).map(html=>{const d=document.createElement('div');d.innerHTML=html;return d.textContent.trim();});
 h.setAttribute('aria-label',lines.join(' '));let i=0;
 h.replaceChildren(...lines.map(line=>{const row=document.createElement('span');row.className='t-line';row.setAttribute('aria-hidden','true');
  line.split(' ').forEach((word,w)=>{const box=document.createElement('span');box.className='t-word';for(const ch of word){const c=document.createElement('span');c.className='t-char';c.textContent=ch;c.style.setProperty('--i',i);c.style.setProperty('--r',((i*7919)%13/12).toFixed(2));i++;box.append(c);}if(w)row.append(' ');row.append(box);});return row;}));
}

function measure(){positions=$$('.chapter').map(s=>s.offsetTop);schedule();}
function progress(){const y=window.scrollY;let i=0;while(i<positions.length-1&&y>=positions[i+1])i++;return i===5?5:i+Math.max(0,Math.min(1,(y-positions[i])/(positions[i+1]-positions[i])));}
// Copy reads during the drift and dissolves before the camera travels (R7).
function paintCopy(){
 const vh=innerHeight;
 $$('.chapter').forEach((s,i)=>{const r=s.getBoundingClientRect();if(r.bottom<-vh*.5||r.top>vh*1.3)return;
  const raw=-r.top/Math.max(1,r.height-vh),enter=i===0?1:smooth((raw+.34)/.3),leave=i===5?0:smooth((raw-.7)/.25);
  s.style.setProperty('--in',enter.toFixed(3));s.style.setProperty('--out',leave.toFixed(3));
  s.classList.toggle('dissolving',leave>.001);s.classList.toggle('copy-off',enter*(1-leave)<.04);});
}
function paint(){
 const p=targetP,index=Math.min(5,Math.floor(p)),local=p-index;
 if(index!==state.chapter){state.chapter=index;document.body.dataset.chapter=String(index);$$('.chapters-nav a').forEach((a,i)=>{if(i===index)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current');});$('#scene-label').textContent=SCENE_LABELS[index];}
 document.body.classList.toggle('arriving',index>0&&index<5&&local<.16);
 $('#progress-bar').style.transform=`scaleX(${Math.min(1,p/5)})`;
 if(!state.reading)paintCopy();
}
function placeHotspot(){
 const hs=$('#hotspot');if(!scene||state.reading||innerWidth<761){hs.classList.add('off');return;}
 const i=pose.index,a=scene.anchor(i),inWindow=i===5?(shownP>4.995?1:0):smooth((pose.local-.07)/.08)*(1-smooth((pose.local-.36)/.08));
 const vis=a.ok&&!activeDialog?inWindow:0;
 if(hs.dataset.index!==String(i)){hs.dataset.index=String(i);$('#hotspot-label').textContent=HOTSPOTS[i];}
 hs.style.transform=`translate3d(${a.x.toFixed(1)}px,${a.y.toFixed(1)}px,0) scale(${(.86+.14*vis).toFixed(3)})`;hs.style.opacity=vis.toFixed(3);hs.classList.toggle('off',vis<.05);
}
function schedule(){if(frameId===null&&!document.hidden)frameId=requestAnimationFrame(frame);}
function frame(now){
 frameId=null;const dt=Math.min(.05,Math.max(0,(now-lastTime)/1000));lastTime=now;
 targetP=progress();
 // The camera trails the scroll with a damped follow: inertia without hijacking the page.
 if(snap||reduced.matches){shownP=targetP;snap=false;}else{shownP+=(targetP-shownP)*(1-Math.exp(-dt*5));if(Math.abs(targetP-shownP)<1e-4)shownP=targetP;}
 paint();
 if(state.reading||!scene)return;
 pose=sampleStory(shownP);scene.setPose(pose);scene.render(dt,now/1000);placeHotspot();
 schedule();
}
function setReading(on){state.reading=on;document.body.classList.toggle('reading',on);$('#reading').setAttribute('aria-pressed',String(on));$('#reading').textContent=on?'Modo cinema':'Modo leitura';$$('.lesson').forEach(d=>d.open=on);$$('.chapter').forEach(s=>{s.style.removeProperty('--in');s.style.removeProperty('--out');s.classList.remove('copy-off','dissolving');});measure();if(on){$('#load-state').textContent='Leitura · movimento pausado';$('#hotspot').classList.add('off');paint();}else{if(scene)$('#load-state').textContent='97 peças · modelo didático';else loadScene();snap=true;schedule();}}
$('#reading').addEventListener('click',()=>{const id=CHAPTERS[state.chapter].id;setReading(!state.reading);document.getElementById(id).scrollIntoView();measure();snap=true;paint();});
$('#preload-read').addEventListener('click',()=>{setReading(true);document.body.classList.add('scene-ready');});
reduced.addEventListener('change',e=>setReading(e.matches));
function openDialog(dialog){opener=document.activeElement;activeDialog=dialog;document.body.classList.add('modal-open');dialog.showModal();}
function closeDialog(dialog){dialog.close();}
$$('dialog').forEach(d=>{d.addEventListener('close',()=>{document.body.classList.remove('modal-open');activeDialog=null;opener?.focus({preventScroll:true});measure();});d.querySelector('[data-close]').onclick=()=>closeDialog(d);});
function openLesson(index){currentLesson=index;const c=CHAPTERS[index];$('#dialog-step').textContent=`0${index+1} / ${c.name}`;$('#dialog-title').textContent=c.title.replaceAll('\n',' ');$('#dialog-body').textContent=c.body;$('#dialog-f1').textContent=c.lesson;$('#dialog-source').textContent=c.sourceName+' ↗';$('#dialog-source').href=c.source;$('#question').textContent=c.question;$('#quick-label').textContent=c.prompt;$('#quick-note').value=state.values[c.field]||'';$('#feedback').textContent='';$('#choices').replaceChildren();c.choices.forEach((choice,i)=>{const b=document.createElement('button');b.type='button';b.textContent=choice;b.setAttribute('aria-pressed','false');b.onclick=()=>{state.answers[c.id]=i;$$('#choices button').forEach((el,n)=>el.setAttribute('aria-pressed',String(n===i)));const result=assessChoice(c,i);$('#feedback').textContent=(result.correct?'Isso. ':'Reveja a decisão. ')+result.message;};$('#choices').append(b);});openDialog($('#lesson-dialog'));}
$$('[data-open]').forEach(b=>b.onclick=()=>openLesson(Number(b.dataset.open)));
$('#hotspot').onclick=()=>openLesson(Number($('#hotspot').dataset.index||0));
$('#quick-note').addEventListener('input',e=>{state.values[CHAPTERS[currentLesson].field]=e.target.value;save();});
$('#save-note').onclick=()=>{state.values[CHAPTERS[currentLesson].field]=$('#quick-note').value;if(save())closeDialog($('#lesson-dialog'));};
$('#notebook').onclick=()=>{for(const [key] of FIELDS)$('#field-'+key).value=state.values[key]||'';$('#decision').value=state.values.decision||'';openDialog($('#notebook-dialog'));};
$('#notebook-form').addEventListener('input',e=>{if(e.target.name){state.values[e.target.name]=e.target.value;save();}});
$('#notebook-form').addEventListener('submit',e=>e.preventDefault());
$('#export').onclick=()=>{const data=exportNotebook(state.values);const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='meu-loop-inteia.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('#prompt').onclick=()=>{const v=k=>state.values[k]?.trim()||'[preencher]';$('#prompt-output').value=`Atue como revisor crítico da minha tarefa. Procure falhas concretas e confira a evidência disponível. Não invente resultados nem aprove pelo estilo do texto.\n\nTarefa: ${v('task')}\nFonte e versão: ${v('reference')}\nCritério e preservações: ${v('criterion')}\nHipótese: ${v('hypothesis')}\nTeste e limite: ${v('test')}\nEvidência já observada: ${v('evidence')}\nCorreção: ${v('correction')}\n\nPara cada crítica, indique o trecho ou teste que a sustenta. Separe observado, inferido e não verificado. Proponha a menor correção útil e como conferir regressões. Se faltar acesso à fonte ou execução, declare inconclusivo e diga o que falta. Não altere os critérios para acomodar a resposta. Termine com a próxima decisão que a evidência permite.`;$('#prompt-wrap').hidden=false;$('#prompt-output').focus();$('#prompt-output').select();};
window.addEventListener('scroll',()=>{schedule();},{passive:true});
window.addEventListener('resize',()=>{measure();scene?.resize();snap=true;schedule();});
window.addEventListener('hashchange',()=>{measure();snap=true;schedule();});
window.addEventListener('pageshow',()=>{measure();schedule();});
window.addEventListener('pointermove',e=>{scene?.setPointer(e.clientX/innerWidth*2-1,e.clientY/innerHeight*2-1);},{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){lastTime=performance.now();schedule();}});
function preload(fraction,text){$('#preloader').style.setProperty('--f',fraction.toFixed(3));$('#preload-pct').textContent=String(Math.round(fraction*100)).padStart(2,'0');if(text)$('#preload-text').textContent=text;}
async function loadScene(){if(scene||state.reading||loading)return;loading=true;$('#load-state').textContent='Carregando o carro 3D…';try{const {createScene}=await import('./scene.js');scene=await createScene($('#stage'),{onProgress:(f,text)=>{preload(f,text);$('#load-state').textContent=text+'…';},onError:()=>{setReading(true);$('#load-state').textContent='3D indisponível · aula em modo leitura';}});scene.setNotebook(state.values,FIELDS);snap=true;schedule();$('#load-state').textContent=state.reading?'Leitura · movimento pausado':'97 peças · modelo didático';requestAnimationFrame(()=>requestAnimationFrame(()=>document.body.classList.add('scene-ready')));}catch(e){console.error('F1 Loop: falha na cena',e);setReading(true);document.body.classList.add('scene-ready');$('#load-state').textContent='3D indisponível · aula em modo leitura';}finally{loading=false;}}
// Capture hook for visual QA: jump to an absolute story position without damping.
window.__aula={goto(p){measure();const i=Math.min(5,Math.floor(p)),l=p-i,y=i>=5?positions[5]:positions[i]+l*(positions[i+1]-positions[i]);window.scrollTo(0,y);snap=true;schedule();},get ready(){return !!scene&&document.body.classList.contains('scene-ready');}};
document.fonts.ready.then(()=>{measure();if(location.hash){const target=document.getElementById(location.hash.slice(1));target?.scrollIntoView();}snap=true;schedule();});
if(state.reading)document.body.classList.add('scene-ready');
setReading(state.reading);measure();paint();
