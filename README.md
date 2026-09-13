# Relógio de Precisão

Aula scroll-driven em WebGL: um relógio mecânico montado pelo ciclo de Van Aken (problema, pesquisa, planejamento, execução, avaliação, aprendizado). Os dados são ilustrativos; o método é o conteúdo.

## Rodar

```bash
npm install
npm test
npm run dev
```

Abre em `http://127.0.0.1:5173`. Build: `npm run build`. Preview: `npm run preview` (porta 5192).

## Arquitetura

| Peça | Papel |
|---|---|
| `src/data/narrativa.js` | Seis capítulos, analogias F1, cenários |
| `src/core/Scroll.js` | Lenis + ScrollTrigger; autoridade do progresso |
| `src/core/Director.js` | Coreografia: relógio, câmera, FX, títulos |
| `src/watch/Watch.js` | Relógio procedural |
| `src/fx/` | Efeitos por capítulo |
| `src/ui/ui.js` | HUD, mapa, ficha, registro |
| `src/core/webgl.js` | Aceita WebGL2 ou WebGL1 |

Sem WebGL, o HTML de fallback entrega a narrativa completa.

## Testes e CI

`npm test` roda `node --test` em `tests/`. O workflow em `.github/workflows/ci.yml` faz `npm ci`, testes e build.

## Deploy

`vite build` gera `dist/`. `.openai/hosting.json` aponta esse diretório.

## Acessibilidade

O canvas é decorativo. A narrativa vive em `.sr-only` dentro de `#scroll`. Há skip link, `prefers-reduced-motion` e fallback sem GPU.
