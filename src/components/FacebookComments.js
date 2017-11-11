import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ListGroupItem } from 'react-bootstrap';
import FacebookProvider, { Comments } from 'react-facebook';
import FacebookComment from './FacebookComment';

// To do use right icon for each kind of post
class FacebookComments extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      comments: []
    };
    let requestURL = "https://graph.facebook.com/"+props.objectId+"/comments";
    let requestData = {"headers": {"Authorization": "Bearer " + props.fbToken}};
    axios.get(requestURL, requestData)
      .then(response => {
        this.setState({
          comments: response.data.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        { this.state.comments.slice(0, 6).map(comment => <FacebookComment author={comment.from.name} message={comment.message} id={comment.id} depth={0} />)
        }
        <a className="more-comments-link" href={this.props.postLink}>more</a>
      </div>
    );
  }
}

export default FacebookComments
