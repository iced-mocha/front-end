import React from 'react';
import { LoginButton, SignupButton } from './Login';
import { DismissableAlert } from '../alerts/Alerts';
import { Redirect } from 'react-router';
import $ from "jquery";
import { Form, FormGroup, FormControl, Button, ControlLabel } from 'react-bootstrap';
import Config from '../../../config.json';

class SignupForm extends React.Component {

	constructor (props){
	  super(props);
	  this.prepareData = this.prepareData.bind(this);
	  this.handleSubmit = this.handleSubmit.bind(this);
		this.validUserPass = this.validUserPass.bind(this);
		this.confirmPasswordMatch = this.confirmPasswordMatch.bind(this);
		this.buildError = this.buildError.bind(this);
	  this.state = { signupRedirect: false, addError: props.addError  };
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ addError: nextProps.addError });
	}

	// Converts the array data from serializeArray() into usable JSON
	prepareData(formArray) {
		var map = {};
		for (var i = 0; i < formArray.length; i++) {
		  map[formArray[i]['name']] = formArray[i]['value'];
		}

		return map;
	}

	buildError(message) {
		return (
			<DismissableAlert type='danger' title='Unable to signup' message={message} />
		);
	}

	validUserPass(obj) {
		return !(obj['username'] === "" || obj['password'] === "");
	}

	confirmPasswordMatch(obj) {
		return obj['password'] === obj['confirmPassword'];
	}

	handleSubmit(e) {
	  e.preventDefault();

	  // Allow us to access 'this'
    var self = this;

	  var valueMap = $('#signupForm').serializeArray()
		var preparedData = self.prepareData(valueMap)

		if (!self.validUserPass(preparedData)) {
			self.state.addError(self.buildError("please enter both a username and password to signup"));
			return
		}

		if(!self.confirmPasswordMatch(preparedData)) {
			self.state.addError(self.buildError("passwords do not match"));
			return
		}

	  // Post to backend
	  $.ajax({
		  type: "POST",
		  url: self.props.core + "/v1/users",
		  data: JSON.stringify(preparedData),
		  xhrFields: {
				withCredentials: false
		  },
	    success: function(json) {
        $.ajax({
          type: "POST",
          url: Config.coreURL + "/v1/login",
          data: JSON.stringify(preparedData),
          xhrFields: {
            withCredentials: true
          },
          success: function(json) {
            console.log(JSON.stringify(self.props));
            // Cause a rerender of our global components
            self.props.updateLoginStatus(true);
            self.setState({signupRedirect: true});
          },
          error: function (xhr) {
            //TODO: ensure responseText is JSON;
            var data = JSON.parse(xhr.responseText);
            self.state.addError(self.buildError(data['error']));
          }
        });
	    },
      error: function (xhr) {
				var data = JSON.parse(xhr.responseText);
				self.state.addError(self.buildError(data['error']));
	    }
	  });
	}


	render() {
	  if (this.state.signupRedirect) {
	    return <Redirect push to="/" />;
	  }

	  return (
			<div className="sign-form">
			  <Form id="signupForm" onSubmit={this.handleSubmit} method="post">
				<FormGroup controlId="formUsername">
				  <FormControl type="text" name="username" placeholder="Username" />
				</FormGroup>
				<FormGroup controlId="formPassword">
				  <FormControl type="password" name="password" placeholder="Password" />
				</FormGroup>
				<FormGroup controlId="formConfirmPassword">
					<FormControl type="password" name="confirmPassword" placeholder="Confirm Password" />
				</FormGroup>
				<Button className="signup-button" bsStyle="primary" type="submit">
				  Signup
				</Button>
			  </Form>
			</div>
    );
	}
}

class SignupPage extends React.Component {
	constructor (props){
		super(props);
		this.addError = this.addError.bind(this);
		this.state = { error: ""};
	}

	componentWillReceiveProps(nextProps) {
		// Erase our current error messages
		this.state = { error: ""};
	}

	addError(error) {
		this.setState({error: error})
	}

  render() {
    return (
			<div>
	      <div className="signup-page">
					<div className="error-container">
						{this.state.error}
					</div>
	        <h1>Signup</h1>
					<SignupForm updateLoginStatus={this.props.updateLoginStatus} core={this.props.core} addError={this.addError}/>
	      </div>
			</div>
    );
  }
}

export default SignupPage
