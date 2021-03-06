//Functions List

//Initialized page for user choices

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


//Generate colors for choropleth

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



//Functions that run the data dump

//Updates Data based on User Input -- MAIN FUNCTION
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

//Updates the data - Called by Update Data
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
        UpdateInvTable(newData)
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

        L.geoJson(new_statesData, {style: style, onEachFeature:onEachFeature}).addTo(map);
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

// Make invisible table for choropleth
function UpdateInvTable(data) {
    console.log(data)
    var titles=d3.select("#table_head_inv")
    titles.html("")
    titles.append('tr').attr('id', 'data-header_inv')
    var rowheader=d3.select("#data-header_inv")
    rowheader.append('th').text("Caution_Number").attr('class','table-head')
    rowheader.append('th').text("Danger_Number").attr('class','table-head')
    rowheader.append('th').text("Extreme_C_Number").attr('class','table-head')
    rowheader.append('th').text("Measured_Number").attr('class','table-head')
    rowheader.append('th').text("State").attr('class','table-head')
    rowheader.append('th').text("Total_Number").attr('class','table-head')
    rowheader.append('th').text("Total_Pop").attr('class','table-head')
    

    var Tdata=d3.select("#table_body_inv")
    Tdata.html("")
    for (var i=0; i<data.length; i++) {
        var listName=data[i].State+'_counts'
        listName=listName.replace(" ", "_").replace(" ", "_")
        Tdata.append('tr').attr("id", listName)
        var row= d3.select('#'+listName)

        row.append('th').text(data[i]["Caution_Number"]).attr('id', 'c')
        row.append('th').text(data[i]["Danger_Number"]).attr('id', 'd')
        row.append('th').text(data[i]["Extreme_C_Number"]).attr('id', 'exc')
        row.append('th').text(data[i]["Measured_Number"]).attr('id', 'meas')
        row.append('th').text(data[i]["State"]).attr('id', 'st')
        row.append('th').text(data[i]["Total_Number"]).attr('id', 'tot')
        row.append('th').text(data[i]["Total_Pop"]).attr('id', 'pop')
    }
}








//Functions to display Hover-Data popup
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties)
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update()
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
    });
}

function GetInvData(name) {
    name=name.replace(' ','_').replace(' ','_')
    var id = '#' + name + '_counts'
    var data={}
    if (d3.select(id).empty() != true) {
        data={
            'Total':d3.select(id).select('#tot').text(),
            'Caution':d3.select(id).select('#c').text(),
            'ExCaution':d3.select(id).select('#exc').text(),
            'Danger':d3.select(id).select('#d').text(),
            'Measured':d3.select(id).select('#meas').text(),
            'Population':d3.select(id).select('#pop').text(),
            'Values': 0
        }
    } else {
        data={
            'Total':0,
            'Caution':0,
            'ExCaution':0,
            'Danger':0,
            'Measured':0,
            'Population':0,
            'Values': 1
        }
    }
    return data
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



//Create pop-out and info functions

var info = L.control()

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info')
    this.update()
    return this._div
}

info.update = function(props) {
    if (typeof props != "undefined") {
        data = GetInvData(props.name)
        // console.log(data)
        if (data.Values==0) {
            this._div.innerHTML = '<h4>Station Measurement Information</h4>' + (props ?
                '<b>' + props.name + 
                '</b><br><br>Total Stations Measured:   <b>' + data.Total +
                '</b><br>Total Population Served in State:   <b>' + data.Population + 
                '</b><br>Stations with Detected Measure:   <b>' + data.Measured +
                '</b><br>Stations with Caution Measure:   <b>' + data.Caution +
                '</b><br>Stations with Extreme Caution Measure:   <b>' + data.ExCaution +
                '</b><br>Stations with Danger Measure:   <b>' + data.Danger : 'Hover over a state')
        } else {
            this._div.innerHTML = '<h4>Station Measurement Information</h4>' + (props ?
                '<b>' + props.name + '</b><br><br>No Measurements Conducted in this State': 'Hover over a state')
        }
    } else {
        this._div.innerHTML = '<h4>Station Measurement Information</h4>' + (props ?
            '<b>' + props.name + '<br>': 'Hover over a state')
    }

    

}

info.addTo(map)




//Add choropleth to the map
var geojson = L.geoJson(statesData, {style: style, onEachFeature: onEachFeature}).addTo(map);



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
        // console.log(getColor(grades[i] + 1))
    }
    return div
}
legend.addTo(map);



// add scrolling feature
map.scrollWheelZoom.disable();
this.map.on('click', () => { this.map.scrollWheelZoom.enable();});
this.map.on('mouseout', () => { this.map.scrollWheelZoom.disable();});


//Run inital scripts to generate data
initalizeChoices()
initializeStates()
call_init="/api/ARSENIC/Alabama"
ChangeData(call_init)

// Update data based on User dropdown select
d3.selectAll('#selDataset').on("change",UpdateData)
d3.selectAll('#selState').on("change",UpdateData)