import React from 'react';
import { Route, Switch, FadeIn } from 'react-router-dom';
import Layout from './Layout';
import { IndexPage } from './IndexPage';
import LoginPage from './login/LoginPage';
import SignupPage from './login/SignupPage';
import HomePage from './home/HomePage';
import SettingsPage from './settings/SettingsPage';
import { NotFoundPage } from './NotFoundPage';
import axios from 'axios';
import Config from '../../config.json';

const renderIndex = () => <IndexPage posts={posts} />;

var loggedInGlobal = false

export class App extends React.Component {
	constructor (props) {
	  super(props);
	  this.updateLoginStatus = this.updateLoginStatus.bind(this);
	  this.isLoggedIn = this.isLoggedIn.bind(this);
	  this.updateUser = this.updateUser.bind(this);
    this.state = { loggedIn: false, user: {} };
    this.core = this.props.core || (typeof window !== 'undefined' && window.coreURL) || Config.coreURL;
    this.reddit = this.props.reddit || (typeof window !== 'undefined' && window.redditURL) || Config.redditURL;
	}

  isLoggedIn() {
	  var self = this;
	  axios.get(this.core + '/v1/loggedin', {withCredentials: true})
			.then(response => {
				self.setState({loggedIn: response.data['logged-in']})
	    })
	    .catch(err => {
				self.setState({ loggedIn: false })
	    });
  }

	updateUser() {
		var self = this;
		axios.get(this.core + '/v1/users', {withCredentials: true})
			.then(response => {
				self.setState({user: response.data})
			})
			.catch(err => {
				self.setState({user: {}})
			});
	}

  componentDidMount() {
		var self = this;
		this.isLoggedIn()
		this.updateUser()
  }

	updateLoginStatus(loggedInStatus) {
		this.setState({loggedIn: loggedInStatus});
		// If we are logged in make sure we update our user
		if (loggedInStatus === true) {
				this.updateUser();
		}
	}

	render() {
		return (
			<Layout loggedIn={this.state.loggedIn} user={this.state.user}>
			<Switch>
				<Route exact path="/" render={(props) => (
					<HomePage {...props} core={this.core}/>
				)}/>
				<Route exact path="/home" render={(props) => (
					<HomePage {...props} core={this.core} />
				)}/>
				<Route exact path="/settings" render={(props) => (
					<SettingsPage {...props} user={this.state.user} reddit={this.reddit} core={this.core} />
				)}/>
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
