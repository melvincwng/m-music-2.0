// When the page is first loaded, this function a) displays the Listing homepage and b) hides the Details & Google Map pages
function onFirstLoad() {
  const listingPage = document.getElementById("page_listing");
  const detailsPage = document.getElementById("page_details");
  const mapPage = document.getElementById("page_map");

  listingPage.style.display = "block";
  detailsPage.style.display = "none";
  mapPage.style.display = "none";
}

onFirstLoad();
