from flask import Flask, jsonify, render_template, url_for
import pandas as pd
from sqlalchemy import create_engine
import json
import L_funct

app = Flask(__name__)
engine = create_engine("sqlite:///generate_sql/water_contamination_sql.sqlite")

@app.route("/")
def index():
    # data = pd.read_sql_table("water_contamination", engine).to_json(orient="records")
    return render_template("index.html")


@app.route("/api/contaminants")
def total():
    return pd.read_sql_table("water_contamination", engine).to_json(orient="records")



@app.route("/api/<analyte>/<state>")
def fa(analyte, state):
    print(analyte)
    print(state)
    data_1, data_2 = L_funct.find_analyte(analyte, state)
    d1_json = data_1.to_json(orient='records')
    d2_json = data_2.to_json(orient='records')
    data_3 = L_funct.find_info(analyte)
    d3_json = data_3.to_json(orient='records')

    return jsonify(choropleth = json.loads(d1_json), table = json.loads(d2_json), info = json.loads(d3_json))

@app.route("/api/contaminates_list")
def conList():
    contam_list=L_funct.find_contaminates()
    df_contam = pd.DataFrame({"Contaminates":contam_list})
    return df_contam.to_json()

@app.route("/api/states")
def stList():
    states_list = L_funct.find_states()
    return states_list.to_json()


if __name__ == "__main__":
    app.run(debug=True)