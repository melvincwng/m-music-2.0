// divID can be either page_listing, page_details, page_map. songID can be either 0,1,2 etc...
function displayPage(divID, songID = undefined) {
  var pages = document.getElementsByClassName("page");

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
    const musicDetailsImage = document.getElementById(
      "div_product_details_img"
    );
    const musicDetailsData = document.getElementById(
      "div_product_details_data"
    );
    const musicNameElement = document.getElementsByClassName("music_name")[0];
    musicNameElement.innerHTML = `${selectedSong.name}`;
    musicDetailsImage.innerHTML = `<img src="${selectedSong.image}" />`;
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
  }
}
