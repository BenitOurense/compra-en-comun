/* Item-level transaction patches preserve simultaneous edits by other family members. */
'use strict';
(function(root){
 const norm=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es').trim().replace(/\s+/g,' ');
 function identity(item){const p=item?.product,code=String(p?.code||'').trim();if(/^(\d{8}|\d{12}|\d{13}|\d{14})$/.test(code))return 'ean:'+code.padStart(14,'0');const name=norm(item?.name);if(!name)return null;return (p?'product:':'generic:')+name+(p?'|'+norm(p.brand):'');}
 function findDuplicate(items,item){const key=identity(item);return items.find(i=>(item.id!=null&&i.id===item.id)||(key!==null&&identity(i)===key));}
 function deduplicate(items){const out=[],seen=new Map();for(const item of items){const key=identity(item);if(key===null||!seen.has(key)){if(key!==null)seen.set(key,out.length);out.push(item);continue;}const at=seen.get(key),first=out[at];const product=item.product&&(Number(item.product.fetchedAt)||0)>(Number(first.product?.fetchedAt)||0)?item.product:first.product;out[at]={...first,done:!!(first.done||item.done)};if(product)out[at].product=product;}return out;}
 function apply(data,operation){const items=Array.isArray(data.items)?data.items:[];switch(operation.type){
 case 'rename':return {name:operation.name};
 case 'deduplicate':return {items:deduplicate(items)};
 case 'add':{const unique=deduplicate(items);if(findDuplicate(unique,operation.item))return {items:unique};if(unique.length>=500)throw Error('La lista admite hasta 500 productos.');return {items:[...unique,operation.item]};}
 case 'toggle':return {items:items.map(i=>i.id===operation.id?{...i,done:operation.done}:i)};
 case 'remove':{const ids=new Set(operation.ids);return {items:items.filter(i=>!ids.has(i.id))};}
 default:throw Error('Cambio no reconocido.');}}
 root.ListMutations={identity,findDuplicate,deduplicate,apply};
})(globalThis);
