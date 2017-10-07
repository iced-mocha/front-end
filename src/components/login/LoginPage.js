import React from 'react';
import FacebookSection from './FacebookSection'

class LoginPage extends React.Component {
  render() {
    return (
      <div className="login-page">
        <h1>Login</h1>
        <FacebookSection />
      </div>
    );
  }
}

export default LoginPage
