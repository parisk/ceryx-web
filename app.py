import os

import requests
from flask import Flask
from flask import json
from flask import render_template
from flask import request
from flask.views import MethodView


CERYX_API_HOST = os.getenv('CERYX_API_HOST')

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


class RoutesListAPI(MethodView):
    endpoint = f'{CERYX_API_HOST}/api/routes'

    def get(self):
        response = requests.get(self.endpoint)
        response.raise_for_status()
        route_list = response.json()
        return json.jsonify(*route_list)

    def post(self):
        response = requests.post(self.endpoint, json=request.json)
        response.raise_for_status()
        route = response.json()
        return json.jsonify(**route)


class RoutesDetailAPI(MethodView):
    def get(self, route_id):
        response = requests.get(f'{CERYX_API_HOST}/api/routes/{route_id}')
        response.raise_for_status()
        route_list = response.json()
        return json.jsonify(**route_list)

    def put(self, route_id):
        pass

    def delete(self, route_id):
        response = requests.delete(f'{CERYX_API_HOST}/api/routes/{route_id}')
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
    '/api/routes/<route_id>/',
    view_func=routes_detail_view,
    methods=['GET', 'PUT', 'DELETE'],
)
