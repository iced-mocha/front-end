import React from 'react';
import axios from 'axios';
import FacebookProvider, { Login } from 'react-facebook';

class HomePage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.getPosts = this.getPosts.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
  }

  handleResponse(response) {
    console.log("user info is:");
    console.log(response);
    console.log("user ID is " + response.profile.id);
    console.log("access token is " + response.tokenDetail.accessToken);
    axios.get("http://localhost:8080/posts?fb_id="+response.profile.id+"&fb_token="+response.tokenDetail.accessToken)
      .then(response => {
        console.log(response);
        this.setState({
          posts: JSON.stringify(response)
        });
      });
  }
  
  handleError(error) {
    console.log(error);
  }

  getPosts() {
    console.log("getting posts")
    axios.get("http://localhost:8080/posts")
      .then(response => {
        console.log(response.data);
        this.setState({
          posts: JSON.stringify(response.data)
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    console.log("redner");
    console.log(this.state);
    return (
      <div className="home-page">
        <h1>Home Page</h1>
				<FacebookProvider appId="107162943325268">
					<Login
						scope="public_profile,user_friends,user_likes,user_posts,user_events"
						onResponse={this.handleResponse}
						onError={this.handleError}>
						<span>Login via Facebook</span>
					</Login>
				</FacebookProvider>
        <h1>Data</h1>
        {this.state.posts}
        <button onClick={this.getPosts}>
          Click me
        </button>
      </div>
    );
  }
}

export default HomePage
