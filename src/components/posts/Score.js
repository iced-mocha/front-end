import React from 'react';

class Score extends React.Component {
  constructor(props) {
    super(props);
    this.shortenScore = this.shortenScore.bind(this);
    this.state = {score: (props.score ? props.score : 0)};
  }

  componentWillReceiveProps(props) {
    this.setState({...props});
  }

  shortenScore(score) {
    if (score >= 1000000) {
       return (score / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (score >= 1000) {
       return (score / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }

    return score;
  }

  render() {
    return (
      <span className='post-score-bold'>{this.shortenScore(this.props.score)}</span>
    );
  }
}

export default Score;
