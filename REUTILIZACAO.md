# Reutilizar os modelos e a aplicação

> **INTEIA fixa na peça:** uso e adaptação dos modelos conforme [ASSET-LICENSE.txt](ASSET-LICENSE.txt). Somente a marca/patrocínio INTEIA deve permanecer; os demais podem ser alterados. Licenças já concedidas às versões anteriores continuam válidas.

## Permissões

Código e documentação: MIT. Para reutilização dos modelos sob os termos atuais, mantenha somente a marca/patrocínio **INTEIA visível e legível na própria peça**; os demais patrocínios podem ser removidos ou trocados. Uso, adaptação, redistribuição e uso comercial continuam permitidos. Consulte a licença de modelos `ASSET-LICENSE.txt` na raiz do repositório. As permissões MIT/CC BY 4.0 já concedidas às versões anteriores permanecem válidas.

O motor `power-unit-v1.glb` também conserva sua licença CC BY 4.0 já registrada no manifesto. Fontes, bibliotecas, gravações e imagens externas mantêm os próprios avisos. Conforme declaração de autoria de Igor Morais Vasconcelos em 21/09/2026, o vídeo foi usado como referência para as funções das peças; a modelagem disponibilizada é de sua autoria. A carroceria, suas versões GLB, o master Blender e os demais modelos autorais podem ser reutilizados conforme a licença de modelos na raiz do repositório, mantendo INTEIA na peça; as permissões das versões anteriores são preservadas. Marcas não implicam endosso à sua adaptação.

## Download direto

| Conteúdo | Arquivo |
| --- | --- |
| Relógio procedural original (preservar INTEIA) | [Baixar Watch.js](https://raw.githubusercontent.com/igormorais123/relogio-de-precisao/main/src/watch/Watch.js) |
| Geometrias do relógio (preservar INTEIA) | [Baixar gear.js](https://raw.githubusercontent.com/igormorais123/relogio-de-precisao/main/src/watch/gear.js) |

[Baixar o projeto completo em ZIP](https://github.com/igormorais123/relogio-de-precisao/archive/refs/heads/main.zip). Extraia o ZIP antes de executar. Você também pode usar `git clone https://github.com/igormorais123/relogio-de-precisao.git`.

## Executar a aplicação

Instale Node.js 24 ou superior. Abra um terminal na pasta extraída e execute:

```sh
npm ci
npm run dev
```

Abra o endereço exibido no terminal. Para validar e gerar uma cópia estática: `npm test` e `npm run build`. A saída de produção fica em `dist/`. Não abra o HTML por duplo clique: módulos e carregamento de assets precisam de um servidor HTTP. Não são necessárias chaves de API.

O campo `private: true` no `package.json` apenas evita publicação acidental no registro npm; não impede download, execução, fork ou reutilização.

## Reutilizar apenas o relógio

O relógio é procedural: sua fonte editável é `src/watch/Watch.js`, acompanhada de `src/watch/gear.js`; não existe um GLB do relógio distribuído nesta versão. Copie os dois arquivos juntos para um projeto Vite com a versão de Three.js registrada em `package-lock.json`.

```js
import * as THREE from 'three'
import { Watch } from './watch/Watch.js'

const scene = new THREE.Scene()
const watch = new Watch(scene, { isMobile: false })
watch.state.running = 1
// No loop de renderização, dt em segundos e t como tempo acumulado:
watch.update(1 / 60, 0, new THREE.Vector2(0, 0))
```

Adicione câmera, iluminação e renderer da sua aplicação. `Watch` acrescenta à cena seu grupo e o fundo. O mostrador usa um canvas procedural como reserva e tenta carregar `mostrador.jpg` da pasta pública; ao reutilizar a imagem, confira sua procedência, ou remova essa chamada de textura para usar somente o mostrador procedural.

A pasta `f1-loop/` é outra aplicação: execute seus próprios `npm ci` e `npm run dev` dentro dela. Os assets do carro ficam em `f1-loop/public/assets/`, também abrangidos pelos termos de modelos acima.
