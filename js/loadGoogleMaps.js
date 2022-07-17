window.onload = function () {
  var map;
  function initMap() {
    map = new google.maps.Map(document.getElementById("div_product_map"), {
      center: { lat: 1.3098822, lng: 103.7753119 },
      zoom: 8,
    });
  }
  initMap();
};
