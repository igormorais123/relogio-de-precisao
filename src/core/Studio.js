import * as THREE from 'three'

// Ambiente de estúdio para o PMREM: em vez da sala genérica do three, caixas de luz longas e estreitas.
// Metal polido reflete faixas (não um disco cinza), o que dá a leitura de "ouro torneado" e evita o
// reflexo em bolha no cristal. Tudo é emissivo em HDR; a sala em si é preta.
export function studioScene() {
  const scene = new THREE.Scene()
  const room = new THREE.Mesh(new THREE.BoxGeometry(24, 24, 24), new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide }))
  scene.add(room)
  const luz = (w, h, color, k, pos, lookAt) => {
    const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide })
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m)
    p.position.set(...pos)
    p.lookAt(...(lookAt || [0, 0, 0]))
    scene.add(p)
    return p
  }
  // Softbox principal: alto, à direita e à frente, longo na diagonal (faixa quente no bisel e na caixa).
  luz(2.2, 9, 0xfff0d8, 1.25, [5.5, 7.5, 5]).rotation.z = 0.6
  // Faixa fria de recorte, esquerda-trás: separa o relógio do fundo escuro.
  luz(1.2, 8, 0xa9c6ff, 1.6, [-7, 3, -4])
  // Faixa fina quente baixa, esquerda-frente: preenche a parte de baixo da caixa sem lavar o mostrador.
  luz(0.8, 6, 0xffd9a0, 1.6, [-5, -4.5, 5])
  // Duas tiras finas extras: reflexos múltiplos no bisel torneado.
  luz(0.35, 7, 0xfff6e6, 1.6, [2.5, 6, -6]).rotation.z = -0.5
  luz(0.3, 6, 0xd8e6ff, 1.35, [6, -2, 2])
  // Rebatedor discreto no chão: contorno inferior do ouro.
  luz(10, 10, 0x7c8a99, 0.8, [0, -11, 0])
  // Teto amplo e fraco, só para não deixar as normais viradas para cima totalmente pretas.
  luz(14, 14, 0xf0e4d0, 1.0, [0, 11, 0])
  return scene
}
