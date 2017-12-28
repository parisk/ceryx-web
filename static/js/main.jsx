window.$ = $;

import 'bootstrap';

import React from 'react';
import ReactDOM from 'react-dom';
import { RouteList } from './components/Route.jsx';


fetch('/api/routes/').then((response) => {
  if (!response.ok) {
    alert(`Could not fetch routes (status ${response.status})!`);
  } else {
    response.json().then((data) => {
      let routesContainer = document.querySelector('.route-container');

      ReactDOM.render(<RouteList routes={data} />, routesContainer)
    });
  }
});
