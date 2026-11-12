/* UI abuse mitigation only. Firebase rules, quotas and App Check remain server controls. */
'use strict';
(function(root){
 function create({storage,now=()=>Date.now()}={}){
  const key='marketsinc-auth-next-request-v1';let running=false,next=0;
  function remaining(){let stored=0;try{stored=Number(storage?.getItem(key))||0;}catch{}return Math.max(0,Math.max(next,stored)-now());}
  function pause(ms){next=Math.max(next,now()+ms);try{storage?.setItem(key,String(next));}catch{}}
  async function run(work){
   if(running)throw Object.assign(Error('Ya hay una solicitud de acceso en curso.'),{code:'app/request-busy'});
   if(remaining()>0)throw Object.assign(Error('Espera unos segundos antes de volver a intentarlo.'),{code:'app/request-cooldown'});
   running=true;pause(2000);
   try{return await work();}
   catch(error){if(error?.code==='auth/too-many-requests')pause(60000);throw error;}
   finally{running=false;}
  }
  return {run,remaining};
 }
 let storage;try{storage=root.localStorage;}catch{}
 root.AuthRequests={create,...create({storage})};
})(globalThis);
