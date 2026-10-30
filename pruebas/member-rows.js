/* Compact participant rows: swipe left or use the explicit options button. */
'use strict';
(function(root){
 let nextId=0;
 function gesture(start,end){const dx=end.x-start.x,dy=end.y-start.y;return Math.abs(dx)>48&&Math.abs(dx)>Math.abs(dy)*1.4?(dx<0?'open':'close'):null;}
 function render({alias,role,self=false,actions=[]}){
  const row=document.createElement('li');row.className='member-row';
  const surface=document.createElement('div');surface.className='member-surface';
  const copy=document.createElement('span');copy.className='member-copy';
  const name=document.createElement('strong');name.textContent=alias;
  const badge=document.createElement('small');badge.textContent=role+(self?' · tú':'');
  copy.append(name,badge);surface.append(copy);row.append(surface);
  if(!actions.length)return row;
  row.classList.add('member-swipe');row.style.setProperty('--member-action-count',actions.length);
  const panel=document.createElement('div');panel.className='member-actions';panel.id='member-actions-'+(++nextId);panel.hidden=true;
  const toggle=document.createElement('button');toggle.type='button';toggle.className='member-more';toggle.setAttribute('aria-label','Opciones de '+alias);toggle.setAttribute('aria-controls',panel.id);toggle.setAttribute('aria-expanded','false');toggle.textContent='•••';surface.append(toggle);
  function open(value){
   if(value&&row.parentElement)for(const other of row.parentElement.querySelectorAll('.member-row.swiped'))if(other!==row)other.closeMemberActions?.();
   row.classList.toggle('swiped',value);panel.hidden=!value;toggle.setAttribute('aria-expanded',String(value));
  }
  row.closeMemberActions=()=>open(false);toggle.addEventListener('click',()=>open(!row.classList.contains('swiped')));
  for(const action of actions){const b=document.createElement('button');b.type='button';b.className=action.danger?'danger':'secondary';b.textContent=action.label;b.setAttribute('aria-label',action.label+': '+alias);b.addEventListener('click',async()=>{if(b.disabled)return;b.disabled=true;try{await action.run();}finally{b.disabled=false;}});panel.append(b);}
  row.append(panel);let start=null;
  surface.addEventListener('pointerdown',event=>{if(event.isPrimary===false||event.button>0)return;start={x:event.clientX,y:event.clientY,id:event.pointerId};});
  surface.addEventListener('pointerup',event=>{if(!start||start.id!==event.pointerId)return;const result=gesture(start,{x:event.clientX,y:event.clientY});start=null;if(result){event.preventDefault();open(result==='open');}});
  surface.addEventListener('pointercancel',()=>{start=null;});
  row.addEventListener('keydown',event=>{if(event.key==='Escape'){open(false);toggle.focus();}});
  return row;
 }
 root.MemberRows={gesture,render};
})(globalThis);
