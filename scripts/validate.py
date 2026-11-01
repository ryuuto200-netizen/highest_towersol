import json
from pathlib import Path
r=Path(__file__).resolve().parents[1]
d=json.loads((r/'data.json').read_text())['items']
assert len(d)==100
assert len({x['id'] for x in d})==100
assert len({x['name'] for x in d})==100
assert all(d[i]['height']>=d[i+1]['height'] for i in range(99))
assert d[0]['height']==634 and d[1]['height']==333
for i,x in enumerate(d):
 assert x['order']==i+1
 assert x['rank']==next(j+1 for j,y in enumerate(d) if y['height']==x['height'])
 assert x['sources'] and x['description'] and x['heightBasis']
 assert x['height']>0 and len(x['description'])>10
 for s in x['sources']:assert s['url'].startswith('https://')
for p in ['index.html','app.js','models.js','style.css','vendor/three.module.js']:
 assert (r/p).is_file()
print('PASS: 100 unique entries, descending heights, ties, sources, descriptions, local dependencies')
