document.getElementById("click-on").onclick = function () { alert('hello!');}

var el = document.getElementById("click-on");
if (el.addEventListener)
    el.addEventListener("click", doFunction, false);
else if (el.attachEvent)
    el.attachEvent('onclick', doFunction);

geocoder = new google.maps.Geocoder();


function getLocation( address, callback ){
    geocoder.geocode({address = address}, function(results, status){
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
            coordinates_obj = results[0].geometry.location;
 
            say(coordinates_obj.nb)
             say(coordinates_obj.ob)
            callback(coordinates_obj)
            var location = new google.maps.LatLng(latitude, longitude);
            marker.setPosition(location);
            map.setCenter(location);
            map.setZoom(1);
            }}
    })
    return coordinates_obj;
}


function say(something){
    console.log(something);
}

function carregarNoMapa(endereco) {
    geocoder.geocode({ 'address': endereco + ', Brasil', 'region': 'BR' }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                var latitude = results[0].geometry.location.lat();
                var longitude = results[0].geometry.location.lng();
    
                $('#txtEndereco').val(results[0].formatted_address);
                $('#txtLatitude').val(latitude);
                   $('#txtLongitude').val(longitude);
    
                var location = new google.maps.LatLng(latitude, longitude);
                marker.setPosition(location);
                map.setCenter(location);
                map.setZoom(16);
            }
        }
    })
}