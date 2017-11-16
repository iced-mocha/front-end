import React from 'react';
import axios from 'axios';
import RedditSection from '../login/RedditSection'
import { Jumbotron, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

class LinkedAccount extends React.Component {
  constructor(props) {
    super(props);
    this.imageForType = this.imageForType.bind(this);
    this.altForType = this.altForType.bind(this);
	this.state = {type: props.type, identification: props.identification}
  }

  imageForType(type) {
	if (type === "reddit") {
		return "/img/reddit-icon.png"
    }
	return ""
  }
  
  altForType(type) {
	if (type === "reddit") {
		return "Reddit Icon"
    }
	return ""
  }

  render() {
	return(
		<div> 
			<img className="account-img" src={this.imageForType(this.state.type)} alt={this.altForType(this.state.type)} /> 
			{this.state.identification}
		</div>
    )
  }
}

class UnlinkedAccount extends React.Component {
  constructor(props) {
    super(props);
    this.imageForType = this.imageForType.bind(this);
    this.linkForType = this.linkForType.bind(this);
    this.altForType = this.altForType.bind(this);
    this.makeLink = this.makeLink.bind(this);
	this.state = props
  }
  
  altForType(type) {
	if (type === "reddit") {
		return "Reddit Icon"
    }
	return ""
  }

  imageForType(type) {
	if (type === "reddit") {
		return "/img/reddit-icon.png"
    }
	return ""
  }
  
  linkForType(type) {
	if (type === "reddit") {
		return "Reddit Icon"
    }
	return ""
  }

  makeLink(content) {
	if (this.state.type === "reddit") {
	  return (<RedditSection username={this.state.username} content={content} /> );
    }
	return ""
  }

  render() {
	const contents = (
		<div> 
			<img className="account-img" src={this.imageForType(this.state.type)} alt={this.altForType(this.state.type)} /> 
			<span className='unlinked-msg'>Click to link your {this.state.type} account!</span>
		</div>
  	);

	return (
		<div> 
			{this.makeLink(contents)}
		</div>
    )
  }
}

// TODO Implement loading state
// Set loading: true in componentWillMount of App getUser
class SettingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {user: {}, linkedAccounts: [], unlinkedAccounts: []};
  }

  componentWillReceiveProps(nextProps) {
	this.setState({ user: nextProps.user });  
	this.getLinkedAccounts(nextProps.user)
  }

  getLinkedAccounts(user) {
	var linkedAccounts = []
    var unlinkedAccounts = []

	if (user['reddit-username'] !== "") {
	  linkedAccounts.push({type: 'reddit', identification: user['reddit-username']})
    } else {
	  unlinkedAccounts.push({type: 'reddit'})
    }	

	this.setState({linkedAccounts: linkedAccounts, unlinkedAccounts: unlinkedAccounts})
  }

  render() {
	var i = 0
    const linkedAccounts = this.state.linkedAccounts.map((d) => { <LinkedAccount type={d['type']} key={i} identification={d.identification}/>; i++; } );
    const unlinkedAccounts = this.state.unlinkedAccounts.map((d) => { 
		i++; return <UnlinkedAccount username={this.state.user['username']} type={d['type']} key={i}/>; 
	} );
	return (
      // Currently conditionally render linked accounts header: TODO: put this in a function/component}
	  <div className='settings-page'> 	
			  <div className='settings-header'>Logged in as:</div>
				<div className='settings-value'>{this.state.user['username']}</div>
			  {(linkedAccounts.length === 0) ? "" : <div className='settings-header'>Linked Accounts:</div>}
				{linkedAccounts}
			  {(unlinkedAccounts.length === 0) ? "" : <div className='settings-header'>Unlinked Accounts:</div>}
				{unlinkedAccounts}
			<Button>
			  Save
			</Button>
		</div>
	);
  }
}

export default SettingsPage
