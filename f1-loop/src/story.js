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
 // Reading keys were fitted by search (closest distance that keeps 42–92% with margin, target
 // height that sits the car low in frame); the comment gives the car's share of frame height.
 // 01 Preparar · box. Near-frontal hero at engineer's eye height, orbiting toward the decal
 // while a crane lifts the lens over the car (massa 55% → 27%).
 [0.00,[8,6.1,1.8],aim(8,.6,.3)],
 [0.25,[24,7.5,3.2],aim(24,.6,.4)],
 [0.50,[58,10.5,3.6],aim(58,.3,.9)],
 // Travel: crane over the box while the car opens (orbit in explosion begins).
 // Text-free travels carry a component close-up: a long-lens zoom (fov track) with the aim on one
 // part, cropping the car on purpose (corn-02/09); the copy windows return to the whole car.
 [0.76,[88,10.6,4.6],[0,.35,2]],
 // 02 Hipótese · orbit in explosion: high rear orbit around the parts, floor isolated (32% → 43%).
 [1.00,[112,12.7,6],aim(112,.3,.9)],
 [1.25,[138,11.7,6],aim(138,.1,.9)],
 [1.50,[160,12.1,5.8],aim(160,0,1.1)],
 // Explosion peak: zoom onto the isolated floor, the hypothesis part, between the flying parts.
 [1.64,[175,10.9,4.1],[0,.15,-.3]],
 // Travel: crane down into the tunnel; the parts slam home as the diagonal wipe hits. The lens
 // stays above the rear cabinets (z −5.8) until the box has been swept away.
 [1.76,[182,9.2,2.4],[.1,.62,0]],
 // 03 Executar · tunnel. Rear three-quarter that sinks to a low contra-plongée at 0.75 m once
 // the tunnel owns the frame, then swings out toward the flank (52% → 23%).
 [2.00,[178,6.05,1.5],aim(178,0,.4)],
 [2.25,[158,7.85,.75],aim(158,-.3,.9)],
 [2.50,[124,10.65,2.2],aim(124,.05,.9)],
 // Travel: lateral travelling along the flank, against the airflow (toward +Z).
 [2.70,[98,9.6,1.5],[.8,.35,1.7]],
 [2.85,[77,10.7,2.2],[-.6,.75,-.6]],
 // 04 Avaliar · engineering island, lit by the evidence. Descending orbit with a rack focus
 // from the car to the monitors; the car stays in frame, out of focus, clear of the copy.
 [3.00,[60,12.0,2.8],[-4.35,1.2,-3]],
 [3.25,[48,10.8,2.3],[-4.0,1.15,-3.2]],
 [3.50,[38,9.5,1.45],[-3.6,1.1,-3.4]],
 // Travel: push-in until the evidence fills the frame, the car a blurred foreground;
 // orbit and crane keep turning through the push so the camera never stalls.
 [3.74,[30,5.6,2.1],MONITORS],
 // 05 Corrigir · box, body lifted. Rising orbit to the nose, looking down on the revised
 // floor between the lifted body and the spread wheels (34% → 56%).
 [4.00,[24,10.55,2.9],aim(24,.45,.7)],
 [4.25,[12,9.1,3.8],aim(12,.5,.4)],
 [4.50,[2,8.8,3.6],aim(2,.2,.4)],
 // Travel: descending crane onto the nose while the car closes, landing on the first frame.
 [4.74,[-2,7.3,2.9],aim(-2,.5,.35)],
 // 06 Encerrar · the closing frame answers the opening one.
 [5.00,[8,6.1,1.8],aim(8,.6,.3)]
];
const TRACKS={
 // Long-lens zooms at 0.72, 1.64 and 2.70 make the component close-ups; 38 is back before copy arrives.
 fov:[[0,38],[.5,38],[.6,34],[.72,22],[.84,30],[.94,38],[1.5,38],[1.56,32],[1.64,22],[1.74,30],[1.86,36],[2,38],[2.5,38],[2.6,30],[2.7,24],[2.8,30],[2.86,34],[3,38],[3.5,38],[3.74,31],[4,38],[4.5,38],[4.66,34],[5,38]],
 // The car opens on the way to the bench, peaks after the copy leaves and slams shut at the wipe.
 explode:[[0,0],[.55,0],[1,.5],[1.45,.6],[1.62,.8],[1.86,0],[3.8,0],[4,.45],[4.55,.45],[4.85,0],[5,0]],
 // Shallow focus lives in the travels and in Avaliar; reading pauses keep the whole subject sharp.
 bokeh:[[0,.11],[.5,.11],[.76,.42],[1,.2],[1.5,.2],[1.7,.45],[2,.25],[2.5,.25],[2.7,.5],[3,.3],[3.1,.3],[3.26,.78],[3.74,.8],[3.95,.35],[4,.11],[4.5,.11],[4.66,.45],[5,.11]],
 // Avaliar is lit by the evidence: the room drops and the monitors take over.
 evaluate:[[0,0],[2.95,0],[3.15,1],[3.74,1],[3.92,0],[5,0]],
 exposure:[[0,1],[1.8,1],[2.2,.9],[2.8,.9],[3.2,1],[4.8,1],[5,.92]],
 // The same part carries the loop: the floor is the hypothesis (02) and the revision (05).
 highlight:[[0,0],[.98,0],[1.12,1],[1.6,1],[1.78,0],[4.02,0],[4.16,1],[4.6,1],[4.8,0],[5,0]],
 debrief:[[0,0],[4.7,0],[5,1]]
};
// Focus narrates (R8): it rides the face of the car turned to the lens, so the subject of each
// pause is sharp from any angle; only Avaliar racks it to the evidence on the island monitors.
const RACK=[[0,0],[3.1,0],[3.26,1],[3.74,1],[3.92,0],[5,0]];
function focusAt(p,camera,target){
 const [x,,z]=camera,h=Math.hypot(x,z)||1,reach=Math.min(1.35,.25*h),k=scalar(RACK,p);
 const onCar=[x/h*reach,Math.max(.5,Math.min(1,target[1])),z/h*reach];
 return k>0?onCar.map((v,i)=>v+(MONITORS[i]-v)*k):onCar;
}
// Environment wipes straddle the seams into and out of the tunnel (R6).
const WIPES=[{from:1.88,to:2.12,incoming:'tunnel'},{from:2.88,to:3.12,incoming:'garage'}];

function segment(keys,p){let i=0;while(i<keys.length-2&&p>keys[i+1][0])i++;return i;}
function scalar(keys,p){const i=segment(keys,p),[t0,a]=keys[i],[t1,b]=keys[i+1];return a+(b-a)*smooth((p-t0)/(t1-t0));}
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
 const camera=cameraAt(p),target=spline(2,p);
 const pose={index,local,camera,target,focus:focusAt(p,camera,target),tunnel:0,wipe:0,sweep:0,incoming:null};
 for(const [key,keys] of Object.entries(TRACKS))pose[key]=scalar(keys,p);
 pose.explode=clamp(pose.explode);
 // Explicit lens for the engine (scene.js may prefer these over its bokeh mapping): reading pauses
 // get ≈4 m of sharp depth and a 1.5 bokeh scale (ENSAIO-FOCO-BUILD05); Avaliar keeps its rack.
 pose.focusRange=Math.max(3.4-2.25*pose.bokeh,4.4-4.5*pose.bokeh);
 pose.bokehScale=1+4.4*pose.bokeh;
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
