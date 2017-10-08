import React from 'react';

class RedditSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log("In reddit render: " +  this.state)
    return (
      <div className="service-login reddit-login">
        <a href="http://localhost:3001/v1/authorize">Reddit Login</a>
        <h1>Data</h1>
      </div>
    );
  }
}

export default RedditSection
