
const CACHE_NAME = 'sleeper-tool-cache-20250827002411';
const CORE = ['./','./index.html','./P250826235225','./P250826235225','./P250826235225'];
self.addEventListener('install', e => { 
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME && caches.delete(k)))))
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method!=='GET') return;
  e.respondWith((async()=>{
    try { 
      const net = await fetch(e.request);
      const cache = await caches.open(CACHE_NAME); cache.put(e.request, net.clone());
      return net;
    } catch { 
      const cache = await caches.open(CACHE_NAME);
      const hit = await cache.match(e.request);
      return hit || cache.match('./index.html');
    }
  })());
});
