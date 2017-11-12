import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavItem, Nav } from 'react-bootstrap';
import SiteHeader from './SiteHeader'

export const Layout = props => (
  <div className="app-container">
	<SiteHeader/>
    <div className="app-content">{props.children}</div>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css"></link>
  </div>
);

export default Layout;
