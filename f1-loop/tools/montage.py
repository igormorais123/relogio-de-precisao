# Blind pairs for the critic: our frame vs a Corn Revolution frame, random side.
# Usage: py tools/montage.py shots/r1 [seed]  -> shots/r1/cego/par-NN.jpg + shots/r1/chave-cega.json (never shown to judges)
import json, random, sys
from pathlib import Path
from PIL import Image

run = Path(sys.argv[1])
rng = random.Random(int(sys.argv[2]) if len(sys.argv) > 2 else 7)
ours = sorted(p for p in run.glob('d-*.jpg') if 'preloader' not in p.name)
refs = sorted(Path('planejamento/referencias').glob('corn-*.jpeg'))
out = run / 'cego'
out.mkdir(parents=True, exist_ok=True)
key = []
for i, frame in enumerate(ours):
    ref = refs[i % len(refs)]
    left_is_ours = rng.random() < .5
    a, b = (frame, ref) if left_is_ours else (ref, frame)
    size = (960, 600)
    canvas = Image.new('RGB', (size[0] * 2 + 16, size[1]), (255, 255, 255))
    canvas.paste(Image.open(a).convert('RGB').resize(size, Image.LANCZOS), (0, 0))
    canvas.paste(Image.open(b).convert('RGB').resize(size, Image.LANCZOS), (size[0] + 16, 0))
    name = f'par-{i + 1:02d}.jpg'
    canvas.save(out / name, quality=88)
    key.append({'par': name, 'nosso': 'esquerda' if left_is_ours else 'direita', 'frame': frame.name, 'referencia': ref.name})
(run / 'chave-cega.json').write_text(json.dumps(key, ensure_ascii=False, indent=1), encoding='utf-8')
print(f'{len(key)} pares em {out}')
