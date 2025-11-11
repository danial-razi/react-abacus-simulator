const CACHE_NAME = 'abacus-simulator-cache-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  const scopePath = new URL(self.registration.scope).pathname;
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cacheTargets = [scopePath, `${scopePath.endsWith('/') ? scopePath : `${scopePath}/`}index.html`];
      await Promise.all(
        cacheTargets.map(async (target) => {
          try {
            await cache.add(target);
          } catch {
            // Ignore failures so install does not abort when an asset is missing.
          }
        })
      );
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
          return undefined;
        })
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const networkResponse = await fetch(request);

        if (
          networkResponse &&
          networkResponse.ok &&
          networkResponse.type === 'basic' &&
          new URL(request.url).origin === self.location.origin
        ) {
          cache.put(request, networkResponse.clone());
        }

        return networkResponse;
      } catch (error) {
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
          return cachedResponse;
        }

        if (request.mode === 'navigate') {
          const scopePath = new URL(self.registration.scope).pathname;
          const fallback = await cache.match(`${scopePath.endsWith('/') ? scopePath : `${scopePath}/`}index.html`);
          if (fallback) {
            return fallback;
          }
        }

        throw error;
      }
    })()
  );
});
