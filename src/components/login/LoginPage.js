import React from 'react';
import FacebookSection from './FacebookSection'
import RedditSection from './RedditSection'
import { LoginButton, SignupButton } from './Login'
import { Form, FormGroup, FormControl, Button } from 'react-bootstrap'

class LoginForm extends React.Component {
	render() {
	  return (
		<div className="login-form">
		  <Form>
			<FormGroup controlId="formUsername">
			  <FormControl type="text" placeholder="Username" />
			</FormGroup>
			<FormGroup controlId="formPassword">
			  <FormControl type="password" placeholder="Password" />
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
