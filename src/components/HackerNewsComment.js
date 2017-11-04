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
      content: "",
      expandComments: (props.depth < 3),
      children: []
    };
    axios.get("https://hacker-news.firebaseio.com/v0/item/"+this.props.commentID+".json")
      .then(response => {
        this.setState({
          content: response.data.text,
          children: response.data.kids ? response.data.kids.map(
                id => <HackerNewsComment key={id} commentID={id} depth={props.depth + 1} />
              ) : []
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="comment" key={this.props.commentID}>
      { <button onClick={() => {this.setState({expandComments:!this.state.expandComments})}}>{this.state.expandComments ? "less" : "more"}</button> }
      { this.state.expandComments &&
        <div className="inner-comments" dangerouslySetInnerHTML={{ __html: this.state.content}} />
      }
      { this.state.expandComments && this.state.children }
      </div>
    );
  }
}

export default HackerNewsComment
