# Instruções para baixar, executar e compartilhar

## Assistir sem instalar

Abra a [apresentação publicada](https://relogio-de-precisao.igor47306.chatgpt.site). Role para avançar e retornar. O [guia do aluno](docs/guia-do-aluno.md) propõe uma atividade que pode ser feita só com o navegador e um documento de anotações.

## Criar sua cópia

Para editar, instale Node.js 22.12 ou superior, com npm, e um editor de texto ou código. Git é necessário apenas para a opção de clonagem e histórico. Verifique no terminal:

```sh
node --version
npm --version
```

No GitHub, use **Fork** para criar sua cópia na sua conta. Na página do seu fork, use **Code** e copie a URL. Execute `git clone` seguido dessa URL. Se quiser apenas uma cópia local da base original:

```sh
git clone https://github.com/igormorais123/relogio-de-precisao.git
cd relogio-de-precisao
npm ci
npm run dev
```

Outra opção é **Code → Download ZIP**. Extraia o ZIP e abra um terminal na pasta que contém `package.json`. Execute `npm ci` e `npm run dev`. Um ZIP não traz o histórico Git; um fork facilita manter sua versão e registrar mudanças.

Abra `http://127.0.0.1:5173/`. Mantenha o terminal aberto durante o uso. Salvar alterações no editor atualiza a página de desenvolvimento. Para encerrar, use `Ctrl+C` no terminal. Não abra `index.html` com duplo clique: os módulos precisam do servidor HTTP.

No Windows, se o PowerShell bloquear `npm.ps1`, use `npm.cmd ci` e `npm.cmd run dev`; não é necessário desativar a política de segurança para isso. Se a pasta tiver espaços, use aspas no comando `cd`.

## Fazer a primeira edição

Siga [Como adaptar o tema](docs/adaptar-tema.md). Comece alterando apenas um título e seu parágrafo em `src/data/narrativa.js`; confira o resultado antes de mudar os demais capítulos. Preserve uma cópia ou um commit do estado que funciona.

Não edite `dist/` nem `node_modules/`: a primeira pasta é gerada pelo build e a segunda contém as dependências instaladas. O código que você adapta fica principalmente em `src/`, `index.html` e `public/`.

## Conferir a versão final

```sh
node --test tests/cameraPath.test.js
npm run build
npm run preview
```

Abra `http://127.0.0.1:5192/`. O preview mostra o último build: depois de editar, compile novamente. Percorra os seis capítulos nos dois sentidos, os aprofundamentos e os controles que sua versão usa. Confira desktop, larguras de 390 e 320 pixels, textos longos, imagens, movimento reduzido e console do navegador. Confira em celular físico quando disponível. Veja o procedimento completo em [verificação](docs/verificacao-e-publicacao.md).

## Problemas comuns

| Sintoma | O que conferir |
| --- | --- |
| `node` ou `npm` não encontrado | Instalação do Node e novo terminal aberto após a instalação. |
| `package.json` não encontrado | O terminal deve estar na raiz do projeto, não na pasta acima nem em `src/`. |
| `npm ci` falha | Versão do Node, acesso à internet e mensagem concreta. Preserve o lockfile; não o apague como tentativa genérica. |
| Porta ocupada | Encerre sua outra instância ou use `npm run dev -- --port 5174` e abra a porta informada. Não encerre processos desconhecidos. |
| Tela textual em vez do relógio | É a alternativa sem WebGL. Confira suporte e aceleração gráfica do navegador. |
| Tela vazia ou preloader parado | Abra as ferramentas do navegador, consulte Console e Network, confira erros de JavaScript e arquivos ausentes. |
| Imagem não aparece | Confira nome, extensão e maiúsculas/minúsculas. Os nomes precisam coincidir também na hospedagem. |
| Alteração não aparece no preview | Rode `npm run build` novamente e recarregue a página. |
| Site funciona localmente e falha online | Confira a raiz de publicação e os caminhos absolutos de assets descritos abaixo. |

Ao pedir ajuda, informe o passo executado, versões do Node/npm, erro exato e arquivo alterado. Remova dados privados da mensagem e da captura de tela.

## Entregar e publicar sua versão

Entregue o código-fonte da sua cópia, um README com tema e instruções, os créditos e uma descrição do que foi testado. Se houver site publicado, inclua o endereço. O commit pode ser consultado com `git rev-parse HEAD` em uma cópia Git. Não envie `node_modules/`, segredos, documentos pessoais ou registros exportados de colegas.

A saída para uma hospedagem estática é `dist/`; o comando de build é `npm run build`. A hospedagem não precisa de backend. Use uma conta e um destino seus. `.openai/hosting.json` identifica a hospedagem original: não o use como destino da sua adaptação.

O projeto usa caminhos a partir da raiz, como `/fonts/`. A publicação em um subdiretório, como em certas configurações do GitHub Pages, exige revisar esses caminhos no HTML, CSS e JavaScript, além da configuração `base` do Vite. Alterar apenas `base` não garante corrigir strings de caminhos usadas em tempo de execução. Para a primeira publicação, prefira servir a apresentação na raiz do endereço escolhido.

Antes de tornar sua cópia pública, confira as [condições de uso](CREDITOS-E-USO.md), as fontes de suas imagens e os arquivos que serão enviados. Depois de publicar, abra a URL real e repita a navegação: um build local aprovado não comprova o funcionamento online. A configuração de GitHub Actions é opcional; uma execução remota bloqueada não impede testar localmente.

Graphify e Archify documentam a estrutura do projeto. Não são dependências do site nem pré-requisitos para a atividade inicial. Alterações estruturais devem manter os mapas coerentes; o procedimento de manutenção está em [arquitetura](docs/arquitetura.md).
