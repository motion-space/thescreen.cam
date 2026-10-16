// Reproducible local Chromium CPU profile and frame-time benchmark.
// node scripts/profile-scroll.mjs baseline [http://localhost:4399] [deviceScaleFactor]
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { statSync, createReadStream, existsSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve, join } from 'node:path';
const label = process.argv[2] ?? 'profile';
const url = process.argv[3] ?? 'http://localhost:4399';
const scale = Number(process.argv[4] ?? 2);
const cpuRate = Number(process.env.PROFILE_CPU_RATE ?? process.argv[5] ?? 1);
const samplingUs = Number(process.env.PROFILE_SAMPLING_US ?? (process.argv.includes("--low-overhead") ? 10000 : 1000));
const extended = process.env.PROFILE_EXTENDED === '1';
const cold = (process.env.PROFILE_COLD_MEDIA === '1' || process.argv.includes('--cold'));
const out = resolve('tmp/perf');
mkdirSync(out, { recursive: true });
const cache = join(homedir(), 'Library/Caches/ms-playwright');
const installedChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const cached = existsSync(cache) ? readdirSync(cache).filter(x=>/^chromium-\d+$/.test(x)).sort((a,b)=>Number(b.split('-')[1])-Number(a.split('-')[1])).map(x=>join(cache,x,'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing')).find(existsSync) : undefined;
const chrome = process.env.PROFILE_CHROME ?? (existsSync(installedChrome) ? installedChrome : cached);
if (!chrome) throw new Error('Set PROFILE_CHROME to a local Chromium executable');
let staticServer;
if(new URL(url).port==='4400') {
 const root=resolve('dist');
 staticServer=createServer((req,res)=>{
  let file=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname));
  if(!file.startsWith(root+'/')){res.writeHead(403).end();return;}
  try{if(statSync(file).isDirectory())file=join(file,'index.html');const size=statSync(file).size;
   const type={html:'text/html',js:'text/javascript',css:'text/css',png:'image/png',webp:'image/webp',svg:'image/svg+xml',mp4:'video/mp4',woff2:'font/woff2'}[file.split('.').pop()]??'application/octet-stream';
   const match=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
   const start=match?Number(match[1]):0,end=match&&match[2]?Math.min(size-1,Number(match[2])):size-1;
   if(start>=size||start>end){res.writeHead(416,{'Content-Range':`bytes */${size}`}).end();return;}
   res.writeHead(match?206:200,{'Content-Type':type,'Content-Length':end-start+1,'Accept-Ranges':'bytes',...(match?{'Content-Range':`bytes ${start}-${end}/${size}`}:{})});
   createReadStream(file,{start,end}).pipe(res);
  }catch{res.writeHead(404).end();}
 });
 await new Promise((resolve,reject)=>{staticServer.once('error',reject);staticServer.listen(4400,'127.0.0.1',resolve);});
}
const port = 20000 + Math.floor(Math.random()*30000);
const child = spawn(chrome, ['--headless=new', '--enable-gpu', '--use-angle=metal', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port='+port, '--user-data-dir='+resolve(out, (cold ? 'chromium-cold-' : 'chromium-warm-')+label), 'about:blank'], {stdio:'ignore'});
const sleep = ms => new Promise(r=>setTimeout(r,ms));
let socket;
const runtimeErrors=[];
try {
 let endpoint;
 for(let i=0;i<100;i++) { try {endpoint=await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();break;} catch {await sleep(100);} }
 if(!endpoint)throw new Error('Chromium did not start');
 socket=new WebSocket(endpoint.webSocketDebuggerUrl);
 await new Promise((r,j)=>{socket.onopen=r;socket.onerror=j;});
 let next=0;const pending=new Map();const traceEvents=[];let traceDone;
 socket.onmessage=({data})=>{const m=JSON.parse(data);if(m.method==='Runtime.exceptionThrown')runtimeErrors.push(m.params.exceptionDetails.text+": "+(m.params.exceptionDetails.exception?.description??""));if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error'&&runtimeErrors.length<50)runtimeErrors.push(m.params.args.map(x=>x.value??x.description).join(" "));if(m.method==='Tracing.dataCollected')traceEvents.push(...m.params.value);if(m.method==='Tracing.tracingComplete')traceDone?.();if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p?.reject(new Error(JSON.stringify(m.error))):p?.resolve(m.result);}};
 const call=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const id=++next;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params,sessionId}));});
 const {targetId}=await call('Target.createTarget',{url:'about:blank'});
 const {sessionId}=await call('Target.attachToTarget',{targetId,flatten:true});
 const send=(m,p)=>call(m,p,sessionId);
 const evaluate=async(expression)=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 await send('Page.enable'); await send('Runtime.enable'); await send('Performance.enable');
 await send('Emulation.setDeviceMetricsOverride',{width:1280,height:900,deviceScaleFactor:scale,mobile:false});
 if(cpuRate !== 1) await send('Emulation.setCPUThrottlingRate',{rate:cpuRate});
 if(process.env.PROFILE_DISABLE_WEBGPU==='1') await send('Page.addScriptToEvaluateOnNewDocument',{source:"Object.defineProperty(Navigator.prototype,'gpu',{get:()=>undefined})"});
 if(process.env.PROFILE_DISABLE_VIDEO==='1') await send('Page.addScriptToEvaluateOnNewDocument',{source:"HTMLMediaElement.prototype.play=function(){return Promise.resolve()}"});
 await send('Page.addScriptToEvaluateOnNewDocument',{source:'window.__xpMeasures=[]'});
 if(cold) { await send('Network.enable'); await send('Network.setCacheDisabled',{cacheDisabled:true}); }
 if(process.argv.includes('--block-fonts')) {await send('Network.enable');await send('Network.setBlockedURLs',{urls:['*fonts.googleapis.com*','*fonts.gstatic.com*']});}
 const navigation=await send('Page.navigate',{url});
 if(navigation.errorText)throw Error('Navigation failed: '+navigation.errorText);
 for(let i=0;i<100;i++){if(await evaluate('!!document.querySelector(".xp-canvas") && (!!window.__xp || !!document.querySelector(".xp canvas + canvas"))'))break;await sleep(100);}
 if(!await evaluate('!!document.querySelector(".xp-canvas")'))throw Error(JSON.stringify({message:"Experience did not load",page:await evaluate("({url:location.href,title:document.title,body:document.body?.innerText.slice(0,300)})"),runtimeErrors}));
 await sleep(2500);
 const initialReadiness=await evaluate("({readyState:document.readyState,fonts:document.fonts.status})");
 const renderer=await evaluate(`(()=>{const c=document.createElement('canvas'),g=c.getContext('webgl2'),e=g?.getExtension('WEBGL_debug_renderer_info');return {renderer:e?g.getParameter(e.UNMASKED_RENDERER_WEBGL):null,dpr:devicePixelRatio,viewport:[innerWidth,innerHeight]}})()`);
 if((process.env.PROFILE_TRACE==='1'||process.argv.includes('--trace')))await call('Tracing.start',{categories:'devtools.timeline,cc,viz,benchmark,disabled-by-default-cc.debug.scheduler',transferMode:'ReportEvents'});
 const profiled=!process.argv.includes('--frames-only');
 if(profiled){await send('Profiler.enable');await send('Profiler.setSamplingInterval',{interval:samplingUs});await send('Profiler.start');}
 const cpuBefore=await call('SystemInfo.getProcessInfo');
 const before=await send('Performance.getMetrics');
 const measurements=await evaluate(`(async()=>{
 const root=document.querySelector('.xp');const span=root.offsetHeight-innerHeight;const startedAt=performance.now();
 const stats=[],longTaskRecords=[];let longTasks=0,longTaskMs=0;
 const observer=new PerformanceObserver(list=>{for(const e of list.getEntries()){longTasks++;longTaskMs+=e.duration;longTaskRecords.push({at:e.startTime,ms:e.duration,stage:window.__profileStage});}});observer.observe({type:'longtask',buffered:false});
 const stages=[['hero',0,.025],['overview',.1,.15],['zoom',.18,.28],['3d',.3,.385],['lens',.405,.475],['captions',.49,.58],['keyboard',.6,.685],['camera',.71,.795],['screenshot',.85,.94],['below-hero',1.15,1.18]];
 if(${process.env.PROFILE_REST_ONLY==='1'}) { stages.length=0; for(const id of ['export','performance','features','docs']){const el=document.getElementById(id);if(!el)continue;const box=el.getBoundingClientRect(),top=box.top+scrollY;stages.push([id+'-section',top/span,Math.max(top,top+box.height-innerHeight*.4)/span]);} stages.push(['footer-section',(document.querySelector('footer').getBoundingClientRect().top+scrollY-innerHeight*.5)/span,(document.documentElement.scrollHeight-innerHeight)/span]); }
 if(${cold}) { const a=document.getElementById('features'),b=document.getElementById('docs'); stages.length=0; stages.push(['cold-media',(a.getBoundingClientRect().top+scrollY-innerHeight*1.5)/span,(b.getBoundingClientRect().bottom+scrollY-innerHeight*.3)/span]); }
 if(${extended} && !${cold}) { stages.push(['idle-keyboard',.65,.65],['idle-camera',.76,.76],['idle-screenshot',.9,.9],['rest-of-page',1,(document.documentElement.scrollHeight-innerHeight)/span]); }
 for(const [name,from,to] of stages){
  window.scrollTo({top:span*from,behavior:'instant'});await new Promise(r=>setTimeout(r,${cold}?0:500));
  const gaps=[],slowFrames=[];let prev; window.__profileStage=name;const start=performance.now();const duration=(name==='rest-of-page'||name==='cold-media')?10000:2200;
  await new Promise(resolve=>{const tick=now=>{if(prev){gaps.push(now-prev);if(now-prev>25)slowFrames.push({ms:now-prev,y:scrollY,at:now});}prev=now;const p=Math.min(1,(now-start)/duration);window.scrollTo({top:span*(from+(to-from)*p),behavior:'instant'});if(p<1)requestAnimationFrame(tick);else resolve();};requestAnimationFrame(tick);});
  const sorted=[...gaps].sort((a,b)=>a-b),sum=gaps.reduce((a,b)=>a+b,0);
  stats.push({name,slowFrames,visibility:document.visibilityState,focused:document.hasFocus(),frames:gaps.length,fps:1000*gaps.length/sum,p50:sorted[Math.floor(sorted.length*.5)],p95:sorted[Math.floor(sorted.length*.95)],worst:Math.max(...gaps),over33ms:gaps.filter(x=>x>33.5).length});
 }
 await new Promise(r=>setTimeout(r,20));
 observer.disconnect();return {startedAt,stats,longTasks,longTaskMs,longTaskRecords,renderCosts:window.__xpMeasures};
 })()`);
 const after=await send('Performance.getMetrics');
 const cpuAfter=await call('SystemInfo.getProcessInfo');
 const {profile}=profiled?await send('Profiler.stop'):{profile:{nodes:[],samples:[],timeDeltas:[]}};
 if((process.env.PROFILE_TRACE==='1'||process.argv.includes('--trace'))){const done=new Promise(r=>traceDone=r);await call('Tracing.end');await done;writeFileSync(resolve(out,label+'.trace.json'),JSON.stringify({traceEvents}));}
 writeFileSync(resolve(out,label+'.cpuprofile'),JSON.stringify(profile));
 const nodes=new Map(profile.nodes.map(n=>[n.id,n]));const counts=new Map();let total=0;
 for(let i=0;i<(profile.samples??[]).length;i++){const node=nodes.get(profile.samples[i]);const ms=(profile.timeDeltas?.[i]??1000)/1000;total+=ms;const f=node?.callFrame;const key=(f?.functionName||'(anonymous)')+' '+(f?.url?.split('/').slice(-2).join('/')??'')+':'+((f?.lineNumber??0)+1);counts.set(key,(counts.get(key)??0)+ms);}
 const beforeM=Object.fromEntries(before.metrics.map(m=>[m.name,m.value]));
 const delta=Object.fromEntries(after.metrics.map(m=>[m.name,m.value-(beforeM[m.name]??0)]));
 const beforeCpu=new Map(cpuBefore.processInfo.map(p=>[p.id,p.cpuTime]));
 const processCpuPercent={};
 for(const p of cpuAfter.processInfo){const percent=100*(p.cpuTime-(beforeCpu.get(p.id)??p.cpuTime))/delta.Timestamp;processCpuPercent[p.type]=(processCpuPercent[p.type]??0)+percent;}
 const summary={pageIntegrity:await evaluate(`({url:location.href,experience:!!document.querySelector(".xp-canvas"),camera:!!document.querySelector("video[data-camera-loop]")})`),initialReadiness,finalReadiness:await evaluate("({readyState:document.readyState,fonts:document.fonts.status})"),blockedFonts:process.argv.includes('--block-fonts'),profiled,runtimeErrors,label,url,cpuRate,samplingUs,extended,renderer,measurements,processCpuPercent,rendererMainThreadBusyPercent:100*delta.TaskDuration/delta.Timestamp,scriptSeconds:delta.ScriptDuration,layoutSeconds:delta.LayoutDuration,styleSeconds:delta.RecalcStyleDuration,heapMB:after.metrics.find(m=>m.name==='JSHeapUsedSize')?.value/1048576,hotspots:[...counts].sort((a,b)=>b[1]-a[1]).slice(0,24).map(([frame,ms])=>({frame,ms,pct:100*ms/total}))};
 if(!summary.pageIntegrity.experience || !summary.pageIntegrity.camera || runtimeErrors.length){writeFileSync(resolve(out,label+'.json'),JSON.stringify(summary,null,2));throw Error('Page integrity failed: '+JSON.stringify({page:summary.pageIntegrity,runtimeErrors}));}
 if (process.env.PROFILE_IDLE === '1') {
   summary.idle = [];
   for (const [name, progress] of [['keyboard',.65],['camera',.76],['screenshot',.9],['offscreen',1.15]]) {
     await evaluate(`window.scrollTo({top:(document.querySelector('.xp').offsetHeight-innerHeight)*${progress},behavior:'instant'})`);
     await sleep(1000);
     const c0=await call('SystemInfo.getProcessInfo'),m0=await send('Performance.getMetrics');
     await sleep(2000);
     const c1=await call('SystemInfo.getProcessInfo'),m1=await send('Performance.getMetrics');
     const values=Object.fromEntries(m0.metrics.map(m=>[m.name,m.value]));
     const changes=Object.fromEntries(m1.metrics.map(m=>[m.name,m.value-(values[m.name]??0)]));
     const oldCpu=new Map(c0.processInfo.map(p=>[p.id,p.cpuTime]));
     const cpu={};
     for(const p of c1.processInfo)cpu[p.type]=(cpu[p.type]??0)+100*(p.cpuTime-(oldCpu.get(p.id)??p.cpuTime))/changes.Timestamp;
     const camera=await evaluate(`(()=>{const v=document.querySelector('video[data-camera-loop]');return {paused:v?.paused,time:v?.currentTime}})()`);
     summary.idle.push({name,mainThreadBusyPercent:100*changes.TaskDuration/changes.Timestamp,cpu,camera});
     if(name==='camera') { const shot=await send('Page.captureScreenshot',{format:'png'});writeFileSync(resolve(out,label+'-camera.png'),Buffer.from(shot.data,'base64')); }
   }
 }
 if (process.env.PROFILE_VALIDATE_MASK === '1') {
   summary.maskValidation = await evaluate(`(async()=>{
     const {CameraMaskGL}=await import('/src/components/experience/camera-gl.ts');
     const video=document.querySelector('video[data-camera-loop]');
     const renderer=new CameraMaskGL(),canvas=renderer.render(video),gl=canvas.getContext('webgl');
     const w=canvas.width,h=canvas.height,gpu=new Uint8Array(w*h*4);
     gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,gpu);
     const source=document.createElement('canvas');source.width=w*2;source.height=h;
     const ctx=source.getContext('2d',{willReadFrequently:true});ctx.drawImage(video,0,0);
     const cpu=ctx.getImageData(0,0,w*2,h).data;
     let sum=0,max=0,transparent=0,opaque=0;
     for(let y=0;y<h;y++)for(let x=0;x<w;x++){
       const expected=Math.round(Math.max(0,Math.min(255,(cpu[(y*w*2+x+w)*4]-4)*255/247)));
       const actual=gpu[((h-1-y)*w+x)*4+3];const delta=Math.abs(expected-actual);
       sum+=delta;max=Math.max(max,delta);if(actual===0)transparent++;if(actual===255)opaque++;
     }
     renderer.dispose();return {meanAlphaError:sum/(w*h),maxAlphaError:max,transparentPixels:transparent,opaquePixels:opaque};
   })()`);
 }
 if((process.env.PROFILE_SCREENSHOTS==='1'||process.argv.includes('--shots'))) {
   for(const [name,progress] of [['zoom',.26],['3d',.35],['lens',.455],['captions',.535],['keyboard',.65],['camera',.76],['screenshot',.9]]){
     await evaluate(`window.scrollTo({top:(document.querySelector('.xp').offsetHeight-innerHeight)*${progress},behavior:'instant'})`);
     await sleep(600);
     const shot=await send('Page.captureScreenshot',{format:'png'});writeFileSync(resolve(out,label+'-'+name+'.png'),Buffer.from(shot.data,'base64'));
   }
 }
 writeFileSync(resolve(out,label+'.json'),JSON.stringify(summary,null,2));
 console.log(JSON.stringify({label, cpuRate, samplingUs, busy:summary.rendererMainThreadBusyPercent,longTasks:measurements.longTasks,stages:measurements.stats.map(s=>({name:s.name,fps:s.fps,p95:s.p95,worst:s.worst}))},null,2));
} finally {socket?.close();child.kill('SIGTERM');staticServer?.close();}
