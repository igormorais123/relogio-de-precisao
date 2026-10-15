import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {setupStudio,applyCarMaterials} from '../materia-prima/modulos-atualizados/studio.js';
import {createMechanics} from '../materia-prima/modulos-atualizados/mechanics.js';
import {applyInteiaBranding} from '../materia-prima/modulos-atualizados/branding.js';


export async function createScene(stage,{onProgress,onError}){
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
 const mobile=()=>innerWidth<761;
 renderer.setPixelRatio(Math.min(devicePixelRatio,mobile()?1.3:1.6));
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.05,120),studio=setupStudio(THREE,renderer,scene);
 studio.setTheme(true);scene.background=new THREE.Color('#101619');scene.fog=new THREE.Fog('#101619',17,48);renderer.toneMappingExposure=.97;scene.environmentIntensity=1.15;studio.floor.position.y=0;studio.floor.material.color.set('#131d23');studio.floor.material.roughness=.85;studio.floor.material.metalness=.02;studio.floor.material.envMapIntensity=.15;
 renderer.shadowMap.type=THREE.PCFShadowMap;
 stage.append(renderer.domElement);
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();onError();});
 const rim=new THREE.DirectionalLight('#ffd2b0',2.4);rim.position.set(-3,4,-3);scene.add(rim);
 const fill=new THREE.DirectionalLight('#d4edff',1.6);fill.position.set(5,4,2);scene.add(fill);
 const material=(color,emissive=false)=>emissive?new THREE.MeshBasicMaterial({color}):new THREE.MeshStandardMaterial({color,metalness:.45,roughness:.45});
 const railMat=material('#dcefff',true),redMat=material('#d92135',true),darkMat=material('#1e2c33');
 const tunnel=new THREE.Group();scene.add(tunnel);
 function box(w,h,d,x,y,z,m,parent=tunnel){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);parent.add(o);return o;}
 for(const z of [-7,-4,0,4,7]){box(.07,3.5,.06,-3.2,1.75,z,railMat);box(.07,3.5,.06,3.2,1.75,z,railMat);box(6.4,.055,.06,0,3.5,z,railMat);}
 box(5.4,.035,17,0,-.025,0,darkMat);for(const x of [-2.8,2.8])box(.022,.008,20,x,.015,0,redMat);
 const beamMat=new THREE.MeshBasicMaterial({color:'#7798a9',transparent:true,opacity:.13,depthWrite:false});
 const streams=new THREE.Group();tunnel.add(streams);
 for(let i=0;i<18;i++){const side=i<9?-1:1,j=i%9,y=.25+(j%3)*.3,x=side*(.6+Math.floor(j/3)*.27);const pts=[];for(let k=0;k<=30;k++){const z=6-k*.4,bulge=Math.exp(-(z*z)/7);pts.push(new THREE.Vector3(x*(1+bulge*.9),y+bulge*.22,z));}const g=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),50,.009,4,false);streams.add(new THREE.Mesh(g,beamMat));}
 tunnel.visible=false;
 const loader=new GLTFLoader();let model,mechanics,garage=null,pose=null;
 const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),45000);
 try{const asset=mobile()?'carro-aula-mobile.glb':'carro-aula.glb';const response=await fetch(import.meta.env.BASE_URL+'assets/'+asset,{signal:abort.signal});if(!response.ok)throw new Error('Modelo HTTP '+response.status);const raw=await response.arrayBuffer();onProgress('Preparando materiais e peças…');const gltf=await loader.parseAsync(raw,'');model=gltf.scene;}catch(e){renderer.dispose();studio.dispose();renderer.domElement.remove();throw e;}finally{clearTimeout(timer);}
 const bounds=new THREE.Box3().setFromObject(model),center=bounds.getCenter(new THREE.Vector3());model.position.set(-center.x,-bounds.min.y,-center.z);scene.add(model);model.updateMatrixWorld(true);
 applyCarMaterials(THREE,model);mechanics=createMechanics(model);applyInteiaBranding(model,mechanics);
 const contactCanvas=document.createElement('canvas');contactCanvas.width=contactCanvas.height=128;const ctx=contactCanvas.getContext('2d'),gradient=ctx.createRadialGradient(64,64,4,64,64,64);gradient.addColorStop(0,'rgba(0,0,0,.7)');gradient.addColorStop(.4,'rgba(0,0,0,.35)');gradient.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);const contactTexture=new THREE.CanvasTexture(contactCanvas),contactMaterial=new THREE.MeshBasicMaterial({map:contactTexture,transparent:true,depthWrite:false});const contacts=new THREE.Group();scene.add(contacts);for(const w of mechanics.wheels){const shadow=new THREE.Mesh(new THREE.PlaneGeometry(1,1.1),contactMaterial);shadow.rotation.x=-Math.PI/2;shadow.position.set(w.pivot.position.x,.006,w.pivot.position.z);contacts.add(shadow);}
 let triangles=0;model.traverse(o=>{if(o.isMesh){triangles+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3;o.castShadow=true;o.receiveShadow=true;}});
 stage.dataset.parts=String(mechanics.records.length);stage.dataset.triangles=String(triangles);stage.dataset.loaded='true';stage.classList.add('loaded');
 // The reused box is scenery. Its monitors are static assets, never live telemetry.
 if(!mobile()) loader.load(import.meta.env.BASE_URL+'assets/box-aula-referencia.glb',g=>{garage=g.scene;garage.updateMatrixWorld(true);garage.traverse(o=>{if(o.isLight)o.intensity*=.3;if(o.isMesh){o.castShadow=false;o.receiveShadow=true;const b=new THREE.Box3().setFromObject(o),c=b.getCenter(new THREE.Vector3()),s=b.getSize(new THREE.Vector3());if(c.y>3||(s.y>2&&(Math.abs(c.x)>5||Math.abs(c.z)>5)))o.visible=false;for(const m of Array.isArray(o.material)?o.material:[o.material]){if(m.color&&!m.emissiveMap)m.color.multiplyScalar(.38);}}});garage.visible=!mobile();scene.add(garage);if(pose){applyPose();renderer.render(scene,camera);}},undefined,e=>console.warn('Box cenográfico indisponível',e.message));
 const target=new THREE.Vector3(),cam=new THREE.Vector3();
 function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h);renderer.setPixelRatio(Math.min(devicePixelRatio,mobile()?1.3:1.6));camera.aspect=w/h;camera.fov=mobile()?43:36;camera.setViewOffset(w,h,mobile()?0:-w*.13,mobile()?h*.24:-h*.035,w,h);camera.updateProjectionMatrix();if(pose)applyPose();}
 function applyPose(){
  camera.position.fromArray(pose.camera);target.fromArray(pose.target);
  cam.copy(camera.position).sub(target).multiplyScalar((mobile()?1.75:1)*(1+pose.explode*(mobile()?.6:.3)));camera.position.copy(target).add(cam);
  camera.lookAt(target);mechanics.setAmount(pose.explode);mechanics.update(0,0,true);mechanics.setDRS(0);mechanics.setSteering(0);
  tunnel.visible=pose.tunnel>.08;streams.visible=pose.tunnel>.6;contacts.visible=pose.explode<.01;if(garage)garage.visible=!mobile()&&pose.tunnel<.5;
  beamMat.opacity=.15*pose.tunnel;stage.dataset.pose=JSON.stringify({camera:pose.camera,explode:pose.explode,tunnel:pose.tunnel});
 }
 resize();
 return {setPose(next){pose=next;applyPose();},resize,render(){renderer.render(scene,camera);stage.dataset.calls=String(renderer.info.render.calls);},dispose(){renderer.dispose();studio.dispose();}};
}
