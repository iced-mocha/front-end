import React from 'react';
import FontAwesome from 'react-fontawesome';
import Video from './Video';

class Tweet extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.getDateMessage = this.getDateMessage.bind(this);
    this.state = {};
  }

  getDateMessage(date) {
    let dateMessage = "";

    let postDate = new Date(date)
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

  render() {
    return (
      <div className='tweet-container'>
        <img className='twitter-profile-img' src={this.props.profileImg} />
        <div className='tweet-text-container'>
          <span>
            <a className='inherit twitter-author-link larger-font' target='blank' href={'https://twitter.com/'+ this.props.author}>
              {this.props.author}
            </a>
            <span className='tweet-time'>{'tweeted ' + this.getDateMessage(new Date(this.props.date))}</span>
          </span>
          <div className='tweet-text'>{this.props.text}</div>
          <div className='tweet-stats'>
            <span className='tweet-rts'>
              <FontAwesome className='retweet-icon' name='retweet' />
              <span className='retweet-count'>
                {this.props.retweets}
              </span>
            </span>
            <span className='tweet-favs'>
              <FontAwesome className='favourite-icon' name='heart' />
              <span className='favourite-count'>
                {this.props.favourites}
              </span>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default Tweet
