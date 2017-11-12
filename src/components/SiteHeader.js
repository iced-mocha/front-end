import React from 'react';
import axios from 'axios';
import $ from "jquery";
import { Navbar, NavItem, Nav } from 'react-bootstrap';

class AccountAction extends React.Component {
  constructor(props) {
    super(props);
	this.loggedIn = this.isLoggedIn.bind(this);
    this.state = { isLoggedIn: false }
  }

  isLoggedIn() {
    axios.get('http://0.0.0.0:3000/v1/loggedin', {withCredentials: true})
      .then(response => {
			console.log(response.status)
		if (response.status === 200) {
			// This is the source of truth for our logged in status.. 
			// but we will rely on our session data until this request completes
			localStorage.setItem('logged-in', response.data['logged-in'])
			this.setState({
			  loggedIn: response.data['logged-in']
			});

			console.log(response.data)
			console.log(this.state.loggedIn)
		}
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentDidMount() {
	var s = localStorage.getItem('logged-in')
	// If there is a difference between localStorage and our state... use our session storage
	if (s !== this.state.loggedIn) {
		this.setState({loggedIn: s})
	}
	this.isLoggedIn() 
  }

  render() { 
	return(
	  <NavItem href="/login">{this.state.loggedIn ? 'Signout' : 'Login' }</NavItem>
	)
  }
}

class SiteHeader extends React.Component {
  constructor(props) {
    super(props);
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
				  <AccountAction/>
				</Nav>
			  </Navbar.Collapse>

		</Navbar>
    );
  }
}

export default SiteHeader
