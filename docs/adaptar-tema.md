# Como adaptar a apresentação para outro tema

Você pode mudar o assunto e compartilhar sua versão, mantendo o crédito à base e respeitando as [condições de uso](../CREDITOS-E-USO.md). Comece com uma cópia própria conforme as [instruções](../INSTRUCOES.md).

## Escolha o alcance da mudança

| Adaptação | Trabalho envolvido |
| --- | --- |
| Novo exemplo com o mesmo relógio e as seis etapas | Alterar textos e exemplos, manter a estrutura e conferir coerência e leitura. É o melhor primeiro exercício. |
| Nova identidade visual | Além dos textos, ajustar cores, imagens, fontes e seus créditos; conferir contraste e enquadramento. |
| Outro objeto 3D ou outra quantidade de capítulos | Alterar direção, câmera, efeitos, navegação e testes. O projeto não é um editor genérico que transforma qualquer tema automaticamente. |

Um tema como organização de estudos pode usar o relógio como metáfora de rotina. Isso permite mudar o assunto sem reconstruir a cena. Um tema que exija uma célula, uma máquina diferente ou um mapa 3D demanda desenvolvimento adicional.

## Planeje antes de editar

Defina público, resultado esperado, fontes e critério de pronto. Escreva seis frases, uma por etapa. Para uma apresentação sobre organização de estudos, um roteiro possível é:

| Etapa existente | Exemplo de conteúdo novo |
| --- | --- |
| Problema | Identificar qual dificuldade impede cumprir o plano de estudos. |
| Pesquisa | Consultar programa da disciplina, agenda disponível e dificuldades registradas. |
| Planejamento | Distribuir tarefas com prazos e critérios de conclusão. |
| Execução | Realizar uma sessão e registrar o que foi concluído. |
| Avaliação | Comparar o planejado com o realizado e investigar a diferença. |
| Aprendizado | Ajustar a próxima semana com base no registro. |

Esse exemplo é um roteiro de adaptação, não uma alegação de eficácia educacional comprovada. Acrescente referências para afirmações específicas do seu assunto.

## Onde editar

| Arquivo | O que você encontra |
| --- | --- |
| `src/data/narrativa.js` | Seis capítulos, títulos, parágrafos, lições, cores, pontos interativos e cenários. |
| `src/data/paginas.js` | Dois aprofundamentos, suas imagens, descrições alternativas e seções. |
| `src/ui/easterEggs.js` | As três descobertas opcionais e seu aviso de origem. |
| `index.html` | Nome da página, descrição, identificação no cabeçalho, texto de carregamento e controles com textos fixos. |
| `src/styles.css` | Estilos, fontes, espaçamento e regras para telas pequenas. |
| `public/` | Imagens e fontes servidas pelo site. |
| `src/ui/ui.js` | Textos e comportamentos de navegação, cenários, registro e aprofundamentos. |
| `src/core/Director.js`, `cameraPath.js`, `src/watch/Watch.js`, `src/fx/` | Direção da cena, trajetória da câmera, objeto 3D e efeitos. Mudanças avançadas. |

### 1. Troque os textos com a estrutura preservada

No objeto do primeiro capítulo em `narrativa.js`, altere os valores existentes, por exemplo:

```js
"titulo": "ORGANIZAR\nPARA\nAPRENDER.",
"corpo": "Transforme a rotina em um plano verificável.",
"essencia": "Defina sua dificuldade principal.",
```

Esse trecho substitui campos dentro de um objeto existente; não substitui o arquivo inteiro. Preserve aspas, vírgulas, colchetes e chaves. `\n` define uma quebra de linha no título. Use títulos curtos e parágrafos próximos do tamanho original; textos longos podem invadir o relógio ou sair da tela.

Mantenha inicialmente os seis objetos, sua ordem, `id`, `slug`, a exportação `N`, os identificadores de `hotspots` e as chaves `frio`, `calor`, `impacto` e `posicao` dos cenários. Há código que usa diretamente o capítulo de índice 4 para Avaliação e o índice 5 para Aprendizado. Alterar só a lista não basta para criar um sétimo capítulo.

Os valores dos cenários e os gráficos são exemplos didáticos de relojoaria. Se mantiver o relógio como metáfora, explique esse papel. Se quiser transformá-los em dados do novo assunto, revise também rótulos, unidades, cálculo do gráfico, interações e efeitos em `ui.js`, `Director.js` e `index.html`. Não apresente números ilustrativos como medições reais.

### 2. Revise aprofundamentos e imagens

Em `paginas.js`, mantenha as chaves `loop` e `grafo` na primeira adaptação e ajuste seus exemplos ao novo tema. Atualize juntos `titulo`, `lead`, `metafora`, `secoes`, `imagem` e `alt` quando pertinente.

Para usar uma imagem própria, salve, por exemplo, `meu-grafo.png` em `public/` e configure `imagem: 'meu-grafo.png'`. Nesse campo, não escreva `public/` antes do nome. Preencha `alt` com uma descrição útil do conteúdo. Confira dimensões, peso, corte da imagem e permissão de uso. O restante da cena também usa imagens; trocar somente as duas imagens dos aprofundamentos não substitui todo o visual.

### 3. Ajuste cores e identidade

Os campos `cor` e `acento` em `narrativa.js` são números de cor. Você pode usar a notação JavaScript `0x123456`, com seis dígitos hexadecimais, em vez de um número decimal. Uma cor CSS como `#123456` não pode ser colocada ali sem adaptar o código.

Esses campos não recolorem toda a aplicação. Confira os estilos e materiais da cena antes de prometer uma identidade completa. Verifique contraste no navegador, especialmente entre texto e fundo.

Procure também o nome antigo, textos de relógio, referências à Fórmula 1, metadados e mensagens de registro em `index.html` e `src/`. Use a busca do editor; substitua caso a caso. Preserve identificadores usados pelo JavaScript. Renomear um `id` no HTML pode quebrar um controle mesmo que a tela inicial continue aparecendo.

### 4. Acrescente os créditos

Use o modelo em [Créditos e condições de uso](../CREDITOS-E-USO.md) no README da adaptação e em um local visível do seu site. Identifique o novo autor, as alterações e as fontes adicionais. Não acrescente um rodapé sem conferir seu posicionamento: a apresentação usa uma sequência de rolagem e elementos fixos.

<a id="usar-ia-com-um-pedido-verificavel"></a>

## Usar IA com um pedido verificável

Você pode pedir ajuda a uma ferramenta que já utilize. Ela precisa receber os arquivos ou ter acesso autorizado à sua cópia. Um pedido inicial possível é:

> Nesta cópia de Relógio de Precisão, adapte os textos para [tema], voltados a [público], com o objetivo de [resultado]. Use estas fontes: [referências autorizadas]. Preserve os seis capítulos, os identificadores e o relógio como metáfora. Primeiro leia README.md, INSTRUCOES.md, CREDITOS-E-USO.md, docs/adaptar-tema.md e os arquivos de conteúdo. Altere apenas o necessário para o tema; mantenha os créditos e identifique minha adaptação. Não invente dados nem fontes. Execute os testes de câmera e o build e confira os textos no navegador, em desktop e telas pequenas. Informe o que mudou e o que não conseguiu verificar. Não publique nem contrate serviços.

Depois de receber a alteração, revise os arquivos e abra o site. A afirmação “testado” precisa indicar quais verificações foram feitas. Se a ferramenta não conseguir renderizar, faça a conferência visual manualmente.

## Critério para compartilhar

A adaptação está pronta para entrega quando os textos ensinam o novo tema com fontes, as referências antigas restantes são intencionais, os créditos estão visíveis, os assets têm origem registrada e a navegação funciona nos dois sentidos. Confira também os aprofundamentos, controles, leitura em tela pequena e ausência de erros no console.

Execute os comandos de [verificação](verificacao-e-publicacao.md) e descreva qualquer limite real. Os testes de câmera não validam a qualidade do conteúdo. Para publicar, siga a seção final de [INSTRUCOES.md](../INSTRUCOES.md).
