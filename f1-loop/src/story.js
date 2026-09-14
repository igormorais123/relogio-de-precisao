export const clamp = (v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const smooth=t=>{t=clamp(t);return t*t*(3-2*t);};

// Director's track for one continuous take (R1). Progress p runs 0..5: chapter i
// reads during local 0–0.5 while the camera drifts, then travels during 0.6–1.
// Car coordinates: x ±0.92, y 0–1.1, z −2.55..+2.56, nose at +Z, INTEIA decal on +X.
const CAMERA=[
 // 01 Preparar · box: low three-quarter hero, slow drift.
 [0.00,[5.6,1.35,6.4],[0,.45,.2]],
 [0.50,[6.5,1.7,5.0],[0,.5,0]],
 [0.80,[6.6,3.4,2.0],[0,.7,-.3]],
 // 02 Hipótese · bench: exploded car seen from above, one part isolated.
 [1.00,[5.6,4.7,4.4],[0,.8,-.2]],
 [1.50,[4.4,5.1,5.6],[0,.75,-.5]],
 [1.80,[6.2,1.6,5.2],[0,.5,.3]],
 // 03 Executar · tunnel: low front, then lateral travelling against the airflow.
 [2.00,[4.6,.78,3.8],[0,.45,.6]],
 [2.50,[4.4,.86,-.4],[0,.5,-.6]],
 [2.80,[3.3,1.25,-4.5],[0,.55,-.8]],
 // 04 Avaliar · engineering station: rack focus from the car to the evidence.
 [3.00,[4.6,1.55,3.6],[-4.6,1.45,-1.35]],
 [3.50,[3.8,1.5,2.7],[-4.6,1.45,-1.2]],
 [3.80,[5.6,2.8,1.4],[0,.6,-.2]],
 // 05 Corrigir · back in the box: body lifted, revised floor exposed.
 [4.00,[6.3,.78,2.3],[0,.48,-.3]],
 [4.50,[5.9,.86,-1.3],[0,.44,-.45]],
 [4.80,[6.3,1.2,4.2],[0,.45,.1]],
 // 06 Encerrar · the closing frame answers the opening one.
 [5.00,[5.6,1.35,6.4],[0,.45,.2]]
];
const TRACKS={
 fov:[[0,30],[1,33],[1.8,30],[2,28],[2.8,30],[3,26],[3.5,25],[3.8,30],[5,30]],
 explode:[[0,0],[.55,0],[1,.78],[1.55,.78],[1.85,0],[3.8,0],[4,.45],[4.55,.45],[4.85,0],[5,0]],
 bokeh:[[0,.5],[1,.35],[2,.55],[2.8,.45],[3,.25],[3.3,.95],[3.6,.95],[4,.6],[5,.5]],
 exposure:[[0,1],[1.8,1],[2.2,.9],[2.8,.9],[3.2,1],[4.8,1],[5,.92]],
 // The same part carries the loop: the floor is the hypothesis (02) and the revision (05).
 highlight:[[0,0],[1.05,0],[1.2,1],[1.6,1],[1.8,0],[4.05,0],[4.2,1],[4.6,1],[4.8,0],[5,0]],
 debrief:[[0,0],[4.7,0],[5,1]]
};
const FOCUS=[[0,[0,.5,.9]],[1,[0,.75,-.9]],[1.8,[0,.5,.6]],[2,[0,.5,.9]],[2.5,[0,.5,-.4]],[2.8,[0,.55,-1.2]],[3.05,[0,.55,.3]],[3.3,[-4.7,1.5,-1.35]],[3.6,[-4.7,1.5,-1.35]],[3.9,[0,.45,0]],[4,[0,.4,-.4]],[4.5,[0,.4,-.6]],[5,[0,.5,.9]]];
// Environment wipes straddle the seams into and out of the tunnel (R6).
const WIPES=[{from:1.88,to:2.12,incoming:'tunnel'},{from:2.88,to:3.12,incoming:'garage'}];

function segment(keys,p){let i=0;while(i<keys.length-2&&p>keys[i+1][0])i++;return i;}
function scalar(keys,p){const i=segment(keys,p),[t0,a]=keys[i],[t1,b]=keys[i+1];return a+(b-a)*smooth((p-t0)/(t1-t0));}
function vector(keys,p){const i=segment(keys,p),[t0,a]=keys[i],[t1,b]=keys[i+1],t=smooth((p-t0)/(t1-t0));return a.map((v,k)=>v+(b[k]-v)*t);}
// Cubic Hermite with Catmull-Rom tangents over non-uniform key times.
function spline(slot,p){
 const i=segment(CAMERA,p),k0=CAMERA[Math.max(0,i-1)],k1=CAMERA[i],k2=CAMERA[i+1],k3=CAMERA[Math.min(CAMERA.length-1,i+2)];
 const dt=k2[0]-k1[0],t=clamp((p-k1[0])/dt),t2=t*t,t3=t2*t;
 const h00=2*t3-3*t2+1,h10=t3-2*t2+t,h01=-2*t3+3*t2,h11=t3-t2;
 return k1[slot].map((v,axis)=>{
  const m1=(k2[slot][axis]-k0[slot][axis])/(k2[0]-k0[0])*dt,m2=(k3[slot][axis]-k1[slot][axis])/(k3[0]-k1[0])*dt;
  return h00*v+h10*m1+h01*k2[slot][axis]+h11*m2;
 });
}

// Pure, absolute sampling: returning to a scroll position restores the same pose.
export function sampleStory(progress){
 const p=clamp(Number.isFinite(progress)?progress:0,0,5),index=Math.min(5,Math.floor(p)),local=p-index;
 const pose={index,local,camera:spline(1,p),target:spline(2,p),focus:vector(FOCUS,p),tunnel:0,wipe:0,sweep:0,incoming:null};
 for(const [key,keys] of Object.entries(TRACKS))pose[key]=scalar(keys,p);
 pose.explode=clamp(pose.explode);
 const inside=p>=2.12&&p<=2.88,w=WIPES.find(w=>p>w.from&&p<w.to);
 if(w){const s=smooth((p-w.from)/(w.to-w.from));pose.sweep=s;pose.incoming=w.incoming;pose.wipe=Math.sin(Math.PI*s);pose.tunnel=w.incoming==='tunnel'?s:1-s;}
 else pose.tunnel=inside?1:0;
 return pose;
}
export function assessChoice(chapter,choice){return {correct:choice===chapter.correct,message:chapter.feedback};}
export function exportNotebook(values,now=new Date().toISOString()){
 const safe={};for(const [k,v] of Object.entries(values)){if(typeof v==='string')safe[k]=v;}
 return {...safe,schemaVersion:1,exportedAt:now,origin:'Anotações do aluno; não verificadas automaticamente'};
}
