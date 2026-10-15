# F1 Loop — critérios de aprendizagem e atividade verificável

Proposta de 13/09/2026, complementar a `NARRATIVA.md`. Este documento define como avaliar a aula; não afirma que alunos já foram avaliados ou que os controles descritos já estejam implementados.

## Resultado esperado

O aluno deve conduzir uma pequena tarefa real com IA e justificar sua decisão com evidência. O objetivo não é memorizar componentes de F1, completar o scroll ou aprender comandos de uma ferramenta específica.

## Atividade contínua: apresentar o túnel sem prometer o que ele não faz

**Tarefa real:** preparar um texto curto, destinado a um visitante do Laboratório INTEIA, que explique o que a visualização do túnel permite explorar e qual é seu limite. O texto pode ser usado posteriormente na aula, após revisão; esta atividade não o publica automaticamente.

**Fonte fornecida:** `../01-pesquisa/laboratorio-3d-inteia.md`, §3, “Túnel de vento”. O documento local descreve fumaça procedural, controles e leitura por região, e distingue o ensaio por coeficientes de CFD. Para afirmações sobre o funcionamento atual, conferir a capacidade no aplicativo; a fonte documental, sozinha, sustenta apenas o que o inventário descreve.

**Material do aluno:** fonte copiada integralmente da seção indicada, candidata efetivamente produzida, revisão com trechos localizáveis e registro final. A aula não fornece uma falsa transcrição de resposta de IA ou falsa saída de verificação como se tivesse ocorrido.

### Critérios fixados antes da geração

1. O texto tem um parágrafo de até 120 palavras, em português brasileiro, compreensível para um visitante sem formação técnica. O teto é uma escolha didática desta atividade.
2. Explica ao menos uma ação que o inventário permite ao visitante, sustentada por trecho da fonte.
3. Diz explicitamente que a visualização não é CFD e não deve ser apresentada como telemetria real de pista.
4. Não afirma validação aerodinâmica, medição de força ou ganho de performance que a fonte não demonstre.
5. Preserva a utilidade descrita do túnel; explicar limites não pode transformar “visualização didática” em “ferramenta inútil”.
6. Fora do parágrafo, cada afirmação factual fica vinculada ao trecho correspondente da fonte. Se uma capacidade atual não tiver sido conferida, a limitação é registrada.

O docente pode trocar a tarefa por um documento, relatório, trecho de código ou interface real do aluno. Deve manter a estrutura: fonte existente, resultado delimitado, critério observável, propriedade a preservar e decisão explícita. Não usar dados pessoais ou registros operacionais sem necessidade para o exercício.

### Passos

| Capítulo | Ação prática | Entrega observável |
|---|---|---|
| Preparar | Ler a fonte; fixar os critérios e o escopo | Ficha preenchida antes da geração |
| Hipótese | Prever como o texto pode ficar mais claro sem exagerar a capacidade | Uma hipótese e uma forma de refutá-la |
| Executar | Gerar o texto na ferramenta disponível e guardar a saída real | Candidata 1 e origem da saída |
| Avaliar | Conferir fatos na fonte, extensão e compreensão | Tabela de critérios com evidência |
| Corrigir | Revisar somente falha demonstrada e conferir os itens preservados | Candidata 2 e comparação; ou justificativa de que nenhuma revisão é necessária |
| Encerrar | Decidir e guardar o registro | Aceitar, decisão necessária ou inconclusivo, com motivo |

Se a candidata inicial atender, o aluno pode aceitar após a verificação. Não obrigar uma segunda versão para simular que houve aprendizagem. O professor pode testar a compreensão pedindo que o aluno explique o que rejeitaria em outra tarefa, claramente apresentada como hipótese, sem fingir que houve um erro real.

## Prompts prontos para a atividade

### Produção

> Use exclusivamente a fonte que vou colar. Escreva um parágrafo de até 120 palavras, em português brasileiro, para apresentar a visualização do túnel do Laboratório INTEIA a um visitante. Explique uma ação descrita na fonte e seu limite: a visualização não é CFD nem telemetria real de pista. Não atribua medição, validação ou ganho de performance que a fonte não demonstre. Preserve a utilidade didática do ambiente. Depois do parágrafo, relacione cada afirmação factual ao trecho que a sustenta e indique o que não foi verificado no aplicativo. Fonte: [colar a seção real].

### Revisão

> Confira esta candidata contra a fonte e os seis critérios da atividade. Para cada critério, marque Atende, Não atende ou Não verificado e cite a evidência. Procure afirmações sem suporte e perdas de conteúdo útil. Não invente um defeito para satisfazer o pedido. Se tudo atender, registre o alcance da conferência e o que ela não prova. Fonte: [colar]. Candidata: [colar a saída real].

### Correção e fechamento

> Corrija somente os achados confirmados desta revisão. Preserve o que foi aprovado. Mostre a alteração e repita a conferência dos critérios afetados e dos conteúdos que deveriam permanecer. Conclua com a decisão e a evidência; não afirme teste no aplicativo se ele não ocorreu. Revisão: [colar os achados reais].

## Ficha de avaliação do artefato

| Critério | Atende / Não atende / Não verificado | Trecho da candidata | Fonte ou verificação executada | Limite da evidência |
|---|---|---|---|---|
| Extensão e linguagem |  |  |  |  |
| Ação útil sustentada |  |  |  |  |
| Limite explícito |  |  |  |  |
| Ausência de desempenho inventado |  |  |  |  |
| Utilidade preservada |  |  |  |  |
| Rastreabilidade factual |  |  |  |  |

“Não verificado” não significa “falso”, mas não sustenta aprovação daquele critério. Se a evidência for apenas o inventário, registrar esse alcance. Contar palavras não comprova clareza; a compreensão pode ser conferida pedindo a um colega que explique o que pode e o que não pode concluir sobre o túnel.

## Rubrica de aprendizagem

Escala proposta: 0 = não demonstrado; 1 = demonstrado com ajuda ou incompleto; 2 = demonstrado de forma autônoma e com evidência. A pontuação organiza o acompanhamento e não é uma medida científica de aprendizagem validada.

| Competência | 0 | 1 | 2 |
|---|---|---|---|
| Preparar | Pede apenas “melhorar” | Tem objetivo, mas falta fonte ou condição verificável | Registra fonte, objetivo, critério e propriedade a preservar |
| Formular hipótese | Promete sucesso sem condição de teste | Explica a mudança, mas não sabe refutá-la | Diz o efeito esperado e o que faria rejeitar a hipótese |
| Produzir com escopo | Reescreve sem preservar entrada | Guarda saída, mas não delimita a mudança | Mantém base, candidata e mudança identificável |
| Avaliar | Usa aprovação da IA como prova | Aponta problemas sem conferir toda afirmação relevante | Liga achados à fonte, reconhece limites e não inventa falhas |
| Corrigir e preservar | Muda o critério só para passar ou introduz afirmação sem suporte | Corrige o alvo, mas não confere o que deveria permanecer | Corrige achado comprovado e verifica regressões relevantes |
| Decidir e registrar | Declara “pronto” sem evidência | Registra resultado sem limites ou próximo passo | Decide de acordo com a verificação e deixa registro reutilizável |

**Condição proposta de conclusão:** nenhum item em 0; avaliação e decisão em 2; artefato com os critérios relevantes verificados. O docente pode fornecer ajuda e reaplicar somente a competência pendente. Não somar pontos para compensar uma afirmação fabricada ou uma falsa alegação de teste executado.

**Transferência:** na tarefa seguinte, o aluno deve repetir a estrutura sem o carro e sem os prompts prontos. Uma atividade diferente permite avaliar se aprendeu o processo, em vez de reproduzir a resposta esperada do exemplo.

## Quatro perguntas para a conversa final

1. Qual afirmação da candidata dependia de uma fonte, e onde você a conferiu?
2. Qual observação faria você rejeitar sua hipótese?
3. O que sua verificação não prova, mesmo quando o critério passa?
4. O que outro colega precisa saber para continuar seu loop sem repetir o trabalho?

As respostas devem apontar para a atividade efetivamente feita. Saber repetir “produzir, criticar, revisar, verificar” não substitui esses exemplos.

## Registro mínimo de uma volta

```text
Objetivo:
Fonte e versão/data, quando disponíveis:
Critérios e propriedade a preservar:
Hipótese:
Limite combinado:
Candidata e mudança:
Verificação realmente executada:
Resultado observado:
O que não foi verificado:
Decisão e motivo:
Próxima pergunta, se houver:
```

Campos permanecem vazios até haver dado. “Fonte não informada”, “Não executado” e “Inconclusivo” são estados legítimos. O sistema não deve completar resultados, tempos, tentativas ou justificativas automaticamente a partir da animação.

## Critérios para validar a própria aula

### Conteúdo e honestidade

- Cada capítulo tem um gesto que o aluno consegue aplicar fora do cenário de F1.
- A metáfora está rotulada quando puder ser confundida com processo ou medição real.
- O túnel visual não é apresentado como CFD, telemetria ou prova de performance.
- Casos históricos entram apenas com fonte conferida; a sequência de eventos não vira explicação causal sem evidência.
- A aula ensina que outro modelo, um teste e uma revisão humana têm limites; nenhum recebe selo automático de infalibilidade.
- Critérios, escopo e limites são visíveis antes da execução, e mudar o critério exige registrar por quê.

### Interação e acessibilidade

- Os seis capítulos e a atividade permanecem acessíveis sem WebGL, com movimento reduzido e por teclado.
- Voltar no scroll não apaga respostas, duplica registros ou dispara uma geração.
- A atividade não exige clicar em objetos 3D pequenos; existe alternativa em texto.
- Todo estado depende também de texto, não só de cor, posição ou animação.
- O final distingue conteúdo percorrido, atividade registrada e aprendizagem avaliada.
- Se houver exportação, o arquivo contém apenas os dados efetivamente registrados e deixa claras as lacunas.

### Evidência de validação

- Verificação técnica do conteúdo e das interações no navegador, incluindo tela estreita e modo de leitura.
- Aplicação acompanhada da atividade com respostas reais, sem produzir métricas de alunos antes da aplicação.
- Registro das dificuldades observadas e da mudança feita para resolvê-las.
- Nova verificação apenas dos pontos alterados e das regressões relevantes.

Uma compilação bem-sucedida demonstra que o código compila; a navegação demonstra acesso; o exercício e a transferência fornecem evidência sobre aprendizagem. Esses resultados devem ser relatados separadamente.
