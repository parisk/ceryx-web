import os

import requests
from flask import Flask
from flask import json
from flask import render_template
from flask import request
from flask.views import MethodView
from werkzeug.wsgi import ProxyMiddleware


CERYX_API_HOST = os.getenv('CERYX_API_HOST')

app = Flask(__name__)

if os.getenv('FLASK_ENV') == 'development':
    webpack_dev_server_address = os.getenv(
        'WEBPACK_DEV_SERVER_ADDRESS', 'http://localhost:5001/',
    )
    app.wsgi_app = ProxyMiddleware(app.wsgi_app, {
        '/static/': {
            'target': webpack_dev_server_address,
        },
        '/sockjs-node/': {
            'target': webpack_dev_server_address,
        },
        '/__webpack_dev_server__/': {
            'target': webpack_dev_server_address,
        },
    })


@app.route('/')
def home():
    """
    Return the home page (dashboard) of Ceryx Web.
    """
    return render_template('index.html')


class RoutesListAPI(MethodView):
    endpoint = f'{CERYX_API_HOST}/api/routes'

    def get(self):
        """
        Return the list of all routes registered in Ceryx.
        """
        response = requests.get(self.endpoint)
        response.raise_for_status()
        route_list = response.json()
        return json.jsonify(route_list)

    def post(self):
        """
        Create a new route in Ceryx.
        """
        response = requests.post(self.endpoint, json=request.json)
        response.raise_for_status()
        route = response.json()
        return json.jsonify(**route)


class RoutesDetailAPI(MethodView):
    def delete(self, route_source):
        """
        Delete the route identified by the given route source in Ceryx.
        """
        url = f'{CERYX_API_HOST}/api/routes/{route_source}'
        response = requests.delete(url)
        response.raise_for_status()
        return json.jsonify(), 204

routes_list_view = RoutesListAPI.as_view('routes_list_view')
routes_detail_view = RoutesDetailAPI.as_view('routes_detail_view')

app.add_url_rule(
    '/api/routes/',
    view_func=routes_list_view,
    methods=['GET', 'POST'],
)

app.add_url_rule(
    '/api/routes/<route_source>/',
    view_func=routes_detail_view,
    methods=['DELETE'],
)
