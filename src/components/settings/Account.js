import React from 'react';
import axios from 'axios';
import RedditSection from '../login/RedditSection';
import FacebookSection from '../login/FacebookSection';
import TwitterSection from '../login/TwitterSection';
import { Row, Col } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

// This component display information about a particular account linked for the user (i.e. reddit/facebook etc.)
export class LinkedAccount extends React.Component {
	constructor(props) {
		super(props);
		this.imageForType = this.imageForType.bind(this);
		this.altForType = this.altForType.bind(this);
		this.deleteLink = this.deleteLink.bind(this);
		this.state = {
			username: props.username,
			type: props.type,
			identification: props.identification,
			removeLinkFromParent: props.removeLinkFromParent
		};

	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			username: nextProps.username,
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
		  url: self.props.core + '/v1/users/'+ self.state.username +'/accounts/' + self.state.type,
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
export class UnlinkedAccount extends React.Component {
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
    } else if (this.state.type === "twitter") {
			return (<TwitterSection username={this.state.username} content={content} core={this.props.core} />);
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
