// Service Worker — 混凝土強度預測系統 AOA-SVR v2.0
const CACHE_NAME = 'concrete-aoa-svr-v2';
const ASSETS = [
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/icon-maskable-512x512.png',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;600;700&family=JetBrains+Mono:wght@400;700&family=Noto+Sans+TC:wght@300;400;500;700&display=swap'
];

// Install: cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS.filter(u => !u.startsWith('http')));
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first for local, network-first for CDN
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const isLocal = url.origin === self.location.origin;

  if (isLocal) {
    // Cache-first strategy
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => caches.match('/index.html'));
      })
    );
  } else {
    // Network-first for external resources (CDN fonts, chart.js)
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
