import { createStore } from 'elfi';

/**
 * Reducer used to update the "routes" state container with new routes.
 */
function setRoutes(state, newRoutes) {
  return newRoutes;
}

/**
 * Reducer used to update the "alerts" state container by adding a new alert.
 */
export function addAlert(state, alert) {
  let newState = state.concat([alert]);

  // If the alert has a timeout property, remove that alert in "timeout" seconds.
  if (alert.timeout) {
    setTimeout(() => alerts.dispatch(removeAlert, alert.id), alert.timeout * 1000);
  }

  return newState;
}

/**
 * Reducer used to update the "alerts" state container by removing an alert based on its id.
 */
export function removeAlert(state, alertId) {
  return state.filter((alert) => alert.id != alertId);
}

export const routes = createStore([]);
export const alerts = createStore([]);

window.alerts = alerts;
window.addAlert = addAlert;

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
      } else {
        alerts.dispatch(addAlert, {
          id: 'routes-fetch-not-ok',
          severity: 'danger',
          dismissible: true,
          timeout: 10,
          content: `We could not fetch Ceryx' routes. Response status code: ${response.status}.`
        });
      }
    }).catch((error) => {
      console.error('Promise error while fetching routes');
      console.error(error);
      alerts.dispatch(addAlert, {
        id: 'routes-fetch-promise-error',
        severity: 'danger',
        dismissible: true,
        timeout: 10,
        content: `We could not fetch Ceryx' routes. View browser's console for more details.`
      });
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
