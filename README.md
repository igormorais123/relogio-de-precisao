# Relógio de Precisão

## Comece aqui, aluno

Você pode usar esta apresentação para estudar, apresentar uma aula e criar uma versão sobre outro tema, citando a fonte e identificando suas alterações. Leia as [condições de uso e os créditos](CREDITOS-E-USO.md), inclusive as condições dos materiais de terceiros.

Não precisa instalar nada para assistir: use o link da apresentação abaixo. Para aprender com ela, siga o [guia do aluno](docs/guia-do-aluno.md). Para editar sua própria cópia, siga as [instruções de instalação e adaptação](INSTRUCOES.md).

| Quero… | Onde começar |
| --- | --- |
| Assistir e navegar | [Guia de uso](docs/uso.md) |
| Aplicar o método a um problema | [Guia do aluno e atividade prática](docs/guia-do-aluno.md) |
| Baixar, executar e resolver problemas de instalação | [Instruções](INSTRUCOES.md) |
| Mudar assunto, textos, cores ou imagens | [Como adaptar o tema](docs/adaptar-tema.md) |
| Pedir ajuda à IA sem perder o controle | [Roteiro e exemplo de pedido](docs/adaptar-tema.md#usar-ia-com-um-pedido-verificavel) |
| Citar e compartilhar minha versão | [Créditos e condições de uso](CREDITOS-E-USO.md) |
| Entender o código e testar mudanças maiores | [Arquitetura](docs/arquitetura.md) e [verificação](docs/verificacao-e-publicacao.md) |

Este repositório funciona sem assinatura de IA, chave de API, conta de hospedagem ou ferramentas de geração de mapas. Essas ferramentas não são requisitos para assistir, editar ou compilar a aula.

Uma aula visual sobre IA para resolver problemas complexos. Um relógio mecânico acompanha seis etapas: problema, pesquisa, planejamento, execução, avaliação e aprendizado. A leitura acontece por rolagem, com aprofundamentos em Engenharia de loop e Engenharia de grafo.

**Produção:** [https://relogio-de-precisao.igor47306.chatgpt.site](https://relogio-de-precisao.igor47306.chatgpt.site) — publicado com acesso público; resposta HTTP 200 confirmada sem cookies em 11/09/2026.

**Código:** [igormorais123/relogio-de-precisao](https://github.com/igormorais123/relogio-de-precisao).

## Executar localmente

Use Node.js 22.12 ou superior e npm. As versões resolvidas das dependências estão em `package-lock.json`.

```sh
npm ci
npm run dev
```

Abra http://127.0.0.1:5173/ no navegador. Para conferir a versão compilada:

```sh
npm run build
npm run preview
```

O preview usa http://127.0.0.1:5192/ e falha se a porta já estiver ocupada. A saída publicável está em `dist/`; não é necessário backend de aplicação.

## Usar a aula

Role para avançar e role para cima para retornar. Os seis capítulos e os dois aprofundamentos fazem parte do mesmo percurso. O menu de capítulos e as setas esquerda/direita oferecem atalhos. A preferência de movimento reduzido do sistema é respeitada. Sem WebGL, a página apresenta uma versão textual dos capítulos e dos aprofundamentos.

## Documentação

- [Guia de uso](docs/uso.md)
- [Arquitetura e dependências](docs/arquitetura.md)
- [Fluxo da página](docs/fluxo-da-pagina.md)
- [Verificação e publicação](docs/verificacao-e-publicacao.md)
- [Contrato técnico do projeto](ARQUITETURA.md)
- [Grafo estrutural](graphify-out/graph.html) e [relatório](graphify-out/GRAPH_REPORT.md)
- [Diagrama arquitetural](.planning/architecture/system-architecture.html)
- [Diagrama do fluxo da página](.planning/architecture/page-flow.html)

Os HTML dos mapas podem ser abertos localmente. A interface do GitHub exibe o arquivo-fonte; não executa o visualizador HTML.

## Teste focal

```sh
node --test tests/cameraPath.test.js
```

Esse teste verifica poses e continuidade matemática da câmera. A qualidade visual, o texto, a rolagem e os dois aprofundamentos também precisam ser conferidos no navegador.

## Dados e limites

A aplicação não chama modelos de IA. O relógio e as imagens são recursos didáticos; as curvas e cenários não são medições de um relógio real. O módulo de registro guarda eventos no `localStorage` do navegador e pode gerar um JSON local. Não há transmissão desses registros pelo código da aplicação; o servidor de hospedagem continua recebendo as requisições normais de arquivos do site.
