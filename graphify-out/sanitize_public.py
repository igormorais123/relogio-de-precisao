from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parent.parent
MAP=ROOT/'graphify-out'
ARCH=ROOT/'.planning/architecture'

def clean(value):
    if isinstance(value,dict): return {clean(k):clean(v) for k,v in value.items()}
    if isinstance(value,list): return [clean(v) for v in value]
    if not isinstance(value,str): return value
    # Keep source paths relative; installed toolchain locations are not project evidence.
    for prefix in (str(ROOT),ROOT.as_posix()):
        value=value.replace(prefix+'\\','').replace(prefix+'/','').replace(prefix,'.')
    if re.match(r'^[A-Za-z]:[\\/]',value):
        return 'local-toolchain/'+re.split(r'[\\/]',value)[-1]
    return value

for p in [MAP/'health.json',MAP/'snapshot.json',MAP/'cost.json',*ARCH.glob('*validation.json'),*ARCH.glob('*delivery.json'),ARCH/'check.json']:
    if p.exists():
        d=json.loads(p.read_text(encoding='utf-8-sig'))
        d=clean(d)
        p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
p=MAP/'GRAPH_REPORT.md'
if p.exists():p.write_text(clean(p.read_text(encoding='utf-8')),encoding='utf-8')
# Private .graphify* files and cache remain local and are excluded by the map's .gitignore.
print('Public reports use relative paths; source files and artifact hashes are unchanged.')
