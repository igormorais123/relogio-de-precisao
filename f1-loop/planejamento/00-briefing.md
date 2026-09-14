# Briefing — "F1 Loop": aula de Engenharia de Loop com um carro de Fórmula 1

Data: 2026-09-12. Pasta de trabalho: `f1-loop/planejamento/`. Fase atual: **só narrativa e planejamento** (nada de código do site ainda).

## 1. O pedido (nas palavras do autor, condensado)

O site atual (`relogio-de-precisao`) é uma aula scroll-driven em WebGL: um relógio mecânico é montado e desmontado pela rolagem enquanto seis capítulos ensinam problem solving com IA (ciclo de Van Aken: problema, pesquisa, planejamento, execução, avaliação, aprendizado).

Agora queremos **outra versão, em pasta separada**, com:

- **Herói visual:** um carro de Fórmula 1 ultra-realista e lindo, no lugar do relógio.
- **Tema único:** uma aula **só de Engenharia de Loop** (não o ciclo inteiro de problem solving). O loop é o conteúdo; o carro é a metáfora.
- **Jornada do carro:** loop de engenharia dos boxes, pit stops, avaliação, melhorias, telemetria, debrief, upgrades — a F1 como laboratório de iteração.
- **Lições reais da F1** que se aplicam de fato à engenharia de loop (fatos verificáveis, com equipes, anos, números quando houver).
- **Referência visual obrigatória:** https://cornrevolution.resn.global/ (Resn / Pioneer "Corn. Revolutionized."). No lugar do milho, o carro. Queremos o mesmo jogo de câmeras, imersão e efeito cinematográfico. Ver seção 4 e as capturas em `referencias/`.
- **Método de trabalho:** narrativa construída como se fôssemos um cineasta / diretor de arte / diretor de cinema, em iterações com avaliador rigoroso.
- Idioma da experiência e dos documentos: **português brasileiro** (termos técnicos podem ficar em inglês).

## 2. O que é "Engenharia de Loop" neste curso (fonte: site atual)

No site atual, Engenharia de Loop aparece como aprofundamento do capítulo Avaliação (`src/data/paginas.js`):

- Lead: **"Produzir. Criticar. Revisar. Verificar."**
- Metáfora do relógio: "Medir. Regular. Medir de novo."
- Estrutura em quatro blocos:
  - **Preparar:** referência real; critério verificável; tarefas delimitadas.
  - **Uma volta:** produzir e criticar; revisar o necessário; verificar o resultado.
  - **Controlar:** crítico independente; evidência conferida; reverter regressões.
  - **Encerrar:** critério atingido; risco identificado; limite: inconclusivo.

Ideias vizinhas presentes no curso e que pertencem ao loop: revisão adversária ("procure falhas; confira as provas"), critério de saída ("resultado, risco ou limite"), gestão de tokens/custo, passos verificáveis e reversíveis, escolher o executor pela tarefa, documentar decisões para o próximo ciclo, "precisão não é opinião", "o cronômetro manda; sensação de velocidade não conta", regra prática do autor: **2 falhas seguidas = reset com prompt refinado; 3 falhas = parar e perguntar**.

Contexto do autor: Dr. Igor Morais Vasconcelos, criador do sistema INTEIA de engenharia de contexto (5 leis: economia de tokens, verificação obrigatória, reset > correção, exploração antes de ação, simplicidade estratégica). A aula é para quem usa IA (Claude Code e similares) para resolver problemas e precisa aprender a iterar com critério.

## 3. Como o site atual é construído (para a narrativa nascer compatível)

- `src/data/narrativa.js` exporta `CAPITULOS`: cada capítulo tem `id`, `slug`, `nome`, `titulo` (3 linhas em caixa alta, com `\n`), `corpo` (uma frase), `cor`, `acento`, `essencia`, `licoes[3]` (`termo`, `texto`, opcional `pagina`), opcional `hotspots[]` (`id`, `nome`, `texto`), opcional `cenarios`, e `f1` (`termo`, `texto`) — sim, o site atual já usa analogias F1 curtas.
- `src/core/cameraPath.js`: pose de câmera por capítulo e progresso local (0..1), transição de 18% no começo de cada capítulo com órbita suave; cada capítulo começa exatamente na pose final do anterior.
- `src/core/Director.js`: por capítulo, mapeia progresso local em estado do herói (explode, opened, running, wind, health, scatter) e efeitos (`fog`, `constellation`, `hotspots`, `blueprint`, `sparks`, `reference`, `curve`, `finale`, `plate`, `callouts`). Fundo faz transição diagonal nos últimos 14% de cada capítulo.
- HUD em DOM: pontos de capítulo à direita, menu, dica de scroll, cenários (frio/calor/impacto/posição) com gráfico de deriva, "registro" (gaveta com log do ciclo, exportação JSON).
- Acessibilidade: narrativa completa em `.sr-only`, `prefers-reduced-motion`, fallback sem WebGL.
- Stack: Vite, three.js, Lenis + ScrollTrigger, fontes Bebas Neue (títulos) e Lato (corpo).

A narrativa nova pode propor um schema estendido, mas deve continuar expressável como dados + coreografia por progresso de scroll.

## 4. Gramática visual da referência (Corn Revolution, Resn) — observada em 2026-09-12

Capturas em `referencias/corn-00.jpeg` … `corn-12.jpeg` (1440×900, sequência real de navegação).

- **Um mundo 3D contínuo, uma câmera só.** Não há "seções" HTML: a rolagem (teclado/roda) avança a câmera por um trajeto, e o herói se transforma ao longo dele. Três capítulos: Science → Real World Testing → Result, com âncoras `#science`, `#testing`, `#result`.
- **Abertura:** título gigante em caixa alta condensada ("CORN. REVOLUTIONIZED.") sobre o herói em close, fundo escuro esverdeado, subtítulo pequeno. Logo e menu hambúrguer no canto superior esquerdo.
- **Texto como objeto de cena:** títulos 3D com material metálico/áspero que **dissolvem em partículas** quando a câmera parte (corn-03, corn-09). Bloco de texto à esquerda, herói à direita/centro.
- **Hotspot circular** ("EXPLORE THE LIBRARY") com dois anéis finos e ponto — CTA diegético que abre um aprofundamento (corn-01).
- **Pontos de capítulo** à direita, verticais, com anel no ativo e rótulo do capítulo aparecendo na transição ("REAL WORLD TESTING", corn-12).
- **Transições diagonais (wipe)** entre mundos: uma diagonal escura varre a tela e revela o próximo ambiente (corn-07, corn-10, corn-12).
- **Metamorfose do herói ao longo do scroll:** fita de DNA em partículas douradas → constelação de nós → grãos caindo → semente brotando em vaso → planta crescendo (câmera sobe pelo caule) → campo visto de cima em grade de parcelas → volta ao grão em close.
- **Cinematografia:** profundidade de campo forte (fundo desfocado, bokeh), grão de filme, vinheta, iluminação lateral quente contra fundo frio, partículas flutuantes em todas as cenas, paleta escura (verde-preto, dourado, teal), sensação de câmera em dolly/crane lento e contínuo.
- **Ritmo:** cada "parada" tem um título + parágrafo curto; entre paradas, trechos de pura viagem de câmera sem texto (respiro visual). Rolagem tem inércia; a página pede paisagem no mobile.

Tradução desejada para o carro: o mesmo rigor de câmera única, herói que se transforma (carro desmontado/montado, peças em constelação, vento do túnel, chuva, faíscas), texto que vive na cena, hotspots diegéticos, wipes diagonais entre ambientes (túnel de vento → simulador → garagem → pit lane → pista → sala de debrief) e uma paleta própria.

## 5. Critérios de sucesso desta fase (o avaliador usa isto)

1. **Fidelidade ao conteúdo:** cada capítulo ensina uma parte real da engenharia de loop (preparar, volta, controlar, encerrar e seus princípios), com termos que o aluno consegue aplicar no dia seguinte ao usar IA.
2. **Verdade na F1:** cada lição de F1 é um fato verificável (equipe, ano, número, regra) e a analogia com o loop é exata, não forçada.
3. **Força cinematográfica:** cada capítulo tem uma imagem-chave memorável, movimento de câmera definido, transição de entrada e saída e um "porquê" emocional.
4. **Viabilidade em scroll-driven WebGL:** tudo descrito como estado do herói + câmera + efeitos em função do progresso local (0..1), sem depender de vídeo ou de assets impossíveis.
5. **Economia:** títulos de 2–3 linhas em caixa alta; corpo de uma frase; três lições por capítulo; nada redundante entre capítulos.
6. **Arco:** a jornada do carro tem começo, tensão e resolução; a última cena responde a primeira.

## 6. Entregáveis desta fase (todos em `f1-loop/planejamento/`)

- `01-pesquisa/` — engenharia de loop, lições da F1, gramática visual, arquitetura atual.
- `02-tratamentos/` — tratamentos narrativos alternativos e o julgamento.
- `03-narrativa/NARRATIVA.md` — a narrativa consolidada (visão, arco, capítulos, câmera, transições, HUD, aprofundamentos).
- `03-narrativa/capitulos/` — um arquivo por capítulo com roteiro detalhado.
- `04-dados/narrativa-f1.draft.js` — rascunho dos dados no schema do site (para a fase seguinte).

## 7. Adendo (2026-09-12, noite): o carro, o box, o túnel e a marca já existem

O autor construiu o **Laboratório 3D INTEIA** (`C:\Users\igorm\projetos\INTEIA-laboratorio-3d`): carro F1 2026 genérico com 97 peças separadas e mecânica pronta (explodir, rodas, esterço, DRS, isolar peça), box-laboratório completo, túnel de vento com fumaça e leitura por região, e identidade visual INTEIA (Racing Red #D92135, Graphite #202930, Ice White #F0F2F3). Detalhes em `01-pesquisa/laboratorio-3d-inteia.md` e capturas `referencias/lab-*.png`. **A narrativa deve partir desses ambientes e dessa marca**, propondo só o que falta.
