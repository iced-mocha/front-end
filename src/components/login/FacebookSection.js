import React from 'react';
import axios from 'axios';
import FacebookProvider, { Login } from 'react-facebook';

class FacebookSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username: props.username, content: props.content};
    this.handleResponse = this.handleResponse.bind(this);
    this.onFacebookLogin = this.onFacebookLogin.bind(this);
  }

	componentWillReceiveProps(nextProps) {
		this.setState({username: nextProps.username, content: nextProps.content});
	}

  handleResponse(response) {
    let id = response.profile.id;
    let token = response.tokenDetail.accessToken;
		this.onFacebookLogin(id, token)
  }

	onFacebookLogin(id, fbToken) {
		axios({
			method: 'post',
		  url: 'http://0.0.0.0:3000/v1/users/' + this.state.username + '/authorize/facebook',
			withCredentials: true,
			data: {
				type: "facebook",
				username: this.state.username,
				token: fbToken
			}
		}).then(function(response) {
			// TODO: update settings page state here
		});	
	}
  
  handleError(error) {
    console.log(error);
  }

  render() {
    return (
      <div className="facebook-login">
				<FacebookProvider appId="107162943325268">
					<Login
						scope="public_profile,user_friends,user_likes,user_posts,user_events"
						onResponse={this.handleResponse}
						onError={this.handleError}>
						{this.state.content}
					</Login>
				</FacebookProvider>
      </div>
    );
  }
}

export default FacebookSection
