# Capítulo 3 — Peça

- **id:** `peca` · **slug:** `capitulo-2` · **nome:** Peça · **bloco:** uma-volta
- **Título:** `UMA PEÇA.\nA VELHA FICA\nNA PRATELEIRA.`
- **Corpo:** Critique a peça antes de montar; a antiga fica na prateleira.
- **Essência:** Produza, critique antes de instalar, revise só o apontado e guarde a versão anterior.
- **Lições:**
  1. **Produzir e criticar** — A peça vai ao inspetor antes de tocar o carro: "onde isso falha?", nunca "está bom?".
  2. **Revisar o necessário** — Retrabalha-se o bordo apontado, não a peça inteira.
  3. **Passo reversível** — A peça velha vai para a prateleira, não para o lixo: um commit por volta verificada.
- **Fato de pista:** Adrian Newey, *How to Build a Car*: "A evolução costuma ser a chave, uma vez que a faísca de uma boa direção foi definida." Depois da direção validada, o loop avança por revisões pequenas. (`f1-licoes.md` #23.)
- **Amanhã:** "Corrija apenas os itens 1 e 3 da revisão." Commit pequeno com o que a volta testou.

## Cena

- **Ambiente:** box-laboratório INTEIA — grafite `#0c0f13`, LED de teto, lâmpada de trabalho âmbar, **prateleira iluminada** à esquerda (persiste até o cap. 7).
- **Carro:** início montado com assoalho velho. Meio: carro sobe nos macacos (`pitJack`), explosão parcial do ventre, assoalho velho desliza para a prateleira (contorno verde), novo encaixa. Fim: desce dos macacos; velho visível na prateleira.
- **Câmera:** 3/4 dianteiro `[0.9, 0.65, 6.9]`; crane curto na montagem `0.50–0.72`.
- **Hotspots:**
  1. `floor` · Assoalho novo — "Um diff pequeno é um laminado fino: dá para inspecionar."
  2. `floor@velho` · Último estado verde — "`git revert` custa segundos porque a versão anterior existe."
  3. `front_wing_mount` · Ponto de macaco — "Sobe só nas marcas. Mônaco 2022: a Ferrari chamou o double stack com 5 s onde pedia 6; o stay out chegou tarde; Leclerc caiu de P1 para P4. Se a pré-condição cai, a ação não começa." (#29)
- **Imagem-chave:** Carro erguido, assoalho velho em arco até a prateleira verde, o novo subindo do molde.
- **Saída:** porta do box sobe; pit lane à noite. Rótulo `PISTA`.
- **Emoção:** cuidado de artesão.
