/* Personal preferences and purchase journal are account-scoped, on this device only. */
'use strict';
(function(root){
 const key=uid=>'compra-en-comun-personal-v1-'+encodeURIComponent(uid);
 function read(uid){try{const d=JSON.parse(localStorage.getItem(key(uid))||'{}');return {favoriteList:typeof d.favoriteList==='string'?d.favoriteList:null,favorites:Array.isArray(d.favorites)?d.favorites.map(ProductCatalog.sanitize).filter(Boolean):[],history:Array.isArray(d.history)?d.history.filter(r=>r&&typeof r.id==='string'&&Array.isArray(r.items)):[]};}catch{return {favoriteList:null,favorites:[],history:[]};}}
 function write(uid,data){localStorage.setItem(key(uid),JSON.stringify(data));}
 const identity=p=>p.code?'ean:'+p.code:'name:'+ProductCatalog.norm(p.name)+'|'+ProductCatalog.norm(p.brand);
 function favoriteList(uid){return read(uid).favoriteList;}
 function setFavoriteList(uid,id){const data=read(uid);data.favoriteList=id;write(uid,data);}
 function favorites(uid){return read(uid).favorites;}
 function isFavorite(uid,p){return favorites(uid).some(x=>identity(x)===identity(p));}
 function toggleProduct(uid,p){p=ProductCatalog.sanitize(p);if(!p)throw Error('Producto no válido.');const data=read(uid),id=identity(p),present=data.favorites.some(x=>identity(x)===id);data.favorites=present?data.favorites.filter(x=>identity(x)!==id):[...data.favorites,p];write(uid,data);return !present;}
 function stagePurchase(uid,record){const data=read(uid);if(data.history.some(r=>r.id===record.id))return;data.history=[{...record,status:'pending'},...data.history];write(uid,data);}
 function finishPurchase(uid,id){const data=read(uid),entry=data.history.find(r=>r.id===id);if(!entry)throw Error('Falta el registro previo de la compra.');entry.status='confirmed';write(uid,data);}
 function cancelPurchase(uid,id){const data=read(uid);data.history=data.history.filter(r=>r.id!==id||r.status==='confirmed');write(uid,data);}
 root.FamilyMemory={favoriteList,setFavoriteList,favorites,isFavorite,toggleProduct,stagePurchase,finishPurchase,cancelPurchase,history:uid=>read(uid).history,identity};
})(globalThis);
