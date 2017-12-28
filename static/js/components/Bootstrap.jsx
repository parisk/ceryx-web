import React from 'react';


export class Alert extends React.PureComponent {
  render() {
    const dismissible = (this.props.dismissible) ? 'alert-dismissible fade show' : '';
    return (
      <div className={`alert alert-${this.props.severity} ${dismissible}`}>{this.props.children}</div>
    )
  }
}
