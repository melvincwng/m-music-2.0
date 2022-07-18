function loadGoogleMaps(songID) {
  // Step 0 - Need to do these steps 0 first beforehand to ensure a smooth SPA experience
  // Else if user e.g. already loaded song 1's coordinates --> then proceed to go to song 2's coordinates
  // User will see song 1's map first, before being prompted to load song 2's map, then user can then see song 2's map (not very intuitive UI-wise)
  // Hence, we add a loader component such that every time this function is called --> a loader UI component appears on the screen
  // Once your Google Maps is fully instantiated, then this loader component will automatically get over-ridden & replaced by a Google Maps <div></div> (logic from Google Maps API)
  const googleMapElement = document.getElementById("div_product_map");
  googleMapElement.innerHTML =
    '<img src="./assets/img/loading.gif" id="loader">';
  const floatingPanelElement = document.getElementById("floating-panel");
  floatingPanelElement.style.display = "none";
  let arrayOfMarkers = [];

  // Step 1 - Check if localStorage contains previously saved/stored map_coordinates for that particular song.
  // If yes, take it out from localStorage. Else if no, create a new array
  let gmapCoordsArray = [];
  if (!localStorage[`song_${songID}_map_coordinates`]) {
    gmapCoordsArray = [];
  } else {
    gmapCoordsArray = JSON.parse(
      localStorage[`song_${songID}_map_coordinates`]
    );
  }

  // Step 2 - Check if the browser is able to use geolocation functionalities (Older browswers do not have window.navigator.geolocation)
  // If able to use geolocation, we use it to get the currentPosition of the user & store it in a variable 'gmapCoords'
  // Then later we will use that lat/lng coordinates ('gmapCoords') to initialize the starting point of google maps
  let gmapCoords;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (data) {
      gmapCoords = { lat: data.coords.latitude, lng: data.coords.longitude };
      initMap();
    });
  }

  // Step 3 - Time to initialize and load up your google maps
  let map;
  function initMap() {
    // 3a) Loading up your google maps --> make sure to set certain CSS property like width & height first for the map to appear
    map = new google.maps.Map(googleMapElement, {
      center: gmapCoords,
      zoom: 14,
    });

    // 3b) Instantiate a Google Map Marker using the user's current position & pinpoint it on the map
    const currentLocationMarker = new google.maps.Marker({
      position: gmapCoords,
      map,
      title: "Current position",
      label: "You are here!",
    });
    arrayOfMarkers.push(currentLocationMarker);

    // 3c) If gmapsCoordsArray = [], this code block won't run --> no markers get added on screen
    // If localStorage previously had coords stored, gmapCoordsArray = [{lat: '', lng:''}...], hence we Load up all the markers object stored in the localStorage onto the map
    for (i = 0; i < gmapCoordsArray.length; i++) {
      const marker = new google.maps.Marker({
        position: gmapCoordsArray[i],
        map,
      });

      // This is for the floating panel functionality (delete, hide, show markers)
      arrayOfMarkers.push(marker);
    }

    // 3d) Add a click event listener to the map so that when the user clicks on the map, more Google Map markers can be added onto the map
    // We then store newly added coordinates/markers into the gmapCoordsArray and save it for future uses
    map.addListener("click", function (event) {
      const marker = new google.maps.Marker({
        position: event.latLng,
        map,
      });
      gmapCoordsArray.push(event.latLng);
      localStorage[`song_${songID}_map_coordinates`] =
        JSON.stringify(gmapCoordsArray);

      // This is for the floating panel functionality (delete, hide, show markers)
      arrayOfMarkers.push(marker);
    });

    // 3e) Add event listeners for the 3 buttons in the floating-panel element.
    // These buttons delete, show, and hide the markers.
    // Reference from Google Maps Documentation: https://developers.google.com/maps/documentation/javascript/examples/marker-remove
    document
      .getElementById("delete-markers")
      .addEventListener("click", deleteMarkers);
    document
      .getElementById("show-markers")
      .addEventListener("click", showMarkers);
    document
      .getElementById("hide-markers")
      .addEventListener("click", hideMarkers);

    // Sets the map on all markers in the array.
    function setMapOnAll(map = null) {
      for (let i = 0; i < arrayOfMarkers.length; i++) {
        arrayOfMarkers[i].setMap(map);
      }
    }
    // Deletes all markers in the array by removing references to them.
    function deleteMarkers() {
      hideMarkers();
      arrayOfMarkers = [];
      localStorage.removeItem(`song_${songID}_map_coordinates`);
    }
    // Removes the markers from the map, but keeps them in the array.
    function hideMarkers() {
      setMapOnAll(null);
    }
    // Shows any markers currently in the array.
    function showMarkers() {
      setMapOnAll(map);
    }

    // 3f) Once everything in your Google Map is loaded --> load this UI component & make it appear
    floatingPanelElement.style.display = "block";
  }
}
