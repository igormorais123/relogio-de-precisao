# Verificação e publicação

## Build reproduzível

```sh
npm ci
node --test tests/cameraPath.test.js
npm run build
npm run preview
```

O preview está fixado em `127.0.0.1:5192` com `--strictPort`. Verifique que a tela aberta corresponde ao projeto antes de avaliar a versão. O pacote publicável é `dist/`.

## Verificação no navegador

Percorra os seis capítulos, avance e retorne por rolagem, e confira os aprofundamentos de loop e grafo. Verifique especialmente 390×844 e 320×640, além do desktop: texto legível, ausência de overflow horizontal, conteúdo integral e transições da câmera. Verifique o console, a preferência de movimento reduzido e a alternativa sem WebGL. Testes automatizados de câmera não substituem essa inspeção.

## Mapas e documentação

Após mudanças de código, atualize o Graphify e confira consulta com origem. Regenere o Archify quando mudar a topologia, as interfaces ou o fluxo principal. Valide a especificação, cheque o HTML e inspecione a saída visual. Mudanças apenas de texto ou cor não exigem redesenhar a arquitetura.

Os receipts públicos usam caminhos relativos. Arquivos locais de cache, detecção e intérprete não devem ser publicados. Antes de enviar o repositório, examine os arquivos rastreados para caminhos pessoais, segredos e saídas de trabalho.

## Produção

**URL de produção:** [https://relogio-de-precisao.igor47306.chatgpt.site](https://relogio-de-precisao.igor47306.chatgpt.site). Publicado com acesso público; resposta HTTP 200 confirmada sem cookies em 11/09/2026.

A verificação de produção deve abrir a URL publicada, confirmar o carregamento dos assets e repetir o percurso essencial. Não se deve apresentar a aprovação do preview local como prova de funcionamento da hospedagem.


## Revisão realizada em 11/09/2026

- Publicação pública confirmada pelo Sites e por requisição HTTP sem cookies, com status 200 e HTML da aula.
- Versão publicada inspecionada no navegador: capítulos iniciais e alternância lateral; avanço e retorno por rolagem; slides de loop e grafo.
- Avaliação e loop inspecionados em 390 × 844; grafo completo em 320 × 640. Nenhum erro retornado pelo console na inspeção.
- Oito testes de câmera passaram, incluindo continuidade, reversibilidade, alternância lateral e poses com movimento reduzido. Build concluído; persiste o aviso de bundle de pós-processamento acima de 500 kB.
- Os dois diagramas Archify passaram nove verificações cada e foram inspecionados visualmente no navegador. Graphify: 187 nós e 284 relações; limitação de ciclos automáticos registrada no relatório.

Limites: emulação móvel não substitui teste em aparelhos físicos; taxa de quadros não foi medida nesta revisão. O fallback sem WebGL foi exercitado no preview local, não repetido em produção. Os controles opcionais não são necessários para apresentar a sequência por rolagem.

### Limitação do GitHub Actions

Na integração final, o GitHub recusou iniciar o job por bloqueio de faturamento da conta. Não houve execução remota dos testes. A validação desta entrega utiliza os oito testes e o build executados localmente, além da inspeção da versão pública. A configuração de CI permanece disponível para quando o bloqueio da conta for resolvido.
