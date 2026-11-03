
/* Uses production UI with local disposable data. Never initializes Firebase. */
(async()=>{
 let html=await fetch('../index.html',{cache:'no-store'}).then(r=>r.text());
 const start=html.indexOf("(async()=>{try{const fb="),end=html.indexOf('\nconst currentAccount=',start);
 if(start<0||end<0)throw Error('Ha cambiado el arranque; no se puede aislar Firebase.');
 html=html.slice(0,start)+html.slice(end);
 html=html.replace('<head>','<head><base href="../"><meta name="robots" content="noindex">');
 html=html.replace("const KEY='compra-en-comun-pruebas-v1'","const KEY='marketsinc-disposable-ui-preview-v1'");
 const boundary='<script src="./app-ui.js';
 html=html.replace(boundary,'<script>LocalCatalog.start=()=>{};<\/script>'+boundary);
 const fixture=`<script>
 user={uid:'ui-preview-disposable',displayName:'Prueba aislada'};guest=true;pendingInvite=null;
 lists=[{id:'ui-test-list',name:'Prueba aislada',items:[{id:'milk',name:'Leche desnatada Pascual',done:false}]}];
 privateListsReady=true;sharedListsReady=true;enter('Prueba aislada · datos locales desechables');
 ProductCatalog.online=async()=>({products:[]});
 const banner=document.createElement('p');banner.textContent='PRUEBA AISLADA · sin Firebase ni cuentas reales';banner.style.cssText='background:#fff2c8;padding:10px;font-size:12px';document.body.prepend(banner);
 const toggle=document.createElement('button');toggle.textContent='Simular ficha oficial';toggle.type='button';toggle.onclick=()=>{ProductCatalog.online=async code=>({products:[{name:'Producto oficial de prueba',brand:'Marca de prueba',code,source:'Open Food Facts',allergens:'',fetchedAt:Date.now()}]});toggle.textContent='Ficha oficial simulada activada';};document.getElementById('scanner-dialog').append(toggle);
 const permissions=document.createElement('button');permissions.textContent='Simular permiso de cámara denegado';permissions.type='button';permissions.onclick=()=>{const camera=document.getElementById('scanner-camera-message');camera.hidden=false;camera.textContent='Toca para revisar los permisos de cámara';CameraPermissions.show();};document.getElementById('scanner-dialog').append(permissions);
 <\/script>`;
 html=html.replace('</body>',fixture+'</body>');document.open();document.write(html);document.close();
})().catch(e=>{document.body.textContent='No se ha abierto la prueba aislada: '+e.message;});
