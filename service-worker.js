// SongStar V22/V23 - Fixed Service Worker - works with any HTML filename
const CACHE_NAME = 'songstar-v31-tulip-1'; // bump this on each release
// Don't hardcode index.html - cache root and current page, whatever it's called
const APP_SHELL = [
  './'
  // './index.html' removed - was causing 404 when file is named SongStar-V23-...html
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

const OFFLINE_URLS = [...APP_SHELL]; // Don't pre-cache demo-assets - cache on demand, avoids 404 spam

self.addEventListener('install', (event) => {
  console.log('[SW] Install', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Try to cache root, but don't fail install if it 404s
      return cache.addAll(OFFLINE_URLS.map(url => new Request(url, {cache: 'no-cache'}))).catch(err => {
        console.log('[SW] Some files not found, caching what we can:', err.message);
        return Promise.allSettled(
          OFFLINE_URLS.map(u => 
            cache.add(new Request(u, {cache: 'no-cache'}))
              .catch(e => console.log('[SW] Skipping', u))
          )
        );
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activate - cleaning old caches');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => {
          console.log('[SW] Deleting old cache', k);
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

  // --- FIX 1: JSON files - never return HTML, always return valid JSON ---
  if (url.pathname.endsWith('.json')) {
    event.respondWith(
      fetch(req).then(res => {
        // If server returned HTML instead of JSON (SPA fallback), treat as fail
        const contentType = res.headers.get('content-type') || '';
        if (!res.ok || contentType.includes('text/html')) {
          throw new Error('json not found, got html');
        }
        // Cache good json for offline
        if (res.ok && req.url.startsWith(self.location.origin)) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, clone));
        }
        return res;
      }).catch(() => {
        // Try cache, else return empty valid JSON - prevents "<!doctype" crash
        return caches.match(req).then(cached => {
          if (cached) return cached;
          return new Response('{}', {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        });
      })
    );
    return;
  }

  // --- FIX 2: favicon.ico - return 204 if missing, never undefined ---
  // Note: 204 must have null body, not empty string
  if (url.pathname.endsWith('favicon.ico')) {
    event.respondWith(
      fetch(req).then(r => r.ok ? r : new Response(null, {status: 204}))
        .catch(() => caches.match(req).then(c => c || new Response(null, {status: 204})))
    );
    return;
  }
  
  const isDemoAsset = url.pathname.includes(`/${DEMO_ASSETS_FOLDER}/`) || 
                      url.pathname.endsWith(`/${DEMO_ASSETS_FOLDER}`) ||
                      DEMO_ASSETS.some(path => url.pathname.endsWith(path.replace('./','')) || url.href.includes(path.replace('./','')));
  
  const isAppShell = APP_SHELL.some(path => 
    url.pathname.endsWith(path.replace('./','')) || 
    url.href.endsWith(path) ||
    url.pathname === '/' || url.pathname.endsWith('/index.html')
  );

  if (isDemoAsset) {
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
        }).catch(() => {
          return caches.match(req).then(c => c || new Response('', {status: 404}));
        });
      })
    );
    return;
  }

  if (isAppShell) {
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
        }).catch(() => {
          return caches.match(req).then(c => c || new Response('Offline', {status: 503}));
        });
      })
    );
    return;
  }
  
  // --- FIX 3: everything else - NEVER return undefined ---
  event.respondWith(
    fetch(req).then((res) => {
      if (res.ok && req.url.startsWith(self.location.origin)) {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, clone));
      }
      return res;
    }).catch(() => {
      return caches.match(req).then(cached => {
        if (cached) return cached;
        // Final fallback - always a Response, never undefined
        return new Response('', {status: 404, statusText: 'Not found'});
      });
    })
  );
});
