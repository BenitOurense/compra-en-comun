/* Item-level transaction patches preserve simultaneous edits by other family members. */
'use strict';
(function(root){
 function apply(data,operation){const items=Array.isArray(data.items)?data.items:[];switch(operation.type){
 case 'rename':return {name:operation.name};
 case 'add':if(items.some(i=>i.id===operation.item.id))return {items};if(items.length>=500)throw Error('La lista admite hasta 500 productos.');return {items:[...items,operation.item]};
 case 'toggle':return {items:items.map(i=>i.id===operation.id?{...i,done:operation.done}:i)};
 case 'remove':{const ids=new Set(operation.ids);return {items:items.filter(i=>!ids.has(i.id))};}
 default:throw Error('Cambio no reconocido.');}}
 root.ListMutations={apply};
})(globalThis);
