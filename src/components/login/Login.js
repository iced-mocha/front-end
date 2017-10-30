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
  
  render() {
    return (
	  <Button><a className="signup-link" href="/signup">Signup</a></Button>
    );
  }
}

