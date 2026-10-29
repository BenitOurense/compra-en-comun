'use strict';
let scannerStream=null,scannerTimer=null,scannerGeneration=0;
function stopScanner(){scannerGeneration++;clearTimeout(scannerTimer);scannerTimer=null;if(scannerStream)scannerStream.getTracks().forEach(t=>t.stop());scannerStream=null;const video=document.getElementById('scanner-video');if(video)video.srcObject=null;}
function manualBarcode(){if(!$('scanner-dialog').open)return;stopScanner();$('scanner-dialog').dataset.mode='manual';$('scanner-video').hidden=true;$('scanner-resume').hidden=false;$('scanner-status').textContent='Cámara detenida. Escribe el código del envase o vuelve a la cámara.';}
function closeScanner(){stopScanner();$('barcode-input').blur();$('scanner-dialog').close();if(document.activeElement?.matches('input,textarea'))document.activeElement.blur();}
async function startScanner({resetCode=true}={}){
 stopScanner();const generation=scannerGeneration,dialog=$('scanner-dialog'),status=$('scanner-status');
 document.activeElement?.blur();if(resetCode)$('barcode-input').value='';dialog.dataset.mode='camera';$('scanner-video').hidden=false;$('scanner-resume').hidden=true;
 // The explicit autofocus target prevents showModal from choosing the numeric input.
 if(!dialog.open)dialog.showModal();$('scanner-close').focus({preventScroll:true});status.textContent='Preparando cámara…';
 if(!window.isSecureContext||!navigator.mediaDevices?.getUserMedia||!('BarcodeDetector' in window)){status.textContent='Este navegador no permite el escaneo automático. Toca el campo para escribir el código del envase.';return;}
 try{
  const supported=await BarcodeDetector.getSupportedFormats();if(generation!==scannerGeneration||!dialog.open)return;
  const formats=['ean_13','ean_8','upc_a'].filter(f=>supported.includes(f));if(!formats.length)throw Error('unsupported');const detector=new BarcodeDetector({formats});
  const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280}},audio:false});
  if(generation!==scannerGeneration||!dialog.open){stream.getTracks().forEach(t=>t.stop());return;}
  scannerStream=stream;const video=$('scanner-video');video.srcObject=stream;await video.play();if(generation!==scannerGeneration||!dialog.open)return;
  status.textContent='Enfoca el código con buena luz. Para escribirlo, toca el campo: se apagará la cámara.';
  const detect=async()=>{
   if(generation!==scannerGeneration||!dialog.open)return;
   try{const results=await detector.detect(video);if(generation!==scannerGeneration||!dialog.open)return;const found=results.find(r=>ProductCatalog.validCode(r.rawValue));if(found){closeScanner();await consultCatalog(found.rawValue);return;}}
   catch{if(generation!==scannerGeneration)return;stopScanner();status.textContent='No se puede leer la cámara. Toca el campo para escribir el código.';return;}
   scannerTimer=setTimeout(detect,350);
  };detect();
 }catch(e){if(generation!==scannerGeneration)return;stopScanner();status.textContent=e.name==='NotAllowedError'?'No hay permiso para usar la cámara. Toca el campo para escribir el código.':'No se ha podido iniciar el lector. Toca el campo para escribir el código.';}
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
