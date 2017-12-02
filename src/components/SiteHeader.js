import React from 'react';
import axios from 'axios';
import $ from "jquery";
import { NavDropdown, Navbar, NavItem, Nav, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Config from '../../config.json';

class SignOutMenuItem extends React.Component {
  constructor(props) {
    super(props);
	  this.signout = this.signout.bind(this);
  }

  signout() {
    axios({
	     method: 'post',
	     url: Config.coreURL + '/v1/logout',
	     withCredentials: true
	  });
	  // This function is passed into update state further up the tree
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

    return (<MenuItem header className='menu-header'><div className='signed-in-title'>Signed in as </div><div className='menu-header signed-in-value'>{this.state.username}</div></MenuItem>);
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
        <LinkContainer to="/settings">
          <MenuItem eventKey="4.1">Settings</MenuItem>
        </LinkContainer>
          <MenuItem divider />
        <SignOutMenuItem stateUpdate={this.signoutStateUpdate}/>
      </NavDropdown>
    );
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
	    <Navbar id='nav' className='site-font'>
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
