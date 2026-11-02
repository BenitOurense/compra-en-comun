'use strict';
(function(root){
 async function focus(track,x=.5,y=.5){
  if(!track?.getCapabilities||!track?.applyConstraints)return 'unsupported';
  const caps=track.getCapabilities(),advanced={};
  if(caps.pointsOfInterest)advanced.pointsOfInterest=[{x:Math.max(0,Math.min(1,x)),y:Math.max(0,Math.min(1,y))}];
  if(caps.focusMode?.includes('single-shot'))advanced.focusMode='single-shot';
  else if(caps.focusMode?.includes('continuous'))advanced.focusMode='continuous';
  if(!Object.keys(advanced).length)return 'unsupported';
  await track.applyConstraints({advanced:[advanced]});return advanced.pointsOfInterest?'point':advanced.focusMode;
 }
 root.CameraFocus={focus};
})(globalThis);
