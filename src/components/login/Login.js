import React from 'react';
import axios from 'axios';
import { Button }  from 'react-bootstrap';

export class LoginButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  login(e) {
	console.log("Test")
  }

  render() {
    return (
	  <button onClick={this.login}>Login</button>
    );
  }
}

export class SignupButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  signup(e) {

	console.log("About to signup user")

	// When this clicks we must show a text box and allow them to enter a user name
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'http://localhost:3000/v1/users', true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({
		    username: "userID"
	}));
  }

  render() {
    return (
	  <Button onClick={this.signup}>Signup</Button>
    );
  }
}

