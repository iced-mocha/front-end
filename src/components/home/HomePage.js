import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import FacebookSection from '../login/FacebookSection';
import Post from '../Post';
import util from 'util';
import { ListGroup } from 'react-bootstrap';
import { ListGroupItem } from 'react-bootstrap';

class HomePage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      posts: [],
      fbId: "",
      fbToken: "",
      pageToken: "",
      loadingMorePosts: false
    };
    this.getMorePosts = this.getMorePosts.bind(this);
    this.onFacebookLogin = this.onFacebookLogin.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  onFacebookLogin(id, token) {
    this.setState({
      fbId: id,
      fbToken: token
    });
  }

  // TODO: This function shouldn't depend on state
  getMorePosts() {
    this.setState({loadingMorePosts: true});
    // TODO: We need to detect when there are no more pages to load
    var url
    if (this.state.pageToken !== "") {
      url = "http://localhost:3000/v1/posts?page_token=" + this.state.pageToken;
    } else {
      url = "http://localhost:3000/v1/posts?fb_id="+this.state.fbId+"&fb_token="+this.state.fbToken
    }
    axios.get(url, {withCredentials: true})
      .then(response => {
        var data = response.data
        this.setState({
          posts: this.state.posts.concat(data.posts),
          pageToken: data.page_token,
          loadingMorePosts: false
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  onScroll() {
    const distToBottom = ReactDOM.findDOMNode(this.refs["post-list"]).getBoundingClientRect().bottom - window.innerHeight;
    if (distToBottom < 1000 && !this.state.loadingMorePosts) {
      this.getMorePosts();
    }
  }

  componentDidMount() {
    document.addEventListener("scroll", this.onScroll);
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
        <ListGroup ref="post-list">
          { listItems }
        </ListGroup> 
      </div>
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
