// A script written to subscribe SW to push notifications

const appServerPublicKey =
  "BDotpM-8lS3Lju79JentgTCQqonfAWKIeODgsOL5UvU6CzW135RLNAXox7wBeZ-tCwCwsWAxW-nHXBEvMPwgWsE";

function convert(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

if ("PushManager" in window) {
  navigator.serviceWorker.ready.then(function (registration) {
    registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: convert(appServerPublicKey),
      })
      .then(function (subscription) {
        console.log("Endpoint: ", JSON.stringify(subscription));
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  // When client receives a message - see sw.js lines 145-153, then this block of code runs
  // In short try to visualize here --> at this point, 1 whole message cycle is complete from the service worker to the client
  // In summary: sw receive push notification --> grabs the data, and send to the client --> sw sends a msg to client (via postMessage method) --> triggers a 'msg' event --> which is captured by the client to then add <li></li> in the DOM
  navigator.serviceWorker.addEventListener("message", function (event) {
    console.log("[Client] Received From Service Worker: " + event.data);
    if (event.data) {
      const notificationList = document.getElementById("ul_notifications_list");
      notificationList.innerHTML = "<li>" + event.data + "</li>";
    }
  });
}
