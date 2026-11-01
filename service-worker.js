// Service Worker for Lyric Film Studio - Offline v5
// Handles adjacent demo-assets folder for web deployment
// Cache version - bump to force update
const CACHE_NAME = 'index.html';
const APP_SHELL = [
  './',
  './index.html'
];

const DEMO_ASSETS_FOLDER = 'demo-assets';
const DEMO_ASSETS = [
  `./${DEMO_ASSETS_FOLDER}/demo-song.mp3`,
  `./${DEMO_ASSETS_FOLDER}/intro_verse1.webp`,
  `./${DEMO_ASSETS_FOLDER}/chorus.webp`,
  `./${DEMO_ASSETS_FOLDER}/verse2.webp`,
  `./${DEMO_ASSETS_FOLDER}/bridge.webp`,
  `./${DEMO_ASSETS_FOLDER}/outro.webp`
];

const OFFLINE_URLS = [...APP_SHELL, ...DEMO_ASSETS];

self.addEventListener('install', (event) => {
  console.log('[LyricFilm SW] Install v5 - caching app shell + demo-assets');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS.map(url => new Request(url, {cache: 'no-cache'}))).catch(err => {
        console.warn('[LyricFilm SW] addAll failed, trying individually:', err);
        return Promise.allSettled(
          OFFLINE_URLS.map(u => 
            cache.add(new Request(u, {cache: 'no-cache'}))
              .catch(e => console.warn('[LyricFilm SW] failed to cache', u, e))
          )
        );
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  console.log('[LyricFilm SW] Activate - cleaning old caches');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => {
          console.log('[LyricFilm SW] Deleting old cache', k);
          return caches.delete(k);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  
  const url = new URL(req.url);
  
  // Check if request is for demo-assets folder (adjacent folder)
  const isDemoAsset = url.pathname.includes(`/${DEMO_ASSETS_FOLDER}/`) || 
                      url.pathname.endsWith(`/${DEMO_ASSETS_FOLDER}`) ||
                      DEMO_ASSETS.some(path => url.pathname.endsWith(path.replace('./','')) || url.href.includes(path.replace('./','')));
  
  const isAppShell = APP_SHELL.some(path => 
    url.pathname.endsWith(path.replace('./','')) || 
    url.href.endsWith(path) ||
    url.pathname === '/' || url.pathname.endsWith('/index.html')
  );

  if (isDemoAsset) {
    // For demo-assets: cache-first, then network, then update cache
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) {
          // Update in background (stale-while-revalidate)
          fetch(req).then(res => {
            if (res.ok) caches.open(CACHE_NAME).then(c => c.put(req, res));
          }).catch(()=>{});
          return cached;
        }
        // Not in cache, try network
        return fetch(req).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(req, clone));
          }
          return res;
        }).catch(() => {
          console.warn('[LyricFilm SW] demo asset fetch failed', req.url);
          return caches.match(req);
        });
      })
    );
    return;
  }

  if (isAppShell) {
    // For app shell: cache-first
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) {
          fetch(req).then(res => {
            if (res.ok) caches.open(CACHE_NAME).then(c => c.put(req, res));
          }).catch(()=>{});
          return cached;
        }
        return fetch(req).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(req, clone));
          }
          return res;
        }).catch(() => caches.match(req));
      })
    );
    return;
  }
  
  // For everything else (including ./demo-assets/* not in list, fonts, etc): network-first fallback to cache
  event.respondWith(
    fetch(req).then((res) => {
      // Optionally cache successful GETs for offline
      if (res.ok && req.url.startsWith(self.location.origin)) {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, clone));
      }
      return res;
    }).catch(() => caches.match(req))
  );
});
