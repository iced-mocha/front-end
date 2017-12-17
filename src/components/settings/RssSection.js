import React from 'react';
import { WeightSlider } from './Slider';

class RssSection extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(JSON.stringify(this.props));
		return (
      <div>
      { Object.keys(this.props.groups).map(name => (
        <div>
					<h3 className='settings-subtitle'>{name}</h3>
          <WeightSlider
            value={this.props.weights[name]}
            type='rss'
            onChange={this.sliderChange}
          />
          { this.props.groups[name].map(url => (
            <div>{url}</div>
            ))
          }
        </div>
        ))
      }
      </div>
		);
  }
}

export default RssSection
