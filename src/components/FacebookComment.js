import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ListGroupItem } from 'react-bootstrap';
import FacebookProvider, { Comments } from 'react-facebook';

// To do use right icon for each kind of post
class FacebookComment extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      visibleChildren: 10,
      children: []
    };

    let requestURL = "https://graph.facebook.com/"+props.id+"/comments";
    let requestData = {"headers": {"Authorization": "Bearer " + props.fbToken}};
    axios.get(requestURL, requestData)
      .then(response => {
        this.setState({
          children: response.data.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
  render() {
    return (
      <div className="comment" key={this.props.commentID}>
        <div className="comment-header">
          <h4 className="comment-author">{this.props.author}</h4>
        </div>
        <div className="inner-comments">{this.props.message}</div>
        { this.state.children.splice(0, this.state.visibleChildren).map(child => {
          <div className="comment" key={child.id}>
            <div className="comment-header">
              <h4 className="comment-author">{child.author}</h4>
            </div>
            <div className="inner-comments">{child.message}</div>
          </div>
        })}
        { this.state.children.length > this.state.visibleChildren &&
          <button className="transparent-button" onClick={() => this.setState({visibleChildren: this.state.visibleChildren + 10})}>
            <div className="comment-header">
              <img className="expand-icon" src="/img/expand-icon.png"/>
              <h4 className="more-comments">more</h4>
            </div>
          </button>
        }
      </div>
    );
  }
}

export default FacebookComment
