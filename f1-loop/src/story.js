import {FIELDS} from './content.js';
export const clamp = (v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const smooth=t=>{t=clamp(t);return t*t*(3-2*t);};
const RAD=Math.PI/180;

// Director's track for one continuous take (R1). Progress p runs 0..5. Chapter i's copy
// is on screen from about i−0.2 to i+0.55, so every chapter reads while the camera
// keeps moving (orbit, dolly, crane) and travels in the text-free stretch (≈0.57–0.8).
// Car coordinates: x ±0.92, y 0–1.1, z −2.55..+2.56, nose at +Z, INTEIA decal on +X.
// Camera keys are cylindrical around the car: [azimuth° from the nose toward +X, distance, height].
// Interpolating azimuth instead of x/z makes an orbit an orbit, not a chord through the car.
// While copy is up, the car stays inside 42–92% of a 1440×900 frame (tools/camera-metrics.mjs).
// aim(): the car point, pushed against the camera's right vector so the hero sits right of centre.
const aim=(az,s,y,z=0)=>[-Math.cos(az*RAD)*s,y,Math.sin(az*RAD)*s+z];
const MONITORS=[-4.72,1.52,-1.35];
const CAMERA=[
 // 01 Preparar · box. Reveal orbit from the front three-quarter toward the decal, craning up.
 [0.00,[34,9.7,1.2],aim(34,.4,.45)],
 [0.25,[56,10.1,1.5],aim(56,.35,.45)],
 [0.50,[78,10.4,1.95],aim(78,.3,.5)],
 // Travel: crane over the box while the car opens (orbit in explosion begins).
 [0.76,[100,11.4,3.6],aim(100,.2,.62)],
 // 02 Hipótese · high rear orbit around the exploded car, the floor isolated below.
 [1.00,[120,12.4,4.8],aim(120,.1,.72)],
 [1.25,[138,12.6,5.4],aim(138,0,.78)],
 [1.50,[156,12.8,5.8],aim(156,0,.8)],
 // Travel: crane down into the tunnel; the parts slam home as the diagonal wipe hits.
 [1.76,[178,10.6,2.4],aim(178,.1,.62)],
 // 03 Executar · tunnel. Low rear contra-plongée, the smoke streaming toward the lens.
 [2.00,[164,8.7,.5],aim(164,.12,.68)],
 [2.25,[136,10.0,.56],aim(136,.1,.64)],
 [2.50,[105,10.6,.64],aim(105,.15,.6)],
 // Travel: lateral travelling along the flank, against the airflow (toward +Z).
 [2.70,[88,9.4,.85],[0,.55,-.2]],
 [2.86,[74,10.4,1.9],[-1.6,.9,-1.5]],
 // 04 Avaliar · engineering island, lit by the evidence. Descending orbit with a rack focus
 // from the car to the monitors; the car stays in frame, out of focus, clear of the copy.
 [3.00,[60,12.0,2.8],[-4.35,1.2,-3]],
 [3.25,[48,10.8,2.3],[-4.0,1.15,-3.2]],
 [3.50,[38,9.5,1.95],[-3.6,1.1,-3.4]],
 // Travel: push-in until the evidence fills the frame, the car a blurred foreground;
 // the orbit keeps turning through the push so the camera never stalls.
 [3.74,[33,7.4,1.5],MONITORS],
 // 05 Corrigir · box, body lifted. Low orbit toward the nose, the revised floor at eye level.
 [4.00,[25,11.0,.62],aim(25,.5,.5)],
 [4.25,[16,11.2,.54],aim(16,.5,.48)],
 [4.50,[8,10.0,.5],aim(8,.45,.46)],
 // Travel: a last low push at the floor while the orbit swings back, then the debrief recoil.
 [4.66,[14,7.8,.56],aim(14,.3,.44)],
 // 06 Encerrar · the closing frame answers the opening one.
 [5.00,[34,9.7,1.2],aim(34,.4,.45)]
];
const TRACKS={
 fov:[[0,38],[.5,38],[.76,34],[1,38],[1.5,38],[1.76,34],[2,38],[2.5,38],[2.7,31],[2.86,34],[3,38],[3.5,38],[3.74,31],[4,38],[4.5,38],[4.66,34],[5,38]],
 // The car opens on the way to the bench, peaks after the copy leaves and slams shut at the wipe.
 explode:[[0,0],[.55,0],[1,.5],[1.45,.6],[1.62,.8],[1.86,0],[3.8,0],[4,.45],[4.55,.45],[4.85,0],[5,0]],
 bokeh:[[0,.5],[1,.35],[1.6,.4],[2,.55],[2.8,.45],[3.08,.3],[3.24,.78],[3.74,.8],[3.95,.4],[4.1,.55],[5,.5]],
 // Avaliar is lit by the evidence: the room drops and the monitors take over.
 evaluate:[[0,0],[2.95,0],[3.15,1],[3.74,1],[3.92,0],[5,0]],
 exposure:[[0,1],[1.8,1],[2.2,.9],[2.8,.9],[3.2,1],[4.8,1],[5,.92]],
 // The same part carries the loop: the floor is the hypothesis (02) and the revision (05).
 highlight:[[0,0],[.98,0],[1.12,1],[1.6,1],[1.78,0],[4.02,0],[4.16,1],[4.6,1],[4.8,0],[5,0]],
 debrief:[[0,0],[4.7,0],[5,1]]
};
const FOCUS=[[0,[0,.5,.6]],[.76,[0,.7,-.3]],[1,[0,.75,-.9]],[1.6,[0,.6,-.3]],[2,[0,.55,-.8]],[2.5,[0,.55,-.2]],[2.72,[0,.55,0]],[3.08,[0,.55,.3]],[3.12,[0,.55,.3]],[3.26,MONITORS],[3.74,MONITORS],[3.92,[0,.5,.4]],[4,[0,.4,.8]],[4.5,[0,.4,1.2]],[5,[0,.5,.6]]];
// Environment wipes straddle the seams into and out of the tunnel (R6).
const WIPES=[{from:1.88,to:2.12,incoming:'tunnel'},{from:2.88,to:3.12,incoming:'garage'}];

function segment(keys,p){let i=0;while(i<keys.length-2&&p>keys[i+1][0])i++;return i;}
function scalar(keys,p){const i=segment(keys,p),[t0,a]=keys[i],[t1,b]=keys[i+1];return a+(b-a)*smooth((p-t0)/(t1-t0));}
function vector(keys,p){const i=segment(keys,p),[t0,a]=keys[i],[t1,b]=keys[i+1],t=smooth((p-t0)/(t1-t0));return a.map((v,k)=>v+(b[k]-v)*t);}
// Catmull-Rom tangent at key b (between a and c), limited like Fritsch–Carlson: zero at a
// local extremum and at most 3× the smaller secant, so no coordinate overshoots its keys
// (the camera never dips under the floor between a crane shot and a low shot).
function tangent(a,b,c,slot,axis){
 if(a===b)return (c[slot][axis]-b[slot][axis])/(c[0]-b[0]);
 if(b===c)return (b[slot][axis]-a[slot][axis])/(b[0]-a[0]);
 const d0=(b[slot][axis]-a[slot][axis])/(b[0]-a[0]),d1=(c[slot][axis]-b[slot][axis])/(c[0]-b[0]);
 if(d0*d1<=0)return 0;
 const m=(c[slot][axis]-a[slot][axis])/(c[0]-a[0]),cap=3*Math.min(Math.abs(d0),Math.abs(d1));
 return Math.sign(m)*Math.min(Math.abs(m),cap);
}
// Cubic Hermite over non-uniform key times: C1 in progress, so speed never jumps at a key.
function spline(slot,p){
 const i=segment(CAMERA,p),k0=CAMERA[Math.max(0,i-1)],k1=CAMERA[i],k2=CAMERA[i+1],k3=CAMERA[Math.min(CAMERA.length-1,i+2)];
 const dt=k2[0]-k1[0],t=clamp((p-k1[0])/dt),t2=t*t,t3=t2*t;
 const h00=2*t3-3*t2+1,h10=t3-2*t2+t,h01=-2*t3+3*t2,h11=t3-t2;
 return k1[slot].map((v,axis)=>h00*v+h10*tangent(k0,k1,k2,slot,axis)*dt+h01*k2[slot][axis]+h11*tangent(k1,k2,k3,slot,axis)*dt);
}
function cameraAt(p){const [az,d,y]=spline(1,p);return [Math.sin(az*RAD)*d,y,Math.cos(az*RAD)*d];}

// Pure, absolute sampling: returning to a scroll position restores the same pose.
export function sampleStory(progress){
 const p=clamp(Number.isFinite(progress)?progress:0,0,5),index=Math.min(5,Math.floor(p)),local=p-index;
 const pose={index,local,camera:cameraAt(p),target:spline(2,p),focus:vector(FOCUS,p),tunnel:0,wipe:0,sweep:0,incoming:null};
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
 // Empty fields are listed, never filled: a gap stays visible to the next reader.
 const camposSemRegistro=[...FIELDS.map(([key])=>key),'decision'].filter(key=>!(typeof values[key]==='string'&&values[key].trim()));
 return {...safe,camposSemRegistro,schemaVersion:1,exportedAt:now,origin:'Anotações do aluno; não verificadas automaticamente'};
}
