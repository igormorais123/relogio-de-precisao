# Graph Report - relogio-de-precisao  (2026-09-14)

## Corpus Check
- 101 files · ~975,243 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 594 nodes · 976 edges · 40 communities (27 shown, 13 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2abb8d43`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- three
- garage-preview.js
- boot
- src/core/Director.js
- Reference.js
- f1-loop/src/main.js
- world/garage.js
- Watch.js
- CrownDrag
- Scroll
- site/src/data/narrativa.js
- Curve
- Callouts
- Sparks
- vite
- scene.js
- learning/index.js
- src/core/Director.js
- tunnel-preview.js
- three
- cinema.test.mjs
- wind-tunnel.js
- applyCarMaterials
- App
- modulos-lab/garage.js
- modulos-lab/studio.js
- 08-loop-complementar/capture.mjs
- Finale
- 06-avaliacao/capture.mjs
- functional.mjs
- shots.js
- Fog
- Background
- Finale
- Fog
- close-framing-candidate.js
- monitor-close-candidate.js
- functional.mjs

## God Nodes (most connected - your core abstractions)
1. `three` - 51 edges
2. `createScene()` - 16 edges
3. `boot()` - 16 edges
4. `createTunnel()` - 12 edges
5. `applyCarMaterials()` - 11 edges
6. `boot()` - 11 edges
7. `Hotspots` - 11 edges
8. `sampleStory()` - 10 edges
9. `node:test` - 10 edges
10. `node:assert/strict` - 10 edges

## Surprising Connections (you probably didn't know these)
- `render()` --calls--> `applyCarMaterials()`  [EXTRACTED]
  f1-loop/dev/assets-compare.js → f1-loop/materia-prima/modulos-atualizados/studio.js
- `loadCar()` --calls--> `applyCarMaterials()`  [EXTRACTED]
  f1-loop/dev/garage-preview.js → f1-loop/materia-prima/modulos-atualizados/studio.js
- `loadCar()` --calls--> `applyCarMaterials()`  [EXTRACTED]
  f1-loop/dev/tunnel-preview.js → f1-loop/materia-prima/modulos-atualizados/studio.js
- `createScene()` --calls--> `applyInteiaBranding()`  [EXTRACTED]
  f1-loop/src/scene.js → f1-loop/materia-prima/modulos-atualizados/branding.js
- `createScene()` --calls--> `createMechanics()`  [EXTRACTED]
  f1-loop/src/scene.js → f1-loop/materia-prima/modulos-atualizados/mechanics.js

## Import Cycles
- 1-file cycle: `f1-loop/tools/optimize-power-unit.mjs -> f1-loop/tools/optimize-power-unit.mjs`
- 1-file cycle: `src/core/App.js -> src/core/App.js`
- 1-file cycle: `src/core/Post.js -> src/core/Post.js`
- 1-file cycle: `src/core/Scroll.js -> src/core/Scroll.js`
- 1-file cycle: `src/core/Title.js -> src/core/Title.js`
- 1-file cycle: `tests/cameraPath.test.js -> tests/cameraPath.test.js`
- 1-file cycle: `vite.config.js -> vite.config.js`
- 1-file cycle: `f1-loop/tools/build-power-unit.py -> f1-loop/tools/build-power-unit.py`
- 2-file cycle: `src/core/App.js -> src/core/Post.js -> src/core/App.js`
- 2-file cycle: `src/core/App.js -> src/core/Studio.js -> src/core/App.js`

## Communities (40 total, 13 thin omitted)

### Community 0 - "three"
Cohesion: 0.13
Nodes (24): frame(), goto(), HOTSPOTS, inspectEngineButton, lastTime, learningLab, loadScene(), measure() (+16 more)

### Community 1 - "garage-preview.js"
Cohesion: 0.07
Nodes (24): BLOCOS, CAPITULOS, PAGINAS, PESOS, Background, criarRegistro(), FASES, registro (+16 more)

### Community 2 - "boot"
Cohesion: 0.08
Nodes (32): caliperGeometry(), discGeometry(), discTexture(), enhanceCar(), localVaryings(), paintShader(), rimShader(), tyreShader() (+24 more)

### Community 3 - "src/core/Director.js"
Cohesion: 0.09
Nodes (14): createGarage(), drawBrand(), glyphs, CASE_CLAIMS, CASE_SOURCE, createGarage(), DECISIONS, FALLBACK_LABELS (+6 more)

### Community 4 - "Reference.js"
Cohesion: 0.11
Nodes (12): troika-three-text, FONT_BODY, FONT_DISPLAY, Blueprint, COTAS, RAIOS, virg(), ACO (+4 more)

### Community 5 - "f1-loop/src/main.js"
Cohesion: 0.06
Nodes (26): criarRegistro(), FASES, registro, storageOk(), PESOS, preloadFonts(), Title, withTimeout() (+18 more)

### Community 6 - "world/garage.js"
Cohesion: 0.13
Nodes (22): bpy, bevel(), bolt(), cube(), curved(), cyl(), empty(), plate_label() (+14 more)

### Community 7 - "Watch.js"
Cohesion: 0.15
Nodes (12): clamp(), mix(), pose(), sampleCameraPose(), segment(), smooth(), Director, ease() (+4 more)

### Community 9 - "Scroll"
Cohesion: 0.24
Nodes (18): check(), esc(), mountLearning(), option(), renderLearningMarkup(), select(), stage(), written() (+10 more)

### Community 10 - "site/src/data/narrativa.js"
Cohesion: 0.08
Nodes (18): inputs, nav, sections, after, animation, arrays, channels, count (+10 more)

### Community 11 - "Curve"
Cohesion: 0.12
Nodes (15): cam, camera, clock, frame(), garage, hud, key, measure() (+7 more)

### Community 12 - "Callouts"
Cohesion: 0.12
Nodes (12): buffer, cam, camera, hud, key, pmrem, q, renderer (+4 more)

### Community 14 - "Sparks"
Cohesion: 0.17
Nodes (12): files, height, loader, params, render(), status, views, width (+4 more)

### Community 15 - "vite"
Cohesion: 0.19
Nodes (5): names, createPost(), studioScene(), postprocessing, three

### Community 16 - "scene.js"
Cohesion: 0.07
Nodes (34): CHAPTERS, FIELDS, createChoreo(), DELAY, partTurn(), smoothstep(), TURN, CAMERA (+26 more)

### Community 17 - "learning/index.js"
Cohesion: 0.31
Nodes (3): resolveChapter(), Scroll, stitchBounds()

### Community 19 - "src/core/Director.js"
Cohesion: 0.23
Nodes (9): clamp(), mix(), pose(), sampleCameraPose(), segment(), smooth(), Director, ease() (+1 more)

### Community 20 - "tunnel-preview.js"
Cohesion: 0.38
Nodes (5): crownGeometry(), dialTexture(), gearGeometry(), hairspringGeometry(), Watch

### Community 22 - "cinema.test.mjs"
Cohesion: 0.25
Nodes (5): c_users_igorpc_claude_projects_site_aula_mota_github_relogio_de_precisao_f1_loop_src_engine_viewer_css, ref_three_addons_controls_orbitcontrols_js, ref_three_addons_environments_roomenvironment_js, ref_three_addons_libs_meshopt_decoder_module_js, ref_three_addons_loaders_gltfloader_js

### Community 23 - "wind-tunnel.js"
Cohesion: 0.46
Nodes (4): aerodynamicTest(), createFlowDetail(), createTunnelVisual(), createWindTunnel()

### Community 25 - "App"
Cohesion: 0.47
Nodes (5): loadCar(), loadCar(), applyCarMaterials(), applyLocalCarbonProjection(), texture()

### Community 26 - "modulos-lab/garage.js"
Cohesion: 0.47
Nodes (3): createGarage(), drawBrand(), glyphs

### Community 28 - "08-loop-complementar/capture.mjs"
Cohesion: 0.27
Nodes (3): App, createPost(), studioScene()

### Community 32 - "shots.js"
Cohesion: 0.60
Nodes (3): applyCarMaterials(), applyLocalCarbonProjection(), texture()

### Community 37 - "close-framing-candidate.js"
Cohesion: 0.67
Nodes (3): closeFramingAmount(), smooth(), WINDOWS

## Knowledge Gaps
- **119 isolated node(s):** `nav`, `sections`, `inputs`, `learningLab`, `reduced` (+114 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `three` connect `vite` to `garage-preview.js`, `boot`, `src/core/Director.js`, `Reference.js`, `f1-loop/src/main.js`, `Watch.js`, `Curve`, `Callouts`, `Sparks`, `scene.js`, `tunnel-preview.js`, `cinema.test.mjs`, `wind-tunnel.js`, `applyCarMaterials`, `modulos-lab/garage.js`, `08-loop-complementar/capture.mjs`, `Finale`, `06-avaliacao/capture.mjs`, `functional.mjs`, `Background`, `Finale`, `Fog`?**
  _High betweenness centrality (0.503) - this node is a cross-community bridge._
- **Why does `boot()` connect `f1-loop/src/main.js` to `Background`, `08-loop-complementar/capture.mjs`, `tunnel-preview.js`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `node:test` connect `scene.js` to `garage-preview.js`, `boot`, `f1-loop/src/main.js`, `Scroll`, `src/core/Director.js`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **What connects `nav`, `sections`, `inputs` to the rest of the system?**
  _119 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `three` be split into smaller, more focused modules?**
  _Cohesion score 0.12535612535612536 - nodes in this community are weakly interconnected._
- **Should `garage-preview.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06560283687943262 - nodes in this community are weakly interconnected._
- **Should `boot` be split into smaller, more focused modules?**
  _Cohesion score 0.07712765957446809 - nodes in this community are weakly interconnected._
Post-commit verification 2026-09-14T06:12:07.465361+00:00: 594 nodes, 976 links/edges (identical alias). All 45 engine-tool nodes and 57 targeted AST edges preserved by hook. Hooks installed and merge driver registered. Earlier counts describe prior snapshots; this paragraph is the latest structural verification. No source changed during verification.
