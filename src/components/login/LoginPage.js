import React from 'react';
import FacebookLogin from './FacebookLogin'

export class LoginPage extends React.Component {
  render() {
    return (
      <div className="login-page">
        <h1>Login</h1>
        <FacebookLogin />
      </div>
    );
  }
}

export default LoginPage
