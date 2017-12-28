import {createStore} from 'elfi';


export const routes = createStore([]);

window.routes = routes;

function setRoutes(state, newRoutes) {
  return newRoutes;
}


function _ceryx(method, url, data={}) {
  let options = {
    method: method,
    headers: {
      'content-type': 'application/json'
    },
    credentials: 'include'
  };

  if (['POST', 'PUT'].indexOf(method) > -1) {
    options.body = JSON.stringify(data);
  }

  return fetch(url, options);
}

export let api = {
  get: function(url) {
    return _ceryx('GET', url);
  },
  post: function(url, data) {
    return _ceryx('POST', url, data);
  },
  put: function(url, data) {
    return _ceryx('PUT', url, data);
  },
  delete: function(url) {
    return _ceryx('DELETE', url);
  }
};

export let ceryx = {
  fetchRoutes: function() {
    let promise = api.get('/api/routes/');

    promise.then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          routes.dispatch(setRoutes, data);
        });
      }
    });

    return promise;
  },
  create: function (route) {
    let promise = api.post('/api/routes/', route);

    promise.then((response) => {
      ceryx.fetchRoutes();
    });

    return promise;
  },
  delete: function(source) {
    let promise = api.delete(`/api/routes/${source}/`);

    promise.then((response) => {
      ceryx.fetchRoutes();
    });

    return promise;
  }
};
