/* Price references are separate from product and allergy facts. No inferred prices. */
'use strict';
(function(root){
 const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/\s+/g,' ');
 const key=uid=>'marketsinc-prices-v1-'+encodeURIComponent(uid||'signed-out');
 const gtin=value=>String(value||'').padStart(14,'0');
 function safeUrl(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.href:'';}catch{return '';}}
 function amount(value){const text=String(value).trim().replace(',','.');if(!/^\d+(?:\.\d{1,2})?$/.test(text))return null;const cents=Math.round(Number(text)*100);return cents>0&&cents<=10000000?cents:null;}
 function sanitize(o){
  if(!o||typeof o!=='object')throw Error('Ficha de precio no válida.');
  const name=String(o.name||'').trim().slice(0,160),market=String(o.market||'').trim().slice(0,60),pack=String(o.pack||'').trim().slice(0,80),price=amount(o.price),date=Date.parse(o.observedAt);
  if(!name||!market||!pack||price===null||!Number.isFinite(date)||date>Date.now()+300000)throw Error('Cada precio necesita producto, supermercado, formato, importe positivo y fecha válida.');
  const code=ProductCatalog.validCode(String(o.code||''))?String(o.code):'';
  return {id:String(o.id||[market,code||name,pack].join('|')).slice(0,260),name,market,pack,price:price/100,code,observedAt:new Date(date).toISOString(),sourceUrl:safeUrl(o.sourceUrl),scope:String(o.scope||'Precio anotado por ti').slice(0,180),origin:o.origin==='public'?'public':'personal'};
 }
 function read(uid){try{const d=JSON.parse(localStorage.getItem(key(uid))||'{}');return {offers:Array.isArray(d.offers)?d.offers.map(sanitize):[],links:d.links&&typeof d.links==='object'&&!Array.isArray(d.links)?d.links:{},quantities:d.quantities&&typeof d.quantities==='object'&&!Array.isArray(d.quantities)?d.quantities:{}};}catch{return {offers:[],links:{},quantities:{}};}}
 function write(uid,state){if(!uid)throw Error('Inicia sesión para guardar precios.');localStorage.setItem(key(uid),JSON.stringify(state));}
 function importOffers(uid,input){const rows=Array.isArray(input)?input:input?.offers;if(!Array.isArray(rows)||rows.length>10000)throw Error('El catálogo debe contener hasta 10.000 precios.');const clean=rows.map(sanitize),d=read(uid),map=new Map(d.offers.map(o=>[o.id,o]));for(const o of clean)map.set(o.id,o);d.offers=[...map.values()];write(uid,d);return clean.length;}
 function setLink(uid,listId,itemId,market,id){const d=read(uid),k=JSON.stringify([listId,itemId,market]);if(id)d.links[k]=id;else delete d.links[k];write(uid,d);}
 function setQuantity(uid,listId,itemId,value){const quantity=Number(value);if(!Number.isInteger(quantity)||quantity<1||quantity>999)throw Error('La cantidad debe estar entre 1 y 999 envases.');const d=read(uid);d.quantities[JSON.stringify([listId,itemId])]=quantity;write(uid,d);}
 function catalogue(uid,publicOffers=[]){const map=new Map(publicOffers.map(sanitize).map(o=>[o.id,o]));for(const o of read(uid).offers)map.set(o.id,o);return [...map.values()];}
 function current(o,now=Date.now()){const age=now-Date.parse(o.observedAt);return age>=-300000&&age<=7*86400000;}
 function offerFor(state,offers,listId,item,market,now){const explicit=state.links[JSON.stringify([listId,item.id,market])];if(explicit)return offers.find(o=>o.id===explicit&&o.market===market&&current(o,now))||null;const code=item.product?.code;if(!ProductCatalog.validCode(code||''))return null;return offers.filter(o=>o.market===market&&o.code&&gtin(o.code)===gtin(code)&&current(o,now)).sort((a,b)=>Date.parse(b.observedAt)-Date.parse(a.observedAt))[0]||null;}
 function compare(uid,list,markets,publicOffers=[],now=Date.now()){
  const state=read(uid),offers=catalogue(uid,publicOffers),rows=list.items.map(item=>{const q=Number(state.quantities[JSON.stringify([list.id,item.id])]),quantity=Number.isInteger(q)&&q>0&&q<=999?q:1;return {item,quantity,offers:Object.fromEntries(markets.map(m=>[m,offerFor(state,offers,list.id,item,m,now)]))};});
  const common=rows.filter(r=>markets.every(m=>r.offers[m]));
  const totals=markets.map(m=>{const found=rows.filter(r=>r.offers[m]);return {market:m,covered:found.length,count:rows.length,totalCents:found.reduce((sum,r)=>sum+Math.round(r.offers[m].price*100)*r.quantity,0),commonCents:common.reduce((sum,r)=>sum+Math.round(r.offers[m].price*100)*r.quantity,0),complete:rows.length>0&&found.length===rows.length};});
  const complete=totals.filter(t=>t.complete);const formatsMatch=rows.every(r=>{const values=markets.map(m=>r.offers[m]).filter(Boolean);return values.length<2||new Set(values.map(o=>norm(o.pack))).size===1;});const cheapest=formatsMatch&&complete.length===markets.length&&markets.length>=2?[...complete].sort((a,b)=>a.totalCents-b.totalCents)[0].market:null;
  return {rows,totals,cheapest,formatsMatch,commonCount:common.length};
 }
 function csv(result,markets){const cell=v=>{let text=String(v??'');if(/^[\s]*[=+@-]/.test(text))text="'"+text;return '"'+text.replace(/"/g,'""')+'"';};return '\ufeff'+[['Producto','Cantidad',...markets.flatMap(m=>[m+' · €/envase',m+' · formato',m+' · fecha',m+' · fuente'])],...result.rows.map(r=>[r.item.name,r.quantity,...markets.flatMap(m=>{const o=r.offers[m];return o?[o.price.toFixed(2).replace('.',','),o.pack,o.observedAt,o.sourceUrl||o.scope]:['','','',''];})])].map(r=>r.map(cell).join(';')).join('\r\n');}
 root.ShopPrices={norm,safeUrl,amount,sanitize,read,importOffers,setLink,setQuantity,catalogue,current,compare,csv};
})(globalThis);
