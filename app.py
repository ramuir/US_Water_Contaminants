from flask import Flask, jsonify, render_template, url_for
import pandas as pd
from sqlalchemy import create_engine

app = Flask(__name__)
engine = create_engine("sqlite:///generate_sql/water_contamination_sql.sqlite")

@app.route("/")
def index():
    # data = pd.read_sql_table("water_contamination", engine).to_json(orient="records")
    return render_template("index.html")


@app.route("/api/contaminants")
def cities():
    return pd.read_sql_table("water_contamination", engine).to_json(orient="records")


if __name__ == "__main__":
    app.run(debug=True)