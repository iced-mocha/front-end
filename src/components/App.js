import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Layout } from './Layout';
import { IndexPage } from './IndexPage';
import { AthletePage } from './AthletePage';
import LoginPage from './login/LoginPage';
import HomePage from './home/HomePage';
import { NotFoundPage } from './NotFoundPage';
import posts from '../data/posts';

const renderIndex = () => <IndexPage posts={posts} />;
const renderAthlete = ({ match, staticContext }) => {
  const id = match.params.id;
  const athlete = athletes.find(current => current.id === id);
  if (!athlete) {
    return <NotFoundPage staticContext={staticContext} />;
  }

  return <AthletePage athlete={athlete} athletes={athletes} />;
};

export const App = () => (
  <Layout>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/home" component={HomePage} />
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/posts/:id" render={renderAthlete} />
      <Route component={NotFoundPage} />
    </Switch>
  </Layout>
);

export default App;
