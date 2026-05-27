const CACHE = 'portfolio-v6';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/config.js',
  './js/i18n.js',
  './js/blog.js',
  './js/certificates.js',
  './js/easter.js',
  './js/main.js',
  './js/features.js',
  './robots.txt',
  './sitemap.xml',
  './assets/favicon.svg',
  './assets/selvendran.jpg',
  './assets/selvendran.webp',
  './assets/projects/smart-home-iot.jpg',
  './assets/projects/smart-home-iot.webp',
  './assets/projects/robotic-vehicle.jpg',
  './assets/projects/robotic-vehicle.webp',
  './assets/projects/library-rfid.jpg',
  './assets/projects/library-rfid.webp',
  './assets/projects/smart-dashboard.jpg',
  './assets/projects/smart-dashboard.webp',
  './manifest.webmanifest'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => cached))
  );
});
