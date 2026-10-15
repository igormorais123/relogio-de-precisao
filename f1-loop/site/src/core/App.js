import * as THREE from 'three'
import { studioScene } from './Studio.js'
import { createPost } from './Post.js'

export class App {
  constructor(canvas) {
    this.canvas = canvas
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', stencil: false, depth: true })
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.NoToneMapping
    this.renderer.shadowMap.enabled = false
    this.isMobile = Math.min(innerWidth, innerHeight) < 720
    this.dpr = Math.min(devicePixelRatio, this.isMobile ? 1.5 : 2)
    this.renderer.setPixelRatio(this.dpr)

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(32, innerWidth / innerHeight, 0.05, 80)
    this.camera.position.set(0, 0.35, 7.2)
    this.cameraTarget = new THREE.Vector3(0, 0.15, 0)

    const pmrem = new THREE.PMREMGenerator(this.renderer)
    this.envMap = pmrem.fromScene(studioScene(), 0.03).texture
    this.scene.environment = this.envMap
    this.scene.environmentIntensity = 1.05
    pmrem.dispose()

    this.key = new THREE.SpotLight(0xffe8dc, 18, 32, Math.PI / 5, 0.55, 1.4)
    this.key.position.set(3.2, 4.2, 5.2)
    this.rim = new THREE.SpotLight(0x38e8ff, 16, 30, Math.PI / 4, 0.7, 1.4)
    this.rim.position.set(-4.2, 2.2, -3)
    this.fill = new THREE.PointLight(0xd92135, 5, 14, 1.6)
    this.fill.position.set(-2, -1.6, 3)
    this.scene.add(this.key, this.rim, this.fill)

    this.timer = new THREE.Timer()
    this.time = 0
    this.pointer = new THREE.Vector2()
    this.pointerSmooth = new THREE.Vector2()
    this.updaters = []
    this.overlay = new THREE.Scene()
    this.overlay.add(this.camera)
    this.post = createPost(this.renderer, this.scene, this.camera, this.isMobile, this.overlay)

    addEventListener('resize', () => this.resize())
    addEventListener('pointermove', (e) => {
      this.pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1)
    }, { passive: true })
    this.resize()
  }

  resize() {
    const w = innerWidth, h = innerHeight
    this.aspect = w / h
    this.isPortrait = h > w
    this.dpr = Math.min(devicePixelRatio, this.isMobile ? 1.5 : 2)
    this.renderer.setPixelRatio(this.dpr)
    this.camera.aspect = this.aspect
    this.camera.fov = this.isPortrait ? 46 : 32
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h, false)
    this.post.setSize(w, h)
  }

  onUpdate(fn) { this.updaters.push(fn) }

  start() {
    const tick = () => {
      this.timer.update()
      const dt = Math.min(this.timer.getDelta(), 1 / 20)
      this.time += dt
      this.pointerSmooth.lerp(this.pointer, 1 - Math.pow(0.001, dt))
      for (const fn of this.updaters) fn(dt, this.time)
      this.camera.lookAt(this.cameraTarget)
      this.post.render(dt)
    }
    this.renderer.setAnimationLoop(tick)
  }

  async compile() { await this.renderer.compileAsync(this.scene, this.camera) }
}
