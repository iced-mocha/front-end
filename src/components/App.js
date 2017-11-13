import React from 'react';
import { Route, Switch, FadeIn } from 'react-router-dom';
import Layout from './Layout';
import { IndexPage } from './IndexPage';
import LoginPage from './login/LoginPage';
import SignupPage from './login/SignupPage';
import HomePage from './home/HomePage';
import SettingsPage from './settings/SettingsPage';
import { NotFoundPage } from './NotFoundPage';
import posts from '../data/posts';
import axios from 'axios';

const renderIndex = () => <IndexPage posts={posts} />;

var loggedInGlobal = false

export class App extends React.Component {
	constructor (props) {
	  super(props);
	  this.updateLoginStatus = this.updateLoginStatus.bind(this);
	  this.isLoggedIn = this.isLoggedIn.bind(this);
      this.state = { loggedIn: false };
	}
	  
    isLoggedIn(f) {
	  axios.get('http://0.0.0.0:3000/v1/loggedin', {withCredentials: true})
	    .then(response => {
			f(response.data['logged-in'])
	     })
	     .catch(err => {
		  console.log(err);
	     });
     }

    componentDidMount() {
		var self = this;
		this.isLoggedIn(function(data) { self.setState({loggedIn: data }); })
    }

    updateLoginStatus(loggedInStatus) {
		this.setState({loggedIn: loggedInStatus});
    }

    render() { 
	 return (
		  <Layout loggedIn={this.state.loggedIn}>
			<Switch>
			  <Route exact path="/" component={HomePage} />
			  <Route exact path="/home" component={HomePage} />
			  <Route exact path="/settings" component={SettingsPage} />
		      <Route exact path='/login' render={(props) => (
                <LoginPage {...props} updateLoginStatus={this.updateLoginStatus} />
              )}/>
			  <Route exact path="/signup" component={SignupPage} />
			  <Route component={NotFoundPage} />
			</Switch>
		  </Layout>
      );
    }
}

