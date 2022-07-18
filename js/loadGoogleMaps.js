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
  let arrayOfMarkers = []; // This is an array of markers on the map (which is stored as a variable in MEMORY)

  // Step 1 - Check if localStorage contains previously saved/stored map_coordinates for that particular song.
  // If yes, take it out from localStorage. Else if no, create a new array
  let gmapCoordsArray;

  function checkIfLocalStorageHasPriorMapCoordinates() {
    if (!localStorage[`song_${songID}_map_coordinates`]) {
      gmapCoordsArray = [];
    } else {
      gmapCoordsArray = JSON.parse(
        localStorage[`song_${songID}_map_coordinates`]
      );
    }
  }

  checkIfLocalStorageHasPriorMapCoordinates();

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

    // 3c) If gmapCoordsArray = [], this code block won't run --> no markers get added on screen
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
      // When you click on the map again, need to re-run this function again to make sure you get the latest updated data for gmapCoordsArray
      checkIfLocalStorageHasPriorMapCoordinates();

      const marker = new google.maps.Marker({
        position: event.latLng,
        map,
      });
      const gmapCoordsObject = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      // **ALERT** - Common cause of bug based on my observation --> TAKE NOTE there is a difference in the 2 object data types
      // Be aware of the difference between A) Google Map API Object _.De {lat: ..., lng: ...} VERSUS B) Regular JS Object {lat:..., lng:...}
      // If you save the first object (A) ---> when stringifying & saving to localStorage --> will have unexpected errors. Save second object (B) instead
      // As mentioned from SOF, "You will get a type error trying to stringify the map"... personally spent around 2 hours trying to debug...
      // Reference: https://stackoverflow.com/questions/52669437/how-can-i-turn-the-google-maps-api-map-object-into-a-json-string-for-storage-in
      console.log(
        "Take note the difference between the Google Maps object here -->",
        event.latLng
      );
      console.log("Versus a regular JS object", gmapCoordsObject);

      gmapCoordsArray.push(gmapCoordsObject);
      localStorage[`song_${songID}_map_coordinates`] =
        JSON.stringify(gmapCoordsArray);

      // This is for the floating panel functionality (delete, hide, show markers)
      arrayOfMarkers.push(marker);
    });

    // Every time a new marker is added in, this function will be re-triggered so that the newly added marker will have the delete event listener
    // Else, if never add this line of code, newly added markers cannot be deleted UNTIL you refresh the page
    map.addListener("click", addDeleteEventListenerToRemoveMarkers);

    // 3e) Add event listeners for the 3 buttons in the floating-panel element.
    // These buttons delete, show, and hide ALL the markers.
    // Reference from Google Maps Documentation: https://developers.google.com/maps/documentation/javascript/examples/marker-remove
    const deleteMarkersButton = document.getElementById("delete-markers");
    const showMarkersButton = document.getElementById("show-markers");
    const hideMarkersButton = document.getElementById("hide-markers");
    deleteMarkersButton.addEventListener("click", deleteAllMarkers);
    showMarkersButton.addEventListener("click", showAllMarkers);
    hideMarkersButton.addEventListener("click", hideAllMarkers);

    // Sets the map on all markers in the array. Think of it as A) setMap(null) --> marker won't be set on a map AND setMap(map) --> marker will be set on a map
    function setMapOnAll(map = null) {
      for (let i = 0; i < arrayOfMarkers.length; i++) {
        arrayOfMarkers[i].setMap(map);
      }
    }

    // Deletes all markers in the array by removing references to them.
    function deleteAllMarkers() {
      hideAllMarkers();
      arrayOfMarkers = [];
      localStorage.removeItem(`song_${songID}_map_coordinates`);
    }

    // Removes the markers from the map, but keeps them in the array.
    function hideAllMarkers() {
      setMapOnAll(null);
    }

    // Shows any markers currently in the array.
    function showAllMarkers() {
      setMapOnAll(map);
    }

    // 3f) Add functionality to delete an individual marker by clicking on it (Consists of 4 functions in the block below)
    function hideIndividualMarker(selectedMarker) {
      selectedMarker.setMap(null);
    }

    function removeMarkerFromArrayOfMarkersAndFromLocalStorage(selectedMarker) {
      // A) Removing the selected marker from the in-memory array variable 'arrayOfMarkers', which is used for the floating-panel
      // If don't remove the selectedMarker from this in-memory array, might cause issues when using the 3 buttons in the floating panel
      // FYI - The arrayOfMarkers (in memory variable) includes the currentLocationMarker (step 3b).
      const getMarker = arrayOfMarkers.find(
        (marker) =>
          marker.position.lat() === selectedMarker.position.lat() &&
          marker.position.lng() === selectedMarker.position.lng()
      );
      const indexOfMarker = arrayOfMarkers.indexOf(getMarker);
      arrayOfMarkers.splice(indexOfMarker, 1);

      // B) Removing the selected marker's coords from localStorage, then re-saving the updated info into localStoraage
      // localStorage DOES NOT store the currentLocationMarker:
      //    - This is automatically generated whenever user goes to Google Maps page -->
      //    - Imagine if we store it & user goes to another country -->
      //    - Will have a lot default currentLocationMarkers stored automatically)
      // Since localStorage does not have the default currentLocationMarker's coords (as we never save it):
      //    - Line 161 will return 'undefined'
      //    - Line 166 will return '-1'
      //    - ---> This will cause issues when splicing since -1 means to remove in the opposite direction (from last element, hence another separate marker could be removed)
      const getMarkerCoordsFromLocalStorage = gmapCoordsArray.find(
        (markerCoords) =>
          markerCoords.lat === selectedMarker.position.lat() &&
          markerCoords.lng === selectedMarker.position.lng()
      );
      const indexOfMarkerCoords = gmapCoordsArray.indexOf(
        getMarkerCoordsFromLocalStorage
      );
      // Need validation here >=0 as indexOfMarkerCoords can return -1 ==> cause unexpected behaviors in splicing => aka bug introduction
      indexOfMarkerCoords >= 0 &&
        gmapCoordsArray.splice(indexOfMarkerCoords, 1);
      localStorage[`song_${songID}_map_coordinates`] =
        JSON.stringify(gmapCoordsArray);
    }

    // Need to remove that selected marker a) from the array in memory aka arrayOfMarkers & b) from localStorage
    function deleteIndividualMarker(selectedMarker) {
      hideIndividualMarker(selectedMarker);
      removeMarkerFromArrayOfMarkersAndFromLocalStorage(selectedMarker);
    }

    function addDeleteEventListenerToRemoveMarkers() {
      for (let i = 0; i < arrayOfMarkers.length; i++) {
        const marker = arrayOfMarkers[i];
        const markerLatCoords = marker.position.lat();
        const markerLngCoords = marker.position.lng();
        marker.addListener("click", function (event) {
          const selectedLatCoordsToDelete = event.latLng.lat();
          const selectedLngCoordsToDelete = event.latLng.lng();
          if (
            markerLatCoords === selectedLatCoordsToDelete &&
            markerLngCoords === selectedLngCoordsToDelete
          ) {
            deleteIndividualMarker(marker);
          }
        });
      }
    }

    addDeleteEventListenerToRemoveMarkers();

    // 3g) Once everything in your Google Map is loaded --> load this UI component & make it appear
    floatingPanelElement.style.display = "block";
  }
}
