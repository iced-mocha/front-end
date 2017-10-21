import React from 'react';
import axios from 'axios';
import FacebookProvider, { Login } from 'react-facebook';

class FacebookSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleResponse = this.handleResponse.bind(this);
  }

  handleResponse(response) {
    let id = response.profile.id;
    let token = response.tokenDetail.accessToken;
    if (this.props.onLogin) {
      this.props.onLogin(id, token)
    }
  }
  
  handleError(error) {
    console.log(error);
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
