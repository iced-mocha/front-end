import React from 'react';
import Config from '../../../config.json';

class RedditSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
		this.getLink = this.getLink.bind(this)
  }

  getLink(username) {
    //return Config["redditURL"] + "/v1/" + username + "/authorize";
		return Config["coreURL"] + "/v1/users/" + username + "/authorize/reddit";
  }

  render() {
    return (
      <div className="service-login reddit-login">
        <a href={this.getLink(this.state.username)}>{this.state.content}</a>
      </div>
    );
  }
}

export default RedditSection
