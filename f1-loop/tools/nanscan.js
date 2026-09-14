(()=>{
  const s=window.__scene, c=s.post.composer, r=c.getRenderer(), cam=c.passes[0].mainCamera||c.passes[0].camera;
  const w=720, h=450;
  const rt=new c.inputBuffer.constructor(w,h,{type:1015});
  const buf=new Float32Array(w*h*4);
  const scan=()=>{r.setRenderTarget(rt);r.setClearColor(0x000000,1);r.clear();r.render(s.scene,cam);r.readRenderTargetPixels(rt,0,0,w,h,buf);r.setRenderTarget(null);
    let bad=0,over=0,neg=0,sum=0,max=0,first=[];for(let i=0;i<w*h;i++){let px=false;for(let k=0;k<4;k++){const v=buf[i*4+k];if(!isFinite(v)){bad++;px=true}else if(v>65000){over++;px=true}else if(v< -0.001){neg++;px=true}if(k<3&&isFinite(v)){sum+=v;if(v>max)max=v}}if(px&&first.length<5)first.push([i%w,h-1-Math.floor(i/w),[...buf.slice(i*4,i*4+4)].map(x=>+x.toFixed?.(2)||String(x))])}
    return {bad,over,neg,mean:+(sum/(w*h*3)).toFixed(4),max:+max.toFixed(1),first};};
  const out={base:scan()};
  const car=s.scene.children[6]; const byMat=new Map();
  car.traverse(o=>{if(o.isMesh){const n=[].concat(o.material)[0].name||[].concat(o.material)[0].type;(byMat.get(n)||byMat.set(n,[]).get(n)).push(o)}});
  const per={};
  const b=out.base.bad+out.base.over+out.base.neg;
  for(const [n,list] of byMat){list.forEach(o=>o.visible=false);const k=scan();const t=k.bad+k.over+k.neg;if(t!==b)per[n]=t;list.forEach(o=>o.visible=true)}
  out.perMaterialHidden=per;
  rt.dispose();
  return JSON.stringify(out);
})()
