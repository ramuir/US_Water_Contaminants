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

def find_analyte(analyte, state):
    engine = create_engine("sqlite:///generate_sql/water_contamination_sql.sqlite")
    data = pd.read_sql_table("water_contamination", engine)
    data=data.drop(['Unnamed: 0','Analyte ID','State Code','Sample Collection Date'],axis=1)
    data=data.loc[data['Analyte Name']==analyte]
    data_s = data.loc[data['State']==state]
    q =pd.DataFrame({'State': data['State'], 'Value': data['Value']})
    data_a=q.groupby(['State']).mean()
    data_a=data_a.fillna(0)
    return data_a, data_s