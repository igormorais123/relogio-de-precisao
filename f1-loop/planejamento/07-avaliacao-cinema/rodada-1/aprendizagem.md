# Juiz de aprendizagem — rodada 1

Data: 14/09/2026. Objeto: aula "BOX, BOX." em `http://127.0.0.1:5198/?quality=high`, raiz `f1-loop/`.

## Veredito

**REPROVA.** A aula ensina a coisa certa e é honesta no desktop, mas o fluxo das seis atividades não entrega ao aluno um registro utilizável: tarefa, fonte e decisão ficam fora do percurso, e o prompt de revisão não leva a candidata nem a fonte. No celular, os rótulos "não é CFD" e "ilustração" não aparecem, e o aprofundamento de cada capítulo fica escondido sob a navegação. O texto dos capítulos fica legível em menos da metade do percurso de rolagem.

| Gravidade | Quantidade |
|---|---|
| BLOQUEADOR | 0 |
| GRAVE | 5 |
| MÉDIO | 4 |
| MENOR | 4 |

## Método e alcance

- Chrome real (Playwright, `channel:'chrome'`, ANGLE D3D11) em 1440×900 e 390×844 (`isMobile`). O modelo carregou nos dois casos: 97 peças, 260.280 triângulos no desktop e 130.462 no celular. O console registrou apenas avisos de compilação de shader (X4122), sem erro de JavaScript.
- Amostragem de 251 posições (p de 0 a 5, passo 0,02) medindo opacidade efetiva de título (por letra), lead e botão, se o botão estava na tela e se `elementFromPoint` atingia o botão. Também capturei quadros por capítulo, abri as seis atividades pelo botão e pelo hotspot, respondi errado e certo, guardei notas, abri e conferi "Meu registro", gerei o prompt, exportei, testei o modo leitura, o movimento reduzido, a navegação por teclado e uma rolagem rápida por roda do mouse (600 px por gesto).
- Scripts, JSON e capturas ficam em `C:\Users\IgorPC\AppData\Local\Temp\claude\juiz-aprendizagem\`. Nos caminhos abaixo, `…\` abrevia essa pasta.
- Fora do alcance: celular físico, leitor de tela real, navegador sem WebGL e aplicação com alunos. Nada aqui mede aprendizagem; mede se a interface permite aprender.

## O que passou (verificado)

- **Registro vazio é vazio.** Os oito campos e a decisão abrem vazios (`interacao-desk.json` → `notebookInicial`), e o prompt usa `[preencher]` sem inventar conteúdo. Os monitores do capítulo Avaliar mostram "— sem registro —" antes das notas e o texto do aluno depois (…\desk-p3.25.png, …\int-desk-monitores-3.35.png), com o rodapé "Registro do aluno · não verificado automaticamente".
- **Honestidade no desktop.** O túnel mostra no rodapé "TÚNEL · VISUALIZAÇÃO DIDÁTICA, NÃO É CFD" e um estêncil no piso (…\desk-p2.25.png). O capítulo Corrigir mostra "BOX · PEÇA REVISADA (ILUSTRAÇÃO)" (…\desk-p4.25.png). Nenhum texto afirma verificação, medição ou aprovação feita pelo site. A decisão "Aceitar" diz "critério conferido por mim", e a exportação traz `"origin": "Anotações do aluno; não verificadas automaticamente"`.
- **Mesma peça em Hipótese e Corrigir.** O assoalho aparece destacado em vermelho nos dois capítulos (…\pre-p1.25.png e …\desk-p4.40.png), com hotspots "UMA MUDANÇA" e "PEÇA REVISADA".
- **Teclado.** O Tab percorre pular link, marca, Modo leitura, Meu registro, os seis links, botão e resumo de cada capítulo. O foco é visível (contorno 2 px âmbar, …\kb-tab13.png). Ao chegar por Tab, o texto do capítulo já está com opacidade 1 (`teclado.json`). Enter abre a atividade com foco no ×, e Esc fecha e devolve o foco ao botão de origem. O mesmo vale para "Meu registro".
- **Modo leitura e movimento reduzido.** Leitura desliga o canvas, abre os seis aprofundamentos e mantém o capítulo corrente no topo (…\int-desk-leitura-executar.png, …\int-mob-leitura-topo.png). Com `prefers-reduced-motion`, a página entra direto em leitura (`complemento.json` → `reduced`).
- **Botões clicáveis enquanto legíveis.** Em 100% das amostras legíveis, o botão principal estava na tela e recebia o clique real (`leitura-desk.json`, `leitura-mob.json`). Não encontrei texto sobre fundo claro nos quadros amostrados.
- **Persistência.** Cada nota vai para o campo certo no `localStorage` e continua lá ao reabrir a atividade.

## Achados

### G1 — GRAVE — O percurso das seis atividades não coleta tarefa, fonte nem decisão

**Onde:** `src/content.js`, campo `field` de cada capítulo: `criterion`, `hypothesis`, `test`, `evidence`, `correction`, `next`. Os campos `task` e `reference` e o seletor `decision` só existem em "Meu registro" (`render-page.mjs`, linha 17).

**Evidência:** fiz as seis atividades pelo botão principal. `task` e `reference` continuaram vazios, e o prompt gerado saiu com "Tarefa: [preencher]" e "Fonte e versão: [preencher]" (`interacao-desk.json` → `notebookFinal`, `promptFinal`; preenchi `task` à mão só para testar o monitor). O capítulo Preparar pede apenas critério, mas a própria narrativa define como ação "escrever objetivo, fonte, duas condições de aceitação e uma propriedade a preservar". O capítulo Encerrar ("DECIDA. REGISTRE.") não oferece Aceitar, Inconclusivo nem Decisão necessária. A decisão fica num seletor para o qual o percurso nunca encaminha o aluno.

**Efeito na aprendizagem:** quem segue a aula como ela se apresenta termina sem referência nem decisão, justamente as duas competências que a rubrica exige em nível 2.

**Menor correção:** no Preparar, fazer "Guardar" abrir "Meu registro" com foco em "Minha tarefa real" quando `task` ou `reference` estiver vazio. No Encerrar, fazer o mesmo com foco no seletor de decisão.

### G2 — GRAVE — O prompt de revisão não é transferível: não leva a candidata nem a fonte

**Onde:** `src/main.js`, linha 75 (`#prompt`).

**Evidência (texto gerado, `interacao-desk.json` → `promptFinal`):** o prompt reúne tarefa, "Fonte e versão", critério, hipótese, teste, evidência e correção. Não tem espaço para colar a saída real a ser revisada nem o trecho da fonte. "Fonte e versão" é só a descrição que o aluno fez da referência. Também omite `next` (pendência) e `decision`. Em seguida pede "Proponha a menor correção útil", o que pressupõe um defeito. O prompt de revisão em `CRITERIOS-DE-APRENDIZAGEM.md` tem "Fonte: [colar]. Candidata: [colar a saída real]" e diz "Não invente um defeito". A NARRATIVA (item 4) avisa que pedir defeito obrigatório incentiva crítica inventada.

**Efeito:** levado a outra IA, o prompt faz revisar as anotações do aluno, não o artefato. Numa tarefa sem o carro, o aluno reproduz uma revisão sem objeto.

**Menor correção:** acrescentar as linhas "Trecho da fonte (colar): [colar]" e "Candidata a revisar (colar a saída real): [colar]", incluir pendência e decisão, e trocar a frase por "Se houver falha confirmada, proponha a menor correção; se não houver, diga o que verificou e o que ficou sem verificar."

### G3 — GRAVE — No celular, "não é CFD" e "ilustração" não aparecem em nenhum modo

**Onde:** `src/style.css`, linha 4, `@media(max-width:760px){… #scene-label{display:none} …}`.

**Evidência:** a 390×844, `#scene-label` contém "TÚNEL · VISUALIZAÇÃO DIDÁTICA, NÃO É CFD", mas tem `display:none` (`complemento.json` → `mobSceneLabel`). O único rótulo restante é o estêncil do piso, cortado e ilegível: só "VISUALIZAÇÃO DIDÁ…", sem "NÃO É CFD" (…\zoom-mob-tunel-2.3.png, …\mob-p2.25.png, …\mob-extra-2.15.png). No capítulo Corrigir, o assoalho aparece destacado sem hotspot e sem "(ILUSTRAÇÃO)" (…\mob-extra-4.2.png). No modo leitura, o rótulo continua oculto. O aviso só sobrevive dentro do aprofundamento fechado ("os traços são uma ilustração visual").

**Efeito:** viola o critério da própria aula ("Rótulo junto do túnel… Não esconder essa limitação"). No celular, fumaça sobre o carro vermelho é apresentada sem fronteira de metáfora.

**Menor correção:** exibir `#scene-label` no rodapé móvel pelo menos em `body[data-chapter="2"]` e `body[data-chapter="4"]`, ou reduzir o título do rodapé nesses capítulos para caber.

### G4 — GRAVE — "O que isso muda no meu trabalho?" aberto no modo cinema fica sob a navegação e fora da tela

**Onde:** `.chapter-inner` sticky com `min-height:100svh` (`src/style.css`, linhas 2 e 8). Em telas estreitas, `padding-top:46svh`.

**Evidência:**
- **Celular (Preparar, p=0,15):** o bloco termina em 941 px numa tela de 844 px. A barra de capítulos começa em 756 px e o rodapé em 798 px. O link da fonte fica em 912–925 px, fora da tela, e continua lá em p=0,30 porque o bloco está preso (`interacao-mob.json` → `detalhes0`). A captura mostra o texto do aprofundamento passando por baixo dos círculos 01–06 e do rodapé (…\int-mob-detalhes-c0-015.png). No Avaliar, o bloco termina em 1003 px (`detalhes3`).
- **Desktop (Preparar):** a última linha e o link "Mercedes · O trabalho no simulador" ficam em 885–898 px, sob o rodapé que começa em 843 px (…\int-desk-detalhes-c0-015.png).

**Efeito:** esse aprofundamento é o único lugar do modo cinema com a lição transferível e a fonte. No celular, só dá para lê-lo trocando para o modo leitura.

**Menor correção:** no modo cinema, limitar a altura do aprofundamento aberto com rolagem interna (por exemplo, `.enhanced:not(.reading) .lesson[open]{max-height:28svh;overflow:auto}`) ou, ao abrir um aprofundamento no celular, ativar o modo leitura nesse capítulo.

### G5 — GRAVE — O texto fica legível em menos da metade da rolagem e some cedo

**Onde:** `src/main.js`, linha 30 (`enter=smooth((raw+.34)/.3)`, `leave=smooth((raw-.7)/.25)`) e `src/style.css`, linhas 11 e 47 (capítulos com 220svh no desktop e 200svh no celular).

**Evidência (critério: título com todas as letras e lead com opacidade de pelo menos 0,9; `leitura-*.json`, resumido por `analisa.mjs`):**

| Capítulo | Desktop: legível | Celular: legível |
|---|---|---|
| 01 a 05 | p i−0,04 a i+0,40, ou 0,97 altura de tela | p i−0,04 a i+0,36, ou 0,80 altura de tela (≈675 px) |
| Todos | 137 de 251 amostras sem nenhum texto legível | 147 de 251 amostras sem texto legível |

- **Desktop:** o texto começa a dissolver em p≈0,40, e de p≈0,48 até a chegada do capítulo seguinte há cerca de 0,8 altura de tela sem texto (…\desk-p0.70.png). No capítulo Executar, com o túnel já em cena, o título está meio dissolvido em p=2,40 (…\mob-p2.40.png, celular).
- **Rolagem rápida por roda (600 px por gesto, `complemento.json` → `flick`):** cada capítulo apareceu legível em apenas 1 dos cerca de 3 quadros que passou (o capítulo 04 em 2). Um único gesto maior que ≈870 px no desktop, ou ≈675 px no celular, atravessa a janela de leitura inteira de um capítulo. [Inferência] No celular, um arraste de dedo costuma superar essa distância.
- **Hotspot:** fica visível só em p i+0,12 a i+0,38 (0,57 altura de tela).

**Menor correção:** atrasar o início da dissolução, trocando `(raw-.7)/.25` por algo como `(raw-.88)/.12`, e/ou reduzir a altura dos capítulos para cerca de 170svh, para que o texto fique até a câmera começar a viajar.

### M1 — MÉDIO — O feedback do quiz é igual para certo e errado e não mostra a alternativa sustentada

**Onde:** `src/main.js`, linha 66, e `src/story.js`, linha 69 (`assessChoice` devolve o mesmo `feedback`).

**Evidência:** a única diferença entre as respostas é o prefixo "Reveja a decisão." ou "Isso.". O restante do texto é idêntico nos seis capítulos (`interacao-desk.json` → `feedbackErrado` e `feedbackCerto`). A opção errada selecionada recebe o mesmo destaque âmbar da certa (…\int-desk-c0-errado.png, …\int-mob-c4-errado.png). Ao reabrir a atividade, a resposta anterior some: `pressed` volta a `false,false,false` e o feedback fica vazio (`reabrir`), porque `state.answers` é gravado mas nunca restaurado.

**Efeito:** quem erra não descobre qual raciocínio estava certo nem por que o seu falha. Nos capítulos 04 e 06, o texto nem menciona a opção escolhida ("Reprovado automaticamente", "Repetir indefinidamente").

**Menor correção:** quando a resposta estiver errada, acrescentar "A alternativa sustentada é: «choices[correct]»." e restaurar `state.answers[c.id]` em `openLesson`.

### M2 — MÉDIO — No capítulo Avaliar, os monitores de Evidência e Decisão ficam desfocados, e o foco chega quando o texto já saiu

**Onde:** `src/story.js`, linhas 34 e 40 (`bokeh` 0,95 entre 3,3 e 3,6; foco no ponto −4,7/1,5/−1,35).

**Evidência:**
- **p=3,25, texto legível:** os três monitores estão desfocados (…\desk-p3.25.png).
- **p=3,35:** só o monitor central (CRITÉRIO) fica nítido. EVIDÊNCIA, que é o campo deste capítulo, e DECISÃO ("INCONCLUSIVO") ficam ilegíveis (…\int-desk-monitores-3.35.png).
- **p=3,50:** o quadro é igual, mas o texto do capítulo já está dissolvido (…\int-desk-monitores-3.5.png).
- **Celular:** o texto dos monitores é pequeno demais para ler (…\mob-p3.25.png).

**Efeito:** a imagem que deveria provar "o monitor mostra o seu registro" mostra com clareza só o critério, e fora da janela de leitura.

**Menor correção:** reduzir o `bokeh` entre 3,3 e 3,6 para cerca de 0,35, para os três monitores entrarem na profundidade de campo, e antecipar o foco para cerca de 3,15.

### M3 — MÉDIO — O registro não tem lugar para a candidata nem para a classificação por critério

**Onde:** `FIELDS` em `src/content.js`, atividade do capítulo Avaliar.

**Evidência:** não há campo para a saída real (candidata 1 e 2) nem para marcar "Atende / Não atende / Não verificado" por critério, que são o centro da ficha de `CRITERIOS-DE-APRENDIZAGEM.md`. "Evidência observada" é texto livre. A baseline de 14/09 já apontava a atividade genérica; a pendência continua.

**Menor correção, só de texto:** no rótulo de `evidence`, pedir "para cada critério: Atende, Não atende ou Não verificado, e onde conferiu". No rótulo de `test`, pedir "onde guardou a candidata".

### M4 — MÉDIO — A exportação omite lacunas e sai em JSON

**Onde:** `src/story.js`, linhas 70–73.

**Evidência:** o arquivo `meu-loop-inteia.json` não tem a chave `reference`, que nunca foi preenchida, em vez de marcá-la como vazia (…\export-desk.json). O critério da aula diz que a exportação "deixa claras as lacunas". [Inferência] Para doutorandos que trabalham com documentos, um `.json` é pouco legível.

**Menor correção:** percorrer `FIELDS` na exportação e gravar `"não registrado"` nos campos ausentes. Se couber no escopo, oferecer a mesma estrutura em `.txt`.

### m1 — MENOR — Hotspots sem âncora com sentido

"CONFERIR A PROVA" fica na parede, acima e à direita dos monitores, e não sobre eles (…\desk-p3.25.png). "DEFINIR O PRONTO", "GUARDAR A VERSÃO" e "REGISTRAR A DECISÃO" flutuam sobre o cockpit, ancorados no volante (`src/scene.js`, linhas 194–201) (…\desk-p0.40.png, …\desk-p2.25.png, …\desk-p5.00.png). **Correção:** ancorar o hotspot 3 no monitor central e os demais numa peça coerente, ou aceitar posição neutra fora do carro.

### m2 — MENOR — "Guardar" sugere que a nota só é salva ao clicar

A nota é salva a cada tecla (`src/main.js`, linha 69), então fechar com × também guarda. Além disso, "Anotações salvas somente neste navegador." aparece no registro antes de qualquer gravação (`render-page.mjs`, linha 17; `notebookInicial.storage`). **Correção:** trocar o texto inicial por "As anotações ficam somente neste navegador." e o botão por "Concluir e fechar".

### m3 — MENOR — Pelo teclado, o aluno chega ao capítulo Hipótese antes de a peça acender

Pelo Tab, a página rola para p≈1,07. O destaque do assoalho só começa em 1,05 e completa em 1,20, e o hotspot ainda não apareceu (…\kb-tab13.png). **Correção:** iniciar o destaque em 1,00 (`TRACKS.highlight`).

### m4 — MENOR — O prompt não tem botão "Copiar"

A NARRATIVA lista "Copiar prompt" entre os comandos. Hoje o texto só fica selecionado num campo somente leitura (…\int-desk-prompt-final.png). [Não verificado em celular físico] No toque, a cópia exige gesto manual. **Correção:** um botão que chama `navigator.clipboard.writeText` e mostra "Copiado".

## Observação não reproduzida

Na primeira captura de p=1,25 no desktop, a tela de carregamento ("BOX, BOX. PRONTO 100%") apareceu translúcida sobre o capítulo 2 (…\desk-p1.25.png). Na repetição, o preloader tinha opacidade 0 e `visibility:hidden` em todas as posições, e a captura saiu limpa (…\pre-p1.25.png). Não conto como achado. Se alguém vir isso num navegador real, vale investigar a camada de transição do `#preloader`.

## Prioridade da próxima rodada

Corrigir G1 e G2 (conteúdo do registro e do prompt), G3 (rótulos no celular), G4 (aprofundamento no modo cinema) e G5 (janela de leitura). Depois, verificar de novo só esses pontos e as regressões de teclado e do modo leitura, que hoje passam.
