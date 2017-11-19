import React from 'react';

class RedditSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
		this.getLink = this.getLink.bind(this)
  }

  getLink(username) {
		// TODO: Config file
		return "http://localhost:3001/v1/" + username + "/authorize"
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
