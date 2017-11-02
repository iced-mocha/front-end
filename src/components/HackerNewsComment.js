import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ListGroupItem } from 'react-bootstrap';
import FacebookProvider, { Comments } from 'react-facebook';

// To do use right icon for each kind of post
class HackerNewsComment extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      comments: [],
      content: ""
    };
    axios.get("https://hacker-news.firebaseio.com/v0/item/"+this.props.commentID+".json")
      .then(response => {
        this.setState({
          comments: response.data.kids,
          content: response.data.text
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div key={this.props.commentID}>
        <p>{this.state.content}</p>
        <div>{JSON.stringify(this.state.comments)}</div>
      </div>
    );
  }
}

export default HackerNewsComment
