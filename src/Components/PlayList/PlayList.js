import React from 'react';
import './PlayList.css';
import TrackList from '../TrackList/TrackList';

class PlayList extends React.Component {

constructor(props) {
  super(props);
  this.onNameChange = this.onNameChange.bind(this);
}

handleNameChange(event) {
  this.props.onNameChange(event.target.value);
}

  render() {
    return (
      <div className="Playlist">
        <input defaultValue={'New Playlist'} onChange={'this.handleNameChange'}/>
        {/*<!-- Add a TrackList component --> */}
        <TrackList tracks="this.props.playlistTracks" onRemove="this.props.onRemove" />
        <a className="Playlist-save" onClick="this.props.onSave">SAVE TO SPOTIFY</a>
      </div>
    );
  }
}

export default PlayList;
