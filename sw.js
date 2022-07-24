// Service worker has 3 lifestyle states --> 'install', 'activate', 'fetch' (after we first 'register' it)
const CACHE_VER = "cache-v1";

// 1) During 'install' phase, we can tell the SW to open the cache and then tell it to store which specific files in the cache
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
// Else do a fetch() api call to get the actual resource --> then save that fetched resource into the cache
// FYI - Google Maps Javascript API cannot be cached! You need an internet connection for the Google Maps JS API to properly display the map.
// Reference: https://stackoverflow.com/questions/37458862/is-it-possible-to-show-google-map-without-internet-api-v3-javascript
self.addEventListener("fetch", function (event) {
  console.log("Service Worker fetching.");
  console.log("Fetch:", event.request.url);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return (
        response ||
        fetch(event.request).then(function (response) {
          // response object can only be used once --> hence need to clone it to save into cache for storage --> then return the original response object
          let responseClone = response.clone();
          caches.open(CACHE_VER).then(function (cache) {
            cache.put(event.request, responseClone);
          });
          return response;
        })
      );
    })
  );
});

self.addEventListener("push", function (event) {
  var notificationText = "New Message ✉️!";
  if (event.data) {
    notificationText = event.data.text();
  }

  const title = "M Music 2.0";
  const options = {
    body: notificationText,
    icon: "./assets/icons/icon-128x128.png",
    badge: "./assets/icons/icon-128x128.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  //What happens when clicked on Notification
  console.log("[Service Worker] Notification click Received.");

  event.notification.close();

  event.waitUntil(clients.openWindow(event.notification.data.url));
});
