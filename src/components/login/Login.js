import React from 'react';
import axios from 'axios';
import { Button }  from 'react-bootstrap';
import { Redirect }  from 'react-router';

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
	this.signupRedirect = this.signupRedirect.bind(this);
    this.state = { redirect: false};
  }

  signupRedirect() {
	this.setState({ redirect: true });
  }
  
  render() {
    if (this.state.redirect) {
      return <Redirect push to="/signup" />;
	}
    return (
	  <Button onClick={this.signupRedirect}>Signup</Button>
    );
  }
}

