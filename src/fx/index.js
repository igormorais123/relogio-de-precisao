// Registro dos efeitos extras por capítulo. Cada módulo exporta uma classe com (app, watch, scroll), set(...), update(dt, t).
// import.meta.glob (Vite) carrega o que existir; um módulo ausente ou quebrado não derruba o site.
const modules = import.meta.glob(['./Hotspots.js', './Reference.js', './Curve.js', './Finale.js', './Fog.js', './Blueprint.js', './Sparks.js', './CrownDrag.js', './Plate.js', './Callouts.js'], { eager: true })

const REGISTRO = [
  ['hotspots', './Hotspots.js', 'Hotspots'],
  ['reference', './Reference.js', 'Reference'],
  ['curve', './Curve.js', 'Curve'],
  ['finale', './Finale.js', 'Finale'],
  ['fog', './Fog.js', 'Fog'],
  ['blueprint', './Blueprint.js', 'Blueprint'],
  ['sparks', './Sparks.js', 'Sparks'],
  ['crownDrag', './CrownDrag.js', 'CrownDrag'],
  ['plate', './Plate.js', 'Plate'],
  ['callouts', './Callouts.js', 'Callouts'],
]

export function createExtraFx(app, watch, scroll) {
  const fx = {}
  for (const [key, path, cls] of REGISTRO) {
    const mod = modules[path]
    const Ctor = mod && mod[cls]
    if (!Ctor) continue
    try { fx[key] = new Ctor(app, watch, scroll) } catch (err) { console.error(`fx ${key} falhou ao iniciar`, err) }
  }
  return fx
}
