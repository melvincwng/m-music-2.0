function displayPage(divID) {
  var pages = document.getElementsByClassName("page");

  for (var i = 0; i < pages.length; i++) {
    if (pages[i].id == divID) {
      pages[i].style = "display:block;";
    } else {
      pages[i].style = "display:none;";
    }
  }
}
