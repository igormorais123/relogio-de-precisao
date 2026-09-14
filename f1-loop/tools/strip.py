# Contact strip for camera review: py tools/strip.py shots/<tag> [--cols 4] [--width 480] [--out nome.jpg] [--prefix d]
# Tiles every <prefix>-<p>.jpg in progress order with its p written in the corner,
# plus guide lines at 42% and 92% of the width (the text column and the chapter dots).
import argparse, re
from pathlib import Path
from PIL import Image, ImageDraw

ap = argparse.ArgumentParser()
ap.add_argument('run')
ap.add_argument('--cols', type=int, default=4)
ap.add_argument('--width', type=int, default=480)
ap.add_argument('--out', default=None)
ap.add_argument('--prefix', default='d')
ap.add_argument('--guides', action='store_true')
a = ap.parse_args()
run = Path(a.run)
frames = []
for f in run.glob(f'{a.prefix}-*.jpg'):
    m = re.match(rf'{a.prefix}-(\d+\.\d+)\.jpg$', f.name)
    if m: frames.append((float(m.group(1)), f))
frames.sort()
if not frames: raise SystemExit('nenhum quadro em ' + str(run))
first = Image.open(frames[0][1])
w = a.width; h = round(first.height * w / first.width)
rows = (len(frames) + a.cols - 1) // a.cols
sheet = Image.new('RGB', (a.cols * w + (a.cols - 1) * 6, rows * h + (rows - 1) * 6), (255, 255, 255))
for i, (p, f) in enumerate(frames):
    tile = Image.open(f).convert('RGB').resize((w, h), Image.LANCZOS)
    d = ImageDraw.Draw(tile)
    if a.guides:
        for g in (.42, .92): d.line([(w * g, 0), (w * g, h)], fill=(255, 220, 0), width=1)
    d.rectangle([0, 0, 58, 18], fill=(0, 0, 0))
    d.text((4, 3), f'p={p:.2f}', fill=(255, 255, 255))
    sheet.paste(tile, ((i % a.cols) * (w + 6), (i // a.cols) * (h + 6)))
out = Path(a.out) if a.out else run / f'tira-{a.prefix}.jpg'
sheet.save(out, quality=86)
print(out)
