const {test}=require('node:test');const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');
function deferred(){let resolve;const promise=new Promise(r=>resolve=r);return {resolve,promise};}
function setup({media,formats,detect,native=true,decode,load,permissions}={}){
 const els={},consulted=[],tracks=[],controls=[],readers=[];const timers=new Map();let timer=0;
 const document={activeElement:null,hidden:false,addEventListener(){},getElementById:id=>els[id]};
 function el(id){return els[id]={value:'',hidden:false,dataset:{},listeners:{},textContent:'',open:false,srcObject:null,focus(){document.activeElement=this;this.listeners.focus?.();},blur(){if(document.activeElement===this)document.activeElement=null;},matches(sel){return id==='barcode-input'&&sel==='input,textarea';},addEventListener(name,fn){this.listeners[name]=fn;},showModal(){this.open=true;els['scanner-close'].focus();},close(){this.open=false;this.listeners.close?.();},play:async()=>{}};}
 for(const id of ['scanner-dialog','scanner-status','barcode-input','scanner-video','scanner-resume','scanner-close','scan-open','barcode-form','install-app','install-status'])el(id);
 const stream=()=>{const track={stopped:false,stop(){this.stopped=true;}};tracks.push(track);return {getTracks:()=>[track]};};
 class Detector{static getSupportedFormats=()=>formats?formats():Promise.resolve(['ean_13']);detect=()=>detect?detect():Promise.resolve([]);}
 const decoder={BarcodeFormat:{EAN_13:7,EAN_8:6,UPC_A:14},BrowserMultiFormatReader:class{constructor(){readers.push(this);}async decodeFromStream(stream,video,callback){const control={stopped:false,stop(){this.stopped=true;}};controls.push(control);if(decode)await decode(callback,control);return control;}}};
 const context={CameraPermissions:permissions,ScannerDecoder:{load:()=>load?load(decoder):Promise.resolve(decoder)},document,$:id=>els[id],window:{isSecureContext:true,BarcodeDetector:Detector,addEventListener(){}},navigator:{mediaDevices:{getUserMedia:()=>media?media(stream):Promise.resolve(stream())}},BarcodeDetector:Detector,ProductCatalog:{validCode:c=>c==='8410128160074'},consultCatalog:async c=>consulted.push(c),setTimeout:fn=>{timers.set(++timer,fn);return timer;},clearTimeout:id=>timers.delete(id)};
 if(!native)delete context.window.BarcodeDetector;
 vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/../mobile.js','utf8'),context);return {els,context,document,tracks,consulted,timers,controls,readers};
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

test('sin lector nativo usa el lector compatible y al escribir detiene sus controles',async()=>{const s=setup({native:false});await s.context.startScanner();assert.equal(s.els['scanner-dialog'].dataset.reader,'compatible');assert.equal(s.document.activeElement,s.els['scanner-close']);assert.deepEqual(Array.from(s.readers[0].possibleFormats),[7,6,14]);s.els['barcode-input'].focus();assert.equal(s.controls[0].stopped,true);assert.equal(s.tracks[0].stopped,true);});
test('si el navegador no soporta formatos EAN recurre al lector compatible',async()=>{const s=setup({formats:async()=>[]});await s.context.startScanner();assert.equal(s.els['scanner-dialog'].dataset.reader,'compatible');s.context.closeScanner();});
test('el lector compatible consulta una sola vez y apaga cámara y controles',async()=>{const s=setup({native:false,decode:async(callback,controls)=>{callback({getText:()=> '8410128160074'},null,controls);callback({getText:()=> '8410128160074'},null,controls);}});await s.context.startScanner();assert.deepEqual(s.consulted,['8410128160074']);assert.equal(s.els['scanner-dialog'].open,false);assert.equal(s.controls[0].stopped,true);assert.equal(s.tracks[0].stopped,true);});
test('cancelar mientras se carga el lector no solicita la cámara después',async()=>{const pending=deferred();const s=setup({native:false,load:async decoder=>{await pending.promise;return decoder;}});const running=s.context.startScanner();s.els['barcode-input'].focus();pending.resolve();await running;assert.equal(s.tracks.length,0);assert.equal(s.els['scanner-dialog'].dataset.mode,'manual');});
test('si se cierra mientras el lector compatible arranca, detiene sus controles tardíos',async()=>{const pending=deferred();const s=setup({native:false,decode:()=>pending.promise});const running=s.context.startScanner();await tick();s.context.closeScanner();pending.resolve();await running;assert.equal(s.controls[0].stopped,true);assert.equal(s.tracks[0].stopped,true);assert.equal(s.consulted.length,0);});


test('denegar la cámara abre la ventana de permisos y conserva la entrada manual',async()=>{
 let opened=0;const permissions={close(){},isDenied:e=>e.name==='NotAllowedError',show(){opened++;}};
 const s=setup({permissions,media:async()=>{throw Object.assign(new Error('Denied'),{name:'NotAllowedError'});}});
 await s.context.startScanner();assert.equal(opened,1);assert.equal(s.els['scanner-dialog'].dataset.cameraError,'permission');assert.equal(s.els['scanner-resume'].hidden,false);assert.match(s.els['scanner-status'].textContent,/No tienes permisos/);
 s.els['barcode-input'].value='8410128160074';s.els['barcode-form'].listeners.submit({preventDefault(){}});assert.deepEqual(s.consulted,['8410128160074']);
});
test('una cámara ocupada no se presenta como permiso denegado',async()=>{
 let opened=0;const s=setup({permissions:{close(){},isDenied:e=>e.name==='NotAllowedError',show(){opened++;}},media:async()=>{throw Object.assign(new Error('Busy'),{name:'NotReadableError'});}});
 await s.context.startScanner();assert.equal(opened,0);assert.equal(s.els['scanner-dialog'].dataset.cameraError,'other');assert.match(s.els['scanner-status'].textContent,/ocupada/);
});
test('una denegación tardía después de cerrar el escáner no abre una ventana',async()=>{
 const pending=deferred();let opened=0;const s=setup({permissions:{close(){},isDenied:()=>true,show(){opened++;}},media:async()=>{await pending.promise;throw Object.assign(new Error('Denied'),{name:'NotAllowedError'});}});
 const run=s.context.startScanner();await tick();s.context.closeScanner();pending.resolve();await run;assert.equal(opened,0);
});
test('tocar una cámara apagada permite recuperar el acceso conservando el código',async()=>{
 const s=setup();s.els['scanner-dialog'].showModal();s.els['scanner-dialog'].dataset.mode='camera';s.els['barcode-input'].value='8410128160074';await s.els['scanner-video'].listeners.click();assert.equal(s.tracks.length,1);assert.equal(s.els['barcode-input'].value,'8410128160074');s.context.closeScanner();
});
test('enfoque no soportado conserva las instrucciones sin avisos repetidos',async()=>{
 const s=setup();s.context.CameraFocus={focus:async()=> 'unsupported'};s.els['scanner-video'].getBoundingClientRect=()=>({left:0,top:0,width:300,height:200});await s.context.startScanner();const initial=s.els['scanner-status'].textContent;await s.els['scanner-video'].listeners.click({clientX:40,clientY:40});assert.equal(s.els['scanner-status'].textContent,initial);s.context.closeScanner();
});
