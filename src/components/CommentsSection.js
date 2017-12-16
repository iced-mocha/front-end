import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ListGroupItem } from 'react-bootstrap';
import FacebookProvider, { Comments } from 'react-facebook';
import Comment from './Comment';
import FontAwesome from 'react-fontawesome'

class CommentsSection extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.getHnPostComments = this.getHnPostComments.bind(this);
    this.getHnComment = this.getHnComment.bind(this);
    this.getFbComments = this.getFbComments.bind(this);
    this.getRedditComments = this.getRedditComments.bind(this);
    this.getRedditComment = this.getRedditComment.bind(this);
    this.htmlDecode = this.htmlDecode.bind(this);
    this.state = {};
    let getComments;

    if (props.platform == "hacker-news") {
      getComments = this.getHnPostComments(props.postId, 1);
    } else if (props.platform == "facebook") {
      getComments = this.getFbComments(props.postId, props.fbToken, 1);
    } else if (props.platform == "reddit") {
      getComments = this.getRedditComments("https://www.reddit.com/r/" + props.subreddit + "/comments/" + props.postId + ".json");
    }

    if (getComments) {
      getComments.then(comments => {
        this.setState({comments: comments});
      })
      .catch(err => {
        console.log(err);
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
          type: 'hacker-news',
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
            type: 'facebook',
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

  getRedditComments(commentsURL) {
    return axios.get(commentsURL)
      .then(response => {
        // Case where we receive no comments
        if (!response.data[1] || !response.data[1].data) {
          return [];
        }
        let postComments = response.data[1].data.children;
        return postComments.map(c => this.getRedditComment(c, 1));
      })
      .catch (err => {
        console.log(err);
      });
  }

  getRedditComment(comment, depth) {
    if (!comment.data) {
      return
    }

    let children = [];
    if (comment.data.replies && Array.isArray(comment.data.replies.data.children)) {
      children = comment.data.replies.data.children.map(c => this.getRedditComment(c, depth + 1));
    }
    return {
      id: comment.data.id,
      score: comment.data.score,
      author: comment.data.author,
      type: 'reddit',
      content: this.htmlDecode(comment.data.body_html),
      depth: depth,
      getChildren: () => new Promise(resolve => resolve(children))
    }
  }

  htmlDecode(input) {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes[0].nodeValue;
  }

  render() {
    if (!this.state.comments) {
      return (<div className='small-spinner-wrapper'><FontAwesome name='spinner' spin /></div>);
    }
    var id = 0;

    return (
      <div>
        { this.state.comments.slice(0, this.props.rootComments).map(comment =>
              <Comment
                key={id++}
                {...comment}
                collapsePoints={this.props.collapsePoints}
                initialVisibleChildren={this.props.initialVisibleChildren}
                moreButtonChildren={this.props.moreButtonChildren}
                />)
        }
        <a target='blank' className="more-comments-link" href={this.props.postLink}>Full Post</a>
      </div>
    );
  }
}

export default CommentsSection
