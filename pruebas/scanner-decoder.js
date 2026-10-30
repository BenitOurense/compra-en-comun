/* Optional, local decoder for browsers without native EAN/UPC detection. */
'use strict';
(function(root){
 let loading=null;
 function load(){
  if(root.ZXingBrowser?.BrowserMultiFormatReader)return Promise.resolve(root.ZXingBrowser);
  if(loading)return loading;
  loading=new Promise((resolve,reject)=>{
   const script=document.createElement('script');script.src='./vendor/zxing-browser-0.2.1.min.js';script.async=true;
   const fail=()=>{clearTimeout(timer);script.remove();loading=null;reject(Error('No se pudo cargar el lector. Puedes escribir el código.'));};
   const timer=setTimeout(fail,15000);script.onerror=fail;script.onload=()=>{clearTimeout(timer);if(!root.ZXingBrowser?.BrowserMultiFormatReader){fail();return;}resolve(root.ZXingBrowser);};document.head.append(script);
  });return loading;
 }
 root.ScannerDecoder={load};
})(globalThis);
