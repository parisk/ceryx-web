import React from 'react';

import { ceryx, alerts, addAlert, removeAlert } from '../ceryx';


export class Route extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.state || {
      status: 'ok'
    };
  }

  onRestoreButtonClick(alertId) {
    alerts.dispatch(removeAlert, alertId);
  }

  onDeleteButtonClick(e) {
    this.setState({
      status: 'deleting'
    });

    ceryx.delete(this.props.source).then((response) => {
      if (response.ok) {
        this.setState({
          status: 'deleted'
        });

        let alertId = `alert-route-delete-successful-${this.props.source}`;

        alerts.dispatch(addAlert, {
          content: [
            `Route ${this.props.source} → ${this.props.target} deleted successfully. Want to `,
            <button key={`restore-${this.props.source}`}
                    className="btn btn-link"
                    type="button"
                    data-toggle="modal"
                    data-target="#add-new-route-modal"
                    data-route-source={this.props.source}
                    data-route-target={this.props.target}
                    onClick={this.onRestoreButtonClick.bind(this, alertId)}
            >
              restore it
            </button>,
            '?'
          ],
          severity: 'secondary',
          dismissible: true,
          id: alertId
        });
      } else {
        alert('Could not delete route!');
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    let nextState = nextProps.state || {
      status: 'ok'
    };

    if (this.state != nextState) {
      this.setState(nextState);
    }
  }

  render() {
    return (
      <li className="list-group-item" data-status={this.state.status}>
        <span className="route-source">{this.props.source}</span>
        <span className="route-target">{this.props.target}</span>

        <button className="delete-route float-right" onClick={this.onDeleteButtonClick.bind(this)} disabled={this.state.status != 'ok'}>
          <i className="far fa-trash-alt"></i>
        </button>
      </li>
    )
  }
}

export class RouteList extends React.Component {
  render() {
    let routes = this.props.routes.slice(0).sort((a, b) => {
      return (a.source > b.source) ? 1 : -1
    });

    return routes.map((route) => {
      return <Route key={`route-${route.source}`} source={route.source} target={route.target} state={route.state} />
    });
  }
}
