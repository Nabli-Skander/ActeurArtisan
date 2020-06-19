function initMap() {
  var myLatLng = {lat: 48.829833, lng: 2.374644};

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    zoomControl: true,
    scrollwheel: false,
    navigationControl: true,
    mapTypeControl: true,
    scaleControl: true,
    draggable: true,
    disableDefaultUI: true,
    center: myLatLng
  });

  var contentString = 'Acteurs-Artisans';

      var infowindow = new google.maps.InfoWindow({
    content: contentString
  });


  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'Acteurs-Artisans'
  });

  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
}
