# Assets locais: modelo F1 2026 em Blender (Downloads do autor)

Inspecionado em 2026-09-12 por leitura binária dos `.blend` (Blender não está instalado nesta máquina). Fonte identificada: série no YouTube "Learn Blender by Making F1 Car" (Part 1: Wings … Part 7: Textures, ago–out/2025). Os arquivos são os project files da série: um carro **genérico das regras 2026** (sem livery de equipe real), construído do zero por tutorial.

## Arquivos

| Arquivo | Tamanho | Conteúdo |
|---|---|---|
| `F1_2026_resources_part_1-5 (1).zip` | 22 MB | part1_wings, part2_body, part3_floor, part4_wheels, part5_cockpit (.blend, Blender 4.0) + `reference_images.rar` (blueprints front/side/top) |
| `F1_2026_tutorial_part6_uv_unwrap.blend` | 49 MB | carro completo com UVs desdobradas |
| `F1_2026_tutorial_part7_textures.blend` | 53 MB | **carro completo texturizado** (versão a usar) |
| `textures_uv_maps.zip` | 27 MB | 13 texturas PNG (4096² para corpo, volante, roda) + 4 mapas UV de referência |

## O que existe dentro do part7 (versão final)

Coleções: `f1_2026_3dmodel` → `front_wing`, `rear_wing`, `main_body`, `wheels`, `cockpit`; mais `reference_img` e `simple_scene` (chão de garagem, luz de área, câmera).

Objetos separados e nomeados (o que a coreografia de explodir/montar precisa):

- **Asa dianteira:** front_wing_bottom, front_wing_middle, front_wing_top, front_wing_side_plates, front_wing_mount(s), front_flap_detail
- **Asa traseira:** rear_wing_main_part, rear_wing_drs, drs_mechanism, drs_holder, rear_wing_side, rear_wing_top_mount, rear_wing_holder, rear_wing_bottom_holder, new_rear_LED / rear_led
- **Corpo:** main_body, main_body_inside, main_body_glass, floor, top_intake_details, side_mirrors, antennas, exhaust
- **Rodas e suspensão:** front_tire, rear_tire, front_wheel_cover, rear_wheel_cover, inside_cover, rear_inside_cover, front_control_arms, rear_control_arms, front_pushrod, rear_driveshaft
- **Cockpit:** steering_wheel_main, steering_wheel_handles, steering_wheel_buttons, steering_wheel_leds, lcd_screen, sw_connection, sw_empty

Materiais: Carbon Fiber Procedural, main_texture (cor + stickers), rubber_tyre, wheel_cover, steering_wheel (+ emissive dos LEDs), Glass, mirror, Steel, PBR Polished Brass, black_plastic, button_plastic, rear_led_emmitor, lcd_screen.

Texturas: `texture_main_color.png` (paleta chapada, 4096², indexada), `texture_main_stickers.png` (logos FIA, "2026 Regulations", marcadores E/eletricidade, listras coloridas), `texture_wheel.png`, `texture_steering_wheel.png`, `sw_display.png`, `pzero_white.png` (marca Pirelli), `f1_fia_logo.png`, `fia_logo_white.png`.

Dependências externas apontadas pelo arquivo (podem estar ausentes): imperfeições de rugosidade (`Roughness_2K.jpg`), `garage_floor_nor_gl_4k.jpg`, texturas de latão TexturesCom, e cinco assets do BlenderKit (materiais/HDRI) referenciados por URL.

## Avaliação para o projeto

**Vale muito a pena usar como base.** Motivos:

1. **Peças separadas e nomeadas** — é exatamente o que o Director precisa para explodir/montar o carro por progresso de scroll (asas em camadas, DRS articulável, suspensão, rodas, volante). Um modelo comprado costuma vir soldado.
2. **Genérico 2026** — sem livery de equipe real, sem risco de marca de equipe. Atenção às marcas de terceiros nas stickers (FIA, F1, Pirelli P Zero): remover ou substituir pela identidade do curso.
3. **Materiais já pensados para PBR** (fibra de carbono procedural, borracha, vidro, emissivos de LED). O procedural do Blender não exporta para glTF: precisa **bake** em textura (albedo/normal/roughness).
4. **Leve para web depois do pipeline**: a topologia é de tutorial (quad, subdivisão por modificador), o que permite escolher o nível de subdivisão na exportação.

Limitações e riscos:

- Realismo é "tutorial de alta qualidade", não scan fotorreal: o resultado final em WebGL dependerá mais da iluminação (HDRI de garagem, luzes de área, reflexos), do pós (DOF, bloom, grão) e da textura de fibra de carbono baked do que do modelo em si. Isso é compatível com a linguagem da referência (Corn Revolution vive de luz e partículas).
- Contagem de polígonos não medida (precisa do Blender). Com Subdivision no nível 1–2 e Decimate nas peças internas, meta: < 300 mil triângulos, glTF com Draco + KTX2, < 15 MB total.
- Licença dos project files não localizada nas páginas públicas. O uso educacional em site próprio é provavelmente aceito por um tutorial gratuito, mas **confirmar na descrição do vídeo/canal** antes de publicar; alternativa segura é continuar o tutorial e re-modelar detalhes, o que torna o modelo autoral.
- Stickers e logos de terceiros (FIA, F1, Pirelli) devem ser trocados por marcas fictícias da aula (ex.: "LOOP 26", logotipo INTEIA).

## Pipeline proposto (fase de construção, não agora)

1. Instalar Blender 4.x (`winget install BlenderFoundation.Blender`), abrir `part7_textures.blend`, verificar dependências ausentes (File → External Data → Report Missing Files).
2. Substituir stickers por versões próprias; manter `texture_main_color` como base de livery e recolorir para a paleta da aula.
3. Bake dos materiais procedurais (fibra de carbono) em 2048²; aplicar Subdivision fixa; Decimate em peças internas.
4. Organizar hierarquia por grupos da coreografia: `asa_dianteira`, `asa_traseira`, `corpo`, `assoalho`, `suspensao_D`, `suspensao_T`, `rodas`, `cockpit`, `volante`; origem de cada peça no próprio centro (para explodir radialmente).
5. Exportar glTF (Draco, KTX2, sem câmera/luzes); carregar em three.js com `GLTFLoader` + `DRACOLoader` + `KTX2Loader`; mapear nomes de nós para o estado do herói (`explode`, `drs`, `wheelSpin`, `steer`, `ledLevel`).
6. Fallback sem GPU continua sendo o HTML `.sr-only`, como no site atual.
