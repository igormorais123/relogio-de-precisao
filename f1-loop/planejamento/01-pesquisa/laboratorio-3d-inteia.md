# Laboratório 3D INTEIA — o carro, o box, o túnel e a identidade JÁ EXISTEM

Inspecionado em 2026-09-12. Repositório local: `C:\Users\igorm\projetos\INTEIA-laboratorio-3d` (GitHub: igormorais123/INTEIA-laboratorio-3d). Saídas de trabalho paralelas em `C:\Users\igorm\Documents\Codex\2026-09-12\vc-x20\outputs`. Titularidade: INTEIA (licença proprietária do próprio autor), geometria derivada do tutorial "F1 2026" (ver `assets-locais-f1-2026.md`).

**Consequência para a narrativa:** o herói, dois ambientes (box-laboratório e túnel de vento) e a identidade visual estão prontos e validados em three.js. A narrativa deve **usar esses ambientes e esta marca** como base, e propor só o que falta (pit lane, pista, sala de debrief, chuva, noite etc.).

## 1. O carro

- `modelos/INTEIA_F1_estatico.glb` (montado) e `modelos/INTEIA_F1_animado.glb` (clipe `INTEIA_Demonstracao_Montagem_Rodas_DRS`, 104 canais); base do site: `web/assets/carro-movable.glb` (26 MB); master editável `INTEIA_F1_Master.blend` (Blender 4.5).
- **97 componentes exteriores separados e nomeados**, com pivôs registrados em `documentacao/componentes-origem.json`. Categorias: aero 31, wheels 24, suspension 18, details 12, cockpit 11, body 1.
  - Asa dianteira: inferior, intermediária, superior, 4 placas laterais, 4 suportes, 2 detalhes de flap, 2 suportes centrais.
  - Asa traseira: principal, flap DRS, 3 peças do mecanismo DRS, suporte do DRS, 2 placas laterais, 2 suportes superiores, 2 suportes, suporte inferior.
  - Corpo: carroceria (casca única), assoalho em 3 partes, escape, 3 detalhes da tomada de ar, 4 antenas, 2 espelhos, luz traseira + conjunto de LEDs.
  - Rodas: por roda, 4 partes de conjunto (aro/tampa) + pneu + cobertura interna; 4 pivôs de rotação e esterço dianteiro.
  - Suspensão: braços dianteiros e traseiros (2 por lado), hastes/pushrods dianteiras, conjunto de eixo traseiro (3 por lado).
  - Cockpit: interior (2), defletor transparente, volante (estrutura, empunhaduras, botões, indicadores LED, display LCD, 2 conexões).
- Eixos glTF: X lateral, Y para cima, +Z frente. Caixa do carro ≈ 1,85 m × 5,1 m × 1,1 m.
- **752.823 triângulos**, 97 meshes, materiais PBR com verniz; sem motor/câmbio internos, sem LOD, sem low-poly. Para o site de rolagem (que já carrega DOF, bloom e partículas) será preciso gerar um LOD (meta: 150–300 mil triângulos, Draco + KTX2) e agrupar draw calls por material.
- Visual atual: vermelho institucional com verniz brilhante, carbono cinza-claro nos elementos aero, sem propaganda ("o carro continua sem propaganda"). Quatro acabamentos de pintura e cores independentes para carroceria, asas, rodas e carbono.

## 2. Mecânica já implementada (`web/src/mechanics.js`, API `createMechanics(model)`)

- `setAmount(0..1)`: **vista explodida** com atraso por categoria (rodas 0 → aero 0,12 → suspensão 0,18 → corpo 0,24 → cockpit 0,30 → detalhes 0,32) e direções por peça (rodas para fora, asa dianteira para frente, traseira para cima/trás, corpo para cima, cockpit para cima). É exatamente o `explode` que o Director do relógio usa, já pronto para o carro.
- `setSpin(bool)`, `setSteering(graus)`, `setDRS(graus)`: giro das rodas, esterço dianteiro e abertura do DRS.
- `select(id)`, `isolate()`, `setManual(v)`, `drag(v)`: destacar, isolar e deslocar uma peça (base para hotspots e para o "A/B de peças").
- `toggleLoop()`: ciclo automático montar/desmontar de 4 s por fase. Testes em `web/test-mechanics.mjs` (20 ciclos, erro zero).

## 3. Ambientes prontos

### Box-laboratório INTEIA (`ambientes/INTEIA-box-laboratorio.glb`, 3,7 MB; `web/src/garage.js` procedural)
Piso de trabalho com placas de inspeção e faixa vermelha, módulos de gavetas, estação de engenharia com três monitores, painel de três telas na parede (uma mostra a configuração real do visualizador; as outras são cenográficas), carrinho de ferramentas, pistola e mangueira de ar, rack de pneus, macaco estacionado, iluminação suspensa em barras, cabos de serviço, placa INTEIA na parede. Paredes e teto somem em vistas elevadas. 254 malhas. Blender combinado com o carro em `ambientes/INTEIA_Box_com_carro.blend`. Referências: engineering room McLaren 2023, Mercedes trackside engineers.

### Túnel de vento (`web/src/tunnel-visual.js`, `wind-tunnel.js`, `aero-physics.mjs`)
Câmara escura com piso de testes, trilhos, estruturas transversais iluminadas e grade ao fundo; **7.200 partículas de fumaça** com ruído procedural e esteira difusa; cinco emissores; controles de densidade, dispersão, ritmo e pausa; **travelling suave** de câmera em arco; modo "só o carro". Leitura por região: carroceria/asas (azul-claro), esteira das rodas (âmbar, espirais), assoalho/difusor (verde-claro, carroceria transparente). Ensaio por coeficientes (arrasto, carga, potência, Reynolds, Mach) com gráfico e CSV, sempre rotulado "não é CFD". Cinco iterações revisadas por avaliador independente (notas finais ambiente 7, fumaça 5, leitura do carro 7, composição 7).

### Estúdio (`web/src/studio.js`)
Claro/escuro, intensidade de luz, cor do piso e do fundo, exportação de imagem, `applyCarMaterials`.

## 4. Identidade visual INTEIA (`identidade/`, `web/src/identity.js`)

- Marca **INTEIA** com **IA** em destaque, inclinação de 12°, monograma IA compacto; variantes principal, negativo, monocromático e símbolo (SVG).
- Cores: **Racing Red #D92135**, **Graphite #202930**, **Ice White #F0F2F3**. Tagline: "Precisão · Inteligência Artificial · Movimento".
- Regras: manter proporção, margem = altura do I, sem sombras/gradientes, mínimo 220 px para a assinatura completa.
- Já aplicada na interface e na placa do box; o carro é vermelho sem propaganda.

## 5. Como a narrativa deve aproveitar

1. **Paleta da experiência** parte da identidade (vermelho/grafite/branco gelo) e adiciona só as temperaturas por capítulo (azul do túnel, âmbar da pit lane noturna, verde do assoalho etc.), mantendo o vermelho como cor do herói.
2. **Ambientes**: box INTEIA = garagem/preparação/debrief; túnel de vento = simulação/verificação; estúdio escuro = "vazio cinematográfico" para explosão de peças e títulos. Faltam (a propor com cuidado de custo): pit lane, trecho de pista, chuva/noite, muro dos boxes.
3. **Estados do herói** disponíveis sem código novo: explodido por categoria, rodas girando, esterço, DRS aberto, peça isolada, peça deslocada, carroceria transparente com assoalho destacado, fumaça do túnel por região.
4. **Hotspots** devem usar os nomes reais das peças (ex.: "Flap traseiro DRS", "Assoalho · 02", "Haste dianteira · L_01", "Display do volante").
5. **HUD**: os monitores do box podem exibir o **registro do loop** e a configuração real (é a tela que já mostra "valores reais do visualizador"), transformando o cenário em interface diegética.
6. **Custo**: o modelo detalhado é pesado; a narrativa deve prever um LOD e evitar mais de dois efeitos caros por capítulo (regra já usada no laboratório).

## 6. Arquivos de referência visual copiados

`../referencias/lab-previa-blender.png`, `lab-box-render.png`, `lab-box-web.png`, `lab-tunel-visual.png`, `lab-fluxo-assoalho.png`, `lab-identidade.png`.
