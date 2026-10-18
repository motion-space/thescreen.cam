// Reproducible local Chromium CPU profile and frame-time benchmark.
// node scripts/profile-scroll.mjs baseline [http://localhost:4399] [deviceScaleFactor]
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { statSync, createReadStream, existsSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve, join } from 'node:path';
function compositorStageFrames(events) {
 const marks=events.filter(e=>e.name==='TimeStamp'&&e.args?.data?.message?.startsWith('profile:'));
 return marks.filter(e=>e.args.data.message.endsWith(':start')).map(start=>{
  const name=start.args.data.message.split(':')[1];
  const end=marks.find(e=>e.pid===start.pid&&e.ts>start.ts&&e.args.data.message==='profile:'+name+':end');
  if(!end)return {name,passed:false,presented:0,dropped:0,partial:0};
  const counts={};
  for(const e of events)if(e.name==='PipelineReporter'&&e.pid===start.pid&&e.ts>=start.ts&&e.ts<=end.ts&&e.args?.frame_reporter&&e.args.frame_reporter.frame_type!=='FORKED') {
   const state=e.args.frame_reporter.state;counts[state]=(counts[state]??0)+1;
  }
  const presented=counts.STATE_PRESENTED_ALL??0,dropped=counts.STATE_DROPPED??0,partial=counts.STATE_PRESENTED_PARTIAL??0;
  return {name,presented,dropped,partial,passed:presented>=Math.floor((end.ts-start.ts)/1e6*60)-1&&dropped===0&&partial===0};
 });
}
const label = process.argv[2] ?? 'profile';
const url = process.argv[3] ?? 'http://localhost:4399';
const scale = Number(process.argv[4] ?? 2);
const viewportWidth = Number(process.env.PROFILE_WIDTH ?? 1280);
const viewportHeight = Number(process.env.PROFILE_HEIGHT ?? 900);
const cpuRate = Number(process.env.PROFILE_CPU_RATE ?? (process.argv[5]?.startsWith('--') ? 1 : process.argv[5]) ?? 1);
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
 const root=resolve(process.env.PROFILE_DIST ?? 'dist');
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
const child = spawn(chrome, ['--headless=new', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', '--enable-gpu', '--use-angle=metal', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port='+port, '--user-data-dir='+resolve(out, (cold ? 'chromium-cold-' : 'chromium-warm-')+label), 'about:blank'], {stdio:'ignore'});
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
 await send('Emulation.setDeviceMetricsOverride',{width:viewportWidth,height:viewportHeight,deviceScaleFactor:scale,mobile:false});
 if(cpuRate !== 1) await send('Emulation.setCPUThrottlingRate',{rate:cpuRate});
 if(process.env.PROFILE_DISABLE_WEBGPU==='1') await send('Page.addScriptToEvaluateOnNewDocument',{source:"Object.defineProperty(Navigator.prototype,'gpu',{get:()=>undefined})"});
 if(process.env.PROFILE_DISABLE_VIDEO==='1') await send('Page.addScriptToEvaluateOnNewDocument',{source:"HTMLMediaElement.prototype.play=function(){return Promise.resolve()}"});
 // Count actual canvas paints separately from rAF callbacks: a 30 fps demo
 // can still run inside a 60/120 Hz rAF loop and must not be reported as full-rate.
 await send('Page.addScriptToEvaluateOnNewDocument',{source:`
  window.__xpMeasures=[];window.__xpDraws={hero:0,devices:0};
  const originalClear=CanvasRenderingContext2D.prototype.clearRect,scopes=new WeakMap();
  CanvasRenderingContext2D.prototype.clearRect=function(...args){
   let scope=scopes.get(this);
   if(scope===undefined){scope=this.canvas.closest?.('.xp')?'hero':this.canvas.closest?.('#export')?'devices':'';scopes.set(this,scope)}
   if(scope)window.__xpDraws[scope]++;
   return originalClear.apply(this,args);
  };
 `});
 if(process.env.PROFILE_UPLOADS==='1') await send('Page.addScriptToEvaluateOnNewDocument',{source:`
   window.__xpUploads=[];window.__xpCanvasResizes=[];
   for(const proto of [WebGLRenderingContext.prototype,WebGL2RenderingContext.prototype])for(const method of ['texSubImage2D','texImage2D','generateMipmap']) {
     const original=proto[method];proto[method]=function(...args){const start=performance.now();const result=original.apply(this,args);const ms=performance.now()-start;
       if(ms>1){const source=args.at(-1);window.__xpUploads.push({method,ms,stage:window.__profileStage,w:source?.width??source?.videoWidth,h:source?.height??source?.videoHeight});}return result;};
   }
   for(const property of ['width','height']) {const descriptor=Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,property);
     Object.defineProperty(HTMLCanvasElement.prototype,property,{...descriptor,set(value){const start=performance.now();descriptor.set.call(this,value);const ms=performance.now()-start;if(ms>1)window.__xpCanvasResizes.push({property,ms,stage:window.__profileStage,w:this.width,h:this.height});}});
   }
 `});
 if(cold) { await send('Network.enable'); await send('Network.setCacheDisabled',{cacheDisabled:true}); }
 if(process.argv.includes('--block-fonts')) {await send('Network.enable');await send('Network.setBlockedURLs',{urls:['*fonts.googleapis.com*','*fonts.gstatic.com*']});}
 const navigation=await send('Page.navigate',{url});
 if(navigation.errorText)throw Error('Navigation failed: '+navigation.errorText);
 await send('Page.bringToFront');
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
 if(${process.env.PROFILE_VALIDATE_LENS==='1'||process.env.PROFILE_VALIDATE_CAMERA_READBACK==='1'}) stages.length=0;
 if(${process.env.PROFILE_REVERSE==='1'}) { stages.reverse(); for(const stage of stages) [stage[1],stage[2]]=[stage[2],stage[1]]; }
 if(${process.env.PROFILE_REST_ONLY==='1'}) { stages.length=0; for(const id of ['export','performance','features','docs']){const el=document.getElementById(id);if(!el)continue;const box=el.getBoundingClientRect(),top=box.top+scrollY;stages.push([id+'-section',top/span,Math.max(top,top+box.height-innerHeight*.4)/span]);} stages.push(['footer-section',(document.querySelector('footer').getBoundingClientRect().top+scrollY-innerHeight*.5)/span,(document.documentElement.scrollHeight-innerHeight)/span]); }
 if(${cold}) { const a=document.getElementById('features'),b=document.getElementById('docs'); stages.length=0; stages.push(['cold-media',(a.getBoundingClientRect().top+scrollY-innerHeight*1.5)/span,(b.getBoundingClientRect().bottom+scrollY-innerHeight*.3)/span]); }
 if(${extended} && !${cold}) { stages.push(['idle-keyboard',.65,.65],['idle-camera',.76,.76],['idle-screenshot',.9,.9],['rest-of-page',1,(document.documentElement.scrollHeight-innerHeight)/span]); }
 if (${JSON.stringify(process.env.PROFILE_STAGES ?? '')}) {const selected=${JSON.stringify((process.env.PROFILE_STAGES ?? '').split(','))};for(let i=stages.length-1;i>=0;i--)if(!selected.includes(stages[i][0]))stages.splice(i,1);}
 for(const [name,initialFrom,initialTo] of stages){
  let from=initialFrom,to=initialTo;
  if(${process.env.PROFILE_REST_ONLY==='1'}) {
   const section=name==='footer-section'?document.querySelector('footer'):document.getElementById(name.replace('-section',''));
   if(section) {
    window.scrollTo({top:section.getBoundingClientRect().top+scrollY-innerHeight,behavior:'instant'});
    // Visible islands may add a pin spacer after hydration. Measure their
    // final geometry, rather than benchmarking only the pre-hydration shell.
    await new Promise(r=>setTimeout(r,1200));
    const rect=section.getBoundingClientRect(),top=rect.top+scrollY;
    from=(name==='footer-section'?top-innerHeight*.5:top)/span;
    to=(name==='footer-section'?document.documentElement.scrollHeight-innerHeight:Math.max(top,top+rect.height-innerHeight*.4))/span;
   }
  }
  window.scrollTo({top:span*from,behavior:'instant'});await new Promise(r=>setTimeout(r,${cold}?0:500));
  console.timeStamp('profile:'+name+':start');
  const drawStart={...window.__xpDraws};
  const gaps=[],slowFrames=[];let prev; window.__profileStage=name;const start=performance.now();const duration=(name==='rest-of-page'||name==='cold-media')?10000:2200;
  await new Promise(resolve=>{const tick=now=>{if(prev){gaps.push(now-prev);if(now-prev>25)slowFrames.push({ms:now-prev,y:scrollY,at:now});}prev=now;const p=Math.min(1,(now-start)/duration);window.scrollTo({top:span*(from+(to-from)*p),behavior:'instant'});if(p<1)requestAnimationFrame(tick);else resolve();};requestAnimationFrame(tick);});
  console.timeStamp('profile:'+name+':end');
  const sorted=[...gaps].sort((a,b)=>a-b),sum=gaps.reduce((a,b)=>a+b,0);
  stats.push({name,renderedFrames:{hero:window.__xpDraws.hero-drawStart.hero,devices:window.__xpDraws.devices-drawStart.devices},slowFrames,visibility:document.visibilityState,focused:document.hasFocus(),frames:gaps.length,fps:1000*gaps.length/sum,p50:sorted[Math.floor(sorted.length*.5)],p95:sorted[Math.floor(sorted.length*.95)],worst:Math.max(...gaps),over33ms:gaps.filter(x=>x>33.5).length});
 }
 await new Promise(r=>setTimeout(r,20));
 observer.disconnect();return {startedAt,stats,longTasks,longTaskMs,longTaskRecords,renderCosts:window.__xpMeasures,gpuUploads:window.__xpUploads,canvasResizes:window.__xpCanvasResizes};
 })()`);
 const after=await send('Performance.getMetrics');
 const cpuAfter=await call('SystemInfo.getProcessInfo');
 let compositorFrames;
 const {profile}=profiled?await send('Profiler.stop'):{profile:{nodes:[],samples:[],timeDeltas:[]}};
 if((process.env.PROFILE_TRACE==='1'||process.argv.includes('--trace'))){const done=new Promise(r=>traceDone=r);await call('Tracing.end');await done;writeFileSync(resolve(out,label+'.trace.json'),JSON.stringify({traceEvents}));compositorFrames=compositorStageFrames(traceEvents);}
 writeFileSync(resolve(out,label+'.cpuprofile'),JSON.stringify(profile));
 const nodes=new Map(profile.nodes.map(n=>[n.id,n]));const counts=new Map();let total=0;
 for(let i=0;i<(profile.samples??[]).length;i++){const node=nodes.get(profile.samples[i]);const ms=(profile.timeDeltas?.[i]??1000)/1000;total+=ms;const f=node?.callFrame;const key=(f?.functionName||'(anonymous)')+' '+(f?.url?.split('/').slice(-2).join('/')??'')+':'+((f?.lineNumber??0)+1);counts.set(key,(counts.get(key)??0)+ms);}
 const beforeM=Object.fromEntries(before.metrics.map(m=>[m.name,m.value]));
 const delta=Object.fromEntries(after.metrics.map(m=>[m.name,m.value-(beforeM[m.name]??0)]));
 const beforeCpu=new Map(cpuBefore.processInfo.map(p=>[p.id,p.cpuTime]));
 const processCpuPercent={};
 for(const p of cpuAfter.processInfo){const percent=100*(p.cpuTime-(beforeCpu.get(p.id)??p.cpuTime))/delta.Timestamp;processCpuPercent[p.type]=(processCpuPercent[p.type]??0)+percent;}
 const summary={compositorFrames,pageIntegrity:await evaluate(`({url:location.href,experience:!!document.querySelector(".xp-canvas"),camera:!!document.querySelector("video[data-camera-loop]")})`),initialReadiness,finalReadiness:await evaluate("({readyState:document.readyState,fonts:document.fonts.status})"),blockedFonts:process.argv.includes('--block-fonts'),profiled,runtimeErrors,label,url,cpuRate,samplingUs,extended,renderer,measurements,processCpuPercent,rendererMainThreadBusyPercent:100*delta.TaskDuration/delta.Timestamp,scriptSeconds:delta.ScriptDuration,layoutSeconds:delta.LayoutDuration,styleSeconds:delta.RecalcStyleDuration,heapMB:after.metrics.find(m=>m.name==='JSHeapUsedSize')?.value/1048576,hotspots:[...counts].sort((a,b)=>b[1]-a[1]).slice(0,24).map(([frame,ms])=>({frame,ms,pct:100*ms/total}))};
 if(!summary.pageIntegrity.experience || !summary.pageIntegrity.camera || runtimeErrors.length){writeFileSync(resolve(out,label+'.json'),JSON.stringify(summary,null,2));throw Error('Page integrity failed: '+JSON.stringify({page:summary.pageIntegrity,runtimeErrors}));}
 if (process.env.PROFILE_VALIDATE_CAMERA_READBACK === '1') {
   summary.cameraReadbackValidation = await evaluate(`(async()=>{
     const {CameraMaskGL}=await import('/src/components/experience/camera-gl.ts');
     const video=document.createElement('video');video.muted=true;video.preload='auto';
     video.src=document.querySelector('video[data-camera-loop]').currentSrc;
     await new Promise(resolve=>video.addEventListener('loadeddata',resolve,{once:true}));
     const mask=new CameraMaskGL(), color=document.createElement('canvas');
     const w=video.videoWidth/2,h=video.videoHeight; color.width=w;color.height=h;
     const scale=Math.min(1,256/Math.max(w,h)),dw=Math.round(w*scale),dh=Math.round(h*scale);
     const capture=(source,cpu)=>{const c=document.createElement('canvas');c.width=dw;c.height=dh;
       const g=c.getContext('2d',cpu?{willReadFrequently:true}:{});g.drawImage(source,0,0,dw,dh);return g.getImageData(0,0,dw,dh).data;};
     const frames=[];
     for(const time of [.1,.7,1.5,2.3]) {
       video.currentTime=time;await new Promise(resolve=>video.addEventListener('seeked',resolve,{once:true}));
       color.getContext('2d').drawImage(video,0,0,w,h,0,0,w,h); const cutout=mask.render(video);
       for(const [kind,source] of [['color',color],['alpha',cutout]]){
         const a=capture(source,true),b=capture(source,false);let pixels=0,maxChannelError=0,totalError=0;
         for(let i=0;i<a.length;i+=4){let changed=false;for(let k=0;k<4;k++){const error=Math.abs(a[i+k]-b[i+k]);if(error)changed=true;maxChannelError=Math.max(maxChannelError,error);totalError+=error;}if(changed)pixels++;}
         frames.push({time,kind,pixels,maxChannelError,meanChannelError:totalError/a.length});
       }
     }
     mask.dispose();video.removeAttribute('src');video.load();return {width:dw,height:dh,frames};
   })()`);
 }
 if (process.env.PROFILE_VALIDATE_LENS === '1') {
   summary.lensPixelValidation = await evaluate(`(async()=>{
     const {Preview}=await import('/src/components/experience/preview.ts');
     const {createState,EW,EH}=await import('/src/components/experience/editor.ts');
     await document.fonts.ready;
     const optimized=new Preview(),reference=new Preview();
     const fullScene=reference.drawScene.bind(reference);
     reference.drawScene=(ctx,state,screen,camera,planeMode,radius,spatial)=>fullScene(ctx,state,screen,camera,planeMode,radius,spatial);
     const a=document.createElement('canvas'),b=document.createElement('canvas');
     a.width=b.width=EW*2;a.height=b.height=EH*2;
     const ca=a.getContext('2d',{willReadFrequently:true}),cb=b.getContext('2d',{willReadFrequently:true});
     const state=createState(false,'Click export and every zoom lands exactly where you placed it.');state.chrome=1;state.camera.show=false;
     const sequence=[8.4,8.41,8.6,8.94,9.0,9.49,9.5,9.6,9.8,10.04,10.59,10.6,10.7,10.99,11.0,11.2,11.39,11.4];
     let frames=0,differentPixels=0,maxChannelError=0;const failures=[];
     for(const time of [...sequence,...sequence.toReversed()]){
       state.time=time;
       for(const c of [ca,cb]){c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,a.width,a.height);c.setTransform(2,0,0,2,0,0);}
       optimized.draw(ca,state,2,14);reference.draw(cb,state,2,14);
       const x=ca.getImageData(0,0,a.width,a.height).data,y=cb.getImageData(0,0,b.width,b.height).data;
       let changed=0,maximum=0;
       for(let i=0;i<x.length;i+=4){let delta=0;for(let k=0;k<4;k++)delta=Math.max(delta,Math.abs(x[i+k]-y[i+k]));if(delta){changed++;maximum=Math.max(maximum,delta);}}
       if(changed)failures.push({time,differentPixels:changed,maxChannelError:maximum});
       differentPixels+=changed;maxChannelError=Math.max(maxChannelError,maximum);frames++;
     }
     optimized.dispose();reference.dispose();return {frames,differentPixels,maxChannelError,failures};
   })()`);
 }
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
 if (process.env.PROFILE_REQUIRE_60 === '1') {
   summary.frameBudgetVerification = measurements.stats.filter(s=>['keyboard','camera'].includes(s.name)).map(s=>({name:s.name,passed:s.fps>=59.9 && s.worst<=20 && s.renderedFrames.hero>=s.frames,fps:s.fps,worst:s.worst,painted:s.renderedFrames.hero,callbacks:s.frames+1}));
 }
 writeFileSync(resolve(out,label+'.json'),JSON.stringify(summary,null,2));
 if(summary.frameBudgetVerification && summary.compositorFrames?.some(s=>['keyboard','camera'].includes(s.name)&&!s.passed))throw Error('Compositor presentation verification failed: '+JSON.stringify(summary.compositorFrames));
 if(summary.frameBudgetVerification?.some(s=>!s.passed))throw Error('60 fps verification failed: '+JSON.stringify(summary.frameBudgetVerification));
 if(summary.lensPixelValidation?.differentPixels)throw Error('Lens pixel validation failed: '+JSON.stringify(summary.lensPixelValidation.failures));
 console.log(JSON.stringify({label, cpuRate, samplingUs, busy:summary.rendererMainThreadBusyPercent,longTasks:measurements.longTasks,stages:measurements.stats.map(s=>({name:s.name,fps:s.fps,renderedFrames:s.renderedFrames,p95:s.p95,worst:s.worst}))},null,2));
} finally {socket?.close();child.kill('SIGTERM');staticServer?.close();}
