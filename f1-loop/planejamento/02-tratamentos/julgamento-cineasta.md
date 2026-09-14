# Julgamento — lente de diretor de cinema + tech director WebGL

Data: 2026-09-12. Juiz: direção de cinema e direção técnica WebGL. Contrato: `00-briefing.md` seção 5 (seis critérios). Régua técnica: `01-pesquisa/gramatica-visual.md` (R1–R12, dez movimentos de câmera, catálogo de estados, seis transições, orçamento de "no máximo dois efeitos caros por capítulo") e `01-pesquisa/arquitetura-atual.md` (janelas de `L`, limites de câmera testados, `N = 6` hardcoded, schema v2). Fatos: `01-pesquisa/f1-licoes.md`. Assets: `assets-locais-f1-2026.md` e `laboratorio-3d-inteia.md`.

Escala: 0–10 por critério, total sobre 60. Fui duro de propósito: 10 é raro; 8 significa "pronto para consolidar com retoques"; 6 significa "há um problema estrutural que a fase seguinte precisa resolver".

---

## 0. Um problema comum aos quatro (desconta em fidelidade e viabilidade de todos)

O Adendo 7 do briefing é explícito: **"A narrativa deve partir desses ambientes e dessa marca"** — carro INTEIA F1 2026 com 97 peças e mecânica pronta (`setAmount`, `setSpin`, `setSteering`, `setDRS`, `isolate`), box-laboratório completo, túnel de vento com 7.200 partículas de fumaça e leitura por região, identidade Racing Red `#D92135` / Graphite `#202930` / Ice White `#F0F2F3`. Nenhum dos quatro tratamentos parte daí:

- Os quatro propõem pintura "azul-petróleo metálico `#0f3a47`" e livery "LOOP 26"; o carro do laboratório é vermelho institucional sem propaganda e o adendo diz "o carro continua sem propaganda". A paleta de acentos (âmbar/ciano da gramática visual) é boa, mas a cor do herói já está decidida pela marca.
- Os quatro nomeiam peças pelos objetos do `.blend` do tutorial (`front_wing_top`, `inside_cover`) em vez dos 97 componentes com pivôs registrados em `componentes-origem.json`; A e D ainda propõem fabricar `esqueleto`, `rake`, `macaco`, `disco-freio` sem checar o que o lab já tem.
- Só C usa de fato um túnel de vento como ambiente (que já existe e foi iterado cinco vezes); D inventa "streamlines no pit lane"; A põe as streamlines num "hangar do simulador"; B não usa túnel.
- Nenhum menciona `laboratorio-3d-inteia.md` nem os monitores do box como HUD diegético (o lab já mostra "valores reais do visualizador" numa tela do painel).

Isso não é detalhe: muda o pipeline (26 MB → LOD, não "bake do tutorial"), a cor de toda a fotografia (sujeito quente = vermelho, não azul-petróleo) e elimina metade dos "riscos de asset" listados nas seções 8. Desconto de 1 ponto em fidelidade e 1 em viabilidade para todos; o vencedor precisa ser reescrito sobre o laboratório antes da consolidação.

---

## 1. Tratamento A — "SETOR ROXO" (fim de semana de corrida, 7 capítulos)

### Notas

| Critério | Nota | Justificativa curta |
|---|---|---|
| Fidelidade | 7 | Cobre os 12 princípios, mas embaralha os blocos: "Uma volta" está dividida entre o cap. 2 (Sexta) e o cap. 5 (Boxes), com "Controlar" no meio (caps. 3, 4 e 6). "Critério atingido, congelar" aparece como lição III do cap. 4 **e** dentro de "Três saídas legítimas" no cap. 7. Cap. 1, lição III "Orçamento e escopo" funde dois princípios numa lição. |
| F1 | 7 | Fatos corretos e numerados. Mas a lição principal do cap. 2 é Racing Bulls, Bélgica 2026 (#7), que a própria pesquisa manda reconfirmar por ser recente; caps. 4, 6 e 7 empilham dois fatos por ficha (Jerez + parc fermé; SF-24 + Catar; McLaren + Abu Dhabi), o que dilui. O cronômetro do HUD correndo até `1:21.072` mistura um fato real com um tempo ilustrativo na mesma tela. |
| Cinema | 8 | Imagens-chave fortes: dois carros lado a lado com só o assoalho do B ardendo em âmbar (cap. 2); o gêmeo digital com a asa traseira "dois dedos fora" (cap. 3); T-cam com faíscas, setor roxo e flash no mesmo instante (cap. 4); crane vertical do pit stop (cap. 5); golfinho na chuva com ghost verde (cap. 6). Usa os dez movimentos e cinco tipos de transição (porta do box, corte por luz, capa do carro, pit wall, spray). Contra: a fórmula de título "DIA DA SEMANA. + frase" gasta a primeira linha de sete títulos com um nome de dia; o clímax do cap. 7 é textual (quarenta callouts do livro de bordo sobre peças), não visual; sete ambientes distintos diluem a identidade. |
| Viabilidade | 6 | O mais faminto de assets: 7 ambientes (a gramática orça 5 envMaps), `esqueleto` interno a fabricar (senão a explosão dos caps. 1 e 7 "mostra só casca", como o próprio texto admite), rakes, macacos, capa do carro, porta do box. Cap. 3 acumula ghost + streamlines + ribbons + constelação do título + rack focus; cap. 6 acumula chuva + bouncing + faíscas + ghost + LED + DOF. Duas "vistas estáveis" por capítulo com órbita entre elas em `0.40–0.50` funciona, mas a T-cam do cap. 4 quebra limites e layout (reconhecido). |
| Economia | 7 | Títulos de 3 linhas e corpos de uma frase, ok. Quatro hotspots por capítulo, sempre no máximo, com textos de duas a três frases. O quadro de não repetição existe, mas "Uma mudança por volta" (cap. 2) e "Passo pequeno reversível" (cap. 5), "Verificar o resultado" (cap. 2) e "Evidência versus opinião" (cap. 4) são vizinhos demais. |
| Arco | 8 | "A pista ainda não falou" → debrief em que as mesmas peças sabem algo. Emoção por capítulo bem nomeada. A última cena repete a constelação da primeira com uma diferença (etiquetas), mas a diferença é lida, não vista. |
| **Total** | **43** | |

### Pontos fortes a preservar
- A imagem do A/B no pit lane ao sol baixo, "só o assoalho do segundo arde em contorno âmbar; entre eles, uma fita de telemetria verde e amarela diz quem ganhou".
- A descorrelação como **desvio geométrico visível** ("a asa traseira do gêmeo está dois dedos fora do lugar, e é esse desvio que a sala inteira olha").
- HUD de setores (verde/amarelo/roxo) com o roxo acendendo uma única vez; contador de falhas ligado a bandeiras (amarela → safety car → vermelha).
- Interação "escolher quem leva a peça: dar aos dois mata a comparação".

### Problemas concretos
- "QUINTA.\nA PISTA AINDA\nNÃO FALOU." / "SEXTA.\nUMA MUDANÇA\nPOR VOLTA." / "SÁBADO.\nO CRONÔMETRO\nMANDA." — sete títulos, sete primeiras linhas desperdiçadas.
- Cap. 5 (pit stop = "Uma volta, tamanho") depois de dois capítulos de "Controlar": o aluno aprende a controlar antes de aprender o tamanho da volta.
- Seção 8, item 2: a explosão depende de um `esqueleto` que não existe; no laboratório INTEIA também não há internos — o cap. 1 precisa ser reescrito para explodir só o exterior (97 peças bastam).

---

## 2. Tratamento B — "VOLTA ÚNICA" (uma volta contínua, 7 capítulos)

### Notas

| Critério | Nota | Justificativa curta |
|---|---|---|
| Fidelidade | 6 | Cap. 2 (Freada) ensina "Verificar o resultado", "Evidência conferida" e "Suíte inteira" — três nomes para o mesmo gesto, num capítulo só. "Produzir e criticar" é mapeado no pit stop (cap. 3), o que força: o pit stop é execução do planejado, não produção e crítica (A e D mapeiam melhor: um dono por tarefa, passo pequeno). "Ensaiar a volta" ocupa uma lição principal no cap. 1 enquanto "Crítico independente" só chega no cap. 4. |
| F1 | 6 | Fatos corretos e sem itens não confirmados; evita Racing Bulls 2026 por prudência. Mas a moldura inteira é ficção declarada: "Anel de Precisão", box no meio da volta ("licença poética"), uma volta que termina com bandeira quadriculada, flash e parc fermé — o critério 2 pede "analogia exata, não forçada", e aqui a estrutura da própria F1 foi dobrada para caber na tese. |
| Cinema | 8 | O mais fiel à R1: uma tomada só, o carro nunca sai de quadro nem para. Abertura em blueprint ciano na hora azul com o pit board em branco; "um único flap se solta em contorno âmbar de um carro escurecido a 200 km/h"; o carro que "se dissolve em 250 pontos ciano presos por fios a fitas de luz" com rack focus; gotas na lente, painel amarelo dobra, blackout, o carro volta com intermediários. O bookend é o mais preciso dos quatro (mesma pose, mesmo pit board, texto que vira). Contra: sem paradas de silêncio — a referência vive de "respiros" com o herói parado; o carro que nunca para pode virar esteira; a ficha (`0.50–0.98`) é lida com a câmera em movimento (`0.50–0.86`), o inverso do contrato do motor. |
| Viabilidade | 6 | "O mundo passa pelo carro" em todos os capítulos, com curvatura simulada por bend shader — o próprio texto admite "risco de parecer esteira". Inverte a janela estável testada (`pose(0.5) === pose(0.7)`). Blueprint via `EdgesGeometry` dobra draw calls (≈45 objetos). Reflexo planar em dois capítulos (Box e Chuva) e no cap. 5 soma chuva + reflexo + DOF, três efeitos caros. T-cam de novo. |
| Economia | 7 | Títulos enxutos ("SE O FANTASMA\nPASSAR,\nVOLTE ATRÁS."), mas "O REGISTRO FICA." está no limite de 16 caracteres (reconhecido) e o cap. 2 é redundante por dentro. Pit board com sete estados é um bom substituto de texto. |
| Arco | 9 | "Nenhuma volta começa sem saber o fim" é prometido no grid e devolvido na chegada, com o pit board virando "PRÓXIMA VOLTA · ENTRADA: REGISTRO DESTA". Tensão real no cap. 4 ("se o fantasma passa, a mudança piorou"). |
| **Total** | **42** | |

### Pontos fortes a preservar
- Pit board diegético como objeto 3D que guarda o alvo antes e o número depois.
- Dissolução do carro em constelação de sensores ancorada nos nós do modelo, com fio até a ribbon correspondente.
- "Blackout = reset": o carro reaparece com o que aprendeu (intermediários), sem trocar de lugar.
- DRS fecha **antes** de frear ("para de adicionar antes de medir") — gesto pequeno, exato.
- Transição motivada pela placa de 100 m de frenagem.

### Problemas concretos
- Seção 3: "Licença poética única e declarada nos créditos: a entrada dos boxes fica no meio da volta" — declarada, mas continua sendo uma F1 que não existe.
- Cap. 2 lições 1–3 são sinônimos; o capítulo deveria ceder uma vaga a "Crítico independente" ou "Não mexer no teste".
- Cap. 3: "Produzir e criticar" no box não é exato; o pit stop "troca só o planejado".

---

## 3. Tratamento C — "ÚLTIMO ESTADO VERDE" (ciclo de vida de um upgrade, 7 capítulos)

### Notas

| Critério | Nota | Justificativa curta |
|---|---|---|
| Fidelidade | 9 | O mapeamento mais limpo: Preparar (caps. 1–2), Uma volta (3–4), Controlar (5–6), Encerrar (7); 21 termos únicos; "a resposta do modelo é o CFD; a pista é `npm test`" é a frase que o aluno leva. A interação MANTER / REVERTER (cap. 6) é a única dos quatro em que o aluno **decide** e vê a consequência no carro e no registro. Desconto pelo problema comum (seção 0). |
| F1 | 9 | A espinha factual (Ferrari SF-24: Barcelona → Silverstone rollback → anomalia no túnel → Monza) é uma história real de loop de engenharia, contada na ordem certa. Escala 60% do túnel vira gesto literal. Cuidado exemplar: "não afirmar no texto que houve A/B em Silverstone". Desconto: Racing Bulls 2026 em hotspot; números de correlação (−4/−11/−19) ilustrativos. |
| Cinema | 7 | Conceito de cor mais elegante ("o calor migra: ciano é previsão, âmbar é medida"). Imagens fortes: assoalho velho deslizando em arco para uma prateleira iluminada (cap. 3); fantasma plano contra carro real oscilando com a traseira pulsando âmbar (cap. 5); dois carros nos macacos trocando assoalhos sob bandeira vermelha (cap. 6); nuvem âmbar que vira o assoalho de um carro que não existe (cap. 7). Contra, e é grave para "um carro ultra-realista e lindo": o protagonista é a peça **menos visível** do carro — um assoalho preto por baixo; a câmera passa a experiência inteira agachada. Não há pit stop, quase não há velocidade (só o cap. 4), a câmera fica parada de `0.18` a `0.72` em todos os capítulos (fiel ao teste, mas com menos "jogo de câmeras" do que a referência pede). Cap. 4 deixou rascunho no texto: "a câmera 'se solta' da T-cam? Não — R1: a câmera não teleporta." |
| Viabilidade | 7 | Acertos: nuvem por amostragem de vértices (dispensa internos), flow-vis e mapa de pressão como máscaras procedurais, o túnel e o box já existem no laboratório INTEIA (é o tratamento que mais se beneficiaria do Adendo 7). Custos próprios: três morph targets no assoalho (asset extra), laminação por clipping, prateleira e `floor@velho` como objetos persistentes que mudam de ambiente entre caps. 3–7 (estado próprio por capítulo, reversível), A/B em dois capítulos, escala 60% contra o contrato de layout. |
| Economia | 6 | Corpos e essências estouram: cap. 5 corpo "O fantasma do CFD é plano; o carro real oscila; a traseira do assoalho pulsa onde os dois divergem." (≈95 caracteres, três orações); essência do cap. 6 tem duas linhas; hotspots carregam citação completa com fonte. Títulos ok ("VOLTE AO ÚLTIMO\nESTADO VERDE."). |
| Arco | 8 | Hipótese → prova → desconforto → coragem → legado; a nuvem ciano vira nuvem âmbar. Tensão real ("o carro mais rápido carrega um erro"). Falta o clímax físico: o ápice emocional é uma decisão num pit lane cinza. |
| **Total** | **46** | |

### Pontos fortes a preservar
- Prateleira iluminada com o `floor@velho` visível do cap. 3 ao 7: o "último estado verde" como objeto de cena permanente.
- MANTER / REVERTER como hotspot grande diegético, com a linha do registro mudando conforme a escolha.
- Regra de cor "ciano = previsão, âmbar = medida"; "a tinta vira dado" (estrias de flow-vis se desprendem e viram ribbons) como transição.
- Cap. 5: rack focus do carro para as ribbons enquanto a região âmbar pulsa onde previsto e medido discordam.
- Slide "Calibrar o verificador" (teste de controle com defeito plantado).

### Problemas concretos
- Sem pit stop: o briefing pede "boxes, pit stops, avaliação, melhorias, telemetria, debrief, upgrades".
- Herói agachado: um carro de F1 lindo filmado por baixo durante sete capítulos.
- Texto do cap. 4 com autocorreção deixada no documento.

---

## 4. Tratamento D — "BOX, BOX." (a noite da garagem, 03:12 → 06:31, 7 capítulos)

### Notas

| Critério | Nota | Justificativa curta |
|---|---|---|
| Fidelidade | 9 | Segue a progressão pedagógica da pesquisa etapa por etapa (referência e critério → volta → crítico → regressão → orçamento e reset → encerrar em duas partes → armadilhas nos hotspots). 21 termos, nenhum repetido. "A luz verde só abre quando os quatro sinais chegaram" = suíte inteira; "uma roda sem sinal: segurar o carro" = risco identificado — as analogias mais exatas dos quatro para Encerrar. O slide 1 mantém os 12 itens do site palavra por palavra. Desconto pelo problema comum (seção 0). |
| F1 | 7 | Fatos corretos, sourced, sem itens não confirmados; "dados ilustrativos" rotulados (volta 31, curva 9). Mas a moldura temporal é ficção não declarada: nenhum carro cruza uma linha de chegada com bandeira quadriculada às 06:31; e o cap. 2 "Tinta" põe streamlines de túnel passando por um carro parado no pit lane ("aqui como 'o ar da pista passa'") — conflação de túnel e pista que a lição de Smedley (#4) justamente distingue. |
| Cinema | 9 | A melhor abertura: macro num disco de freio ainda morno, "o aluno não sabe ainda que é um carro", depois o dolly baixo atravessando trinta peças no chão até o chassi nu, e o único brilho frio é o display do volante. A luz do céu como função do progresso global (breu → cobalto → laranja → sol) é a decisão de fotografia mais forte dos quatro: uma variável, uma temperatura por capítulo, e o wipe vira quase desnecessário. Pit stop "quase vertical, vinte silhuetas em posições fixas como notas numa partitura, o cronômetro em 1,80 e o sol entrando rasante" é a imagem-chave mais memorável de toda a rodada. Chegada com "o sol exatamente atrás da asa traseira" e trinta etiquetas numeradas. Respeita a pose estável `0.50–0.86`; usa oito dos dez movimentos; transições variadas (porta, fumaça, wipe, pit wall). Contra: "Turno" (cap. 1) é a cena mais parada (carro na plataforma, fantasma meio corpo à frente); "Limite" é declaradamente "de leitura". |
| Viabilidade | 7 | Precisa de um estado novo `floor` (pose no chão por peça; mitigação proposta é barata), muitos props procedurais (discos ×4, prancha, rake, macacos, pistolas ×4, pit board, bandeira, semáforo), vinte planos de silhueta, reescrita dos limites de câmera (macro a 0,35 u, T-cam, crane a 6 u). A favor: a tabela de riscos mais completa e honesta, com fallback concreto para `N = 6` (Limite dentro de Retorno); cinco envMaps por progresso global é barato e elegante; chuva só como condição opcional; "no máximo dois efeitos caros" listado por capítulo. Desconto pelo problema comum. |
| Economia | 8 | Os títulos mais apertados: "TRÊS DA MANHÃ.\nPEÇAS NO CHÃO.\nNENHUM NÚMERO." (14/14/14), "MAIS ASA.\nMAIS SALTO.\nVOLTA AO VERDE.", "DEZOITO VOLTAS.\nNEM UMA A MAIS.". Corpos de uma frase. Hotspots de duas frases com parêntese de fonte — um pouco longos (cap. 3, hotspot 1 tem três frases). |
| Arco | 9 | "Três da manhã. Peças no chão. Nenhum número." → as mesmas trinta peças com etiqueta ao cruzar a linha; "o que mudou entre as duas imagens não foi o carro; foi que cada decisão passou a ter um registro". O relógio de parede (03:12 → 06:31) é o arco inteiro num `output` do HUD. Emoção por capítulo cresce sem repetir. |
| **Total** | **49** | |

### Pontos fortes a preservar
- Abertura em macro do disco morno + dolly no campo de peças; o inventário no chão como primeira imagem.
- Amanhecer como variável global de luz (cinco envMaps interpolados por progresso global).
- Pit stop dilatado (1,80 s em 40% de `L`) visto de cima, vinte silhuetas, brilho ciano por posição quando cada tarefa termina, semáforo que só abre com quatro sinais.
- Semáforo do HUD que acende ao visitar os quatro hotspots das rodas (lição vivida sem quebrar a reversibilidade).
- Onboard com o horizonte subindo e descendo com o bouncing (cap. 3): a regressão sentida no quadro.
- Etiquetas numeradas nas trinta peças ao cruzar a linha.

### Problemas concretos
- Cap. 2: streamlines de túnel num pit lane; usar o túnel de vento INTEIA que já existe.
- Cap. 6: "cruzar a linha às 06:31" e bandeira quadriculada ao amanhecer — declarar como licença ou trocar por "out-lap de instalação ao sol nascendo, cronômetro do muro registrando a volta".
- Cap. 1 "Turno" precisa de um evento visual (ver enxerto de B).
- Cap. 0 e cap. 5 pedem pose no chão e vinte silhuetas — os dois maiores custos de asset além do que o laboratório já tem.

---

## 5. Quadro comparativo

| Critério | A Setor Roxo | B Volta Única | C Último Estado Verde | D Box, Box. |
|---|---|---|---|---|
| Fidelidade | 7 | 6 | 9 | 9 |
| F1 | 7 | 6 | 9 | 7 |
| Cinema | 8 | 8 | 7 | 9 |
| Viabilidade | 6 | 6 | 7 | 7 |
| Economia | 7 | 7 | 6 | 8 |
| Arco | 8 | 9 | 8 | 9 |
| **Total / 60** | **43** | **42** | **46** | **49** |

---

## 6. Vencedor: Tratamento D — "BOX, BOX."

Vence por ser o único que junta, ao mesmo tempo, o mapeamento pedagógico mais exato (com C), a fotografia mais forte (abertura, amanhecer como arco de luz, o pit stop como partitura) e a maior honestidade técnica (respeita a pose estável do motor, lista os dois efeitos caros por capítulo, tem fallback para `N = 6`). Perde para C em verdade de F1 (moldura das 06:31 e o túnel no pit lane) e para B na precisão do bookend textual — os dois pontos que os enxertos abaixo resolvem.

Condição para a consolidação: **reescrever D sobre o Laboratório 3D INTEIA** (carro Racing Red com os 97 componentes e a mecânica `createMechanics`, box-laboratório como garagem dos caps. 0, 1 e 5, túnel de vento existente para o cap. 2, identidade INTEIA no HUD e na placa do box, monitores do box como registro diegético). Isso remove da seção 8 de D: bake do tutorial, stickers FIA/Pirelli, licença do tutorial, e boa parte dos props (o lab já tem pistola, mangueira, macaco estacionado, rack de pneus, carrinho de ferramentas).

---

## 7. Enxertos (o que os perdedores dão ao vencedor)

1. **[C] Prateleira do último estado verde.** No cap. 3 "Retorno", o assoalho rejeitado não "flutua em constelação": desliza em arco para a prateleira iluminada do box (o lab tem rack e gavetas), com contorno verde ao pousar, e fica visível até o cap. 6. No cap. 5 "Parada", a prateleira está no canto do quadro durante o crane. Objeto persistente com estado por capítulo, como C descreve.
2. **[C] Hotspot grande MANTER / REVERTER** no cap. 3 "Retorno" (`0.40–0.50`): "Manter" segura o assoalho novo, mantém o bouncing, pinta o contador de falhas de vermelho e grava "decisão · manter · risco aceito sem causa raiz" no livro de bordo; "Reverter" é o padrão do scroll. Reversível, sem tocar a câmera.
3. **[C] Regra de cor "ciano é previsão, âmbar é medida"** como camada sobre o arco do amanhecer de D: fantasma do simulador, fitas de CFD e fita de parc fermé em ciano; contador, contorno da peça que sai, etiquetas finais e a nuvem em âmbar. Dá ao aluno uma leitura de cor consistente do cap. 1 ao 6.
4. **[C] Cap. 2 "Tinta" no túnel de vento INTEIA**, não no pit lane: o carro parado, o mundo o testa (mov. 7), rims ciano, fumaça por região (já existe), flow-vis revelada sob UV no fim; o carro B baseline vira `ghost` sobreposto. A transição de saída é a de C: "as estrias verdes se desprendem do assoalho e viram ribbons de telemetria" — a tinta vira dado — e o wipe leva à pista cinza do cap. 3.
5. **[B] Pit board diegético com alvo antes e número depois.** Objeto 3D com textura canvas no muro do box (cap. 0) mostrando `CRITÉRIO: 5 VOLTAS SEM OSCILAÇÃO · -:--.---`; no cap. 4 "Limite" mostra `18 · BOX` (D já tem); no cap. 6 recebe o tempo e `CRITÉRIO ATINGIDO`, e vira `PRÓXIMO TURNO · ENTRADA: REGISTRO DESTE` no último quadro. É o bookend textual que falta ao bookend visual de D.
6. **[B] Constelação de sensores com rack focus** no cap. 1 "Turno": em `0.50–0.74`, a carroceria cai a 15% de opacidade, 250 pontos ciano acendem nos nós reais do carro INTEIA (rodas, pushrods, camadas da asa, assoalho), cada um ligado por fio à ribbon correspondente; o foco sai do carbono e cai na fita âmbar do freio. Dá evento visual ao capítulo mais parado de D e ensina "verificar o resultado" com imagem, não só com fantasma.
7. **[B] Blackout = reset** no cap. 4 "Limite": na segunda falha (`0.50–0.56`), corte por luz de 2% e o carro reaparece do outro lado com pneus novos e o pit board em `BOX` — o `/clear` com prompt refinado mostrado como gesto, sem trocar de lugar. Tira "Limite" da condição de "capítulo de leitura".
8. **[B] DRS fecha antes de frear** (cap. 3 de D, na entrada da curva rápida): `drs 1 → 0` em `0.18–0.22`, callout "parar de adicionar antes de medir". A mecânica `setDRS` do lab já faz isso.
9. **[A] HUD de setores** (três faixas sob o relógio: verde melhorou, amarelo piorou, roxo critério atingido) com o roxo acendendo uma única vez — no cap. 6 de D, no instante em que o carro cruza a linha (D já reserva o roxo "só quando um critério é atingido", mas não o materializa no HUD).
10. **[A] Contador de falhas ligado a bandeiras** no cap. 4 "Limite": `1` = amarela, `2` = safety car (`speed` cai), `3` = vermelha com campo "o que interrompeu" que vai para o livro de bordo. D tem bandeira e pit board separados; A tem a hierarquia num único contador.
11. **[A] Descorrelação como desvio geométrico visível**: no cap. 1 "Turno", quando o fantasma do simulador está meio corpo à frente, a asa traseira do fantasma fica "dois dedos fora" do real, e um callout marca "túnel ≠ pista". Prepara a lição "calibrar o verificador" do cap. 2 sem palavra a mais.
12. **[A] Etiquetas finais coloridas por decisão**: no cap. 6 de D, as trinta etiquetas numeradas recebem a cor da decisão registrada para aquela peça (roxo seguir, amarelo reverter, ciano parar) — as etiquetas viram o livro de bordo desenhado sobre o carro, sem callouts de texto.
13. **[A] Interação "quem leva a peça"** no cap. 2: botões A e B; dar a peça aos dois mostra "comparação morta" e a fita de telemetria some.
14. **[C] Slide "Calibrar o verificador"** (teste de controle com defeito plantado; "consertar o verificador é legítimo com evidência de que ele mede errado, não quando ele só incomoda") no lugar da seção 2 do slide "Livro de bordo" de D, ou como terceira seção do slide 1 — é o único conteúdo de C que D não cobre em lugar nenhum.

---

## 8. Correções obrigatórias no vencedor antes da consolidação

- Declarar a licença temporal (a noite 03:12 → 06:31 é dramaturgia; sessões de F1 não terminam ao amanhecer) nos créditos e no `.sr-only`, ou trocar a bandeira quadriculada por "out-lap ao sol nascendo com o cronômetro do muro marcando a volta".
- Substituir toda a nomenclatura de peças pelos nomes dos 97 componentes do `componentes-origem.json` e a paleta do carro por Racing Red `#D92135`; manter âmbar/ciano só como acentos de luz e dado.
- Cortar da seção 8 os riscos que o laboratório já resolveu (bake, stickers, licença do tutorial) e acrescentar os reais: LOD de 752 k para ≤ 300 k triângulos, agrupamento de draw calls por material, integração de `createMechanics` com o estado contínuo do Director (hoje `setSpin` é booleano; a narrativa precisa de `speed` 0..1).
- Encurtar os hotspots do cap. 3 para duas frases; mover as fontes para o `small` da ficha.
