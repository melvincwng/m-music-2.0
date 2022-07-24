// A script written to subscribe SW to push notifications

const appServerPublicKey =
  "BGcLUerHllraZvHoNt5pqzwKYX83OfU-8UubBM9RUAjHm00yj-Lb2lODVrg8xBiSGCwL9iz0hnJoZpdq13OlATs";

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
}
