/** Lossless meshopt packaging of the original didactic power unit. See POWER-UNIT.md. */

import fs from 'node:fs'; import path from 'node:path';
import {createRequire} from 'node:module'; import {pathToFileURL,fileURLToPath} from 'node:url';
if(!process.env.F1_ASSET_TOOL_ROOT)throw Error('Set F1_ASSET_TOOL_ROOT to a project with @gltf-transform/core, @gltf-transform/extensions and meshoptimizer.');
const require=createRequire(path.join(process.env.F1_ASSET_TOOL_ROOT,'package.json'));
const {NodeIO}=await import(pathToFileURL(require.resolve('@gltf-transform/core')).href);
const {ALL_EXTENSIONS,EXTMeshoptCompression}=await import(pathToFileURL(require.resolve('@gltf-transform/extensions')).href);
const {MeshoptEncoder,MeshoptDecoder}=await import(pathToFileURL(require.resolve('meshoptimizer')).href);
await Promise.all([MeshoptEncoder.ready,MeshoptDecoder.ready]);
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.encoder':MeshoptEncoder,'meshopt.decoder':MeshoptDecoder});
const file=process.env.ENGINE_GLB || path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../public/assets/power-unit-v1.glb');const doc=await io.read(file);
// Blender NLA uses frame 1 / 24s as its first timestamp. Normalize the clip to [0,8].
const times=new Set(doc.getRoot().listAnimations().flatMap(a=>a.listSamplers().map(s=>s.getInput())));
const start=Math.min(...[...times].map(t=>t.getArray()[0]));
for(const t of times)t.setArray(Float32Array.from(t.getArray(),v=>Math.round((v-start)*24)/24));
const payloads=d=>{
 const indices=new Set(d.getRoot().listMeshes().flatMap(m=>m.listPrimitives().map(p=>p.getIndices())));
 return d.getRoot().listAccessors().map(a=>{
  const v=Array.from(a.getArray());
  // Meshopt may cyclically rotate each triangle's first vertex; winding and topology stay equal.
  if(indices.has(a))for(let i=0;i<v.length;i+=3){const t=v.slice(i,i+3);const k=t.indexOf(Math.min(...t));v.splice(i,3,...t.slice(k),...t.slice(0,k));}
  return JSON.stringify(v);
 }).sort();
};
const arrays=payloads(doc);
// No quantize() or lossy FILTER transform: compress existing float32/indices losslessly.
doc.createExtension(EXTMeshoptCompression).setRequired(true).setEncoderOptions({method:EXTMeshoptCompression.EncoderMethod.QUANTIZE});
const bytes=await io.writeBinary(doc);const decoded=await io.readBinary(bytes);
const after=payloads(decoded);
if(JSON.stringify(arrays)!==JSON.stringify(after))throw Error('Geometry or animation payload changed during compression');
const animation=decoded.getRoot().listAnimations().find(a=>a.getName()==='running');
if(!animation || animation.listChannels().length!==19)throw Error('Expected running clip with 19 channels');
const channels=new Map(animation.listChannels().map(c=>[c.getTargetNode().getName()+':'+c.getTargetPath(),c.getSampler().getOutput()]));
const sample=(name,path,index)=>{const a=channels.get(name+':'+path);const n=a.getElementSize();return Array.from(a.getArray().slice(index*n,index*n+n));};
const rotate=(q,v)=>{const [x,y,z,w]=q,[a,b,c]=v;const t=[2*(y*c-z*b),2*(z*a-x*c),2*(x*b-y*a)];return [a+w*t[0]+y*t[2]-z*t[1],b+w*t[1]+z*t[0]-x*t[2],c+w*t[2]+x*t[1]-y*t[0]];};
const dist=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
let maxRodTipError=0,maxLoopError=0;
const count=channels.get('piston_01:translation').getCount();
for(let i=1;i<=6;i++){
 const id=String(i).padStart(2,'0');
 for(let f=0;f<count;f++){
  const piston=sample('piston_'+id,'translation',f),rod=sample('connecting_rod_'+id,'translation',f),q=sample('connecting_rod_'+id,'rotation',f);
  const tip=rotate(q,[0,.105,0]).map((v,j)=>v+rod[j]);maxRodTipError=Math.max(maxRodTipError,dist(tip,piston));
 }
 maxLoopError=Math.max(maxLoopError,dist(sample('piston_'+id,'translation',0),sample('piston_'+id,'translation',count-1)));
}
if(maxRodTipError>1e-6 || maxLoopError>1e-6)throw Error('Exported mechanism failed: '+JSON.stringify({maxRodTipError,maxLoopError}));
const required=['block','head_left','head_right','intake','exhaust_left','exhaust_right','turbo','electric','rotating'].map(n=>'assembly_'+n);
const names=new Set(decoded.getRoot().listNodes().map(n=>n.getName()));
if(required.some(n=>!names.has(n)))throw Error('An exploded assembly was lost');
fs.writeFileSync(file,bytes);
console.log('MESHOPT_LOSSLESS '+JSON.stringify({bytes:bytes.byteLength,numericPayloadsIdentical:true,samples:count,maxRodTipError,maxLoopError,assemblies:required.length}));
