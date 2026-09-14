import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
/** Reusable engine assembly in the host scene: no extra canvas, camera or animation loop. */
export async function createInCarEngine(scene){
 const gltf=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(`${import.meta.env.BASE_URL}assets/power-unit-v1.glb`);
 const model=gltf.scene,bounds=new THREE.Box3().setFromObject(model),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3()),max=Math.max(size.x,size.y,size.z);
 const root=new THREE.Group();root.name='Motor integrado ao carro';root.position.set(0,.52,-.72);root.scale.setScalar(.85/max);model.position.sub(center);root.add(model);scene.add(root);
 const assemblies=[];model.traverse(o=>{if(/^assembly_/.test(o.name)){const n=o.name.toLowerCase(),direction=new THREE.Vector3();if(n.includes('left'))direction.set(-1,.5,0);else if(n.includes('right'))direction.set(1,.5,0);else if(n.includes('turbo'))direction.set(0,.3,-1);else if(n.includes('intake')||n.includes('head'))direction.set(0,1,0);assemblies.push({object:o,base:o.position.clone(),offset:direction.multiplyScalar(max*.38)});}if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
 const mixer=new THREE.AnimationMixer(model);gltf.animations.forEach(c=>mixer.clipAction(c).play());
 const light=new THREE.PointLight('#f4e9d2',0,4,2);light.position.set(.5,1.35,-.1);scene.add(light);root.visible=false;
 return {root,model,mixer,assemblies,center:root.position.clone(),update(dt,amount,spread,paused){root.visible=amount>.001;light.intensity=amount*7;if(amount>0&&!paused)mixer.update(dt*.22);for(const a of assemblies)a.object.position.copy(a.base).addScaledVector(a.offset,spread);},dispose(){mixer.stopAllAction();mixer.uncacheRoot(model);root.removeFromParent();light.removeFromParent();const gs=new Set(),ms=new Set();model.traverse(o=>{if(o.isMesh){gs.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])ms.add(m);}});gs.forEach(g=>g.dispose());ms.forEach(m=>m.dispose());}};
}
