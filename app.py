from flask import Flask, jsonify, render_template, url_for
import pandas as pd
from sqlalchemy import create_engine
import L_funct

app = Flask(__name__)
engine = create_engine("sqlite:///generate_sql/water_contamination_sql.sqlite")

@app.route("/")
def index():
    # data = pd.read_sql_table("water_contamination", engine).to_json(orient="records")
    return render_template("index.html")


@app.route("/api/contaminants")
def cities():
    return pd.read_sql_table("water_contamination", engine).to_json(orient="records")

@app.route("/api/contaminates_list")
def cities2():
    contam_list=L_funct.find_contaminates()
    df_contam = pd.DataFrame({"Contaminates":contam_list})
    return df_contam.to_json()

@app.route("/api/states")
def cities3():
    states_list = L_funct.find_states()
    return states_list.to_json()


if __name__ == "__main__":
    app.run(debug=True)