# Graph Report - .  (2026-09-11)

## Corpus Check
- Corpus is ~23,569 words - fits in a single context window. You may not need a graph.

## Summary
- 187 nodes · 284 edges · 17 communities (8 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- src/fx · 0
- src/core · 1
- src/core · 2
- src/core · 3
- src/fx · 4
- src/fx · 5
- src/fx · 6
- src/watch · 7
- src/fx · 8
- src/core · 9
- src/core · 10
- src/fx · 11
- src/fx · 12
- src/fx · 13
- src/fx · 14
- src/core · 15
- vite.config.js · 16

## God Nodes (most connected - your core abstractions)
1. `boot()` - 20 edges
2. `three` - 20 edges
3. `Hotspots` - 11 edges
4. `CAPITULOS` - 9 edges
5. `CrownDrag` - 9 edges
6. `sampleCameraPose()` - 8 edges
7. `Scroll` - 7 edges
8. `App` - 6 edges
9. `Blueprint` - 6 edges
10. `Director` - 5 edges

## Surprising Connections (you probably didn't know these)
- `fallback()` --references--> `CAPITULOS`  [EXTRACTED]
  src/main.js → src/data/narrativa.js
- `setupUI()` --references--> `CAPITULOS`  [EXTRACTED]
  src/ui/ui.js → src/data/narrativa.js
- `seg()` --calls--> `clamp()`  [EXTRACTED]
  src/core/Director.js → src/core/cameraPath.js

## Ciclos sugeridos pelo extrator (não verificados como imports)

Limitação: a agregação de símbolos pode gerar ciclos espúrios. Post.js e Studio.js não importam App.js; as relações abaixo não comprovam dependências circulares.
- 1-file cycle: `src/core/App.js -> src/core/App.js`
- 1-file cycle: `src/core/Post.js -> src/core/Post.js`
- 1-file cycle: `src/core/Title.js -> src/core/Title.js`
- 1-file cycle: `src/core/Scroll.js -> src/core/Scroll.js`
- 1-file cycle: `tests/cameraPath.test.js -> tests/cameraPath.test.js`
- 1-file cycle: `vite.config.js -> vite.config.js`
- 2-file cycle: `src/core/App.js -> src/core/Post.js -> src/core/App.js`
- 2-file cycle: `src/core/App.js -> src/core/Studio.js -> src/core/App.js`

## Communities (17 total, 9 thin omitted)

### Community 0 - "src/fx · 0"
Cohesion: 0.10
Nodes (12): PAGINAS, Constellation, modules, REGISTRO, Particles, arc, boot(), fallback() (+4 more)

### Community 1 - "src/core · 1"
Cohesion: 0.11
Nodes (7): postprocessing, three, App, createPost(), studioScene(), Finale, Fog

### Community 2 - "src/core · 2"
Cohesion: 0.16
Nodes (11): gsap, gsap/ScrollTrigger, lenis, FASES, memoria, registro, PESOS, CAPITULOS (+3 more)

### Community 3 - "src/core · 3"
Cohesion: 0.20
Nodes (11): node:assert/strict, node:test, clamp(), mix(), pose(), sampleCameraPose(), segment(), smooth() (+3 more)

### Community 4 - "src/fx · 4"
Cohesion: 0.24
Nodes (5): troika-three-text, Blueprint, COTAS, RAIOS, virg()

### Community 5 - "src/fx · 5"
Cohesion: 0.22
Nodes (7): FONT_BODY, FONT_DISPLAY, ACO, ATMOSFERA, formataDesvio(), OURO, Reference

### Community 7 - "src/watch · 7"
Cohesion: 0.33
Nodes (5): crownGeometry(), dialTexture(), gearGeometry(), hairspringGeometry(), Watch

### Community 10 - "src/core · 10"
Cohesion: 0.38
Nodes (3): preloadFonts(), Title, withTimeout()

## Knowledge Gaps
- **25 isolated node(s):** `FASES`, `memoria`, `PESOS`, `RAIOS`, `COTAS` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `boot()` connect `src/fx · 0` to `src/core · 1`, `src/core · 2`, `src/core · 3`, `src/watch · 7`, `src/core · 10`, `src/core · 15`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `FASES`, `memoria`, `PESOS` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `src/fx · 0` be split into smaller, more focused modules?**
  _Cohesion score 0.09538461538461539 - nodes in this community are weakly interconnected._
- **Should `src/core · 1` be split into smaller, more focused modules?**
  _Cohesion score 0.11462450592885376 - nodes in this community are weakly interconnected._

## Escopo local e integridade

Extração AST de JavaScript e parser estrutural de index.html; CSS é nó de recurso, sem extração de seletores. Não houve API nem extração semântica paga. Dependências, public, dist, ferramentas históricas, backups, revisões e mapas gerados foram excluídos. Relações AST e HTML são EXTRACTED; ausência de ligação não prova ausência de dependência em tempo de execução.

[graphify] MultiDiGraph edge-collapse diagnostic
input: <in-memory>
input_stage: provided JSON (normal graph.json is post-build)
effective_directed: <direct-call>
nodes: 187
unverified_code_nodes: 0
raw_edges: 284
valid_candidate_edges: 284
missing_endpoint_edges: 0
dangling_endpoint_edges: 0
self_loop_edges: 0
exact_duplicate_edges: 0
directed_unique_endpoint_pairs: 284
directed_same_endpoint_collapsed_edges: 0
undirected_unique_endpoint_pairs: 284
undirected_same_endpoint_collapsed_edges: 0
same_endpoint_group_count: 0
relation_variant_groups: 0
source_file_variant_groups: 0
source_location_variant_groups: 0
context_variant_groups: 0
post_build_graph_type: DiGraph
post_build_edges: 284
producer_suppression_sites: 10
producer_suppression_examples:
  - L1055 seen_ids arity=unknown
  - L1205 seen_ids arity=unknown
  - L1207 seen_doc_refs arity=unknown
  - L1630 seen_ids arity=unknown
  - L2099 seen_keys arity=unknown
  - L3034 seen_ids arity=unknown
  - L3142 seen_ids arity=unknown
  - L3221 seen_ids arity=unknown
note: normal graph.json is post-build; raw producer loss must be measured earlier.
