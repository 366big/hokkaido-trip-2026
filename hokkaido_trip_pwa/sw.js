const CACHE_NAME='hokkaido-trip-v1';
const APP_SHELL=['./','./index.html','./manifest.webmanifest','./icons/icon-180.png','./icons/icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  if(r.mode==='navigate'){e.respondWith(fetch(r).catch(()=>caches.match('./index.html')));return;}
  const u=new URL(r.url);
  if(u.origin===self.location.origin){
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE_NAME).then(x=>x.put(r,c));return res;}).catch(()=>caches.match(r)));
  }
});
