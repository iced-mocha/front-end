import React from 'react';

class RedditSection extends React.Component {
  constructor(props) {
    super(props);
	console.log("in reddit constructor")
    console.log(props)
    this.state = props;
	this.getLink = this.getLink.bind(this)
  }

  getLink(username) {
	  console.log("username in reddit")
	console.log(username)
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
