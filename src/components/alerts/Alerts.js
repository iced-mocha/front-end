import React from 'react';
import { Alert }  from 'react-bootstrap';

export class DismissableAlert extends React.Component {
  constructor(props) {
    super(props);
		this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
    this.state = {
			alertVisible: true,
			type: props.type,
			title: props.title,
			message: props.message
		};
  }

  componentWillReceiveProps(props) {
    this.state = {
      alertVisible: true,
      type: props.type,
      title: props.title,
      message: props.message
    };
  }

  handleAlertDismiss() {
    this.setState({ alertVisible: false });
  }

  render() {
    if (this.state.alertVisible) {
      return (
        <Alert bsStyle={this.state.type} onDismiss={this.handleAlertDismiss}>
          <h4>{this.state.title}</h4>
          <p>{this.state.message}</p>
        </Alert>
      );
		}
		// Have to return something
		return (<div></div>);
	}
}
