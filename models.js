import * as THREE from './vendor/three.module.js';
const palettes={glass:['#8faeb0','#a9c1bd'],residence:['#d1d0bd','#91aaa6'],stone:['#b9b6a3','#e3e0d2'],dark:['#526560','#bacbc0'],blue:['#7c9fae','#a0bcc5']};
const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.58,metalness:.15,...extra});
function facade(floors=45,tone='glass',seed=1,night=false){const c=document.createElement('canvas');c.width=256;c.height=1024;const x=c.getContext('2d'),p=palettes[tone]||palettes.glass;x.fillStyle=night?'#24404b':p[0];x.fillRect(0,0,256,1024);const cols=9,rows=Math.min(70,floors);for(let r=0;r<rows;r++)for(let k=0;k<cols;k++){let rand=Math.sin((r*19+k*31+seed)*78.23)*43758.54;rand-=Math.floor(rand);x.fillStyle=night?(rand>.62?'#ebd8a4':'#375969'):(k%3===0?p[1]:p[0]);x.fillRect(k*256/cols+3,r*1024/rows+2,256/cols-5,1024/rows-4)}x.fillStyle=night?'#799a9c':'#d8e0d6';for(let r=0;r<rows;r++){x.fillRect(0,r*1024/rows,256,1.4)}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
function box(g,w,h,d,y,color,x=0,z=0,map=null){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color,{map}));o.position.set(x,y+h/2,z);g.add(o);return o}
function cylinder(g,rt,rb,h,y,color,n=12,x=0,z=0){const o=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,n),mat(color));o.position.set(x,y+h/2,z);g.add(o);return o}
function rod(g,a,b,r,color){const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),v=B.clone().sub(A),o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,v.length(),4),mat(color));o.position.copy(A.add(B).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());g.add(o);return o}
function lattice(g,ys,rs,color,side=4,thin=1.1){for(let j=0;j<ys.length-1;j++){let [y0,y1]=[ys[j],ys[j+1]],[r0,r1]=[rs[j],rs[j+1]];for(let k=0;k<side;k++){let a=k/side*Math.PI*2+Math.PI/4,b=(k+1)/side*Math.PI*2+Math.PI/4,A=[Math.cos(a)*r0,y0,Math.sin(a)*r0],B=[Math.cos(a)*r1,y1,Math.sin(a)*r1],C=[Math.cos(b)*r0,y0,Math.sin(b)*r0],D=[Math.cos(b)*r1,y1,Math.sin(b)*r1];rod(g,A,B,thin,color);rod(g,A,D,thin*.58,color);rod(g,C,B,thin*.58,color);rod(g,B,D,thin*.75,color)}}}
export function makeModel(item,night=false){const g=new THREE.Group(),h=item.height,m=item.model,seed=item.order||1;g.userData.item=item;let width=50;
 const glass=(w,H,d,y,tone='glass',xx=0,zz=0)=>box(g,w,H,d,y,'#ffffff',xx,zz,facade(Math.max(4,Math.round((item.floors||45)*H/h)),tone,seed,night));
 const levels=(list)=>{for(const a of list)glass(...a)};
 if(m==='skytree'){
  width=76;lattice(g,[0,60,120,180,240,300,340],[36,30,25,20,16,13,11],'#b3c8c6',3,2.1);
  cylinder(g,21,16,18,340,'#cddcda',24);cylinder(g,21,21,3,358,'#799b9f',24);cylinder(g,17,21,8,361,'#dce7de',24);
  lattice(g,[369,400,430,450],[11,10,9,8],'#becfcb',12,.75);cylinder(g,13,11,9,445,'#d3ded7',24);cylinder(g,11,13,5,454,'#8faeaa',24);
  lattice(g,[459,475,495],[7,6,4],'#b3c8c6',8,.8);cylinder(g,4,5,80,495,'#c6d5ce',12);cylinder(g,2.2,3.2,59,575,'#d9e2dc',10);
 }else if(m==='tokyo'){
  width=110;let ys=[0,40,80,115,145,175,205,235,250],rs=[57,41,29,21,17,13,10,7,5];
  for(let i=0;i<ys.length-1;i++)lattice(g,ys.slice(i,i+2),rs.slice(i,i+2),i%3===2?'#f0ead8':'#d5653f',4,1.9-i*.12);
  box(g,42,13,38,145,'#e3daca');box(g,44,4,40,158,'#cb5a34');box(g,20,9,19,245,'#e0d4c6');
  for(let i=0;i<8;i++)cylinder(g,2.5-i*.2,3-i*.18,9.875,254+i*9.875,i%2?'#ece8d5':'#d6633b',8);
 }else if(m==='mast'){
  width=m==='mast'?120:40;cylinder(g,1.8,2.8,h,0,'#c7744f',6);for(let y=0;y<h;y+=h/12){if(Math.floor(y/(h/12))%2)cylinder(g,2.1,2.6,h/12,y,'#e4e4d6',6)}
  for(const y of [h*.35,h*.65,h*.93])for(let i=0;i<3;i++){let a=i*Math.PI*2/3;rod(g,[0,y,0],[Math.cos(a)*70,0,Math.sin(a)*70],.3,'#9aa9a2')}
 }else if(m==='lattice'||m==='pylon'){
  width=60;lattice(g,[0,h*.2,h*.4,h*.6,h*.8,h*.95],[30,24,18,12,7,4],'#b9c9c3',4,1.2);cylinder(g,2,3,h*.05,h*.95,'#c77658',6);
  if(m==='pylon')for(let y of [.65,.77,.89]){rod(g,[-30,h*y,0],[30,h*y,0],1.5,'#b9c9c3');rod(g,[-30,h*y,0],[0,h*(y+.08),0],.8,'#b9c9c3');rod(g,[30,h*y,0],[0,h*(y+.08),0],.8,'#b9c9c3')}
 }else if(m==='bridge'||m==='cablebridge'){
  width=115;const c='#bdc9c2';if(m==='bridge'){
   box(g,13,h,17,0,c,-26);box(g,13,h,17,0,c,26);for(let y of [.18,.44,.7,.94])box(g,52,7,16,h*y,c);
   box(g,200,5,38,h*.2,'#95aaa5');
   for(let side of [-1,1])for(let z of [-16,16]){let prev=null;for(let i=0;i<=16;i++){let x=side*(26+i*6.5),y=h*(.95-.70*Math.sin(i/16*Math.PI/2));let cur=[x,y,z];if(prev)rod(g,prev,cur,1.2,'#819f99');if(i%2===0)rod(g,cur,[x,h*.22,z],.35,'#9aada5');prev=cur}}
  }else{
   rod(g,[-26,0,0],[-4,h*.64,0],5,c);rod(g,[26,0,0],[4,h*.64,0],5,c);box(g,10,h*.36,13,h*.64,c);box(g,190,4,26,h*.18,c);
   for(let k=1;k<=8;k++)for(let sign of [-1,1])rod(g,[0,h*(.6+k*.04),0],[sign*k*11,h*.19,0],.4,'#92a8a3');
  }
 }else if(m==='chimney'||m==='toshima'){
  width=40;const c=m==='toshima'?'#dfe1d7':'#bdc9c4';cylinder(g,10,15,h,0,c,24);cylinder(g,10.5,10.5,2,h-2,'#7d918b',24);
  if(m!=='toshima'){for(let y of [.25,.5,.75])cylinder(g,10+(1-y)*5,10+(1-y)*5,h*.06,h*y,'#b56d58',24);for(let k=0;k<3;k++)cylinder(g,2.3,2.3,5,h-2,'#667d75',10,Math.sin(k*2.09)*5,Math.cos(k*2.09)*5)}
 }else if(m==='media'){
  width=62;glass(56,h*.43,43,0,'blue');lattice(g,[h*.43,h*.58,h*.73,h*.9],[21,16,11,5],'#b3c6c2',4,1.4);cylinder(g,2,4,h*.1,h*.9,'#aebdb6',8);for(let y of [.62,.76])box(g,27,3,24,h*y,'#d1d9d0');
 }else if(m==='fukuoka'){
  width=55;const o=new THREE.Mesh(new THREE.CylinderGeometry(12,26,h*.68,3),mat('#acccd0',{map:facade(45,'blue',seed,night),metalness:.4}));o.position.y=h*.34;g.add(o);cylinder(g,1.6,2.5,h*.32,h*.68,'#b9cdc7',8);cylinder(g,17,19,9,h*.5,'#c5d8d5',3);
 }else if(m==='azabudai'){
  width=95;levels([[92,h*.18,64,0],[86,h*.59,59,h*.18],[81,h*.13,55,h*.77],[75,h*.07,50,h*.90]]);glass(60,h*.03,39,h*.97);box(g,72,2,47,h*.965,'#91a78b');for(let k=0;k<4;k++)box(g,5,7,47,h*.95,'#c0cdc0',-30+k*20);
 }else if(m==='harukas'){
  width=94;levels([[92,h*.24,66,0,'blue'],[73,h*.28,57,h*.24,'blue',-7],[58,h*.3,44,h*.52,'blue',-14],[48,h*.18,37,h*.82,'blue',-18]]);box(g,70,3,53,h*.515,'#b2c5bf',-7);box(g,50,4,40,h*.98,'#c6d4cb',-18);
 }else if(m==='tocho'){
  width=98;glass(98,h*.47,63,0,'stone');glass(41,h*.27,49,h*.47,'stone',-27);glass(41,h*.27,49,h*.47,'stone',27);glass(32,h*.20,37,h*.74,'stone',-27);glass(32,h*.20,37,h*.74,'stone',27);glass(23,h*.06,27,h*.94,'stone',-27);glass(23,h*.06,27,h*.94,'stone',27);
 }else if(m==='landmark'){
  width=88;glass(73,h*.88,63,0,'stone');for(let x of [-1,1])for(let z of [-1,1])box(g,14,h*.93,14,0,'#c6c5b4',x*35,z*30);glass(62,h*.08,51,h*.88,'stone');box(g,51,h*.04,44,h*.96,'#bdc4b6');
 }else if(m==='docomo'){
  width=60;levels([[57,h*.56,47,0,'stone'],[47,h*.18,39,h*.56,'stone'],[35,h*.14,29,h*.74,'stone'],[24,h*.08,22,h*.88,'stone']]);cylinder(g,1,2,h*.04,h*.96,'#99ada4',8);
  const cv=document.createElement('canvas');cv.width=cv.height=128;const x=cv.getContext('2d');x.fillStyle='#f3f1dc';x.beginPath();x.arc(64,64,60,0,7);x.fill();x.strokeStyle='#334b47';x.lineWidth=6;x.beginPath();x.moveTo(64,64);x.lineTo(64,25);x.moveTo(64,64);x.lineTo(88,72);x.stroke();for(let j=0;j<12;j++){let a=j*Math.PI/6;x.fillStyle='#334b47';x.fillRect(62+Math.sin(a)*47,62+Math.cos(a)*47,4,4)}let tex=new THREE.CanvasTexture(cv);let dial=new THREE.Mesh(new THREE.PlaneGeometry(20,20),new THREE.MeshBasicMaterial({map:tex,transparent:true}));dial.position.set(0,h*.82,15.1);g.add(dial);
 }else if(m==='cocoon'){
  width=65;let geo=new THREE.SphereGeometry(1,20,25),o=new THREE.Mesh(geo,mat('#a3bfc0',{map:facade(50,'blue',seed,night)}));o.scale.set(31,h*.5,25);o.position.y=h*.5;g.add(o);
  for(let j=0;j<8;j++){let last=null;for(let k=2;k<25;k++){let t=k/26*Math.PI,y=(1-Math.cos(t))*h/2,rad=Math.sin(t),a=j/8*Math.PI*2+t*1.25;let pt=[Math.cos(a)*31.4*rad,y,Math.sin(a)*25.4*rad];if(last)rod(g,last,pt,1,'#e3e6da');last=pt}}
 }else if(m==='park'){
  width=104;for(let j=0;j<3;j++){let hh=h*(.79+j*.105),xx=(j-1)*32;glass(32,hh*.94,43,0,'stone',xx);let cone=new THREE.Mesh(new THREE.ConeGeometry(24,hh*.06,4),mat('#a8b8ac'));cone.position.set(xx,hh*.97,0);cone.rotation.y=Math.PI/4;g.add(cone)}
 }else if(m==='central'){
  width=62;const c=new THREE.Mesh(new THREE.CylinderGeometry(26,29,h*.95,20),mat('#b1c6c5',{map:facade(item.floors,'blue',seed,night)}));c.position.y=h*.475;g.add(c);cylinder(g,22,26,h*.05,h*.95,'#cbd6cc',20);
 }else if(m==='roppongi'){
  width=98;let o=new THREE.Mesh(new THREE.CylinderGeometry(40,48,h*.96,12),mat('#92a8a3',{map:facade(54,'glass',seed,night)}));o.scale.z=.78;o.position.y=h*.48;g.add(o);cylinder(g,32,39,h*.04,h*.96,'#b5c9be',12);
 }else if(m==='sumitomo'){
  width=80;let o=new THREE.Mesh(new THREE.CylinderGeometry(43,43,h*.98,3),mat('#bac9be',{map:facade(52,'stone',seed,night)}));o.position.y=h*.49;g.add(o);cylinder(g,34,42,h*.02,h*.98,'#cbd2c3',3);
 }else if(m==='sakishima'){
  width=69;glass(49,h*.89,43,0,'blue');let o=new THREE.Mesh(new THREE.CylinderGeometry(39,27,h*.08,4),mat('#bbc9bf'));o.rotation.y=Math.PI/4;o.position.y=h*.93;g.add(o);glass(44,h*.03,38,h*.97,'blue');
 }else if(m==='station'){
  width=90;glass(87,h*.22,56,0);glass(72,h*.27,50,h*.22);glass(65,h*.2,47,h*.49);glass(89,h*.31,60,h*.69);
 }else if(m==='kabuki'){
  width=61;glass(61,h*.19,47,0,'blue');glass(48,h*.71,39,h*.19,'blue');glass(36,h*.1,28,h*.9,'blue');for(let k=0;k<7;k++)box(g,2,h*(.03+.025*(k%3)),2,h*(.97-.025*(k%3)),'#91abb5',-16+k*5);
 }else if(m==='residence'){
  width=48+(seed%4)*4;glass(width,h*.96,width*.8,0,'residence');glass(width*.8,h*.04,width*.65,h*.96,'stone');for(let y=4;y<h*.96;y+=h/(item.floors||50))box(g,width+2,1,width*.8+2,y,'#d8d9ca');
 }else if(m==='sompo'){
  width=88;let ys=[0,h*.06,h*.16,h*.35,h*.95,h],ws=[88,76,66,60,60,55];for(let j=0;j<ys.length-1;j++){const geo=new THREE.CylinderGeometry(ws[j+1]/Math.SQRT2,ws[j]/Math.SQRT2,ys[j+1]-ys[j],4),o=new THREE.Mesh(geo,mat('#d0d1be',{map:facade(43,'stone',seed,night)}));o.rotation.y=Math.PI/4;o.scale.z=.7;o.position.y=(ys[j]+ys[j+1])/2;g.add(o)}
 }else{
  width=54+(seed%5)*7;const tone=['mitsui','festival'].includes(m)?'dark':['center','act','nomura','opera'].includes(m)?'stone':'glass';
  if(m==='rinku'){width=59;glass(59,h*.9,40,0,'stone');glass(46,h*.1,33,h*.9,'glass');box(g,67,h*.07,43,h*.78,'#b6c4b8');}
  else if(m==='g1'){width=37;glass(37,h*.96,30,0,'stone');box(g,37,h*.04,30,h*.96,'#b45f4f');}
  else if(['terrace','nihonbashi','shibuya','jp','yaesu','gate'].includes(m)){levels([[width+24,h*.18,width*.8+20,0,tone],[width,h*.48,width*.8,h*.18,tone],[width*.88,h*.29,width*.74,h*.66,tone], [width*.8,h*.05,width*.68,h*.95,tone]]);box(g,width+3,2,width*.8+3,h*.18,'#8ea88f');}
  else if(m==='opera'||m==='act'){glass(width,h*.94,width*.75,0,tone);let co=new THREE.Mesh(new THREE.ConeGeometry(width*.52,h*.06,4),mat('#acb6a9'));co.rotation.y=Math.PI/4;co.position.y=h*.97;g.add(co);}
  else {glass(width,h*.97,width*.76,0,tone);glass(width*.88,h*.03,width*.68,h*.97,tone);if(seed%3===0)for(let k=0;k<5;k++)box(g,1.2,h*.97,width*.76+1,0,'#d5ddd1',-width/2+k*width/4);}
 }
 g.userData.width=width;
 const floor=new THREE.Mesh(new THREE.CylinderGeometry(Math.max(40,width*.85),Math.max(40,width*.85),2,48),mat(night?'#233d42':'#d9dfcf'));floor.position.y=-2;g.add(floor);
 return g;
}
export class ModelRenderer{
 constructor(){this.scene=new THREE.Scene();this.scene.add(new THREE.HemisphereLight('#ffffff','#8b9f98',2.7));this.light=new THREE.DirectionalLight('#fff8df',3);this.light.position.set(-300,700,500);this.scene.add(this.light);this.camera=new THREE.OrthographicCamera();try{const probe=document.createElement('canvas');const gl=probe.getContext('webgl2')||probe.getContext('webgl');if(!gl)throw Error('software');gl.getExtension('WEBGL_lose_context')?.loseContext();this.renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.setClearColor('#000000',0);this.available=true}catch(e){this.available=false}}
 draw(canvas,model,{angle=-28,fit=false,night=false,height=740,offset=0}={}){const w=canvas.clientWidth||290,H=canvas.clientHeight||400,dpr=Math.min(devicePixelRatio,1.75);if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(H*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(H*dpr)}const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);
  if(!this.available){this.fallback(ctx,canvas,model,angle,fit,night);return}
  const h=model.userData.item.height,vh=fit?Math.max(h*1.2,240):height,asp=w/H;
  this.camera.left=-vh*asp/2;this.camera.right=vh*asp/2;this.camera.top=vh*.94;this.camera.bottom=-vh*.06;this.camera.near=.1;this.camera.far=5000;this.camera.position.set(0,240,1500);this.camera.lookAt(0,0,0);this.camera.updateProjectionMatrix();
  model.rotation.y=angle*Math.PI/180;model.position.x=offset;this.scene.add(model);this.renderer.setSize(w,H,false);this.renderer.render(this.scene,this.camera);ctx.drawImage(this.renderer.domElement,0,0,canvas.width,canvas.height);this.scene.remove(model);model.position.x=0;
 }
 hero(canvas,models,night=false){const w=canvas.clientWidth||500,H=canvas.clientHeight||300,dpr=Math.min(devicePixelRatio,1.75);canvas.width=Math.round(w*dpr);canvas.height=Math.round(H*dpr);if(!this.available){const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);for(let i=0;i<models.length;i++){const part=document.createElement('canvas');part.width=canvas.width/3;part.height=canvas.height;this.fallback(part.getContext('2d'),part,models[i],-28,false,night,760);ctx.drawImage(part,i*canvas.width/3,0)}return}const vh=760,asp=w/H;this.camera.left=-vh*asp/2;this.camera.right=vh*asp/2;this.camera.top=vh*.9;this.camera.bottom=-vh*.1;this.camera.near=.1;this.camera.far=5000;this.camera.position.set(0,280,1700);this.camera.lookAt(0,0,0);this.camera.updateProjectionMatrix();models.forEach((m,i)=>{m.rotation.y=-.5;m.position.x=(i-1)*vh*asp*.26;this.scene.add(m)});this.renderer.setSize(w,H,false);this.renderer.render(this.scene,this.camera);canvas.getContext('2d').drawImage(this.renderer.domElement,0,0,canvas.width,canvas.height);models.forEach(m=>{this.scene.remove(m);m.position.x=0})}
 fallback(ctx,canvas,model,angle,fit,night,viewHeight=740){
  const h=model.userData.item.height,w=canvas.width,H=canvas.height,vh=fit?Math.max(h*1.2,240):viewHeight,scale=H/vh,el=.155,co=Math.cos(el),si=Math.sin(el);
  model.rotation.y=angle*Math.PI/180;model.updateMatrixWorld(true);
  if(!model.userData.software){const list=[];model.traverse(o=>{if(!o.isMesh)return;const geo=o.geometry,pos=geo.attributes.position,uv=geo.attributes.uv,idx=geo.index,material=Array.isArray(o.material)?o.material[0]:o.material;let pixels=null,img=material.map?.image;if(img?.getContext){const ic=img.getContext('2d');pixels=ic.getImageData(0,0,img.width,img.height).data}list.push({o,pos,uv,idx,material,img,pixels})});model.userData.software=list}
  const faces=[],v=new THREE.Vector3();
  for(const a of model.userData.software){const transformed=[];for(let i=0;i<a.pos.count;i++){v.fromBufferAttribute(a.pos,i).applyMatrix4(a.o.matrixWorld);transformed.push([w/2+v.x*scale,H*.94-(v.y*co-v.z*si)*scale,v.z*co+v.y*si,v.x,v.y,v.z])}
   const n=a.idx?a.idx.count:a.pos.count;
   for(let j=0;j<n;j+=3){const ids=[0,1,2].map(k=>a.idx?a.idx.getX(j+k):j+k),p=ids.map(i=>transformed[i]),cross=(p[1][0]-p[0][0])*(p[2][1]-p[0][1])-(p[1][1]-p[0][1])*(p[2][0]-p[0][0]);if(cross>=0)continue;
    const ax=p[1][3]-p[0][3],ay=p[1][4]-p[0][4],az=p[1][5]-p[0][5],bx=p[2][3]-p[0][3],by=p[2][4]-p[0][4],bz=p[2][5]-p[0][5];let nx=ay*bz-az*by,ny=az*bx-ax*bz,nz=ax*by-ay*bx,len=Math.hypot(nx,ny,nz)||1,light=Math.max(.57,Math.min(1.13,.78+(-nx*.45+ny*.65+nz*.35)/len*.37));
    let color=a.material.color.clone(),uvs=null;if(a.img&&a.uv&&a.pixels){uvs=ids.map(i=>[a.uv.getX(i)*a.img.width,(1-a.uv.getY(i))*a.img.height]);const u=Math.max(0,Math.min(a.img.width-1,Math.round(uvs.reduce((s,x)=>s+x[0],0)/3))),vv=Math.max(0,Math.min(a.img.height-1,Math.round(uvs.reduce((s,x)=>s+x[1],0)/3))),ix=(vv*a.img.width+u)*4;color=new THREE.Color('rgb('+a.pixels[ix]+','+a.pixels[ix+1]+','+a.pixels[ix+2]+')')}
    color.multiplyScalar(light);faces.push({p,depth:(p[0][2]+p[1][2]+p[2][2])/3,color:color.getStyle(),img:a.img,uvs,light});
   }
  }
  faces.sort((a,b)=>a.depth-b.depth);
  ctx.lineJoin='round';for(const f of faces){const p=f.p;ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);ctx.lineTo(p[1][0],p[1][1]);ctx.lineTo(p[2][0],p[2][1]);ctx.closePath();ctx.fillStyle=f.color;ctx.fill();
   if(f.img&&f.uvs){const [a,b,c]=f.uvs,det=(b[0]-a[0])*(c[1]-a[1])-(c[0]-a[0])*(b[1]-a[1]);if(Math.abs(det)>1e-6){const ax=((p[1][0]-p[0][0])*(c[1]-a[1])-(p[2][0]-p[0][0])*(b[1]-a[1]))/det,bx=((p[1][1]-p[0][1])*(c[1]-a[1])-(p[2][1]-p[0][1])*(b[1]-a[1]))/det,cx=((p[2][0]-p[0][0])*(b[0]-a[0])-(p[1][0]-p[0][0])*(c[0]-a[0]))/det,dx=((p[2][1]-p[0][1])*(b[0]-a[0])-(p[1][1]-p[0][1])*(c[0]-a[0]))/det;ctx.save();ctx.clip();ctx.transform(ax,bx,cx,dx,p[0][0]-ax*a[0]-cx*a[1],p[0][1]-bx*a[0]-dx*a[1]);ctx.drawImage(f.img,0,0);ctx.restore();if(f.light<1){ctx.fillStyle='rgba(10,28,26,'+(1-f.light)+')';ctx.fill()}}}
  }
 }

 dispose(model){model.traverse(o=>{o.geometry?.dispose();if(o.material){for(let m of Array.isArray(o.material)?o.material:[o.material]){m.map?.dispose();m.dispose()}}})}
}
