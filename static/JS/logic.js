//Initializes user input choices for analytes
function initalizeChoices() {
    d3.json("/api/contaminates_list", function(c_list) {

        l=Object.keys(c_list.Contaminates).length
        var dropdown = d3.select("#selDataset")
        for (var j =0; j<l; j++) {
            // console.log(c_list.Contaminates[j])
            dropdown.append("option").text(c_list.Contaminates[j]).attr("value", c_list.Contaminates[j])
        }

    })
}

//Initializes user choices for state
function initializeStates(){
    d3.json("/api/states", function(states) {
        l=Object.keys(states.City).length
        var dropdown = d3.select('#selState')
        for (var j=0; j<l; j++) {
            dropdown.append("option").text(states.City[j]).attr("value", states.City[j])
        }
    })
}

// generating fake data DELETE THIS LATER
function GenerateFake() {
    var fakeData=[];
    for (var i=0; i<statesData.features.length; i++) {
        var max = 100
        var min = 0
        var value = Math.floor(Math.random() * (max - min + 1)) + min;

        var name=statesData.features[i].properties.name
        fakeData[i] = {"state_name": name, "contamination":value}
    }
    return fakeData
}

//Pick colors for choropleth
function getColor(d) {
    if (d>=0) {
        return  d > 70  ? '#a50026' :
                d > 60  ? '#d73027' :
                d > 50  ? '#f46d43' :
                d > 40  ? '#fdae61' :
                d > 30  ? '#fee08b' :
                d > 20  ? '#d9ef8b' :
                d > 10  ? '#a6d96a' :
                          '#66bd63' ;

    } else if (d==0) {
        return '#1a9850' ;
    } else if (d==-1) {
        return '#006837';
    } else {
        return '#d3d3d3';
    }
    
}

//Apply colors to choropleth
function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 1
    };
}


//Updates the data
function ChangeData(call) {
    d3.json(call, function(contaminants) { 
        console.log(contaminants);

        var addInfo=contaminants.info[0]
        UpdateAdditional(addInfo)

        var tabledata=contaminants.table
        UpdateTable(tabledata)

        var new_statesData=statesData
        var newData2=GenerateFake();
        var newData=contaminants.choropleth
        for (var i=0; i<statesData.features.length; i++) {
            var name=statesData.features[i].properties.name
            var state=newData.filter(d=>d.State===name)[0]
            // console.log(state2)
            var newvalue=0
            if (typeof state == "undefined") {
                // console.log(name);
                newvalue=-2
            } else {
                if (state.Measured_Number === 0) {
                    newvalue=-1
                } else {
                    newvalue=state.Caution_Number+state.Extreme_C_Number+state.Danger_Number
                }
            }
            new_statesData.features[i].properties.density=newvalue

            var state2=newData2.filter(d=>d.state_name===name)[0]
            var newvalue2=state2.contamination
            // console.log(newvalue, name)

        }

        L.geoJson(new_statesData, {style: style}).addTo(map);
        return new_statesData
    })
}

// Update Additional data
function UpdateAdditional(analyte) {
    // console.log(analyte)
    var A_name=d3.select("#analyte_name")
    A_name.text(analyte.Analyte)
    var val1=d3.select("#caution")
    var val2=d3.select("#extreme_caution")
    var val3=d3.select("#danger")
    val1.text(analyte.Caution + " "+ analyte.Units)
    val2.text(analyte['Extreme Caution'] + " "+ analyte.Units)
    val3.text(analyte.Danger + " "+ analyte.Units)
    var link=d3.select('#url_text')
    var t= "https://" + analyte.Link
    link.attr("href", analyte.Link)
    var info=d3.select('#analyte_additional')
    info.text(analyte["Additional Info"])
}

function UpdateTable(data) {
    // console.log(data)
    var titles=d3.select("#table_head")
    titles.html("")
    titles.append('tr').attr('id', 'data-header')
    var rowheader=d3.select("#data-header")
    rowheader.append('th').text("Analyte Name").attr('class','table-head')
    rowheader.append('th').text("State").attr('class','table-head')
    rowheader.append('th').text("Station Served").attr('class','table-head')
    rowheader.append('th').text("Population Served").attr('class','table-head')
    rowheader.append('th').text("Source Water Type").attr('class','table-head')
    rowheader.append('th').text("Analyte Detected?").attr('class','table-head')
    rowheader.append('th').text("Value Detected").attr('class','table-head')
    rowheader.append('th').text("Value Units").attr('class','table-head')

    var Tdata=d3.select("#table_body")
    Tdata.html("")
    for (var i=0; i<data.length; i++) {
        var listName="Item_"+i
        var detect=""
        if(data[i].Detect===0) {
            detect="No"
        } else {
            detect="Yes"
        }

        Tdata.append('tr').attr("id", listName)
        var row= d3.select('#'+listName)
        row.append('th').text(data[i]["Analyte Name"])
        row.append('th').text(data[i].State)
        row.append('th').text(data[i]["System Name"])
        row.append('th').text(data[i]["Retail Population Served"])
        row.append('th').text(data[i]["Source Water Type"])
        row.append('th').text(detect)
        row.append('th').text(data[i].Value)
        row.append('th').text(data[i].Unit)
    }
}


function UpdateData() {
    var dropdown1 = d3.select("#selDataset")
    var dropdown2 = d3.select("#selState")
    var dataset1 = dropdown1.property("value")
    var dataset2 = dropdown2.property("value")
    console.log(dataset1)

    call2=`/api/${dataset1}/${dataset2}`
    console.log(call2)

    ChangeData(call2)
}







//Script that Runs

//map info
var mapboxAccessToken = API_KEY
var map = L.map('map').setView([37.8, -96], 4);
var legend = L.control({position: 'bottomright'})


//Generate map
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/light-v9',
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    accessToken: mapboxAccessToken
}).addTo(map);

//Add choropleth to the map
L.geoJson(statesData, {style: style}).addTo(map);


// add scrolling feature
map.scrollWheelZoom.disable();
this.map.on('click', () => { this.map.scrollWheelZoom.enable();});
this.map.on('mouseout', () => { this.map.scrollWheelZoom.disable();});


//Run inital scripts to generate data
initalizeChoices()
initializeStates()
call_init="/api/ARSENIC/Alabama"
ChangeData(call_init)


//Add Legend to the map
legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-2, -1, 0 ,10 , 20, 30, 40, 50, 60, 70, 80],
        labels = []

    for (var i=0; i <grades.length; i++) {
        if (i==0) {
            div.innerHTML +=
            '<i style="background:' + getColor(grades[i]) + '"></i> ' + 'No Measurements <br>'
        } else if (i==1) {
            div.innerHTML +=
            '<i style="background:' + getColor(grades[i]) + '"></i> ' + 'No Detected Measure <br>'
        } else if (i==2) {
            div.innerHTML +=
            '<i style="background:' + getColor(grades[i]) + '"></i> ' + 'All Below Threshold <br>'
        }
        else {
            div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + ' Above Threshold <br>': '+ Above Threshold') 
        }
        console.log(getColor(grades[i] + 1))
    }
    return div
}

legend.addTo(map);

// Update data based on User dropdown select
d3.selectAll('#selDataset').on("change",UpdateData)
d3.selectAll('#selState').on("change",UpdateData)