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
      value: props.value,
      onChange: props.onChange,
      hidden: props.hidden
		};
  }

  imageForType(type) {
		return "/img/" + type + "-icon.png";
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    this.state.onChange(this.state.type, event.target.value);
  }

  componentWillReceiveProps(props) {
    this.state = {
      type: props.type,
      title: props.title,
      value: props.value,
      onChange: props.onChange,
      hidden: props.hidden
    };
  }

  render() {
    var hidden = '';
    if (this.state.hidden) {
        hidden = 'hidden';
    }

		return (
      <div className={'weight-slider-container '+ hidden}>
          <img className="slider-img" src={this.imageForType(this.state.type)}/>
          <div className='slider-value'>{parseFloat(this.state.value / 10.0).toFixed(1)}</div>
          <input 
            type="range"
            min="0"
            max="100"
            value={this.state.value}
            className="weight-slider"
            id={this.state.type +"-slider"}
            onChange={this.handleChange}/>
      </div>
		);
	}
}
