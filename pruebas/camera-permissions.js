/* Web permissions cannot open Android's application settings. Never fake that link. */
'use strict';
(function(root){
 function isDenied(error){return error?.name==='NotAllowedError'||error?.name==='PermissionDeniedError';}
 function instructions(ua='',standalone=false){
  if(/iPhone|iPad|iPod/.test(ua))return standalone?'En Ajustes del iPhone, revisa el permiso de cámara de la app web si aparece. Si no aparece, abre Market Sinc en Safari y revisa los permisos de cámara de ese sitio. Después vuelve al lector.':'En Safari, abre el menú de la página → Ajustes del sitio web → Cámara → Permitir. Si está bloqueada en el sistema, revisa también Ajustes del iPhone → Apps → Safari → Cámara.';
  if(/Android/.test(ua))return (standalone?'Abre esta misma dirección en el navegador con el que instalaste Market Sinc. ':'')+'En el navegador, abre la información del sitio junto a la dirección → Permisos → Cámara → Permitir. Si Android bloquea el acceso, ve a Ajustes → Aplicaciones → tu navegador → Permisos → Cámara. Después vuelve y toca el recuadro de la cámara.';
  return 'Abre la información del sitio junto a la dirección del navegador → Permisos → Cámara → Permitir. Comprueba también el permiso de cámara del navegador en los ajustes del equipo. Después vuelve y toca el recuadro de la cámara.';
 }
 function show(){const dialog=document.getElementById('camera-permissions-dialog');if(dialog&&!dialog.open)dialog.showModal();}
 function close(){const dialog=document.getElementById('camera-permissions-dialog');if(dialog?.open)dialog.close();}
 root.CameraPermissions={isDenied,instructions,show,close};
 const button=document.getElementById('camera-permissions-open');
 if(button){
  button.addEventListener('click',async()=>{
   const help=document.getElementById('camera-permissions-help');
   const standalone=root.matchMedia?.('(display-mode: standalone)').matches||root.navigator?.standalone;
   help.textContent='Este navegador no permite abrir directamente sus ajustes desde la web. '+instructions(root.navigator?.userAgent||'',standalone);
   help.hidden=false;
   // A fresh request can show the system prompt if it has not been permanently blocked.
   if(root.isSecureContext&&root.navigator?.mediaDevices?.getUserMedia){close();await startScanner({resetCode:false});}
  });
  document.getElementById('camera-permissions-close').addEventListener('click',close);
 }
})(globalThis);
