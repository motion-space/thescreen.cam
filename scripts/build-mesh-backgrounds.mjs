// Bake the client mesh formula once, keeping the fallback mathematically identical.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {deflateSync,inflateSync} from 'node:zlib';
const source=readFileSync(new URL('../src/components/experience/background-presets.ts',import.meta.url),'utf8');
const palettes=JSON.parse(source.match(/export const MESH_PALETTES:[^=]+ = (\[.*\]);/)[1]);
const size=160, stride=size*3;
const crc32=buffer=>{let c=0xffffffff;for(const b of buffer){c^=b;for(let j=0;j<8;j++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;};
const chunk=(name,data)=>{const type=Buffer.from(name),head=Buffer.alloc(4),tail=Buffer.alloc(4);head.writeUInt32BE(data.length);tail.writeUInt32BE(crc32(Buffer.concat([type,data])));return Buffer.concat([head,type,data,tail]);};
const output=new URL('../public/feature-media/mesh-gradients/',import.meta.url);mkdirSync(output,{recursive:true});
for(let index=0;index<palettes.length;index++){
 const points=palettes[index],rgb=points.map(([, , hex])=>{const n=parseInt(hex.slice(1),16);return [(n>>16)&255,(n>>8)&255,n&255];}), pixels=new Uint8ClampedArray(size*stride);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const u=(x+.5)/size,v=(y+.5)/size;let r=0,g=0,b=0,total=0;
  points.forEach(([px,py],i)=>{const d2=(u-px)*(u-px)+(v-py)*(v-py),w=1/(d2*d2+.00001);r+=rgb[i][0]*w;g+=rgb[i][1]*w;b+=rgb[i][2]*w;total+=w;});
  const o=y*stride+x*3;pixels[o]=r/total;pixels[o+1]=g/total;pixels[o+2]=b/total;
 }
 const file=new URL(index+'.png',output);
 if(process.argv.includes('--check')){
  const png=readFileSync(file),parts=[];for(let p=8;p<png.length;){const n=png.readUInt32BE(p);if(png.toString('ascii',p+4,p+8)==='IDAT')parts.push(png.subarray(p+8,p+8+n));p+=n+12;}
  const raw=inflateSync(Buffer.concat(parts)),decoded=Buffer.alloc(pixels.length);
  for(let y=0;y<size;y++)for(let x=0;x<stride;x++){const f=raw[y*(stride+1)],left=x>=3?decoded[y*stride+x-3]:0,up=y?decoded[(y-1)*stride+x]:0;if(f!==1&&f!==2)throw Error('Unexpected PNG filter');decoded[y*stride+x]=(raw[y*(stride+1)+x+1]+(f===1?left:up))&255;}
  if(!decoded.equals(Buffer.from(pixels)))throw Error('Mesh pixel mismatch: '+index);
 }else{
  const rows=[];for(let y=0;y<size;y++){
   const candidates=[1,2].map(f=>{const row=Buffer.alloc(stride+1);row[0]=f;let score=0;for(let x=0;x<stride;x++){const prev=f===1?(x>=3?pixels[y*stride+x-3]:0):(y?pixels[(y-1)*stride+x]:0);const d=(pixels[y*stride+x]-prev)&255;row[x+1]=d;score+=Math.min(d,256-d);}return {row,score};});rows.push(candidates.sort((a,b)=>a.score-b.score)[0].row);
  }
  const header=Buffer.alloc(13);header.writeUInt32BE(size);header.writeUInt32BE(size,4);header[8]=8;header[9]=2;
  writeFileSync(file,Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(Buffer.concat(rows),{level:9})),chunk('IEND',Buffer.alloc(0))]));
 }
}
console.log(`${palettes.length} mesh textures ${process.argv.includes('--check')?'verified pixel for pixel':'generated'}`);
