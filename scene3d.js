import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

window.init3DScene = function(container) {
  if (!container || container.dataset.ready) return;
  container.dataset.ready = 'true';
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog('#17251b', 9, 20);
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 7.8, 9.2);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  container.appendChild(renderer.domElement);

  const resize = () => { const w=container.clientWidth, h=container.clientHeight; camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h,false); };
  new ResizeObserver(resize).observe(container); resize();
  const lookAt = new THREE.Vector3(0,0,0);
  scene.add(new THREE.HemisphereLight('#d7e8c0','#071008',2.1));
  const key = new THREE.DirectionalLight('#fff3d4',4.6); key.position.set(-4,9,5); key.castShadow=true; key.shadow.mapSize.set(2048,2048); scene.add(key);
  const rim = new THREE.PointLight('#b7ed71',13,11); rim.position.set(4,3,-2); scene.add(rim);

  const rounded = (w,h,d,r,mat) => { const shape=new THREE.Shape(); const x=-w/2,y=-h/2; shape.moveTo(x+r,y); shape.lineTo(x+w-r,y); shape.quadraticCurveTo(x+w,y,x+w,y+r); shape.lineTo(x+w,y+h-r); shape.quadraticCurveTo(x+w,y+h,x+w-r,y+h); shape.lineTo(x+r,y+h); shape.quadraticCurveTo(x,y+h,x,y+h-r); shape.lineTo(x,y+r); shape.quadraticCurveTo(x,y,x+r,y); const geo=new THREE.ExtrudeGeometry(shape,{depth:d,bevelEnabled:true,bevelSegments:3,bevelSize:.025,bevelThickness:.025}); geo.center(); const mesh=new THREE.Mesh(geo,mat); mesh.castShadow=true; mesh.receiveShadow=true; return mesh; };
  const floor = new THREE.Mesh(new THREE.CylinderGeometry(5.9,6.05,.45,96),new THREE.MeshStandardMaterial({color:'#19241b',roughness:.88,metalness:.04})); floor.scale.z=.63; floor.position.y=-.42; floor.receiveShadow=true; scene.add(floor);
  const trim = new THREE.Mesh(new THREE.TorusGeometry(4.65,.08,12,96),new THREE.MeshStandardMaterial({color:'#87b854',roughness:.45,metalness:.2})); trim.scale.z=.64; trim.rotation.x=Math.PI/2; trim.position.y=-.15; scene.add(trim);
  const felt = new THREE.Mesh(new THREE.CylinderGeometry(4.55,4.55,.12,96),new THREE.MeshStandardMaterial({color:'#29452d',roughness:1})); felt.scale.z=.64; felt.position.y=-.14; felt.receiveShadow=true; scene.add(felt);

  const makeTexture=(label,bg,fg)=>{const c=document.createElement('canvas');c.width=256;c.height=360;const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,256,360);x.strokeStyle='#ffffff66';x.lineWidth=5;x.strokeRect(14,14,228,332);x.font='bold 18px DM Mono, monospace';x.fillStyle=fg;x.fillText(label,28,42);x.font='bold 92px Space Grotesk, sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(label==='DRAW'?'?':'✦',128,180);x.font='bold 14px DM Mono, monospace';x.fillText(label,128,320);return new THREE.CanvasTexture(c)};
  const backMat=new THREE.MeshStandardMaterial({map:makeTexture('DECK','#26303b','#d9ff52'),roughness:.54});
  const cardMat=new THREE.MeshStandardMaterial({map:makeTexture('DRAW','#f27755','#211613'),roughness:.42});
  const deckGroup=new THREE.Group(); deckGroup.position.set(-.85,.08,0); deckGroup.rotation.y=-.12; scene.add(deckGroup);
  for(let i=0;i<7;i++){const card=rounded(1.52,2.22,.075, .12,backMat);card.position.y=i*.075;card.rotation.z=(i-3)*.008;deckGroup.add(card)}
  const mystery=rounded(1.52,2.22,.08,.12,cardMat); mystery.position.set(.95,.48,.1); mystery.rotation.set(-.08,.1,.11); scene.add(mystery);
  const token=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,.07,32),new THREE.MeshStandardMaterial({color:'#d9ff52',roughness:.35,metalness:.3})); token.position.set(2.5,.13,-1.3); token.rotation.x=Math.PI/2; token.castShadow=true; scene.add(token);
  const ambient=document.createElement('div');
  let t=0; const animate=()=>{requestAnimationFrame(animate);t+=.008; deckGroup.position.y=.08+Math.sin(t)*.015; mystery.position.y=.48+Math.sin(t+1)*.018; mystery.rotation.z=.11+Math.sin(t*.7)*.01; token.position.y=.13+Math.sin(t*1.6)*.025; camera.lookAt(lookAt);renderer.render(scene,camera)}; animate();
};