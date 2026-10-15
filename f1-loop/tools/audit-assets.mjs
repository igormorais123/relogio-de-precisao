import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.resolve(root, '../../INTEIA-laboratorio-3d');
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const slash = file => file.replaceAll('\\', '/');
const entry = file => ({ path: slash(path.relative(root, file)), bytes: fs.statSync(file).size, sha256: sha(file) });
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const folderMap = { 'modulos-lab': 'web/src', 'modulos-atualizados': 'web/src', 'identidade': 'identidade', 'ambientes': 'ambientes', 'texturas': 'texturas', 'docs-lab': 'docs' };
const copiedSources = [];
for (const [localFolder, sourceFolder] of Object.entries(folderMap)) {
  const local = path.resolve(root, 'materia-prima', localFolder);
  if (!fs.existsSync(local)) continue;
  for (const file of walk(local)) {
    const relative = path.relative(local, file);
    const origin = path.resolve(sourceRoot, relative === 'componentes-origem.json' ? 'documentacao' : sourceFolder, relative);
    if (!fs.existsSync(origin)) { copiedSources.push({ ...entry(file), source: origin, comparison: 'source-not-found' }); continue; }
    const current = sha(origin);
    copiedSources.push({ ...entry(file), source: origin, sourceSha256: current, comparison: current === sha(file) ? 'identical' : 'different' });
  }
}
const assetDir = path.resolve(root, 'public/assets');
fs.copyFileSync(path.resolve(sourceRoot, 'ambientes/INTEIA-box-laboratorio.glb'), path.resolve(assetDir, 'box-aula-referencia.glb'));
for (const [name, destination] of [['LICENSE', 'INTEIA-LICENSE.txt'], ['THIRD-PARTY-NOTICES.md', 'INTEIA-THIRD-PARTY-NOTICES.md']]) fs.copyFileSync(path.resolve(sourceRoot, name), path.resolve(assetDir, destination));
const assetNames = [
  'carro-aula.glb', 'carro-aula.proveniencia.json', 'carro-aula.validacao.json',
  'carro-aula-mobile.glb', 'carro-aula-mobile.proveniencia.json', 'carro-aula-mobile.validacao.json',
  'INTEIA-LICENSE.txt', 'INTEIA-THIRD-PARTY-NOTICES.md', 'box-aula-referencia.glb'
];
const sourceAssets = ['web/assets/carro-movable.glb', 'modelos/INTEIA_F1_estatico.glb', 'modelos/INTEIA_F1_animado.glb', 'ambientes/INTEIA-box-laboratorio.glb'].map(name => {
  const file = path.resolve(sourceRoot, name), bytes = fs.readFileSync(file);
  const json = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)));
  const triangleCount = json.meshes.reduce((sum, mesh) => sum + mesh.primitives.reduce((subtotal, primitive) => subtotal + (primitive.indices !== undefined ? json.accessors[primitive.indices].count : json.accessors[primitive.attributes.POSITION].count) / 3, 0), 0);
  return { path: file, bytes: bytes.length, sha256: sha(file), meshes: json.meshes.length, nodes: json.nodes.length, triangleCount, animations: json.animations?.map(a => ({ name: a.name, channels: a.channels.length })) || [] };
});
const simplifier = path.resolve(root, '../node_modules/three/examples/jsm/libs/meshopt_simplifier.module.js');
const report = {
  checkedAt: new Date().toISOString(), sourceRoot,
  sourceHead: process.env.ASSET_SOURCE_HEAD || null,
  sourceWorkingTreeStatus: process.env.ASSET_SOURCE_STATUS ?? null,
  sourceReadOnly: true, sourceAssets, copiedSources,
  derivedAssets: assetNames.map(name => entry(path.resolve(assetDir, name))),
  unchangedCopies: [{ path: 'public/assets/box-aula-referencia.glb', source: path.resolve(sourceRoot, 'ambientes/INTEIA-box-laboratorio.glb'), identical: sha(path.resolve(assetDir, 'box-aula-referencia.glb')) === sha(path.resolve(sourceRoot, 'ambientes/INTEIA-box-laboratorio.glb')) }],
  toolchain: { three: JSON.parse(fs.readFileSync(path.resolve(root, '../node_modules/three/package.json'))).version, meshoptimizerBuild: '1.1, bundled in installed Three.js', simplifierSha256: sha(simplifier), runtimeDecoderRequired: false },
  reproducibility: ['tools/optimize-car.mjs', 'tools/verify-car.mjs', 'tools/audit-assets.mjs'].map(name => entry(path.resolve(root, name))),
  scope: 'SHA-256 verifies the listed bytes only. It does not certify visual quality, licensing, physical fidelity or device performance.'
};
fs.writeFileSync(path.resolve(assetDir, 'manifesto-assets.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ head: report.sourceHead, sourceWorkingTreeStatus: report.sourceWorkingTreeStatus, copied: copiedSources.length, different: copiedSources.filter(item => item.comparison !== 'identical').map(item => ({ path: item.path, comparison: item.comparison })), sourceAssets }, null, 2));
