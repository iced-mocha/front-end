import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavItem, Nav } from 'react-bootstrap';
import SiteHeader from './SiteHeader'

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loggedIn: this.props.loggedIn};
  }

  componentWillReceiveProps(nextProps) {
	console.log("Received new props " + nextProps)
    console.log(nextProps)
	this.setState({ loggedIn: nextProps.loggedIn });  
  }

  render() {
	console.log("In layour renderer")
	console.log(this.state.loggedIn)
   return (	
     <div className="app-container">
		<SiteHeader loggedIn={this.state.loggedIn}/>
		<div className="app-content">{this.props.children}</div>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css"></link>
	  </div>
    );
  }
}

export default Layout;
