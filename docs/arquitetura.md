# Arquitetura e dependências

A aplicação é um site estático de uma página, sem React e sem backend próprio. Vite resolve os módulos e produz o diretório `dist/`. No navegador, uma cena WebGL, a sobreposição de texto e a interface DOM compartilham o mesmo progresso de rolagem.

| Área | Arquivos centrais | Responsabilidade |
| --- | --- | --- |
| Entrada | `index.html`, `src/main.js`, `src/styles.css` | Estrutura DOM, preloader, boot e fallback textual. |
| Renderização | `src/core/App.js`, `Post.js`, `Studio.js` | Renderer, câmera, ambiente, pós-processamento e loop de quadros. |
| Rolagem | `src/core/Scroll.js` | Lenis, ScrollTrigger, limites reais dos capítulos e movimento reduzido. |
| Direção | `src/core/Director.js`, `cameraPath.js` | Derivar poses e estados visuais do capítulo e do progresso. |
| Relógio | `src/watch/Watch.js`, `gear.js` | Geometria procedural, peças e estados do mecanismo. |
| Texto e fundo | `src/core/Title.js`, `Background.js` | Títulos SDF e fundo em shader. |
| Conteúdo | `src/data/narrativa.js`, `paginas.js` | Seis capítulos e dois aprofundamentos. |
| Interface | `src/ui/ui.js` | Navegação, fichas didáticas, aprofundamentos, atalhos e histórico de URL. |
| Efeitos | `src/fx/index.js` e módulos de `src/fx/` | Partículas, constelação, referências e outros recursos visuais. |
| Registro | `src/core/Registro.js` | Eventos locais, persistência em localStorage e exportação JSON. |

As bibliotecas de produção declaradas são Three.js, GSAP, Lenis, postprocessing e troika-three-text. Vite também aparece em `dependencies` no manifesto. As versões exatas instaláveis são fixadas pelo lockfile; este documento não substitui essa fonte.

## Fronteiras e dados

Os recursos visuais e as fontes são servidos como arquivos da aplicação. Não existe chamada a um provedor de IA no fluxo da aula. `Registro.js` usa a chave `relogio-de-precisao:registro`, guarda uma lista de eventos e cria a exportação com `Blob` e `URL.createObjectURL`. Esse módulo não transmite os registros a um servidor. Caso localStorage falhe, mantém o estado em memória durante a sessão.

A exportação é uma ação local do visitante. Ela não é um mecanismo de sincronização nem um backup remoto. O comportamento de logs de acesso da hospedagem está fora desse módulo e não é descrito como ausência de tráfego de rede.

## Mapas

O [diagrama arquitetural](../.planning/architecture/system-architecture.html) agrupa dez componentes para leitura. As [origens relativas](../.planning/architecture/local-evidence.json) ligam esses agrupamentos aos arquivos. O [grafo estrutural](../graphify-out/graph.json) preserva nós e relações mais detalhados, com `source_file` e `source_location`.

O Graphify usa AST de JavaScript, parser dos recursos carregados por `index.html` e referências explícitas de imports/constantes. Não varre dependências, mídia, caches, backups ou saídas geradas. CSS é identificado como recurso, sem análise de seus seletores. Relações extraídas não são prova de cobertura completa das dependências dinâmicas.

O mapeamento local pode ser atualizado, com Graphify instalado no Python escolhido, por:

```sh
python graphify-out/refresh_local.py
graphify export html
graphify query "Director sampleCameraPose"
```

A proteção contra redução acidental do grafo permanece habilitada. Se houver remoção intencional de arquivos, investigue a diferença antes de substituir um mapa maior.

O visualizador HTML do Graphify carrega vis-network de um CDN e precisa de conexão. O grafo JSON e o relatório permanecem legíveis offline. A seção automática de ciclos agrega relações entre símbolos e não constitui diagnóstico de imports circulares: Post.js e Studio.js não importam App.js.
