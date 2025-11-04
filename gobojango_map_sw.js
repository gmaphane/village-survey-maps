// Service Worker for Gobojango Survey Map
const CACHE_NAME = 'gobojango_map-v1';
const urlsToCache = [
  './gobojango_map.html',
  './gobojango_map_manifest.json'
];

// Install - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching files');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Fetch - serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME).then(cache => {
            // Don't cache map tiles
            if (!event.request.url.includes('tile') && 
                !event.request.url.includes('arcgis') &&
                !event.request.url.includes('openstreetmap')) {
              cache.put(event.request, responseToCache);
            }
          });
          
          return response;
        }).catch(() => caches.match(event.request));
      })
  );
});

// Activate - cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
