import React from 'react';
import FacebookProvider, { Login } from 'react-facebook';

class FacebookSection extends React.Component {
  responseFacebook(response) {
    console.log(response)
  }

  componentClicked() {

  }

  render() {
    return (
      <div className="facebook-login">
        <h1>Facebook Login</h1>
				<FacebookProvider appId="107162943325268">
					<Login
						scope="email"
						onResponse={this.handleResponse}
						onError={this.handleError}>
						<span>Login via Facebook</span>
					</Login>
				</FacebookProvider>
      </div>
    );
  }
}

export default FacebookSection
