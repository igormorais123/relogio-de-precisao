#!/usr/bin/env bash
# Publica f1-loop/dist na branch gh-pages (GitHub Pages por branch, pasta /f1-loop/).
# Uso local, na raiz do repositório: bash f1-loop/tools/publicar-gh-pages.sh
# Na action, GH_PAGES_REMOTE recebe a URL autenticada com GITHUB_TOKEN.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
REMOTE="${GH_PAGES_REMOTE:-$(git -C "$ROOT" remote get-url origin)}"
PAGE_URL="https://igormorais123.github.io/relogio-de-precisao/f1-loop/"

cd "$ROOT/f1-loop"
[ -d node_modules ] || npm ci
npm test
npm run build

SHA="$(git -C "$ROOT" rev-parse --short HEAD)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

if git ls-remote --exit-code --heads "$REMOTE" gh-pages >/dev/null 2>&1; then
  git clone --quiet --depth 1 --branch gh-pages "$REMOTE" "$WORK/site"
else
  git init --quiet -b gh-pages "$WORK/site"
fi

# Substitui o conteúdo publicado, preservando apenas o histórico git da branch.
find "$WORK/site" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
mkdir -p "$WORK/site/f1-loop"
cp -R dist/. "$WORK/site/f1-loop/"
# Fontes de proveniência (GLB sem compressão, PNG e TTF originais, Lato fora de uso) ficam no repositório, não no site.
rm -f "$WORK/site/f1-loop/assets/"{carro-aula.glb,carro-aula-mobile.glb,box-aula-referencia.glb,box-poster.png} \
      "$WORK/site/f1-loop/fonts/"{Lato-Regular.ttf,Lato-Regular.woff2,Barlow-Regular.ttf,BebasNeue-Regular.ttf}
touch "$WORK/site/.nojekyll"
printf '%s\n' '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=./f1-loop/"><title>F1 Loop · INTEIA</title></head><body><a href="./f1-loop/">Abrir a aula F1 Loop</a></body></html>' > "$WORK/site/index.html"

cd "$WORK/site"
git config user.name >/dev/null || git config user.name "github-actions[bot]"
git config user.email >/dev/null || git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
git add -A
if git diff --cached --quiet; then
  echo "gh-pages já está atualizada."
  exit 0
fi
git commit --quiet -m "deploy(f1-loop): publish build from ${SHA}"
git push --quiet "$REMOTE" gh-pages:gh-pages
echo "Publicado: ${PAGE_URL}"
