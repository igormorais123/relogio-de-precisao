# Relógio de Precisão — contrato técnico

Site didático estático de página única, com Three.js e Vite. A aula percorre seis etapas por rolagem e incorpora os aprofundamentos de loop e grafo ao mesmo percurso.

## Invariantes

- `Scroll.js` é a autoridade do progresso: Lenis suaviza a roda e ScrollTrigger observa a posição real. Não há snap automático concorrente.
- `cameraPath.js` define poses contínuas e reversíveis. `Director.js` aplica câmera, relógio e efeitos a partir do mesmo progresso.
- No desktop, capítulos ímpares alternam texto e relógio de lado. Em retrato, prevalece o layout vertical.
- Os aprofundamentos aparecem automaticamente ao final de Avaliação e Aprendizado. A leitura principal não exige clique.
- `narrativa.js` e `paginas.js` são as fontes do conteúdo. O fallback sem WebGL inclui os seis capítulos e os dois aprofundamentos.
- O registro permanece no navegador. O código da aula não chama modelos de IA nem envia o registro a um servidor.

## Manutenção e validação

Execute `npm ci`, `node --test tests/cameraPath.test.js` e `npm run build`. Confira também a página renderizada, a rolagem nos dois sentidos, os aprofundamentos e as larguras móveis. Testes matemáticos não comprovam qualidade visual ou taxa de quadros.

A saída publicável é `dist/`. O preview usa a porta 5192. O identificador da hospedagem é mantido em `.openai/hosting.json`; credenciais não pertencem ao repositório.

Consulte [arquitetura](docs/arquitetura.md), [fluxo da página](docs/fluxo-da-pagina.md), [verificação](docs/verificacao-e-publicacao.md), [grafo estrutural](graphify-out/GRAPH_REPORT.md) e [diagramas](.planning/architecture/system-architecture.html).
