import React from 'react';
import { Link } from 'react-router-dom';
import { ListGroupItem } from 'react-bootstrap';
import FacebookProvider, { Comments } from 'react-facebook';
import FontAwesome from 'react-fontawesome';
import CommentsSection from '../CommentsSection';
import Moment from 'react-moment';
import Video from './Video';
import Tweet from './Tweet';
import Score from './Score';

class Post extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      expandComments: false
    };
    this.toggleComments = this.toggleComments.bind(this);
    this.getHeroImage = this.getHeroImage.bind(this);
    this.buildPostLinks = this.buildPostLinks.bind(this);
    this.buildTitle = this.buildTitle.bind(this);
    this.buildTweet = this.buildTweet.bind(this);
    this.buildCommentSections = this.buildCommentSections.bind(this);
    this.supportsComments = this.supportsComments.bind(this);
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

      // We need to reject any images that will be loaded insecurely (i.e. http)
      if (this.props.HeroImg.substring(0,5) !== 'https') {
          return <div/>;
      }

      return (
        <div className="hero-img-container">
          <img className="hero-img" src={this.props.HeroImg} />
        </div>
      );
    }
  }

  getDateMessage(date) {
    if (this.props.Platform === 'twitter') {
      return ""
    }

    return (
      <span>
        {"submitted "}
        <Moment fromNow>{date}</Moment>
      </span>
    );
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

    if (this.props.Author) {
      if (this.props.Platform === 'reddit') {
        authorLink = (
          <a target='blank' href={'https://reddit.com/u/' + this.props.Author}>
            {this.props.Author}
          </a>);
      }
    }

    if (this.props.subreddit) {
      subredditLink = <a target='blank' href={'https://reddit.com/r/'+this.props.subreddit}>
        {"/r/" + this.props.subreddit}
      </a>;
    }

    return <div className='post-author-info'>{authorLink ? <span className="author-prefix">-</span> : ""}{authorLink}{subredditLink ? " - " : ""}{subredditLink}</div>;
  }

  getScore() {
    if (this.props.Platform === 'reddit' || this.props.Platform === 'hacker-news') {
      return (
        <span>
          <Score score={this.props.score} />
          <span className='post-score-light'>points - </span>
        </span>
      );
    }
    return <span></span>
  }

  supportsComments() {
    return this.props.Platform !== 'google-news' && this.props.Platform !== 'rss' &&
      this.props.Platform !== 'twitter'
  }

  buildExpandCommentsButton() {
    if (!this.supportsComments()) {
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

  // Determines if the given tweet is a retweet - retweets are in the form
  // RT @<handle>: <Retweeted Tweet>
  isRetweet(tweet) {
    if (tweet.substring(0,2) === "RT") {
      return true;
    }
    return false;
  }

  buildTweet(author, text) {
    return (
      <Tweet retweets={this.props.retweets} profileImg={this.props.ProfileImg}
        date={this.props.Date} text={text} author={author} retweets={this.props.retweets}
        favourites={this.props.favourites} meta={this.props.meta}/>
    );
  }

  buildTitle() {
    var platform = this.props.Platform;
    var title = this.props.Title;
    var author = this.props.Author;

    if (platform !== 'twitter') {
      return (
        <a href={this.props.url || this.props.PostLink} target='blank' className="post-header-link">
          {title}
        </a>
      );
    }

    // If tweet begins with 'RT' we want to insert a retweet logo
    var retweet = this.isRetweet(title);
    if (retweet) {
      var results = /@[^:]+:/.exec(title);
      var retweetAuthor = results['0'].substring(1, results['0'].length - 1);
      var retweetText = title.substring((retweetAuthor.length + 5), title.length);

      return (
        <div>
          <div className='retweet-indicator'>
            <FontAwesome name='retweet' />
            <span className='retweet-text'>
              <a className='inherit twitter-author-link' target='blank' href={'https://twitter.com/'+ author}>
                {author}
              </a>
              {' retweeted'}
            </span>
          </div>
          {this.buildTweet(retweetAuthor, retweetText)}
        </div>
      );
    }

    // TODO: Tweet should be its own component
    return this.buildTweet(author, title);
  }

  render() {
    let postDate = new Date(this.props.Date);

    return (
      <ListGroupItem>
          <div className="post-container">
              <div className="post-info">
                <div className="post-header">
                    <div className="post-title">
                        {this.buildTitle(this.props.Platform, this.props.Title)}
                    </div>
                    <img className="post-img" src={'/img/'+(this.props.Platform).toLowerCase()+'-icon.png'} alt={this.props.Platform + " icon"} />
                </div>
                <div className="post-info-container">
                  <div id="post-info-top">
                    {this.getScore()}
                    <span className="post-points">
                      {this.getDateMessage(postDate)}
                    </span>
                  </div>
                  <div id="post-info-bottom">
                    {this.buildPostLinks()}
                  </div>
                </div>
              </div>
              <div className={'post-content'+ ((this.state.expandComments || !this.supportsComments()) ? '' : ' truncated-post-height')}>
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
