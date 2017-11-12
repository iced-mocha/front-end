import React from 'react';
import $ from "jquery";
import FacebookSection from './FacebookSection'
import RedditSection from './RedditSection'
import { LoginButton, SignupButton } from './Login'
import { Redirect } from 'react-router';
import { Form, FormGroup, FormControl, Button } from 'react-bootstrap'

class LoginForm extends React.Component {
	constructor (props){
	  super(props);
	  this.prepareData = this.prepareData.bind(this);
	  this.handleSubmit = this.handleSubmit.bind(this);
      this.state = { loginRedirect: false };
	}

	// Converts the array data from serializeArray() into usable JSON
	prepareData(formArray) {
		var map = {};
		for (var i = 0; i < formArray.length; i++){
		  map[formArray[i]['name']] = formArray[i]['value'];
		}

		return map
    }
	
	handleSubmit(e) {
	  e.preventDefault();
	
	  // Allow us to access 'this'
      var self = this;

	  var valueMap = $('#loginForm').serializeArray()	

	  // Post to backend
	  $.ajax({
		  type: "POST",
		  url: "http://0.0.0.0:3000/v1/login",
		  data: JSON.stringify(self.prepareData(valueMap)),
		  xhrFields: {
			withCredentials: true
		  },
	      success: function(json) {
			// Set session storage for better rendering 
			localStorage.setItem('logged-in', true)

			self.setState({loginRedirect: true});
	      },
          error: function (xhr) {
		    // TODO: report log in errors
			 console.log("error");
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
  render() {
    return (
      <div className="login-page">
        <h1>Login</h1>
		<LoginForm />
        <FacebookSection />
        <RedditSection />
      </div>
    );
  }
}

export default LoginPage
