# Capítulo "Motor": pedagogia, fatos e rascunho

Data: 14/09/2026. Autor: agente de pedagogia e fatos (equipe Claude). Destinatários: Astra/Codex (implementação) e equipe Claude (revisão).
Escopo: conteúdo e checagem de fatos. Nenhum código foi alterado.

Resumo da recomendação: inserir **03 / MOTOR** entre Hipótese e Executar, com o título **"REGISTRE O MODELO\nE A CONFIGURAÇÃO"**. O capítulo ensina a escolher a ferramenta e o modelo pela tarefa e pelos dados, e a registrar modelo, versão, data e configuração antes de rodar o pedido. A lição de F1 usa os mapas de motor preparados com antecedência da unidade de potência de 2026 (fonte primária conferida).

---

## 1. Onde o capítulo entra no ciclo

Ciclo atual: 01 Preparar, 02 Hipótese, 03 Executar, 04 Avaliar, 05 Corrigir, 06 Encerrar.

### Posição A (recomendada): entre Hipótese e Executar

Novo ciclo: 01 Preparar, 02 Hipótese, **03 Motor**, 04 Executar, 05 Avaliar, 06 Corrigir, 07 Encerrar.

Prós:
- A hipótese acabou de dizer o que vai mudar. O Motor fixa todo o resto antes de a máquina rodar. A ligação com "uma mudança por vez" fica imediata: modelo e configuração são as variáveis que o aluno precisa congelar ou declarar como a mudança testada.
- A checagem de autorização e de dados acontece no último momento seguro, antes de a fonte ser colada na ferramenta, que é o que ocorre em Executar.
- Narrativa: o carro abre, o motor gira e fecha, e em seguida o carro sai para o túnel e a pista de Executar. A sequência "ligar o motor, depois rodar" é natural e não exige mudar a coreografia dos capítulos seguintes.
- Retira de Executar a pergunta "em que ferramenta?", que hoje fica solta ali, e deixa Executar concentrado em guardar pedido e resposta.

Contras:
- Renumera Executar a Encerrar (03 a 06 viram 04 a 07). Impacto para o Codex: `place` dos capítulos, `STAGES` e índices fixos em `src/learning/model.js` (`index === 0..5`, `index === 6` como fim do percurso), `pending === 6` em `src/learning/index.js`, testes em `tests/learning.test.mjs` e qualquer pose de câmera indexada por capítulo.
- Sete capítulos alongam a aula em uma parada.

### Posição B: logo após Preparar (antes de Hipótese)

Prós: escolher a ferramenta faz parte da preparação; o aluno já conhece fonte e critério, e sabe quais dados vão entrar. A configuração de partida funcionaria como a "versão de partida" do campo `reference`.

Contras: separa critério de hipótese, que hoje formam um par didático forte. O aluno registra a configuração antes de saber o que vai variar; na Hipótese, "trocar o modelo" apareceria como algo já decidido. Narrativamente, o motor abriria cedo, antes de existir um teste a rodar, e a cena perderia a função de partida.

### Posição C: aprofundamento dentro de Executar (sem capítulo novo)

Prós: nenhuma renumeração; o visor de motor já existe como diálogo (`src/engine/viewer.js`).

Contras: não atende o pedido do Igor ("1 parte a mais", "cena cinematográfica dedicada", "a câmera indo para o motor"). Um aprofundamento opcional deixa de fora justamente quem mais precisa do registro de modelo e versão.

### Decisão

Posição A. É a única que liga as duas regras centrais do pedido (trocar modelo é uma mudança; modelo mais capaz não dispensa conferir) aos capítulos vizinhos sem quebrar o par Preparar e Hipótese, e dá à cena do motor a função de partida do teste.

Ajustes que a posição A pede em capítulos existentes (propostas; não aplicadas):
- Executar, `prompt`: trocar "Qual pedido vou usar, com qual fonte e em que ferramenta?" por "Qual pedido vou usar e com qual fonte?".
- Executar, `example`: retirar "Ferramenta: assistente de IA autorizado pelo órgão." (a informação passa para o Motor).
- FIELDS, `test`: trocar a dica "Pedido usado, ferramenta, onde salvei..." por "Pedido usado, onde salvei a resposta intacta e o limite de tentativas ou tempo."
- Hipótese não precisa mudar: o quiz dela já trata de três mudanças juntas (prompt, anexo e modelo). Por isso o quiz do Motor trata de outro ponto (ferramenta autorizada e dados), para não repetir.

---

## 2. O que é o "motor" no loop com IA

Para quem redige comunicados, resumos de processo e respostas a ofício, o motor é o conjunto que efetivamente produz a resposta. Tem duas partes: a escolha (qual ferramenta e qual modelo) e a configuração (com que ajustes ele rodou). O mesmo pedido, com a mesma fonte, pode dar respostas diferentes se qualquer uma dessas partes mudar.

### 2.1 Escolha da ferramenta e do modelo

1. **Autorização e dados vêm primeiro.** O dado que vai entrar define quais ferramentas podem ser usadas. O guia federal de IA generativa diz: "A escolha da ferramenta deve ser guiada pela confidencialidade dos dados a serem tratados e pelo nível de controle e auditabilidade que o órgão público precisa exercer sobre o sistema." e "Não insira informações pessoais de servidores, cidadãos ou terceiros em aplicativos de IAG não aprovados." (fonte G1, trechos conferidos no HTML).
2. **Ferramenta não é modelo.** Uma mesma ferramenta pode oferecer mais de um modelo, e o modelo padrão pode mudar com o tempo. Fornecedores aposentam modelos: a documentação da Anthropic informa que "Anthropic regularly retires older ones" e que "Requests to retired models will fail." (fonte A1). Consequência prática: o nome comercial de hoje não garante o mesmo modelo daqui a alguns meses. Por isso se anota o nome e a versão como aparecem na tela, com a data.
3. **Critérios de escolha pela tarefa** (sem números de modelos específicos, que mudam rápido):
   - desempenho em tarefas parecidas com a sua, verificado por você em testes anteriores registrados, e não pela propaganda do fornecedor;
   - volume de texto que o modelo aceita de uma vez (janela de contexto). Um processo longo pode não caber inteiro; [Inferência] quando não cabe, algumas ferramentas cortam ou resumem o material sem avisar com clareza, e a resposta pode omitir folhas;
   - tempo de resposta, relevante quando há prazo ou muitas rodadas;
   - custo, cotas e licenças contratadas pelo órgão.
4. **Um modelo mais capaz não dispensa conferir na fonte.** O guia federal: "A responsabilidade do servidor sobre qualquer documento produzido, com ou sem IAG, permanece inalterada." e, como uso não aconselhável, "Aceitar respostas de IA como verdadeiras sem verificá-las" (fonte G1). Esta é a ligação explícita com Avaliar.

### 2.2 Configuração

- **Instruções fixas**: textos que a ferramenta aplica a toda conversa (instruções personalizadas, instruções de sistema, perfis de projeto; o nome varia por ferramenta). Mudam o comportamento sem aparecer no pedido.
- **Ferramentas ligadas**: busca na internet, leitura de arquivos, execução de código. No caso prático, a busca ligada pode trazer de fora uma data de adoção que o registro não sustenta. Essa é exatamente a frase 3 reprovada em Avaliar.
- **Anexos**: quais arquivos entraram, com nome e versão.
- **Conversa nova ou continuada, e memória**: uma conversa longa carrega pedidos e respostas anteriores. [Inferência] Se a ferramenta guarda memória entre conversas, essa memória também pode alterar a resposta e deve ser anotada como ligada ou desligada.

### 2.3 O registro mínimo para o teste ser comparável e repetível

Ferramenta; modelo e versão como aparecem na tela; data; instruções fixas (texto ou "nenhuma"); ferramentas ligadas; anexos; conversa nova ou continuada; o que fica igual na próxima volta.

[Conhecimento técnico geral, sem fonte primária conferida nesta execução] Mesmo com modelo e configuração idênticos, a resposta pode variar entre execuções. Por isso o registro do motor não substitui guardar a resposta intacta (Executar): ele permite comparar condições, e a resposta guardada é a evidência.

### 2.4 Ligações explícitas com os capítulos vizinhos

- **Hipótese**: trocar o modelo é uma mudança como trocar o pedido. Se modelo e pedido mudam na mesma volta, não se sabe qual dos dois alterou o resultado. O registro do Motor mostra o que ficou igual.
- **Executar**: o registro do Motor acompanha a resposta guardada.
- **Avaliar**: a conferência frase por frase vale para qualquer modelo. O registro do Motor não é evidência de fidelidade.
- **Encerrar**: o registro da configuração entra no que a próxima pessoa precisa saber para repetir ou continuar.

---

## 3. Analogia de F1 verificada

Método: cada página foi aberta por WebFetch e, para evitar paráfrase do resumidor, o HTML bruto foi baixado e os trechos abaixo foram localizados literalmente (conferência em 14/09/2026).

### Fontes primárias conferidas

| Id | Fonte | Data | Trecho literal que sustenta |
|---|---|---|---|
| F1 | Formula 1, "2026 REGULATIONS EXPLAINED: All you need to know about F1's new power units" (Matt Youson). https://www.formula1.com/en/latest/article/2026-regulations-explained-all-you-need-to-know-about-f1s-new-power-units.14jfv7a36905uDJDdNyfQd | 14/01/2026 | "The new unit retains the 1.6-litre turbocharged V6 engine (with a few tweaks) but deletes the MGU-H." / "The old units had around 20 per cent of their power supplied by the electrical system. The goal for 2026 is to increase this to around 50 per cent." / "The new MGU-K is nearly three times as powerful as its predecessor, delivering 350kW to the rear wheels, up from 120kW." / "All teams will use Advanced Sustainable Fuels this year" / "For the most part, this will be automated, handled by engine maps prepared in advance – but the drivers have the ability to override the automatics." / "From 2026, this will now be known as the Boost Button. When engaged, it will trigger a change in power unit power settings, either returning to maximum power or a profile configured by the team as per their personal choice." |
| F2 | FIA, "A New Era of Competition: FIA showcases future-focused Formula 1 regulations for 2026 and beyond". https://www.fia.com/news/new-era-competition-fia-showcases-future-focused-formula-1-regulations-2026-and-beyond | 06/06/2024 (metadado `article:published_time`) | "While the power derived from the ICE element drops from 550-560kw to 400kw, the battery element increases massively, from 120kw to 350kw" / "From 2026 Formula 1 power units will run on fully sustainable fuel" / "By simplifying the power unit through the removal of the MGU-H and the expansion of electrical power" |
| F3 | Formula 1, "The beginner's guide to F1 power unit penalties". https://www.formula1.com/en/latest/article/the-beginners-guide-to-formula-1-engine-and-gearbox-penalties.2TSy7BFgEvdNLojGLWS3F1 | publicado em 2023, modificado em 13/12/2024 (metadados); o texto já trata de 2026 e 2027 | "Over the course of the 2026 season, a driver may use no more than four ICEs and Turbochargers, three MGU-Ks, Energy Stores and Control Electronics, as well as four Exhaust sets. However, given the new regulations coming into play for 2026, one of each of these allocations is considered a" (a palavra seguinte, em inglês, equivale a "bônus") / "from 2027, the allocation will drop to three ICEs and Turbochargers, two MGU-Ks, Energy Stores and Control Electronics, and three Exhaust sets." / "The first time the allocation of any one of the elements is exceeded, a 10-place grid penalty will be applied, with the second time this occurs (and so on) resulting in a five-place grid drop" / "If a driver incurs a penalty exceeding 15 grid places, they will be required to start the race at the back of the field regardless." |
| F4 | Formula 1, "Wolff explains decision behind Monza engine penalty for Antonelli". https://www.formula1.com/en/latest/article/wolff-explains-decision-behind-monza-engine-penalty-for-antonelli.2kQ3tVnHJXRsloH0lmlh9I | 26/08/2026 | "Kimi Antonelli would be taking a grid penalty for the next round of the championship in Monza as a result of a planned engine change." / "Mercedes believe it is the right decision to take the penalty there, rather than at a later round of the season, to avoid further technical problems such as the one that forced him to retire in Barcelona." / "With Kimi, we're taking the full thing. Our calculations say that that's the best track to take it," |
| F5 | Formula 1, "2026 REGULATIONS EXPLAINED: All you need to know about F1's Advanced Sustainable Fuels". https://www.formula1.com/en/latest/article/2026-regulations-explained-all-you-need-to-know-about-f1s-advanced.4h53Szn4Z3VsD6rGcR3LtU | 30/01/2026 | Conferido só por WebFetch (não no HTML bruto): "an e-fuel made from cutting-edge sources like carbon capture (...), municipal waste and non-food biomass". A F1 repete a mesma ideia em F1, conferida literalmente: "The fuel is made from cutting-edge sources like carbon capture, municipal waste and non-f[ood]...". |

Fontes de IA e gestão pública:

| Id | Fonte | Data | Trecho literal |
|---|---|---|---|
| G1 | Governo Digital (SGD/MGI e Serpro, com Casa Civil, MCTI, Enap e Dataprev), "Guia IA Generativa". https://www.gov.br/governodigital/pt-br/infraestrutura-nacional-de-dados/inteligencia-artificial-1/publicacoes/guia-ia-generativa | [Não verificado] a página não exibe data no HTML | "A escolha da ferramenta deve ser guiada pela confidencialidade dos dados a serem tratados e pelo nível de controle e auditabilidade que o órgão público precisa exercer sobre o sistema." / "Não insira informações pessoais de servidores, cidadãos ou terceiros em aplicativos de IAG não aprovados." / "A responsabilidade do servidor sobre qualquer documento produzido, com ou sem IAG, permanece inalterada." / "Uso não aconselhável: Aceitar respostas de IA como verdadeiras sem verificá-las" / "a IAG deve ser uma ferramenta auxiliar, não substituta" |
| A1 | Anthropic, "Model deprecations". https://platform.claude.com/docs/en/about-claude/model-deprecations | página viva, conferida em 14/09/2026 | "As safer and more capable models launch, Anthropic regularly retires older ones." / "Retired: The model is no longer available for use. Requests to retired models will fail." / "consider thorough testing of your applications with the new models well before the retirement date." |

Ressalvas:
- A notícia do MGI de junho de 2026 sobre um guia para servidores retornou "Conteúdo Restrito" e não foi usada.
- F4 é notícia de agosto de 2026 sobre temporada em curso. O fato usado é só o anúncio e a justificativa. Não se afirma o resultado da corrida nem o número de posições perdidas, que o artigo não informa.
- O artigo F4 diz que Monza "should be a circuit that suits the Mercedes" por causa das retas. É avaliação do texto, não fato; não usar.

### Mapeamento motor de F1 e motor do loop (o que a fonte sustenta e onde a analogia para)

| Na F1 (fonte) | No loop com IA | Limite da analogia |
|---|---|---|
| A unidade de potência de 2026 mantém o V6 turbo de 1,6 litro, retira o MGU-H e busca cerca de 50% da potência vinda do sistema elétrico (F1, F2) | O modelo é a parte que gera a resposta; trocar de modelo muda o comportamento do conjunto | Na F1 a arquitetura é fixada por regulamento para todos; no órgão, a escolha varia por ferramenta autorizada |
| Recuperação de energia "automated, handled by engine maps prepared in advance", com possibilidade de o piloto sobrepor (F1) | Instruções fixas, busca e anexos são a configuração preparada antes de rodar; mudar no meio da volta precisa ser anotado | Os mapas da F1 são dados técnicos da equipe; a configuração da IA é visível na ferramenta e cabe ao servidor anotar |
| Boost aciona "a profile configured by the team" (F1) | A mesma ferramenta pode rodar com perfis diferentes; o registro diz qual perfil foi usado | Nenhum relevante |
| Limite de quatro motores a combustão por piloto em 2026, com punição de grid ao exceder (F3) | Cotas, custo e prazo limitam quantas voltas cabem; o limite de tentativas já aparece em Executar | O limite da F1 é regra esportiva com punição; o do órgão é orçamento e prazo |
| A Mercedes anunciou a troca planejada da unidade de Antonelli e justificou a escolha de Monza com cálculos da equipe (F4) | Quando o limite obriga uma troca, a decisão e o motivo ficam registrados e comunicados | A decisão da F1 é pública por regra e por imprensa; no órgão, o registro é interno |

Fatos úteis para a lição, em ordem de preferência:
1. **Mapas de motor preparados com antecedência e perfil do Boost configurado pela equipe** (F1). É o que mais se aproxima de "configuração registrada antes de rodar". Usado na lição principal.
2. **Limite de componentes e a decisão calculada da Mercedes em Monza** (F3, F4). Serve como lição alternativa ou aprofundamento sobre escolhas forçadas por limite e registradas com motivo.

---

## 4. Rascunho do capítulo

### 4.1 Objeto no formato de `content.js`

```js
  {id:'motor',name:'Motor',place:'03 / MOTOR',title:'REGISTRE O MODELO\nE A CONFIGURAÇÃO',
   lead:'Antes de rodar o pedido, anote a ferramenta, o modelo e a configuração que vão produzir a resposta.',
   body:'Use apenas ferramenta autorizada pelo órgão para os dados da tarefa. Escolha o modelo pelo que a tarefa exige: desempenho em tarefas parecidas, volume de texto que ele aceita de uma vez, tempo de resposta e custo. Anote o modelo e a versão como aparecem na ferramenta, a data, as instruções fixas, se a busca na internet estava ligada e quais anexos entraram. Trocar de modelo é uma mudança: não troque modelo e pedido na mesma volta. Um modelo mais capaz continua exigindo a conferência de cada frase na fonte.',
   action:'Registrar minha configuração',field:'setup',
   prompt:'Qual ferramenta autorizada vou usar, e ela pode receber estes dados? Qual modelo e qual versão aparecem na tela, e em que data? Quais instruções fixas, busca e anexos estão ligados? O que fica igual na próxima volta?',
   example:'Ferramenta: assistente de IA autorizado pelo órgão; o registro de 14 de maio não traz dados pessoais. Modelo: nome e versão anotados como aparecem no seletor da ferramenta, em 15 de maio de 2026. Instruções fixas: nenhuma. Busca na internet: desligada, porque o comunicado deve usar somente o registro; ligada, ela poderia trazer de outra fonte uma data de adoção que o registro não sustenta. Anexo: só o registro de 14 de maio. Conversa: nova. Na próxima volta, ferramenta, modelo e anexo ficam iguais; só o pedido pode mudar.',
   lesson:'Na unidade de potência da F1 de 2026, que mantém o V6 turbo de 1,6 litro, a recuperação de energia é, na maior parte, automática e segue mapas de motor preparados com antecedência; o piloto pode sobrepor a automação. O botão Boost aciona a potência máxima ou um perfil configurado pela equipe. Anote a configuração da sua ferramenta com o mesmo cuidado, para saber depois com que ajustes a resposta foi produzida.',
   source:'https://www.formula1.com/en/latest/article/2026-regulations-explained-all-you-need-to-know-about-f1s-new-power-units.14jfv7a36905uDJDdNyfQd',sourceName:'Formula 1 · A unidade de potência de 2026',
   question:'O processo tem CPF e endereço de interessados. No celular pessoal, você tem acesso a um modelo mais recente do que o da ferramenta autorizada pelo órgão. Como preparar o resumo para o despacho?',
   choices:['Usar o modelo do celular, que é mais capaz, e conferir cada folha depois.','Usar a ferramenta autorizada, anotar modelo, versão e data, e conferir o resumo nas folhas do processo.','Retirar nomes e CPF e usar o modelo do celular, já que sem dados pessoais o risco desaparece.'],
   correct:1,
   feedback:'O dado que entra e a autorização do órgão definem a ferramenta. A capacidade do modelo não dispensa conferir nas folhas.',
   feedbacks:['Conferir depois não desfaz o envio: os dados pessoais já terão saído para uma ferramenta que o órgão não aprovou. E a conferência seria necessária de qualquer forma.','A ferramenta autorizada recebe os dados dentro das regras do órgão, e o registro permite repetir ou comparar o teste. A conferência nas folhas continua sendo sua responsabilidade.','Retirar nomes e CPF reduz um risco, mas o processo continua tendo informação interna do órgão. A orientação federal é não inserir informação interna em aplicativo de IA que não seja solução aprovada.']},
```

Notas sobre o rascunho:
- A data "15 de maio de 2026" no `example` é a data de execução do comunicado, posterior ao teste de 14 de maio. Se a equipe preferir, trocar por "na data da execução", sem inventar dia.
- "o registro de 14 de maio não traz dados pessoais" é coerente com as quatro frases de `SOURCE` em `model.js`, que não citam pessoas.
- O terceiro item de `feedbacks` apoia-se no guia G1, que lista como uso não aconselhável "Compartilhar detalhes de contratos, projetos em andamento ou políticas internas" e recomenda priorizar soluções aprovadas pela TI do órgão. Os trechos sobre dados pessoais e escolha de ferramenta foram conferidos no HTML bruto; o trecho sobre soluções aprovadas foi conferido por WebFetch e parcialmente no HTML ("Ferramentas Internas/Locais (Aprovadas) Recomendação: Priorize as soluções inte[rnas]").

Lição alternativa (se a equipe preferir o fato do limite de componentes; usar `source` F4 e citar F3 no aprofundamento):

```js
   lesson:'Em 2026, cada piloto da F1 pode usar no máximo quatro motores a combustão na temporada; ao exceder o limite, perde posições no grid. Em agosto, a Mercedes anunciou a troca planejada da unidade de Kimi Antonelli em Monza, e Toto Wolff disse que os cálculos da equipe apontavam aquela pista como a melhor para cumprir a punição.',
   source:'https://www.formula1.com/en/latest/article/wolff-explains-decision-behind-monza-engine-penalty-for-antonelli.2kQ3tVnHJXRsloH0lmlh9I',sourceName:'Formula 1 · A decisão da Mercedes sobre o motor em Monza',
```

### 4.2 Campo novo do caderno (FIELDS)

Inserir depois de `hypothesis` e antes de `test`:

```js
 ['setup','Ferramenta, modelo e configuração','Ferramenta autorizada, modelo e versão como aparecem na tela, data, instruções fixas, busca ligada ou desligada, anexos e o que fica igual na próxima volta.'],
```

E ajustar a dica de `test` conforme a seção 1 (retirar "ferramenta").

### 4.3 Beats da cena cinematográfica

Restrições herdadas de `tools/POWER-UNIT.md`: o clip `running` é cinemático (pistões, bielas e virabrequim), dura 8 s e não simula combustão, válvulas, ignição nem fluxo de energia; turbo e MGU-K são estáticos. O GLB não representa motor homologado. A cena não deve sugerir o contrário, nem com partículas de energia percorrendo o cabo como se fosse dado real. [Não verificado] se o carro do laboratório já tem cavidade do motor compatível com o GLB (0,71 × 0,57 × 0,95 m); o Codex decide encaixe e escala.

Nenhum texto na tela além de título, lead, body e ação do capítulo.

1. **Chegada, viagem sem texto.** A câmera sai da pose final da Hipótese e desce em dolly lento até a traseira do carro parado no box, em plano baixo de três quartos. A carenagem do motor se solta em painéis e sobe devagar, como capô aberto na garagem. Luz lateral quente entra pela abertura e revela o interior escuro.
2. **Entrada até o motor, título aparece ao estabilizar.** A câmera passa por cima da entrada de ar atrás do cockpit e desce para dentro do compartimento até enquadrar o V6 em plano médio. Profundidade de campo curta: bloco nítido, chassi desfocado. Quando a câmera para, entram título e lead.
3. **Motor em funcionamento, durante o body.** O clip `running` gira em câmera lenta. A câmera orbita alguns graus para mostrar pistões e bielas pelo lado aberto. Uma luz de recorte passa pelo turbo e depois pelo MGU-K e seu cabo, as duas peças que marcam a parte de combustão e a parte elétrica, sem movimento falso nessas peças.
4. **Ação "Registrar minha configuração": o conjunto abre e para em ordem.** O virabrequim desacelera até parar. Os grupos `assembly_intake`, `assembly_head_left/right`, `assembly_exhaust_left/right`, `assembly_turbo` e `assembly_electric` se afastam um de cada vez e param alinhados, com espaçamento regular, como peças postas numa bancada para inventário. A imagem traduz "anotar cada parte antes de rodar" sem rótulo na tela. Com `prefers-reduced-motion`, mostrar direto o estado aberto, parado.
5. **Saída, viagem sem texto.** As peças voltam ao lugar na ordem inversa, o ciclo volta a girar, a carenagem desce e fecha. A câmera recua pela traseira e acompanha o carro deixando o box em direção ao túnel, que é a abertura de Executar.

### 4.4 Etapa de prática para `src/learning/*`

Posição: nova etapa de índice 2 ("Motor"), entre Hipótese (1) e Executar, que passa a 3. `STAGES` vira `['Preparar', 'Hipótese', 'Motor', 'Executar', 'Avaliar', 'Corrigir', 'Encerrar']`.

Texto da etapa: "Antes de rodar o pedido, escolha o registro de configuração que permite repetir o teste e compará-lo com a próxima volta."

Opções (valor, texto exibido, retorno):

| Valor | Texto da opção | Resultado | Retorno |
|---|---|---|---|
| `completo` | "Assistente autorizado pelo órgão. Modelo e versão anotados como aparecem no seletor, com a data. Sem instruções fixas. Busca na internet desligada. Anexo: somente o registro de 14 de maio. Conversa nova. Na próxima volta, só o pedido muda." | passa | "Configuração registrada: ferramenta autorizada, modelo, versão, data, busca desligada e só o registro anexado. A próxima volta pode mudar o pedido e manter o resto, e a diferença no resultado poderá ser atribuída ao pedido. O registro não confere a resposta: isso continua em Avaliar." |
| `mais-capaz` | "Assistente autorizado pelo órgão, no modelo mais capaz disponível, com modelo e versão anotados. Busca na internet ligada para completar o que faltar no registro. Pedido revisado na mesma volta." | não passa | "Duas falhas. Com a busca ligada, a resposta pode trazer de outra fonte uma data de adoção que o registro não sustenta. E trocar modelo e pedido na mesma volta impede saber qual dos dois mudou o resultado. Desligue a busca e mude uma coisa por vez." |
| `padrao` | "Assistente autorizado pelo órgão. Busca desligada. Anexo: somente o registro de 14 de maio. Modelo: o padrão da ferramenta." | não passa | "Quase completo, mas sem modelo, versão e data. O padrão da ferramenta pode passar a ser outro modelo, e fornecedores aposentam versões antigas. Sem esse registro, uma diferença na próxima volta não pode ser atribuída ao pedido. Anote o que aparece no seletor e a data." |

Envio vazio: "Escolha um registro de configuração antes de continuar."

Confirmação adicional (checkbox, como `responsibility` em Encerrar): "Confirmo que a ferramenta é autorizada pelo órgão para os dados deste registro." Sem ela: "Confirme que a ferramenta pode receber os dados da tarefa."

Contrato sugerido (descrição para o Codex, sem código):
- `createLearningState()` ganha `setup: null`.
- Validação: `action.setupChoice === 'completo' && action.authorized === true`.
- Ao passar, gravar em `state.setup` um objeto simulado e declarado como tal, por exemplo `{ tool: 'assistente autorizado pelo órgão', model: 'conforme seletor da ferramenta', date: '2026-05-15', fixedInstructions: 'nenhuma', webSearch: false, attachments: ['registro de 14 de maio de 2026'], conversation: 'nova', unchangedNextRound: ['ferramenta', 'modelo', 'anexo'], kind: 'prewritten-simulation' }`. Não inventar nome real de modelo.
- `state.execution` (Executar) pode referenciar `state.setup`, para o histórico mostrar pedido, fonte e configuração juntos.
- Mensagem de histórico ao passar: a primeira frase do retorno de `completo`.
- Renumerar índices fixos: etapas 2 a 5 atuais passam a 3 a 6; o fim do percurso passa de `index === 6` a `index === 7`; em `index.js`, `pending === 6` passa a `pending === 7`, e o texto "Percurso registrado: fonte, candidata, achados, correção e decisão." passa a incluir a configuração.
- Testes a acrescentar: opção vazia; `mais-capaz` e `padrao` bloqueiam com o retorno próprio; `completo` sem confirmação bloqueia; `completo` com confirmação grava `state.setup` com `kind: 'prewritten-simulation'`; Executar não fica disponível antes do Motor; fluxo completo com sete etapas.
- README do módulo: acrescentar a etapa ao "Contrato pedagógico" e remover a menção a seis etapas.

---

## 5. Autocrítica contra a regra do Igor

Releitura feita sobre título, lead, body, action, prompt, example, lesson, quiz, feedbacks, texto da prática e retornos. Correções aplicadas antes da entrega:

- Lição: a primeira versão terminava com duas frases espelhadas ("quem analisa uma volta precisa saber...; quem analisa uma resposta precisa saber..."). Era frase de efeito em par e afirmava algo que a fonte não diz. Substituída por instrução direta.
- Lição: "antes da corrida" trocado por "com antecedência", que é o que a fonte diz ("prepared in advance").
- Título: descartadas as opções com "o que move", por soar como slogan, e com "essência", termo vetado. Ficou uma instrução no mesmo padrão dos outros títulos.
- Feedback do quiz: a versão "quem define a ferramenta é o dado" tinha tom de máxima; reescrita como frase declarativa simples.
- Feedback 2 do quiz: tinha três orações em série; dividido em duas frases.
- Busca por termos vetados no texto visível: nenhuma ocorrência de "no coração de", "a essência de", "desbloquear", "potencializar", "jornada", "caso fictício", "modelo didático", "nesta aula", "na cena", nem tríade com "·" (o "·" aparece apenas em `sourceName`, no mesmo padrão dos capítulos existentes).
- Números de F1 usados no texto visível: só V6 turbo de 1,6 litro (lição principal) e o limite de quatro motores a combustão (lição alternativa), ambos com trecho literal conferido. Nenhum número de modelo de IA no texto visível.

Pendências reais:
- Data de publicação do guia G1 não localizada no HTML.
- F5 conferido apenas por WebFetch; não é usado no texto visível.
- A frase sobre variação de respostas entre execuções está marcada como conhecimento geral sem fonte conferida e não entrou no texto visível.
- Na tabela F3, a citação literal foi interrompida antes da palavra inglesa equivalente a "bônus", porque o verificador de acentuação do ambiente bloqueia o termo em inglês; o sentido está indicado entre parênteses.
