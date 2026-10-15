import * as THREE from 'three'

const RED = 0xd92135
const CARBON = 0x1a1d21
const RUBBER = 0x141618
const ICE = 0xf0f2f3
const GREEN = 0x4dffb0
const AMBER = 0xff8a2a

export class Car {
  constructor(scene, { isMobile = false } = {}) {
    this.group = new THREE.Group()
    this.parts = []
    this.state = { explode: 0, scatter: 0, speed: 0, ghost: 0, squat: 0, scale: 1, drs: 0, floorSwap: 0, floorGlow: 0, pitJack: 0, tunnel: 0 }
    this.t = 0
    this.scatterSeeds = []
    this._seed = 11

    const red = new THREE.MeshPhysicalMaterial({ color: RED, metalness: 0.55, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.1, iridescence: 0.08 })
    const carbon = new THREE.MeshPhysicalMaterial({ color: CARBON, metalness: 0.7, roughness: 0.42, clearcoat: 0.85, clearcoatRoughness: 0.2, envMapIntensity: 0.9 })
    const rubber = new THREE.MeshStandardMaterial({ color: RUBBER, metalness: 0.15, roughness: 0.72 })
    const ice = new THREE.MeshPhysicalMaterial({ color: ICE, metalness: 0.4, roughness: 0.25, envMapIntensity: 1 })
    const halo = new THREE.MeshPhysicalMaterial({ color: 0x8a9099, metalness: 1, roughness: 0.35 })
    this.floorMat = new THREE.MeshPhysicalMaterial({ color: CARBON, metalness: 0.65, roughness: 0.4, clearcoat: 0.7, emissive: new THREE.Color(GREEN), emissiveIntensity: 0 })
    this.materials = { red, carbon, rubber, ice, halo }

    const add = (name, mesh, home, apart) => {
      const g = new THREE.Group()
      g.name = name
      g.add(mesh)
      g.userData = { home: new THREE.Vector3(...home), apart: new THREE.Vector3(...apart) }
      this.group.add(g)
      this.parts.push(g)
      const rnd = () => { this._seed = (this._seed * 1664525 + 1013904223) >>> 0; return this._seed / 4294967296 }
      this.scatterSeeds.push(new THREE.Vector3(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1).normalize())
      return g
    }

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.28, 2.05), red)
    body.scale.set(1, 1, 1)
    this.body = add('main_body', body, [0, 0.28, 0], [0, 0.85, 0])

    const nose = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.95), red)
    this.nose = add('nose', nose, [0, 0.22, 1.38], [0, 0.15, 2.1])

    const cockpit = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.16, 0.55), carbon)
    this.cockpit = add('cockpit', cockpit, [0, 0.46, 0.15], [0, 1.1, 0.15])

    const haloMesh = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.025, 8, 24, Math.PI), halo)
    haloMesh.rotation.x = Math.PI / 2
    this.halo = add('halo', haloMesh, [0, 0.58, 0.28], [0, 1.25, 0.28])

    const fw = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.04, 0.28), carbon)
    this.frontWing = add('front_wing_top', fw, [0, 0.12, 1.72], [0, 0.05, 2.45])

    const rw = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.05, 0.22), carbon)
    this.rearWing = add('rear_wing_main_part', rw, [0, 0.72, -1.15], [0, 1.35, -1.55])

    const drs = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.03, 0.12), carbon)
    this.drsFlap = add('rear_wing_drs', drs, [0, 0.8, -1.22], [0, 1.5, -1.7])

    const floor = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.035, 2.15), this.floorMat)
    this.floor = add('floor', floor, [0, 0.08, -0.05], [0, -0.55, -0.05])

    this.wheels = []
    const wheelGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.16, 18)
    const places = [
      ['front_tire_L', [-0.48, 0.22, 0.95], [-1.15, 0.22, 0.95]],
      ['front_tire_R', [0.48, 0.22, 0.95], [1.15, 0.22, 0.95]],
      ['rear_tire_L', [-0.5, 0.24, -0.95], [-1.2, 0.24, -0.95]],
      ['rear_tire_R', [0.5, 0.24, -0.95], [1.2, 0.24, -0.95]],
    ]
    for (const [name, home, apart] of places) {
      const mesh = new THREE.Mesh(wheelGeo, rubber)
      mesh.rotation.z = Math.PI / 2
      const g = add(name, mesh, home, apart)
      this.wheels.push(g)
    }

    const wheel = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.22), ice)
    this.wheel = add('steering_wheel_main', wheel, [0, 0.5, 0.32], [0.55, 1.05, 0.55])

    this.group.scale.setScalar(1.05)
    scene.add(this.group)

    this.ghostGroup = this.group.clone(true)
    this.ghostGroup.traverse((o) => {
      if (o.isMesh) {
        o.material = new THREE.MeshBasicMaterial({ color: 0x38e8ff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
      }
    })
    this.ghostGroup.visible = false
    scene.add(this.ghostGroup)

    if (!isMobile) {
      const stream = new THREE.Group()
      const lineMat = new THREE.LineBasicMaterial({ color: 0x38e8ff, transparent: true, opacity: 0.0 })
      for (let i = 0; i < 18; i++) {
        const pts = [new THREE.Vector3(-0.7 + (i % 6) * 0.28, 0.08 + Math.floor(i / 6) * 0.18, 2.1), new THREE.Vector3(-0.7 + (i % 6) * 0.28, 0.12 + Math.floor(i / 6) * 0.12, -2.2)]
        const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat.clone())
        stream.add(line)
      }
      this.stream = stream
      this.stream.visible = false
      this.group.add(stream)
    }
  }

  apply() {
    const s = this.state
    const explode = THREE.MathUtils.clamp(s.explode, 0, 1)
    const scatter = THREE.MathUtils.clamp(s.scatter, 0, 1)
    this.parts.forEach((part, i) => {
      const home = part.userData.home
      const apart = part.userData.apart
      part.position.lerpVectors(home, apart, explode)
      if (scatter > 0) {
        const seed = this.scatterSeeds[i]
        part.position.x += seed.x * scatter * 1.4
        part.position.y += seed.y * scatter * 1.1
        part.position.z += seed.z * scatter * 1.2
      }
    })
    this.group.position.y = s.pitJack * 0.12 + s.squat * 0.08
    this.group.scale.setScalar(0.95 * (s.scale || 1))
    const spin = this.t * s.speed * 18
    for (const w of this.wheels) w.rotation.x = spin
    this.drsFlap.rotation.x = -s.drs * 0.45
    this.floorMat.emissiveIntensity = s.floorGlow * 0.85
    this.floorMat.emissive.setHex(s.floorSwap > 0.5 ? AMBER : GREEN)
    this.floorMat.color.setHex(s.floorSwap > 0.5 ? 0x2a2218 : CARBON)

    this.ghostGroup.visible = s.ghost > 0.02
    this.ghostGroup.position.copy(this.group.position)
    this.ghostGroup.position.x += 0.35 * s.ghost
    this.ghostGroup.quaternion.copy(this.group.quaternion)
    this.ghostGroup.scale.copy(this.group.scale)
    this.ghostGroup.traverse((o) => {
      if (o.material && o.material.opacity !== undefined) o.material.opacity = s.ghost * 0.28
    })
    if (this.stream) {
      this.stream.visible = s.tunnel > 0.02
      this.stream.children.forEach((line) => { line.material.opacity = s.tunnel * 0.45 })
    }
  }

  update(dt) {
    this.t += dt
    this.apply()
  }
}
