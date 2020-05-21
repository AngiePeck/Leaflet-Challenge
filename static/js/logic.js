// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-4-15&endtime=2020-05-01&minmagnitude=3";

// Perform a GET request to the query URL
var earthquakeCache;
d3.json(queryUrl).then (function(data) {
    earthquakeCache = data;
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});
function getColor(mag) {
    var magnum = parseFloat(mag);
    var color = "blue";
    if (magnum > 6) {
        color = "red";
    }
    else if (magnum > 5) {
        color = "orange";
    }
    else if (magnum > 4) {
        color = "yellow";
    }
    else if (magnum >= 3) {
        color = "green";
    }
    return color;
}

function createFeatures(earthquakeData) {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer : function(feature, latlong) {
            return L.circleMarker(latlong, {
            fillColor : getColor(feature.properties.mag),
            fillOpacity : .8,
            color : "black",
            weight : 0.3,
            radius : (feature.properties.mag)**1.5
        });
    }
  });
    var plateURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";
    var plateLayer = L.layerGroup();
    // promises to call datasets and functions to create earthquake markers and tectonic plate lines
    d3.json(plateURL).then(function(lineData) {
        L.geoJSON(lineData, {
            style : {
                color : "orange",
                weight : 2,
            }

        }).addTo(plateLayer);
  });
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes, plateLayer);
}
function createMap(earthquakes, plates) {
  // Define streetmap and darkmap layers
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
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };
  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Faultlines : plates,
    Earthquakes: earthquakes
  };
  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      21.5, -78
    ],
    zoom: 3,
    layers: [streetmap, earthquakes]
  });
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  earthquakes.bringToFront();
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          magnitudes = [3,4,5,6],
          labels = [];
  
      // loop through our magnitudes and generate a label with a colored square for each interval
      for (var i = 0; i < magnitudes.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i> ' +
              magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);
}

