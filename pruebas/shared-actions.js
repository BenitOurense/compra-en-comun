/* Shared-list operations. Firestore rules remain the authority for every write. */
'use strict';
(function(root){
 function create(fs,db){
  const group=id=>fs.doc(db,'sharedLists',id);
  const member=(id,uid)=>fs.doc(db,'sharedLists',id,'members',uid);
  const share=(id,uid)=>fs.doc(db,'userShares',uid,'lists',id);
  const account=uid=>{if(!uid)throw Error('Inicia sesión para continuar.');};
  async function remove(uid,id){
   account(uid);
   // Enumerate members before removing the parent: SDK deletes do not cascade.
   const members=await fs.getDocs(fs.collection(db,'sharedLists',id,'members'));
   const ids=[...new Set([uid,...members.docs.map(d=>d.id)])];
   if(ids.length>200)throw Error('Esta lista tiene demasiados participantes para eliminarla desde el móvil. No se ha eliminado nada.');
   await fs.runTransaction(db,async tx=>{
    const current=await tx.get(group(id));
    if(!current.exists())throw Error('Esta lista ya no existe.');
    if(current.data().ownerUid!==uid)throw Error('Solo el propietario puede eliminar esta lista para todos.');
    // userShares is private to each account. The group owner cannot delete
    // another account's shortcut. Removing the group/membership revokes access.
    for(const other of ids)tx.delete(member(id,other));
    tx.delete(share(id,uid));
    tx.delete(group(id));
   });
  }
  async function leave(uid,id){
   account(uid);
   await fs.runTransaction(db,async tx=>{
    const current=await tx.get(group(id));
    if(current.exists()&&current.data().ownerUid===uid)throw Error('Transfiere primero la propiedad a otro participante o elimina la lista para todos.');
    tx.delete(member(id,uid));tx.delete(share(id,uid));
   });
  }
  async function transfer(uid,id,nextUid){
   account(uid);
   if(!nextUid||nextUid===uid)throw Error('Elige a otro participante.');
   await fs.runTransaction(db,async tx=>{
    const current=await tx.get(group(id)),target=await tx.get(member(id,nextUid));
    if(!current.exists())throw Error('Esta lista ya no existe.');
    if(current.data().ownerUid!==uid)throw Error('Solo el propietario puede transferir la lista.');
    if(!target.exists())throw Error('Esa persona ya no participa en la lista.');
    tx.update(group(id),{ownerUid:nextUid});
   });
  }
  async function kick(uid,id,targetUid){
   account(uid);
   if(!targetUid||targetUid===uid)throw Error('Para salir utiliza Salir de la lista.');
   await fs.runTransaction(db,async tx=>{
    const current=await tx.get(group(id)),self=await tx.get(member(id,uid));
    if(!current.exists())throw Error('Esta lista ya no existe.');
    if(current.data().ownerUid!==uid&&self.data()?.role!=='admin')throw Error('Solo los administradores pueden expulsar participantes.');
    if(current.data().ownerUid===targetUid)throw Error('No se puede expulsar al propietario.');
    tx.delete(member(id,targetUid));
   });
  }
  async function accept(uid,token,alias){
   account(uid);
   // A new member cannot read the private group before joining. Invitation
   // validity and membership are checked by the existing server rules.
   const invitation=await fs.getDoc(fs.doc(db,'invitations',token));
   if(!invitation.exists()||invitation.data().expiresAt.toMillis()<Date.now())throw Error('La invitación ha caducado. Pide una nueva.');
   const id=invitation.data().listId;
   // Merge preserves an existing administrator's role on repeated acceptance.
   // Keep membership first: deployed rules may require it to exist before
   // writing the user's shortcut. A retry is safe if that second write fails.
   await fs.setDoc(member(id,uid),{joinedAt:fs.serverTimestamp(),inviteId:token,alias:String(alias||'Miembro').slice(0,40)},{merge:true});
   await fs.setDoc(share(id,uid),{joinedAt:fs.serverTimestamp()},{merge:true});return id;
  }
  return {remove,leave,transfer,kick,accept};
 }
 root.SharedActions={create};
})(globalThis);
