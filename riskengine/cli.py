import json
import click
import pandas as pd

from lib import PRICE_CSV
from lib import PRICES_CSV
import lib


@click.group()
def cli():
    pass


@cli.command()
def list_assets():
    for asset in lib.read_assets()['symbol']:
        click.echo(asset)


@cli.command()
def calculate_performance():
    assets = lib.read_assets()['symbol']
    performance = lib.calculate_performance(assets)
    click.echo(json.dumps(performance, indent=True))


@cli.command()
def fetch_asset_prices():
    asset = 'USDC-USD.CC'
    data = lib.fetch_asset_prices(asset)
    with open(PRICE_CSV % asset, 'wb') as f:
        f.write(data)


@cli.command()
def fetch_all_asset_prices():
    assets = lib.read_assets()['symbol']
    for asset in assets:
        data = lib.fetch_asset_prices(asset)
        with open(PRICE_CSV % asset, 'wb') as f:
            f.write(data)


@cli.command()
def aggregate_prices():
    dfs = []
    for asset in lib.read_assets()['symbol']:
        df = pd.read_csv(PRICE_CSV % asset)
        df.drop(columns=['Open', 'High', 'Low', 'Close',
                'Volume'], axis=1, inplace=True)
        df['Symbol'] = asset
        dfs.append(df)

    aggregate_df = pd.concat(dfs)

    pivoted_df = aggregate_df.pivot(
        index='Date', columns='Symbol', values='Adjusted_close')
    pivoted_df.reset_index(inplace=True)
    pivoted_df = pivoted_df.fillna('')
    pivoted_df = pivoted_df.set_index('Date')
    pivoted_df.to_csv(PRICES_CSV)


if __name__ == '__main__':
    cli()
