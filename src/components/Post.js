import React from 'react';
import { Link } from 'react-router-dom';
import { ListGroupItem } from 'react-bootstrap';

// To do use right icon for each kind of post
class Post extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      expandComments: false
    };
    this.toggleComments = this.toggleComments.bind(this);
  }

  toggleComments(e) {
    this.setState({
      expandComments: !this.state.expandComments
    });
  }

  render() {
    return (
      <ListGroupItem>
        <a href={this.props.PostLink}>
          <div className="post-container">
          { this.props.HeroImg != "" && 
            <div className="hero-img-container">
              <img className="hero-img" src={this.props.HeroImg} />
            </div> }
            <div className="post-description">
              <div className="post-info">
                <div className="post-header">
                  <div className="post-title">{this.props.Title}</div>
                  <img className="post-img what-the-frick" src={this.props.imgUrl} alt="Reddit icon" />
                </div>
                <div className="post-date">{this.props.created}</div> <div className="post-author">Author: {this.props.Author}</div>
              </div>
            </div>
          </div>
        </a>
        { this.state.expandComments ? (
          <button className="toggle-comments collapse-comments" onClick={this.toggleComments}>
            <img className="expand-icon" src="/img/collapse-icon.png" />
          </button>
        ) : (
          <button className="toggle-comments expand-comments" onClick={this.toggleComments}>
            <img className="expand-icon" src="/img/expand-icon.png" />
          </button>
        )}
        { this.state.expandComments && 
          <div className="comments-section">
          </div> }
      </ListGroupItem>
    );
  }
}

export default Post
