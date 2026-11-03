'use strict';
(function(root){
 function installationURL(href){return new URL('./instalar.html',href).href;}
 function whatsappURL(href){return 'https://wa.me/?text='+encodeURIComponent('Te invito a instalar Market Sinc para crear y compartir listas de la compra: '+installationURL(href));}
 root.AppInstall={installationURL,whatsappURL};
 const share=document.getElementById('share-app-whatsapp');
 if(share)share.addEventListener('click',()=>{root.location.href=whatsappURL(root.location.href);});
 const install=document.getElementById('install-direct');if(!install)return;
 const status=document.getElementById('install-direct-status');let prompt=null;
 const installed=()=>root.matchMedia?.('(display-mode: standalone)').matches||root.navigator?.standalone;
 if(installed()){install.hidden=true;status.textContent='Market Sinc ya está abierta como aplicación.';}
 root.addEventListener('beforeinstallprompt',event=>{event.preventDefault();prompt=event;if(!installed())install.hidden=false;});
 install.addEventListener('click',async()=>{
  if(!prompt)return;
  const request=prompt;prompt=null;install.disabled=true;
  try{await request.prompt();const result=await request.userChoice;status.textContent=result.outcome==='accepted'?'Instalación solicitada. Después puedes abrir Market Sinc desde su icono.':'Puedes instalarla más adelante desde el menú del navegador.';}
  catch{status.textContent='Usa el menú del navegador para instalar Market Sinc. Tienes las instrucciones debajo.';}
  finally{install.hidden=true;install.disabled=false;}
 });
 root.addEventListener('appinstalled',()=>{install.hidden=true;status.textContent='Market Sinc instalada. Ábrela desde su icono o pulsa Abrir Market Sinc.';});
 if('serviceWorker' in root.navigator&&root.isSecureContext)root.navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(()=>{status.textContent='Puedes abrir la app y volver a intentar la instalación desde el menú del navegador.';});
})(globalThis);
