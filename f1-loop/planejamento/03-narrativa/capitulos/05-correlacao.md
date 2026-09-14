# Capítulo 5 — Correlação

- **id:** `correlacao` · **slug:** `capitulo-4` · **nome:** Correlação · **bloco:** controlar
- **Título:** `O TÚNEL PREVIU.\nA PISTA\nDISCORDOU.`
- **Corpo:** O fantasma é plano; o real oscila onde os dois divergem.
- **Essência:** Entregue a comparação a quem não projetou e cheque também o que não podia piorar.
- **Lições:**
  1. **Crítico independente** — Subagente ou sessão nova: só artefato e critério, nunca a justificativa.
  2. **O que não pode piorar** — "Mais downforce" passou; "dirigível em curva rápida" não estava escrito.
  3. **Calibrar o verificador** — Um teste que não reflete a realidade é pior que nenhum. Plante um defeito; se o crítico aprova, o crítico está quebrado.
- **Fato de pista:** Aston Martin AMR23, Canadá 2023 — pacote (piso, sidepods, cobertura) deu mais downforce e tirou o carro da janela. Krack: "não antecipamos os efeitos colaterais." Critério incompleto gera sucesso que é regressão. (`f1-licoes.md` #28.)
- **Amanhã:** "Assuma que há um defeito; encontre-o com `arquivo:linha`." Escreva também o que não pode regredir.

## Cena

- **Ambiente:** sala de correlação / monitores do box INTEIA — preto-vinho `#0c0a0d`, três rims (ciano, magenta, marfim). Prateleira do assoalho velho no canto.
- **Carro:** silhueta; ghost ciano plano sobreposto; `squat` oscila no real (`sin(L·k)`); região âmbar no terço traseiro do assoalho. Ribbons de telemetria.
- **Câmera:** 3/4 traseiro `[−0.9, 1.2, 7.0]`; rack focus do carro para as ribbons em `0.50–0.63`. Slide em `L ≥ 0.64`.
- **Cenários (ilustrativos):** CFD 0 · Túnel 60% −4 · Pista seca −11 com bouncing · Piso novo (melhora 4 voltas, degrada depois).
- **Hotspots:**
  1. `floor` · Divergência — "O túnel previu estável; a pista mediu oscilação. O problema é o verificador."
  2. `steering_wheel_main` · Volante — "Newey: se o piloto sente risco, você tem de ouvir. Dado primeiro, sensação depois." (#15)
  3. `antennas` · Sensores — "Mercedes: mais de 250 sensores, ≈30 MB por volta. Instrumente o que decide: cada verificação custa tokens." (#3)
- **Imagem-chave:** Fantasma plano contra carro oscilando; traseira do assoalho pulsando âmbar.
- **Saída:** monitores apagam; luz de chumbo de Silverstone. Rótulo `DECISÃO`.
- **Emoção:** desconforto honesto.
- **Aprofundamento:** slide `verificador`.
