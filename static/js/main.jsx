window.$ = $;

import 'bootstrap';

import React from 'react';
import ReactDOM from 'react-dom';

import { alerts, ceryx, routes } from './ceryx';
import { Alert } from './components/Bootstrap.jsx';
import { RouteList } from './components/Route.jsx';
import { AlertList } from './components/Alert.jsx';


// Render new routes, whenever they are being fetched from the server.
routes.subscribe((newState, oldState) => {
  let routesContainer = document.querySelector('.route-container');
  ReactDOM.render(<RouteList routes={newState} />, routesContainer);
});


// Render new alerts, whenever they are being added in the store
alerts.subscribe((newState, oldState) => {
  let alertsContainer = document.querySelector('.main-alert-container');
  ReactDOM.render(<AlertList alerts={newState} />, alertsContainer);
});

// Initialize the application right after the DOM loads.
$(() => {
  // First, fetch the routes from the server, in order to display them
  ceryx.fetchRoutes();

  // Next, whenever a Bootstrap modal loads, then
  //   1. Reset its form (if any)
  //   2. Enabled any disabled buttons
  //   3. Focus the first input element available
  $('.modal').on('shown.bs.modal', function() {
    let form = this.querySelector('form');
    if (form) {
      this.querySelector('form').reset();
    }
    $(this).find('button[type="submit"]').removeAttr('disabled');
    $(this).find('input').first().focus();
  });

  $('#add-new-route-modal').on('shown.bs.modal', function(e) {
    $('#new-route-source').val(e.relatedTarget.dataset.routeSource);
    $('#new-route-target').val(e.relatedTarget.dataset.routeTarget);
  });

  $('#add-new-route-form').on('submit', function(e) {
    e.preventDefault();

    const form = this;
    const alertContainer = form.querySelector('.alert-container');
    const source = $('#new-route-source').val();
    const target = $('#new-route-target').val();

    $(form).find('button[type="submit"]').attr('disabled', 'disabled');
    alertContainer.innerHTML = '';

    ceryx.create({
      source: source,
      target: target
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
        let tempRoutes = routes.getState().concat([{
          source: source,
          target: target,
          state: {
            status: 'creating'
          }
        }]);
        let routesContainer = document.querySelector('.route-container');
        ReactDOM.render(<RouteList routes={tempRoutes} />, routesContainer);
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
