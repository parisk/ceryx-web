import React from 'react';

import { ceryx } from '../ceryx';


export class Route extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.state || {
      status: 'ok'
    };
  }

  onClick(e) {
    this.setState({
      status: 'deleting'
    });

    ceryx.delete(this.props.source).then((response) => {
      if (response.ok) {
        this.setState({
          status: 'deleted'
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

        <button className="delete-route float-right" onClick={this.onClick.bind(this)} disabled={this.state.status != 'ok'}>
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
