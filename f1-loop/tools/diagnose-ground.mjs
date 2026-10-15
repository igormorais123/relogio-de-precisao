import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {createMechanics} from '../materia-prima/modulos-atualizados/mechanics.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
async function load(file){
 const b=fs.readFileSync(file),n=b.readUInt32LE(12),j=JSON.parse(b.subarray(20,20+n));
 j.materials=[{}];for(const key of ['images','textures','samplers','extensionsUsed','extensionsRequired'])delete j[key];
 j.meshes.forEach(m=>m.primitives.forEach(p=>p.material=0));
 const str=Buffer.from(JSON.stringify(j)),padded=Buffer.alloc(Math.ceil(str.length/4)*4,32);str.copy(padded);
 const tail=b.subarray(20+n),out=Buffer.alloc(20+padded.length+tail.length);b.copy(out,0,0,12);out.writeUInt32LE(out.length,8);out.writeUInt32LE(padded.length,12);out.writeUInt32LE(0x4e4f534a,16);padded.copy(out,20);tail.copy(out,20+padded.length);
 return (await new GLTFLoader().parseAsync(out.buffer.slice(out.byteOffset,out.byteOffset+out.length),'')).scene;
}
function indexedBounds(object){
 const box=new THREE.Box3(),v=new THREE.Vector3();
 object.traverse(o=>{if(!o.isMesh)return;const pos=o.geometry.attributes.position,idx=o.geometry.index;for(let i=0;i<(idx?.count??pos.count);i++){v.fromBufferAttribute(pos,idx?idx.getX(i):i).applyMatrix4(o.matrixWorld);box.expandByPoint(v);}});
 return box;
}
function inspect(model){
 model.updateMatrixWorld(true);
 const items=[];model.traverse(o=>{if(o.userData.assemblyComponent){const b=new THREE.Box3().setFromObject(o),precise=indexedBounds(o);items.push({name:o.name,source:o.userData.sourceObject,minY:b.min.y,indexedMinY:precise.min.y,maxY:b.max.y});}});
 const fast=new THREE.Box3().setFromObject(model),precise=indexedBounds(model);
 return {modelPosition:model.position.toArray(),totalMinY:fast.min.y,indexedTotalMinY:precise.min.y,maxY:fast.max.y,lowest:items.sort((a,b)=>a.minY-b.minY).slice(0,8),tiresAndFloor:items.filter(i=>/front_tire|rear_tire|floor/.test(i.source))};
}
for(const file of [path.resolve(root,'../../INTEIA-laboratorio-3d/web/assets/carro-movable.glb'),path.resolve(root,'public/assets/carro-aula.glb'),path.resolve(root,'public/assets/carro-aula-mobile.glb')]){
 const model=await load(file),raw=inspect(model),box=new THREE.Box3().setFromObject(model),center=box.getCenter(new THREE.Vector3());
 model.position.set(-center.x,-box.min.y,-center.z);
 const normalized=inspect(model),mechanics=createMechanics(model);mechanics.setAmount(0);mechanics.update(0,0,true);
 const afterMechanics=inspect(model);
 console.log(JSON.stringify({file,modelTranslation:normalized.modelPosition,totalMinY:{raw:raw.totalMinY,normalized:normalized.totalMinY,afterMechanics:afterMechanics.totalMinY,indexedAfterMechanics:afterMechanics.indexedTotalMinY},lowestParts:raw.lowest.slice(0,4).map(i=>i.name),parts:raw.tiresAndFloor.map(i=>({name:i.name,raw:i.minY,normalized:normalized.tiresAndFloor.find(n=>n.name===i.name).minY,afterMechanics:afterMechanics.tiresAndFloor.find(n=>n.name===i.name).minY,indexedAfterMechanics:afterMechanics.tiresAndFloor.find(n=>n.name===i.name).indexedMinY}))},null,2));
}
const garage=await load(path.resolve(root,'public/assets/box-aula-referencia.glb'));garage.updateMatrixWorld(true);const ground=[];
garage.traverse(o=>{if(!o.isMesh)return;const b=new THREE.Box3().setFromObject(o),s=b.getSize(new THREE.Vector3());if(b.min.y<.08&&b.max.y<.15&&b.min.x<.8&&b.max.x>-.8&&b.min.z<2&&b.max.z>-2)ground.push({name:o.name,min:b.min.toArray(),max:b.max.toArray(),size:s.toArray()});});
console.log(JSON.stringify({boxSurfacesUnderCar:ground},null,2));
