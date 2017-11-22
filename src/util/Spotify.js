
let accessToken;
const client_id = "0637f2f3e70641e5a22821aaa34cdeaa";
const redirect_uri = "http://localhost:3003/";

const Spotify = {
  getAccessToken() {
    if(accessToken) {
      return accessToken;
    }

    const retrieveAccessToken = window.location.href.match(/access_token=([^&]*)/);
    const retrieveExpirationTime = window.location.href.match(/expires_in=([^&]*)/);

    if(retrieveAccessToken && retrieveExpirationTime) {
      accessToken = retrieveAccessToken[1];
      const expiresIn = Number(retrieveExpirationTime[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`;
      window.location = accessUrl;
    }

  },

  search(term) {
    accessToken = Spotify.getAccessToken();

    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
      {headers: {Authorization: `Bearer ${accessToken}`
      }}
    )
    .then(response => {
        return response.json();
    })
    .then(jsonResponse => {
      if(!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));
    });
  },

  savePlaylist(name, trackUris) {
    if(!name || !trackUris) {
      return;
    }
    accessToken = Spotify.getAccessToken();
    let headers = {Authorization: `Bearer  ${accessToken}`};
    let userId;

    return fetch(`https://api.spotify.com/v1/me`, {headers: headers}).then(
    response => response.json()).then(
    jsonResponse => {
      userId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: name})
      }).then(
        response => response.json()).then(
          jsonResponse => {
        let playlistID = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({uris: trackUris})
          });
      });
    });

  }

};

export default Spotify;
