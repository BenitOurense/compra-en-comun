#!/usr/bin/env python3
"""Build a compact Spanish catalogue from the official OFF bulk TSV export.
Streams gzip input; never uses the search API. Writes only after a full successful scan.
"""
import argparse, csv, gzip, hashlib, heapq, io, json, os, shutil, tempfile
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen

DEFAULT_SOURCE='https://static.openfoodfacts.org/data/en.openfoodfacts.org.products.csv.gz'
ALIASES={'en:biscuits':'galletas','en:milks':'leche','en:waters':'agua','en:breads':'pan','en:rice':'arroz','en:eggs':'huevos','en:pastas':'pasta','en:chocolates':'chocolate'}
def valid_code(code):
    return code.isdigit() and len(code) in (8,12,13,14) and (10-sum(int(c)*(3 if i%2==0 else 1) for i,c in enumerate(reversed(code[:-1]))))%10==int(code[-1])
def text(value,limit=500):
    return str(value or '').strip()[:limit]
def number(value):
    try:return int(float(value or 0))
    except (ValueError,TypeError):return 0
def compact(row):
    if 'en:spain' not in [x.strip().lower() for x in text(row.get('countries_tags'),3000).split(',')]:return None
    code=text(row.get('code'),20);name=text(row.get('product_name_es') or row.get('product_name'),100)
    if not valid_code(code) or not name or text(row.get('obsolete')).lower() in ('true','1'):return None
    image=text(row.get('image_front_small_url') or row.get('image_small_url') or row.get('image_url'),500);parsed=urlparse(image)
    if parsed.scheme!='https' or not (parsed.hostname or '').endswith('.openfoodfacts.org'):image=''
    tags=[x.strip() for x in text(row.get('categories_tags'),3000).split(',')]
    terms=' '.join([text(row.get('categories'),700),*[ALIASES[t] for t in tags if t in ALIASES]])
    return {'name':name,'brand':text(row.get('brands'),160),'code':code,'image':image,'allergens':text(row.get('allergens') or row.get('allergens_tags') or row.get('allergens_en')),'traces':text(row.get('traces') or row.get('traces_tags') or row.get('traces_en')),'labels':text(row.get('labels_tags') or row.get('labels_en') or row.get('labels'),1000),'stores':text(row.get('stores'),300),'terms':text(terms,800)}
def collect(stream,maximum=50000):
    csv.field_size_limit(16*1024*1024);reader=csv.DictReader(stream,delimiter='\t')
    if not {'code','product_name','countries_tags'}.issubset(reader.fieldnames or []):raise ValueError('No es una exportación TSV de OFF con los campos requeridos')
    heap=[];seen=set();scanned=matched=0
    for row in reader:
        scanned+=1
        if scanned%250000==0:print(f'Escaneados {scanned}; productos de España {matched}',flush=True)
        p=compact(row)
        if not p or p['code'] in seen:continue
        seen.add(p['code']);matched+=1
        score=(number(row.get('unique_scans_n'))*10+(5 if row.get('lang')=='es' else 0),number(row.get('last_modified_t')))
        entry=(score,p['code'],p)
        if len(heap)<maximum:heapq.heappush(heap,entry)
        elif entry[:2]>heap[0][:2]:heapq.heapreplace(heap,entry)
    return [entry[2] for entry in sorted(heap,reverse=True)],{'scanned':scanned,'matchedSpain':matched}
def write_catalog(products,output,metadata,chunk_size=1000):
    if not products:raise ValueError('No se publica un catálogo vacío')
    output=Path(output);output.parent.mkdir(parents=True,exist_ok=True)
    stage=Path(tempfile.mkdtemp(prefix='.catalog-stage-',dir=output.parent));backup=None
    try:
        shards=[]
        for start in range(0,len(products),chunk_size):
            batch=products[start:start+chunk_size];raw=(json.dumps({'products':batch},ensure_ascii=False,separators=(',',':'))+'\n').encode();digest=hashlib.sha256(raw).hexdigest();name='products-'+digest[:16]+'.json';(stage/name).write_bytes(raw)
            shards.append({'path':name,'count':len(batch),'bytes':len(raw),'sha256':digest})
        version=hashlib.sha256(''.join(s['sha256'] for s in shards).encode()).hexdigest()
        manifest={**metadata,'source':'Open Food Facts','license':'ODbL','imageLicense':'CC BY-SA','schema':1,'version':version,'count':len(products),'bytes':sum(s['bytes'] for s in shards),'shards':shards}
        (stage/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
        if output.exists():backup=output.with_name(output.name+'.previous');shutil.rmtree(backup,ignore_errors=True);os.replace(output,backup)
        try:os.replace(stage,output)
        except BaseException:
            if backup and backup.exists():os.replace(backup,output)
            raise
        if backup:shutil.rmtree(backup)
        return manifest
    finally:
        if stage.exists():shutil.rmtree(stage)
def main():
    parser=argparse.ArgumentParser();parser.add_argument('--input',help='Exportación TSV o TSV.gz ya descargada');parser.add_argument('--source-url',default=DEFAULT_SOURCE);parser.add_argument('--output',default=str(Path(__file__).resolve().parents[1]/'catalogue'));parser.add_argument('--max-products',type=int,default=50000);parser.add_argument('--min-products',type=int,default=1000);args=parser.parse_args()
    if not 1<=args.max_products<=100000:parser.error('max-products debe estar entre 1 y 100000')
    if args.input:raw=open(args.input,'rb');compressed=args.input.endswith('.gz');source='OFF bulk export (local file)'
    else:
        if args.source_url!=DEFAULT_SOURCE:parser.error('La descarga automática solo admite la exportación oficial configurada')
        raw=urlopen(Request(args.source_url,headers={'User-Agent':'CompraEnComun-Catalog/0.36 (https://github.com/BenitOurense/compra-en-comun)'}),timeout=120);compressed=True;source=args.source_url
    with raw:
        with io.TextIOWrapper(gzip.GzipFile(fileobj=raw) if compressed else raw,encoding='utf-8-sig',newline='') as stream:products,stats=collect(stream,args.max_products)
    if len(products)<args.min_products:raise SystemExit(f'Exportación incompleta: {len(products)} fichas. Se conserva el catálogo anterior.')
    output=Path(args.output);old=output/'manifest.json'
    if old.exists() and len(products)<json.loads(old.read_text()).get('count',0)*.7:raise SystemExit('El catálogo cae más de un 30%; se conserva la versión anterior.')
    result=write_catalog(products,output,{'sourceUrl':source,'capturedAt':datetime.now(timezone.utc).isoformat(),'selection':'Productos comercializados en España; máximo por popularidad y fecha de actualización',**stats})
    print(f"Catálogo preparado: {result['count']} productos, {result['bytes']} bytes; versión {result['version'][:12]}")
if __name__=='__main__':main()
