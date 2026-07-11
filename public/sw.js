const CACHE = "teuteuteu-v4";
const OFFLINE_PAGE = "/offline.html";
const ASSETS = [
  OFFLINE_PAGE,
  "/teuteuteu.mp3",
  "/button-up.png",
  "/button-down.png",
  "/icon.svg",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(async () => (await caches.match(OFFLINE_PAGE)) ?? Response.error()),
    );
    return;
  }

  const path = new URL(event.request.url).pathname;
  if (ASSETS.includes(path)) {
    event.respondWith(caches.match(event.request).then((cached) => cached ?? fetch(event.request)));
  }
});
