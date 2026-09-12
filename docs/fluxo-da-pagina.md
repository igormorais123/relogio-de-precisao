# Fluxo da página

O [diagrama de fluxo](../.planning/architecture/page-flow.html) representa a sequência principal e suas saídas. A especificação está em [page-flow.architecture.json](../.planning/architecture/page-flow.architecture.json).

1. `index.html` carrega estilos e `main.js`. O preloader apresenta o progresso de inicialização.
2. `main.js` verifica WebGL. Quando indisponível, gera texto de `CAPITULOS` e `PAGINAS`, incluindo os dois aprofundamentos.
3. Com WebGL, o boot importa os módulos, carrega fontes, cria `App`, `Watch`, `Scroll`, efeitos e `Director`, conecta a UI e compila a cena. O preloader só sai depois do primeiro quadro.
4. `Scroll` cria e mede as seções. Lenis suaviza a roda; ScrollTrigger observa a posição. Toque e teclado seguem a navegação nativa. Não há snap automático ao parar.
5. Cada mudança de progresso determina capítulo e posição local. `Director` usa `cameraPath` e atualiza câmera, relógio, títulos, fundo e efeitos. O loop de `App` chama os atualizadores e `post.render`.
6. A interface DOM acompanha o mesmo progresso: título, ficha e aprofundamento aparecem nos trechos de leitura. Avaliação exibe loop; Aprendizado exibe grafo. Voltar na rolagem refaz o mesmo percurso visual.
7. Eventos registrados pela aplicação ficam no armazenamento local da origem. A exportação do registro cria JSON no dispositivo, sem endpoint de envio.

O menu e os links são atalhos para a sequência, não uma condição para acessar o conteúdo. Os dois slides especiais são definidos em `paginas.js` e usados tanto pela UI quanto pelo fallback textual.

A continuidade matemática da câmera é exercitada por `tests/cameraPath.test.js`. A percepção de movimento, a legibilidade e a integração com o relógio exigem inspeção da renderização; o diagrama não comprova esses resultados.
