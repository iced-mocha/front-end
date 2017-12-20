import React from 'react';
import { WeightSlider } from './Slider';

class RssSection extends React.Component {
  constructor(props) {
    super(props);
    this.feedList = this.feedList.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.updateNewUrl = this.updateNewUrl.bind(this);
    this.state = {
      newUrls: {}
    }
    Object.keys(this.props.groups).forEach(name => this.state.newUrls[name] = "");
  }

  onKeyDown(name, e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.props.addUrl(name, this.state.newUrls[name]);
      this.updateNewUrl(name, "");
    }
  }

  updateNewUrl(name, url) {
    let newUrls = this.state.newUrls;
    newUrls[name] = url;
    this.setState({newUrls: newUrls});
  }

  feedList(groupName) {
    let urls = this.props.groups[groupName];
    return (
      <ul className="tag-list">
        { urls.map((url, i) => (
            <li className="tag item">
              {url}
              <button 
                className="tag-remove"
                type="button"
                onClick={() => this.props.removeUrl(groupName, i)}>
                x
              </button>
            </li>
          ))
        }
        <li className="tag">
          <input 
            className="tag-input"
            type="text"
            placeholder="RSS Feed"
            value={this.state.newUrls[groupName]}
            onChange={e => this.updateNewUrl(groupName, e.target.value)}
            onKeyDown={e => this.onKeyDown(groupName, e)} />
        </li>
      </ul>
    );
  }

  render() {
		return (
      <div>
      { Object.keys(this.props.groups).map(name => (
        <div>
					<h3 className='settings-subtitle'>{name}</h3>
          <WeightSlider
            value={this.props.weights[name]}
            type='rss'
            onChange={(t, val) => this.props.updateWeight(name, val)}
          />
          { this.feedList(name) }
        </div>
        ))
      }
      </div>
		);
  }
}

export default RssSection
