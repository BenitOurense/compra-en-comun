'use strict';
let scannerStream=null,scannerTimer=null,scannerGeneration=0,scannerControls=null;
function stopScanner(){scannerGeneration++;clearTimeout(scannerTimer);scannerTimer=null;const controls=scannerControls;scannerControls=null;if(controls){try{Promise.resolve(controls.stop()).catch(()=>{});}catch{}}if(scannerStream)scannerStream.getTracks().forEach(t=>t.stop());scannerStream=null;const video=document.getElementById('scanner-video');if(video)video.srcObject=null;}
function manualBarcode(){if(!$('scanner-dialog').open)return;stopScanner();$('scanner-dialog').dataset.mode='manual';$('scanner-video').hidden=true;$('scanner-resume').hidden=false;$('scanner-status').textContent='Cámara detenida. Escribe el código del envase o vuelve a la cámara.';}
function closeScanner(){stopScanner();$('barcode-input').blur();$('scanner-dialog').close();if(document.activeElement?.matches('input,textarea'))document.activeElement.blur();}
async function startScanner({resetCode=true}={}){
 stopScanner();const generation=scannerGeneration,dialog=$('scanner-dialog'),status=$('scanner-status');
 const current=()=>generation===scannerGeneration&&dialog.open;
 document.activeElement?.blur();if(resetCode)$('barcode-input').value='';dialog.dataset.mode='camera';$('scanner-video').hidden=false;$('scanner-resume').hidden=true;
 // An explicit autofocus target prevents showModal from opening the numeric keyboard.
 if(!dialog.open)dialog.showModal();$('scanner-close').focus({preventScroll:true});status.textContent='Preparando cámara…';
 if(!window.isSecureContext||!navigator.mediaDevices?.getUserMedia){status.textContent='No se puede acceder a la cámara en este navegador. Toca el campo para escribir el código.';return;}
 try{
  let detector=null,decoder=null;
  if('BarcodeDetector' in window){try{const supported=await BarcodeDetector.getSupportedFormats();if(!current())return;const formats=['ean_13','ean_8','upc_a'].filter(f=>supported.includes(f));if(formats.length)detector=new BarcodeDetector({formats});}catch{/* Use the bundled decoder when native detection is unavailable. */}}
  if(!current())return;
  if(!detector){status.textContent='Preparando lector compatible…';decoder=await ScannerDecoder.load();if(!current())return;}
  const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280}},audio:false});
  if(!current()){stream.getTracks().forEach(t=>t.stop());return;}
  scannerStream=stream;const video=$('scanner-video');video.srcObject=stream;
  status.textContent='Enfoca el código con buena luz. Para escribirlo, toca el campo: se apagará la cámara.';
  if(decoder){
   dialog.dataset.reader='compatible';
   const reader=new decoder.BrowserMultiFormatReader(new Map(),{delayBetweenScanAttempts:350,delayBetweenScanSuccess:1000});
   reader.possibleFormats=[decoder.BarcodeFormat.EAN_13,decoder.BarcodeFormat.EAN_8,decoder.BarcodeFormat.UPC_A];
   const controls=await reader.decodeFromStream(stream,video,(result,error,control)=>{
    if(!current()){control.stop();return;}
    const code=result?.getText();if(code&&ProductCatalog.validCode(code)){control.stop();closeScanner();consultCatalog(code);}
   });
   if(!current()){controls.stop();return;}scannerControls=controls;return;
  }
  dialog.dataset.reader='native';await video.play();if(!current())return;
  const detect=async()=>{
   if(!current())return;
   try{const results=await detector.detect(video);if(!current())return;const found=results.find(r=>ProductCatalog.validCode(r.rawValue));if(found){closeScanner();await consultCatalog(found.rawValue);return;}}
   catch{if(!current())return;stopScanner();$('scanner-resume').hidden=false;status.textContent='No se puede leer la cámara. Puedes reintentar o tocar el campo para escribir el código.';return;}
   scannerTimer=setTimeout(detect,350);
  };detect();
 }catch(e){if(!current())return;stopScanner();$('scanner-resume').hidden=false;status.textContent=e.name==='NotAllowedError'?'No hay permiso para usar la cámara. Puedes volver a intentarlo o escribir el código.':'No se ha podido iniciar el lector. Puedes volver a intentarlo o escribir el código.';}
}
$('scan-open').addEventListener('click',()=>startScanner());
$('scanner-resume').addEventListener('click',()=>startScanner({resetCode:false}));
$('barcode-input').addEventListener('focus',manualBarcode);
$('scanner-close').addEventListener('click',closeScanner);
$('scanner-dialog').addEventListener('close',stopScanner);
$('scanner-dialog').addEventListener('cancel',stopScanner);
$('barcode-form').addEventListener('submit',e=>{e.preventDefault();const code=$('barcode-input').value.trim();if(!ProductCatalog.validCode(code)){$('scanner-status').textContent='Revisa el código: debe ser un EAN/UPC válido de 8, 12, 13 o 14 cifras.';return;}closeScanner();consultCatalog(code);});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopScanner();if($('scanner-dialog').open){$('scanner-resume').hidden=false;$('scanner-status').textContent='Cámara detenida. Pulsa Volver a la cámara para continuar.';}}});
window.addEventListener('pagehide',stopScanner);
let installPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('install-app').hidden=false;});
$('install-app').addEventListener('click',async()=>{if(!installPrompt)return;const prompt=installPrompt;installPrompt=null;try{await prompt.prompt();const result=await prompt.userChoice;$('install-status').textContent=result.outcome==='accepted'?'Instalación solicitada.':'Puedes instalarla después desde el menú del navegador.';}catch{$('install-status').textContent='Puedes instalarla desde el menú del navegador.';}$('install-app').hidden=true;});
window.addEventListener('appinstalled',()=>{$('install-app').hidden=true;$('install-status').textContent='Aplicación instalada.';});
if('serviceWorker' in navigator&&window.isSecureContext)navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(()=>{$('install-status').textContent='No se ha podido preparar la instalación. Puedes seguir usando la web.';});
