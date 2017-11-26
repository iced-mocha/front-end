import React from 'react';
import { Link } from 'react-router-dom';
import { ListGroupItem } from 'react-bootstrap';
import FacebookProvider, { Comments } from 'react-facebook';
import CommentsSection from './CommentsSection'
import FacebookComments from './FacebookComments'

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
    let dateMessage = "";
    let postDate = new Date(this.props.Date)
    if (!isNaN(postDate)) {
      let diff = new Date() - postDate;
      let minutes = Math.round(diff / (1000 * 60));
      let hours = Math.round(diff / (1000 * 60 * 60));
      let days = Math.round(diff / (1000 * 60 * 60 * 24));

      if (minutes === 1) {
        dateMessage = "1 minute ago";
      } else if (hours < 1) {
        dateMessage = minutes + " minutes ago";
      } else if (hours === 1) {
        dateMessage = "1 hour ago";
      } else if (days < 2) {
        dateMessage = hours + " hours ago";
      } else if (days < 10000) {
        dateMessage = days + " days ago";
      }
    }
    return (
      <ListGroupItem>
        <a href={this.props.PostLink}>
          <div className="post-container">
          { this.props.HeroImg && !this.props.Video &&
            <div className="hero-img-container">
              <img className="hero-img" src={this.props.HeroImg} />
            </div> }
          { this.props.Video &&
            <div className="hero-img-container">
              <video className="hero-img">
                <source src={this.props.Video} type="video/mp4"/>
              </video>
            </div> }
            <div className="post-description">
              <div className="post-info">
                <div className="post-header">
                  <div className="post-title">{this.props.Title}</div>
                  <img className="post-img what-the-frick" src={this.props.imgUrl} alt="Reddit icon" />
                </div>
                <div className="post-date">{dateMessage}</div>
                <div className="post-author">{this.props.Author}</div>
              </div>
            </div>
          </div>
        </a>
        { (this.props.Platform == "facebook" || this.props.Platform == "hacker-news") &&
          (this.state.expandComments ? (
            <button className="toggle-comments collapse-comments" onClick={this.toggleComments}>
              <img className="expand-icon" src="/img/collapse-icon.png" />
            </button>
          ) : (
            <button className="toggle-comments expand-comments" onClick={this.toggleComments}>
              <img className="expand-icon" src="/img/expand-icon.png" />
            </button>
          ))
        }
        { this.state.expandComments &&
          <div className="comments-section">
          { this.props.Platform == "facebook" &&
            <CommentsSection
              postId={this.props.ID}
              postLink={this.props.PostLink}
              platform={this.props.Platform}
              fbId={this.props.fbId}
              fbToken={this.props.fbToken}
              collapsePoints={[]}
              initialVisibleChildren={5}
              moreButtonChildren={10}
              rootComments={10}/>
          }
          { this.props.Platform == "hacker-news" &&
            <CommentsSection 
              postId={this.props.ID}
              postLink={"https://news.ycombinator.com/item?id=" + this.props.ID} 
              platform={this.props.Platform}
              collapsePoints={[3, 6]}
              initialVisibleChildren={3}
              moreButtonChildren={10}
              rootComments={5}/>
          }
          </div>
        }
      </ListGroupItem>
    );
  }
}

export default Post
