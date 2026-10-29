const {test}=require('node:test');const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');
function deferred(){let resolve;const promise=new Promise(r=>resolve=r);return {resolve,promise};}
function setup({media,formats,detect}={}){
 const els={},consulted=[],tracks=[];const timers=new Map();let timer=0;
 const document={activeElement:null,hidden:false,addEventListener(){},getElementById:id=>els[id]};
 function el(id){return els[id]={value:'',hidden:false,dataset:{},listeners:{},textContent:'',open:false,srcObject:null,focus(){document.activeElement=this;this.listeners.focus?.();},blur(){if(document.activeElement===this)document.activeElement=null;},matches(sel){return id==='barcode-input'&&sel==='input,textarea';},addEventListener(name,fn){this.listeners[name]=fn;},showModal(){this.open=true;els['scanner-close'].focus();},close(){this.open=false;this.listeners.close?.();},play:async()=>{}};}
 for(const id of ['scanner-dialog','scanner-status','barcode-input','scanner-video','scanner-resume','scanner-close','scan-open','barcode-form','install-app','install-status'])el(id);
 const stream=()=>{const track={stopped:false,stop(){this.stopped=true;}};tracks.push(track);return {getTracks:()=>[track]};};
 class Detector{static getSupportedFormats=()=>formats?formats():Promise.resolve(['ean_13']);detect=()=>detect?detect():Promise.resolve([]);}
 const context={document,$:id=>els[id],window:{isSecureContext:true,BarcodeDetector:Detector,addEventListener(){}},navigator:{mediaDevices:{getUserMedia:()=>media?media(stream):Promise.resolve(stream())}},BarcodeDetector:Detector,ProductCatalog:{validCode:c=>c==='8410128160074'},consultCatalog:async c=>consulted.push(c),setTimeout:fn=>{timers.set(++timer,fn);return timer;},clearTimeout:id=>timers.delete(id)};
 vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/../mobile.js','utf8'),context);return {els,context,document,tracks,consulted,timers};
}
const tick=()=>new Promise(r=>setImmediate(r));
test('abre la cámara sin enfocar el campo y tocar el código detiene el vídeo; volver reanuda',async()=>{
 const s=setup();await s.context.startScanner();assert.equal(s.els['scanner-dialog'].open,true);assert.equal(s.document.activeElement,s.els['scanner-close']);assert.equal(s.tracks[0].stopped,false);
 s.els['barcode-input'].focus();assert.equal(s.tracks[0].stopped,true);assert.equal(s.els['scanner-video'].srcObject,null);assert.equal(s.els['scanner-video'].hidden,true);assert.equal(s.els['scanner-resume'].hidden,false);assert.equal(s.timers.size,0);
 s.els['barcode-input'].value='8410128160074';await s.els['scanner-resume'].listeners.click();assert.equal(s.els['barcode-input'].value,'8410128160074');assert.equal(s.els['scanner-video'].hidden,false);assert.equal(s.tracks[1].stopped,false);assert.equal(s.document.activeElement,s.els['scanner-close']);s.context.closeScanner();
});
test('tocar el campo durante la petición de cámara descarta y apaga el stream tardío',async()=>{
 const pending=deferred();const s=setup({media:async stream=>{await pending.promise;return stream();}});const running=s.context.startScanner();await tick();s.els['barcode-input'].focus();pending.resolve();await running;assert.equal(s.tracks[0].stopped,true);assert.equal(s.els['scanner-video'].srcObject,null);assert.equal(s.timers.size,0);
});
test('la lectura automática consulta el EAN, cierra cámara y no abre el teclado',async()=>{
 const s=setup({detect:async()=>[{rawValue:'8410128160074'}]});await s.context.startScanner();await tick();assert.deepEqual(s.consulted,['8410128160074']);assert.equal(s.els['scanner-dialog'].open,false);assert.ok(s.tracks.every(t=>t.stopped));assert.notEqual(s.document.activeElement,s.els['barcode-input']);
});
test('la consulta manual rechaza códigos inválidos y solo consulta el código válido',async()=>{
 const s=setup();await s.context.startScanner();s.els['barcode-input'].focus();s.els['barcode-input'].value='123';const submit=s.els['barcode-form'].listeners.submit;submit({preventDefault(){}});assert.equal(s.consulted.length,0);assert.equal(s.els['scanner-dialog'].open,true);s.els['barcode-input'].value='8410128160074';submit({preventDefault(){}});assert.deepEqual(s.consulted,['8410128160074']);assert.equal(s.els['scanner-dialog'].open,false);assert.equal(s.document.activeElement,null);
});
test('una detección pendiente no consulta después de pasar a escritura manual',async()=>{
 const pending=deferred();const s=setup({detect:()=>pending.promise});await s.context.startScanner();s.els['barcode-input'].focus();pending.resolve([{rawValue:'8410128160074'}]);await tick();assert.equal(s.consulted.length,0);assert.equal(s.els['scanner-dialog'].open,true);assert.equal(s.timers.size,0);
});
