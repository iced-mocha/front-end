import React from 'react';
import FacebookSection from './FacebookSection'
import RedditSection from './RedditSection'
import { LoginButton, SignupButton } from './Login'

class LoginPage extends React.Component {
  render() {
    return (
      <div className="login-page">
        <h1>Login</h1>
		<LoginButton />
		<SignupButton />
        <FacebookSection />
        <RedditSection />
      </div>
    );
  }
}

export default LoginPage
