import {
  EffectComposer, RenderPass, EffectPass, BloomEffect, DepthOfFieldEffect, NoiseEffect,
  VignetteEffect, SMAAEffect, ChromaticAberrationEffect, ToneMappingEffect, ToneMappingMode, BlendFunction, KernelSize, SMAAPreset,
} from 'postprocessing'
import { Vector2, HalfFloatType } from 'three'

// Pipeline de pós: DOF por depth buffer, bloom para rubis e partículas, grão, vinheta, aberração leve, SMAA.
export function createPost(renderer, scene, camera, isMobile, overlay) {
  const composer = new EffectComposer(renderer, { multisampling: 0, frameBufferType: HalfFloatType })
  composer.addPass(new RenderPass(scene, camera))

  const dof = new DepthOfFieldEffect(camera, { worldFocusDistance: 6, worldFocusRange: 2.2, bokehScale: isMobile ? 1.8 : 3.4, resolutionScale: isMobile ? 0.5 : 0.6 })
  const bloom = new BloomEffect({ intensity: 0.28, luminanceThreshold: 1.0, luminanceSmoothing: 0.2, mipmapBlur: true, kernelSize: KernelSize.MEDIUM, radius: 0.6 })
  const chroma = new ChromaticAberrationEffect({ offset: new Vector2(0.0008, 0.0006), radialModulation: true, modulationOffset: 0.35 })
  const noise = new NoiseEffect({ blendFunction: BlendFunction.SOFT_LIGHT, premultiply: false })
  noise.blendMode.opacity.value = 0.08
  const vignette = new VignetteEffect({ eskil: false, offset: 0.28, darkness: 0.62 })
  const smaa = new SMAAEffect({ preset: SMAAPreset.HIGH })

  composer.addPass(new EffectPass(camera, dof, bloom))
  composer.addPass(new EffectPass(camera, chroma))
  if (overlay) {
    // Passo de sobreposição sem limpar cor: os títulos entram já desfocados o fundo, nítidos eles mesmos.
    const over = new RenderPass(overlay, camera)
    over.clear = false
    over.ignoreBackground = true
    composer.addPass(over)
  }
  const tone = new ToneMappingEffect({ mode: ToneMappingMode.ACES_FILMIC })
  composer.addPass(new EffectPass(camera, tone, noise, vignette))
  // SMAA em passe próprio: no mesmo passe ele reamostra o buffer de entrada e descarta tone mapping e grão nas bordas.
  composer.addPass(new EffectPass(camera, smaa))

  return {
    composer, dof, bloom, noise, vignette, chroma,
    setSize: (w, h) => composer.setSize(w, h),
    render: (dt) => composer.render(dt),
    // Foco em distância do mundo: os capítulos chamam com a distância câmera→herói.
    focus(distance, range = 2.2) {
      dof.cocMaterial.worldFocusDistance = distance
      dof.cocMaterial.worldFocusRange = range
    },
    setBokeh(scale) { dof.bokehScale = scale },
    setBloom(intensity) { bloom.intensity = intensity },
  }
}
