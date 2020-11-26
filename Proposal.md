# US Water Contaminants: Project Propsal

-Ryan Muir, Bradley Higdon, and Zach Adams

This project aims to show contamination of water sources across the US through measurements of organic and inorganic material.

Data for this project comes from the EPA six-year review data of organic and inorganic chemicals found in drinking water across the US. This data can be found [here](https://www.epa.gov/dwsixyearreview/six-year-review-3-compliance-monitoring-data-2006-2011). 

We will choose some chemicals from their exhaustive list to include in our visualization. There seems to be near 100 different measured chemicals; we don't plan on using all of them. We are currently parsing through to see which are applicable and would be meaningful.

Our plan is for the website to look something like [this](Website_mockup.png). The user will be able to mouse over each state to get an average contamination value for each state from the [choropleth](https://leafletjs.com/examples/choropleth/) (Leaflet) at the top. There will be a drop-down menu to the side which will allow the user to pick which contamination they wish to measure. When they mouse over each state on the choropleth information about each state's contamination will be displayed. 

Below the choropleth there will be a chart created using [canvas](https://canvasjs.com/javascript-charts/) (if necissary, see final note**). This chart will represent numbers of measurement sites at various contamination levels as a histogram of a specific state. To the right will be a table list of each measurement site in that state and their contamination specific values. 

Control of which state appears in the lower visualizations will either be controlled by a 'on click' function on the choropleth (preferable, but not sure if that is possible) or by another drop down menu, as pictured on the upper right. 

We plan to use a SQLite database to store our data. 

**We would prefer to use Plotly for our chart, but only if the choropleth in leaflet would count as our unused JS library. Let us know please!