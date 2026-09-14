export const clamp = (v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const smooth=t=>{t=clamp(t);return t*t*(3-2*t);};
const poses=[
 {camera:[6.5,2.6,7.3],target:[0,.55,0],explode:0,world:0},
 {camera:[7.7,4.5,5.5],target:[0,1,0],explode:.78,world:0},
 {camera:[7.7,2,3.9],target:[0,.55,0],explode:0,world:1},
 {camera:[5.7,5.2,-7.8],target:[0,.65,0],explode:0,world:0},
 {camera:[6.8,2.8,6.5],target:[0,.85,0],explode:.45,world:0},
 {camera:[6.5,2.6,7.3],target:[0,.55,0],explode:0,world:0}
];
// Pure, absolute sampling: returning to a scroll position restores the same pose.
export function sampleStory(progress){
 const p=clamp(Number.isFinite(progress)?progress:0,0,5),index=Math.min(5,Math.floor(p)),local=p-index;
 const current=poses[index],next=poses[Math.min(index+1,5)],t=smooth((local-.62)/.38);
 const mix=(a,b)=>a+(b-a)*t;
 return {index,local,camera:current.camera.map((v,i)=>mix(v,next.camera[i])),target:current.target.map((v,i)=>mix(v,next.target[i])),explode:mix(current.explode,next.explode),tunnel:mix(current.world,next.world),wipe:Math.sin(Math.PI*t)*.28};
}
export function assessChoice(chapter,choice){return {correct:choice===chapter.correct,message:chapter.feedback};}
export function exportNotebook(values,now=new Date().toISOString()){
 const safe={};for(const [k,v] of Object.entries(values)){if(typeof v==='string')safe[k]=v;}
 return {...safe,schemaVersion:1,exportedAt:now,origin:'Anotações do aluno; não verificadas automaticamente'};
}
