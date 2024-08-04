/**
 * How to import a JSON file into a .js file/script which then is loaded into a HTML page
 * Reference: https://stackoverflow.com/questions/69548822/how-to-import-js-that-imported-json-from-html
 */
import { mockMusicDataResponse } from "../assets/mockMusicData.js";

var settings = {
  url: "https://inec.sg/assignment/retrieve_records.php",
  method: "GET",
  timeout: 0,
};

$.ajax(settings)
  .done(function (response) {
    const musicUnorderedList = document.getElementById("ul_products_list");
    /**
     * **UPDATE 15/12/2022**
     * Currently, the PHP endpoint is not returning the proper JSON response
     * Hence we are using the mockMusicData.json file instead
     * Commenting out line 18 & using line 19 instead
     */
    // const songs = response.songs;
    const songs = mockMusicDataResponse.songs;
    const savedSongs = [];
    for (let i = 0; i < songs.length; i++) {
      const song = songs[i];
      /**
       * Additional JavaScript logic implemented for bonus marks --> generate audio tags that allow the user to actually play the music (after providing a valid mp3 source url)
       * Ideally, this music mp3 source url should come from the backend API GET PHP endpoint. However, it's not implemented there.
       * Hence, we can make use of various other music streaming APIs (e.g. Deezer, Spotify, Youtube) to get the mp3 source url, many of which require an API_KEY before you can use them
       * To summarize, there are a couple of ways we can do to get a valid mp3 source url:
       *  - 1) Ideal way is to edit that original API PHP endpoint which we are calling to get music details & just add another key containing mp3Source which has the respective URL value.
       *  - 2) On the client, directly call the music streaming API. (However, the API_KEY will be easily exposed if we call the music API on the FE... hence not advisable, as other people may abuse the API_KEY. You can obfuscate it, but people can reverse engineer to get your API_KEY)
       *  - 3) Create a server & use it to call the music streaming API instead, then proxy back the response to client (Better approach, but creating another separate server API endpoint just for this feature can be abit cumbersome)
       *  - 4) Use of serverless functions - e.g. Netlify functions, AWS Lambdas etc, Google Cloud Functions etc (Good approach as no need write the whole server side logic, but still a bit overkill - in terms of the scope of this assignment)
       *  - 5) Hardcoding the values on the client (Easiest way to implement, but of course not scalable - imagine if there are 100 songs... but this approach is chosen due to time constraints)
       * Listing out all available options above in case code enhancements or refactoring of the code are done in the future.
       */
      if (i === 0) {
        // Song for 'Shape Of You'
        song.mp3Source =
          "https://cdns-preview-d.dzcdn.net/stream/c-d8f5b81a6243ddfa4c97b9a4c86a82fa-6.mp3";
      } else if (i === 1) {
        // Song for 'Gangnam Style'
        song.mp3Source =
          "https://cdns-preview-5.dzcdn.net/stream/c-57793edd9b2473c82d250249b623793f-11.mp3";
      } else if (i === 2) {
        // Song for 'Hotel California'
        song.mp3Source =
          "https://cdns-preview-8.dzcdn.net/stream/c-8af9cfb9a0454481e21989618e7c5779-4.mp3";
      } else {
        // If there are more songs added in the PHP endpoint in future:
        //  - Temporarily it's mp3Source url will be undefined aka the audio tags cannot be played yet (as there is no valid src url)
        //  - Then we would need to update and add in more code to this portion (link up the new songs to a valid mp3 source url - can google and find where the new songs are hosted on CDNs)
        //  - Please take note this block of code to add Music Preview is just a 'Proof Of Concept'
        //  - I'm aware that the logic here could break if there are changes made to the JSON response returned from the backend PHP web service (e.g. Order of songs changes, or name of songs changes - assume we validate by song names)
        song.mp3Source = "undefined";
      }

      savedSongs.push(song);

      musicUnorderedList.innerHTML += `
      <li class="li_product_item" id=${i} onclick="displayPage('page_details', ${i})">
        <div class="li_product_image">
          <img src="${song.image}" alt="Music Image" />
        </div>
        <div class="li_product_name">
          ${song.name}
          <br />
          <span class="li_product_duration">
            ${song.duration.toFixed(2)} minutes
          </span>
        </div>
      </li>
      `;
    }
    localStorage.setItem("savedSongs", JSON.stringify(savedSongs));
  })
  .fail(function () {
    alert("An unexpected error has occurred. Please refresh and try again!");
    const musicUnorderedList = document.getElementById("ul_products_list");
    musicUnorderedList.innerHTML =
      "<div style='color: white; text-align: center;'>An error has occurred. Please try again 😔</div>";
  });
