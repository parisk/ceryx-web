import React from 'react';

import { ceryx } from '../ceryx';
import { Alert } from './Bootstrap.jsx';


export class AlertList extends React.Component {
  render() {
    return this.props.alerts.map((alert) => {
      return <Alert id={alert.id} key={alert.id} severity={alert.severity} dismissible={alert.dismissible}>{alert.content}</Alert>;
    });
  }
}
