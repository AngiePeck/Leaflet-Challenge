
// get the url for the API
var usgsUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-05-01&endtime=2020-05-1" +
"&maxlongitude=-116.6&minlongitude=-128.6&maxlatitude=48.7&minlatitude=44.5&minmagnitude=2.0";

 // GET request to the url
 d3.json(usgsUrl, function(data) {
     // call the createFeatures function
     //createFeatures(data.features);
    var earthquakeMarkers = createCircles(data.features);
    var plates;// = createPlates();
    createMap(earthquakeMarkers, plates);
 });

var plateURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";
// d3.json(plateURL, function(data){
//     console.log(data.features);
// });
d3.json(plateURL).then(function(data){
    console.log(data.features);
});


 function createPlates () {
     var lines = [];
     for(var plateIndex = 0; plateIndex < plateData.features.length; plateIndex++) {
         console.log(plateData.features);
        //  lines.push(L.polyline(
            
        //  ));
     }
 }

 function createCircles(earthquakeData) {
    var earthquakeMarkers = [];
    for(var quakeIndex = 0; quakeIndex < earthquakeData.length; quakeIndex++) {
        //console.log(earthquakeData[quakeIndex].geometry.coordinates);
        earthquakeMarkers.push(
            createMarker(earthquakeData[quakeIndex])
        );
    }
    return earthquakeMarkers;
 }



function createMarker(earthquake) {
    var quakeOpacity; 
    var quakeRadius;
    var quakeColor;
    if (earthquake.properties.mag >= 3.5) {
        quakeOpacity = 1;
        quakeRadius = 40;
        quakeColor = 'red';
    }
    else if (earthquake.properties.mag >= 3) {
        quakeOpacity = .8;
        quakeRadius = 32;
        quakeColor = 'red';
    }
    else if (earthquake.properties.mag >= 2.5) {
        quakeOpacity = .6;
        quakeRadius = 24;
        quakeColor = 'orange';
    }
    else if (earthquake.properties.mag >= 2) {
        quakeOpacity = .4;
        quakeRadius = 16;
        quakeColor = 'orange';
    }
    else {
        quakeOpacity = .2;
        quakeRadius = 8;
        quakeColor = 'yellow';
    }
    


    return L.circleMarker([earthquake.geometry.coordinates[1],earthquake.geometry.coordinates[0]], 
        {
            stroke: true, fillOpacity: quakeOpacity, color: "red", fillColor: quakeColor, radius: quakeRadius, weight: 1
        }).bindPopup("<h5>Magnitude: "+earthquake.properties.mag + "</h5><hr/>"+earthquake.properties.title);
}

 // define the creatMap function
 function createMap(earthquakeMarkers, plates) {
     
  // define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var earthquakeLayer = L.layerGroup(earthquakeMarkers);

  // define baseMap to hold base layers
  var baseMaps = {
      "Street Map" : streetmap,
      "Dark Map" : darkmap
  };
  
  // create overlay object for overlay layer
  var overlayMaps = {
      Earthquakes : earthquakeLayer
  };

  // create map with layers
  var myMap = L.map("map", {
      center: [46.6, -120.5],
      zoom: 7.1,
      layers: [streetmap, earthquakeLayer]
  });

  // create layer controls
  L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
  }).addTo(myMap);
 }



