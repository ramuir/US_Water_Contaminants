# US_Water_Contaminants
By: Bradley Higdon, Zach Adams, and Ryan Muir

The aim of this project is to visualize the amount (or lack thereof) of water conaminants measured in each state of the US. This visualization provides details of each measurement site reported to the EPA of a variety of contaminants. Data obtained for this project was from the [EPA's 6 year review of water contaminiants](https://www.epa.gov/dwsixyearreview/six-year-review-3-compliance-monitoring-data-2006-2011). 



## How the code works
The code in this project runs a website which displays the contaminant data requested by the end user. After choosing their choice of analyte and state the JS functions in logic.js call the flask app (app.py) for specific data to display on the webpage (index.html). The flask app subsequently calls python functions located in L_funt.py which search the SQLite database for the requested information. This information is returned from the flask api call to logic.js, which organizes the data and displays it for the user. Additional styling for the webpage can be found in the style.css file. 


## Running the Code
To run this code, first begin by downloading this repository.

The flask app which hosts the website is created by app.py. By running this file a locally hosted version of the site is created for personal use. Run this when you are ready to test!

You will need a [Mapbox](https://www.mapbox.com/) API key to load the [Leaflet choropleth](https://leafletjs.com/examples/choropleth/). This key must be placed in the config.js file. A base config_new.js file is availible as a starter. The choropleth.js file needed to run the choropleth is included in this download in the /static/JS folder. 

Python libraries needed for this code:

Pandas
sqlachemy
flask
json
os

A functional version of the current site can be found [here](https://water-contamination.herokuapp.com/). Examples of the choropleth in action are found in /PollutantMaps

If you wish to run additional contaminants from the EPA's data you can add them to the SQLite database by including the .txt file in the /Data folder, and run the Water_Data.ipynb followed by the create_sql.py in the /generate_sql folder. 