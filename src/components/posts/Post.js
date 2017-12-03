import React from 'react';
import { Link } from 'react-router-dom';
import { ListGroupItem } from 'react-bootstrap';
import FacebookProvider, { Comments } from 'react-facebook';
import CommentsSection from '../CommentsSection';
import FacebookComments from '../FacebookComments';
import Video from './Video';

class Post extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      expandComments: false
    };
    this.toggleComments = this.toggleComments.bind(this);
    this.getHeroImage = this.getHeroImage.bind(this);
    this.buildPostLinks = this.buildPostLinks.bind(this);
    this.buildCommentSections = this.buildCommentSections.bind(this);
  }

  toggleComments(e) {
    this.setState({
      expandComments: !this.state.expandComments
    });
  }

  getHeroImage() {
    if (this.props.Video) {
      return (
        <Video src={this.props.Video} autoPlay={!this.props.IsVideo} loop={!this.props.IsVideo} mute={!this.props.IsVideo}/>
      );
    } else if (this.props.HeroImg) {
      const youtubeRe = /youtube\.com.*v=([^&]*)/;
      let matches = youtubeRe.exec(this.props.url);
      if (matches && matches.length == 2) {
        return (
          <div className="hero-img-container video-container">
            <iframe src={"https://www.youtube.com/embed/" + matches[1]}>
            </iframe>
          </div>
        );
      }
      return (
        <div className="hero-img-container">
          <img className="hero-img" src={this.props.HeroImg} />
        </div>
      );
    }
  }

  getDateMessage(date) {
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

    return dateMessage
  }

  buildCommentSections() {
    var t = this.props.Platform;
    var cPoints = [];
    var rComments = 10;
    var visibleChildren = 5;

    if (t === 'reddit' || t === 'hacker-news') {
        cPoints = [4,7];
        rComments = 5;
        visibleChildren = 10;
    }

    return (
      <div className="comments-section">
        <CommentsSection
          postId={this.props.ID}
          postLink={this.props.PostLink}
          platform={this.props.Platform}
          fbId={this.props.fbId ? this.props.fbId : ''}
          fbToken={this.props.fbToken ? this.props.fbToken : ''}
          subreddit={this.props.subreddit ? this.props.subreddit : ''}
          collapsePoints={cPoints}
          initialVisibleChildren={visibleChildren}
          moreButtonChildren={10}
          rootComments={rComments}
        />
      </div>
    );
  }

  buildPostLinks() {
    var authorLink = undefined;
    var subredditLink = undefined;

    // TODO: Check for each type and build appropriately
    if (this.props.Author) {
      authorLink = <a target='blank' href={'https://reddit.com/u/' + this.props.Author}>{this.props.Author}</a>;
    }

    if (this.props.subreddit) {
      subredditLink = <a target='blank' href={'https://reddit.com/r/'+this.props.subreddit}>
        {"/r/" + this.props.subreddit}
      </a>;
    }

    return <div className='post-author-info'>{authorLink ? " - " : ""}{authorLink}{subredditLink ? " - " : ""}{subredditLink}</div>;
  }

  buildExpandCommentsButton() {
    if (this.props.Platform === 'google-news') {
      return '';
    }

    if (this.state.expandComments) {
      return (
        <button className="toggle-comments collapse-comments" onClick={this.toggleComments}>
          <img className="expand-icon" src="/img/collapse-icon.png" />
        </button>
      );
    }

    return (
      <button className="toggle-comments expand-comments" onClick={this.toggleComments}>
        <img className="expand-icon" src="/img/expand-icon.png" />
      </button>
    );
  }

  render() {
    let postDate = new Date(this.props.Date);
    let dateMessage = this.getDateMessage(postDate);

    return (
      <ListGroupItem>
          <div className="post-container">
              <div className="post-info">
                <div className="post-header">
                    <div className="post-title">
                      <a href={this.props.url || this.props.PostLink} target='blank' className="post-header-link">
                        {this.props.Title}
                      </a>
                    </div>
                    <img className="post-img" src={this.props.imgUrl} alt="Reddit icon" />
                </div>
                <div className="post-info-container">
                  {dateMessage}
                  {this.buildPostLinks()}
                </div>
              </div>
              <div className={'post-content'+ (this.state.expandComments ? '' : ' truncated-post-height')}>
                { this.getHeroImage() }
                {this.props.Content &&
                  <div className="post-body" dangerouslySetInnerHTML={{ __html: this.props.Content}} />
                }
              </div>
          </div>
        { this.buildExpandCommentsButton() }
        { this.state.expandComments ? this.buildCommentSections() : '' }
      </ListGroupItem>
    );
  }
}

export default Post
