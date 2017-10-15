import React from 'react';
import axios from 'axios';
import FacebookProvider, { Login } from 'react-facebook';
import { Post } from '../Post';
import { ListGroup } from 'react-bootstrap';
import { ListGroupItem } from 'react-bootstrap';

class HomePage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.getPosts = this.getPosts.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
  }

  handleResponse(response) {
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
			<button onClick={this.getPosts}>
          		Click me
        	</button>
      </div>
    );
  }
}

export default HomePage
