import React from 'react';
import axios from 'axios';
import RedditSection from '../login/RedditSection';
import FacebookSection from '../login/FacebookSection';
import TwitterSection from '../login/TwitterSection';
import RssSection from './RssSection';
import { WeightSlider } from './Slider';
import { LinkedAccount, UnlinkedAccount } from './Account'
import { Jumbotron, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Config from '../../../config.json';

const types = ['reddit', 'facebook', 'twitter', 'hacker-news', 'google-news'];

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
    this.getUpdatedWeight = this.getUpdatedWeight.bind(this);
    this.updateRssGroups = this.updateRssGroups.bind(this);
    this.updateRssWeight = this.updateRssWeight.bind(this);
    this.addRssUrl = this.addRssUrl.bind(this);
    this.removeRssUrl = this.removeRssUrl.bind(this);
		this.state = {};
		this.core = props.core;

		if (props.user !== undefined && props.user !== {} &&
			props.user['post-weights'] !== undefined) {
			var accounts = this.getLinkedAccounts(props.user);
			this.state = {
				user: this.deepCopy(props.user),
        updatedUser: props.user,
				linkedAccounts: accounts.linkedAccounts,
				unlinkedAccounts: accounts.unlinkedAccounts,
				hasWeightsChanged: false,
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
    if (Object.keys(nextProps.user).length == 0) {
      return;
    }
    this.setState({
      isLoading: false,
      user: this.deepCopy(nextProps.user),
      updatedUser: nextProps.user,
      linkedAccounts: accounts.linkedAccounts,
      unlinkedAccounts: accounts.unlinkedAccounts,
      hasWeightsChanged: false,
    });
  }

  deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
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
			i++; return (<LinkedAccount core={this.core} type={d['type']} key={i} username={this.state.user['username']}
				identification={d['identification']} removeLinkFromParent={this.removeLinkFromParent}/>);
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

		if (user['twitter-username'] !== "") {
			linkedAccounts.push({type: 'twitter', identification: user['twitter-username']});
		} else {
			unlinkedAccounts.push({type: 'twitter'});
		}

		if (user['facebook-username'] !== "") {
			linkedAccounts.push({type: 'facebook', identification: user['facebook-username']});
    } else {
			unlinkedAccounts.push({type: 'facebook'});
    }

		return {linkedAccounts: linkedAccounts, unlinkedAccounts: unlinkedAccounts};
  }

	sliderChange(type, value) {
    let updatedUser = this.state.updatedUser;
    updatedUser['post-weights'][type] = value;
		this.setState({
      hasWeightsChanged: true,
      updatedUser: updatedUser
    });
	}

	resetWeights() {
    let updatedUser = this.state.updatedUser;
    updatedUser['post-weights'] = this.deepCopy(this.state.user['post-weights']);
    updatedUser['rss-groups'] = this.deepCopy(this.state.user['rss-groups']);
		// Force the sliders to reset to the state contained in user
		this.setState({
      updatedUser: updatedUser,
			hasWeightsChanged: false
		});
	}

  getUserWeights(user) {
    let weights = {};
    types.forEach(type => {
      weights[type] = parseFloat(user['post-weights'][type]);
    });
    weights['rss'] = {};
    Object.keys(user['post-weights']['rss']).map(group => {
      weights['rss'][group] = parseFloat(user['post-weights']['rss'][group]);
    });
    return weights;
  }

	submitWeights() {
    this.setState({
      user: this.deepCopy(this.state.updatedUser)
    });
		axios({
			method: 'post',
			url: this.core + '/v1/users/'+ this.state.user.username +'/weights',
			withCredentials: true,
			data: this.getUserWeights(this.state.updatedUser)
		}).then(response => {
			// TODO: show loading icon as soon as this fires
			this.setState({
				hasWeightsChanged: false
			});
		}).catch(error => {
			// TODO: show banner saying unable to update weights
			this.resetWeights();
		});
		axios({
			method: 'post',
			url: this.core + '/v1/users/'+ this.state.user.username +'/rss',
			withCredentials: true,
			data: this.state.updatedUser['rss-groups']
		}).then(response => {
			// TODO: show loading icon as soon as this fires
			this.setState({
				hasWeightsChanged: false
			});
		}).catch(error => {
		});
	}

	isSliderHidden(type) {
    if (type == 'reddit' || type == 'hacker-news' || type == 'google-news') {
      return false
    }
		var unlinked = this.state.unlinkedAccounts;
		for (var i = 0; i < unlinked.length; i++) {
			if (unlinked[i].type === type) {
				return true;
			}
		}

		return false;
	}

  getUpdatedWeight(type) {
    if (this.state.updatedUser && this.state.updatedUser['post-weights']) {
      return this.state.updatedUser['post-weights'][type];
    }
    return 0;
  }

  updateRssGroups(groups) {
    // TODO: Actually send updated data
    let updatedUser = this.state.updatedUser;
    updatedUser['rss-groups'] = groups;
    this.setState({
      updatedUser: updatedUser
    });
  }

  updateRssWeight(group, weight) {
    // TODO: Actually send updated data
    let updatedUser = this.state.updatedUser;
    updatedUser['post-weights']['rss'][group] = weight;
    this.setState({
      updatedUser: updatedUser,
			hasWeightsChanged: true
    });
  }

  removeRssUrl(name, i) {
    let updatedUser = this.state.updatedUser;
    updatedUser['rss-groups'][name].splice(i, 1);
    this.setState({
      updatedUser: updatedUser,
      hasWeightsChanged: true
    });
  }

  addRssUrl(name, tag) {
    let updatedUser = this.state.updatedUser;
    updatedUser['rss-groups'][name].push(tag);
    this.setState({
      updatedUser: updatedUser,
      hasWeightsChanged: true
    });
  }

  render() {
		// If we haven't received our user yet lets show a loading icon
		if (this.state.user === undefined || this.state.user === {} ||
			this.state.user['post-weights'] === undefined) {
			return (<div className='spinner-wrapper'><FontAwesome name='spinner' spin /></div>);
		}

		return (
				// Currently conditionally render linked accounts header: TODO: put this in a function/component
				<div className='settings-page'>
					<div className='settings-header-top'>Logged in as</div>
					<div className='settings-value'>{this.state.user['username']}</div>
					{this.buildLinkedAccountsList()}
					{this.buildUnlinkedAccountsList()}
					<div className='settings-header'>Posts Weighting</div>
          { types.map(type => {
              if (!this.isSliderHidden(type)) {
                return (
                  <WeightSlider
                    value={this.getUpdatedWeight(type)}
                    type={type}
                    onChange={this.sliderChange}
                  />
                );
              }
            })
          }
					<div className='settings-header'>RSS Feeds</div>
          <RssSection
            weights={this.getUpdatedWeight('rss')}
            groups={this.state.updatedUser['rss-groups']}
            updateWeight={this.updateRssWeight}
            updateGroups={this.updateRssGroups}
            removeUrl={this.removeRssUrl}
            addUrl={this.addRssUrl}
            moveUrl={this.moveUrl}
          />
					<div className="btn-weights-group">
						<Button className='btn-w-reset' onClick={this.resetWeights} disabled={!this.state.hasWeightsChanged}>Reset</Button>
						<Button className='btn-w-submit' bsStyle='primary' onClick={this.submitWeights} disabled={!this.state.hasWeightsChanged}>Save</Button>
					</div>
			</div>
		);
  }
}

export default SettingsPage
