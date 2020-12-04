import pandas as pd 
from sqlalchemy import create_engine

water_contamination = pd.read_csv("water_contamination.csv")

engine = create_engine("sqlite:///water_contamination_sql.sqlite")

water_contamination.to_sql(name='water_contamination',
                            con=engine,
                            if_exists= 'replace',
                            index=False)