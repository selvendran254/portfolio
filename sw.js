const CACHE = 'portfolio-images-v2';

const IMAGE_ASSETS = [
  './assets/favicon.svg',
  './assets/selvendran.webp',
  './assets/selvendran.jpg',
  './assets/projects/smart-home-iot.webp',
  './assets/projects/robotic-vehicle.webp',
  './assets/projects/library-rfid.webp',
  './assets/projects/smart-dashboard.webp'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(IMAGE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (!/\.(webp|jpg|jpeg|png|svg|ico|woff2?)$/i.test(url.pathname)) return;

  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(e.request).then(cached =>
        cached || fetch(e.request).then(res => {
          if (res.ok) cache.put(e.request, res.clone());
          return res;
        }).catch(() => cached)
      )
    )
  );
});
