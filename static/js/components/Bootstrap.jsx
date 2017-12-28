import React from 'react';


export class Alert extends React.PureComponent {
  render() {
    const dismissible = (this.props.dismissible) ? 'alert-dismissible fade show' : '';
    let content = Array.isArray(this.props.children) ? this.props.children : [this.props.children];

    if (this.props.dismissible) {
      content.push(
        <button key={`dismiss-${this.props.id}`} type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      )
    }

    return (
      <div id={alert.id} className={`alert alert-${this.props.severity} ${dismissible}`}>{content}</div>
    )
  }
}
