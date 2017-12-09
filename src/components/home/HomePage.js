import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import fs from 'fs';
import https from 'https';
import FacebookSection from '../login/FacebookSection';
import Post from '../posts/Post';
import util from 'util';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Config from '../../../config.json';

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

    var url = this.props.core + "/v1/posts"
    if (this.state.pageToken !== "") {
      url = url + "?page_token=" + this.state.pageToken;
    }

    axios({
        method: 'get',
        url: url,
        withCredentials: true
      })
      .then(response => {
        var data = response.data;
        this.setState({
          posts: this.state.posts.concat(data.posts),
          pageToken: data.page_token,
          loadingMorePosts: false,
          noMorePosts: data.posts.length == 0
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
    this.getMorePosts();
  }

  render() {
    var listItems;
    var i = 0;

    if (this.state.posts.length === 0) {
        return (<div className='spinner-wrapper'><FontAwesome name='spinner' spin /></div>);
    }

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
          i++;
          // TODO: Currently postData.id is undefined resulting in an error on front-end
          //return <Post key={postData.id} {...postData} />
          return <Post key={i} {...postData} />;
        }
    );

    return (
      <div className="home-page">
        <div className="post-list">
          <ListGroup ref="post-list">
            { listItems }
          </ListGroup>
          { this.state.noMorePosts ||
            <div className='spinner-wrapper'><FontAwesome name='spinner' spin /></div>
          }
        </div>
      </div>
    );
  }
}

export default HomePage
