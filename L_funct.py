import pandas as pd
from sqlalchemy import create_engine


def find_contaminates():
    data=pd.read_csv("static/data/Contaminants.csv")
    list_names=data['Analyte'].tolist()
    
    return list_names

def find_states():
    data = pd.read_csv("static/data/statelatlong.csv")

    return data

def find_analyte(analyte, state):
    engine = create_engine("sqlite:///generate_sql/water_contamination_sql.sqlite")
    data = pd.read_sql_table("water_contamination", engine)
    data=data.drop(['Unnamed: 0','Analyte ID','State Code','Sample Collection Date'],axis=1)
    data=data.loc[data['Analyte Name']==analyte]
    data_s = data.loc[data['State']==state]
    data_s = data_s.sort_values(by='Value', ascending=False)

    ana=find_info(analyte)
    caution=ana['Caution'].tolist()[0]
    excaution=ana['Extreme Caution'].tolist()[0]
    danger=ana['Danger'].tolist()[0]
    num_d=data_s.loc[data_s['Value']>danger].shape[0]
    num_exc=data_s.loc[data_s['Value']>excaution].shape[0]-num_d
    num_c=data_s.loc[data_s['Value']>caution].shape[0]-num_exc
    num_val=data_s.loc[data_s['Detect']==1].shape[0]
    # num_val=1

    num_dict={"Caution_Number": num_c,
              "Extreme_C_Number": num_exc,
              "Danger_Number": num_d,
              "Measured_Number": num_val}

    return num_dict, data_s

def find_info(analyte):
    data=pd.read_csv("static/data/Contaminants.csv")
    d=data.loc[data['Analyte']==analyte]

    return d