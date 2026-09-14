# Engenharia de Loop — complemento

Aula complementar ao planejamento Fable 5.1. Comece por [COMPLEMENTO-ESTRATEGIA.md](COMPLEMENTO-ESTRATEGIA.md).

## Abrir

Na pasta `f1-loop`, com Node 24:

```sh
npm ci
npm run dev
```

A porta fixa é **5198**: http://127.0.0.1:5198. Se estiver ocupada, preserve o processo existente e escolha explicitamente outra porta. Não abra `index.html` diretamente por `file://`: o modelo precisa de um servidor HTTP.

```sh
npm test
npm run build
```

O resultado está em `dist/`. A base relativa permite hospedar essa pasta dentro de outra página. `npm run preview` usa a mesma porta 5198; encerre apenas o servidor desta aula antes de trocar de modo ou informe outra porta.

## Alterar a aula

`src/content.js` é a fonte dos textos. `node render-page.mjs` gera o HTML semântico; `npm run build` já executa essa etapa. `src/story.js` amostra a coreografia por posição absoluta e contém a exportação do registro. `src/main.js` cuida dos diálogos, navegação e anotações. `src/scene.js` apresenta os derivados do modelo e o ambiente.

As fontes originais do relógio e do laboratório permanecem independentes. A pasta `materia-prima/modulos-atualizados/` preserva uma cópia dos módulos utilizados. Os scripts de redução/validação em `tools/` documentam suas entradas no repositório vizinho do laboratório.

## Usar o caderno

Registre uma tarefa sua, sem preencher evidências antes de conferi-las. As notas são locais a este navegador e endereço. Baixe o registro para guardá-lo; limpar dados do navegador ou trocar de endereço não transporta as notas. O botão de prompt gera um texto para você levar à sua IA e não executa uma chamada externa.

Consulte o [manifesto dos assets](public/assets/manifesto-assets.json) e os avisos de direitos antes de redistribuir o modelo.
