import React from 'react';
import { Post } from './Post';

export const IndexPage = ({ posts }) => (
  <div className="home">
    <div className="change-this">
      {posts.map(
        postData => <Post key={postData.id} {...postData} />,
      )}
    </div>
  </div>
);

export default IndexPage;
