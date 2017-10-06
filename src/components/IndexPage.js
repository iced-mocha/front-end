import React from 'react';
import { Post } from './Post';
import { ListGroup } from 'react-bootstrap';
import { ListGroupItem } from 'react-bootstrap';

export const IndexPage = ({ posts }) => (
  <div className="home">
	  <ListGroup>
		  {posts.map(
			postData => <Post key={postData.id} {...postData} />,
		  )}
	  </ListGroup>
  </div>
);

export default IndexPage;
