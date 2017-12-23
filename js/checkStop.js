var check = document.getElementById("checkbox").checked;

var maps = new google.maps.Map(document.getElementById("map"), _mapOptions);

function getStops(checkboxElem) {
    if (checkboxElem.checked) {
      console.log ("hi");
      
    } else {
      console.log("bye");
    }
  }
