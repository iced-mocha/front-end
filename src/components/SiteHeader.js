import React from 'react';
import axios from 'axios';
import $ from "jquery";
import { Navbar, NavItem, Nav } from 'react-bootstrap';

class SignOutButton extends React.Component {
  constructor(props) {
    super(props);
	this.signout = this.signout.bind(this);
  }

  signout() {
	// Update local storage to match that were signed out
	localStorage.setItem('logged-in', false)
	axios({
	  method: 'post',
	  url: 'http://0.0.0.0:3000/v1/logout',
	  withCredentials: true
	});
    this.props.stateUpdate();
  }

  render() {
	return (
		<NavItem onClick={this.signout}>Signout</NavItem>
	);
  }

}

class AccountAction extends React.Component {
  constructor(props) {
    super(props);
	this.loggedIn = this.isLoggedIn.bind(this);
	this.signoutStateUpdate = this.signoutStateUpdate.bind(this);
    this.state = { loggedIn: false }
  }
  
  componentWillReceiveProps(nextProps) {
	console.log("Account action received new props: " + nextProps.loggedIn)
	console.log(nextProps)
	this.setState({ loggedIn: nextProps.loggedIn });  
  }

  signoutStateUpdate() {
	this.setState({ loggedIn: false})
  }

  isLoggedIn() {
    axios.get('http://0.0.0.0:3000/v1/loggedin', {withCredentials: true})
      .then(response => {
		if (response.status === 200) {
			// This is the source of truth for our logged in status.. 
			// but we will rely on our session data until this request completes
			this.setState({
			  loggedIn: response.data['logged-in']
			});
			console.log("Setting state to: " + response.data['logged-in'])

			console.log(response.data)
			console.log(this.state.loggedIn)
		}
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() { 
	if (this.state.loggedIn) {
		return ( <SignOutButton stateUpdate={this.signoutStateUpdate}/> );
    }
	return(
	  <NavItem href="/login">Login</NavItem>
	)
  }
}

class SiteHeader extends React.Component {
  constructor(props) {
    super(props);
	this.state = { loggedIn: props.loggedIn }
  }
  
  componentWillReceiveProps(nextProps) {
	this.setState({ loggedIn: nextProps.loggedIn });  
  }

  render() {
    return (
		<Navbar>

			  <Navbar.Header>
				<Navbar.Brand>
				  <a href="/">Iced-Mocha</a>
				</Navbar.Brand>
			  </Navbar.Header>

			  <Navbar.Collapse>
				<Nav pullRight>
				  <AccountAction loggedIn={this.state.loggedIn}/>
				</Nav>
			  </Navbar.Collapse>

		</Navbar>
    );
  }
}

export default SiteHeader
