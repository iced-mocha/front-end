import React from 'react';
import FontAwesome from 'react-fontawesome';
import Video from './Video';
import Moment from 'react-moment';

class Tweet extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.parseTweet = this.parseTweet.bind(this);
    this.getDateMessage = this.getDateMessage.bind(this);
    var mediaObj = JSON.parse(this.props.meta)['extended_entities'];
    var metaObj = JSON.parse(this.props.meta)['entities'];
    this.state = {
      hashtags: metaObj.hashtags ? metaObj.hashtags : [],
      mentions: metaObj['user_mentions'] ? metaObj['user_mentions'] : [],
      urls: metaObj.urls ? metaObj.urls : [],
      media: mediaObj.media ? mediaObj.media : [],
      displayMedia: []
    };
  }

  parseTweet(text) {
    // Replace hashtags with links
    for (var i = 0; i < this.state.hashtags.length; i++) {
      var re = new RegExp(this.state.hashtags[i]['text_with_hash'],'g');
        text = text.replace(re, "<a href='" + this.state.hashtags[i].link + "' target='blank'>" +
          this.state.hashtags[i]['text_with_hash'] + '</a>');
    }

    for (var i = 0; i < this.state.mentions.length; i++) {
      var re = new RegExp('@' + this.state.mentions[i]['screen_name'],'g');
      text = text.replace(re, "<a class='twitter-author-link' href='" + this.state.mentions[i].link + "' target='blank'> @" +
        this.state.mentions[i]['screen_name'] + '</a>');
    }

    for (var i = 0; i < this.state.media.length; i++) {
      this.buildMedia(i, this.state.media[i]);
      var re = new RegExp(this.state.media[i].url,'g');
      text = text.replace(re, "");
    }

    for (var i = 0; i < this.state.urls.length; i++) {
        console.log(this.state.urls[i]);
        var re = new RegExp(this.state.urls[i]['url'],'g');
        text = text.replace(re, "<a class='twitter-link' href='" + this.state.urls[i]['expanded_url'] +
        "' target='blank'>" + this.state.urls[i]['display_url'] + '</a>');
    }

    return text;
  }

  buildMedia(id, media) {
    // PUT this in state 'photos'
    if (media.type === 'photo') {
      this.state.displayMedia.push(
        <div key={id} className="hero-img-container">
          <img className="hero-img" src={media['media_url_https']} />
        </div>
      )
      this.setState({ displayMedia: this.state.displayMedia});
    } else if (media.type === 'video') {
      var videoInfo = media['video_info']['variants']
      for (var i = 0; i < videoInfo.length; i++) {
        if(videoInfo[i]['content_type'] === 'video/mp4') {
          this.state.displayMedia.push(
             <Video key={id} src={videoInfo[i].url} autoPlay={true}
              loop={true} muted={true}/>
          )
          this.setState({ displayMedia: this.state.displayMedia});
          return;
        }
      }
    }
  }

  getDateMessage(date) {
    return (
      <span>
        {"tweeted "}
        <Moment fromNow>{date}</Moment>
      </span>
    );
  }

  componentWillMount() {
    this.setState({
        content: this.parseTweet(this.props.text)
    });
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
            <span className='tweet-time'>{this.getDateMessage(new Date(this.props.date))}</span>
          </span>
          <div className='tweet-text' dangerouslySetInnerHTML={{ __html: this.state.content}}/>
          <div className='tweet-media-container'>
            {this.state.displayMedia}
          </div>
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
