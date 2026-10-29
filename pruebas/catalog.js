/* Open Food Facts data: ODbL; images: CC BY-SA. No allergy certification is inferred. */
'use strict';
(function(root){
 const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es').trim();
 const clean=(s,max=160)=>typeof s==='string'?s.trim().slice(0,max):'';
 const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))||fallback;}catch{return fallback;}};
 const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}};
 const key='compra-en-comun-products-cache-v1', queryKey='compra-en-comun-search-cache-v2';
 let products=read(key,[]);if(!Array.isArray(products))products=[];
 let queries=read(queryKey,{});if(!queries||typeof queries!=='object'||Array.isArray(queries))queries={};
 const safeImage=url=>{try{const u=new URL(url);return u.protocol==='https:'&&/(^|\.)openfoodfacts\.org$/.test(u.hostname)?u.href:'';}catch{return '';}};
 function sanitize(p){if(!p||typeof p!=='object')return null;const name=clean(p.name,100);if(!name)return null;return {name,brand:clean(p.brand),code:/^\d{8,14}$/.test(p.code||'')?String(p.code):'',image:safeImage(p.image),allergens:clean(p.allergens,500),traces:clean(p.traces,500),stores:clean(p.stores,300),source:p.source==='Open Food Facts'?'Open Food Facts':'',fetchedAt:Number(p.fetchedAt)||0};}
 products=products.map(sanitize).filter(Boolean).slice(-1500);
 const identity=p=>p.code||norm(p.name)+'|'+norm(p.brand);
 function remember(rows){const map=new Map(products.map(p=>[identity(p),p]));for(const row of rows){const p=sanitize(row);if(p){map.delete(identity(p));map.set(identity(p),p);}}products=[...map.values()].slice(-1500);return write(key,products);}
 function search(query,extra=[],markets=[]){const words=norm(query).split(/\s+/).filter(Boolean);if(!words.length)return [];const map=new Map();for(const row of [...products].reverse().concat(extra)){const p=sanitize(typeof row==='string'?{name:row}:row);if(p&&!map.has(identity(p)))map.set(identity(p),p);}return [...map.values()].filter(p=>{const text=norm([p.name,p.brand,p.code].join(' '));return words.every(w=>text.includes(w));}).map((p,i)=>({p,i,score:(norm(p.name).startsWith(norm(query))?4:0)+(markets.some(m=>norm(p.stores).includes(norm(m)))?2:0)})).sort((a,b)=>b.score-a.score||a.i-b.i).slice(0,12).map(x=>x.p);}
 function fromOFF(p){return sanitize({name:p.product_name_es||p.product_name,brand:p.brands,code:p.code,image:p.image_front_small_url,allergens:p.allergens,traces:p.traces,stores:p.stores,source:'Open Food Facts',fetchedAt:Date.now()});}
 function validCode(value){if(!/^(\d{8}|\d{12}|\d{13}|\d{14})$/.test(value))return false;const digits=[...value].map(Number);const check=digits.pop();let sum=0;for(let i=digits.length-1,j=0;i>=0;i--,j++)sum+=digits[i]*(j%2===0?3:1);return (10-sum%10)%10===check;}
 const fields='code,product_name,product_name_es,brands,image_front_small_url,allergens,traces,stores';
 let busy=false;
 async function online(query){query=clean(query,100);const barcode=/^\d+$/.test(query);if(barcode&&!validCode(query))throw Error('El código no tiene un formato EAN/UPC válido. Comprueba los números.');if(!barcode&&query.length<2)throw Error('Escribe al menos dos letras.');const q=(barcode?'ean:':'text:')+norm(query);const saved=queries[q];if(saved&&Array.isArray(saved.products)&&Date.now()-saved.time<86400000)return {products:saved.products.map(sanitize).filter(Boolean),cached:true};
 if(barcode){const hit=products.find(p=>p.code===query&&Date.now()-p.fetchedAt<7*86400000);if(hit)return {products:[hit],cached:true};}
 if(busy)throw Error('Ya hay una consulta en curso.');const rateKey='compra-en-comun-off-last-'+(barcode?'ean':'text');let last=0;try{last=Number(localStorage.getItem(rateKey))||0;}catch{}const delay=barcode?4500:7000;if(Date.now()-last<delay)throw Error('Espera unos segundos antes de consultar de nuevo.');
 busy=true;try{try{localStorage.setItem(rateKey,String(Date.now()));}catch{}const url=new URL(barcode?'https://world.openfoodfacts.org/api/v2/product/'+query+'.json':'https://world.openfoodfacts.org/cgi/search.pl');url.searchParams.set('fields',fields);if(!barcode){for(const [k,v] of Object.entries({search_terms:query,search_simple:'1',action:'process',json:'1',page_size:'24',lc:'es',tagtype_0:'countries',tag_contains_0:'contains',tag_0:'spain'}))url.searchParams.set(k,v);}
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);let data;try{const response=await fetch(url,{signal:controller.signal,credentials:'omit'});if(!response.ok)throw Error('El catálogo no está disponible ('+response.status+'). Inténtalo más tarde.');data=await response.json();}finally{clearTimeout(timer);}
 if(!barcode&&!Array.isArray(data.products))throw Error('El catálogo ha devuelto una respuesta no válida.');const rows=(barcode?(data.status===1?[{...data.product,code:query}]:[]):data.products).map(fromOFF).filter(Boolean);remember(rows);queries[q]={time:Date.now(),products:rows};queries=Object.fromEntries(Object.entries(queries).sort((a,b)=>b[1].time-a[1].time).slice(0,40));write(queryKey,queries);return {products:rows,cached:false};
 }catch(e){if(e.name==='AbortError')throw Error('El catálogo tarda demasiado. Puedes seguir añadiendo productos a mano.');if(e instanceof TypeError)throw Error('No se pudo conectar con Open Food Facts. Siguen disponibles las sugerencias locales.');throw e;}finally{busy=false;}}
 root.ProductCatalog={norm,sanitize,search,remember,online,validCode,fromOFF};
})(globalThis);
