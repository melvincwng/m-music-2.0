// divID can be either page_listing, page_details, page_map. songID can be either 0,1,2 etc...
function displayPage(divID, songID = undefined) {
  const pages = document.getElementsByClassName("page");

  for (var i = 0; i < pages.length; i++) {
    if (pages[i].id == divID) {
      pages[i].style = "display:block;";
    } else {
      pages[i].style = "display:none;";
    }
  }

  // For details page - there is additional logic
  if (divID === "page_details" && songID !== undefined) {
    const savedSongs = JSON.parse(localStorage.getItem("savedSongs"));
    const selectedSong = savedSongs[songID];
    const musicNameElement = document.getElementsByClassName("music_name")[0];
    const musicDetailsImage = document.getElementById(
      "div_product_details_img"
    );
    const musicDetailsData = document.getElementById(
      "div_product_details_data"
    );
    // Logic for whereToFindButton
    const whereToFindButton = document.getElementById("where_to_find_button");
    const songNameForGoogleSearch = selectedSong.name.replace(" ", "+");

    musicNameElement.innerHTML = `${selectedSong.name}`;
    musicDetailsImage.innerHTML = `<img src="${selectedSong.image}" id="musicDetailsImage" title="Click to google this song 🎵" onclick="openGoogleSearchQuery('${songNameForGoogleSearch}')">`;
    musicDetailsData.innerHTML = `
      <div class="div_product_details_data_cell">
        <span class="product_details_data_name">Artist: </span>
        <br />
        <span id="music_artist">${selectedSong.artist}</span>
      </div>
      <br/>
      <div class="div_product_details_data_cell">
        <span class="product_details_data_name">Genre: </span>
        <br />
        <span id="music_genre">${selectedSong.type}</span>
      </div>
      <br/>
      <div class="div_product_details_data_cell">
        <span class="product_details_data_name">Release: </span>
        <br />
        <span id="music_release">${
          selectedSong.release.charAt(0).toUpperCase() +
          selectedSong.release.slice(1)
        }</span>
      </div>
      <br/>
      <div class="div_product_details_data_cell">
        <span class="product_details_data_name">Duration: </span>
        <br />
        <span id="music_duration">
          ${selectedSong.duration.toFixed(2)} minutes
        </span>
      </div>
      <br/>   
      <div class="div_product_details_data_cell">
        <span class="product_details_data_name">Music Preview: </span>
        <br />
        <span id="music_preview">
          <audio controls>
            <source src="${selectedSong.mp3Source}" type="audio/mpeg">
            Your browser does not support the audio tag.
          </audio>
        </span>
      </div>
      <br/> 
    `;
    whereToFindButton.onclick = function () {
      displayPage("page_map", `${songID}`);
      loadGoogleMaps(`${songID}`);
      stopAudioFromPlaying();
    };
  }

  // Logic to toggle on or off the background gif image (only ON for details page)
  const body = document.getElementsByTagName("body")[0];
  if (divID === "page_details") {
    body.style.backgroundImage = `url(./assets/img/background.gif)`;
  } else {
    body.style.backgroundImage = "none";
  }
}

function openGoogleSearchQuery(songName) {
  window.open(`https://www.google.com/search?q=${songName}`);
}
