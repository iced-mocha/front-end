import React from 'react';
import FacebookProvider, { Login } from 'react-facebook';

class FacebookSection extends React.Component {
  handleResponse(response) {
    console.log("user info is:")
    console.log(response)
    console.log("user ID is " + response.profile.id)
    console.log("access token is " + response.tokenDetail.accessToken)
  }

  handleError(error) {
    console.log(error)
  }

  render() {
    return (
      <div className="facebook-login">
        <h1>Facebook Login</h1>
				<FacebookProvider appId="107162943325268">
					<Login
						scope="public_profile,user_friends,user_likes,user_posts,user_events"
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
