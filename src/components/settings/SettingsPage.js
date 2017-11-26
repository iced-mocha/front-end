import React from 'react';
import axios from 'axios';
import RedditSection from '../login/RedditSection'
import FacebookSection from '../login/FacebookSection'
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
		return type + " icon";
  }

  imageForType(type) {
		return "/img/" + type + "-icon.png";
  }

	deleteLink() {
		var self = this;
		axios({
			method: 'delete',
		  url: 'http://0.0.0.0:3000/v1/users/accounts/' + this.state.type,
			withCredentials: true
		}).then(function(response) {
			self.state.removeLinkFromParent(self.state.type)
		});
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

// This component display information about an unlinked account for the user (i.e. reddit/facebook etc.)
class UnlinkedAccount extends React.Component {
  constructor(props) {
    super(props);
    this.imageForType = this.imageForType.bind(this);
    this.altForType = this.altForType.bind(this);
    this.makeLink = this.makeLink.bind(this);
		this.state = props
  }

	altForType(type) {
		return type + " icon";
  }

  imageForType(type) {
		return "/img/" + type + "-icon.png";
  }

  makeLink(content) {
		if (this.state.type === "reddit") {
			return (<RedditSection username={this.state.username} content={content} />);
    } else if (this.state.type === "facebook") {
			return (<FacebookSection username={this.state.username} content={content} />);
    }
		return "";
  }

  render() {
		const contents = (<div className='unlinked-msg'>Click to link your {this.state.type} account!</div>);

		return (
			<Row className='account-row'>
				<Col md={12}>
					<div className='unlinked-container'>
						<img className="account-img" src={this.imageForType(this.state.type)} alt={this.altForType(this.state.type)} />
						{this.makeLink(contents)}
					</div>
				</Col>
			</Row>
		);
  }
}

// Set loading: true in componentWillMount of App getUser
class SettingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.buildLinkedAccountsList = this.buildLinkedAccountsList.bind(this);
    this.buildUnlinkedAccountsList = this.buildUnlinkedAccountsList.bind(this);
    this.wrapInSettingsHeader = this.wrapInSettingsHeader.bind(this);
		this.removeLinkFromParent = this.removeLinkFromParent.bind(this);
		this.getLinkedAccounts = this.getLinkedAccounts.bind(this);
		this.state = {};

		if (props.user !== undefined && props.user !== {}) {
			var accounts = this.getLinkedAccounts(props.user);
			this.state = {
				user: props.user,
				linkedAccounts: accounts.linkedAccounts,
				unlinkedAccounts: accounts.unlinkedAccounts
			};
		}
  }

	removeLinkFromParent(type) {
		// Creates the new list of linked accounts by removing 'type' from it
		var newLinks = [];
		for (var i = 0; i < this.state.linkedAccounts.length; i++) {
			if (this.state.linkedAccounts[i]['type'] !== type) {
				newLinks.push(this.state.linkedAccounts[i]);
			}
		}

		// Adds the removed account to the list of unlinked accounts
		this.state.unlinkedAccounts.push({type: type})

		this.setState({unlinkedAccounts: this.state.unlinkedAccounts, linkedAccounts: newLinks})
	}

  componentWillReceiveProps(nextProps) {
		var accounts = this.getLinkedAccounts(nextProps.user);
		this.setState({
			isLoading: false,
			user: nextProps.user,
			linkedAccounts: accounts.linkedAccounts,
		 	unlinkedAccounts: accounts.unlinkedAccounts
		});
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
			return this.wrapInSettingsHeader("Linked Accounts", linkedAccounts);
		}
		return linkedAccounts;
  }

  buildUnlinkedAccountsList() {
		var i = 0;
		const unlinkedAccounts = this.state.unlinkedAccounts.map((d) => {
			i++; return <UnlinkedAccount username={this.state.user['username']} type={d['type']} key={i}/>;
		});

		if (i > 0) {
			return this.wrapInSettingsHeader("Unlinked Accounts", unlinkedAccounts);
		}
		return unlinkedAccounts;
  }

  getLinkedAccounts(user) {
		var linkedAccounts = [];
    var unlinkedAccounts = [];

		if (user['reddit-username'] !== "") {
			linkedAccounts.push({type: 'reddit', identification: user['reddit-username']});
    } else {
			unlinkedAccounts.push({type: 'reddit'});
    }

		if (user['facebook-username'] !== "") {
			linkedAccounts.push({type: 'facebook', identification: user['facebook-username']});
    } else {
			unlinkedAccounts.push({type: 'facebook'});
    }

		return {linkedAccounts: linkedAccounts, unlinkedAccounts: unlinkedAccounts};
  }

  render() {
		// If we haven't received our user yet lets show a loading icon
		if (this.state.user === undefined || this.state.user === {}) {
			return (<div className='spinner-wrapper'><FontAwesome name='spinner' spin /></div>);
		}

		return (
				// Currently conditionally render linked accounts header: TODO: put this in a function/component}
				<div className='settings-page'>
					<div className='settings-header-top'>Logged in as</div>
					<div className='settings-value'>{this.state.user['username']}</div>
					{this.buildLinkedAccountsList()}
					{this.buildUnlinkedAccountsList()}
			</div>
		);
  }
}

export default SettingsPage
