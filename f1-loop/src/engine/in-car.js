import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
import {engineShot} from './engine-shot.js';

// Engine bay in the car model frame (tools/car-hull.json): from behind the cockpit rim to the tail,
// above the sidepod lip. The body shell is one mesh, so the cover is the same geometry split by planes.
const BAY={front:-.15,rear:-2.1,lip:.40};
// Seated on the floor (top ≈0.14 m) with the crank on the car centreline, turbo towards the gearbox.
const ENGINE_AT=new THREE.Vector3(0,.43,-.72),ENGINE_LENGTH=.85;
// The authored clip turns the crank 4 times in 8 s; 1.5× reads as 45 rpm: legible, no strobing at 30 fps.
const CLIP_RATE=1.5,WORK_LIGHT=2.6,FILL_LIGHT=1.6;
// Section (cinema r6 M3): the near bank is cut along its own bore axes (a 45° plane through the crank axis),
// only above the crank centreline, so the far bank stays whole and the V reads as a V, the pistons sit in their
// bores and the sump keeps the engine on its mounts. Cut faces are painted in a flat cutaway orange.
const CRANK_Y=.332,BANK=new THREE.Vector3(-1,1,0).normalize(),CUT_OPEN=.45,CUT_CLOSED=-CRANK_Y/Math.SQRT2;
const CUT_COLOR=new THREE.Color(1,.17,.025);
const HINGE=new THREE.Vector3(0,.75,-.9);
// Same cut as the car (scene.js): parts under a few centimetres add shadow triangles but no readable shadow.
const SHADOW_RADIUS=.09,UPLOAD_TRIANGLES=60000;
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const nextFrame=()=>new Promise(resolve=>requestAnimationFrame(resolve));
const aborted=()=>new DOMException('Motor cancelado','AbortError');

/**
 * Engine of chapter 07 inside the host scene: no extra canvas, camera or loop.
 * The 4.6 MB power unit is fetched only by prepare() (near the chapter), can be cancelled (reading mode,
 * the scene signal) and fails alone: until it is ready the car simply stays closed.
 */
export function createInCarEngine({scene,renderer,camera,model,mechanics,target,surfaces=null,mobile=false,signal=null,offstage=()=>[]}){
 renderer.localClippingEnabled=true;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 // Warm work light over the bay, in the scene from the start at intensity 0: the light count never changes,
 // so the box warm-up behind the preloader already covers it and opening or closing the bay recompiles nothing.
 const light=new THREE.PointLight('#ffb36b',0,3.4,1.6);light.name='Luz de trabalho do motor';light.position.set(.6,1.5,-.35);scene.add(light);
 const root=new THREE.Group();root.name='Motor no compartimento';root.position.copy(ENGINE_AT);root.visible=false;scene.add(root);

 let state='idle',ready=false,disposed=false,split=false,reveal=0,abort=null,mixer=null;
 const groups=[],engineGeometries=new Set(),engineMaterials=new Set(),engineTextures=new Set(),cutMaterials=new Map(),satinMaterials=new Map();
 // Section planes (world): the bank plane sweeps in from outside the engine; the sump plane is fixed at the
 // crank centreline. clipIntersection: a fragment goes only when it is outboard of the bank plane AND above the crank.
 const cutPlane=new THREE.Plane(BANK.clone(),CUT_OPEN),sumpPlane=new THREE.Plane(new THREE.Vector3(0,-1,0),CRANK_Y);
 const cutAt=cut=>THREE.MathUtils.lerp(CUT_OPEN,CUT_CLOSED,smooth(cut));
 // Cool fill from the far side of the bay (desktop): a second tone on the machined metal, so crowns and crank read as
 // steel instead of flat grey. In the scene from the start at 0, like the work light (no light-count change).
 const fill=mobile?null:new THREE.PointLight('#7cc4ff',0,3.2,1.5);
 if(fill){fill.name='Contraluz fria do motor';fill.position.set(-1.05,1.05,-1.2);scene.add(fill);}

 const body=mechanics.records.find(r=>r.source==='main_body');
 const lifted=mechanics.records.filter(r=>/^top_intake_details/.test(r.source));
 const cover=new THREE.Group();cover.name='Tampa do motor';cover.visible=false;
 const bodyMeshes=[],original=new Map(),castShadow=new Map(),coverMaterials=new Map(),restMaterials=new Map();
 const coverLocal=[new THREE.Plane(new THREE.Vector3(0,0,-1),BAY.front),new THREE.Plane(new THREE.Vector3(0,0,1),-BAY.rear),new THREE.Plane(new THREE.Vector3(0,1,0),-BAY.lip)];
 const restLocal=coverLocal.map(p=>p.clone().negate());
 const coverPlanes=coverLocal.map(p=>p.clone()),restPlanes=restLocal.map(p=>p.clone());
 const turn=new THREE.Quaternion(),axisX=new THREE.Vector3(1,0,0),pivot=new THREE.Vector3(),coverWorld=new THREE.Matrix4();

 // Reading mode (main.js puts .reading on the body) stops a download in progress; cinema mode asks again.
 const cancel=()=>{if(state==='loading')abort?.abort();};
 const observer=new MutationObserver(()=>{if(document.body.classList.contains('reading'))cancel();});
 observer.observe(document.body,{attributes:true,attributeFilter:['class']});
 signal?.addEventListener('abort',cancel,{once:true});

 // Same program as the car material plus its clipping planes (car-look and surface patches stay on).
 const derive=(material,planes,intersection)=>{const c=material.clone();c.name=material.name;c.onBeforeCompile=material.onBeforeCompile;c.customProgramCacheKey=material.customProgramCacheKey;c.clippingPlanes=planes;c.clipIntersection=intersection;return c;};
 function buildSplit(){
  model.updateMatrixWorld(true);
  const inverse=new THREE.Matrix4().copy(model.matrixWorld).invert();
  const twin=(mesh,material)=>{const t=new THREE.Mesh(mesh.geometry,material);t.name=mesh.name+' (tampa)';t.matrixAutoUpdate=false;t.matrix.multiplyMatrices(inverse,mesh.matrixWorld);t.renderOrder=mesh.renderOrder;t.layers.mask=mesh.layers.mask;t.receiveShadow=true;t.castShadow=false;cover.add(t);};
  body.root.traverse(o=>{
   if(!o.isMesh||Array.isArray(o.material))return;
   bodyMeshes.push(o);original.set(o,o.material);castShadow.set(o,o.castShadow);
   if(!coverMaterials.has(o.material)){coverMaterials.set(o.material,derive(o.material,coverPlanes,false));restMaterials.set(o.material,derive(o.material,restPlanes,true));}
   twin(o,coverMaterials.get(o.material));
  });
  for(const r of lifted)r.root.traverse(o=>{if(o.isMesh)twin(o,o.material);});
  model.add(cover);
 }
 function setSplit(on){
  split=on;cover.visible=on;
  // The open shell casts no shadow into the bay; the closed car keeps its own.
  for(const m of bodyMeshes){const base=original.get(m);m.material=on?restMaterials.get(base):base;m.castShadow=on?false:castShadow.get(m);}
  for(const r of lifted){r.hidden=on;r.root.visible=!on;}
 }
 function poseCover(open){
  const lift=smooth(open);
  // Lifts straight out of the lens (the close-ups look down into the bay) with a slight nose-up tilt.
  turn.setFromAxisAngle(axisX,-.2*lift);cover.quaternion.copy(turn);
  cover.position.copy(HINGE).sub(pivot.copy(HINGE).applyQuaternion(turn));cover.position.y+=1.9*lift;cover.position.z-=.2*lift;
  cover.updateMatrix();model.updateMatrixWorld();
  coverWorld.multiplyMatrices(model.matrixWorld,cover.matrix);
  for(let i=0;i<3;i++){coverPlanes[i].copy(coverLocal[i]).applyMatrix4(coverWorld);restPlanes[i].copy(restLocal[i]).applyMatrix4(model.matrixWorld);}
 }

 function collect(object){
  object.traverse(o=>{if(!o.isMesh)return;engineGeometries.add(o.geometry);for(const m of [].concat(o.material)){engineMaterials.add(m);for(const v of Object.values(m))if(v?.isTexture)engineTextures.add(v);}});
 }
 // Inside a cut solid every visible face is a back face: painting them flat reads as the section fill of a cutaway
 // drawing. Written after the material's own output (the composer grades it with the rest of the frame).
 function capShader(material){
  material.onBeforeCompile=shader=>{
   shader.uniforms.uCutColor={value:CUT_COLOR};
   shader.fragmentShader=shader.fragmentShader
    .replace('#include <common>','#include <common>\nuniform vec3 uCutColor;')
    .replace('#include <dithering_fragment>','#include <dithering_fragment>\nif(!gl_FrontFacing)gl_FragColor=vec4(uCutColor,1.);');
  };
  material.customProgramCacheKey=()=>'engine-cut-cap-v1';
 }
 function machined(material){
  if(surfaces){surfaces.applyTo(material,'aluminum',{uvSpanMeters:.5});material.normalScale.setScalar(.07);}
  material.metalness=Math.max(material.metalness,.9);material.roughness=.42;material.envMapIntensity=.9;material.needsUpdate=true;
 }
 // Engine mounts (cinema r6 M3): a bay plate and two rails with four mount blocks under the block, so the unit sits on
 // the car instead of floating in the dark. Sized in the car frame, placed in the engine frame (root is scaled).
 function buildCradle(){
  const k=1/root.scale.x,at=(x,y,z)=>new THREE.Vector3(x-ENGINE_AT.x,y-ENGINE_AT.y,z-ENGINE_AT.z).multiplyScalar(k);
  const plateMaterial=new THREE.MeshPhysicalMaterial({name:'Berço do motor',color:'#15181c',metalness:.15,roughness:.58,clearcoat:.25,clearcoatRoughness:.3});
  const railMaterial=new THREE.MeshStandardMaterial({name:'Trilhos do motor',color:'#4a5058',metalness:.9,roughness:.4});
  const cradle=new THREE.Group();cradle.name='Berço do motor';
  const part=(w,h,d,x,y,z,material)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w*k,h*k,d*k),material);m.position.copy(at(x,y,z));m.receiveShadow=true;cradle.add(m);return m;};
  part(.66,.02,.78,0,.155,-.64,plateMaterial);
  for(const x of [-.29,.29]){part(.05,.05,.72,x,.19,-.64,railMaterial);for(const z of [-.84,-.40])part(.05,.05,.05,x*.92,.225,z,railMaterial);}
  root.add(cradle);
 }
 function buildEngine(gltf){
  const unit=gltf.scene,bounds=new THREE.Box3().setFromObject(unit),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
  const scale=ENGINE_LENGTH/Math.max(size.x,size.y,size.z);
  root.scale.setScalar(scale);unit.position.sub(center);root.add(unit);
  unit.updateMatrixWorld(true);
  const worldScale=new THREE.Vector3();
  unit.traverse(o=>{
   if(o.isMesh){
    if(!o.geometry.boundingSphere)o.geometry.computeBoundingSphere();
    // Phones draw no engine shadow; desktop keeps it on the large castings only.
    o.castShadow=!mobile&&o.geometry.boundingSphere.radius*o.getWorldScale(worldScale).x>SHADOW_RADIUS;o.receiveShadow=true;
   }
   if(!/^assembly_/.test(o.name))return;
   // Moving parts and the turbo stay whole; the static block, heads, exhausts, intake and MGU-K are sectioned.
   // Only the near exhaust hides: it hangs outboard of the sectioned bank and would sit between the lens and the cut.
   groups.push({object:o,cut:!/rotating|turbo/.test(o.name),hiddenWhenCut:/exhaust_right/.test(o.name)});
  });
  const sectioned=m=>{if(!cutMaterials.has(m)){const c=m.clone();c.clippingPlanes=[cutPlane,sumpPlane];c.clipIntersection=true;c.side=THREE.DoubleSide;capShader(c);cutMaterials.set(m,c);}return cutMaterials.get(m);};
  // Moving parts in polished metal (roughness 0.22–0.39) flare white under the close work light: a satin copy with
  // brushed bands (surface library, aluminium) keeps the pistons, rods and crank readable as machined steel.
  const satin=m=>{if(!satinMaterials.has(m)){const c=m.clone();machined(c);satinMaterials.set(m,c);}return satinMaterials.get(m);};
  for(const g of groups){const swap=g.cut?sectioned:/rotating/.test(g.object.name)?satin:null;if(swap)g.object.traverse(o=>{if(o.isMesh)o.material=Array.isArray(o.material)?o.material.map(swap):swap(o.material);});}
  mixer=new THREE.AnimationMixer(unit);for(const clip of gltf.animations)mixer.clipAction(clip).play();
  buildCradle();collect(root);
 }
 // First entry without a stall: only what is new is compiled, against the composer buffer (programs are keyed by
 // the target): the engine, the cover copies and the cut body. Strictly one object at a time, waiting for its programs
 // to finish linking (ANGLE links in the GPU process, where a CPU time budget does not reach), a frame in between.
 async function precompile(){
  const seen=new Set(),queue=[];
  const add=mesh=>{const fresh=[].concat(mesh.material).some(m=>!seen.has(m));if(!fresh)return;[].concat(mesh.material).forEach(m=>seen.add(m));queue.push(mesh);};
  for(const object of [root,cover])object.traverse(o=>{if(o.isMesh)add(o);});
  for(const m of bodyMeshes)add(new THREE.Mesh(m.geometry,restMaterials.get(original.get(m))));
  while(queue.length&&!disposed){
   const previous=renderer.getRenderTarget();let job;
   try{renderer.setRenderTarget(target());job=renderer.compileAsync(queue.shift(),camera,scene);}
   finally{renderer.setRenderTarget(previous);}
   await job;
   await nextFrame();
  }
 }
 // Textures and vertex buffers reach the GPU in small batches, one per frame, while the student reads Encerrar.
 async function upload(){
  for(const texture of engineTextures)renderer.initTexture(texture);
  const stage=new THREE.Scene(),basic=new THREE.MeshBasicMaterial(),buffer=new THREE.WebGLRenderTarget(1,1);stage.overrideMaterial=basic;
  const meshes=[];root.traverse(o=>{if(o.isMesh)meshes.push(o);});cover.traverse(o=>{if(o.isMesh)meshes.push(o);});
  let triangles=0;
  const flush=async()=>{
   if(!stage.children.length)return;
   const previous=renderer.getRenderTarget();renderer.setRenderTarget(buffer);renderer.render(stage,camera);renderer.setRenderTarget(previous);
   stage.clear();triangles=0;await nextFrame();
  };
  try{
   for(const mesh of meshes){
    if(disposed)return;
    const proxy=new THREE.Mesh(mesh.geometry,basic);proxy.frustumCulled=false;stage.add(proxy);
    triangles+=(mesh.geometry.index?.count??mesh.geometry.attributes.position.count)/3;
    if(triangles>=UPLOAD_TRIANGLES)await flush();
   }
   await flush();
  }finally{buffer.dispose();basic.dispose();}
 }
 async function load(){
  abort=new AbortController();
  const response=await fetch(`${import.meta.env.BASE_URL}assets/power-unit-v1.glb`,{signal:abort.signal});
  if(!response.ok)throw new Error('Motor HTTP '+response.status);
  const bytes=await response.arrayBuffer();
  await MeshoptDecoder.ready;
  if(abort.signal.aborted)throw aborted();
  const gltf=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(bytes,`${import.meta.env.BASE_URL}assets/`);
  collect(gltf.scene);
  if(disposed||abort.signal.aborted){releaseEngine();throw aborted();}
  // From here the work is local (no network) and finishes even if reading mode is chosen meanwhile.
  buildSplit();buildEngine(gltf);
  await precompile();
  if(disposed)return;
  await upload();
  if(disposed)return;
  await rehearse();
  if(!disposed){ready=true;state='ready';}
 }
 // Each lesson looks where the story never did (garage corners, rear wing, shadow casters): the first cold pass
 // spiked 106–381 ms on a 4× slowed phone (pub07 r6). The real scene is rendered once from each lesson view,
 // off screen into the composer buffer, one view per frame while Encerrar is read; the closed car is restored.
 async function rehearse(){
  const view=camera.clone(),aim=new THREE.Vector3();
  for(const p of [.2,.38,.61,.72,.84]){
   if(disposed)return;
   const take=engineShot(p,mobile),wasSplit=split,wasVisible=root.visible,constant=cutPlane.constant,previous=renderer.getRenderTarget();
   light.position.fromArray(take.lightAt);
   view.copy(camera);view.position.fromArray(take.camera);view.fov=take.fov;view.updateProjectionMatrix();view.lookAt(aim.fromArray(take.target));view.updateMatrixWorld();
   try{
    setSplit(true);root.visible=true;poseCover(take.open);cutPlane.constant=cutAt(take.cut);
    renderer.setRenderTarget(target());renderer.render(scene,view);
   }finally{
    renderer.setRenderTarget(previous);cutPlane.constant=constant;root.visible=wasVisible;if(!wasSplit)setSplit(false);
   }
   await nextFrame();
  }
 }
 function releaseEngine(){
  engineGeometries.forEach(g=>g.dispose());engineMaterials.forEach(m=>m.dispose());cutMaterials.forEach(m=>m.dispose());satinMaterials.forEach(m=>m.dispose());engineTextures.forEach(t=>t.dispose());
  engineGeometries.clear();engineMaterials.clear();cutMaterials.clear();satinMaterials.clear();engineTextures.clear();
 }

 return {
  root,light,
  get state(){return state;},
  get ready(){return ready;},
  /** Starts the download once (again after a cancel); a failure leaves the car closed for the session. */
  prepare(){
   if(state!=='idle'||disposed||document.body.classList.contains('reading'))return;
   state='loading';
   load().catch(error=>{
    if(disposed)return;
    if(error?.name==='AbortError'){state='idle';return;}
    state='failed';console.warn('Capítulo 07: motor indisponível; o carro segue fechado.',error);
   });
  },
  /** shot: engineShot() of the chapter (null outside it). */
  update(dt,shot,paused){
   reveal+=((ready?1:0)-reveal)*(1-Math.exp(-dt*3));if(reveal>.999)reveal=1;
   const open=(shot?shot.open:0)*reveal,on=ready&&open>.001;
   if(on!==split)setSplit(on);
   root.visible=on;
   light.intensity=on?shot.light*reveal*WORK_LIGHT:0;
   if(fill)fill.intensity=on?shot.fill*reveal*FILL_LIGHT:0;
   if(!on)return;
   light.position.fromArray(shot.lightAt);
   poseCover(open);
   const cut=shot.cut;
   cutPlane.constant=cutAt(cut);
   for(const g of groups)g.object.visible=!(g.hiddenWhenCut&&cut>.999);
   if(!paused&&!reduced.matches)mixer.update(dt*CLIP_RATE);
  },
  dispose(){
   // A lost context disposes the scene from main.js onError; a second call has nothing left to release.
   if(disposed)return;
   disposed=true;abort?.abort();observer.disconnect();signal?.removeEventListener('abort',cancel);
   if(split)setSplit(false);
   cover.removeFromParent();coverMaterials.forEach(m=>m.dispose());restMaterials.forEach(m=>m.dispose());
   light.removeFromParent();light.dispose();
   if(fill){fill.removeFromParent();fill.dispose();}
   if(mixer){mixer.stopAllAction();mixer.uncacheRoot(mixer.getRoot());}
   root.removeFromParent();
   releaseEngine();
  }
 };
}
