window.$ = $;

import 'bootstrap';

import React from 'react';
import ReactDOM from 'react-dom';

import { ceryx } from './ceryx';
import { Alert } from './components/Bootstrap.jsx';
import { RouteList } from './components/Route.jsx';


function fetchRoutes() {
  return ceryx.get('/api/routes/').then((response) => {
    if (!response.ok) {
      alert(`Could not fetch routes (status ${response.status})!`);
    } else {
      response.json().then((data) => {
        let routesContainer = document.querySelector('.route-container');

        ReactDOM.render(<RouteList routes={data} />, routesContainer)
      });
    }
  });
}

// After the DOM loads
$(() => {
  fetchRoutes();
  $('.modal').on('shown.bs.modal', function() {
    this.querySelector('form').reset();
    $(this).find('button[type="submit"]').removeAttr('disabled');
    $(this).find('input').first().focus();
  });

  $('#add-new-route-form').on('submit', function(e) {
    e.preventDefault();

    const form = this;
    const alertContainer = form.querySelector('.alert-container');

    $(form).find('button[type="submit"]').attr('disabled', 'disabled');
    alertContainer.innerHTML = '';

    ceryx.post('/api/routes/', {
      source: $('#new-route-source').val(),
      target: $('#new-route-target').val()
    }).then((response) => {
      $(form).find('button[type="submit"]').removeAttr('disabled');

      if (!response.ok) {
        response.text().then((text) => {
          const alert = (
            <Alert severity="danger">
              <h5>Yikes! We could not add this route.</h5>
              <hr />
              <h6>Response Status</h6>
              <pre>{response.status} {response.statusText}</pre>
              <h6>Response Body</h6>
              <pre>{text}</pre>
            </Alert>
          );
          ReactDOM.render(alert, alertContainer);
        });
      } else {
        fetchRoutes();
        $('#add-new-route-modal').modal('hide');
      }
    }).catch((error) => {
      $(form).find('button[type="submit"]').removeAttr('disabled');

      const alert = (
        <Alert severity="danger">
          <h5>Oh no! Something went wrong.</h5>
          <hr />
          <h6>Error message</h6>
          <div>{error.message}</div>
        </Alert>
      );
      ReactDOM.render(alert, alertContainer);
    });
  });
});
