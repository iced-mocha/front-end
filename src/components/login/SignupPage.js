import React from 'react';
import { LoginButton, SignupButton } from './Login'
import $ from "jquery";
import { Form, FormGroup, FormControl, Button } from 'react-bootstrap'

class SignupForm extends React.Component {

	constructor (props){
	  super(props);
	  this.prepareData = this.prepareData.bind(this);
	  this.handleSubmit = this.handleSubmit.bind(this);
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

	  console.log("test")

	  var valueMap = $('#signupForm').serializeArray()	

	  // Post to backend
	  $.ajax({
		  type: "POST",
		  url: "http://localhost:3000/v1/users",
		  data: JSON.stringify(self.prepareData(valueMap)),
		  xhrFields: {
			withCredentials: false
		  },
	      success: function(json) {
		    // Probably want to do something different
		    console.log("success", json);
	      },
          error: function (xhr) {
		    console.log("error");
	      }
	   });
	}
	
	
	render() {
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
  render() {
    return (
      <div className="signup-page">
        <h1>Signup</h1>
		<SignupForm />
      </div>
    );
  }
}

export default SignupPage
