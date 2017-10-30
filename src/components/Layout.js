import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavItem, Nav } from 'react-bootstrap';

export const Layout = props => (
  <div className="app-container">
	<Navbar>

		  <Navbar.Header>
		    <Navbar.Brand>
			  <a href="/">Iced-Mocha</a>
		    </Navbar.Brand>
		  </Navbar.Header>

		  <Navbar.Collapse>
		    <Nav pullRight>
			  <NavItem href="/login">Login</NavItem>
		    </Nav>
		  </Navbar.Collapse>

	</Navbar>

    <div className="app-content">{props.children}</div>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css"></link>
  </div>
);

export default Layout;
