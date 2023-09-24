// Get GeoJSON end point with d3
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function(data) {
  // Create map 
  var myMap = L.map("map", {
    center: [37.7749, -110.4194],
    zoom: 4.5
  });

  console.log(data);

  // Tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  // Loop through earthquake data & features
  data.features.forEach(function(feature) {
    // Get lat, long, mag, & depth of earthquake
    var latitude = feature.geometry.coordinates[1];
    var longitude = feature.geometry.coordinates[0];
    var magnitude = feature.properties.mag;
    var depth = feature.geometry.coordinates[2];

    // Markers for earthquakes; plot by lat, long & adjust size & color based on mag & depth
    var marker = L.circleMarker([latitude, longitude], {
      radius: getRadius(magnitude),
      fillColor: getColor(depth),
      color: "black",
      fillOpacity: 0.9,
      weight: 0.5
    }).addTo(myMap);

    // Popup with info about earthquake
    var popupContent = "<strong>Magnitude:</strong> " + magnitude + "<br>" +
      "<strong>Depth:</strong> " + depth + "<br>" + "<strong>Place:</strong> " + feature.properties.place;
    marker.bindPopup(popupContent);
  });

  // Create & position legend 
  let legend = L.control({
    position: "bottomright"
  });

  // Add details to legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    div.style.backgroundColor = "#fff"; // add white background color
    let ranges = [-10, 10, 30, 50, 70, 90];
    let colors = [
      "#a3ff03",
      "#e1ff00",
      "#ffd900",
      "#ffa600",
      "#ff7300",
      "#ff0000"
    ];
    // Looping through legend details to generate labels
    // Additional CSS code
    for (let i = 0; i < ranges.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
        + ranges[i] + (ranges[i + 1] ? "&ndash;" + ranges[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Add legend to myMap
  legend.addTo(myMap);

  // Function to get color based on depth
  function getColor(depth) {
    return depth < 10 ? "#a3ff03":
           depth < 30 ? "#e1ff00":
           depth < 50 ? "#ffd900":
           depth < 70 ? "#ffa600":
           depth < 90 ? "#ff7300":
                        "#ff0000";
  }
  // Function to get the radius of marker based on mag
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }

});