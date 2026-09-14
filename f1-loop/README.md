# F1 Loop — Engenharia de Loop

Aula **só** de engenharia de loop com IA: preparar, formular hipótese, executar, avaliar, corrigir e encerrar com registro. O carro de Fórmula 1 do Laboratório 3D INTEIA, o box e o túnel são a metáfora; o aluno sai com um gesto aplicável no dia seguinte.

Pasta separada do Relógio de Precisão. Sem afiliação FIA ou equipes. Sem marcas reais no modelo.

- **Aula publicada:** https://igormorais123.github.io/relogio-de-precisao/f1-loop/
- **Continuar o trabalho:** [PROXIMOS-PASSOS.md](PROXIMOS-PASSOS.md) (revisão, decisões e plano de construção)
- **Laboratório 3D INTEIA:** https://igormorais123.github.io/INTEIA-laboratorio-3d/
- **Republicar:** `bash f1-loop/tools/publicar-gh-pages.sh` na raiz do repositório (o GitHub Actions está bloqueado na conta por faturamento)

## Como rodar

Com Node 24, na pasta `f1-loop`:

```sh
npm ci
npm test
npm run dev   # http://127.0.0.1:5198
npm run build # gera dist/
```

Não abra `index.html` por `file://`: o modelo 3D precisa de servidor HTTP. Detalhes de uso do caderno e da edição de conteúdo em [README-COMPLEMENTO.md](README-COMPLEMENTO.md).

## O que há aqui

| Caminho | Papel |
|---|---|
| `index.html`, `src/` | **Aula canônica** de seis capítulos. Conteúdo em `src/content.js`; coreografia em `src/story.js`; cena em `src/scene.js` |
| `public/assets/` | Carro derivado do laboratório (desktop ≈260 k triângulos, tela estreita ≈130 k), box de referência, proveniência e validações |
| `planejamento/` | Briefing, pesquisa, tratamentos, julgamentos, narrativa consolidada, critérios de aprendizagem, capturas de referência e de revisão |
| `materia-prima/` | Identidade INTEIA e módulos do laboratório (`modulos-atualizados/` é a versão corrente) |
| `tools/` | Redução, verificação e auditoria dos assets (leem `../../INTEIA-laboratorio-3d`) |
| `site/` | **Protótipo arquivado.** Carro procedural em blocos rejeitado pelo autor; não publicar nem evoluir |

## Estado em 13/09/2026

A aula funciona com o carro real, atividades, caderno, modo leitura e fallback sem WebGL. A revisão registrada em `PROXIMOS-PASSOS.md` aponta o que falta para chegar à linguagem cinematográfica da referência: pós-processamento, câmera contínua, box sem objetos flutuando, túnel com fumaça, wipe diagonal real e assets comprimidos.

Fatos de pista vêm de `planejamento/01-pesquisa/VERIFICACAO-FATOS-COMPLEMENTO.md`. Visualizações do túnel são ilustrativas e não são CFD.
