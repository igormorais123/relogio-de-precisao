# Validação da aula complementar

Data: 13/09/2026. Endereço usado no navegador: http://127.0.0.1:5198. Fonte da aula em `src/`; relatórios geométricos em `public/assets/`.

| Verificação | Evidência / resultado |
|---|---|
| Progressão e retorno | Nove testes Node passaram, incluindo amostragem reversível, continuidade entre capítulos, retorno à composição inicial, limites inválidos e exportação sem conclusão inventada. |
| Modelo desktop | Carro carregado, 97 partes; montagem explodida e retorno observados. A assinatura gerada no aplicativo acrescenta geometria à contagem do GLB. |
| Modelo para tela estreita | Viewport 390 × 844; carro e textos com composições próprias. Não baixa o box nesse modo. Inspeção de viewport não equivale a teste em celular físico. |
| Primeira atividade | Resposta inadequada gera explicação; alternativa correta gera confirmação com justificativa. |
| Anotação | Nota explicitamente identificada como teste de interface foi escrita, reapareceu no caderno e entrou no prompt. A nota de teste foi apagada pela própria interface ao concluir. |
| Gerador de prompt | Preservou literalmente a anotação e usou `[preencher]` nos campos vazios. Não executa uma IA. |
| Teclado | Diálogo abre com foco, Escape fecha e a navegação por links permanece disponível. Não foi feita auditoria exaustiva de leitor de tela. |
| Navegação por capítulos | Saltos para hipótese, túnel e encerramento, com retorno explícito à abertura. Pose de retorno conferida: câmera [6.5, 2.6, 7.3], montagem 0, túnel 0. |
| Movimento reduzido | Preferência emulada acionou modo leitura, abriu os conteúdos complementares e pausou a apresentação. Emulação removida ao final. |
| Sem JavaScript | Emulação desativou scripts e a página foi recarregada. Seis capítulos permaneceram acessíveis; detalhes da hipótese foram expandidos e a fonte ficou disponível. Scripts reativados ao final. |
| Carro indisponível | Bloqueio temporário dos dois GLBs no navegador: a página entrou em leitura e mostrou “3D indisponível · aula em modo leitura”. Bloqueio removido e página recarregada. |
| Geometria e pivôs | Dois LODs, 20 ciclos cada, erro de retorno zero; direção, DRS, isolamento e arraste testados em Node. Veja `carro-aula.validacao.json` e `carro-aula-mobile.validacao.json`. |
| Solo | Varredura dos vértices e caixas de geometria conferiu pneus dianteiros em y=0 após normalização. Nenhum deslocamento físico foi criado para compensar a aparência das sombras. |
| Build | Compilação de produção passou; pacote Three.js de aproximadamente 801 kB minificado permanece separado do código da aula. Não é uma medição de tempo de rede. |

## Correções surgidas na avaliação

Carregamento único durante alternâncias de modo; mensagens visíveis de falha de salvamento; exportação com metadados que não podem ser substituídos pelos campos; box só carregado no desktop; renderização sob demanda; geometria de arquitetura que ocultava o carro retirada da apresentação; opção HTML de decisão corrigida; sombras atualizadas para a versão Three instalada; recuperação após falha de download remove o canvas que falhou.

Os logs da sessão incluem o erro de sintaxe transitório de uma edição, corrigido antes dos testes, o aviso de sombra obsoleta, também corrigido, e o erro esperado do teste de bloqueio de GLB. Não devem ser confundidos com falhas pendentes. O driver emitiu aviso numérico de shader durante a preparação; a cena renderizou no navegador.

## Limites

Não foram medidos FPS/GPU em hardware móvel real, qualidade de áudio (não implementado), equivalência fotográfica, CFD, desempenho aerodinâmico ou aprendizagem de alunos reais. A exportação JSON foi coberta pela função e pelos testes automatizados; não foi conferido um download físico final no disco do usuário. Acesso a fontes externas, permissões de redistribuição e um eventual deploy são etapas distintas.
