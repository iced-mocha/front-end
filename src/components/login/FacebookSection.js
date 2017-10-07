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
    console.log("user info is:");
    console.log(response);
    console.log("user ID is " + response.profile.id);
    console.log("access token is " + response.tokenDetail.accessToken);
    axios.get("http://localhost:8080/facebook-feed?id="+response.profile.id+"&token="+response.tokenDetail.accessToken)
      .then(response => {
        console.log(response);
        this.setState({
          facebookData: JSON.stringify(response)
        });
      });
  }
  
  handleError(error) {
    console.log(error);
  }

  render() {
    console.log(this.state)
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
        <h1>Data</h1>
          {this.state.facebookData}
      </div>
    );
  }
}

export default FacebookSection
