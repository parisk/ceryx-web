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

export let ceryx = {
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
