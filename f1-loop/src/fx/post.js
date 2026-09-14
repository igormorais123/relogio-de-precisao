import {
  EffectComposer, RenderPass, EffectPass, Effect, BloomEffect, DepthOfFieldEffect, NoiseEffect,
  VignetteEffect, SMAAEffect, ChromaticAberrationEffect, ToneMappingEffect, ToneMappingMode,
  BlendFunction, KernelSize, SMAAPreset,
} from 'postprocessing';
import {HalfFloatType, Uniform, Vector2, Vector3} from 'three';
import {WIPE_GLSL, wipeUniforms} from './wipe-clip.js';

// Film skin (R9) plus the diagonal wipe edge (R6) and a per-chapter grade (R10):
// cold shadows, warm highlights. Runs after tone mapping, before grain.
const cinemaFragment = /* glsl */`
uniform float uBand;
uniform float uTime;
uniform vec3 uShadow;
uniform vec3 uHigh;
uniform float uGrade;
${WIPE_GLSL}
float cinemaHash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){
  vec3 c=inputColor.rgb;
  float l=dot(c,vec3(.2126,.7152,.0722));
  c=mix(c,c*mix(uShadow,uHigh,smoothstep(.05,.7,l)),uGrade);
  if(uBand>0.){
    float s=wipeSigned(gl_FragCoord.xy);
    float grit=cinemaHash(floor(gl_FragCoord.xy*.5)+floor(uTime*24.));
    float width=.028*uBand;
    float core=1.-smoothstep(width*.35,width,abs(s+width*.35));
    c=mix(c,vec3(.018,.024,.03)*(.6+grit*.8),core*.92*uBand);
    float hair=1.-smoothstep(0.,.0022,abs(s-width*.02));
    c+=vec3(.85,.08,.14)*hair*uBand*.9;
  }
  outputColor=vec4(c,inputColor.a);
}`;

class CinemaEffect extends Effect {
  constructor() {
    super('CinemaEffect', cinemaFragment, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['uBand', new Uniform(0)], ['uTime', new Uniform(0)], ['uGrade', new Uniform(1)],
        ['uShadow', new Uniform(new Vector3(.9, 1.0, 1.06))], ['uHigh', new Uniform(new Vector3(1.05, 1.0, .94))],
        ['uWipePos', wipeUniforms.uWipePos], ['uWipeRes', wipeUniforms.uWipeRes],
      ]),
    });
  }
}

export function createPost(renderer, scene, camera, {mobile}) {
  const composer = new EffectComposer(renderer, {multisampling: 0, frameBufferType: HalfFloatType});
  composer.addPass(new RenderPass(scene, camera));
  const dof = mobile ? null : new DepthOfFieldEffect(camera, {focusDistance: 7, focusRange: 2.4, bokehScale: 3, resolutionScale: .6});
  const bloom = new BloomEffect({intensity: .55, luminanceThreshold: .82, luminanceSmoothing: .25, mipmapBlur: true, kernelSize: KernelSize.MEDIUM, radius: .68});
  composer.addPass(new EffectPass(camera, ...(dof ? [dof, bloom] : [bloom])));
  const chroma = mobile ? null : new ChromaticAberrationEffect({offset: new Vector2(.0007, .0005), radialModulation: true, modulationOffset: .4});
  if (chroma) composer.addPass(new EffectPass(camera, chroma));
  const tone = new ToneMappingEffect({mode: ToneMappingMode.AGX});
  const cinema = new CinemaEffect();
  const noise = new NoiseEffect({blendFunction: BlendFunction.SOFT_LIGHT, premultiply: false});
  noise.blendMode.opacity.value = mobile ? .06 : .11;
  const vignette = new VignetteEffect({offset: .24, darkness: mobile ? .55 : .7});
  composer.addPass(new EffectPass(camera, tone, cinema, noise, vignette));
  composer.addPass(new EffectPass(camera, new SMAAEffect({preset: mobile ? SMAAPreset.MEDIUM : SMAAPreset.HIGH})));
  const u = name => cinema.uniforms.get(name);
  return {
    composer, dof, bloom,
    setSize(w, h) { composer.setSize(w, h); },
    render(dt) { composer.render(dt); },
    // Focus follows a world point: the director always says what is sharp (R8).
    focus(distance, range, bokeh) {
      if (!dof) return;
      dof.cocMaterial.focusDistance = distance;
      dof.cocMaterial.focusRange = range;
      dof.bokehScale = bokeh;
    },
    setBand(v, time) { u('uBand').value = v; u('uTime').value = time; },
    setGrade(shadow, high, amount = 1) { u('uShadow').value.set(...shadow); u('uHigh').value.set(...high); u('uGrade').value = amount; },
    setBloom(intensity) { bloom.intensity = intensity; },
    dispose() { composer.dispose(); },
  };
}
