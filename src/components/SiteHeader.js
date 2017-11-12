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
	axios({
	  method: 'post',
	  url: 'http://0.0.0.0:3000/v1/logout',
	  withCredentials: true
	});
	// TODO this should call App level state change
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
	this.signoutStateUpdate = this.signoutStateUpdate.bind(this);
	this.state = {};
    //this.state = { loggedIn: false }
  }
  
  componentWillReceiveProps(nextProps) {
	this.setState({ loggedIn: nextProps.loggedIn });  
  }

  signoutStateUpdate() {
	this.setState({ loggedIn: false})
  }

  render() { 
	if (this.state.loggedIn == undefined) {
		return <NavItem href="/login"></NavItem>
	}
	else if (this.state.loggedIn) {
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
