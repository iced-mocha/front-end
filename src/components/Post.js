import React from 'react';
import { Link } from 'react-router-dom';
import { ListGroupItem } from 'react-bootstrap';

// To do use right icon for each kind of post
export const Post = props => (
	<ListGroupItem href="/">
		<div className="post-container">
			<img className="post-img what-the-frick" src="/img/reddit-icon.png" alt="Reddit icon" />
			<div className="post-info">
				<div className="post-title">{props.Title}</div>
				<div className="post-date">{props.created}</div> <div className="post-author">Author: {props.Author}</div>
			</div>
		</div>
	</ListGroupItem>
);
