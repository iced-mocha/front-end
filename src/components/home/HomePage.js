import React from 'react';
import axios from 'axios';
import FacebookSection from '../login/FacebookSection';
import Post from '../Post';
import { ListGroup } from 'react-bootstrap';
import { ListGroupItem } from 'react-bootstrap';

class HomePage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      posts: [],
      fbId: "",
      fbToken: "",
      pageToken: ""
    };
    this.getMorePosts = this.getMorePosts.bind(this);
    this.onFacebookLogin = this.onFacebookLogin.bind(this);
  }

  onFacebookLogin(id, token) {
    this.setState({
      fbId: id,
      fbToken: token
    });
  }

  // TODO: This function shouldn't depend on state
  getMorePosts() {
    // TODO: We need to detect when there are no more pages to load
    var url
    if (this.state.pageToken !== "") {
      url = "http://localhost:8080/posts?page_token=" + this.state.pageToken;
    } else {
      url = "http://localhost:8080/posts?fb_id="+this.state.fbId+"&fb_token="+this.state.fbToken
    }
    axios.get(url)
      .then(response => {
        var data = JSON.parse(response.data) // TODO: Shouldn't need to call JSON.parse
        this.setState({
          posts: this.state.posts.concat(data.posts),
          pageToken: data.page_token
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
          postData => {
            if (postData.Platform === "hacker-news") {
                postData.imgUrl = "/img/hacker-news-icon.ico";
            } else if (postData.Platform === "reddit") {
                postData.imgUrl = "/img/reddit-icon.png";
            } else if (postData.Platform == "facebook") {
                postData.imgUrl = "/img/facebook-icon.png";
                postData.fbId = this.state.fbId;
                postData.fbToken = this.state.fbToken;
            }	else if (postData.Platform == "google-news") {
                postData.imgUrl = "/img/google-news-icon.png";
            }

            return <Post key={postData.id} {...postData} />
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
			<button onClick={this.getMorePosts}>
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
