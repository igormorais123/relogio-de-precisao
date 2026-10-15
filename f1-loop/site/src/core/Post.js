import {
  EffectComposer, RenderPass, EffectPass, BloomEffect, DepthOfFieldEffect, NoiseEffect,
  VignetteEffect, SMAAEffect, ChromaticAberrationEffect, ToneMappingEffect, ToneMappingMode, BlendFunction, KernelSize, SMAAPreset,
} from 'postprocessing'
import { Vector2, HalfFloatType } from 'three'

export function createPost(renderer, scene, camera, isMobile, overlay) {
  const composer = new EffectComposer(renderer, { multisampling: 0, frameBufferType: HalfFloatType })
  composer.addPass(new RenderPass(scene, camera))

  const dof = new DepthOfFieldEffect(camera, { worldFocusDistance: 6.4, worldFocusRange: 2.4, bokehScale: isMobile ? 1.6 : 2.8, resolutionScale: isMobile ? 0.5 : 0.6 })
  const bloom = new BloomEffect({ intensity: 0.22, luminanceThreshold: 0.85, luminanceSmoothing: 0.2, mipmapBlur: true, kernelSize: KernelSize.MEDIUM, radius: 0.55 })
  const chroma = isMobile ? null : new ChromaticAberrationEffect({ offset: new Vector2(0.0007, 0.0005), radialModulation: true, modulationOffset: 0.35 })
  const noise = new NoiseEffect({ blendFunction: BlendFunction.SOFT_LIGHT, premultiply: false })
  noise.blendMode.opacity.value = isMobile ? 0.05 : 0.09
  const vignette = new VignetteEffect({ eskil: false, offset: 0.28, darkness: isMobile ? 0.5 : 0.64 })
  const smaa = new SMAAEffect({ preset: isMobile ? SMAAPreset.MEDIUM : SMAAPreset.HIGH })

  composer.addPass(new EffectPass(camera, dof, bloom))
  if (chroma) composer.addPass(new EffectPass(camera, chroma))
  if (overlay) {
    const over = new RenderPass(overlay, camera)
    over.clear = false
    over.ignoreBackground = true
    composer.addPass(over)
  }
  composer.addPass(new EffectPass(camera, new ToneMappingEffect({ mode: ToneMappingMode.ACES_FILMIC }), noise, vignette))
  composer.addPass(new EffectPass(camera, smaa))

  return {
    composer, dof, bloom, noise, vignette, chroma,
    setSize: (w, h) => composer.setSize(w, h),
    render: (dt) => composer.render(dt),
    focus(distance, range = 2.4) {
      dof.cocMaterial.worldFocusDistance = distance
      dof.cocMaterial.worldFocusRange = range
    },
    setBokeh(scale) { dof.bokehScale = scale },
    setBloom(intensity) { bloom.intensity = intensity },
  }
}
