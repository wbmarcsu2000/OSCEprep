/*
 * ClerkTools service worker.
 *
 * Strategy is split by request type, because one network-first rule was wrong
 * for most of what this app serves:
 *
 *  - /assets/*  → CACHE FIRST. Vite content-hashes these filenames, so a hit is
 *    immutable by construction and there is nothing to revalidate. Under the old
 *    network-first rule a returning student re-downloaded the ~2.4 MB gzip main
 *    chunk on every launch, and on hospital wifi that is slow-but-alive (or a
 *    captive portal that stalls rather than rejects) `fetch` never threw, so the
 *    cache fallback never fired and the app hung with a perfectly good copy
 *    sitting in Cache Storage.
 *  - everything else (navigations, manifest, icons) → network first, but racing
 *    a timeout so a stalled connection falls back to cache instead of hanging.
 *
 * Bump CACHE to invalidate.
 */
const CACHE = "clerktools-v2";

/** How long to wait on the network before serving a cached copy, if we have one. */
const NETWORK_TIMEOUT_MS = 3500;

/** Scope path — e.g. "/OSCEprep/" on a GitHub Pages project site. */
const SCOPE = new URL("./", self.location).pathname;

self.addEventListener("install", (event) => {
  // Precache the shell under BOTH keys: the navigation request is for the
  // directory ("/OSCEprep/"), so the old fallback that only looked up
  // "./index.html" missed every time on Pages.
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(["./", "./index.html"]))
      .catch(() => {
        // Offline support is progressive enhancement — never block activation.
      })
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

/** Immutable build output: content-hashed by Vite, so a cache hit is always correct. */
function isImmutableAsset(url) {
  return url.pathname.startsWith(`${SCOPE}assets/`);
}

async function cacheFirst(cache, request) {
  const hit = await cache.match(request);
  if (hit) return hit;
  const fresh = await fetch(request);
  if (fresh.ok) cache.put(request, fresh.clone());
  return fresh;
}

async function networkFirstWithTimeout(cache, request) {
  const network = fetch(request).then((fresh) => {
    if (fresh.ok) cache.put(request, fresh.clone());
    return fresh;
  });

  const cached = await cache.match(request);
  if (!cached) return network; // nothing to fall back to — just wait

  // Let the network win when it is quick, otherwise serve what we have. The
  // network promise keeps running either way, so the cache still gets updated.
  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => resolve(null), NETWORK_TIMEOUT_MS);
  });
  try {
    const winner = await Promise.race([network.catch(() => null), timeout]);
    return winner || cached;
  } finally {
    clearTimeout(timer);
  }
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(SCOPE)) return; // another app on the same origin

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      try {
        return isImmutableAsset(url)
          ? await cacheFirst(cache, event.request)
          : await networkFirstWithTimeout(cache, event.request);
      } catch {
        const hit = await cache.match(event.request);
        if (hit) return hit;
        if (event.request.mode === "navigate") {
          const shell = (await cache.match("./")) || (await cache.match("./index.html"));
          if (shell) return shell;
        }
        return new Response("Offline", { status: 503, statusText: "Offline" });
      }
    }),
  );
});
