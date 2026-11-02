/* Personal barcode records, scoped to the account on this device. */
'use strict';
(function(root){
 const key=uid=>'marketsinc-manual-products-v1-'+encodeURIComponent(uid||'signed-out');
 const code=value=>String(value||'').padStart(14,'0');
 function read(uid){try{const data=JSON.parse(localStorage.getItem(key(uid))||'[]');return Array.isArray(data)?data.filter(p=>p?.source==='Manual'&&ProductCatalog.validCode(p.code)).map(ProductCatalog.sanitize).filter(Boolean):[];}catch{return [];}}
 function save(uid,product){if(!uid)throw Error('Inicia sesión para guardar el producto.');if(!ProductCatalog.validCode(product.code))throw Error('El código no es válido.');const p=ProductCatalog.sanitize({...product,source:'Manual',image:'',allergens:'',traces:'',labels:'',fetchedAt:Date.now()});if(!p)throw Error('Escribe el nombre del producto.');const rows=read(uid).filter(old=>code(old.code)!==code(p.code));rows.push(p);localStorage.setItem(key(uid),JSON.stringify(rows));return p;}
 function remove(uid,value){localStorage.setItem(key(uid),JSON.stringify(read(uid).filter(p=>code(p.code)!==code(value))));}
 function find(uid,value){return read(uid).find(p=>code(p.code)===code(value))||null;}
 function choices(uid,value,official=[]){const manual=find(uid,value);return [...(manual?[manual]:[]),...official.filter(p=>p?.source!=='Manual'&&code(p.code)===code(value))];}
 root.ManualProducts={read,save,remove,find,choices};
})(globalThis);
