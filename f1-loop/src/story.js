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
 // Text-free travels carry a component close-up (corn-02/09): a long lens, one part placed at 55% of
 // the width with focus locked on it (CLOSES) and the rest of the car in bokeh, extending toward the
 // empty text side, never past the chapter dots. From the +X flank the rear of the car is on screen
 // right, so the subjects are the parts at that end (a front part crops the car at 136–200%).
 // 0.72: rear wing at the top of the crane.
 [0.72,[88,10.6,4.6],[.19,.61,-3.04]],
 // 02 Hipótese · orbit in explosion: high rear orbit around the parts, floor isolated (32% → 43%).
 [1.00,[112,12.7,6],aim(112,.3,.9)],
 [1.25,[138,11.7,6],aim(138,.1,.9)],
 [1.50,[160,12.1,5.8],aim(160,0,1.1)],
 // Explosion peak: the isolated floor, the hypothesis part, centred between the flying parts
 // (wheels spread to ±2.4 m, so the lens stays at 32° to keep them inside the dots).
 [1.64,[170,11.5,4.5],[-1.21,.54,-.98]],
 // Travel: the crane holds high while the diagonal wipe crosses (1.76–2.00), so the box floor
 // fills the frame until the tunnel covers it; the descent happens inside the tunnel.
 [1.80,[180,9.4,3.5],[.1,.6,-.2]],
 // 03 Executar · tunnel. Rear three-quarter that sinks to a low contra-plongée at 0.75 m once
 // the tunnel owns the frame, then swings out toward the flank (52% → 23%).
 [2.00,[178,6.05,1.5],aim(178,0,.4)],
 [2.25,[158,7.85,.75],aim(158,-.3,.9)],
 [2.50,[124,10.65,2.2],aim(124,.05,.9)],
 // Travel: the track (src/world/track.js). The car never moves: the circuit runs past it in −Z,
 // so these keys are still car coordinates. Three linked takes, no cut (WIPES 2.50–2.64, 2.79–3.00):
 // a low tracking dolly on the flank as the diagonal brings the circuit in, a crane up and round
 // to the high T-cam view behind the car at full speed, then a whip round the right flank into
 // the island while the second diagonal brings the box back.
 [2.62,[92,7.2,.55],[0,.42,.1]],
 [2.74,[168,6.8,2.3],[0,.55,2.2]],
 [2.80,[135,8.2,2.7],[0,.8,3]],
 // 04 Avaliar · engineering island, lit by the evidence. The car stays sharp and clear of the copy
 // while the orbit comes round to the nose; then the push-in to the island (MONITORS).
 // The whip lands softly (tangent ×0.35) so the reading starts at lesson speed.
 [3.00,[60,12.0,2.8],[-4.35,1.2,-3],.35],
 [3.25,[34,9.6,2.2],[-2.2,.9,-2.2]],
 [3.50,[-5,6.2,1.3],aim(-5,-.2,.35)],
 // Travel: push-in past the front-left wheel until the central monitor is 35–40% of the width,
 // and only then the rack (RACK from 3.5) hands the focus to the evidence. The crane keeps
 // rising through the hold, so the lens never stops.
 [3.74,[-45,1.98,1.7],[-4.59,1.5,-1.51]],
 // 05 Corrigir · box. The crane rises straight off the island over the closed nose, then pulls
 // back while the body lifts (explode 3.95–4.2), looking down on the revised floor.
 [4.00,[-10,4.5,4.0],aim(-10,-.2,.75)],
 [4.25,[0,8.5,4.2],aim(0,.2,.4)],
 [4.50,[10,9,3.8],aim(10,.2,.4)],
 // Travel: descending crane onto the nose while the car closes, landing on the first frame.
 [4.74,[12,7.4,2.9],aim(12,.5,.35)],
 // 06 Encerrar · the closing frame answers the opening one.
 [5.00,[8,6.1,1.8],aim(8,.6,.3)]
];
const TRACKS={
 // Long-lens zooms at 0.72 and 1.64 make the component close-ups, 30–34 on the track, 20 on the
 // monitor; 38 is back before copy arrives.
 fov:[[0,38],[.5,38],[.6,32],[.72,26],[.84,30],[.94,38],[1.5,38],[1.56,34],[1.64,32],[1.74,33],[1.86,36],[2,38],[2.5,38],[2.62,30],[2.74,34],[2.86,34],[3,38],[3.45,36],[3.7,20],[3.8,20],[3.9,27],[4,38],[4.5,38],[4.66,34],[5,38]],
 // The car opens on the way to the bench, peaks after the copy leaves and slams shut at the wipe.
 explode:[[0,0],[.55,0],[1,.5],[1.45,.6],[1.62,.8],[1.86,0],[3.95,0],[4.2,.45],[4.55,.45],[4.85,0],[5,0]],
 // Shallow focus lives in the closes and the Avaliar rack; reading pauses keep the whole subject sharp;
 // the track keeps it low so the bokeh does not erase the speed streaks.
 bokeh:[[0,.11],[.5,.11],[.72,.5],[.9,.25],[1,.2],[1.5,.2],[1.64,.5],[1.8,.35],[2,.25],[2.5,.25],[2.58,.12],[2.92,.12],[3,.25],[3.5,.25],[3.7,.7],[3.84,.7],[3.96,.35],[4,.11],[4.5,.11],[4.66,.45],[5,.11]],
 // Avaliar is lit by the evidence: the room drops and the monitors take over.
 evaluate:[[0,0],[2.95,0],[3.15,1],[3.84,1],[3.98,0],[5,0]],
 exposure:[[0,1],[1.8,1],[2.2,.9],[2.8,.9],[3.2,1],[4.8,1],[5,.92]],
 // The same part carries the loop: the floor is the hypothesis (02) and the revision (05).
 highlight:[[0,0],[.98,0],[1.12,1],[1.6,1],[1.78,0],[4.02,0],[4.16,1],[4.6,1],[4.8,0],[5,0]],
 debrief:[[0,0],[4.7,0],[5,1]],
 // Track run (0..1, 1 = 80 m/s): up to speed as the circuit sweeps in, flat out through the T-cam,
 // braking to a stop before the box owns the frame. shake scales the track camera (speedCamera).
 speed:[[0,0],[2.5,0],[2.64,.85],[2.72,1],[2.84,1],[2.96,0],[5,0]],
 shake:[[0,0],[2.52,0],[2.64,.7],[2.74,1],[2.86,1],[2.96,0],[5,0]],
 // No copy on screen during the run: the frame is centred on the car instead of clearing the text column.
 center:[[0,0],[2.5,0],[2.62,1],[2.86,1],[3,0],[5,0]],
 // Extra pull-back on phones (added to scene.js's portrait factor): the lateral take is a whole car
 // side-on, which a 390 px frame only holds from further away.
 pull:[[0,0],[2.5,0],[2.62,.75],[2.72,.1],[2.86,0],[5,0]]
};
// Focus narrates (R8): it rides the face of the car turned to the lens, so the subject of each
// pause is sharp from any angle. Avaliar racks it to the island monitors only once the push-in has
// made them big (3.5 on); each close locks it on its part with a short range (LOCK, CLOSES).
const RACK=[[0,0],[3.5,0],[3.7,1],[3.84,1],[3.96,0],[5,0]];
// Part centres at the explode amount of each close (tools/car-hull.json): rear wing, floor.
const CLOSES=[[.72,[.3,.6,-2.25]],[1.64,[0,.29,-.85]]];
const LOCK=[[0,0],[.58,0],[.66,1],[.8,1],[.9,0],[1.5,0],[1.57,1],[1.7,1],[1.78,0],[5,0]];
const CLOSE_RANGE=1.5;
function focusAt(p,camera,target){
 const [x,,z]=camera,h=Math.hypot(x,z)||1,reach=Math.min(1.35,.25*h),k=scalar(RACK,p),lock=scalar(LOCK,p);
 let point=[x/h*reach,Math.max(.5,Math.min(1,target[1])),z/h*reach];
 if(k>0)point=point.map((v,i)=>v+(MONITORS[i]-v)*k);
 if(lock>0){const part=CLOSES.reduce((a,b)=>Math.abs(b[0]-p)<Math.abs(a[0]-p)?b:a)[1];point=point.map((v,i)=>v+(part[i]-v)*lock);}
 return {point,lock};
}
// Environment wipes run in text-free travels and the last one of a chapter finishes on its seam (R6):
// the incoming world owns the frame before the next chapter's copy may appear (main.js opens it
// after the seam). hazeLead: how early the dark haze starts before a wipe (short on the track entry,
// so the end of the Executar reading keeps the tunnel's depth).
const WIPES=[
 {from:1.76,to:2.00,outgoing:'garage',incoming:'tunnel',hazeLead:.22},
 {from:2.50,to:2.64,outgoing:'tunnel',incoming:'track',hazeLead:.06},
 {from:2.79,to:3.00,outgoing:'track',incoming:'garage',hazeLead:.22}
];

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
// An optional 4th key element scales that key's tangent: a whip can land softly on a reading key.
function spline(slot,p){
 const i=segment(CAMERA,p),k0=CAMERA[Math.max(0,i-1)],k1=CAMERA[i],k2=CAMERA[i+1],k3=CAMERA[Math.min(CAMERA.length-1,i+2)];
 const dt=k2[0]-k1[0],t=clamp((p-k1[0])/dt),t2=t*t,t3=t2*t;
 const h00=2*t3-3*t2+1,h10=t3-2*t2+t,h01=-2*t3+3*t2,h11=t3-t2,e1=k1[3]??1,e2=k2[3]??1;
 return k1[slot].map((v,axis)=>h00*v+h10*tangent(k0,k1,k2,slot,axis)*e1*dt+h01*k2[slot][axis]+h11*tangent(k1,k2,k3,slot,axis)*e2*dt);
}
function cameraAt(p){const [az,d,y]=spline(1,p);return [Math.sin(az*RAD)*d,y,Math.cos(az*RAD)*d];}

// Pure, absolute sampling: returning to a scroll position restores the same pose.
export function sampleStory(progress){
 const p=clamp(Number.isFinite(progress)?progress:0,0,5),index=Math.min(5,Math.floor(p)),local=p-index;
 const camera=cameraAt(p),target=spline(2,p);
 const {point,lock}=focusAt(p,camera,target);
 const pose={index,local,camera,target,focus:point,tunnel:0,wipe:0,sweep:0,incoming:null};
 for(const [key,keys] of Object.entries(TRACKS))pose[key]=scalar(keys,p);
 pose.explode=clamp(pose.explode);
 // Explicit lens for the engine (scene.js may prefer these over its bokeh mapping): reading pauses
 // get ≈4 m of sharp depth and a 1.5 bokeh scale (ENSAIO-FOCO-BUILD05); Avaliar keeps its rack;
 // a close narrows the sharp zone to its part.
 const range=Math.max(3.4-2.25*pose.bokeh,4.4-4.5*pose.bokeh);
 pose.focusRange=range+(CLOSE_RANGE-range)*lock;
 pose.bokehScale=1+4.4*pose.bokeh;
 // World routing is data: a new world is one more wipe (scene.js keeps a map of worlds by name).
 const w=WIPES.find(w=>p>w.from&&p<w.to);
 pose.world=WIPES.reduce((world,x)=>p>=x.to?x.incoming:world,WIPES[0].outgoing);
 pose.outgoing=null;
 if(w){const s=smooth((p-w.from)/(w.to-w.from));pose.sweep=s;pose.incoming=w.incoming;pose.outgoing=w.outgoing;pose.wipe=Math.sin(Math.PI*s);}
 // Weight of a named world on screen: the swept share during a wipe, 0 or 1 when settled.
 const weight=name=>w?(w.incoming===name?pose.sweep:w.outgoing===name?1-pose.sweep:0):pose.world===name?1:0;
 pose.tunnel=weight('tunnel');
 pose.track=weight('track');
 // Dark haze rises just before each wipe and clears after it (scene.js: fog, background, dust).
 pose.haze=Math.max(0,...WIPES.map(x=>Math.min(smooth((p-x.from+x.hazeLead)/Math.min(.16,x.hazeLead)),1-smooth((p-x.to)/.15))));
 return pose;
}
export function assessChoice(chapter,choice){return {correct:choice===chapter.correct,message:chapter.feedback};}
export function exportNotebook(values,now=new Date().toISOString()){
 const safe={};for(const [k,v] of Object.entries(values)){if(typeof v==='string')safe[k]=v;}
 // Empty fields are listed, never filled: a gap stays visible to the next reader.
 const camposSemRegistro=[...FIELDS.map(([key])=>key),'decision'].filter(key=>!(typeof values[key]==='string'&&values[key].trim()));
 return {...safe,camposSemRegistro,schemaVersion:1,exportedAt:now,origin:'Anotações do aluno; não verificadas automaticamente'};
}
