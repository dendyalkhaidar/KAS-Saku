// Naikkan angka versi ini setiap kali index.html diubah, supaya HP mengambil versi terbaru.
const C = 'kas-saku-v1';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
const XLSX_URL = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(C)
      .then(c => Promise.all([c.addAll(ASSETS), fetch(XLSX_URL).then(r => c.put(XLSX_URL, r)).catch(() => {})]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== C).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit =>
      hit || fetch(e.request).then(r => {
        if (r && r.ok) { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); }
        return r;
      }).catch(() => caches.match('./index.html'))
    )
  );
});
