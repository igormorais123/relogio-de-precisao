# Capítulo 4 — Pista

- **id:** `pista` · **slug:** `capitulo-3` · **nome:** Pista · **bloco:** uma-volta
- **Título:** `A TINTA\nNÃO OPINA.`
- **Corpo:** Flow-vis, rakes e um gêmeo: evidência que dá para ler.
- **Essência:** Leve a peça ao mundo real, compare com o baseline na mesma sessão e leia a saída.
- **Lições:**
  1. **Verificar o resultado** — A volta só conta quando o comando rodou e a saída foi lida. "Deve passar" não fecha.
  2. **Baseline na mesma sessão** — O outro carro com a peça antiga, mesma pista, mesmo dia.
  3. **Não mexer no teste** — A tinta não se limpa para o resultado parecer bonito. Se o teste falha, o problema está no código.
- **Fato de pista:** Rob Smedley: "nenhum túnel de vento correlaciona 100%". Flow-vis e rakes aero medem na pista os mesmos pontos do túnel. (`f1-licoes.md` #4, F1.com / Motorsport.com.)
- **Amanhã:** "Cole as últimas 20 linhas de `npm test`." Confira `git diff tests/`.

## Cena

- **Ambiente:** pit lane FP1, breu `#080a0e`, holofotes âmbar. Sem streamlines de túnel aqui — o ar da pista só existe com o carro andando.
- **Carro:** sai do box (`speed 0.25 → 0.8`). DRS fecha antes da frenagem (`drs 1 → 0`) — "pare de adicionar antes de medir". Para no pit; UV acende; flow-vis verde no assoalho e na asa. Gêmeo entra à esquerda com assoalho velho, sem tinta. Interação: botões A/B — dar a peça nova aos dois mostra "comparação morta" e a fita some.
- **Câmera:** 3/4 traseiro em movimento `[−1.0, 0.45, 7.2]`; **desce da T-cam antes** do gêmeo e da UV, para a imagem-chave caber na janela de leitura (`0.50–0.72` lateral baixa dos dois carros).
- **Hotspots:**
  1. `floor` · Flow-vis — "A tinta escorre para onde o ar foi. É a saída de comando colada."
  2. `front_tire` · Rake — "A suíte inteira, não só a peça nova."
  3. `side_mirrors` · Gêmeo — "Racing Bulls, Spa 2026: um só pacote; quem classificou à frente em Silverstone levou o upgrade (Permane). Um jogo, regra escrita antes." (#7)
  4. `front_wing_top` · Tinta — "Não se limpa a tinta para parecer bonito. Não se edita o teste para ele passar."
- **Imagem-chave:** Dois carros no pit à noite; um listrado de verde sob UV; o outro, com o assoalho antigo, quase no escuro.
- **Saída:** estrias verdes se desprendem e viram ribbons. Rótulo `DADOS`.
- **Emoção:** expectativa de prova.
