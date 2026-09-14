# Motor mecânico didático original

`public/assets/power-unit-v1.glb` é uma geometria original criada para a aula INTEIA, sem CAD baixado, escaneamento ou réplica de fabricante. A geometria e a textura de carbono originais podem ser reutilizadas sob **CC BY 4.0**, com crédito “INTEIA — motor mecânico didático original”. Esta declaração cobre esses dois recursos, não modifica licenças dos demais arquivos ou dependências do projeto.

A inspiração é a arquitetura V6 turbo híbrida de 1,6 litro com MGU-K e sem MGU-H descrita pela [Formula 1 para 2026](https://www.formula1.com/en/latest/article/all-you-need-to-know-about-f1s-new-power-units.14jfv7a36905uDJDdNyfQd). Essa referência não fornece as dimensões do modelo. Bloco, turbina, coletores, cabos, acabamentos, distribuição espacial e dimensões são ilustrativos. O modelo não representa um motor homologado nem permite extrair desempenho ou especificações de fabricante.

## Peças e integração

O arquivo usa metros, Y vertical e comprimento em Z. A dimensão aproximada é 0,713 × 0,571 × 0,951 m. O manifesto contém a medição e o SHA-256 do arquivo efetivamente exportado.

| Grupo móvel para abertura | Conteúdo |
|---|---|
| `assembly_block` | Bloco, cilindros, cárter, bomba, linhas e acessórios fixos |
| `assembly_head_left`, `assembly_head_right` | Cabeçotes, tampas, velas e fixadores |
| `assembly_intake` | Plenum, seis dutos e conexão de ar |
| `assembly_exhaust_left`, `assembly_exhaust_right` | Coletores curvos e flanges de cada bancada |
| `assembly_turbo` | Turbina, compressor, rotor visível, saída e conexões |
| `assembly_electric` | MGU-K e cabo de alta tensão ilustrativo |
| `assembly_rotating` | Virabrequim, seis pistões e seis bielas |

Todos os grupos partem de origem estável. O visor pode deslocá-los para a vista aberta e restaurar sua transformação inicial. As peças estáticas foram unidas por grupo/material, sem misturar subconjuntos ou prender peças móveis ao bloco. Os nós semânticos `engine_block`, `head_left/right`, `cover_left/right`, `crankshaft`, `piston_01…06`, `connecting_rod_01…06`, `turbo` e `mgu_k` permanecem no arquivo. Não interpretar os nomes das malhas renderizadas como um catálogo de peças substituíveis: a união reduz chamadas de desenho, e os nós semânticos guardam os pivôs úteis.

O clip **`running`** tem 19 canais em 13 nós: translação dos seis pistões, translação/rotação das seis bielas e rotação do virabrequim. Dura **8 segundos**, com quatro voltas lentas do virabrequim, equivalentes a dois ciclos de quatro tempos. É uma demonstração cinemática; não simula combustão, ignição, válvulas, fluxo de energia ou ordem de disparo de fabricante. O turbo e o MGU-K são geometrias estáticas nesse clip.

A solução usa raio de manivela de 26,5 mm e biela de 105 mm. A cada quadro, a posição do pistão é a projeção da manivela no eixo do cilindro somada à raiz geométrica que conserva o comprimento da biela. A biela aponta da manivela ao pino do pistão. Não se substituiu esse mecanismo por oscilação senoidal independente.

O GLB final exige **EXT_meshopt_compression**. Em Three.js, configurar `GLTFLoader.setMeshoptDecoder(MeshoptDecoder)` com o decoder de `three/addons/libs/meshopt_decoder.module.js`. Não há exigência de Draco. A textura de carbono é raster original, incorporada ao GLB.

## Reprodução sem serviço pago

Requisitos: Blender 5.2, Node.js e um ambiente de ferramentas com `@gltf-transform/core`, `@gltf-transform/extensions` e `meshoptimizer`. A aplicação em produção não depende desse ambiente de autoria. Não é necessário alterar o `package.json` da aula.

1. Defina `ENGINE_ARTIFACT_DIR` para uma pasta **fora do repositório** onde ficarão `.blend`, PNG e cópia não compactada. Se omitida, o script usa uma pasta temporária chamada `inteia-engine-build`.
2. Defina `F1_ASSET_TOOL_ROOT` para a raiz que contém as dependências de ferramentas já instaladas.
3. Execute `blender --background --python tools/build-power-unit.py`. O Blender gera as peças, resolve a animação, une as malhas por subconjunto/material, exporta, chama o otimizador e produz uma imagem de estúdio em CPU com seis threads. A imagem e o projeto de autoria permanecem fora do repositório.
4. Para repetir só a compactação, execute `node tools/optimize-power-unit.mjs`. Opcionalmente, `ENGINE_GLB` aponta para outra cópia do GLB. O padrão é o asset desta aula.

Sem `F1_ASSET_TOOL_ROOT`, o gerador produz GLB sem meshopt. Para obter o arquivo final compacto, forneça a variável e rode novamente ou execute o otimizador. O otimizador não instala dependências nem utiliza rede. Ele normaliza o início temporal do Blender para zero, compacta os dados sem quantização e verifica a saída decodificada. A numeração inicial dos vértices de cada triângulo pode sofrer rotação cíclica; a orientação, a topologia e os valores dos atributos permanecem iguais.

## Verificação e limites

O otimizador compara todos os atributos e amostras de animação antes/depois da compactação, preservando equivalência cíclica dos índices dos triângulos. Também exige os nove grupos de abertura, o clip com 19 canais, o fechamento do ciclo e a coincidência entre a ponta de cada biela e o pino do respectivo pistão nas 193 amostras exportadas. Entre amostras, o visor interpola os canais; isso é animação gráfica, não um solver físico em tempo real.

A edição final contém 84 malhas e 92 primitivas de renderização. Esse é o custo geométrico básico; sombras, passes extras e o restante da cena podem aumentar o número real de chamadas. Não é uma garantia de FPS. O render de estúdio foi inspecionado em CPU; a integração e a abertura no navegador precisam ser verificadas no visor real.

As cópias de autoria e de comparação são externas. O manifesto público não inclui caminhos locais, usuário do computador ou endereços privados. Antes de publicar qualquer alteração no GLB, atualize e confira o manifesto correspondente.
