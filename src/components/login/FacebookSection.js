import React from 'react';
import axios from 'axios';
import FacebookProvider, { Login } from 'react-facebook';
import Config from '../../../config.json';

class FacebookSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
    this.handleResponse = this.handleResponse.bind(this);
    this.onFacebookLogin = this.onFacebookLogin.bind(this);
    this.postFacebookInfo = this.postFacebookInfo.bind(this);
  }

	componentWillReceiveProps(nextProps) {
		this.setState({username: nextProps.username, content: nextProps.content,
      addLinkToParent: nextProps.addLinkToParent});
	}

  handleResponse(response) {
    let id = response.profile.id;
    let token = response.tokenDetail.accessToken;
		this.onFacebookLogin(id, token)
  }

  postFacebookInfo(fbToken, fbName) {
    axios({
      method: 'post',
      url: this.props.core + '/v1/users/' + this.state.username + '/authorize/facebook',
      withCredentials: true,
      data: {
        type: "facebook",
        username: fbName,
        token: fbToken
      }
    }).then(function(response) {
      // TODO: update settings page state here - or maybe not here?
    });
  }

	onFacebookLogin(id, fbToken) {
    var self = this;

    axios({
      method: 'get',
      url: 'https://graph.facebook.com/me',
      headers: {
        'Authorization': 'Bearer ' + fbToken
      }
    }).then(function(response) {
      // TODO: update settings page state here
      var fbName = response.data.name;
      self.state.addLinkToParent("facebook", fbName);
      console.log("testing")
      self.postFacebookInfo(fbToken, fbName);
    }).catch(function (error) {
      // TODO handle error
    });
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
