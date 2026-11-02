/* Barcode lookup and product entry stay inside the scanner screen. */
'use strict';
let scannerLookup=0,scannerResultCode='',scannerResultProducts=[];
function resetScannerResult(){scannerLookup++;scannerResultCode='';scannerResultProducts=[];$('scanner-results').replaceChildren();$('scanner-manual-form').hidden=true;$('scanner-manual-name').value='';$('scanner-manual-brand').value='';$('scanner-manual-open').hidden=true;$('scanner-refresh-product').hidden=true;}
async function addScannerProduct(product){
 const uid=currentAccount(),list=lists.find(l=>l.id===active);if(!uid||!list)return;
 const item={id:createId(),name:product.name,done:false,product:product};
 const existing=ListMutations.findDuplicate(list.items,item);
 if(existing){$('scanner-status').textContent='Ya está en '+list.name+': '+existing.name;const button=makeButton('Sustituir la ficha de este producto en la lista','secondary',async()=>{button.disabled=true;const updated={...list,items:list.items.map(old=>old.id===existing.id?{...old,name:product.name,product}:old)};const saved=await save(updated,null,{type:'replaceProduct',id:existing.id,name:product.name,product});if(currentAccount()!==uid)return;if(saved){const current=lists.find(l=>l.id===list.id)?.items.find(i=>i.id===existing.id);if(current){current.name=product.name;current.product=product;}if(active===list.id)renderItems();}$('scanner-status').textContent=saved?'Ficha sustituida sin duplicar el producto.':'No se ha podido sustituir la ficha.';button.disabled=false;});$('scanner-results').append(button);return;}
 if(list.items.length>=500){$('scanner-status').textContent='La lista admite hasta 500 productos.';return;}
 const request=scannerLookup,changed={...list,items:[...list.items,item]};
 const buttons=[...$('scanner-results').querySelectorAll('button')];buttons.forEach(b=>b.disabled=true);
 $('scanner-status').textContent='Guardando '+product.name+'…';
 const saved=await save(changed,null,{type:'add',item});
 if(currentAccount()!==uid)return;
 if(saved){const current=lists.find(l=>l.id===list.id);if(current&&!ListMutations.findDuplicate(current.items,item))current.items.push(item);if(active===list.id)renderItems();}
 if(request===scannerLookup&&$('scanner-dialog').open){$('scanner-status').textContent=saved?'Añadido a '+list.name+': '+product.name:'No se ha añadido. Puedes reintentarlo.';buttons.forEach(b=>b.disabled=false);}
}
function renderScannerChoices(){
 const root=$('scanner-results');root.replaceChildren();
 const manual=ManualProducts.find(currentAccount(),scannerResultCode),official=scannerResultProducts;
 const choices=ManualProducts.choices(currentAccount(),scannerResultCode,official);
 if(choices.length>1){const h=document.createElement('h3');h.textContent='Hay dos fichas para este código. Elige cuál añadir.';root.append(h);}
 for(const p of choices){const card=document.createElement('article');card.className='scanner-product-card';const title=document.createElement('h3');title.textContent=p.name;const meta=document.createElement('p');meta.textContent=[p.brand,p.code,p.source==='Manual'?'Ficha manual · esta cuenta y este móvil':'Open Food Facts'].filter(Boolean).join(' · ');const allergy=document.createElement('p');allergy.className='muted';allergy.textContent=p.source==='Manual'?'Alérgenos: sin información. Comprueba el envase.':p.allergens?'Alérgenos declarados: '+ProductCatalog.allergenText(p.allergens):'Alérgenos: sin información. Comprueba el envase.';card.append(title,meta,allergy,makeButton('Añadir '+(p.source==='Manual'?'ficha manual':'ficha del catálogo'),'',()=>addScannerProduct(p)));
  if(p.source==='Manual'){const remove=makeButton('Borrar ficha manual','danger',()=>{const confirm=document.createElement('div');confirm.className='scanner-delete-confirm';const note=document.createElement('p');note.textContent='Se borrará la ficha guardada en este móvil. Los productos ya añadidos a listas se conservan.';confirm.append(note,makeButton('Confirmar borrado','danger',()=>{try{ManualProducts.remove(currentAccount(),scannerResultCode);renderScannerChoices();$('scanner-status').textContent='Ficha manual borrada.';}catch{$('scanner-status').textContent='No se pudo borrar la ficha manual.';}}),makeButton('Cancelar','secondary',()=>confirm.remove()));remove.disabled=true;card.append(confirm);});card.append(remove);}
  root.append(card);
 }
 $('scanner-manual-open').hidden=!!manual||official.length>0;
 if(!choices.length){$('scanner-manual-form').hidden=false;}
}
async function lookupScannedCode(code,{refresh=false}={}){
 stopScanner();resetScannerResult();const request=scannerLookup,uid=currentAccount(),listId=active;
 scannerResultCode=code;$('scanner-refresh-product').hidden=false;$('barcode-input').value=code;$('scanner-video').hidden=true;$('scanner-resume').hidden=false;$('scanner-dialog').dataset.mode='result';
 const current=()=>request===scannerLookup&&currentAccount()===uid&&active===listId&&$('scanner-dialog').open;
 $('scanner-status').textContent='Código leído: '+code+'. Consultando el catálogo…';
 const manual=ManualProducts.find(uid,code);if(manual)renderScannerChoices();
 try{const result=await ProductCatalog.online(code,{refresh});if(!current())return;scannerResultProducts=result.products;$('scanner-status').textContent='Código leído: '+code+'. '+(result.products.length?(result.stale?'Mostrando la última ficha guardada; no se pudo actualizar.':manual?'También existe una ficha en el catálogo. Elige cuál usar.':'Producto encontrado.'):manual?'Se conserva tu ficha manual.':'Producto no encontrado. Puedes registrarlo aquí.');}
 catch(error){if(!current())return;$('scanner-status').textContent='Código leído: '+code+'. No se ha podido comprobar el catálogo. '+error.message+' Puedes guardar una ficha manual.';}
 if(current())renderScannerChoices();
}
$('scanner-manual-open').onclick=()=>{$('scanner-manual-form').hidden=false;};
$('scanner-manual-form').addEventListener('submit',async event=>{event.preventDefault();if(!scannerResultCode)return;const button=$('scanner-manual-save');button.disabled=true;try{const p=ManualProducts.save(currentAccount(),{code:scannerResultCode,name:$('scanner-manual-name').value,brand:$('scanner-manual-brand').value});$('scanner-manual-form').hidden=true;renderScannerChoices();await addScannerProduct(p);}catch(error){$('scanner-status').textContent='No se ha guardado la ficha. '+error.message;}finally{button.disabled=false;}});
$('scanner-refresh-product').onclick=()=>{if(scannerResultCode)lookupScannedCode(scannerResultCode,{refresh:true});};
$('barcode-input').addEventListener('input',resetScannerResult);
$('scanner-dialog').addEventListener('close',resetScannerResult);
$('scanner-dialog').addEventListener('cancel',resetScannerResult);
