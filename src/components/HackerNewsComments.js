import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ListGroupItem } from 'react-bootstrap';
import FacebookProvider, { Comments } from 'react-facebook';
import HackerNewsComment from './HackerNewsComment';

// To do use right icon for each kind of post
class HackerNewsComments extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      comments: []
    };
    axios.get("https://hacker-news.firebaseio.com/v0/item/"+this.props.postID+".json")
      .then(response => {
        this.setState({
          comments: response.data.kids
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        { this.state.comments.map(commentID => <HackerNewsComment commentID={commentID} />)
        }
      </div>
    );
  }
}

export default HackerNewsComments
