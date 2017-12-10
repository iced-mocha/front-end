import React from 'react';
import axios from 'axios';
import RedditSection from '../login/RedditSection';
import FacebookSection from '../login/FacebookSection';
import { WeightSlider } from './Slider';
import { Jumbotron, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Config from '../../../config.json';

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
		  url: self.props.core + '/v1/users/accounts/' + self.state.type,
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
			return (<RedditSection username={this.state.username} content={content} core={this.props.core} />);
    } else if (this.state.type === "facebook") {
			return (<FacebookSection addLinkToParent={this.state.addLinkToParent} username={this.state.username} content={content} core={this.props.core} />);
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
		this.addLinkToParent = this.addLinkToParent.bind(this);
		this.sliderChange = this.sliderChange.bind(this);
		this.resetWeights = this.resetWeights.bind(this);
		this.submitWeights = this.submitWeights.bind(this);
		this.getLinkedAccounts = this.getLinkedAccounts.bind(this);
		this.isSliderHidden = this.isSliderHidden.bind(this);
		this.state = {};
		this.core = props.core;

		if (props.user !== undefined && props.user !== {} &&
			props.user['post-weights'] !== undefined) {
			var accounts = this.getLinkedAccounts(props.user);
			this.state = {
				user: props.user,
				linkedAccounts: accounts.linkedAccounts,
				unlinkedAccounts: accounts.unlinkedAccounts,
				hasWeightsChanged: false,
				reddit: props.user['post-weights']['reddit'],
				facebook: props.user['post-weights']['facebook'],
				hackerNews: props.user['post-weights']['hacker-news'],
				googleNews: props.user['post-weights']['google-news']
			};
		}
  }

	addLinkToParent(type, identification) {
		var newLinks = [];
		for (var i = 0; i < this.state.unlinkedAccounts.length; i++) {
			if (this.state.unlinkedAccounts[i]['type'] !== type) {
				newLinks.push(this.state.unlinkedAccounts[i]);
			}
		}

		this.state.linkedAccounts.push({type: type, identification: identification});

		this.setState({linkedAccounts: this.state.linkedAccounts, unlinkedAccounts: newLinks});
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
		this.state.unlinkedAccounts.push({type: type});

		this.setState({unlinkedAccounts: this.state.unlinkedAccounts, linkedAccounts: newLinks});
	}

  componentWillReceiveProps(nextProps) {
		var accounts = this.getLinkedAccounts(nextProps.user);

		if (nextProps.user['post-weights'] !== undefined) {
			this.setState({
				isLoading: false,
				user: nextProps.user,
				linkedAccounts: accounts.linkedAccounts,
				unlinkedAccounts: accounts.unlinkedAccounts,
				hasWeightsChanged: false,
				reddit: nextProps.user['post-weights']['reddit'],
				facebook: nextProps.user['post-weights']['facebook'],
				hackerNews: nextProps.user['post-weights']['hacker-news'],
				googleNews: nextProps.user['post-weights']['google-news']
			});
		} else {
			this.setState({
				isLoading: false,
				user: nextProps.user,
				linkedAccounts: accounts.linkedAccounts,
			 	unlinkedAccounts: accounts.unlinkedAccounts,
				hasWeightsChanged: false,
			});
		}
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
			i++; return <LinkedAccount core={this.core} type={d['type']} key={i} identification={d['identification']} removeLinkFromParent={this.removeLinkFromParent}/>;
		});

		if (i > 0) {
			return this.wrapInSettingsHeader("Linked Accounts", linkedAccounts);
		}
		return linkedAccounts;
  }

  buildUnlinkedAccountsList() {
		var i = 0;
		const unlinkedAccounts = this.state.unlinkedAccounts.map((d) => {
			i++; return <UnlinkedAccount core={this.core} username={this.state.user['username']}
				type={d['type']} key={i} addLinkToParent={this.addLinkToParent}/>;
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

	sliderChange(type, value) {
		// When we receive a value hold it a 'changed' state until the user saves
		// This is to allow to restore to previous state after moving sliders

		// We dont need to trigger a render for this state
		if (type === 'reddit') {
			this.state.reddit = value;
		} else if (type === 'facebook') {
			this.state.facebook = value;
		} else if (type === 'hacker-news') {
			this.state.hackerNews = value;
		} else if (type === 'google-news') {
			this.state.googleNews = value;
		}

		this.setState({hasWeightsChanged: true});
	}

	resetWeights() {
		// Force the sliders to reset to the state contained in user
		this.setState({
			reddit: this.state.user['post-weights']['reddit'],
			facebook: this.state.user['post-weights']['facebook'],
			hackerNews: this.state.user['post-weights']['hacker-news'],
			googleNews: this.state.user['post-weights']['google-news'],
			hasWeightsChanged: false
		});
	}

	submitWeights() {
		// Go through all our current slider states - if they dont equal -1 they have changed
		// so update our user state.
		var u = this.state.user;
		u['post-weights']['reddit'] = this.state.reddit;
		u['post-weights']['facebook'] = this.state.facebook;
		u['post-weights']['hacker-news'] = this.state.hackerNews;
		u['post-weights']['google-news'] = this.state.googleNews;

		var self = this;

		axios({
			method: 'post',
			url: self.core + '/v1/weights',
			withCredentials: true,
			data: {
				'reddit': self.state.reddit,
				'facebook': self.state.facebook,
				'hacker-news': self.state.hackerNews,
				'google-news': self.state.googleNews
			}
		}).then(function(response) {
			// TODO: show loading icon as soon as this fires
			self.setState({
				user: u,
				hasWeightsChanged: false
			});
		}).catch(function(error){
			// TODO: show banner saying unable to update weights
			self.resetWeights();
		});
	}

	isSliderHidden(type) {
		var unlinked = this.state.unlinkedAccounts;
		for (var i = 0; i < unlinked.length; i++) {
			if (unlinked[i].type === type) {
				return true;
			}
		}

		return false;
	}

  render() {
		// If we haven't received our user yet lets show a loading icon
		if (this.state.user === undefined || this.state.user === {} ||
			this.state.user['post-weights'] === undefined) {
			return (<div className='spinner-wrapper'><FontAwesome name='spinner' spin /></div>);
		}

		return (
				// Currently conditionally render linked accounts header: TODO: put this in a function/component}
				<div className='settings-page'>
					<div className='settings-header-top'>Logged in as</div>
					<div className='settings-value'>{this.state.user['username']}</div>
					{this.buildLinkedAccountsList()}
					{this.buildUnlinkedAccountsList()}
					<div className='settings-header'>Posts Weighting</div>
					<WeightSlider value={this.state.reddit} type='reddit' onChange={this.sliderChange} />
					<WeightSlider value={this.state.facebook} hidden={this.isSliderHidden('facebook')} type='facebook' onChange={this.sliderChange} />
					<WeightSlider value={this.state.hackerNews} type='hacker-news' onChange={this.sliderChange} />
					<WeightSlider value={this.state.googleNews} type='google-news' onChange={this.sliderChange} />
					<div className="btn-weights-group">
						<Button className='btn-w-reset' onClick={this.resetWeights} disabled={!this.state.hasWeightsChanged}>Reset</Button>
						<Button className='btn-w-submit' bsStyle='primary' onClick={this.submitWeights} disabled={!this.state.hasWeightsChanged}>Save</Button>
					</div>
			</div>
		);
  }
}

export default SettingsPage
