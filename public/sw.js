const CACHE_NAME = "user-cache";
const MAX_CACHE_ITEMS = 30; // Maximum number of cache items

// Resources to cache
const RESOURCES_TO_PRECACHE = [
  "/", // Cache home page
  "/index.html", // Cache the HTML
  "/App.css", // Cache your CSS file
  "/main.jsx", // Cache your main JavaScript file
  // Add other assets like icons, images, etc.
];

// Install event - Precaching resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(RESOURCES_TO_PRECACHE).catch((error) => {
        console.error("Failed to cache during install:", error);
      });
    })
  );
});

// Activate event - Clean old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName); // Delete older caches
          }
        })
      )
    )
  );
});

// Fetch event - Serve cached content first, fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Return cached response if available
      }

      // Fetch from network if not cached, and cache the response
      return fetch(event.request)
        .then((response) => {
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response; // Don't cache error or opaque responses
          }

          // Clone the response before putting it in the cache
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
            manageCacheEviction(cache); // Manage cache size
          });
          return response;
        })
        .catch((error) => {
          console.error("Network request failed:", error);
        });
    })
  );
});

// Cache eviction logic (FIFO strategy)
async function manageCacheEviction(cache) {
  const keys = await cache.keys();
  if (keys.length > MAX_CACHE_ITEMS) {
    await cache.delete(keys[0]); // Remove the oldest cache item
  }
}
