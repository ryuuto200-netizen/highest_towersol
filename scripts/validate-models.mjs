import fs from 'node:fs';
// Validate every generated mesh with a minimal offscreen texture surface.
globalThis.document={createElement:()=>({width:256,height:1024,getContext:()=>({fillRect(){},beginPath(){},arc(){},fill(){},moveTo(){},lineTo(){},stroke(){}})})};
const {makeModel}=await import('../models.js');
const items=JSON.parse(fs.readFileSync(new URL('../data.json',import.meta.url))).items;
for(const night of [false,true])for(const item of items){const model=makeModel(item,night);model.updateMatrixWorld(true);let meshCount=0;model.traverse(o=>{if(!o.isMesh)return;meshCount++;const p=o.geometry.attributes.position.array;if(!Array.from(p).every(Number.isFinite))throw Error(item.name+' non-finite geometry')});if(!meshCount)throw Error(item.name+' missing mesh')}
console.log('PASS: all 100 models generate finite 3D geometry in day and night modes');
