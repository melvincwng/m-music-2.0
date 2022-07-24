// A script written to subscribe SW to push notifications

const appServerPublicKey =
  "BFvUCOBUgo5pVyfD8IZAHYZJt3t99svMMIfyTBELOmiLvTDAL3g-oE30u7jEYUJUPY7TJqRs39Cv97tLTQ27nbA";

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

  // When service worker receivesa message - see sw.js, this block of code runs
  navigator.serviceWorker.addEventListener("message", function (event) {
    console.log("[Client] Received From Service Worker: " + event.data);
    if (event.data) {
      const notificationList = document.getElementById("ul_notifications_list");
      notificationList.innerHTML = "<li>" + event.data + "</li>";
    }
  });
}
