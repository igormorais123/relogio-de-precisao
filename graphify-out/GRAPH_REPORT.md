# Graph Report - relogio-de-precisao  (2026-09-14)

## Corpus Check
- 105 files · ~988,480 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 603 nodes · 1064 edges · 49 communities (26 shown, 23 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2c9c1594`
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
- src/core/Registro.js
- Sparks
- vite
- scene.js
- learning/index.js
- Constellation
- src/core/Director.js
- tunnel-preview.js
- three
- viewer.js
- wind-tunnel.js
- applyCarMaterials
- json
- modulos-lab/garage.js
- modulos-lab/studio.js
- 08-loop-complementar/capture.mjs
- Finale
- 06-avaliacao/capture.mjs
- functional.mjs
- shots.js
- Fog
- math
- Finale
- Fog
- close-framing-candidate.js
- modulos-lab/mechanics.js
- mathutils
- monitor-close-candidate.js
- functional.mjs
- os
- pathlib
- subprocess
- sys
- tempfile

## God Nodes (most connected - your core abstractions)
1. `three` - 54 edges
2. `createScene()` - 19 edges
3. `boot()` - 16 edges
4. `applyCarMaterials()` - 13 edges
5. `main()` - 13 edges
6. `createTrack()` - 13 edges
7. `sampleStory()` - 12 edges
8. `createTunnel()` - 12 edges
9. `boot()` - 11 edges
10. `enhanceCar()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `render()` --calls--> `createMechanics()`  [EXTRACTED]
  f1-loop/dev/assets-compare.js → f1-loop/materia-prima/modulos-atualizados/mechanics.js
- `render()` --calls--> `applyCarMaterials()`  [EXTRACTED]
  f1-loop/dev/assets-compare.js → f1-loop/materia-prima/modulos-atualizados/studio.js
- `loadCar()` --calls--> `applyCarMaterials()`  [EXTRACTED]
  f1-loop/dev/garage-preview.js → f1-loop/materia-prima/modulos-atualizados/studio.js
- `loadCar()` --calls--> `applyCarMaterials()`  [EXTRACTED]
  f1-loop/dev/tunnel-preview.js → f1-loop/materia-prima/modulos-atualizados/studio.js
- `main()` --calls--> `applyInteiaBranding()`  [EXTRACTED]
  f1-loop/src/lab/track-lab.js → f1-loop/materia-prima/modulos-atualizados/branding.js

## Import Cycles
- 1-file cycle: `src/core/App.js -> src/core/App.js`
- 1-file cycle: `src/core/Post.js -> src/core/Post.js`
- 1-file cycle: `src/core/Scroll.js -> src/core/Scroll.js`
- 1-file cycle: `src/core/Title.js -> src/core/Title.js`
- 1-file cycle: `tests/cameraPath.test.js -> tests/cameraPath.test.js`
- 1-file cycle: `vite.config.js -> vite.config.js`
- 2-file cycle: `src/core/App.js -> src/core/Post.js -> src/core/App.js`
- 2-file cycle: `src/core/App.js -> src/core/Studio.js -> src/core/App.js`

## Communities (49 total, 23 thin omitted)

### Community 0 - "three"
Cohesion: 0.06
Nodes (49): inputs, nav, sections, CHAPTERS, FIELDS, mountLearning(), frame(), goto() (+41 more)

### Community 1 - "garage-preview.js"
Cohesion: 0.06
Nodes (30): BLOCOS, CAPITULOS, PAGINAS, PESOS, Background, clamp(), mix(), pose() (+22 more)

### Community 2 - "boot"
Cohesion: 0.30
Nodes (11): AMBER, canvasTexture(), createTunnel(), CYAN, ENVELOPE, FOG_UNIFORMS(), fontStack(), rng() (+3 more)

### Community 4 - "Reference.js"
Cohesion: 0.09
Nodes (15): troika-three-text, FONT_BODY, FONT_DISPLAY, preloadFonts(), Title, withTimeout(), Blueprint, COTAS (+7 more)

### Community 5 - "f1-loop/src/main.js"
Cohesion: 0.08
Nodes (12): Background, detectWebGL(), Constellation, modules, REGISTRO, Particles, arc, boot() (+4 more)

### Community 7 - "Watch.js"
Cohesion: 0.08
Nodes (30): createGarage(), drawBrand(), glyphs, SPEED_CAMERA_LIMITS, createWipeClip(), CASE_CLAIMS, CASE_SOURCE, createGarage() (+22 more)

### Community 8 - "CrownDrag"
Cohesion: 0.17
Nodes (11): DELAY, partTurn(), smoothstep(), TURN, DELAY, ease(), frame, partBox() (+3 more)

### Community 9 - "Scroll"
Cohesion: 0.25
Nodes (17): check(), esc(), option(), renderLearningMarkup(), select(), stage(), written(), applyLearningAction() (+9 more)

### Community 11 - "Curve"
Cohesion: 0.12
Nodes (15): cam, camera, clock, frame(), garage, hud, key, measure() (+7 more)

### Community 12 - "Callouts"
Cohesion: 0.12
Nodes (12): buffer, cam, camera, hud, key, pmrem, q, renderer (+4 more)

### Community 13 - "src/core/Registro.js"
Cohesion: 0.07
Nodes (37): createMechanics(), names, caliperGeometry(), discGeometry(), discTexture(), enhanceCar(), localVaryings(), paintShader() (+29 more)

### Community 14 - "Sparks"
Cohesion: 0.13
Nodes (10): resolveChapter(), Scroll, stitchBounds(), gsap, gsap/ScrollTrigger, lenis, PESOS, resolveChapter() (+2 more)

### Community 15 - "vite"
Cohesion: 0.29
Nodes (3): createPost(), studioScene(), three

### Community 16 - "scene.js"
Cohesion: 0.20
Nodes (10): files, height, loader, params, render(), status, views, width (+2 more)

### Community 18 - "Constellation"
Cohesion: 0.47
Nodes (5): loadCar(), loadCar(), applyCarMaterials(), applyLocalCarbonProjection(), texture()

### Community 19 - "src/core/Director.js"
Cohesion: 0.07
Nodes (24): node:assert/strict, node:test, clamp(), mix(), pose(), sampleCameraPose(), segment(), smooth() (+16 more)

### Community 20 - "tunnel-preview.js"
Cohesion: 0.38
Nodes (5): crownGeometry(), dialTexture(), gearGeometry(), hairspringGeometry(), Watch

### Community 22 - "viewer.js"
Cohesion: 0.22
Nodes (7): c_users_igorpc_claude_projects_site_aula_mota_github_relogio_de_precisao_f1_loop_src_engine_viewer_css, openEngine(), run(), ref_three_addons_controls_orbitcontrols_js, ref_three_addons_environments_roomenvironment_js, ref_three_addons_libs_meshopt_decoder_module_js, ref_three_addons_loaders_gltfloader_js

### Community 23 - "wind-tunnel.js"
Cohesion: 0.46
Nodes (4): aerodynamicTest(), createFlowDetail(), createTunnelVisual(), createWindTunnel()

### Community 26 - "modulos-lab/garage.js"
Cohesion: 0.47
Nodes (3): createGarage(), drawBrand(), glyphs

### Community 27 - "modulos-lab/studio.js"
Cohesion: 0.25
Nodes (4): root, ref_node_path, ref_node_url, vite

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
- **115 isolated node(s):** `params`, `files`, `width`, `height`, `loader` (+110 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `three` connect `vite` to `garage-preview.js`, `boot`, `Reference.js`, `f1-loop/src/main.js`, `Watch.js`, `CrownDrag`, `Curve`, `Callouts`, `src/core/Registro.js`, `scene.js`, `src/core/Director.js`, `tunnel-preview.js`, `viewer.js`, `wind-tunnel.js`, `applyCarMaterials`, `modulos-lab/garage.js`, `08-loop-complementar/capture.mjs`, `Finale`, `06-avaliacao/capture.mjs`, `functional.mjs`, `Finale`, `Fog`, `modulos-lab/mechanics.js`?**
  _High betweenness centrality (0.587) - this node is a cross-community bridge._
- **Why does `boot()` connect `f1-loop/src/main.js` to `Reference.js`, `Sparks`, `src/core/Director.js`, `tunnel-preview.js`, `08-loop-complementar/capture.mjs`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `node:test` connect `src/core/Director.js` to `three`, `garage-preview.js`, `f1-loop/src/main.js`, `Watch.js`, `CrownDrag`, `Scroll`, `src/core/Registro.js`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **What connects `params`, `files`, `width` to the rest of the system?**
  _115 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `three` be split into smaller, more focused modules?**
  _Cohesion score 0.061581920903954805 - nodes in this community are weakly interconnected._
- **Should `garage-preview.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05868118572292801 - nodes in this community are weakly interconnected._
- **Should `Reference.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08866995073891626 - nodes in this community are weakly interconnected._
Final map snapshot 2026-09-14T07:02:13.307244+00:00: 634 nodes, 1121 edges/links. Engine-tool supplement restored locally. Source changed concurrently in f1-loop/src/fx/speed.js, f1-loop/src/lab/track-lab.js, f1-loop/src/world/track.js; freshness not verified for those files. The diagram describes the verified continuous world integration, not external proposals or hardware performance.

Final stable source snapshot 2026-09-14T07:06:51.651833+00:00 at c3a73c8267b8da5149f794a759b7b825223fce85: 651 nodes, 1124 edges=links. No source hashes changed during refresh. Local AST refreshed the F1 source plus motor scripts while preserving clock corpus after root update refused shrink. No runtime/FPS inference.
