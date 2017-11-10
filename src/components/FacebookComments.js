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
  }

  render() {
    return (
      <div>
        Facebook comment: token, id: {this.props.fbId} token: {this.props.fbToken}
      </div>
    );
  }
}

export default HackerNewsComments
