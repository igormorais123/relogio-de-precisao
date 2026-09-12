from pathlib import Path
from html.parser import HTMLParser
from datetime import datetime, timezone
import json,re,collections,runpy
from graphify.detect import detect,save_manifest
from graphify.extract import extract
from graphify.build import build_from_json
from graphify.cluster import cluster,score_all
from graphify.analyze import god_nodes,surprising_connections,suggest_questions
from graphify.report import generate
from graphify.export import to_json
from graphify.diagnostics import diagnose_extraction,format_diagnostic_report
p=Path(__file__).resolve().parent.parent;o=p/'graphify-out'
d=detect(p)
a=extract([Path(f) for f in d['files']['code']],cache_root=o,root=p,parallel=False)
# Resolve Graphify references omitted as target nodes: imports and exported constants.
ids={n['id'] for n in a['nodes']}
for e in a['edges']:
 tid=e['target']
 if tid in ids: continue
 f=p/e['source_file']; line=int(re.search(r'\d+',e.get('source_location','L1')).group()); text=f.read_text(encoding='utf-8').splitlines()[line-1]
 if tid.startswith('ref_'):
  m=re.search(r"from\s+['\"]([^'\"]+)",' '.join(f.read_text(encoding='utf-8').splitlines()[line-1:line+12]))
  if m:
   a['nodes'].append({'id':tid,'label':m.group(1),'file_type':'code','source_file':e['source_file'],'source_location':e['source_location'],'_origin':'import-reference','external':True});ids.add(tid)
 else:
  for cf in d['files']['code']:
   rel=str(Path(cf).relative_to(p)).replace('\\','/'); base=re.sub(r'[^a-z0-9]+','_',str(Path(rel).with_suffix('')).lower()).strip('_')
   for no,txt in enumerate(Path(cf).read_text(encoding='utf-8').splitlines(),1):
    m=re.match(r'export\s+const\s+(\w+)\s*=',txt)
    if m and base+'_'+m.group(1).lower()==tid:
     a['nodes'].append({'id':tid,'label':m.group(1),'file_type':'code','source_file':rel,'source_location':'L'+str(no),'_origin':'export-constant'});ids.add(tid)
# HTML is parsed structurally (script/link references), without semantic LLM calls.
class Links(HTMLParser):
 def handle_starttag(self,tag,attrs):
  z=dict(attrs);v=z.get('src') if tag=='script' else z.get('href') if tag=='link' else None
  if not v or not v.startswith('/src/'): return
  f=v.lstrip('/'); tid=next((n['id'] for n in a['nodes'] if n.get('source_file')==f and n.get('label')==Path(f).name),None)
  if not tid:
   tid='html_resource_'+re.sub(r'\W+','_',f);a['nodes'].append({'id':tid,'label':Path(f).name,'file_type':'code','source_file':f,'source_location':'L1','_origin':'html-parser'})
  a['edges'].append({'source':'entry_html','target':tid,'relation':'loads','confidence':'EXTRACTED','source_file':'index.html','source_location':'L'+str(self.getpos()[0]),'weight':1.0,'_origin':'html-parser'})
a['nodes'].append({'id':'entry_html','label':'index.html','file_type':'code','source_file':'index.html','source_location':'L1','_origin':'html-parser'})
Links().feed((p/'index.html').read_text(encoding='utf-8'))
(o/'.graphify_extract.json').write_text(json.dumps(a,ensure_ascii=False),encoding='utf-8')
(o/'.graphify_detect.json').write_text(json.dumps(d,ensure_ascii=False),encoding='utf-8')
G=build_from_json(a,root=str(p),directed=True)
if not G.number_of_nodes():raise SystemExit('empty graph')
c=cluster(G);co=score_all(G,c)
labels={}
for cid,ids in c.items():
 files=[G.nodes[n].get('source_file','') for n in ids];dominant=collections.Counter('/'.join(f.split('/')[:2]) for f in files if f).most_common(1)
 labels[cid]=(dominant[0][0] if dominant else 'Referências')+' · '+str(cid)
if not to_json(G,c,str(o/'graph.json')):raise SystemExit('shrink guard')
exported=json.loads((o/'graph.json').read_text(encoding='utf-8'));exported['edges']=exported.get('links',[]);(o/'graph.json').write_text(json.dumps(exported,ensure_ascii=False,indent=2),encoding='utf-8')
health=diagnose_extraction(a,directed=True,root=str(p));gods=god_nodes(G);sur=surprising_connections(G,c);q=suggest_questions(G,c,labels)
r=generate(G,c,co,labels,gods,sur,d,{'input':0,'output':0},str(p),suggested_questions=q)
r+='\n\n## Escopo local e integridade\n\nExtração AST de JavaScript e parser estrutural de index.html; CSS é nó de recurso, sem extração de seletores. Não houve API nem extração semântica paga. Dependências, public, dist, ferramentas históricas, backups, revisões e mapas gerados foram excluídos. Relações AST e HTML são EXTRACTED; ausência de ligação não prova ausência de dependência em tempo de execução.\n\n'+format_diagnostic_report(health)+'\n'
r = r.replace('## Import Cycles', '## Ciclos sugeridos pelo extrator (não verificados como imports)' + chr(10) + chr(10) + 'Limitação: a agregação de símbolos pode gerar ciclos espúrios. Post.js e Studio.js não importam App.js; as relações abaixo não comprovam dependências circulares.')
(o/'GRAPH_REPORT.md').write_text(r,encoding='utf-8')
(o/'.graphify_labels.json').write_text(json.dumps({str(k):v for k,v in labels.items()},ensure_ascii=False),encoding='utf-8')
(o/'health.json').write_text(json.dumps(health,ensure_ascii=False,indent=2),encoding='utf-8')
(o/'snapshot.json').write_text(json.dumps({'updated_at':datetime.now(timezone.utc).isoformat(),'nodes':G.number_of_nodes(),'edges':G.number_of_edges(),'communities':len(c),'files':d['total_files'],'sources':{str(Path(f).relative_to(p)):Path(f).stat().st_mtime_ns for fs in d['files'].values() for f in fs}},ensure_ascii=False,indent=2),encoding='utf-8')
(o/'cost.json').write_text(json.dumps({'input_tokens':0,'output_tokens':0,'paid_api_calls':0,'method':'AST and HTMLParser'},indent=2),encoding='utf-8')
# Public artifacts are sanitized after extraction; local cache stays ignored.
runpy.run_path(str(o/'sanitize_public.py'))
print(json.dumps({'nodes':G.number_of_nodes(),'edges':G.number_of_edges(),'communities':len(c),'health':health},ensure_ascii=False))
