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
    this.getFbComments = this.getFbComments.bind(this);
    this.state = {};
    let getComments;
    if (props.platform == "hacker-news") {
      getComments = this.getHnPostComments(props.postId, 1)
    } else if (props.platform == "facebook") {
      getComments = this.getFbComments(props.postId, props.fbToken, 1)
    }
    if (getComments) {
      getComments.then(comments => {
        this.setState({comments: comments});
      })
      .catch(err => {
        console.log(JSON.stringify(err));
        this.setState({errorGettingComments: true});
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
        let comment = {
          id: response.data.id,
          author: response.data.by,
          content: response.data.text,
          depth: depth
        }
        let childrenIds = response.data.kids;
        if (childrenIds) {
          comment.getChildren = () => Promise.all(childrenIds.map(id => this.getHnComment(id, depth + 1)));
        } else {
          comment.getChildren = () => new Promise(resolve => resolve([]));
        }
        // we preload the comments unless we are at certain depth levels where
        // we want to have the comments initially collapsed
        if (this.props.collapsePoints && !this.props.collapsePoints.includes(depth)) {
          return comment.getChildren().then(children => {
            comment.getChildren = () => new Promise(resolve => resolve(children));
            return comment;
          });
        }
        return comment;
      });
  }

  getFbComments(id, fbToken, depth) {
    let requestURL = "https://graph.facebook.com/"+id+"/comments";
    let requestData = {"headers": {"Authorization": "Bearer " + fbToken}};
    return axios.get(requestURL, requestData)
      .then(response => {
        if (!response.data || !response.data.data) {
          return [];
        }
        let comments = response.data.data.map(fbComment => {
          comment = {
            id: fbComment.id,
            author: fbComment.from.name,
            content: fbComment.data.message,
            depth: depth,
            getChildren: getFbComments(comment.id, fbToken, depth + 1)
          }
          // we preload the comments unless we are at certain depth levels where
          // we want to have the comments initially collapsed
          if (this.props.collapsePoints && !this.props.collapsePoints.includes(depth)) {
            return comment.getChildren().then(children => {
              comment.getChildren = () => new Promise(resolve => resolve(children));
              return comment;
            });
          }
        });
        return Promise.all(comments);
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
      { this.state.comments ?
        this.state.comments.slice(0, this.props.rootComments).map(comment => 
            <Comment 
              {...comment}
              collapsePoints={this.props.collapsePoints}
              initialVisibleChildren={this.props.initialVisibleChildren}
              moreButtonChildren={this.props.moreButtonChildren}
              />)
      : <h3>Loading</h3>
      }
        <a className="more-comments-link" href={this.props.postLink}>Full Post</a>
      </div>
    );
  }
}

export default CommentsSection
