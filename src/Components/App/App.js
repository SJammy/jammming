import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import PlayList from '../PlayList/PlayList';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName =this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    let inPlaylist = false;
    tracks.forEach(song => {
      if (track.id === song.id) {
        inPlaylist = true;
      }
    });
    if(!inPlaylist) {
      tracks.push(track);
    }

    this.setState({playlistTracks: tracks});

  }

  removeTrack(track) {
    let tracks =  this.state.playlistTracks;
    tracks = tracks.fliter(song => song.id !== track.id);
    this.setState({playlistTracks: tracks});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

savePlaylist() {
  let trackURIs = this.state.playlistTracks.map(track => track.uri);
  Spotify.savePlaylist(this.state.playlistName, trackURIs)
  .then(searchResults => {
    this.setState({playlistName: 'New Playlist', searchResults: [] });
  });
}



search(term) {
  Spotify.search(term).then(searchResults => {
    this.setState({searchResults: searchResults});
  });
}

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          {<SearchBar onSearch={this.search}/>}
          <div className="App-playlist">
            {<SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />}
            {<PlayList playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
