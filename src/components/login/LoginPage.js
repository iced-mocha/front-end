import React from 'react';
import $ from "jquery";
import { LoginButton, SignupButton } from './Login';
import { DismissableAlert } from '../alerts/Alerts';
import { Redirect } from 'react-router';
import { Form, FormGroup, FormControl, Button } from 'react-bootstrap';
import Config from '../../../config.json';

class LoginForm extends React.Component {
	constructor (props){
	  super(props);
	  this.prepareData = this.prepareData.bind(this);
	  this.handleSubmit = this.handleSubmit.bind(this);
	  this.buildError = this.buildError.bind(this);
	  this.validUserPass = this.validUserPass.bind(this);
    this.state = { loginRedirect: false, addError: props.addError };
	}

	componentWillReceiveProps(nextProps) {
    this.setState({ loginRedirect: nextProps.loginRedirect, addError: nextProps.addError });
	}

	// Converts the array data from serializeArray() into usable JSON
	prepareData(formArray) {
		var map = {};
		for (var i = 0; i < formArray.length; i++){
		  map[formArray[i]['name']] = formArray[i]['value'];
		}

		return map
  }

	buildError(message) {
		return (
			<DismissableAlert type='danger' title='Unable to login' message={message} />
		);
	}

	validUserPass(obj) {
		return !(obj['username'] === "" || obj['password'] === "")
	}

	handleSubmit(e) {
	  e.preventDefault();

	  // Allow us to access 'this'
    var self = this;
	  var valueMap = $('#loginForm').serializeArray()
		var preparedData = self.prepareData(valueMap)

		if (!self.validUserPass(preparedData)) {
			self.state.addError(self.buildError("please enter both a username and password to login"));
			return
		}

	  // Post to backend
	  $.ajax({
		  type: "POST",
		  url: Config.coreURL + "/v1/login",
		  data: JSON.stringify(preparedData),
		  xhrFields: {
			withCredentials: true
		  },
	    success: function(json) {
				// Cause a rerender of our global components
				self.props.updateLoginStatus(true);
				self.setState({loginRedirect: true});
	    },
      error: function (xhr) {
				//TODO: ensure responseText is JSON;
				var data = JSON.parse(xhr.responseText);
				self.state.addError(self.buildError(data['error']));
	    }
	  });
	}

	render() {
	  if (this.state.loginRedirect) {
	    return <Redirect push to="/" />;
	  }


	  return (
			<div className="login-form">
				<Form id="loginForm" onSubmit={this.handleSubmit} method="post">
					<FormGroup controlId="formUsername">
						<FormControl type="text" name="username" placeholder="Username" />
					</FormGroup>
					<FormGroup controlId="formPassword">
						<FormControl type="password" name="password" placeholder="Password" />
					</FormGroup>
					<div className="login-buttons">
						<SignupButton />
						<Button type="submit">
							Login
						</Button>
					</div>
				</Form>
			</div>
    );
	}
}

class LoginPage extends React.Component {
  constructor (props){
    super(props);
	  this.addError = this.addError.bind(this);
		this.state = { error: ""};
  }

	componentWillReceiveProps(nextProps) {
		// Erase our current error messages
		this.state = { error: ""};
	}

	addError(err) {
		this.setState({error: err})
	}

  render() {
    return (
			<div>
				<div className="error-container">
					{this.state.error}
				</div>
				<div className="login-page">
					<h1>Login</h1>
					<LoginForm updateLoginStatus={this.props.updateLoginStatus} addError={this.addError}/>
				</div>
			</div>
    );
  }
}

export default LoginPage
