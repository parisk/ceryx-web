import React from 'react';

import { ceryx } from '../ceryx';


export class Route extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'ok'
    };
  }

  onClick(e) {
    this.setState({
      status: 'deleting'
    });

    ceryx.delete(
      `/api/routes/${this.props.source}/`
    ).then((response) => {
      if (response.ok) {
        this.setState({
          status: 'deleted'
        });
      } else {
        alert('Could not delete route!');
      }
    });
  }

  render() {
    return (
      <li className="list-group-item" data-status={this.state.status}>
        <span className="route-source">{this.props.source}</span>
        <span className="route-target">{this.props.target}</span>

        <button className="delete-route float-right" onClick={this.onClick.bind(this)}>
          <i className="far fa-trash-alt"></i>
        </button>
      </li>
    )
  }
}

export class RouteList extends React.Component {
  render() {
    return this.props.routes.map((route) => {
      return <Route key={`route-${route.source}`} source={route.source} target={route.target} />
    });
  }
}
