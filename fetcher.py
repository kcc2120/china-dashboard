import requests
from supabase import create_client
from dbnomics import fetch_series
import pandas as pd
import os

supabase_url = os.environ['SUPABASE_URL']
supabase_key = os.environ['SUPABASE_ANON_KEY']

supabase = create_client(supabase_url, supabase_key)

indicators = {
    'china_retail_sales': {
        'dataset': 'M_A0703',
        'series': 'A07030B',  # YoY %
        'abs_series': 'A07030D',  # Absolute
        'yoy_field': 'yoy_change',
        'abs_field': 'absolute_value'
    },
    'china_fixed_asset_investment': {
        'dataset': 'M_A0401',
        'series': 'A040102',  # YTD YoY %
        'yoy_field': 'ytd_yoy_change'
    },
    'china_industrial_production': {
        'dataset': 'M_A0205',
        'series': 'A020509',  # YoY %
        'yoy_field': 'yoy_change'
    }
}

def fetch_and_store(table, config):
    try:
        series = fetch_series('NBS', config['dataset'], config['series'])
        count = 0
        for _, row in series.iterrows():
            date = str(row['period'])
            value = row['value']
            if pd.isna(value):
                continue
            supabase.table(table).upsert({
                'date': date,
                config['yoy_field']: value
            }).execute()
            count += 1
        print(f'Fetched {count} records for {table}')
    except Exception as e:
        print(f'Failed to fetch {table}: {e}')
        return
    if 'abs_series' in config:
        try:
            abs_series = fetch_series('NBS', config['dataset'], config['abs_series'])
            count = 0
            for _, row in abs_series.iterrows():
                date = str(row['period'])
                value = row['value']
                if pd.isna(value):
                    continue
                supabase.table(table).upsert({
                    'date': date,
                    config['abs_field']: value
                }).execute()
                count += 1
            print(f'Fetched {count} absolute records for {table}')
        except Exception as e:
            print(f'Failed to fetch absolute for {table}: {e}')

for table, config in indicators.items():
    fetch_and_store(table, config)

print('Data fetch complete')