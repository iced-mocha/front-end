import React from 'react';
import axios from 'axios';
import RedditSection from '../login/RedditSection'
import { Jumbotron, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome'

// This component display information about a particular account linked for the user (i.e. reddit/facebook etc.)
class LinkedAccount extends React.Component {
	constructor(props) {
		super(props);
		this.imageForType = this.imageForType.bind(this);
		this.altForType = this.altForType.bind(this);
		this.deleteLink = this.deleteLink.bind(this);
		this.state = {
			type: props.type, 
			identification: props.identification, 
			removeLinkFromParent: props.removeLinkFromParent
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			type: nextProps.type, 
			identification: nextProps.identification,
			removeLinkFromParent: nextProps.removeLinkFromParent
		});
	}

  altForType(type) {
		if (type === "reddit") {
			return "Reddit Icon";
		} else if (type === "facebook") {
			return "Facebook Icon";
		}
		return "";
  }

  imageForType(type) {
		if (type === "reddit") {
			return "/img/reddit-icon.png";
		} else if (type === "facebook") {
			return "/img/facebook-icon.png";
		}
		return "";
  }

	deleteLink() {
		axios({
			method: 'delete',
		  url: 'http://0.0.0.0:3000/v1/users/accounts/' + this.state.type,
			withCredentials: true
		}).then(function(response) {
				//self.state.removeLinkFromParent(self.state.type)
		});
		this.state.removeLinkFromParent(this.state.type)
	}

  render() {
		return(
			<Row className='account-row'> 
				<Col md={11}>
					<img className="account-img" src={this.imageForType(this.state.type)} alt={this.altForType(this.state.type)} />
					<span className="account-value" >{this.state.identification} </span> 
				</Col>
				<Col md={1}><FontAwesome onClick={this.deleteLink} className="linked-delete-icon" name="times"/></Col>
			</Row>
    );
  }
}

class UnlinkedAccount extends React.Component {
  constructor(props) {
    super(props);
    this.imageForType = this.imageForType.bind(this);
    this.altForType = this.altForType.bind(this);
    this.makeLink = this.makeLink.bind(this);
		this.state = props
  }
  
  altForType(type) {
		if (type === "reddit") {
			return "Reddit Icon";
		} else if (type === "facebook") {
			return "Facebook Icon";
		}
		return "";
  }

  imageForType(type) {
		if (type === "reddit") {
			return "/img/reddit-icon.png";
		} else if (type === "facebook") {
			return "/img/facebook-icon.png";
		}
		return "";
  }
  
  makeLink(content) {
		if (this.state.type === "reddit") {
			return (<RedditSection username={this.state.username} content={content} />);
    } else if (this.state.type === "facebook") {
			return (<RedditSection username={this.state.username} content={content} />);
    }
		return "";
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
		);
  }
}

// TODO Implement loading state
// Set loading: true in componentWillMount of App getUser
class SettingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.buildLinkedAccountsList = this.buildLinkedAccountsList.bind(this);
    this.buildUnlinkedAccountsList = this.buildUnlinkedAccountsList.bind(this);
    this.wrapInSettingsHeader = this.wrapInSettingsHeader.bind(this);
		this.removeLinkFromParent = this.removeLinkFromParent.bind(this);
    this.state = {user: {}, linkedAccounts: [], unlinkedAccounts: []};
  }
	
	removeLinkFromParent(type) {
		var i = 0;
		var newLinks = [];
		for (i = 0; i < this.state.linkedAccounts.length; i++) {
			if (this.state.linkedAccounts[i]['type'] !== type) {
				newLinks.push(this.state.linkedAccounts[i]);
			}
		}
		
		this.state.unlinkedAccounts.push({type: type})
		this.setState({unlinkedAccounts: this.state.unlinkedAccounts, linkedAccounts: newLinks})
	}

  componentWillReceiveProps(nextProps) {
		this.setState({ user: nextProps.user });
		this.getLinkedAccounts(nextProps.user);
  }

  wrapInSettingsHeader(title, content) {
		return ( 
			<div>
				<div className='settings-header'>{title}</div>
				{content}
			</div>
	  );
  }

  buildLinkedAccountsList() {
		var i = 0;
		var linkedAccounts = this.state.linkedAccounts.map((d) => { 
			i++; return <LinkedAccount type={d['type']} key={i} identification={d['identification']} removeLinkFromParent={this.removeLinkFromParent}/>;
		});

		if (i > 0) {
			return this.wrapInSettingsHeader("Linked Accounts:", linkedAccounts);
		}
		return linkedAccounts;
  }
  
  buildUnlinkedAccountsList() {
		var i = 0;
		const unlinkedAccounts = this.state.unlinkedAccounts.map((d) => { 
			i++; return <UnlinkedAccount username={this.state.user['username']} type={d['type']} key={i}/>; 
		});

		if (i > 0) {
			return this.wrapInSettingsHeader("Unlinked Accounts:", unlinkedAccounts);
		}
		return unlinkedAccounts;
  }

  getLinkedAccounts(user) {
		var linkedAccounts = []
    var unlinkedAccounts = []

		if (user['reddit-username'] !== "") {
			linkedAccounts.push({type: 'reddit', identification: user['reddit-username']})
    } else {
			unlinkedAccounts.push({type: 'reddit'})
    }	
		
		if (user['facebook-username'] !== "") {
			linkedAccounts.push({type: 'facebook', identification: user['facebook-username']})
    } else {
			unlinkedAccounts.push({type: 'facebook'})
    }	

		this.setState({linkedAccounts: linkedAccounts, unlinkedAccounts: unlinkedAccounts})
  }

  render() {
		return (
				// Currently conditionally render linked accounts header: TODO: put this in a function/component}
				<div className='settings-page'> 	
					<div className='settings-header-top'>Logged in as:</div>
					<div className='settings-value'>{this.state.user['username']}</div>
					{this.buildLinkedAccountsList()}
					{this.buildUnlinkedAccountsList()}
			</div>
		);
  }
}

export default SettingsPage
