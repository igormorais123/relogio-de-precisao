# Verificação factual e complemento pedagógico — F1 Loop

Verificado em 13/09/2026. Escopo: complementar `f1-licoes.md`, `00-briefing.md` e os três julgamentos, preservando os documentos originais. Esta revisão seleciona seis lições; não certifica os 31 itens da pesquisa anterior. Fontes factuais usadas: páginas oficiais da Fórmula 1, Mercedes e FIA. A relação com Engenharia de Loop é uma interpretação didática, explicitada separadamente do fato.

## Decisão editorial

Usar o ciclo de um experimento como espinha: **preparar → formular hipótese → executar → avaliar → corrigir → encerrar e registrar**. O tratamento C oferece essa continuidade, mas a aula não precisa depender de reproduzir a história completa de uma equipe, nem terminar com uma vitória esportiva. A resolução é conseguir justificar a decisão com evidência.

O aluno deve encontrar três camadas distintas: a ação que aprende a fazer, um caso histórico curto e a visualização ilustrativa do laboratório. O carro vermelho pode acompanhar todas as cenas sem representar o carro real de Ferrari, Mercedes ou McLaren. Nenhum valor animado deve parecer telemetria dessas equipes.

## Seis lições com suporte verificável

### 1. Preparar: confronte a referência com o mundo observado

**Fato sustentado.** Rob Smedley explica que correlação compara dados medidos no carro e no ambiente de simulação. Uma divergência exige investigação; o problema pode estar no carro ou na representação usada para desenvolvê-lo. Flow-vis registra padrões do fluxo sobre a superfície depois de o carro rodar; aero rakes medem estruturas do escoamento fora da carroceria. [F1, 21/02/2020, artigo de Rob Smedley](https://www.formula1.com/en/latest/article/testing-explained-rob-smedley-on-correlation-aero-rakes-and-flow-vis-paint.5UTaH1q9iuQcXVjZXui3Fz).

**Aplicação ao loop.** Antes de pedir uma alteração, observe o comportamento atual e defina como comparar o resultado. Uma referência real pode ser a tarefa executada, uma amostra fornecida pelo usuário ou um comportamento reproduzido.

**Texto curto para a aula:** “A hipótese precisa encontrar a realidade.”

**Gesto do aluno:** “Mostre como funciona hoje, registre a referência e diga qual observação demonstrará a melhora.”

**Limite da analogia.** CFD é um modelo físico computacional; a resposta de um modelo de linguagem não é CFD. Uma suíte de testes também é uma representação parcial: não equivale automaticamente à experiência real de uso. Evitar a equivalência literal “resposta da IA = CFD; pista = npm test”.

### 2. Formular hipótese: teste uma mudança que possa ser reconhecida

**Fato sustentado.** A Mercedes situa seu simulador com piloto em Brackley. O trabalho anterior ao evento busca uma configuração inicial; durante o fim de semana, a equipe compara o simulador com dados de pista, experimenta alternativas e devolve informações à equipe no circuito. Há trabalho posterior para melhorar a correlação e revisar oportunidades. [Mercedes, descrição do trabalho do piloto de simulador; data não exibida no corpo consultado](https://www.mercedesamgf1.com/news/feature-explaining-the-role-of-an-f1-sim-driver).

**Aplicação ao loop.** Escrever uma hipótese como “se mudarmos X, esperamos observar Y sob condição Z” torna a próxima execução interpretável. Registrar a versão de referência e preservar o que já funciona permite comparar alternativas.

**Texto curto para a aula:** “Uma mudança. Uma previsão verificável.”

**Gesto do aluno:** “Escreva o que será alterado, o efeito esperado e o que deve continuar funcionando.”

**Limite da analogia.** A fonte não estabelece uma lei universal de que equipes mudam exatamente uma variável em toda experiência. Aqui, reduzir o escopo é uma escolha didática. Variações de piloto, pista e condições impedem tratar qualquer comparação entre dois carros como experimento perfeitamente controlado.

### 3. Executar: faça uma intervenção delimitada e verificável

**Fato sustentado.** A F1 registrou a troca de pneus de Lando Norris pela McLaren em 1,80 segundo no Catar de 2023, apresentada naquele momento como novo recorde. [F1, publicação de 09/10/2023](https://www.formula1.com/en/video/dhl-world-record-fastest-pit-stop-qatar-grand-prix.1779230177007315938).

**Aplicação ao loop.** O exemplo torna visível uma ação com começo, fim e resultado observável. O aluno executa o que foi delimitado, conserva uma versão recuperável e registra o que mudou.

**Texto curto para a aula:** “Execute o combinado. Preserve a referência.”

**Gesto do aluno:** “Aplique a mudança definida e mostre exatamente o que foi alterado.”

**Limite da analogia.** O número mede a troca de pneus, não a passagem completa pelo pit lane, a construção de uma peça ou a troca do assoalho. Não colocar o cronômetro de 1,80 s sobre uma montagem de assoalho. Não apresentar o registro histórico como prova de que ainda seja o recorde vigente em 2026. Rapidez sozinha não demonstra qualidade.

### 4. Avaliar: escolha o dado que decide

**Fato sustentado.** A Mercedes descreve mais de 250 sensores possíveis em um fim de semana e explica que os dados são sincronizados para análise. O artigo ressalta a necessidade de priorizar a informação relevante e revisar os dados para aprender. [Mercedes, Data and Electronics in F1; data não exibida no corpo consultado](https://www.mercedesamgf1.com/news/feature-data-and-electronics-in-f1-explained).

**Aplicação ao loop.** O resultado precisa ser comparado ao critério registrado, com uma evidência acessível. Uma falha específica vale mais que um parecer genérico de que “parece bom”.

**Texto curto para a aula:** “Meça o que decide.”

**Gesto do aluno:** “Compare o resultado com o critério original e mostre a evidência, incluindo o que não passou.”

**Limite da analogia.** Não converter números de equipes e datas diferentes em “250–300 sensores da F1 2026”. Não importar terabytes ou latências para ornamentar um painel. A constelação visual de sensores é ilustração: só mostrar dados reais se houver aquisição e origem verificáveis.

### 5. Corrigir: melhorar uma métrica não basta

**Fato sustentado.** A introdução pública da análise técnica da F1 de 05/09/2024 explica que o piso de Monza da Ferrari procurava controlar o bouncing surgido com a atualização de Barcelona. O texto também adverte que a coincidência entre atualização e vitória não demonstra causalidade; as características do circuito favoreciam o carro. [F1, Mark Hughes e Giorgio Piola](https://www.formula1.com/en/latest/article/tech-weekly-how-ferraris-monza-upgrades-helped-the-team-to-address-a-key.5UpzTp0C4wEAuH8HalwblV).

**Aplicação ao loop.** Avaliar o efeito desejado e as regressões. Ao corrigir, identificar a hipótese revisada e verificar de novo, preservando uma opção de retorno.

**Texto curto para a aula:** “A melhora precisa sobreviver à verificação.”

**Gesto do aluno:** “Mostre o ganho, procure o que piorou e corrija apenas o problema identificado.”

**Limite da analogia.** Não concluir “corrigiram o túnel e por isso venceram Monza”. A parte integral do artigo exige autenticação e não foi usada. A reversão específica dos dois carros em Silverstone e a anomalia do túnel, relatadas pela pesquisa anterior, não foram reconfirmadas aqui por fonte primária acessível; permanecem fora do conjunto certificado deste complemento.

### 6. Encerrar: um limite pode decidir a próxima ação

**Fato sustentado.** No Catar de 2023, foi imposto limite de 18 voltas para um jogo novo de pneus, com limites próprios para jogos usados considerando seu histórico. [F1, introdução pública de 08/10/2023](https://www.formula1.com/en/latest/article/explained-what-does-the-maximum-tyre-stint-length-rule-mean-for-the-qatar.4q8iXkNgE3sLnIIASPV1sm). O comunicado FIA indexado confirma a medida de segurança e distingue o limite de vida do pneu de uma obrigação direta de realizar três pit stops; a consequência dependia da distância completa da corrida. [FIA, atualização de 08/10/2023](https://api.fia.com/news/fia-statement-treatment-tyres-2023-fia-formula-1-qatar-grand-prix-update).

**Aplicação ao loop.** Terminar pode significar objetivo atingido, risco que exige decisão humana ou investigação inconclusiva dentro do limite disponível. Cada saída precisa de um registro que permita continuar com contexto.

**Texto curto para a aula:** “Encerre com uma decisão e suas provas.”

**Gesto do aluno:** “Registre resultado, evidência, limitação e próximo passo; diga se concluímos, interrompemos por risco ou permanecemos inconclusivos.”

**Limite da analogia.** A medida histórica não prova degradação inevitável da qualidade da IA a cada rodada, nem justifica um limite universal de contexto de 40%. A regra “2 falhas = reset; 3 = perguntar” é uma heurística do curso, não um regulamento F1 nem uma conclusão científica desta pesquisa. A leitura direta do comunicado FIA falhou; sua contribuição acima veio do resultado indexado, corroborado para as 18 voltas pelo trecho público da F1.

## Correções necessárias antes de consolidar a narrativa

| Trecho ou decisão anterior | Correção concreta |
|---|---|
| `f1-licoes.md`: afirmações recentes sobre Racing Bulls 2026, volumes de dados e debrief 2026 | Manter fora da narrativa principal até haver conferência pontual com URL primária e data. Esta auditoria não os declara falsos; apenas não os confirmou. Os seis casos acima dispensam esses fatos recentes. |
| `f1-licoes.md`: ATR, teto orçamentário e parc fermé apresentados como regras gerais | Datar a edição aplicável. Não transportar números históricos para a temporada 2026. Para esta aula, “orçamento finito” e “mudança após verificação exige nova avaliação” funcionam sem uma tabela regulatória. |
| Comparações descritas como analogias “exatas”, algumas com “limite: nenhum” | Trocar por “analogia útil sob estas condições” e explicitar ao menos a diferença entre instrumento, modelo e uso real. |
| `julgamento-professor.md`, enxerto 4: amarela → safety car → vermelha como contador de falhas | Usar estados internos do laboratório: “revisar”, “reformular”, “interromper”. A metáfora não deve ensinar que três erros técnicos acionam bandeiras de corrida. |
| `julgamento-professor.md`, enxerto 5: montagem de assoalho encenada junto ao pit stop de 1,80 s | Separar a cena de pneus do trabalho de montagem. O cronômetro histórico acompanha apenas o fato histórico correspondente. |
| `julgamento-professor.md`: todos os quatro hotspots visitados liberam o semáforo | Visitar uma informação comprova navegação. Para avaliar aprendizagem, exigir que o aluno escolha evidência e justifique a decisão; permitir revisão da resposta. |
| `julgamento-cineasta.md`: usar o lab remove o risco da licença do tutorial | Retirar essa conclusão. O inventário local informa geometria derivada de tutorial e ausência da licença dos project files. Titularidade do laboratório não é documentação da procedência de cada asset. A auditoria não estabelece licença nem autorização de terceiros. |
| `assets-locais-f1-2026.md`: uso educacional “provavelmente aceito”; remodelar detalhes torna o modelo autoral | Substituir essas inferências por registro de origem e status documental. Não há evidência suficiente nos arquivos lidos para confirmar essas conclusões. |
| “Fumaça do túnel”, “leitura por região” e “CFD” usados na mesma cena sem distinção | Manter perto da visualização: “Visualização ilustrativa do escoamento. Não é CFD nem medição do carro.” Resultados de um cálculo simplificado, se usados, precisam de hipóteses e origem próprias. |
| Notas dos três julgamentos tratadas como garantia de qualidade | As notas são avaliações editoriais. Os arquivos não documentam validação de cada afirmação por especialistas humanos identificados, nem testes com alunos. Uma nota alta não substitui uma fonte aberta ou um teste de compreensão. |

## Complemento que transforma a metáfora em aprendizagem

Em cada etapa, manter uma pergunta e uma pequena produção do aluno:

| Etapa | Pergunta | Evidência de aprendizagem |
|---|---|---|
| Preparar | O que acontece hoje e o que queremos mudar? | Referência, objetivo e critério escritos. |
| Hipótese | Qual mudança pode produzir qual efeito? | Hipótese com condição observável. |
| Executar | O que foi realmente alterado? | Registro da mudança e versão recuperável. |
| Avaliar | Qual evidência sustenta a conclusão? | Comparação com o critério original, incluindo regressões. |
| Corrigir | O que a falha nos ensinou? | Hipótese revisada e correção delimitada. |
| Encerrar | Qual decisão os dados permitem? | Resultado, limitação e próximo passo registrados. |

O exercício pode usar a própria tarefa do aluno. Caso o site ofereça uma situação demonstrativa, deve identificá-la como fictícia e mantê-la separada dos casos históricos. Não usar números inventados como se tivessem saído do carro INTEIA ou de uma equipe de F1.

**Critério de aceitação pedagógico:** o aluno consegue explicar a diferença entre hipótese e evidência, apontar uma regressão, justificar continuar ou parar e aplicar as seis perguntas a uma tarefa própria. Rolagem completa, tempo na página e hotspots visitados não demonstram esse resultado.

## Registro de verificação

- Lidos: briefing, pesquisa F1, julgamentos de professor, engenheiro F1 e cineasta, trechos de procedência e limitações dos inventários do laboratório e dos assets.
- As seis lições foram verificadas em 13/09/2026, com as limitações de acesso indicadas junto às fontes. Conteúdo da área autenticada F1 Unlocked não foi acessado.
- As afirmações descritivas da Mercedes não receberam data inventada: o corpo público consultado não a exibe. Navegação com “2026” e copyright atualizado não datam o artigo.
- Documentos originais, código da experiência e assets não foram alterados por esta revisão.
