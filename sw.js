// Doc'HGE — service worker (PWA).
// Met en cache la COQUILLE APPLICATIVE uniquement (HTML, CSS, JS, images de
// l'interface). Aucune donnée patient ne transite par le réseau ni n'est mise
// en cache : les documents sont générés en mémoire, dans la page.
// VERSION est synchronisée avec APP_VERSION par tools/deploy-pages.sh.
const VERSION = "3.19";
const CACHE = "dochge-v" + VERSION;

const SHELL = [
  "./",
  "index.html",
  "css/app.css",
  "js/app.js",
  "js/render.js",
  "js/barcode.js",
  "js/doctors.js",
  "js/localdocs.js",
  "js/endoc-docs.js",
  "js/tpl-ordos.js",
  "js/tpl-fiches.js",
  "js/tpl-izinova.js",
  "js/tpl-ordotypes.js",
  "js/tpl-regimes.js",
  "js/tpl-etp.js",
  "js/tpl-parcours.js",
  "vendor/html2canvas.min.js",
  "vendor/jspdf.umd.min.js",
  "vendor/qrcode.min.js",
  "chu-logo.webp",
  "favicon.png",
  "icon-192.png",
  "icon-512.png",
  "manifest.webmanifest",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return; // jamais interceptés
  if (url.pathname.endsWith("version.json")) return; // détection de mise à jour : toujours réseau

  // stale-while-revalidate : réponse cache immédiate, rafraîchie en arrière-plan
  e.respondWith(
    caches.match(e.request, { ignoreSearch: url.pathname.endsWith("/") }).then((hit) => {
      const net = fetch(e.request)
        .then((r) => {
          if (r.ok) caches.open(CACHE).then((c) => c.put(e.request, r.clone()));
          return r;
        })
        .catch(() => hit);
      return hit || net;
    })
  );
});
