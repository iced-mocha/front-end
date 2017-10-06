import React from 'react';
import { Link } from 'react-router-dom';

export const Post = props => (
    <div className="post-wrapper">
		<img src="/img/medal.png" alt="Medal icon" />
	    <span className="name">{props.name}</span>
    </div>
);

export default Post;
