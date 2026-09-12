# Guia de uso

Abra a aula e aguarde o carregamento inicial. A rolagem conduz o conteúdo nesta ordem:

| Capítulo | Ideia central |
| --- | --- |
| Problema | Definir o que precisa mudar e como verificar o resultado. |
| Pesquisa | Consultar internet, arquivos e o conhecimento da pessoa. |
| Planejamento | Separar o resultado desejado do desenho técnico de execução. |
| Execução | Delegar tarefas claras, respeitar dependências e integrar entregas. |
| Avaliação | Comparar a entrega com uma referência e corrigir falhas demonstradas. |
| Aprendizado | Guardar decisões, evidências e relações úteis ao próximo ciclo. |

**Engenharia de loop** aparece no trecho final de Avaliação. **Engenharia de grafo** aparece no trecho final de Aprendizado. Ambos entram na própria rolagem; não é necessário abrir uma janela adicional para lê-los.

Use roda do mouse, gesto vertical no celular, PageDown/PageUp ou a barra de rolagem. O menu de capítulos e as setas esquerda/direita navegam entre etapas. Os atalhos `#loop` e `#grafo` levam aos aprofundamentos; `#capitulo-0` a `#capitulo-5` identificam os capítulos.

A página respeita `prefers-reduced-motion`. Nessa preferência, a câmera e seu alvo permanecem estáveis, a roda deixa de receber suavização e efeitos são reduzidos. O texto semântico também existe fora do canvas para tecnologias assistivas. Esses recursos não equivalem a uma certificação completa de acessibilidade.

Sem WebGL, a tela apresenta os seis capítulos e os dois aprofundamentos em texto. Use a aula por um servidor HTTP; abrir `index.html` diretamente pelo sistema de arquivos não substitui o build ou o servidor de desenvolvimento.

O registro de ciclo, quando acionado pelas interações disponíveis, fica associado à origem do navegador. Trocar de domínio ou porta cria outro espaço de armazenamento. Limpar os dados do site pode apagar esse registro; exportá-lo cria um arquivo JSON no próprio dispositivo.
