/* Personal preferences and purchase journal are account-scoped, on this device only. */
'use strict';
(function(root){
 const LIST_ICONS=['🏠','🛒','🔥','👥','🌴','💗','🎉','🏕️','🧹','👶','🐾','🎁','🍎','🥩','🧺','🍽️'];
 const key=uid=>'compra-en-comun-personal-v1-'+encodeURIComponent(uid);
 function read(uid){try{const d=JSON.parse(localStorage.getItem(key(uid))||'{}');return {icons:d.icons&&typeof d.icons==='object'&&!Array.isArray(d.icons)?Object.fromEntries(Object.entries(d.icons).filter(([k,v])=>LIST_ICONS.includes(v))):{},favoriteList:typeof d.favoriteList==='string'?d.favoriteList:null,favorites:Array.isArray(d.favorites)?d.favorites.map(ProductCatalog.sanitize).filter(Boolean):[],history:Array.isArray(d.history)?d.history.filter(r=>r&&typeof r.id==='string'&&Array.isArray(r.items)):[]};}catch{return {icons:{},favoriteList:null,favorites:[],history:[]};}}
 function write(uid,data){localStorage.setItem(key(uid),JSON.stringify(data));}
 const identity=p=>p.code?'ean:'+p.code:'name:'+ProductCatalog.norm(p.name)+'|'+ProductCatalog.norm(p.brand);
 function favoriteList(uid){return read(uid).favoriteList;}
 function setFavoriteList(uid,id){if(typeof id!=='string'||!id)throw Error('Debe haber una lista favorita.');const data=read(uid);data.favoriteList=id;write(uid,data);}
 function resolveFavorite(uid,ids,ready=true){const current=favoriteList(uid);if(ids.includes(current))return current;if(current&&!ready)return null;const next=ids[0]||null;if(next)setFavoriteList(uid,next);return next;}
 function setListIcon(uid,id,icon){if(!LIST_ICONS.includes(icon))throw Error('Icono no válido.');const data=read(uid);data.icons={...data.icons,[id]:icon};write(uid,data);}
 function listIcon(uid,id){return read(uid).icons[id]||null;}
 function favorites(uid){return read(uid).favorites;}
 function isFavorite(uid,p){return favorites(uid).some(x=>identity(x)===identity(p));}
 function toggleProduct(uid,p){p=ProductCatalog.sanitize(p);if(!p)throw Error('Producto no válido.');const data=read(uid),id=identity(p),present=data.favorites.some(x=>identity(x)===id);data.favorites=present?data.favorites.filter(x=>identity(x)!==id):[...data.favorites,p];write(uid,data);return !present;}
 function stagePurchase(uid,record){const data=read(uid);if(data.history.some(r=>r.id===record.id))return;data.history=[{...record,status:'pending'},...data.history];write(uid,data);}
 function finishPurchase(uid,id){const data=read(uid),entry=data.history.find(r=>r.id===id);if(!entry)throw Error('Falta el registro previo de la compra.');entry.status='confirmed';write(uid,data);}
 function cancelPurchase(uid,id){const data=read(uid);data.history=data.history.filter(r=>r.id!==id||r.status==='confirmed');write(uid,data);}
 root.FamilyMemory={LIST_ICONS,listIcon,setListIcon,resolveFavorite,favoriteList,setFavoriteList,favorites,isFavorite,toggleProduct,stagePurchase,finishPurchase,cancelPurchase,history:uid=>read(uid).history,identity};
})(globalThis);
