import * as THREE from 'three'

export function studioScene() {
  const scene = new THREE.Scene()
  const room = new THREE.Mesh(new THREE.BoxGeometry(24, 24, 24), new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide }))
  scene.add(room)
  const luz = (w, h, color, k, pos) => {
    const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide })
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m)
    p.position.set(...pos)
    p.lookAt(0, 0, 0)
    scene.add(p)
  }
  luz(2.4, 9, 0xffe8dc, 1.2, [5.5, 7.5, 5])
  luz(1.2, 8, 0xa9c6ff, 1.5, [-7, 3, -4])
  luz(0.8, 6, 0xff6a7a, 1.1, [-5, -4.5, 5])
  luz(0.35, 7, 0xfff6e6, 1.4, [2.5, 6, -6])
  luz(14, 14, 0xf0e4d0, 0.85, [0, 11, 0])
  return scene
}
