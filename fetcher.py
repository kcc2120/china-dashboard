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
        'yoy_field': 'ytd_yoy_change',
        'abs_field': 'absolute_value'
    },
    'china_industrial_production': {
        'dataset': 'M_A0205',
        'series': 'A020509',  # YoY %
        'yoy_field': 'yoy_change',
        'abs_field': 'absolute_value'
    },
    'china_cpi': {
        'dataset': 'M_A01',
        'series': 'A010101',
        'yoy_field': 'yoy_change'
    },
    'china_pmi': {
        'dataset': 'M_A014',
        'series': 'A01401',
        'value_field': 'index_value'
    },
    'china_usd_cny': {
        'dataset': 'M_A07',
        'series': 'A070101',
        'value_field': 'exchange_rate'
    },
    'china_fdi': {
        'dataset': 'M_A023',
        'series': 'A02301',
        'yoy_field': 'yoy_change'
    },
    'china_unemployment': {
        'dataset': 'M_A0301',
        'series': 'A030101',
        'value_field': 'unemployment_rate'
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

            row_obj = {'date': date}
            if 'yoy_field' in config:
                row_obj[config['yoy_field']] = value
            elif 'value_field' in config:
                row_obj[config['value_field']] = value
            else:
                # fallback for non-specified
                row_obj['value'] = value

            supabase.table(table).upsert(row_obj).execute()
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


def fetch_trade_balance():
    try:
        exports_series = fetch_series('NBS', 'M_A020', 'A020101')
        imports_series = fetch_series('NBS', 'M_A020', 'A020201')

        exports_by_date = {str(r['period']): r['value'] for _, r in exports_series.iterrows() if not pd.isna(r['value'])}
        imports_by_date = {str(r['period']): r['value'] for _, r in imports_series.iterrows() if not pd.isna(r['value'])}

        all_dates = sorted(set(exports_by_date.keys()) | set(imports_by_date.keys()))

        for dt in all_dates:
            export_val = exports_by_date.get(dt)
            import_val = imports_by_date.get(dt)
            balance_val = None
            if export_val is not None and import_val is not None:
                balance_val = export_val - import_val

            supabase.table('china_trade_balance').upsert({
                'date': dt,
                'exports_usd_billion': export_val,
                'imports_usd_billion': import_val,
                'balance_usd_billion': balance_val
            }).execute()

        print(f'Fetched trade balance series for {len(all_dates)} periods')
    except Exception as e:
        print(f'Failed to fetch china_trade_balance: {e}')


for table, config in indicators.items():
    fetch_and_store(table, config)

fetch_trade_balance()

print('Data fetch complete')