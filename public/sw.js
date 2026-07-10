const CACHE = "teuteuteu-v3";
const OFFLINE_PAGE = "/__teuteuteu_offline_page__";
const ASSETS = [
  "/teuteuteu.mp3",
  "/button-up.png",
  "/button-down.png",
  "/icon.svg",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      await cache.addAll(ASSETS);
      const page = await fetch("/");
      if (page.ok) await cache.put(OFFLINE_PAGE, page);
    }),
  );
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
      fetch(event.request)
        .then(async (response) => {
          if (response.ok) await (await caches.open(CACHE)).put(OFFLINE_PAGE, response.clone());
          return response;
        })
        .catch(() => caches.match(OFFLINE_PAGE)),
    );
    return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached ?? fetch(event.request)));
});
