# Complemento: matéria-prima 3D comprovada e dois derivados para a aula

Conferência local em 13/09/2026. Fonte consultada somente para leitura: `C:\Users\igorm\projetos\INTEIA-laboratorio-3d`, HEAD `0c9dde4107737622fc2088bb2e76bc5ec979e443`, árvore limpa na conferência. Esta auditoria complementa o planejamento anterior com arquivos que podem ser carregados e verificações executadas; não trata o número de arquivos como evidência de experiência pronta.

## Resultado concreto

| Arquivo | Bytes | Triângulos | Partes | Uso proposto |
| --- | ---: | ---: | ---: | --- |
| Fonte `web/assets/carro-movable.glb` | 26.454.116 | 752.824 | 97 | Referência preservada no laboratório |
| [carro-aula.glb](../../public/assets/carro-aula.glb) | 10.407.208 | 260.023 | 97 | Versão intermediária, câmera mais próxima |
| [carro-aula-mobile.glb](../../public/assets/carro-aula-mobile.glb) | 7.309.200 | 130.357 | 97 | Versão mais leve para enquadramento geral |
| [box-aula-referencia.glb](../../public/assets/box-aula-referencia.glb) | 10.302.288 | 128.860 | 568 meshes | Box atual copiado integralmente, para carregamento posterior |

O carro intermediário reduz 65,46% dos triângulos e 60,66% dos bytes. A versão leve reduz 82,68% dos triângulos e 72,37% dos bytes. Ambas são GLB comuns, sem Draco ou decodificador Meshopt em tempo de execução. O nome “mobile” descreve a intenção de uso, não uma certificação de desempenho em celulares.

A contagem anterior de **752.823 triângulos** está correta para os exports Blender estático e animado, mas a base **web** contém **752.824**. São arquivos diferentes: os exports possuem 107 nós; a base web possui 138. Para reutilizar `createMechanics`, foi escolhida a base web e preservado seu contrato integral.

## O que estava desatualizado nas cópias de Fable

Foram comparados 28 arquivos com sua fonte atual, incluindo cinco módulos adicionados por este complemento. As cópias anteriores foram preservadas.

| Cópia anterior | Diferença confirmada | Complemento |
| --- | --- | --- |
| `modulos-lab/studio.js` | Acabamento anterior mais áspero; a fonte atual limpa mapas da pintura, altera verniz, carbono, pneus e aço | Versão atual em `modulos-atualizados/studio.js` |
| `modulos-lab/branding.js` | Cinco marcas desenhadas em Arial; a fonte atual utiliza uma assinatura vetorial lateral direita | Versão atual em `modulos-atualizados/branding.js` |
| `modulos-lab/garage.js` | Alterações nas luzes e no acabamento do box | Versão atual em `modulos-atualizados/garage.js` |
| `ambientes/INTEIA-box-laboratorio.glb` | Cópia com 10.302.056 bytes; fonte com 10.302.288 bytes e mudanças em nós/luzes | Cópia atual em `public/assets/box-aula-referencia.glb` |
| `docs-lab/ARQUITETURA.md` | Conteúdo diferente da fonte atual | Usar a arquitetura atual do laboratório para novas decisões; cópia histórica preservada |

`mechanics.js`, `identity.js`, os módulos de túnel/aerodinâmica, as identidades, a textura de carbono e os outros documentos comparados eram idênticos. `modulos-atualizados` inclui também `mechanics.js` e `identity.js` idênticos para manter os imports internos do conjunto atual.

## Como a redução foi feita

O [gerador](../../tools/optimize-car.mjs) usa o `MeshoptSimplifier` já disponível no Three.js instalado no projeto. O cabeçalho desse módulo declara meshoptimizer 1.1; sua assinatura está no manifesto. Nenhuma instalação adicional foi necessária. Blender também foi localizado em `Aula Labmota/.tools/blender/runtime/blender-5.2.1-windows-arm64/blender.exe`, mas não foi necessário reexportar o modelo por ele.

Cada uma das **135 primitivas** foi processada separadamente. Foram mantidas as fronteiras, os extremos geométricos, as normais e as coordenadas UV dos vértices retidos. Primitivas menores que 500 triângulos permaneceram intactas. A compactação descarta vértices sem referência e usa índices de 16 bits onde cabem.

Parâmetros do intermediário: alvo de 25% dos índices, erro relativo máximo do simplificador 0,0015. Parâmetros do leve: alvo de 10%, erro máximo 0,004. Os alvos são limites de tentativa; as restrições de qualidade impedem que toda peça atinja o percentual pedido. O erro é uma métrica aproximada do algoritmo e não deve ser convertido em garantia de distância física ou equivalência visual.

Foram preservados os **138 nós**, sua ordem, nomes, extras, posições, rotações, escalas e hierarquia. Os materiais, texturas e bytes das imagens incorporadas também foram preservados. Como o campo histórico `extras.triangles` pertence à procedência original, ele continua descrevendo a fonte; a contagem real de cada primitiva derivada consta no arquivo de proveniência de cada LOD.

## Verificação executada

O [verificador](../../tools/verify-car.mjs) carregou a geometria real de cada derivado pelo `GLTFLoader` instalado e a comparou com a fonte. Resultados de ambas as versões:

- 97 componentes de montagem, quatro conjuntos de pivôs das rodas e flap DRS encontrados.
- 20 ciclos completos de desmontagem e remontagem, com erro máximo de matriz no retorno igual a zero.
- Direção, giro, tampas internas, DRS, isolamento, deslocamento manual, arraste e restauração verificados.
- Erro de matriz após restauração e após arraste/restauração igual a zero.
- Maior diferença entre centros/tamanhos calculados da fonte e do derivado: `2,384185791015625e-7` unidades, dentro da tolerância numérica de `1e-6`.
- Nós e definições de materiais comparados integralmente com os valores JSON da fonte.

Os resultados estão em [validação intermediária](../../public/assets/carro-aula.validacao.json) e [validação leve](../../public/assets/carro-aula-mobile.validacao.json). Esse teste retira materiais apenas da cópia em memória usada no Node, para testar geometria sem DOM; os GLBs entregues mantêm seus materiais. Aparência, legibilidade, FPS, memória GPU e comportamento em aparelhos específicos exigem a validação da aplicação no navegador.

## Contrato de integração para a aula

Carregue um dos GLBs por URL. Calcule a caixa e centralize como no laboratório: `model.position.set(-center.x, -box.min.y, -center.z)`. Em seguida aplique materiais e crie a mecânica. A assinatura, se usada, deve ser criada depois da mecânica para acompanhar a peça móvel.

APIs correntes:

- `applyCarMaterials(THREE, model)` retorna `{ materials, dispose }`.
- `setupStudio(THREE, renderer, scene)` retorna `{ floor, setTheme, update, dispose }` e configura renderer, iluminação, reflexos e piso.
- `createMechanics(model)` retorna `records`, `wheels`, `flap`, `setAmount(0..1)`, `update(dtSeconds, nowMilliseconds, reducedMotion)`, `reset`, `setSpin`, `setSteering(degrees)`, `setDRS(degrees)` e os comandos de seleção/isolamento.
- Cada registro contém `id`, `root`, `source`, `label`, `category`, `center`, `size`, `base` e `direction`. Preserve `root.userData.partId` como identificador de origem para dados salvos; `id` é índice de execução.
- A desmontagem por scroll deve controlar `setAmount` e atualizar a mecânica. Não combine um `AnimationMixer` de montagem e o controlador sobre as mesmas peças.

O box possui 568 meshes; o carro continua com 135 primitivas. Reduzir triângulos não elimina os custos de materiais, draw calls, sombras e shaders. Carregue o box somente quando necessário, reduza pixel ratio/sombras em telas menores e meça FPS antes de ativar túnel com milhares de partículas. A prova da aula deve funcionar também com animação reduzida e navegação direta.

As peças articuladas ilustram movimentos. O modelo não contém um motor completo nem simulação física de suspensão, pneus ou aerodinâmica. O túnel e a desmontagem ajudam a explicar tarefas, evidências e retorno ao estado montado; não certificam engenharia real do carro.

## Procedência e reprodução

[manifesto-assets.json](../../public/assets/manifesto-assets.json) registra SHA-256, tamanhos, revisão da fonte, comparação das cópias e arquivos de ferramenta. [Proveniência intermediária](../../public/assets/carro-aula.proveniencia.json) e [proveniência leve](../../public/assets/carro-aula-mobile.proveniencia.json) discriminam cada primitiva antes/depois. As cópias de licença e avisos originais acompanham a pasta de assets. Conforme a documentação de origem, INTEIA declara titularidade das próprias contribuições, e a licença do arquivo de tutorial não está documentada; este complemento não acrescenta permissões nem afirma certificação externa.

Na raiz de `relogio-de-precisao`, com as dependências do projeto disponíveis:

```powershell
node f1-loop/tools/optimize-car.mjs
node f1-loop/tools/verify-car.mjs
node f1-loop/tools/optimize-car.mjs --mobile
node f1-loop/tools/verify-car.mjs --mobile
$env:ASSET_SOURCE_HEAD = git -C ../INTEIA-laboratorio-3d rev-parse HEAD
$assetStatus = git -C ../INTEIA-laboratorio-3d status --short
$env:ASSET_SOURCE_STATUS = if ($assetStatus) { $assetStatus -join "`n" } else { 'clean' }
node f1-loop/tools/audit-assets.mjs
```

O gerador aceita um caminho alternativo da base web como argumento. Ele grava somente os derivados nomeados e seus relatórios em `f1-loop/public/assets`. A auditoria grava o manifesto e cópias de licença nesse destino; não regrava a fonte. A versão instalada do Three.js e o SHA do simplificador entram no manifesto porque uma atualização de dependências pode modificar o resultado da simplificação.
