# Pesquisa — Modelos 3D prontos de carro de Fórmula 1 para o "F1 Loop"

Data: 2026-09-12. Fase: planejamento (`f1-loop/planejamento/01-pesquisa/`).
Objetivo: encontrar um carro de F1 ultra-realista, com **peças separáveis** (asas, rodas, suspensão, motor, assoalho, halo, cockpit), **licença compatível com site público de aula** e **peso viável para web** (three.js, scroll-driven, mobile incluído).

## 0. Como ler este documento

- **Verificação:** dados marcados **[API]** vieram da API pública do Sketchfab (`api.sketchfab.com/v3/models/<uid>`) em 2026-09-12: nome, autor, licença, contagem de faces/vértices, nº de texturas e materiais são confiáveis. Dados marcados **[busca]** vieram só de snippets de busca. **⚠ não verificada** = página bloqueou o acesso (403) ou não foi aberta; confirmar antes de usar.
- "Faces" no Sketchfab = triângulos. Vértices ≈ metade.
- **Realismo (1–5):** julgamento a partir de descrição, contagem de polígonos, texturas e reputação do autor; sem abrir o modelo no Blender. Reavaliar ao baixar.
- **Peças separadas:** a API do Sketchfab não expõe a hierarquia; o glTF auto-convertido preserva os nós/objetos do arquivo-fonte. Regra prática usada aqui: muitos materiais (>10) e origem em Blender indicam objetos separados; "1 material / 1 textura" indica malha fundida com textura bakeada (difícil de explodir).

## 1. Achado central (leia antes da tabela)

1. **Não existe modelo público gratuito de F1 com motor, câmbio e suspensão internos modelados** para explodir. Os modelos livres são "carrocerias": asas, rodas, halo, cockpit e assoalho existem; **power unit, câmbio, radiadores e braços internos de suspensão precisam ser fabricados** (procedural em three.js, kitbash em Blender, ou o "F1 2026 Power Unit" gratuito do CGTrader ⚠ não verificada).
2. **Todo modelo de equipe real (RB19, W14, SF-23, MCL60, RB22…) é risco jurídico** para um site público, mesmo com licença CC BY do modelador: a licença cobre a malha do artista, não as marcas (F1, equipes, patrocinadores, Pirelli) nem o desenho industrial do carro. O Formula One Group afirma que uso educacional é aceito só em ambiente privado, não em websites públicos (ver §4).
3. O caminho seguro é um **carro genérico** (showcar FIA/FOM 2022 ou 2026, ou concept sem logos) com **livery própria do projeto** (paleta do "F1 Loop"). Há pelo menos quatro candidatos CC BY nessa categoria com >200k triângulos e um com PBR 4K abaixo de 100k.
4. Nenhum candidato vem "pronto para web": todos exigem Blender (separar, nomear, decimar, bakear) + `gltf-transform` (Draco/Meshopt + KTX2). Orçamento alvo: **≤ 6 MB desktop / ≤ 3 MB mobile**, 120–250k triângulos desktop, ≤ 80k mobile, ≤ 100 draw calls.

## 2. Tabela comparativa

Legenda de licença: **CC0** = domínio público; **CC BY** = uso comercial e derivados permitidos com crédito ao autor e link (o Sketchfab pede crédito ao autor e à plataforma); **CC BY-NC-ND / NC-SA** = sem uso comercial e/ou sem derivados — **explodir/re-texturizar é derivado, portanto inviável com ND**; **RF** = royalty-free comercial (loja); **Editorial** = só para notícias, não serve; **EULA** = licença de loja de engine.

### 2.1 Gratuitos — genéricos (sem equipe real) — os candidatos de verdade

| # | Nome | Autor | URL | Formato | Tris / Vértices | Texturas PBR | Licença | Site público? | Peças separadas | Equipe real? | Realismo |
|---|------|-------|-----|---------|-----------------|--------------|---------|---------------|-----------------|--------------|----------|
| G1 | F1 2026 Release Car (outdated/inaccurate) **[API]** | Nimaxo | https://sketchfab.com/3d-models/f1-2026-release-car-b5c4f3ef041345c68b8e918190d32a9c | glTF auto + fonte (.blend provável) | 205.876 / 105.781 | Sim: 5 texturas, 4 materiais | CC BY (autor: "crédito apreciado, opcional"; feito "para jogos, livery e showcase") | Sim | Provável (4 materiais → verificar; rodas costumam ser objetos) | Não — showcar FOM 2026 | 4 |
| G2 | F1 2021/2022 Concept by FIA **[API]** | AFR.Official (FRR.Official) | https://sketchfab.com/3d-models/f1-20212022-concept-by-fia-8705fdd833104a96b8215949d4bf146f | glTF auto + fonte | 447.946 / 223.489 | **Não** (0 texturas, 1 material; sem UV) | CC BY, "publicado com permissão do desenvolvedor do jogo" | Sim | Desconhecido (1 material sugere malha única → separar por loose parts) | Não — showcar FIA 2022 | 4 (forma); materiais por nossa conta |
| G3 | FIA F1 2026 Car **[API]** | Abu Saif (abuhossain844) | https://sketchfab.com/3d-models/fia-f1-2026-car-d242ab0587ee47c683a904bc38cead93 | glTF auto + fonte | 275.926 / 146.093 | Sim: 55 texturas, 33 materiais | CC BY | Sim | Muito provável (33 materiais) | Não — showcar FIA 2026 (verificar logos FIA/F1/Pirelli nas texturas) | 4 |
| G4 | 2025 F1 CAR BASE **[API]** | Abu Saif | https://sketchfab.com/3d-models/2025-f1-car-base-a01ba6e5b0924d7fbfa031e808676977 | glTF auto + fonte | 575.242 / 288.398 | 1 textura, 1 material (base branca) | CC BY; autor: "baixe, construa em cima e publique como seu" | Sim | Improvável (1 material) → separar no Blender | Não — base genérica 2025 | 3,5 |
| G5 | F1 Mercedes W13 Concept **[API]** | Nick Broad (nickbroad) | https://sketchfab.com/3d-models/f1-mercedes-w13-concept-b9e85594aec847f78883343d67ee97fb | glTF auto + fonte | 99.581 / 53.543 | **Sim, 4K PBR** (18 texturas, 10 materiais, carbono/metal, 3 compostos de pneu) | CC BY | Sim, **após remover logos** | Provável (10 materiais, pneus separados por composto) | Concept de artista com nome/estrela Mercedes e livery Petronas → **re-texturizar** | 4,5 (melhor relação qualidade/peso) |
| G6 | My take on the 2026 f1 regulations **[API]** | MaG80 | https://sketchfab.com/3d-models/my-take-on-the-2026-f1-regulations-4b77c9b72dc44803a530eaaff18ed590 | glTF auto + fonte | 206.004 / 106.204 | 4 texturas, 4 materiais | CC BY | Sim | Provável | Não | 3,5 |
| G7 | F1 2022 Generic V3 (reupload de TheoDevF1) **[API]** | DaniFold | https://sketchfab.com/3d-models/f1-2022-generic-v3-55c119e7096a4322bc375c9b4f5a162d | glTF auto + fonte (OBJ+PNG) | 312.532 / 161.489 | Sim: 8 texturas, 11 materiais; halo real, volante, aros 18" | CC BY **declarada pelo reuploader** — o original de TheoDevF1 é **CC BY-NC-ND** → cadeia de licença duvidosa | **Evitar** (risco de licença) | Provável (11 materiais) | Não — showcar FIA 2022 | 4 |
| G8 | F1 2022 Generic Free (reupload) **[API]** | PostiF1 | https://sketchfab.com/3d-models/f1-2022-generic-free-03a7c467b67e48ca9d0b6e9272ef0732 | glTF auto + fonte | 893.914 / 456.170 | 9 texturas, 11 materiais | CC BY declarada; mesmo problema de cadeia (original NC-ND) | **Evitar** | Provável | Não | 4 |
| G9 | F1 2022 Generic (original) **[API]** | TheoDevF1 (TheoDevF12) | https://sketchfab.com/3d-models/f1-2022-generic-9b2fc584679e468ca3a7cb98a75857d2 | OBJ + PNG | 316.948 / 163.717 | 14 texturas, 16 materiais; interior e volante | **CC BY-NC-ND** | **Não** (ND proíbe derivados) | Provável | Não | 4 |
| G10 | Generic 2022 F1 car **[API]** | MP Developing Team | https://sketchfab.com/3d-models/generic-2022-f1-car-885d67926c1f4397bebd4efd6b5a3f73 | glTF auto + fonte | 172.260 / 86.276 | Não (0 texturas, 10 materiais) | CC BY | Sim | Provável (10 materiais) | Não | 3 |
| G11 | Formula 1 2022 Car **[API]** | Luis Adrian V. | https://sketchfab.com/3d-models/formula-1-2022-car-65dcd974798f4f03be5cdf4f79e228d8 | glTF auto + fonte | 79.925 / 50.836 | Não (0 texturas, 13 materiais) | CC BY | Sim | Provável (13 materiais) | Não | 3 |
| G12 | F1 2022 {FREE!!} **[API]** | 3dblender_1 | https://sketchfab.com/3d-models/f1-2022-free-013c9e89d2244e37924031dfe4ccf4c3 | glTF auto + .blend | 226.148 / 121.935 | Não (0 texturas, 38 materiais) | CC BY | Sim, se livery for própria | **Sim** ("wheel meshes are separate, for game devs"; 38 materiais) | Estilo Mercedes, sem nome oficial | 3,5 |
| G13 | Open Wheel Race Car **[API]** | Dylan Jade | https://sketchfab.com/3d-models/open-wheel-race-car-4599e9608b6845aaafadc89f7d41fa3c | glTF auto + fonte | 1.104.292 / 561.692 | Sim: 12 texturas, 13 materiais | CC BY | Sim | Provável | Não — design retrô genérico | 4 (mas não é carro atual) |
| G14 | F1 2026 concept (polygon model) **[API]** | Qvist_designs | https://sketchfab.com/3d-models/f1-2026-concept-polygon-model-ea3bde709b1e4dc9b0ec8557d106ed42 | glTF auto (origem CAD) | 1.164.174 / 581.898 | Não (0 tex, 1 mat) | CC BY | Sim | Não (CAD fundido) | Não | 2,5 |
| G15 | Formula Race Car **[API]** | m.yanuardi.irf | https://sketchfab.com/3d-models/formula-race-car-3734b945569d4b08958da2e8b68a66cf | glTF auto (CAD) | 2.210.579 / 1.421.569 | Não (0 tex, 20 mat) | CC BY | Sim | Talvez (20 materiais) | Não | 3 (CAD, pesado) |
| G16 | Generic F1 **[API]** | JUSTGAME | https://sketchfab.com/3d-models/generic-f1-e7b2fed6b0614ddc8054abc06438e630 | glTF auto | 29.634 / 16.964 | 2 tex, 5 mat | CC BY | Sim | Talvez | Não | 2 (low poly; serve de LOD) |
| G17 | F1 Car **[API]** | HeckerGamerHere | https://sketchfab.com/3d-models/f1-car-084b2295407248cb8f6a856b7aeab004 | glTF auto | 38.278 / 23.688 | Não (0 tex, 9 mat) | CC BY | Sim | Talvez | Não | 2,5 |
| G18 | Generic F1 2023 Car **[busca]** | MattsActuallyUsefulModels | https://sketchfab.com/3d-models/generic-f1-2023-car-6ecdea162b114cdc97c7e7247eb9544d ⚠ não verificada | glTF auto | ? | ? | **CC BY-NC-SA** | Duvidoso (aula gratuita pode ser NC, mas SA obriga a licenciar o derivado igual) | ? | Não | ? |
| G19 | F1 TYRES PACK 2022 (H/M/S) **[API]** | zordew | https://sketchfab.com/3d-models/f1-tyres-pack-2022-307a0557dde44cf1a7f6f2d1958c383d | glTF auto | 279.360 / 141.120 | Sim: 9 tex, 7 mat | CC BY | Sim, se remover marca Pirelli | Sim (pacote de rodas) | Marca Pirelli provável | 4 (complemento: rodas/pit stop) |
| G20 | Formula 1 (BlendSwap #2721) **[busca]** | kuromi | https://blendswap.com/blend/2721 ⚠ não verificada (403) | .blend | ? (antigo) | ? | **CC0** (snippet) | Sim | ? | ? | 2 (provável, modelo antigo) |
| G21 | F1 Car Concept (BlendSwap #28411) **[busca]** | Hexalore | https://blendswap.com/blend/28411 ⚠ não verificada (403) | .blend | ? | ? | CC BY | Sim | ? | Não ("fan-made concept") | 3? |
| G22 | F1 2026 Power Unit (grátis) **[busca]** | ? | https://www.cgtrader.com/free-3d-models/car/concept-car/f1-2026-power-unit ⚠ não verificada (403) | ? | ? | ? | Licença CGTrader Royalty Free (verificar) | Provável | É só o motor (MGU-K, câmbio planetário) | Não | ? — candidato a "peça interna" |
| G23 | Kenney Car Kit / Racing Kit **[busca]** | Kenney | https://kenney.nl/assets/car-kit · https://kenney.nl/assets/racing-kit | glTF/FBX/OBJ | baixíssimo | Flat | **CC0** | Sim | Sim (8 rodas separadas) | Não | 1 (cartoon; só para prototipar coreografia) |
| G24 | Meshy "F1" (gerados por IA) **[busca]** | vários | https://www.meshy.ai/tags/f1 ⚠ não verificada | GLB/FBX/OBJ | ? | Bakeadas | CC0 declarada | Duvidoso (podem imitar carros reais) | Não (malha única) | Não | 1,5 |

### 2.2 Gratuitos — equipes reais (alta qualidade, mas risco de marca)

| # | Nome | Autor | URL | Tris / Vértices | Texturas | Licença | Site público? | Peças separadas | Realismo |
|---|------|-------|-----|-----------------|----------|---------|---------------|-----------------|----------|
| R1 | Oracle Red Bull F1 Car RB19 2023 **[página]** | Redgrund | https://sketchfab.com/3d-models/oracle-red-bull-f1-car-rb19-2023-e4afe46f3aab4b23a418da06fc163821 | 675.000 / 341.100 | sim (bakeadas) | CC BY | **Não** sem retirar livery (RB, Oracle, patrocinadores) | Desconhecido | 4,5 |
| R2 | Scuderia Ferrari F1 SF23 2023 **[API]** | Redgrund | https://sketchfab.com/3d-models/scuderia-ferrari-f1-sf23-2023-ecb0f812bc454331bbe721655b0780ec | 713.064 / 361.893 | 5 tex, **1 material** (bake) | CC BY | Não | Improvável (1 material) | 4,5 |
| R3 | McLaren MCL60 F1 2023 **[API]** | Redgrund | https://sketchfab.com/3d-models/mclaren-mcl60-f1-2023-8340e27c325345e4aa92a6a31cc34b1e | 741.712 / 376.491 | sim | CC BY | Não | ? | 4,5 |
| R4 | Mercedes F1 W14 [FREE!!] **[API]** | 3dblender_1 | https://sketchfab.com/3d-models/mercedes-f1-w14-free-26fda66f3e8a48d5a636056f8a64e299 | 232.202 / 126.506 | ? | CC BY | Não | Provável (mesmo autor de G12) | 4 |
| R5 | 2026 Red Bull Racing RB22 / Haas VF-26 / Williams FW48 / Aston AMR26 **[API]** | Tyler_Dave (Dave Love) | https://sketchfab.com/3d-models/2026-red-bull-racing-rb22-8e5a68a7991c4a46bd66a879c060b3c5 | 275.868 / 146.041 (mesma malha, liverys diferentes; 55 tex, 33 mat) | sim | CC BY | Não (liverys reais) — mas a **malha base é da mesma família de G3** | Muito provável | 4 |
| R6 | 2026 F1 Audi FOM Update **[API]** | sohyalebret | https://sketchfab.com/3d-models/2026-f1-audi-fom-update-f2b3a61651b347ad8cd82d497bcb408e | 344.800 / 190.706 | 11 tex, 37 mat | CC BY | Não (Audi) | Muito provável | 4 |
| R7 | McLaren MP4/5 (1989) **[API]** | dark_igorek | https://sketchfab.com/3d-models/mclaren-mp45-formula-1-3059d4532ecd48ca8da41e1cac971f22 | 328.961 / 168.820 | 21 tex, 5 mat | CC BY | Não (Marlboro/Honda/McLaren) | ? | 4,5 (histórico) |
| R8 | Max Verstappen F1 Car (scan 2024) **[página]** | Brainrotking | https://sketchfab.com/3d-models/max-verstappen-f1-car-b2c3ad6c081748f5af723f4fdd913106 | 25.000 / 12.500 | fotogrametria | CC BY | Não | Não (scan) | 2 |
| R9 | F1 2023 Red Bull RB19 (Grand Prix 4) **[página]** | Excalibur | https://sketchfab.com/3d-models/f1-2023-red-bull-racing-rb19-a55641f7cf924d598c59bfb24a12a87c | 101.700 / 56.600 | ? | não informada; download não confirmado | Não | ? | 3,5 |
| R10 | F1 2025 McLaren MCL39 **[API]** | shunqi | https://sketchfab.com/3d-models/f1-2025-mclaren-mcl39-c6194270002b401bb25be7e35ab56e34 | 1.088.576 / 553.390 | ? | CC BY | Não | ? | 4,5 |

### 2.3 Pagos

| # | Nome | Autor / Loja | URL | Formato | Tris | Texturas | Preço | Licença | Peças separadas | Equipe real | Realismo |
|---|------|--------------|-----|---------|------|----------|-------|---------|-----------------|-------------|----------|
| P1 | Formula 1 Concept Car (season 2018, com halo) **[busca]** | TurboSquid #1204300 | https://www.turbosquid.com/3d-models/formula-1-concept-car-model-1204300 ⚠ preço não verificado (403) | 3ds/max/obj/fbx/dxf | **10.704 polys / 11.046 verts** (subdivisível) | PBR (spec e metal) | ? | TurboSquid Royalty Free (Standard) | **Sim: 30 objetos separados, agrupados por função** | Não | 3 (base low-poly de 2017) |
| P2 | Formula 1 Season 2022 F1 Race Car Concept **[busca]** | OpticalDreamSoft / TurboSquid #1763545 | https://www.turbosquid.com/3d-models/3d-formula-1-season-2022-f1-race-car-concept-model-1763545 ⚠ não verificada | max/fbx/obj/blend? | low-poly subdivisível | PBR | ~US$ 99 (snippet, ⚠) | TurboSquid RF | ? | Não | 4 |
| P3 | F1 Generic Car 2025 Template **[busca]** | DSGStudio / CGTrader (também RenderHub) | https://www.cgtrader.com/3d-models/car/racing-car/f1-generic-car-2025-template ⚠ preço não verificado (403) | MAX/OBJ/FBX/C4D/BLEND/PSD | **152.049 polys** | sim + PSD de livery | ? | CGTrader Royalty Free | Provável (template de livery) | Não | 4 |
| P4 | Formula 1 2026 Showcar White Mockup **[busca]** | TurboSquid #2247624 | https://www.turbosquid.com/3d-models/formula-1-2026-showcar-white-mockup-f1-race-car-concept-3d-2247624 ⚠ não verificada | ? | ? | branco (mockup) | ? | TurboSquid RF | ? | Não | ? |
| P5 | Formula 1 2026 (FIA/F1 Showcar) **[API]** | gerulf.doesinger (Sketchfab Store) | https://sketchfab.com/3d-models/formula-1-2026-fiaf1-showcar-0c08810ef8af40029028f28f4229266b | .blend + FBX + OBJ, TIFF 4K | 40.559 (20.298 otimizado) | sim, set neutro branco | **€ 2.750** | **Editorial** (só notícias) | pivôs de roda | Não | 4,5 — **inviável pela licença e preço** |
| P6 | Formula 1 2024 (Generic) **[API]** | gerulf.doesinger | https://sketchfab.com/3d-models/formula-1-2024-generic-a171bcf82863451a98087600b2ff8cbf | .blend + FBX | 147.999 | 34 tex, 8 mat | **US$ 1.550** | **Editorial** | rodas pivotantes, chassi subdivisível | Não | 4,5 — inviável (licença) |
| P7 | F1 Red Bull RB19 **[API/página]** | Project 212 (Sketchfab Store) | https://sketchfab.com/3d-models/f1-red-bull-rb19-ea3757002f7844238560a557a17e4b9d | FBX/OBJ/BLEND, 4K PSD/PNG | 1.500.000 | sim, "motor e interior detalhados" | não exibido (⚠) | Sketchfab Standard + NoAI | **Sim (motor detalhado!)** | **Sim — risco** | 5 |
| P8 | RedBull RB19 (rigged) **[busca]** | sarvesh777 (Sketchfab Store / CGTrader / TurboSquid) | https://sketchfab.com/3d-models/redbull-rb19-24ca56f15fe647f19c65ddeb8e2e9221 ⚠ | FBX/OBJ + Substance, 4K | 141.619 polys / 139.697 verts | sim | ? | RF | rigged | Sim — risco | 4,5 |
| P9 | Formula One Pro Racer (F1) Ultimate Edition **[página]** | Mangoberry Studios / Unity Asset Store | https://assetstore.unity.com/packages/3d/vehicles/land/formula-one-pro-racer-f1-ultimate-edition-67688 | Unity package (9 MB, 2016) | ? | ? | US$ 10 | Unity Asset Store EULA (uso fora do Unity: verificar) | ? | Não | 2,5 |
| P10 | Formula A1 Racing Car **[página]** | Marcelo Barrio / Unity | https://assetstore.unity.com/packages/3d/vehicles/land/formula-a1-racing-car-131195 | Unity package (72 MB, 2018) | ? | ? | US$ 4,99 | Unity EULA | ? | Não | 3 |
| P11 | F1 P226 – 2026 FIA concept **[busca]** | Project 212 (Fab/Sketchfab) | https://sketchfab.com/3d-models/f1-p226-2026-fia-formula-1-concept-0e1a1f3afe2949a797d661799583a75f ⚠ | mid-poly, 4K | ? | sim | ? | Standard | ? | Não | 4,5 |
| P12 | Mercedes W14 **[busca]** | Project 212 | https://sketchfab.com/3d-models/mercedes-w14-cd502bc8fc4a4b93969d1b9ad716b255 ⚠ | BLEND/FBX/OBJ 4K | ? | sim | ? | Standard | ? | Sim — risco | 5 |

### 2.4 Fontes consultadas sem candidato útil

- **Khronos glTF-Sample-Assets**: só "CarConcept" (carro de rua, domínio público) — não é F1. https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept
- **three.js examples**: `webgl_materials_car` usa Ferrari 458 (não F1). https://threejs.org/examples/webgl_materials_car.html
- **GitHub**: `rqphy/LightExperience` (three.js, Ferrari F1 2022 baixado da web, `static/models/F1/license.txt`) e o "RB6 dashboard" (Medium) usam modelos de equipe real → servem como referência de código, não de asset. https://github.com/rqphy/LightExperience
- **Poly Haven / Quixel Megascans / KitBash3D**: nenhum carro de F1 encontrado nas buscas (Poly Haven não publica veículos de competição; Quixel é scan de superfícies; KitBash3D não tem kit de F1).
- **FetchCFD** (`fetchcfd.com/threeDViewGltf/2898`): GLB/STL do "Formula 1 2022" — é derivado do TheoDevF1 (NC-ND), 45 MB, tag NoAI → evitar.
- **Fab (Unreal)**: pacotes "Race Car Bundle" são carros fechados; F1 aparece só via Sketchfab/Fab (Project 212). Sem candidato genérico verificado.
- **BlenderKit**: McLaren MP4-8 (1993, com motor, suspensões, freios, rigged, 2K) — equipe real e livery Marlboro; licença BlenderKit (free/full plan) ⚠ não verificada. https://www.blenderkit.com/asset-gallery-detail/648aac5d-8e35-44c3-aa5c-39ca43f12ff8/
- **Free3D / 3DModels.org / CadNav / GrabCAD**: catálogos com muitos modelos antigos ou CAD sem licença clara; não priorizados.

## 3. Ranking top 5 e recomendação

Critérios (peso): realismo 30 % · peças separáveis 25 % · licença 25 % · peso web 20 %.

| Pos. | Candidato | Realismo | Separável | Licença | Peso web | Por quê |
|------|-----------|----------|-----------|---------|----------|---------|
| **1** | **G5 — F1 Mercedes W13 Concept (nickbroad), CC BY** | 4,5 | provável | CC BY, mas exige **re-texturizar** (tirar estrela/Petronas) | **< 100k tris, 4K PBR já feitas** — o mais leve entre os realistas | Único modelo já otimizado para tempo real com PBR de carbono/metal e três compostos de pneu; forma 2022 (efeito solo). Trabalho: trocar a livery pela paleta do projeto e renomear peças. |
| **2** | **G1 — F1 2026 Release Car (Nimaxo), CC BY** | 4 | provável | limpa; feito para showcase; showcar FOM (sem equipe) | 206k tris → decimar para ~120k | Carro da regulamentação 2026 (atual na data), sem marca de equipe; texturas prontas. O rótulo "outdated" do autor é irrelevante para uma metáfora. |
| **3** | **G3 — FIA F1 2026 Car (Abu Saif), CC BY** | 4 | **muito provável (33 materiais)** | limpa se as texturas não trouxerem logos FIA/F1 | 276k tris → decimar | Mesma família de malha que os carros 2026 de Tyler_Dave; a maior granularidade de materiais da lista, o que facilita explodir. |
| **4** | **G2 — F1 2021/2022 Concept by FIA (AFR.Official), CC BY** | 4 (forma) | separar por loose parts | limpa (publicado com permissão) | 448k tris → decimar; **sem texturas** | Ideal se a direção de arte quiser materiais procedurais próprios (como o relógio faz hoje em `Watch.js`): carbono, alumínio e pintura viram `MeshPhysicalMaterial` sem depender de UV. |
| **5** | **P3 — F1 Generic Car 2025 Template (DSGStudio, CGTrader) — pago** | 4 | provável (template) | RF comercial (⚠ confirmar preço/termos) | 152k tris | Opção "compra": template de livery em PSD acelera a pintura na paleta do projeto; sem equipe real. Alternativa mais barata e mais leve: **P1** (10,7k polys, 30 objetos, mas forma de 2018). |

**Recomendação clara para o F1 Loop:** partir de **G5 (W13 Concept)** como carro principal por ser o único "pronto para web" com PBR de qualidade, e manter **G1/G3 (2026)** como plano B caso a re-texturização do G5 seja mais cara do que decimar um 2026. Em qualquer caso:

- **Livery própria** do projeto (nenhum logo real): a paleta do F1 Loop substitui qualquer marca. Isso resolve o risco jurídico e reforça a identidade (o Corn Revolution também não usa marcas na cena).
- **Peças internas fabricadas**: power unit, câmbio, radiadores, braços de suspensão e pedais **não existem em nenhum candidato gratuito** → modelar em Blender (kitbash de cilindros/caixas com bevel, 5–15k tris no total) ou gerar procedural em three.js como o relógio faz com engrenagens (`gearGeometry`, `LatheGeometry`). O carro explodido mostra a carroceria real + "esqueleto" estilizado, e isso combina com o efeito blueprint/constelação já existente no `Director.js`.
- **Rodas**: se o modelo escolhido tiver rodas fracas, usar G19 (pack de pneus 2022, CC BY) com a marca Pirelli apagada, ou modelar rodas procedurais (torus + lathe), que são o elemento central do pit stop.
- **Crédito**: CC BY exige nome do autor + link + licença. Colocar em página de créditos/rodapé e no "Registro" (gaveta JSON) — o site já tem o lugar.

## 4. Riscos de marca e livery

- **Marcas:** "F1", "Formula 1", logotipos, nomes de equipes (Red Bull, Mercedes, Ferrari, McLaren…), patrocinadores e Pirelli são marcas registradas; o Formula One Group mantém >80 registros e trata uso educacional como aceitável apenas em contexto privado — **não em websites, YouTube ou redes sociais** (Legal Notices e Guidelines em formula1.com; artigos Holland & Knight 2025, Chambers, LawInSport). Um site de aula público, mesmo gratuito, é publicação.
- **Desenho industrial / direito autoral da carroceria:** a forma de um carro específico (RB19, W14) pode estar protegida como desenho industrial; um modelo "CC BY" feito por fã licencia o trabalho do fã, não o desenho da equipe. Modelos de **showcar FIA/FOM** (2022 e 2026) são formas de referência publicadas pela própria organização e não pertencem a uma equipe — risco menor, ainda assim sem usar logos FIA/F1.
- **Cadeia de licença:** reuploads (G7, G8, FetchCFD) declaram CC BY sobre um original CC BY-NC-ND — não têm poder para relicenciar. Evitar.
- **ND (sem derivados):** separar, decimar e re-texturizar são derivados; qualquer ND está fora. **NC:** o site é gratuito, mas está ligado à atividade profissional do autor (INTEIA) — tratar como comercial por prudência.
- **Editorial (Sketchfab Store, gerulf.doesinger):** só para reportagem; fora.
- **Unity Asset Store EULA:** o uso é permitido em "projetos" do comprador; a exportação para three.js precisa de leitura do EULA vigente (⚠ não verificada).
- **Fotogrametria de carro real (R8):** além da livery, reproduz o desenho da equipe; fora.
- **Nomes de arquivo e metadados:** ao publicar, remover nomes de equipes de nós, materiais e texturas do GLB (ficam legíveis no bundle).
- **Texto da aula:** citar equipes, anos e números como fato jornalístico/educacional é uso nominativo e é diferente de estampar a marca no herói 3D. Manter as marcas no texto, não no carro.

## 5. Alternativas ao modelo pronto

| Alternativa | Realismo | Peças | Custo | Peso | Quando usar |
|-------------|----------|-------|-------|------|-------------|
| **Procedural em three.js** (como `src/watch/Watch.js` hoje: cada peça é um `Group` com `home`/`apart` em `userData`; materiais `MeshPhysicalMaterial` — ouro, aço, rubi com `transmission`, vidro —; geometrias `LatheGeometry`, `CylinderGeometry`, `TorusGeometry`, `gearGeometry` custom; ordem de montagem em `assemblyOrder`; explode/scatter/opened/running como estado contínuo 0..1; textura do mostrador em `public/mostrador.jpg` trocando o canvas procedural) | 2,5–3 (superfícies aerodinâmicas de dupla curvatura são difíceis de gerar por código) | total, por construção | tempo de dev alto | ~0 MB | Peças internas (motor, câmbio, suspensão, freios), rodas, halo, e para o modo fallback/mobile. **Não** para a carroceria principal se a meta é "ultra-realista". |
| **Híbrido (recomendado)** | 4+ | total | médio | 3–6 MB | Carroceria de G5/G1/G3 + internos procedurais ou kitbash Blender. |
| **Comprar** | 4–5 | depende | US$ 50–300 (P1–P4, P7/P8 ⚠); € 1.550–2.750 (P5/P6, licença inviável) | idem | Se a re-texturização de um gratuito custar mais que a compra de P3. |
| **Decimar modelo alto no Blender** (Decimate: Planar → Collapse; ou Remesh + bake de normais) | mantém ~90 % do visual | conserva objetos | 1–2 dias | de 700k–1M para 150–250k | Necessário para G2, G3, G4, G13; aplicável a qualquer alto-poli. |
| **Encomendar modelo genérico** (Fiverr/ArtStation) | 4,5 | conforme brief | US$ 300–1.500 (estimativa ⚠) | sob medida | Se houver orçamento e se quiser internos reais e livery exclusiva desde a origem. |

## 6. Pipeline proposto (download → Blender → glTF → three.js)

1. **Download** (Sketchfab): baixar **o arquivo-fonte** (.blend/FBX/OBJ) quando o autor o expõe — preserva hierarquia, nomes e modificadores; o glTF auto-convertido é o plano B (ZIP com `scene.gltf`, `scene.bin`, `textures/`). Guardar em `f1-loop/assets-fonte/<autor>/` com `LICENSE.txt` (autor, URL, licença, data) — fora do bundle público.
2. **Blender — auditoria** (30 min por modelo): contar objetos, materiais, texturas; procurar logos nas texturas; medir escala (F1 2022–25: ~5,5 m × 2,0 m; 2026: 1.900 mm de largura, 3.400 mm de entre-eixos); aplicar transformações.
3. **Blender — separar e nomear**: `Mesh → Separate → By Loose Parts` / `By Material`; juntar fragmentos por peça funcional. Nomear em pt-BR sem acento nos nós (compatível com `assemblyOrder` do site): `asa-dianteira`, `asa-traseira`, `drs`, `bico`, `chassi`, `assoalho`, `difusor`, `sidepod-esq`, `sidepod-dir`, `halo`, `cockpit`, `volante`, `motor`, `cambio`, `radiador-esq`, `radiador-dir`, `suspensao-DE/DD/TE/TD`, `roda-DE/DD/TE/TD`, `freio-*`, `espelho-*`, `airbox`, `escape`. Origem de cada peça no seu centro (`Origin to Geometry`) para explode/rotação limpos.
4. **Blender — limpar marcas**: apagar/pintar logos nas texturas de cor (Texture Paint) ou recriar a livery com a paleta do F1 Loop em máscara de UV; renomear materiais.
5. **Blender — reduzir**: Decimate (Planar 3–5°, depois Collapse) por peça, com alvo por prioridade visual (asas e carroceria com mais tris; internos com menos). Alvo total: **≤ 250k tris desktop**, **≤ 80k mobile** (segunda exportação ou LOD). Fundir malhas por material dentro de cada peça para reduzir draw calls (< 100 no total).
6. **Blender — bake**: AO e curvatura em 2K por atlas (1–3 atlases: carroceria, rodas, internos); normais do alto-poli para o baixo se houver decimação forte; texturas ≤ 2048 px.
7. **Exportar glTF 2.0** (add-on oficial): `.glb`, +Y up, "Apply Modifiers", sem compressão no export, materiais Principled (metal/rough), custom properties ligadas (opcional para `home`/`apart`).
8. **gltf-transform** (CLI): `gltf-transform optimize in.glb out.glb --compress draco --texture-compress ktx2` (ou `meshopt`, decodificador menor); normais/AO em UASTC, cor em ETC1S; `--simplify` desligado (já decimado à mão); conferir com `gltf-transform inspect`. Meta: **≤ 6 MB desktop / ≤ 3 MB mobile**.
9. **three.js** (já em `package.json`: three 0.186, postprocessing, troika-text): `GLTFLoader` + `DRACOLoader` (decoders em `public/draco/`) + `KTX2Loader` (`public/basis/`), `MeshoptDecoder` se for meshopt; percorrer `gltf.scene` e registrar cada nó nomeado numa tabela `parts` com `home` (posição original) e `apart` (posição explodida definida em dados), replicando o contrato de `Watch.update()` (estados `explode`, `scatter`, `opened`, `running` → aqui `explode`, `scatter`, `wheelsOff`, `drs`, `running`). Ambiente: HDRI pequena (KTX2 ou `RoomEnvironment`) para os reflexos de carbono/pintura.
10. **Verificação**: teste automático em `tests/` que carrega o GLB via `@gltf-transform/core` e confere tamanho, contagem de tris, lista obrigatória de nós nomeados e ausência de strings de marca em nomes de nós/materiais/texturas; screenshot de referência por capítulo.

## 7. Próximos passos sugeridos (fase seguinte)

1. Baixar G5, G1 e G3 (fonte), auditar no Blender (1 h cada) e preencher as colunas "Peças separadas" e "Realismo" com evidência — os "provável" acima são a maior incerteza deste documento.
2. Confirmar na página do TurboSquid/CGTrader preço e termos de P1 e P3 (bloqueados por 403 neste ambiente).
3. Decidir entre livery própria pintada (Blender) vs materiais procedurais (three.js) — decisão de direção de arte que muda a escolha entre G5 e G2.
4. Prototipar a explosão com o Kenney Car Kit (CC0, minutos) para validar a coreografia de câmera antes do modelo final.

## Fontes

- Sketchfab API v3 (metadados dos modelos citados, 2026-09-12): `https://api.sketchfab.com/v3/models/<uid>`
- Sketchfab, licenças: https://sketchfab.com/licenses · filtros de licença: https://sketchfab.com/blogs/community/refine-downloadable-model-searches-with-new-license-filters/ · Download API: https://sketchfab.com/developers/download-api/downloading-models
- Formula 1 Legal Notices: https://www.formula1.com/en/information/legal-notices.7egvZU48hzrypubGBNcQKt · Guidelines: https://www.formula1.com/en/information/guidelines.4EOKE9RRqevL4niTK9kWyt
- Holland & Knight, "Industrial Designs in Formula 1" (2025): https://www.hklaw.com/en/insights/publications/2025/10/disenos-industriales-en-la-formula-1 · Chambers: https://chambers.com/articles/f1-a-pit-stop-in-how-intellectual-property-is-protected · LawInSport: https://www.lawinsport.com/topics/item/how-does-intellectual-property-work-in-motorsport
- glTF Transform: https://gltf-transform.dev/ · Blender glTF add-on: https://docs.blender.org/manual/en/latest/addons/scene_gltf2.html
- Orçamentos web (tris/MB/draw calls): https://www.utsubo.com/blog/threejs-best-practices-100-tips · https://low-poly.com/blog/polygon-budgets-by-platform-2026
- Kenney: https://kenney.nl/assets/car-kit · https://kenney.nl/assets/racing-kit
- TurboSquid #1204300: https://www.turbosquid.com/3d-models/formula-1-concept-car-model-1204300 · CGTrader template 2025: https://www.cgtrader.com/3d-models/car/racing-car/f1-generic-car-2025-template
