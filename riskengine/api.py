from flask import Flask
from flask import request
import json

import lib


app = Flask(__name__)


@app.route('/performance', methods=['GET'])
def performance() -> str:
    assets = request.args.get('assets').split(',')
    performance = lib.calculate_performance(assets)
    return json.dumps(performance)


@app.route('/assets', methods=['GET'])
def assets() -> str:
    return json.dumps({
        'assets': lib.read_assets()
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0')
