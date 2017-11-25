import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ListGroupItem } from 'react-bootstrap';
import FacebookProvider, { Comments } from 'react-facebook';
import Comment from './Comment';

// To do use right icon for each kind of post
class CommentsSection extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.getHnPostComments = this.getHnPostComments.bind(this);
    this.getHnComment = this.getHnComment.bind(this);
    this.getFbPostComments = this.getFbPostComments.bind(this);
    this.state = {};
    if (props.platform == "hacker-news") {
      this.getHnPostComments(props.postId, 1)
        .then(comments => {
          this.setState({comments: comments});
        })
        .catch(err => {
          this.setState({errorGettingComments: true});
        });
    } else if (props.platform == "facebook") {
      this.buildFBComments(comments => {
        this.setState(comments);
      });
    }
  }

  getHnPostComments(postId) {
    return axios.get("https://hacker-news.firebaseio.com/v0/item/"+postId+".json")
      .then(response => {
        let childrenIds = response.data.kids;
        if (childrenIds) {
          return Promise.all(childrenIds.map(id => this.getHnComment(id, 1)));
        }
        return [];
      });
  }

  getHnComment(id, depth) {
    return axios.get("https://hacker-news.firebaseio.com/v0/item/"+id+".json")
      .then(response => {
        let post = {
          id: response.data.id,
          author: response.data.by,
          content: response.data.text,
          depth: depth
        }
        let childrenIds = response.data.kids;
        if (childrenIds) {
          post.getChildren = () => Promise.all(childrenIds.map(id => this.getHnComment(id, depth + 1)));
        } else {
          post.getChildren = () => new Promise(resolve => resolve([]));
        }
        // we preload the comments unless we are at certain depth levels where
        // we want to have the comments initially collapsed
        if (depth != 3 && depth != 6) {
          return post.getChildren().then(children => {
            post.getChildren = () => new Promise(resolve => resolve(children));
            return post;
          });
        }
        return post
      });
  }

  getFbPostComments() {

  }

  render() {
    return (
      <div>
      { this.state.comments ?
        this.state.comments.slice(0, 5).map(comment => <Comment {...comment}/>) :
        <h3>Loading</h3>
      }
      </div>
    );
  }
}

export default CommentsSection
