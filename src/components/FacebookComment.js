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
      expandComments: (props.depth != 2 && props.depth != 5),
      children: []
    };
    axios.get("https://hacker-news.firebaseio.com/v0/item/"+this.props.commentID+".json")
      .then(response => {
        this.setState({
          author: response.data.by,
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
    if (this.state.content == "") {
      return <div/>
    }
    return (
      <div className="comment" key={this.props.commentID}>
        <button className="transparent-button" onClick={() => {this.setState({expandComments:!this.state.expandComments})}}>
          <div className="comment-header">
            <img className="expand-icon" src={this.state.expandComments ? "/img/collapse-icon.png" : "/img/expand-icon.png"} />
            <h4 className="comment-author">{this.state.author}</h4>
          </div>
        </button>
        { this.state.expandComments &&
          <div className="inner-comments" dangerouslySetInnerHTML={{ __html: this.state.content}} />
        }
      { this.state.expandComments && this.state.children }
      </div>
    );
  }
}

export default HackerNewsComment
