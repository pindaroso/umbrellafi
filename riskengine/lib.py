import warnings
import pandas as pd
from pypfopt import expected_returns
from pypfopt import HRPOpt
from urllib3.exceptions import InsecureRequestWarning
import pytz
import requests
import os
from dotenv import load_dotenv


warnings.simplefilter(action='ignore', category=FutureWarning)
warnings.simplefilter(action='ignore', category=InsecureRequestWarning)

dir = os.path.dirname(os.path.realpath(__file__))

load_dotenv()

ASSETS_CSV = os.path.join(dir, 'data/assets.csv')
PRICES_CSV = os.path.join(dir, 'data/prices.csv')

PRICE_CSV = os.path.join(dir, './data/prices/%s.csv')

tz = pytz.timezone('America/New_York')

if (EODHD_API_KEY := os.getenv('EODHD_API_KEY')) is None:
    raise Exception('EODHD_API_KEY is not set')


def calculate_performance(assets: list[str]):
    prices = pd.read_csv(PRICES_CSV, parse_dates=True, index_col='Date')
    prices = prices[assets]
    rets = expected_returns.returns_from_prices(prices)

    hrp = HRPOpt(rets)
    hrp.optimize()
    clean = hrp.clean_weights()

    (expected_annual_return, annual_volatility,
     sharpe_ratio) = hrp.portfolio_performance()

    return {
        'assets': list(clean.keys()),
        'weights': list(clean.values()),
        'expectedAnnualReturn': expected_annual_return,
        'annualVolatility': annual_volatility,
        'sharpeRatio': sharpe_ratio
    }


def read_assets():
    return pd.read_csv(ASSETS_CSV)


def fetch_asset_prices(asset: str):
    url = f'https://eodhd.com/api/eod/%s?from=1970-01-01&period=d&api_token=%s&fmt=csv' % (
        asset, EODHD_API_KEY)
    return requests.get(url).content
