# Capítulo 1 — Hipótese

- **id:** `hipotese` · **slug:** `capitulo-0` · **nome:** Hipótese · **bloco:** preparar
- **Título:** `A PEÇA NASCE\nCOMO HIPÓTESE.`
- **Corpo:** O CFD desenha um assoalho; a pista ainda não viu nenhum.
- **Essência:** Trate a primeira resposta como hipótese: fixe a referência, o critério e o escopo antes do run.
- **Lições:**
  1. **Referência real** — Compare com a pista, não com outra previsão: teste que falha, dado medido, documento.
  2. **Critério verificável** — Uma frase que um comando ou uma pessoa sem contexto julga verdadeira ou falsa.
  3. **Tarefa delimitada** — O que entra, o que fica de fora e o que é proibido, escritos antes de tocar no carro.
- **Fato de pista:** Ferrari SF1000, 2020 — Binotto admitiu "descorrelação do projeto para a pista"; a equipe "empurrou muito o projeto buscando downforce" e o que desenvolveu era "frágil em robustez aero". Otimizar para o túnel, não para a pista, produz peças que passam no teste e falham no uso. (`f1-licoes.md` #24, Autosport.)
- **Amanhã:** `[CRITÉRIO_SUCESSO]` + `[VERIFICAÇÃO]: execute {comando}`. Fonte de verdade em uma linha.

## Cena

- **Ambiente:** box-laboratório INTEIA, breu `#07090c`, grid ciano no chão a 8% de opacidade. Sem key quente: a hipótese não tem calor. Placa INTEIA e um monitor (pit board) à esquerda.
- **Carro:** início = nuvem/constelação (`scatter 1`, `explode 1`). Fim = fantasma ciano com só o assoalho sólido (`ghost 0.7`, `floorSolid 1`).
- **Câmera:** `0.00–0.18` contra-plongée baixa `[0.2, 0.25, 7.2]`; `0.18–0.50` dolly baixo atravessando a nuvem até 3/4 dianteiro `[−0.8, 0.55, 7.0]`; `0.50–0.72` estável para a ficha; `0.72–0.86` push-in no assoalho.
- **Efeitos:** constelação, poeira ciano, pit board `ALVO: +18 pt · NÃO PIORAR: dirigível · JUIZ: FP1` (números ilustrativos).
- **Hotspots:**
  1. `floor` · Assoalho · 02 — "Até 2.000 geometrias de CFD por período ATR: barato, rápido e não é a pista. A primeira resposta do modelo." (#5)
  2. `main_body` · Carroceria — "Fora do escopo fica fantasma. Se duas peças mudam, o delta não tem dono."
  3. `pit-board` · Alvo — "Jerez 1997: três pilotos em 1:21.072; desempate pela regra escrita antes — quem fez primeiro. Defina o juiz antes da volta." (#12)
- **Imagem-chave:** Nuvem ciano no box INTEIA se adensa e vira o assoalho de um carro que, fora da peça, ainda é fantasma.
- **Saída:** wipe diagonal (−20°) para o aço do túnel; poeira vira fluxo. Rótulo `TÚNEL`.
- **Emoção:** ambição contida — a ideia é bonita e ainda não é verdade.
