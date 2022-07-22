// Service worker has 3 lifestyle states --> 'install', 'activate', 'fetch' (after we first 'register' it)
const CACHE_VER = "cache-v1";

// 1) During 'install' phase, we can tell the SW to open the cache and then tell it to store which specific files in the cache
// TODO- Add various files that I want it to cache
self.addEventListener("install", function (event) {
  console.log("Service Worker installing.");
  event.waitUntil(
    caches
      .open(CACHE_VER)
      .then(function (cache) {
        return cache.addAll([
          "index.html",
          "css/index.css",
          "js/ajaxAPICall.js",
          "js/clock.js",
          "js/displayPage.js",
          "js/jquery-3.6.0.min.js",
          "js/loadGoogleMaps.js",
          "js/loadServiceWorker.js",
          "js/onFirstLoad.js",
          "js/stopAudioFromPlaying.js",
          "assets/icons/icon-72x72.png",
          "assets/icons/icon-96x96.png",
          "assets/icons/icon-128x128.png",
          "assets/icons/icon-144x144.png",
          "assets/icons/icon-152x152.png",
          "assets/icons/icon-192x192.png",
          "assets/icons/icon-384x384.png",
          "assets/icons/icon-512x512.png",
          "assets/img/back_white.png",
          "assets/img/background.gif",
          "assets/img/demo.jpg",
          "assets/img/favicon.svg",
          "assets/img/loading.gif",
          "assets/img/logo.png",
          "assets/img/music.png",
          "sw.js",
          "manifest.json",
        ]);
      })
      .then(self.skipWaiting())
  );
});

// 2) During the 'activate' phase, we can tell the SW to clear out old versions of the cache
self.addEventListener("activate", function (event) {
  console.log("Service Worker activating.");
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) {
            return !key.startsWith(CACHE_VER);
          })
          .map(function (key) {
            return caches.delete(key);
          })
      );
    })
  );
});

// 3) During the last 'fetch' phase, basically what the SW is doing is that
// It is comparing whether the files stored in the cache matches the files it is going to fetch via API calls
// If it matches --> then just use the file from the cache (as dictated by the 'response' object)
// Else do a fetch() api call to get the actual resource
self.addEventListener("fetch", function (event) {
  console.log("Service Worker fetching.");
  console.log("Fetch:", event.request.url);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
