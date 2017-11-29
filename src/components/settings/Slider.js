import React from 'react';
import { Row, Col } from 'react-bootstrap';

export class WeightSlider extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.imageForType = this.imageForType.bind(this);
    this.state = {
			title: props.title,
			type: props.type,
      value: props.value * 10,
      onChange: props.onChange
		};
  }

  imageForType(type) {
		return "/img/" + type + "-icon.png";
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    this.state.onChange(this.state.type, Math.ceil(this.state.value / 10));
  }

  componentWillReceiveProps(props) {
    this.state = {
      type: props.type,
      title: props.title,
      value: props.value * 10,
      onChange: props.onChange
    };
  }

  // Note the max value is out of 100 - but we will actually use a range out of 10
  // Putting the range to 100 allows for a smoother animation of the slider
  render() {
		return (
      <div className='weight-slider-container'>
          <img className="slider-img" src={this.imageForType(this.state.type)}/>
          <div className='slider-value'>{Math.ceil(this.state.value / 10)}</div>
          <input type="range" min="0" max="100" value={this.state.value}
            className="weight-slider" id={this.state.type +"-slider"} onChange={this.handleChange}/>
      </div>
		);
	}
}
