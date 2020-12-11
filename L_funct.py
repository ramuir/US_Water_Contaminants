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

    num_df=pd.DataFrame({"State": [],
                "Caution_Number": [],
                "Extreme_C_Number": [],
                "Danger_Number": [],
                "Measured_Number": [],
                "Total_Number": [],
                "Total_Pop":[]})

    for s in data['State'].unique():
        d = data.loc[data['State']==s]
        num_d=d.loc[d['Value']>danger].shape[0]
        num_exc=d.loc[d['Value']>excaution].shape[0]-num_d
        num_c=d.loc[d['Value']>caution].shape[0]-num_exc
        num_val=d.loc[d['Detect']==1].shape[0]
        num_tot=d.shape[0]

        num_dict=pd.DataFrame({"State": [s],
                "Caution_Number": [num_c],
                "Extreme_C_Number": [num_exc],
                "Danger_Number": [num_d],
                "Measured_Number": [num_val],
                "Total_Number": [num_tot],
                "Total_Pop":[int(d['Retail Population Served'].sum())]})
        num_df=num_df.append(num_dict)

    return num_df, data_s

def find_info(analyte):
    data=pd.read_csv("static/data/Contaminants.csv")
    d=data.loc[data['Analyte']==analyte]

    return d