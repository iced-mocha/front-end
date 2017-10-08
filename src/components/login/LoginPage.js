import React from 'react';
import FacebookSection from './FacebookSection'
import RedditSection from './RedditSection'

class LoginPage extends React.Component {
  render() {
    return (
      <div className="login-page">
        <h1>Login</h1>
        <FacebookSection />
        <RedditSection />
      </div>
    );
  }
}

export default LoginPage
