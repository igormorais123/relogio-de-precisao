import * as THREE from 'three';

// Fresnel overlay on the parts a chapter talks about ("one change", "revised
// floor"). Shares the part geometry, so it follows explode motion for free and
// never touches the car's shared materials.
export function createHighlight(records, color) {
  const uniforms = {uAmount: {value: 0}, uTime: {value: 0}, uColor: {value: new THREE.Color(color)}};
  const material = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -2,
    vertexShader: /* glsl */`
      varying vec3 vNormal;varying vec3 vView;varying vec3 vWorld;
      void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vNormal=normalize(normalMatrix*normal);vView=-mv.xyz;vWorld=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*mv;}`,
    fragmentShader: /* glsl */`
      uniform float uAmount;uniform float uTime;uniform vec3 uColor;varying vec3 vNormal;varying vec3 vView;varying vec3 vWorld;
      void main(){
        // A thin scan line crossing the part carries the emphasis; the rim stays a faint trace because thin floor plates
        // have normals that make the whole surface read as rim, which looked like an editor selection.
        float rim=pow(1.-abs(dot(normalize(vNormal),normalize(vView))),4.5);
        float scan=smoothstep(.955,1.,fract(vWorld.z*1.2-uTime*.35));
        float a=uAmount*(rim*.07+scan*.16);
        gl_FragColor=vec4(uColor*a*1.6,1.);
      }`,
  });
  const overlays = [];
  for (const record of records) record.root.traverse(o => {
    if (!o.isMesh || o.userData.inteiaDecal || o.userData.highlightOverlay) return;
    const overlay = new THREE.Mesh(o.geometry, material);
    overlay.userData.highlightOverlay = true;
    overlay.renderOrder = 4;
    overlay.visible = false;
    o.add(overlay);
    overlays.push(overlay);
  });
  return {
    count: overlays.length,
    set(amount, time, chapter=1) {
      uniforms.uColor.value.set(chapter===4 ? '#f27659' : color);
      uniforms.uAmount.value = amount;
      uniforms.uTime.value = time;
      const on = amount > .002;
      for (const o of overlays) o.visible = on;
    },
    dispose() { overlays.forEach(o => o.removeFromParent()); material.dispose(); },
  };
}
