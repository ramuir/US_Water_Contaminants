var mapboxAccessToken = API_KEY
var map = L.map('map').setView([37.8, -96], 5);



L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/light-v9',
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    accessToken: mapboxAccessToken
}).addTo(map);

// enter values of specific conamination



// generating fake data
function GenerateFake() {
    var fakeData=[];
    for (var i=0; i<statesData.features.length; i++) {
        var max = 80
        var min = 0
        var value = Math.floor(Math.random() * (max - min + 1)) + min;

        var name=statesData.features[i].properties.name
        fakeData[i] = {"state_name": name, "contamination":value}
    }
    return fakeData
}

function getColor(d) {
    return d > 70 ? '#800026' :
           d > 60  ? '#BD0026' :
           d > 50  ? '#E31A1C' :
           d > 40  ? '#FC4E2A' :
           d > 30   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

L.geoJson(statesData, {style: style}).addTo(map);

function ChangeData() {
    d3.json("/api/contaminants", function(contaminants) { 
        console.log(contaminants);

        var new_statesData=statesData
        var newData=GenerateFake();
        // console.log(newData)
        for (var i=0; i<statesData.features.length; i++) {
            var name=statesData.features[i].properties.name
            var state=newData.filter(d=>d.state_name===name)[0]
            // console.log(state)
            var newvalue=state.contamination
            new_statesData.features[i].properties.density=newvalue
        }

        L.geoJson(new_statesData, {style: style}).addTo(map);
        return new_statesData
    })
}


// L.geoJson(statesData).addTo(map);