import {monitorTimeline} from './monitor-scene.js';
import {mountLearning} from './learning/index.js';
import {CHAPTERS,FIELDS} from './content.js';
import {sampleStory,assessChoice,exportNotebook} from './story.js';

document.body.classList.add('enhanced');
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
// "Continue" inside the practice opens the next chapter's dialog; the lab already advanced its own stage.
const learningLab = mountLearning($('#lesson-dialog'), {chapterIndex: 0, onNavigate: i=>openLesson(i,true)});
$('#quiz').hidden = true;
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),storageKey='inteia-f1-loop-notebook-v1';
const state={values:{},answers:{},chapter:-1,reading:reduced.matches};
const SCENE_LABELS=['BOX','BANCADA','TÚNEL DE VENTO','ESTAÇÃO DE DADOS','BOX','DEBRIEF'];
const HOTSPOTS=['DEFINIR O PRONTO','UMA MUDANÇA','GUARDAR A VERSÃO','CONFERIR A PROVA','PEÇA REVISADA','REGISTRAR A DECISÃO'];
let frameId=null,loading=null,loadAbort=null,scene=null,positions=[],activeDialog=null,opener=null,currentLesson=0;
let targetP=0,shownP=0,lastTime=performance.now(),lastInput=0,snap=true,pose=sampleStory(0);
try{const saved=JSON.parse(localStorage.getItem(storageKey)||'{}');for(const [key] of FIELDS)if(typeof saved[key]==='string')state.values[key]=saved[key].slice(0,10000);if(['','aceitar','reverter','revisar','inconclusivo','decisao-necessaria'].includes(saved.decision))state.values.decision=saved.decision;}catch{/* Empty notebook is usable even when browser storage is unavailable. */}
function save(){scene?.setNotebook(state.values,FIELDS);try{localStorage.setItem(storageKey,JSON.stringify(state.values));$('#storage-state').textContent='Anotações salvas somente neste navegador.';return true;}catch{$('#storage-state').textContent='Este navegador não permitiu salvar. Baixe uma cópia para preservar suas anotações.';if(activeDialog?.id==='lesson-dialog')$('#feedback').textContent='Não foi possível salvar neste navegador. A nota continua nesta sessão: abra Meu registro e baixe uma cópia antes de sair.';return false;}}

// Titles become per-letter spans for the reveal/dissolve; the heading keeps its text for assistive tech.
for(const h of $$('.chapter h1, .chapter h2')){
 const lines=h.innerHTML.split(/<br\s*\/?>/i).map(html=>{const d=document.createElement('div');d.innerHTML=html;return d.textContent.trim();});
 h.setAttribute('aria-label',lines.join(' '));let i=0;
 h.replaceChildren(...lines.map(line=>{const row=document.createElement('span');row.className='t-line';row.setAttribute('aria-hidden','true');
  line.split(' ').forEach((word,w)=>{const box=document.createElement('span');box.className='t-word';for(const ch of word){const c=document.createElement('span');c.className='t-char';c.textContent=ch;c.style.setProperty('--i',i);c.style.setProperty('--r',((i*7919)%13/12).toFixed(2));i++;box.append(c);}if(w)row.append(' ');row.append(box);});return row;}));
 h.style.setProperty('--n',i);
}

function measure(){positions=$$('.chapter').map(s=>s.offsetTop);schedule();}
function monitorState(){const el=$('#analise-no-box');return monitorTimeline(scrollY,el.offsetTop,el.offsetHeight);}
function progress(){const y=window.scrollY;let i=0;while(i<positions.length-1&&y>=positions[i+1])i++;
 if(!state.reading&&i===3){const top=$('#analise-no-box').offsetTop;return y<top?3+.64*Math.max(0,(y-positions[3])/(top-positions[3])):monitorState().story;}
 return i===5?5:i+Math.max(0,Math.min(1,(y-positions[i])/(positions[i+1]-positions[i])));}
function goMonitor(beat){const el=$('#analise-no-box');if(beat>2){$('#corrigir').scrollIntoView();return;}if(beat<0){$('#avaliar').scrollIntoView();return;}window.scrollTo({top:el.offsetTop+el.offsetHeight*(1/6+(beat+.35)*2/9),behavior:'instant'});snap=true;schedule();}
$('[data-monitor-prev]').onclick=()=>goMonitor(monitorState().beat-1);
$('[data-monitor-next]').onclick=()=>goMonitor(monitorState().beat+1);
// Copy reads during the drift and dissolves before the camera travels (R7).
function paintCopy(){
 const vh=innerHeight,narrow=innerWidth<761;let shown=0;
 $$('.chapter').forEach((s,i)=>{const r=s.getBoundingClientRect();if(r.bottom<-vh*.5||r.top>vh*1.3)return;
  // An opened "what changes in my work" note holds the copy on screen until it is closed.
  // On phones the copy appears only once the chapter is pinned, so it never slides up under the dots and footer.
  const raw=-r.top/Math.max(1,r.height-vh),enter=i===0?1:(i===2||i===3)?(narrow?smooth((raw-.03)/.06):smooth((raw-.03)/.25)):narrow?smooth((raw+.03)/.03):smooth((raw+.34)/.3),leave=i===5||s.querySelector('.lesson[open]')?0:smooth((raw-.74)/.18);
  s.style.setProperty('--in',enter.toFixed(3));s.style.setProperty('--out',leave.toFixed(3));
  s.classList.toggle('dissolving',leave>.001);s.classList.toggle('copy-off',enter*(1-leave)<.04);shown=Math.max(shown,enter*(1-leave));});
 // Between reading windows the camera travels: the chapter dots recede so they never sit on the hero.
 document.body.classList.toggle('travel',shown<.15);
}
function paint(){
 const p=targetP,index=Math.min(5,Math.floor(p)),local=p-index;
 if(index!==state.chapter){state.chapter=index;if(!state.reading)$$('.lesson[open]').forEach(d=>d.open=false);document.body.dataset.chapter=String(index);$$('.chapters-nav a').forEach((a,i)=>{if(i===index)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current');});$('#scene-label').textContent=SCENE_LABELS[index];}
 document.body.classList.toggle('arriving',index>0&&index<5&&local<.16);
 $('#progress-bar').style.transform=`scaleX(${Math.min(1,p/5)})`;
 if(!state.reading)paintCopy();
}
function placeHotspot(){
 const hs=$('#hotspot');if(!scene||state.reading||innerWidth<761){hs.classList.add('off');return;}
 const i=pose.index,a=scene.anchor(i),inWindow=i===5?(shownP>4.995?1:0):smooth((pose.local-.07)/.08)*(1-smooth((pose.local-.36)/.08));
 const vis=a.ok&&!activeDialog?inWindow:0;
 if(hs.dataset.index!==String(i)){hs.dataset.index=String(i);$('#hotspot-label').textContent=HOTSPOTS[i];}
 // The disc floats in free air beside the part (up-left unless that enters the text column), tied to it by a leader line.
 const dx=a.x-120<innerWidth*.46?120:-120,dy=a.y-110<90?90:-90;
 hs.style.setProperty('--len',(Math.hypot(dx,dy)-46).toFixed(1)+'px');hs.style.setProperty('--ang',Math.atan2(-dy,-dx).toFixed(3)+'rad');
 hs.style.transform=`translate3d(${(a.x+dx).toFixed(1)}px,${(a.y+dy).toFixed(1)}px,0) scale(${(.86+.14*vis).toFixed(3)})`;hs.style.opacity=vis.toFixed(3);hs.classList.toggle('off',vis<.05);
}
function schedule(){if(frameId===null&&!document.hidden)frameId=requestAnimationFrame(frame);}
function frame(now){
 frameId=null;
 if(document.body.classList.contains('engine-open'))return;
 targetP=progress();
 // At rest (camera settled, no pointer for 1.5 s) the ambient motion runs at ~30 fps to spare the GPU.
 const idle=scene&&!state.reading&&shownP===targetP&&!snap&&now-lastInput>1500;
 if(idle&&now-lastTime<32){schedule();return;}
 const dt=Math.min(.05,Math.max(0,(now-lastTime)/1000));lastTime=now;
 // The camera trails the scroll with a damped follow: inertia without hijacking the page.
 if(snap||reduced.matches){shownP=targetP;snap=false;}else{shownP+=(targetP-shownP)*(1-Math.exp(-dt*5));if(Math.abs(targetP-shownP)<1e-4)shownP=targetP;}
 paint();
 if(state.reading||!scene)return;
 const monitor=monitorState();document.body.classList.toggle('monitor-focused',monitor.active);
 const label=`${monitor.beat+1} / 3 · ${['Observação','Comparação','Conclusão'][monitor.beat]}`;
 if($('#monitor-page').textContent!==label)$('#monitor-page').textContent=label;
 $('[data-monitor-next]').textContent=monitor.beat===2?'Seguir para Corrigir →':'Próxima →';
 pose=sampleStory(shownP);pose.monitorScene=monitor.active?monitor.weight:0;pose.monitorReading=monitor.active?monitor.reading:null;const place=monitor.active?'ANÁLISE NO BOX':pose.track>.5?'PISTA':SCENE_LABELS[pose.index];if($('#scene-label').textContent!==place)$('#scene-label').textContent=place;scene.setPose(pose);scene.render(dt,now/1000,idle?1000/30:1000/60);placeHotspot();
 schedule();
}
function setReading(on){state.reading=on;document.body.classList.remove('monitor-focused');document.body.classList.toggle('reading',on);$('#reading').setAttribute('aria-pressed',String(on));$('#reading').textContent=on?'Modo cinema':'Modo leitura';$$('.lesson').forEach(d=>d.open=on);$$('.chapter').forEach(s=>{s.style.removeProperty('--in');s.style.removeProperty('--out');s.classList.remove('copy-off','dissolving');});measure();if(on){$('#load-state').textContent='Leitura · movimento pausado';$('#hotspot').classList.add('off');paint();}else{if(scene)$('#load-state').textContent='';else loadScene();snap=true;schedule();}}
$('#reading').addEventListener('click',()=>{const id=CHAPTERS[state.chapter].id;setReading(!state.reading);document.getElementById(id).scrollIntoView();measure();snap=true;paint();});
$('#preload-read').addEventListener('click',()=>{if(loading)loadAbort?.abort();setReading(true);document.body.classList.add('scene-ready');const h=$('#title-preparar');h.tabIndex=-1;h.focus({preventScroll:true});});
reduced.addEventListener('change',e=>setReading(e.matches));
function openDialog(dialog){if(dialog.open)return;opener=document.activeElement;activeDialog=dialog;document.body.classList.add('modal-open');dialog.showModal();}
function closeDialog(dialog){dialog.close();}
$$('dialog').forEach(d=>{d.addEventListener('close',()=>{document.body.classList.remove('modal-open');activeDialog=null;opener?.focus({preventScroll:true});measure();});d.querySelector('[data-close]').onclick=()=>closeDialog(d);});
function openLesson(index,fromLab){if(fromLab)document.getElementById(CHAPTERS[index].id).scrollIntoView();else learningLab.updateChapter(index);currentLesson=index;const c=CHAPTERS[index];$('#dialog-step').textContent=`0${index+1} / ${c.name}`;$('#dialog-title').textContent=c.title.replaceAll('\n',' ');$('#dialog-body').textContent=c.body;$('#dialog-f1').textContent=c.lesson;$('#dialog-source').textContent=c.sourceName+' ↗';$('#dialog-source').href=c.source;$('#question').textContent=c.question;$('#quick-label').textContent=c.prompt;$('#dialog-example').hidden=!c.example||!learningLab.getState().completed.includes(index);$('#dialog-example').textContent=c.example||'';$('#quick-note').value=state.values[c.field]||'';$('#feedback').textContent='';$('#choices').replaceChildren();
 const choose=i=>{state.answers[c.id]=i;$$('#choices button').forEach((el,n)=>el.setAttribute('aria-pressed',String(n===i)));const result=assessChoice(c,i);$('#feedback').textContent=result.correct?result.message:`Reveja a decisão. A alternativa mais sustentada é “${c.choices[c.correct]}”. ${result.message}`;};
 c.choices.forEach((choice,i)=>{const b=document.createElement('button');b.type='button';b.textContent=choice;b.setAttribute('aria-pressed','false');b.onclick=()=>choose(i);$('#choices').append(b);});
 if(state.answers[c.id]!==undefined)choose(state.answers[c.id]);
 // Task, source and decision are asked inside the path, not only in the notebook.
 $('#extra-fields').replaceChildren(...(c.extra||[]).map(key=>{const label=document.createElement('label'),span=document.createElement('span');label.className='field';label.htmlFor='extra-'+key;
  let input;if(key==='decision'){span.textContent='Decisão na minha tarefa real';input=$('#decision').cloneNode(true);input.removeAttribute('name');input.value=state.values.decision||'';input.onchange=()=>{state.values.decision=input.value;save();};}
  else{const [,text,hint]=FIELDS.find(f=>f[0]===key);span.textContent=text;input=document.createElement('textarea');input.rows=2;input.maxLength=10000;input.placeholder=hint;input.value=state.values[key]||'';input.oninput=()=>{state.values[key]=input.value;save();};}
  input.id='extra-'+key;label.append(span,input);return label;}));
 openDialog($('#lesson-dialog'));}
$$('[data-open]').forEach(b=>b.onclick=()=>openLesson(Number(b.dataset.open)));
// The worked example is a model answer: it appears only after the student completes this chapter's practice step.
$('#lesson-dialog').addEventListener('learning-action',()=>{$('#dialog-example').hidden=!CHAPTERS[currentLesson].example||!learningLab.getState().completed.includes(currentLesson);});
$$('.lesson-close').forEach(b=>b.onclick=()=>{b.closest('details').open=false;});
$('#hotspot').onclick=()=>{const index=Number($('#hotspot').dataset.index||0);if(index===3){$('#notebook').click();$('#field-evidence').focus();$('#field-evidence').scrollIntoView({block:'center'});}else openLesson(index);};
$('#quick-note').addEventListener('input',e=>{state.values[CHAPTERS[currentLesson].field]=e.target.value;save();});
$('#save-note').onclick=()=>{state.values[CHAPTERS[currentLesson].field]=$('#quick-note').value;if(save())closeDialog($('#lesson-dialog'));};
$('#notebook').onclick=()=>{for(const [key] of FIELDS)$('#field-'+key).value=state.values[key]||'';$('#decision').value=state.values.decision||'';openDialog($('#notebook-dialog'));};
$('#notebook-form').addEventListener('input',e=>{if(e.target.name){state.values[e.target.name]=e.target.value;save();}});
$('#notebook-form').addEventListener('submit',e=>e.preventDefault());
$('#export').onclick=()=>{const data=exportNotebook(state.values);const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='meu-loop-inteia.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('#prompt').onclick=()=>{const v=k=>state.values[k]?.trim()||'[preencher]',decision=state.values.decision?$('#decision').querySelector(`option[value="${state.values.decision}"]`).textContent:'[ainda não decidi]';$('#prompt-output').value=`Atue como revisor crítico da minha tarefa. Procure falhas concretas e confira a evidência disponível. Não invente resultados nem aprove pelo estilo do texto.\n\nTarefa: ${v('task')}\nFonte e versão de referência: ${v('reference')}\nCritério e o que não pode piorar: ${v('criterion')}\nHipótese: ${v('hypothesis')}\nTeste e limite: ${v('test')}\nEvidência já observada: ${v('evidence')}\nCorreção feita: ${v('correction')}\nPendências: ${v('next')}\nDecisão provisória: ${decision}\n\nSaída a revisar:\n[cole aqui a versão candidata]\n\nTrecho da fonte para conferência:\n[cole aqui o trecho ou indique onde encontrá-lo]\n\nPara cada crítica, indique o trecho ou teste que a sustenta. Separe observado, inferido e não verificado. Se houver falha demonstrada, proponha a menor correção útil e como conferir regressões; se não encontrar falha, diga o que verificou e o que ficou sem verificar, sem inventar problema. Se faltar acesso à fonte ou execução, declare inconclusivo e diga o que falta. Não altere os critérios para acomodar a resposta. Termine com a próxima decisão que a evidência permite.`;$('#prompt-wrap').hidden=false;$('#prompt-output').focus();$('#prompt-output').select();};
window.addEventListener('scroll',()=>{schedule();},{passive:true});
window.addEventListener('resize',()=>{measure();scene?.resize();snap=true;schedule();});
window.addEventListener('hashchange',()=>{measure();snap=true;schedule();});
window.addEventListener('pageshow',()=>{measure();schedule();});
window.addEventListener('pointermove',e=>{lastInput=performance.now();scene?.setPointer(e.clientX/innerWidth*2-1,e.clientY/innerHeight*2-1);},{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){lastTime=performance.now();schedule();}});
function preload(fraction,text){$('#preloader').style.setProperty('--f',fraction.toFixed(3));$('#preload-pct').textContent=String(Math.round(fraction*100)).padStart(2,'0');if(text)$('#preload-text').textContent=text;}
async function loadScene(){if(scene||state.reading||loading)return;loading=true;loadAbort=new AbortController();const signal=loadAbort.signal;$('#load-state').textContent='Carregando o carro 3D…';try{const {createScene}=await import('./scene.js');scene=await createScene($('#stage'),{signal,onProgress:(f,text)=>{preload(f,text);if(!state.reading)$('#load-state').textContent=text+'…';},onError:()=>{const id=CHAPTERS[Math.max(0,state.chapter)].id;$('#stage canvas')?.remove();scene=null;setReading(true);document.getElementById(id).scrollIntoView();$('#load-state').textContent='3D indisponível · aula em modo leitura';}});scene.setNotebook(state.values,FIELDS);snap=true;schedule();$('#load-state').textContent=state.reading?'Leitura · movimento pausado':'';requestAnimationFrame(()=>requestAnimationFrame(()=>document.body.classList.add('scene-ready')));}catch(e){scene=null;if(signal.aborted){$('#load-state').textContent='Leitura · movimento pausado';}else{console.error('F1 Loop: falha na cena',e);setReading(true);document.body.classList.add('scene-ready');$('#load-state').textContent='3D indisponível · aula em modo leitura';}}finally{loading=false;if(signal.aborted&&!scene&&!state.reading)loadScene();}}
// Capture hook for visual QA: jump to an absolute story position without damping.
window.__aula={goto(p){measure();const i=Math.min(5,Math.floor(p)),l=p-i,y=i>=5?positions[5]:positions[i]+l*(positions[i+1]-positions[i]);window.scrollTo(0,y);snap=true;schedule();},get ready(){return !!scene&&document.body.classList.contains('scene-ready');}};
document.fonts.ready.then(()=>{measure();if(location.hash){const target=document.getElementById(location.hash.slice(1));target?.scrollIntoView();}snap=true;schedule();});
if(state.reading)document.body.classList.add('scene-ready');
setReading(state.reading);measure();paint();

// Fullscreen inspections suspend this renderer and resume the lesson on return.
window.addEventListener('engine:closed',()=>{lastTime=performance.now();snap=true;schedule();});
const inspectEngineButton=document.getElementById('inspect-engine');
inspectEngineButton?.addEventListener('click',async()=>{inspectEngineButton.disabled=true;try{const {openEngine}=await import('./engine/viewer.js');inspectEngineButton.disabled=false;await openEngine({opener:inspectEngineButton});}catch(error){console.error('Inspeção do motor:',error);}finally{inspectEngineButton.disabled=false;}});
