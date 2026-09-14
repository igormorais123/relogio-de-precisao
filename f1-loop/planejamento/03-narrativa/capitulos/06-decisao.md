# Capítulo 6 — Decisão

- **id:** `decisao` · **slug:** `capitulo-5` · **nome:** Decisão · **bloco:** controlar
- **Título:** `VOLTE AO ÚLTIMO\nESTADO VERDE.`
- **Corpo:** Se o novo quebrou o antigo, reverta antes de corrigir.
- **Essência:** Reverta primeiro, conte as falhas e procure a causa no verificador, não no sintoma.
- **Lições:**
  1. **Reverter regressões** — Se a suíte inteira piorou, volte ao último verde antes de pensar em corrigir.
  2. **Regra 2 e 3** — Duas falhas seguidas: reset com prompt refinado. Três: parar e perguntar.
  3. **Causa raiz** — Reproduza o bouncing; não "suba a altura" para esconder. Ache a anomalia no túnel.
- **Fato de pista:** Ferrari SF-24, Silverstone 2024 — o piso de Barcelona deu downforce e bouncing; após a sexta (A/B confirmado), os dois carros voltaram à spec pré-Barcelona. Sainz: "não é mais rápido, mas é mais dirigível." Causa: anomalia no túnel. Versão corrigida em Monza; Leclerc venceu. (`f1-licoes.md` #27.)
- **Amanhã:** `git revert`. Na segunda falha, `/clear` com erro exato e hipótese descartada. Na terceira, três linhas para uma pessoa.

## Cena

- **Ambiente:** pit lane sob céu de chumbo `#0d1216`. Sem chuva — o bouncing de Barcelona era a seco em curva rápida. Prateleira ao lado do carro.
- **Carro:** dois carros com o piso novo oscilando (reprodução, não afirmação de A/B formal além da sexta documentada). Reversão: novos saem com contorno âmbar; velhos entram com verde. Pit board `2 · BOX` — chamada interna, não bandeira de direção de prova.
- **Interação:** MANTER segura o piso novo, mantém bouncing, pinta o contador de 3 e grava "risco aceito sem causa raiz". REVERTER é o padrão do scroll. "Tentar de novo": 1 e 2 = `BOX`; 3 abre "o que interrompeu".
- **Câmera:** plano geral dos dois `[1.0, 1.5, 7.4]`; dolly entre os carros em `0.50–0.72`.
- **Hotspots:**
  1. `floor` · Regressão — "Passou no escrito, falhou no não escrito. Vai para a prateleira, não para o lixo."
  2. `floor@velho` · Último verde — "Reverter não é derrota: preserva o que funcionava."
  3. `side_mirrors` · Placar — "RB20 2024, Waché: detectamos, mas o carro era rápido e não quisemos modificar. Custou o título de Construtores." (#26)
- **Imagem-chave:** Dois carros nos macacos trocando assoalhos âmbar→verde; pit board `2 · BOX`.
- **Saída:** wipe para noite de Monza. Rótulo `DOSSIÊ`.
- **Emoção:** coragem humilde.
