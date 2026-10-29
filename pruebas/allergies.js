/* Source-based hints only. Unknown is never treated as allergen-free. */
'use strict';
(function(root){
 const OPTIONS=[['gluten','Gluten (celiaquía)'],['crustaceans','Crustáceos'],['eggs','Huevo'],['fish','Pescado'],['peanuts','Cacahuetes'],['soybeans','Soja'],['milk','Leche'],['nuts','Frutos de cáscara'],['celery','Apio'],['mustard','Mostaza'],['sesame-seeds','Sésamo'],['sulphur-dioxide-and-sulphites','Sulfitos'],['lupin','Altramuz'],['molluscs','Moluscos']].map(([id,name])=>({id,name}));
 const aliases={gluten:['gluten','wheat','trigo','barley','cebada','rye','centeno','oats','avena','spelt','espelta','kamut'],crustaceans:['crustaceans','crustaceos'],eggs:['eggs','egg','huevos','huevo'],fish:['fish','pescado'],peanuts:['peanuts','peanut','cacahuetes','cacahuete'],soybeans:['soybeans','soy','soya','soja'],milk:['milk','leche','casein','caseina','whey','suero de leche'],nuts:['nuts','tree nuts','frutos de cascara','almonds','almendras','hazelnuts','avellanas','walnuts','nueces','cashews','anacardos','pecans','pistachios','pistachos','macadamia','brazil nuts'],celery:['celery','apio'],mustard:['mustard','mostaza'],'sesame-seeds':['sesame seeds','sesame','sesamo'],'sulphur-dioxide-and-sulphites':['sulphur dioxide and sulphites','sulphites','sulfites','sulfitos','dioxido de azufre'],lupin:['lupin','lupins','altramuz','altramuces'],molluscs:['molluscs','mollusks','moluscos']};
 // Exact labels from OFF's taxonomy; vegan and lactose-free never imply milk-free.
 const absence={gluten:['no gluten','gluten free','without gluten','certified gluten free'],eggs:['no eggs','egg free'],milk:['no milk','milk free','dairy free'],soybeans:['no soy','soy free'],peanuts:['no peanuts','peanut free'],nuts:['no nuts','nut free']};
 const norm=s=>ProductCatalog.norm(s).replace(/^[a-z]{2}:/,'').replace(/[-_]/g,' ').replace(/\s+/g,' ').trim();
 function selection(values){return Array.isArray(values)?OPTIONS.filter(o=>values.includes(o.id)).map(o=>o.id):[];}
 function declared(value,id){return String(value||'').split(/[,;\n]/).map(norm).some(token=>{if(/\b(sin|without|free|no)\b/.test(token))return false;return aliases[id].some(alias=>(' '+token+' ').includes(' '+alias+' '));});}
 function assess(product,values){
  const selected=selection(values);if(!selected.length)return {state:'off',contains:[],traces:[],free:[],missing:[],summary:''};
  const p=ProductCatalog.latest?ProductCatalog.latest(product):product;
  if(!p||p.source!=='Open Food Facts'||!ProductCatalog.validCode(p.code))return {state:'unknown',contains:[],traces:[],free:[],missing:selected,summary:'Sin información suficiente para tus alertas'};
  const contains=selected.filter(id=>declared(p.allergens,id)),traces=selected.filter(id=>declared(p.traces,id));
  const labels=String(p.labels||'').split(/[,;\n]/).map(norm),free=selected.filter(id=>(absence[id]||[]).some(tag=>labels.includes(tag))),missing=selected.filter(id=>!free.includes(id));
  const name=id=>OPTIONS.find(o=>o.id===id).name.replace(' (celiaquía)','').toLocaleLowerCase('es');
  if(contains.length||traces.length)return {state:'risk',contains,traces,free,missing,summary:[contains.length?'Contiene: '+contains.map(name).join(', '):'',traces.length?'Posibles trazas: '+traces.map(name).join(', '):''].filter(Boolean).join(' · ')};
  if(!missing.length)return {state:'clear',contains,traces,free,missing,summary:'Ausencia declarada: '+free.map(name).join(', ')};
  return {state:'unknown',contains,traces,free,missing,summary:'Faltan datos de ausencia: '+missing.map(name).join(', ')};
 }
 root.AllergyGuard={OPTIONS,selection,assess};
})(globalThis);
