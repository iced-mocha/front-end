import React from 'react';
import { LoginButton, SignupButton } from './Login'
import { DismissableAlert } from '../alerts/Alerts'
import { Redirect } from 'react-router';
import $ from "jquery";
import { Form, FormGroup, FormControl, Button } from 'react-bootstrap'

class SignupForm extends React.Component {

	constructor (props){
	  super(props);
	  this.prepareData = this.prepareData.bind(this);
	  this.handleSubmit = this.handleSubmit.bind(this);
		this.validUserPass = this.validUserPass.bind(this);
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
		return !(obj['username'] === "" || obj['password'] === "")
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

	  // Post to backend
	  $.ajax({
		  type: "POST",
		  url: "http://localhost:3000/v1/users",
		  data: JSON.stringify(preparedData),
		  xhrFields: {
				withCredentials: false
		  },
	    success: function(json) {
		    // Probably want to do something different
				self.setState({signupRedirect: true});
	    },
      error: function (xhr) {
				var data = JSON.parse(xhr.responseText);
				self.state.addError(self.buildError(data['error']));
	    }
	  });
	}


	render() {
	  if (this.state.signupRedirect) {
	    return <Redirect push to="/login" />;
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
			<Button type="submit">
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
				<div className="error-container">
					{this.state.error}
				</div>
	      <div className="signup-page">
	        <h1>Signup</h1>
					<SignupForm addError={this.addError}/>
	      </div>
			</div>
    );
  }
}

export default SignupPage
