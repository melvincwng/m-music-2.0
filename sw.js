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
          "js/registerServiceWorker.js",
          "js/subscribeSWToPushNotifications.js",
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

// 4) Configure additional event listener in SW to handle 'push' events (aka receiving push notifications)
self.addEventListener("push", function (event) {
  var notificationText = "New Message ✉️!";
  if (event.data) {
    notificationText = event.data.text();
  }

  // Service workers DO NOT have access to DOM elements (e.g. window.location.origin)
  // Hence use an alternative, which is self.registration.scope (scope of the registered SW)
  // Reference: https://stackoverflow.com/questions/29672213/page-urls-in-serviceworker-scope && https://stackoverflow.com/questions/49664665/window-is-not-defined-service-worker

  const title = "M Music 2.0";
  const options = {
    body: notificationText,
    icon: "./assets/icons/icon-128x128.png",
    badge: "./assets/icons/icon-128x128.png",
    data: {
      url: self.registration.scope.includes("https://melvincwng.github.io")
        ? "https://melvincwng.github.io/m-music-2.0/"
        : "http://127.0.0.1:5500/index.html",
    },
  };

  send_message_to_all_clients(notificationText);
  event.waitUntil(self.registration.showNotification(title, options));
});

// 5) Configure additional event listener in SW to handle 'notificationclick' events (aka how to handle when user clicks a push notification)
self.addEventListener("notificationclick", function (event) {
  console.log("[Service Worker] Notification click Received.");
  console.log("Redirection URL --> ", event.notification.data.url);
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});

// 6) Additional functionality - Client Messaging (transfer data between client & SW)
// For more info: https://developer.mozilla.org/en-US/docs/Web/API/Client/postMessage
function send_message_to_client(client, msg) {
  return new Promise(function (resolve, reject) {
    var msg_chan = new MessageChannel();
    msg_chan.port1.onmessage = function (event) {
      if (event.data.error) {
        reject(event.data.error);
      } else {
        resolve(event.data);
      }
    };

    // Allows the SW to send a message to the client
    client.postMessage(msg, [msg_chan.port2]);
  });
}

function send_message_to_all_clients(msg) {
  clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      send_message_to_client(client, msg);
      console.log("[Service Worker] To Client: " + msg);
    });
  });
}
