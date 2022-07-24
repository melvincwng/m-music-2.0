// Take note - If you encounter the error 'Failure in Registering Service Worker', please refer below:
// In short, service workers only work in i) HTTPS or ii) localhost.
// They DO NOT work in iii) HTTP or iv) file://
// Reference: https://stackoverflow.com/questions/39136625/service-worker-registration-failed

// Additional notes:
// Use Google LightHouse Report to check your sw.js & manifest.json are working properly to make your website into a PWA.
// When you generate the lighthouse report, and see that your website IS NOT a PWA (no 'install' button), notice this issue/error message in the report:
//  - "No matching service worker detected.
//  - You may need to reload the page, or check that the scope of the service worker for the current page encloses the scope and start URL from the manifest."
// Essentially this means that the A) SCOPE of your sw.js DOES NOT ENCLOSE the B) SCOPE & START_URL of your manifest.json (aka not in sync)
// Reference 5 below provides a GREAT EXPLANATION but in short --> in my hosted website 'melvincwng.github.io/m-music' (this is my sw.js's scope) --> but my manifest.json scope and start_url is '/' (aka melvincwng.github.io)
// Hence need to change the manifest.json's scope and start_url to './' --> such that this changes the manifest's scope & start_url to 'melvincwng.github.io/m-music' which NOW MATCHES scope of sw.js --> can install as PWA :)
// Helpful References:
// 1. https://stackoverflow.com/questions/55494335/does-serviceworker-js-need-to-load-from-the-root
// 2. https://stackoverflow.com/questions/45534076/site-cannot-be-installed-no-matching-service-worker-detected
// 3. https://stackoverflow.com/questions/35780397/understanding-service-worker-scope/48068714#48068714
// 4. https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#why_is_my_service_worker_failing_to_register
// 5. https://stackoverflow.com/questions/45412014/how-do-i-set-the-start-url-of-a-manifest-json-to-be-the-root-of-the-site

const appServerPublicKey =
  "BC_4H4LpdfY4lugJcSYSdXZswDOc0x2o5ZuboxG2CSJYpZbBOJfi_IvO4tMjbs_zl47rnGSLVVNebtppjxXe5NA";

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

window.onload = function () {
  if (!("serviceWorker" in navigator)) {
    console.log("Service Worker not supported.");
  } else {
    navigator.serviceWorker
      .register("sw.js")
      .then(function () {
        console.log("Registered Service Worker.");
      })
      .catch(function () {
        console.log("Failure in Registering Service Worker.");
      });

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
  }
};
