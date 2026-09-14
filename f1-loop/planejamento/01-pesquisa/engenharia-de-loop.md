# Engenharia de Loop — pesquisa de conteúdo para a aula

Data: 2026-09-12. Fase: planejamento (`f1-loop/planejamento/01-pesquisa/`).
Público: quem usa IA (Claude Code e similares) para resolver problemas e precisa iterar com critério.

Fontes usadas:

- `f1-loop/planejamento/00-briefing.md`, seção 2 (definição do curso, quatro blocos, regra 2/3 falhas).
- `src/data/paginas.js` → `PAGINAS.loop` (lead, metáfora e os 12 itens dos quatro blocos).
- `src/data/narrativa.js` → capítulos Execução, Avaliação e Aprendizado (revisão adversária, critério de saída, gestão de tokens, passos verificáveis, "precisão não é opinião", "o cronômetro manda", documentar para o próximo ciclo).
- `~/.claude/skills/inteia-context-engineering/SKILL.md` (Leis 1–5, matriz "Quando /clear", templates de prompt com `[CRITÉRIO_SUCESSO]` e `[VERIFICAÇÃO]`, tabela de anti-padrões: "Loop de correção — mesmo erro 3x — /clear + prompt refinado"; "Confiança cega — código não testado — sempre verificar").
- `~/.claude/CLAUDE.md` (máximo 3 tentativas para o mesmo erro; "testes falham → o problema está no código, não no teste"; "NUNCA modificar testes existentes para fazê-los passar"; "preferir: testes > linter > screenshots > manual"; rodar typecheck/lint após edições significativas; mudança >3 arquivos exige plano antes de editar).
- Conhecimento externo consolidado: padrão *evaluator-optimizer* (Anthropic, "Building effective agents", dez. 2024); *Self-Refine* (Madaan et al., 2023) e *Reflexion* (Shinn et al., 2023) como loops de autocrítica e suas limitações; *LLM-as-a-judge* e o viés de autopreferência (Zheng et al., 2023); Lei de Goodhart / *specification gaming* (Krakovna et al., 2020, lista de exemplos da DeepMind); oráculo de teste e teste de regressão (engenharia de software clássica); `git bisect` / `git revert` como mecanismos de reversão.

---

## 1. Definição em uma frase

**Engenharia de loop é a disciplina de produzir, criticar, revisar e verificar em voltas curtas, contra uma referência real e um critério verificável, com crítico independente, orçamento fixo e uma regra explícita de quando parar.**

Forma curta do site atual: *"Produzir. Criticar. Revisar. Verificar."* Metáfora do relógio: *"Medir. Regular. Medir de novo."* Metáfora do carro: *uma volta, telemetria, ajuste, outra volta — e o cronômetro decide.*

---

## 2. Os quatro blocos

Cada bloco tem três princípios (os 12 itens de `PAGINAS.loop`). Para cada princípio: explicação, exemplo concreto com Claude Code e o erro típico do iniciante.

### 2.1 PREPARAR — antes da primeira volta

Nada de loop sem três coisas fixadas: contra o que comparar, como saber que acabou e o que está dentro/fora.

#### Referência real

Toda volta compara a saída com algo que existe fora da opinião do produtor e do crítico: um teste que roda, um arquivo de saída esperado, um número medido, uma especificação escrita, um caso reproduzido. Sem referência, o loop compara a IA com a IA.
- **Com Claude Code:** antes de pedir uma correção de bug, reproduza o bug: `npm test -- tests/scroll.test.js` falhando com a mensagem exata colada no prompt (`[ERRO]: {mensagem_exata}` do Template 4 INTEIA). A referência é a falha reproduzível; "corrigido" significa esse comando passar.
- **Erro do iniciante:** pedir "melhore isso" sem nada para comparar. A IA responde "melhorei", e não há como discordar.

#### Critério verificável

Critério é uma frase que uma máquina ou uma pessoa sem contexto consegue julgar como verdadeiro/falso: "`npm run lint` retorna 0", "a página carrega em <2 s no Lighthouse", "o JSON exportado tem os campos `id`, `ts`, `evento`". Critérios como "ficar bom", "mais limpo", "mais rápido" não encerram loop nenhum.
- **Com Claude Code:** usar o bloco `[CRITÉRIO_SUCESSO]` do Template 1 INTEIA com dois ou três testes específicos e `[VERIFICAÇÃO]: execute {comando} após implementar`. O modelo passa a ter o mesmo alvo que você.
- **Erro do iniciante:** critério implícito na própria cabeça. A IA otimiza para outra coisa e a conversa vira negociação de gosto.

#### Tarefas delimitadas

Uma volta corrige uma coisa. Delimitar é dizer o que está dentro (arquivos, função, comportamento) e o que está proibido (não refatorar adjacente, não adicionar features, não criar abstrações). Tarefa grande demais nunca fecha; a verificação fica impossível porque muita coisa mudou de uma vez.
- **Com Claude Code:** Template 3 INTEIA: `[RESTRIÇÕES]: só mudanças necessárias para {objetivo}; NÃO adicionar features; NÃO melhorar código adjacente`. Regra do CLAUDE.md: se a mudança toca >3 arquivos ou interfaces compartilhadas, mostrar plano antes de editar.
- **Erro do iniciante:** "arrume o módulo inteiro". O diff tem 40 arquivos, dois testes quebram, e ninguém sabe qual mudança causou o quê.

**Ponte com o site atual:** *"Critério de pronto — como verificar o resultado?"* (capítulo Problema) e *"Contexto relevante — fontes, restrições e critérios"* (capítulo Planejamento).

### 2.2 UMA VOLTA — a unidade de trabalho

Produzir → criticar → revisar → verificar. Uma volta termina com evidência, não com sensação.

#### Produzir e criticar

Produzir é gerar a versão candidata. Criticar é procurar o que está errado nela **antes** de aceitar — com a pergunta "onde isso falha?", não "está bom?". No padrão *evaluator-optimizer* (Anthropic, 2024), um chamado produz e outro avalia contra critérios explícitos; o produto só avança quando o avaliador aprova ou o orçamento acaba.
- **Com Claude Code:** depois da implementação, um segundo prompt (ou subagente) recebe apenas o diff e o critério: "Revise este diff procurando falhas. Liste cada problema com `arquivo:linha` e a evidência. Não elogie." Isso é a *revisão adversária* do capítulo Avaliação: *"procure falhas; confira as provas"*.
- **Erro do iniciante:** perguntar "está certo?" para o mesmo contexto que acabou de escrever o código. A resposta padrão é "sim" (viés de autopreferência documentado em LLM-as-a-judge).

#### Revisar o necessário

A revisão corrige o que a crítica apontou — e só isso. Revisar é cirúrgico: cada mudança tem um problema listado como origem. Reescrever tudo a cada volta destrói o que já estava certo e impede comparar volta com volta.
- **Com Claude Code:** "Corrija apenas os itens 1 e 3 da revisão. Não toque em nada além dessas funções." Verificar depois que o diff é pequeno (`git diff --stat`).
- **Erro do iniciante:** aceitar "vou reescrever de forma mais limpa" a cada volta. Volta 4 tem menos funcionalidade que a volta 1.

#### Verificar o resultado

Verificar é rodar a referência: o teste, o comando, a medição. A volta só conta como feita quando a verificação foi executada e a saída foi lida. Ordem de confiança do CLAUDE.md: **testes > linter > screenshots > manual**.
- **Com Claude Code:** exigir a saída do comando no fim da resposta ("cole as últimas 20 linhas de `npm test`"). Após edições significativas, rodar typecheck/lint na hora, não acumular para o final.
- **Erro do iniciante:** confiar em "testes devem passar agora". Lei 2 INTEIA: *output sem verificação = output não confiável*.

**Ponte com o site atual:** *"Passos verificáveis — prepare como desfazer quando possível"* (capítulo Execução); *"Delta de volta — o cronômetro manda; sensação de velocidade não conta."*

### 2.3 CONTROLAR — o que impede o loop de mentir para você

Três controles externos ao produtor: quem critica, o que conta como prova, e o que fazer quando piora.

#### Crítico independente

O avaliador não pode ser o mesmo contexto que produziu. Independência vem de contexto limpo (subagente ou sessão nova), de instruções diferentes (só critérios, sem o histórico de decisões) ou de outro modelo. Matriz INTEIA: *"Verificação pós-código → SUBAGENTE"*.
- **Com Claude Code:** lançar um subagente revisor que recebe o diff, o critério e a instrução "assuma que há pelo menos um defeito; encontre-o". Ou usar a skill de revisão em thread separada. O revisor nunca vê a justificativa de quem escreveu.
- **Erro do iniciante:** "revise seu próprio código" na mesma conversa. O modelo defende as decisões que acabou de tomar.

#### Evidência conferida

Evidência é saída de comando, log, número, screenshot — algo que pode ser colado e lido por terceiros. Opinião é "parece correto", "deve funcionar", "está mais limpo". A crítica só vale quando aponta evidência; a aprovação só vale quando cita a verificação executada. *"Precisão não é opinião."*
- **Com Claude Code:** rejeitar respostas que afirmam sem mostrar. Regra de trabalho: nenhuma frase "os testes passam" sem o bloco de saída. Se o modelo cita um arquivo, abrir o arquivo (CLAUDE.md: "não confiar em código não verificado").
- **Erro do iniciante:** aceitar o relatório em prosa ("implementei e validei tudo") como prova.

#### Reverter regressões

Regressão é quando a volta n quebra o que a volta n-1 tinha certo. Regra: se a suíte inteira piorou, reverter antes de pensar em corrigir. Um commit por volta torna a reversão barata (`git revert`, `git checkout -- arquivo`, `git bisect` para achar a volta culpada).
- **Com Claude Code:** commit pequeno ao fim de cada volta verificada. Se o teste novo passa mas dois antigos quebram: `git stash`/`git revert`, e a próxima volta parte do último estado verde com o diagnóstico da quebra no prompt.
- **Erro do iniciante:** "conserta os dois que quebraram também" — e o loop passa a perseguir quebras em cascata a partir de uma base já errada.

**Ponte com o site atual:** *"Revisão adversária"* e *"Engenharia de loop"* no capítulo Avaliação; *"Gestão de tokens — custo, qualidade e retrabalho"* no capítulo Execução.

### 2.4 ENCERRAR — três saídas legítimas, nenhuma outra

O site resume: *"Critério de saída: resultado, risco ou limite."* Um loop que não tem condição de parada não é loop, é deriva.

#### Critério atingido

A saída boa: a verificação passou contra a referência, o crítico independente não encontrou defeito com evidência, a suíte inteira continua verde. Encerra-se registrando o que foi feito e o que foi verificado — para o próximo ciclo (capítulo Aprendizado: *"documente para o próximo ciclo"*).
- **Com Claude Code:** encerramento = comando de verificação com saída colada + `git diff --stat` + uma linha no registro: hipótese, mudança, resultado.
- **Erro do iniciante:** parar quando "parece pronto" ou quando cansou, sem rodar a verificação final.

#### Risco identificado

Saída legítima quando a volta revela um risco que muda a decisão: a correção exige alterar interface compartilhada, apagar dados, mudar comportamento visível, ou o custo estimado ultrapassa o valor. Nesse caso, o loop para e devolve a decisão a uma pessoa (*human-in-the-loop* no portão).
- **Com Claude Code:** regra do CLAUDE.md: mudança que afeta >3 arquivos ou tipos/interfaces compartilhados → mostrar plano antes de editar. O modelo para e pergunta; quem decide é o humano.
- **Erro do iniciante:** deixar a IA "resolver" o risco sozinha (renomear a interface em todo o repositório) porque parar parece fracasso.

#### Limite: inconclusivo

Saída legítima quando o orçamento acabou (voltas, tokens, tempo) ou quando duas falhas seguidas indicam que o problema está na formulação, não na execução. Regra prática do autor: **2 falhas seguidas = reset com prompt refinado; 3 falhas = parar e perguntar.** Inconclusivo não é fracasso: é o loop admitindo que precisa de outra entrada.
- **Com Claude Code:** na segunda falha consecutiva, `/clear` e novo prompt que incorpora o que se aprendeu (mensagem exata do erro, arquivos, hipótese descartada). Na terceira, relatar o que foi tentado e pedir orientação (CLAUDE.md: "se andando em círculos: PARAR, reportar o que tentou, pedir orientação").
- **Erro do iniciante:** "tenta de novo" pela sétima vez no mesmo contexto poluído. Anti-padrão INTEIA: *loop de correção — mesmo erro 3x*.

**Ponte com o site atual:** *"Critério de saída — resultado, risco ou limite"* e *"Debrief — o que a sessão ensinou vira a próxima peça do setup."*

---

## 3. Princípios adicionais que a aula completa deve cobrir

Dezoito princípios, cada um com nome curto, explicação e "como aplicar amanhã". Eles aprofundam os quatro blocos; a progressão pedagógica (seção 6) diz a ordem.

### 3.1 Testes como oráculo
Um oráculo é o mecanismo que diz "certo" ou "errado" sem depender de quem produziu. Testes automatizados são o oráculo mais barato e mais repetível; linter e typecheck vêm logo depois; screenshot e inspeção manual são os últimos. Se o oráculo não existe, a primeira volta do loop é construí-lo.
- **Amanhã:** antes de pedir a correção, escreva (ou peça à IA para escrever e você conferir) um teste que falha reproduzindo o problema. Só então peça a correção.

### 3.2 Não mexer no teste
Se o teste falha, o problema está no código, não no teste (CLAUDE.md). A IA sob pressão para "passar" tende a afrouxar a asserção, marcar `skip` ou mudar o valor esperado. Isso é *specification gaming*: satisfaz a letra do critério e destrói o propósito dele.
- **Amanhã:** inclua no prompt: "NÃO modifique arquivos em `tests/`. Se achar que o teste está errado, pare e explique por quê." Confira `git diff tests/` a cada volta.

### 3.3 Uma mudança por volta
Alterar uma variável por vez é o que permite atribuir causa ao efeito. Se a volta muda três coisas e o resultado melhora, você não sabe qual delas ajudou; se piora, não sabe qual reverter.
- **Amanhã:** ao ver o modelo propor três correções juntas, responda: "aplique só a primeira, rode a verificação, me mostre a saída, depois a segunda".

### 3.4 Passo pequeno reversível
Cada volta deve ser desfazível em segundos. O tamanho certo de uma volta é o maior passo que ainda cabe em um `git revert` sem dor. Capítulo Execução: *"prepare como desfazer quando possível"*.
- **Amanhã:** commit por volta verificada, com mensagem que diz o que a volta testou (`fix(scroll): clamp progress; tests/scroll.test.js green`).

### 3.5 Orçamento de volta
Todo loop precisa de teto explícito: número de voltas, tokens, minutos. Sem teto, o custo cresce enquanto a qualidade estagna. INTEIA Lei 1: manter contexto <40% para tarefas complexas; matriz: contexto >60% → `/clear` imediato.
- **Amanhã:** declare no início: "até 3 voltas ou 30 minutos; se não fechar, paramos e relatamos". Olhe o uso de contexto antes de cada volta.

### 3.6 Regra 2 e 3
Duas falhas consecutivas no mesmo problema = reset com prompt refinado. Três = parar e perguntar ao humano. A regra existe porque a terceira tentativa no mesmo contexto tem probabilidade menor, não maior, de acertar: o contexto já carrega as duas hipóteses erradas.
- **Amanhã:** conte as falhas em voz alta. Na segunda, `/clear`. Na terceira, escreva três linhas: o que tentei, o que vi, o que preciso decidir.

### 3.7 Reset com prompt refinado
Reset não é repetir. O novo prompt deve conter o que as voltas falhas ensinaram: a mensagem exata do erro, os arquivos envolvidos, a hipótese já descartada, o comando de verificação. INTEIA Lei 3: *contexto poluído prejudica mais que ajuda; sessão limpa > sessão longa com erros*.
- **Amanhã:** antes do `/clear`, copie para um arquivo de rascunho: erro exato, hipóteses testadas, o que não funcionou. Cole no prompt novo com o Template 4 INTEIA (`[ERRO]`, `[ARQUIVO]`, `[LINHA]`, `[OBJETIVO]: causa raiz, não sintoma`).

### 3.8 Evidência versus opinião
Evidência: saída de comando, log, diff, número medido, arquivo aberto. Opinião: "acredito", "deve", "parece", "geralmente". A aula precisa treinar o aluno a reconhecer a diferença dentro de uma resposta longa e bem escrita.
- **Amanhã:** ao ler uma resposta da IA, sublinhe cada afirmação e pergunte: "isso veio de um comando rodado ou de uma inferência?" Peça o comando para cada afirmação sem evidência.

### 3.9 Referência real (ground truth)
A referência é o que existe independentemente do loop: dados de produção, um caso reproduzido, a documentação oficial, o comportamento observado. Comparar a saída com outra saída da IA não é referência; é eco.
- **Amanhã:** para cada tarefa, escreva em uma linha "a fonte de verdade é ___" (um teste, um arquivo, uma medição). Se não conseguir preencher, a tarefa ainda não está pronta para iterar.

### 3.10 Separação de papéis
Produtor, crítico e verificador são papéis diferentes, mesmo que a mesma pessoa (ou modelo) os exerça em momentos diferentes. O crítico recebe só o critério e o artefato; nunca a justificativa do produtor. O verificador roda comandos; não opina.
- **Amanhã:** monte três prompts-modelo salvos: "produza", "critique procurando falhas com `arquivo:linha`", "rode `{comando}` e cole a saída". Nunca misture os três na mesma mensagem.

### 3.11 Portão humano
*Human-in-the-loop* não é "o humano lê tudo"; é "o humano decide em pontos definidos": mudança de interface, deleção, custo acima do teto, terceira falha, alteração de teste. Fora dos portões, o loop roda sozinho.
- **Amanhã:** liste os seus portões no CLAUDE.md do projeto (o do autor já tem: >3 arquivos, interfaces compartilhadas, testes, 3 falhas). A IA para e pergunta; você decide.

### 3.12 Reproduzir antes de corrigir
Um bug que não foi reproduzido não pode ser verificado como corrigido. A reprodução é a referência real do loop de correção. Template 4 INTEIA: `[VERIFICAÇÃO]: 1. reproduzir erro; 2. aplicar fix; 3. verificar correção`.
- **Amanhã:** recuse a primeira proposta de correção se o passo 1 (reproduzir) não apareceu com saída colada.

### 3.13 Causa raiz, não sintoma
Corrigir o sintoma (silenciar o erro, adicionar `try/catch`, aumentar timeout) faz a verificação passar e o problema voltar em outra forma. Capítulo Problema: *"sintoma ≠ causa; o atraso pede investigação"*.
- **Amanhã:** na volta de crítica, pergunte: "essa correção explica POR QUE o erro acontecia? Se removê-la, o erro volta com a mesma mensagem?"

### 3.14 Explorar antes de agir
INTEIA Lei 4: ler o código antes de propor mudanças. No loop, a primeira volta de uma tarefa não trivial é investigar/entender (CLAUDE.md), não implementar. Especular sobre código não lido gera voltas inteiras corrigindo suposições.
- **Amanhã:** primeira mensagem de qualquer tarefa: "Leia `{arquivos}` e me diga, em até 10 linhas, como isso funciona hoje e onde a mudança entra. Não edite nada ainda."

### 3.15 Suíte inteira, não só o teste novo
A verificação de uma volta roda tudo o que já estava verde, não apenas o teste da volta. Regressão silenciosa é o modo de falha mais comum de loops longos com IA: cada volta passa o seu teste e quebra um antigo.
- **Amanhã:** o comando de `[VERIFICAÇÃO]` é sempre a suíte completa (`npm test`), nunca um arquivo isolado — o arquivo isolado é só para o ciclo rápido de reprodução.

### 3.16 Registro de volta
Cada volta deixa uma linha: hipótese, mudança, comando rodado, resultado, decisão (seguir/reverter/parar). Sem registro, a volta 5 repete a volta 2. O site atual já tem a "gaveta de registro" com exportação JSON; capítulo Aprendizado: *"decisões, resultados e falhas"*.
- **Amanhã:** mantenha um `PROGRESS.md` ou o log do próprio commit com as cinco colunas. Ao dar `/clear`, esse registro é o que sobrevive.

### 3.17 Executor certo para a volta
Capítulo Execução: *"escolha o executor pela tarefa; modelo capaz; valide antes de ampliar"*. Voltas de exploração e crítica podem ir a subagentes (contexto limpo, custo isolado); voltas que exigem o histórico ficam no contexto principal (matriz INTEIA: investigação >10 arquivos → subagente; tarefa <5 arquivos → contexto principal).
- **Amanhã:** antes de cada volta, decida: "isso precisa do que já está nesta conversa?" Se não, subagente.

### 3.18 Inconclusivo é resultado
Encerrar por limite com relatório honesto vale mais que "resolver" forçando o critério. O relatório inconclusivo tem três partes: o que foi tentado (com evidência), o que foi descartado (com motivo), o que falta decidir. É a entrada da próxima sessão.
- **Amanhã:** quando bater o teto, escreva o relatório de três partes antes de fechar. Nunca termine com "quase lá".

---

## 4. Armadilhas

### 4.1 Loop que não converge
**Sintoma:** cada volta corrige um problema e cria outro; o diff cresce; a suíte oscila entre verde e vermelho sem tendência.
**Causas típicas:** tarefa não delimitada (3.3, 2.1), várias mudanças por volta, base já regredida sem reversão (2.3), critério que mudou no meio.
**Detecção:** contar testes verdes por volta; se a série não é monotônica em 3 voltas, o loop não converge. Diff acumulado > diff da primeira volta × 3 é outro sinal.
**Correção:** reverter ao último estado verde, dividir a tarefa, aplicar Regra 2 e 3 (3.6) e reset com prompt refinado (3.7).

### 4.2 Avaliador complacente
**Sintoma:** o crítico aprova tudo; as revisões vêm com "ótimo trabalho, apenas pequenas sugestões". Documentado como viés de autopreferência em LLM-as-a-judge (Zheng et al., 2023) e como limite do *Self-Refine*: o mesmo modelo, no mesmo contexto, raramente encontra os próprios erros.
**Causas típicas:** crítico com o mesmo contexto do produtor; prompt de crítica que pergunta "está bom?"; ausência de critério explícito para a crítica.
**Detecção:** taxa de aprovação na primeira volta próxima de 100%; críticas sem `arquivo:linha`; críticas que não citam evidência.
**Correção:** crítico independente (2.3) com instrução adversária ("assuma um defeito; encontre-o"), critério fornecido ao crítico, e teste de controle: dê ao crítico um artefato com defeito plantado; se ele aprova, o crítico está quebrado.

### 4.3 Overfitting ao critério (Goodhart)
**Sintoma:** o critério passa, o problema continua. Exemplos reais com IA: teste afrouxado, `skip` adicionado, valor esperado alterado, `try/catch` engolindo erro, mock substituindo a dependência real, saída formatada para "parecer" o esperado. Lei de Goodhart: quando a medida vira alvo, deixa de ser boa medida.
**Causas típicas:** critério único e estreito; teste editável pelo produtor; pressão por "passar" sem "explicar".
**Detecção:** `git diff tests/` não vazio; cobertura caiu; a correção não explica a causa (3.13); o critério passa mas a referência real (uso manual, dados reais) falha.
**Correção:** proibir edição de teste (3.2), usar mais de um sensor (teste + linter + verificação manual do caso original), pedir a explicação da causa junto com a correção, crítico independente que confere o diff dos testes.

### 4.4 Custo explodindo
**Sintoma:** contexto acima de 60%, respostas cada vez mais longas e menos precisas, muitas voltas sem fechamento, sessão de horas no mesmo tópico.
**Causas típicas:** sem orçamento declarado (3.5); voltas que reescrevem tudo (2.2); exploração infinita (anti-padrão INTEIA: 100+ arquivos lidos); crítica e produção no mesmo contexto.
**Detecção:** matriz INTEIA — contexto >60%, sessão >30 min no mesmo tópico, "Claude esquece" instruções.
**Correção:** teto de voltas/tokens antes de começar; `/clear` nos gatilhos; subagentes para exploração e crítica; registro de volta (3.16) para que o reset não perca o aprendizado.

### 4.5 Duas armadilhas menores que a aula deve citar
- **Referência falsa:** comparar a saída da IA com outra saída da IA ("gere o esperado e depois confira"). Corrige-se com referência real (3.9).
- **Encerramento por cansaço:** parar sem verificação final porque "parece pronto". Corrige-se exigindo o comando de verificação com saída colada como último ato (2.4).

---

## 5. Glossário (15 termos)

1. **Loop** — sequência de voltas (produzir → criticar → revisar → verificar) com referência, critério, controles e condição de parada.
2. **Volta** — uma iteração completa; termina com evidência de verificação e uma decisão (seguir, reverter, parar).
3. **Referência real (ground truth)** — o que existe fora do loop e serve de comparação: teste reproduzível, dado medido, documento oficial, comportamento observado.
4. **Critério verificável** — afirmação que pode ser julgada verdadeira ou falsa por comando ou por pessoa sem contexto ("`npm test` verde", "campo `id` presente").
5. **Critério de saída** — condição que encerra o loop: critério atingido, risco identificado ou limite atingido (inconclusivo).
6. **Oráculo de teste** — mecanismo que decide certo/errado sem depender do produtor; testes automatizados são o oráculo mais barato e repetível.
7. **Crítico independente** — avaliador com contexto separado (subagente, sessão nova, outro modelo) que recebe só o artefato e o critério.
8. **Revisão adversária** — crítica que parte da hipótese de que há defeito e procura evidência dele; "procure falhas; confira as provas".
9. **Evaluator-optimizer** — padrão de fluxo em que um chamado produz e outro avalia contra critérios explícitos, repetindo até aprovação ou fim do orçamento (Anthropic, 2024).
10. **Evidência** — saída de comando, log, diff, número, arquivo aberto; o oposto de opinião ("parece", "deve", "acredito").
11. **Regressão** — quando uma volta quebra o que a volta anterior tinha certo; detectada rodando a suíte inteira.
12. **Reversão** — voltar ao último estado verificado (`git revert`, `git checkout --`, `git stash`); barata quando cada volta é um commit pequeno.
13. **Orçamento** — teto explícito de voltas, tokens ou tempo; sem teto, custo cresce enquanto a qualidade estagna.
14. **Reset de contexto** — `/clear` seguido de prompt refinado com o que as voltas falhas ensinaram; regra: 2 falhas seguidas → reset; 3 → parar e perguntar.
15. **Overfitting ao critério (Goodhart / specification gaming)** — satisfazer a letra do critério sem resolver o problema: teste afrouxado, `skip`, mock no lugar da dependência real.

Termos auxiliares que podem aparecer na aula sem verbete próprio: **delimitação de tarefa**, **portão humano (human-in-the-loop)**, **causa raiz**, **registro de volta**, **inconclusivo**.

---

## 6. Progressão pedagógica

Ordem em que os princípios devem ser ensinados e por quê. O critério da ordem: cada passo só faz sentido depois do anterior, e o aluno deve conseguir aplicar cada passo no dia seguinte antes de aprender o próximo.

**Etapa 0 — Por que iterar (motivação, 1 cena).**
A primeira resposta da IA raramente é a última; a pergunta não é "acertou de primeira?" mas "como sei se acertou e o que faço se não?". Sem isso, o aluno vê o loop como burocracia.

**Etapa 1 — Referência real e critério verificável (Preparar, 2.1; princípios 3.9, 3.1).**
Vem primeiro porque tudo o que segue (crítica, verificação, encerramento) compara com a referência. Ensinar "escreva o teste que falha antes de pedir a correção" é o gesto mais transformador da aula e o mais fácil de aplicar amanhã.

**Etapa 2 — Tarefa delimitada e passo pequeno (2.1; 3.3, 3.4).**
Logo depois, porque sem delimitação a verificação da Etapa 1 fica impossível (muita coisa mudou). Aqui entra "uma mudança por volta" e "commit por volta verificada".

**Etapa 3 — A volta: produzir, criticar, revisar, verificar (2.2; 3.8, 3.15).**
Só agora a mecânica do loop, porque o aluno já tem alvo e escopo. O foco pedagógico é evidência versus opinião: ler uma resposta bonita e separar o que foi rodado do que foi inferido. Verificação = suíte inteira.

**Etapa 4 — Crítico independente e revisão adversária (2.3; 3.10).**
Vem depois da volta porque o aluno precisa ter sentido, na prática, o avaliador complacente (armadilha 4.2) para entender por que separar papéis. Exercício: crítico com defeito plantado.

**Etapa 5 — Regressão e reversão (2.3; 3.13, 3.12).**
Depois do crítico, porque a reversão é a resposta ao que o crítico e a suíte inteira revelam. Inclui "reproduzir antes de corrigir" e "causa raiz, não sintoma": ambos evitam a cascata de quebras.

**Etapa 6 — Orçamento, Regra 2 e 3, reset com prompt refinado (3.5, 3.6, 3.7; INTEIA Leis 1 e 3).**
Só faz sentido quando o aluno já executou loops e viu o custo crescer. Aqui a aula ensina a contar falhas, a fazer `/clear` sem perder aprendizado (registro de volta, 3.16) e a escolher o executor (3.17).

**Etapa 7 — Encerrar: critério, risco, limite (2.4; 3.11, 3.18).**
Por último, porque as três saídas dependem de tudo o que veio antes: "critério atingido" precisa da Etapa 1 e 3; "risco identificado" precisa dos portões humanos; "inconclusivo" precisa do orçamento e do registro. A aula termina com a ideia de que parar bem é habilidade, não fracasso — e que o registro da volta é a entrada do próximo ciclo (a última cena responde a primeira).

**Etapa 8 — Armadilhas como revisão final (seção 4).**
As quatro armadilhas funcionam como recapitulação: cada uma é a ausência de um princípio já ensinado (não converge ↔ delimitação e reversão; complacente ↔ crítico independente; Goodhart ↔ não mexer no teste; custo ↔ orçamento e reset). Isso fecha a aula com verificação do próprio aprendizado.

**Mapeamento sugerido para capítulos (para a fase de narrativa):** Etapas 0–1 → capítulo de abertura (referência e critério); Etapa 2–3 → "Uma volta"; Etapas 4–5 → "Controlar"; Etapa 6 → interlúdio de custo/reset; Etapas 7–8 → "Encerrar" e fechamento do arco. Cada capítulo com três lições, sem repetir termos entre capítulos (critério 5 do briefing: economia e nada redundante).
