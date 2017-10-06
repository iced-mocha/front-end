import React from 'react';
import { Link } from 'react-router-dom';
import { ListGroupItem } from 'react-bootstrap';

export const Post = props => (
	<ListGroupItem href="/">
		<img src="/img/medal.png" alt="Medal icon" />
	    <span className="name">{props.name}</span>
	</ListGroupItem>
);

export default Post;
