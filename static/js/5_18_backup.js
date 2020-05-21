// creat url variables for both earthquake and tectonic plate data
var usgsUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-05-01&endtime=2020-05-1" +
"&minmagnitude=4.0";
// &maxlongitude=-74&minlongitude=-136.6&maxlatitude=50.0&minlatitude=35
var plateURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";
// promises to call datasets and functions to create earthquake markers and tectonic plate lines
d3.json(usgsUrl).then(function(data) {
    var earthquakeMarkers = createCircles(data.features);
    return earthquakeMarkers;
}).then(function(earthquakeMarkers) {
    d3.json(plateURL).then(function(plateData) {
        var plateLines = L.geoJson(plateData, {
            onEachFeature: onEachFeature});

        //return plateLines;
    createMap(earthquakeMarkers, plateLines);
    });
});
function onEachFeature(plateData, layer) {
    layer.addLayer(L.polyLine[plateData]);
    //return plateLines
}
// function for creating tectonic plate lines
// function createPlates (plateData) {
//      var plateLines = [];
//      for(var plateIndex = 0; plateIndex < plateData.features.length; plateIndex++) {
//         plateLines.push(
//             createLine(plateData.features[plateIndex])
//         )};
//     return plateLines;
//     }
// function createLine(faultLine) {
//     var coordinates = faultLine.geometry.coordinates;
//     return L.polyline(coordinates, {
//         color: "orange",
//         weight: 3
//     });
// }
// function for creating circles on earthquakes
 function createCircles(earthquakeData) {
    var earthquakeMarkers = [];
    for(var quakeIndex = 0; quakeIndex < earthquakeData.length; quakeIndex++) {
        earthquakeMarkers.push(
            createMarker(earthquakeData[quakeIndex])
        );
    }
    return earthquakeMarkers;
}
// function for creating markers and popups for earthquakes
function createMarker(earthquake) {
    var quakeOpacity; 
    var quakeRadius;
    var quakeColor;
    if (earthquake.properties.mag >= 5.5) {
        quakeOpacity = 1;
        quakeRadius = 16;
        quakeColor = 'red';
    }
    else if (earthquake.properties.mag >= 5) {
        quakeOpacity = .8;
        quakeRadius = 12;
        quakeColor = 'red';
    }
    else if (earthquake.properties.mag >= 4.5) {
        quakeOpacity = .6;
        quakeRadius = 8;
        quakeColor = 'orange';
    }
    else if (earthquake.properties.mag >= 4) {
        quakeOpacity = .4;
        quakeRadius = 4;
        quakeColor = 'orange';
    }
    else {
        quakeOpacity = .2;
        quakeRadius = 2;
        quakeColor = 'yellow';
    }
    return L.circleMarker([earthquake.geometry.coordinates[1],earthquake.geometry.coordinates[0]], 
        {
            stroke: true, fillOpacity: quakeOpacity, color: "red", fillColor: quakeColor, radius: quakeRadius, weight: .6
        }).bindPopup("<h5>Magnitude: "+earthquake.properties.mag + "</h5><hr/>"+earthquake.properties.title);
}

 // function that creates map with baseMap (street and dark) and overlay (earthquakes and plate lines)
 function createMap(earthquakeMarkers, plateLines) {
     // baseMap layers

    // create layer controls
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
    // create color legend
    // var legend = L.control({position: 'bottomright'});
    // legend.onAdd = function() {
    //     var div = L.DomUtil.create("div", "info legend");
    //     var 
    // }

 } 