import React from 'react';
import Config from '../../../config.json';

class TwitterSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
		this.getLink = this.getLink.bind(this)
  }

  getLink(username) {
		return this.props.core + "/v1/users/" + username + "/authorize/twitter";
  }

  render() {
    return (
      <div className="service-login twitter-login">
        <a href={this.getLink(this.state.username)}>{this.state.content}</a>
      </div>
    );
  }
}

export default TwitterSection
