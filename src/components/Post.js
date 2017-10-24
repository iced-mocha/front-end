import React from 'react';
import { Link } from 'react-router-dom';
import { ListGroupItem } from 'react-bootstrap';

// To do use right icon for each kind of post
export const Post = props => {
  return (
    <ListGroupItem href="/">
      <div className="post-container">
      { props.HeroImg != "" && 
        <div className="hero-img-container">
          <img className="hero-img" src={props.HeroImg} />
        </div>
      }
        <div className="post-description">
          <div className="post-info">
            <div className="post-header">
              <div className="post-title">{props.Title}</div>
              <img className="post-img what-the-frick" src={props.imgUrl} alt="Reddit icon" />
            </div>
            <div className="post-date">{props.created}</div> <div className="post-author">Author: {props.Author}</div>
          </div>
        </div>
      </div>
    </ListGroupItem>
  );
}
