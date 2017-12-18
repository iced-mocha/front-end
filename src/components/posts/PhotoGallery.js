import React from 'react';
import {Carousel} from 'react-bootstrap';

class PhotoGallery extends React.Component {
  constructor(props) {
    super(props);
    this.buildGallery = this.buildGallery.bind(this);
    this.state = {...props};
    this.state.images = this.state.images ? this.state.images : [];
  }

  componentWillReceiveProps(props) {
    this.setState({...props});
  }

  buildGallery(images) {
    var gallery = [];
    for (var i = 0; i < images.length; i++) {
      gallery.push(
        <Carousel.Item key={Math.random().toString(36).substring(7)}>
          <img src={images[i].url} />
        </Carousel.Item>
      );
    }

    return gallery;
  }

  render() {
    if (this.state.images.length === 0) {
      return <div />;
    }

    return (
      <Carousel interval={null} controls={!(this.state.images.length === 1)}
        indicators={!(this.state.images.length === 1)} wrap={false}>
        {this.buildGallery(this.state.images)}
      </Carousel>
    );
  }
}

export default PhotoGallery;
