import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Layout } from './Layout';
import { IndexPage } from './IndexPage';
import LoginPage from './login/LoginPage';
import SignupPage from './login/SignupPage';
import HomePage from './home/HomePage';
import { NotFoundPage } from './NotFoundPage';
import posts from '../data/posts';

const renderIndex = () => <IndexPage posts={posts} />;

export const App = () => (
  <Layout>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/home" component={HomePage} />
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/signup" component={SignupPage} />
      <Route component={NotFoundPage} />
    </Switch>
  </Layout>
);

export default App;
