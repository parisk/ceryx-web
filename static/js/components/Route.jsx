import React from 'react';


export class Route extends React.PureComponent {
  render() {
    return (
      <li className="list-group-item">
        <span className="route-source">{this.props.source}</span>
        <span className="route-target">{this.props.target}</span>

        <button className="delete-route float-right">
          <i className="far fa-trash-alt"></i>
        </button>
      </li>
    )
  }
}

export class RouteList extends React.PureComponent {
  render() {
    return this.props.routes.map((route) => {
      return <Route key={`route-${route.source}`} source={route.source} target={route.target} />
    });
  }
}
