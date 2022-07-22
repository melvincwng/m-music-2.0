// Take note - If you encounter the error 'Failure in Registering Service Worker', please refer below:
// In short, service workers only work in i) HTTPS or ii) localhost.
// They DO NOT work in iii) HTTP or iv) file://
// Reference: https://stackoverflow.com/questions/39136625/service-worker-registration-failed

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
  }
};
