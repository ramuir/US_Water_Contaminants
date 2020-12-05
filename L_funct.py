import pandas as pd
from sqlalchemy import create_engine


def find_contaminates():
    engine = create_engine("sqlite:///generate_sql/water_contamination_sql.sqlite")
    data = pd.read_sql_table("water_contamination", engine)
    list_names=data['Analyte Name'].value_counts().index.tolist()
    
    return list_names

def find_states():
    data = pd.read_csv("statelatlong.csv")

    return data