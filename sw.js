// Service Worker — 混凝土強度預測系統 AOA-SVR v2.0
const CACHE_NAME = 'Compress Strength Prediction v2.1';
const BASE = self.registration.scope;

const ASSETS = [
  'index.html',
  'manifest.json',
  'icon-192x192.png',
  'icon-512x512.png',
  'icon-maskable-512x512.png'
];

// Install: cache local assets using relative URLs
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        ASSETS.map(asset => {
          return fetch(BASE + asset).then(resp => {
            if (resp.ok) return cache.put(BASE + asset, resp);
          }).catch(() => {});
        })
      );
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

// Fetch: cache-first for same-origin, network-first for CDN
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const isLocal = url.origin === self.location.origin;

  if (isLocal) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => caches.match(BASE + 'index.html'));
      })
    );
  } else {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
