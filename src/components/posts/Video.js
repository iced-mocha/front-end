import React from 'react';

class Video extends React.Component {
  constructor(props) {
    super(props);
    this.state = {...props};
  }

  componentWillReceiveProps(props) {
    this.setState({...props});
  }

  render() {
    return (
      <div className="video-comp-container">
        <video controls='true' className="video" controlsList="nodownload" autoPlay={this.state.autoPlay} loop={this.state.loop} muted={this.state.muted}>
          <source src={this.state.src} type="video/mp4"/>
        </video>
      </div>
    );
  }
}

export default Video;
