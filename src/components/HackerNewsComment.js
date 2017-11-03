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
      content: "",
      expandComments: false
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
      <div className="comment" key={this.props.commentID}>
      { this.state.comments.length > 0 && <button onClick={() => {this.setState({expandComments:!this.state.expandComments})}}> expand comments </button> }
        <div className="inner-comments" dangerouslySetInnerHTML={{ __html: this.state.content}} />
        { this.state.expandComments && this.state.comments.map(
            id => <HackerNewsComment commentID={id} />
          )
        }
      </div>
    );
  }
}

export default HackerNewsComment
