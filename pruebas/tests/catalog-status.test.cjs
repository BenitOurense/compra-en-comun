const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const html=fs.readFileSync(__dirname+'/../index.html','utf8');
const start=html.indexOf('async function consultCatalog('),end=html.indexOf("$('product-online-search').addEventListener",start);
function setup(online){
 const elements={'product-online-search':{disabled:false},'product-search-status':{textContent:''}},selected=[];
 const c={onlineGeneration:0,active:'L',selectedProduct:{name:'Anterior'},ProductCatalog:{online},$:id=>elements[id],showProduct(){},hideSuggestions(){},updateSuggestions(){},chooseProduct:(p,options)=>selected.push({p,options})};
 vm.createContext(c);vm.runInContext(html.slice(start,end),c);return {c,elements,selected};
}
test('muestra el EAN leído y el aviso de producto inexistente',async()=>{const s=setup(async()=>({products:[]}));await s.c.consultCatalog('3017624010701');assert.match(s.elements['product-search-status'].textContent,/Código leído: 3017624010701.*Producto no encontrado/);assert.equal(s.c.selectedProduct,null);assert.equal(s.elements['product-online-search'].disabled,false);});
test('un fallo de red se distingue de un producto ausente',async()=>{const s=setup(async()=>{throw Error('Sin conexión');});await s.c.consultCatalog('3017624010701');assert.match(s.elements['product-search-status'].textContent,/No se ha podido comprobar.*Sin conexión/);assert.doesNotMatch(s.elements['product-search-status'].textContent,/Producto no encontrado/);});
test('editar durante la consulta descarta la respuesta antigua y desbloquea el botón',async()=>{let release;const s=setup(()=>new Promise(r=>release=r));const pending=s.c.consultCatalog('3017624010701');s.c.onlineGeneration++;s.elements['product-search-status'].textContent='Consulta actual';release({products:[]});await pending;assert.equal(s.elements['product-search-status'].textContent,'Consulta actual');assert.equal(s.elements['product-online-search'].disabled,false);});
test('el producto escaneado se selecciona sin forzar el teclado',async()=>{const s=setup(async()=>({products:[{name:'Agua'}]}));await s.c.consultCatalog('3017624010701');assert.equal(s.selected[0].p.name,'Agua');assert.equal(s.selected[0].options.focusInput,false);});
