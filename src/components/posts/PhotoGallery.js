import React from 'react';
import ImageGallery from 'react-image-gallery';

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
      gallery.push({
          original: images[i].url,
          thumbnail: images[i].url
      });
    }

    return gallery;
  }

  render() {
    // No images so return empty div
    if (this.state.images.length === 0) {
      return <div/>;
    }

    return (
      <ImageGallery infinite={false} items={this.buildGallery(this.state.images)}
        showThumbnails={false} showPlayButton={false} showBullets={true} lazyLoad={true}>
      </ImageGallery>
    );
  }
}

export default PhotoGallery;
