// Aceita WebGL2 ou WebGL1. A cena usa APIs que Three.js cobre nos dois.
export function detectWebGL(getContext) {
  const probe = getContext || ((type) => {
    const canvas = document.createElement('canvas')
    return canvas.getContext(type)
  })
  try {
    return Boolean(probe('webgl2') || probe('webgl') || probe('experimental-webgl'))
  } catch {
    return false
  }
}
