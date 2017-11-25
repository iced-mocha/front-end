import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ListGroupItem } from 'react-bootstrap';
import FacebookProvider, { Comments } from 'react-facebook';

// To do use right icon for each kind of post
class Comment extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      expandComments: (props.depth != 3 && props.depth != 6),
      visibleChildren: 3
    };
    props.getChildren()
      .then(children => this.setState({children: children.map(comment => <Comment {...comment}/>)}))
      .catch(err => {});
  }

  render() {
    if (!this.props.content || !this.props.author) {
      return <div/>
    }
    return (
      <div className="comment" key={this.props.id}>
        <button className="transparent-button" onClick={() => {this.setState({expandComments:!this.state.expandComments})}}>
          <div className="comment-header">
            <img className="expand-icon" src={this.state.expandComments ? "/img/collapse-icon.png" : "/img/expand-icon.png"} />
            <h4 className="comment-author">{this.props.author}</h4>
          </div>
        </button>
        <div className={!this.state.expandComments ? "hidden" : ""}>
          <div className="inner-comments" dangerouslySetInnerHTML={{ __html: this.props.content}} />
        { this.state.children ? this.state.children.slice(0, this.state.visibleChildren) : <h3>Loading</h3> }
        { this.state.children && this.state.children.length > this.state.visibleChildren &&
          <button className="transparent-button shift-right" onClick={() => this.setState({visibleChildren: this.state.visibleChildren + 10})}>
            <div className="comment-header">
              <img className="expand-icon" src="/img/expand-icon.png"/>
              <h4 className="more-comments">more</h4>
            </div>
          </button>
        }
        </div>
      </div>
    );
  }
}

export default Comment
