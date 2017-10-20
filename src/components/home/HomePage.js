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
	console.log("Render")
	var listItems

	if(this.state.posts){
		/*
		var imgUrl
		if (this.state.posts.Platform === "hacker-news") {
			imgUrl = "/img/hacker-news-icon.ico"
		} else if (this.state.posts.Platform === "reddit") {
			imgUrl = "/img/reddit-icon.png"
		}
	*/

		listItems = this.state.posts.map(postData => <Post key={postData.id} {...postData} />)
	}
    return (
      <div className="home-page">
			<ListGroup>
				{ listItems }
			</ListGroup> 
      <FacebookSection onLogin={this.onFacebookLogin} />
			<button onClick={this.getPosts}>
          		Click me
        	</button>
      </div>
    );
  }
}

export default HomePage
