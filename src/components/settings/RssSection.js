import React from 'react';
import { WeightSlider } from './Slider';

class RssSection extends React.Component {
  constructor(props) {
    super(props);
    this.feedList = this.feedList.bind(this);
    this.onUrlKeyDown = this.onUrlKeyDown.bind(this);
    this.onGroupNameKeyDown = this.onGroupNameKeyDown.bind(this);
    this.updateNewUrl = this.updateNewUrl.bind(this);
    this.updateGroupName = this.updateGroupName.bind(this);
    this.addUrl = this.addUrl.bind(this);
    this.changeGroupName = this.changeGroupName.bind(this);
    this.removeUrl = this.removeUrl.bind(this);
    this.addGroup = this.addGroup.bind(this);
    this.removeGroup = this.removeGroup.bind(this);
    this.state = {
      newUrls: {},
      newGroupNames: {}
    }
    Object.keys(this.props.groups).forEach(name => this.state.newUrls[name] = "");
    Object.keys(this.props.groups).forEach(name => this.state.newGroupNames[name] = name);
  }

  onUrlKeyDown(name, e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.addUrl(name, this.state.newUrls[name]);
      this.updateNewUrl(name, "");
    }
  }

  updateNewUrl(name, url) {
    let newUrls = this.state.newUrls;
    newUrls[name] = url;
    this.setState({newUrls: newUrls});
  }

  onGroupNameKeyDown(oldName, e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      let newName = this.state.newGroupNames[oldName];
      this.changeGroupName(oldName, newName, 0);
    }
  }

  addUrl(name, url) {
    let newGroups = this.props.groups;
    newGroups[name].push(url);
    this.props.updateGroups(newGroups);
  }

  removeUrl(name, i) {
    let newGroups = this.props.groups;
    newGroups[name].splice(i, 1);
    this.props.updateGroups(newGroups);
  }

  updateGroupName(oldName, newName) {
    let newNames = this.state.newGroupNames;
    newNames[oldName] = newName;
    this.setState({newNames: newNames});
  }

  changeGroupName(oldName, newName, count) {
    let groups = this.props.groups;
    let nameWithSuffix = newName;
    if (count) {
      nameWithSuffix += " (" + count + ")";
    }
    if (nameWithSuffix == oldName) {
      let newGroupNames = this.state.newGroupNames;
      newGroupNames[oldName] = oldName;
      this.setState({newGroupNames: newGroupNames});
      return;
    }
    if (groups[nameWithSuffix]) {
      return this.changeGroupName(oldName, newName, count + 1);
    }
    Object.defineProperty(groups, nameWithSuffix, Object.getOwnPropertyDescriptor(groups, oldName));
    delete groups[oldName];
    this.props.updateGroups(groups);
    this.props.updateWeight(nameWithSuffix, this.props.weights[oldName]);
    this.props.updateWeight(oldName, undefined);

    let newGroupNames = this.state.newGroupNames;
    newGroupNames[nameWithSuffix] = nameWithSuffix;
    delete newGroupNames[oldName];
    this.setState({newGroupNames: newGroupNames});
  }

  addGroup(name, urls, count) {
    let nameWithSuffix = name;
    if (count) {
      nameWithSuffix += " (" + count + ")";
    }
    if (this.props.groups[nameWithSuffix]) {
      if (count) {
        return this.addGroup(name, urls, count + 1);
      }
      return this.addGroup(name, urls, 1);
    }

    let newGroups = this.props.groups;
    newGroups[nameWithSuffix] = urls;
    this.props.updateGroups(newGroups);
    this.props.updateWeight(nameWithSuffix, 50);

    let newGroupNames = this.state.newGroupNames;
    newGroupNames[nameWithSuffix] = nameWithSuffix;
    this.setState({newGroupNames: newGroupNames});
  }

  removeGroup(name) {
    let newGroups = this.props.groups;
    delete newGroups[name];
    this.props.updateGroups(newGroups);
  }

  feedList(groupName) {
    let urls = this.props.groups[groupName];
    return (
      <ul className="tag-list">
        { urls.map((url, i) => (
            <li className="tag item">
              {url}
              <button 
                className="tag-remove"
                type="button"
                onClick={() => this.removeUrl(groupName, i)}>
                x
              </button>
            </li>
          ))
        }
        <li className="tag">
          <input 
            className="tag-input"
            type="text"
            placeholder="RSS Feed"
            value={this.state.newUrls[groupName]}
            onChange={e => this.updateNewUrl(groupName, e.target.value)}
            onKeyDown={e => this.onUrlKeyDown(groupName, e)} />
        </li>
      </ul>
    );
  }

  render() {
		return (
      <div>
      { Object.keys(this.props.groups).map(name => (
        <div key={name}>
          <input 
            className="tag-input settings-subtitle"
            type="text"
            placeholder="Group Name"
            value={this.state.newGroupNames[name]}
            onChange={e => this.updateGroupName(name, e.target.value)}
            onKeyDown={e => this.onGroupNameKeyDown(name, e)} />
          <button 
            className="group-remove"
            type="button"
            onClick={() => this.removeGroup(name)}>
            x
          </button>
          <WeightSlider
            value={this.props.weights[name]}
            type='rss'
            onChange={(t, val) => this.props.updateWeight(name, val)}
          />
          { this.feedList(name) }
        </div>
        ))
      }
        <button 
          className="group-new"
          type="button"
          onClick={() => this.addGroup("untitled", [])}>
          +
        </button>
      </div>
		);
  }
}

export default RssSection
