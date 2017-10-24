import React from 'react';
import axios from 'axios';
import FacebookSection from '../login/FacebookSection';
import { Post } from '../Post';
import { ListGroup } from 'react-bootstrap';
import { ListGroupItem } from 'react-bootstrap';

class HomePage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      fbId: "",
      fbToken: ""
    };
    this.getPosts = this.getPosts.bind(this);
    this.onFacebookLogin = this.onFacebookLogin.bind(this);
  }

  onFacebookLogin(id, token) {
    this.setState({
      fbId: id,
      fbToken: token
    });
  }

  getPosts() {
    console.log("getting posts")
    axios.get("http://localhost:8080/posts?fb_id="+this.state.fbId+"&fb_token="+this.state.fbToken)
      .then(response => {
        this.setState({
          posts: JSON.parse(response.data)
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
	var listItems

	if(this.state.posts){
		listItems = this.state.posts.map(
				function(postData) {
					if (postData.Platform === "hacker-news") {
						  postData.imgUrl = "/img/hacker-news-icon.ico";
					} else if (postData.Platform === "reddit") {
						  postData.imgUrl = "/img/reddit-icon.png";
					} else if (postData.Platform == "facebook") {
						  postData.imgUrl = "/img/facebook-icon.png";
					}	else if (postData.Platform == "google-news") {
              postData.imgUrl = "/img/google-news-icon.png";
          }

					return <Post key={postData.id} url={postData.Platform} {...postData} />
				});
	}
    return (
      <div className="home-page">
      <div className="post-list">
        <ListGroup>
          { listItems }
        </ListGroup> 
      </div>
      <FacebookSection onLogin={this.onFacebookLogin} />
			<button onClick={this.getPosts}>
          		Click me
        	</button>
      <p>
        Add google news attribution
      </p>
      </div>
    );
  }
}

export default HomePage
