import React from 'react';
import axios from 'axios';
import $ from "jquery";
import { NavDropdown, Navbar, NavItem, Nav, MenuItem } from 'react-bootstrap';

class SignOutMenuItem extends React.Component {
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
        <MenuItem onSelect={this.signout}>Logout</MenuItem>
	);
  }

}
class LoggedInAsMenuItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: props.username }
  }
  
  componentWillReceiveProps(nextProps) {
	this.setState({ username: nextProps.username });  
  }

  render() {
    if (this.state.username === undefined) {
		this.state.username = "";
    }
	
    return (<MenuItem header className='menu-header'>Signed in as <br/><div className='menu-header menu-header-value'>{this.state.username}</div></MenuItem>);
  }
}

class AccountAction extends React.Component {
  constructor(props) {
    super(props);
	this.signoutStateUpdate = this.signoutStateUpdate.bind(this);
	this.state = { user: {}};
  }
  
  componentWillReceiveProps(nextProps) {
	this.setState({ loggedIn: nextProps.loggedIn, user: nextProps.user });  
  }

  signoutStateUpdate() {
	this.setState({ loggedIn: false})
  }

  render() { 
	if (this.state.loggedIn == undefined) {
	  return <NavItem href="/login"></NavItem>
	} else if (!this.state.loggedIn) {
	  return <NavItem href="/login">Login</NavItem>
    }
	return(
        <NavDropdown eventKey="4" title="Profile" id="nav-dropdown">
		  <LoggedInAsMenuItem username={this.state.user['username']}/>
          <MenuItem divider />
          <MenuItem eventKey="4.1">Settings</MenuItem>
          <MenuItem divider />
	      <SignOutMenuItem stateUpdate={this.signoutStateUpdate}/>
        </NavDropdown>
	)
  }
}

class SiteHeader extends React.Component {
  constructor(props) {
    super(props);
	this.state = { loggedIn: props.loggedIn, user: props.user }
  }
  
  componentWillReceiveProps(nextProps) {
	this.setState({ loggedIn: nextProps.loggedIn, user: nextProps.user });  
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
				  <AccountAction loggedIn={this.state.loggedIn} user={this.state.user}/>
				</Nav>
			  </Navbar.Collapse>

		</Navbar>
    );
  }
}

export default SiteHeader
