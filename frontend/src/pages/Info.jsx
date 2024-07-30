import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import api from "../api";
import PlayingContext from "../contexts/PlayingContext";
import { Link } from "react-router-dom";
import "../styles/Info.css";

export function Song_Info() {
  const { song_id } = useParams();
  const [item, setItem] = useState({});
  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const { playing, setPlaying, isPlaying, setIsPlaying } =
    useContext(PlayingContext);

  useEffect(() => {
    getItem();
  }, []);

  const getItem = () => {
    api
      .get(`/api/song/${song_id}`)
      .then((res) => res.data)
      .then((data) => {
        setItem(data);
        setArtists(data.artist);
        setGenres(data.genre);
        // console.log(data);
      })
      .catch((err) => alert(err));
  };

  const handlePlayButton = () => {
    if ((playing.id != item.id) & isPlaying) {
      setPlaying(item);
      setIsPlaying(true);
    } else {
      setPlaying(item);
      // console.log(playing);
      setIsPlaying(!isPlaying);
    }
    console.log(item.file_url);
  };

  return (
    <div className="body">
      <Header destination="Info" />
      <div className="info">
        <div className="thumbnail-section">
          <div className="large-thumbnail">
            <img src={item.cover_image_url} className="large-thumbnail-image" />
          </div>
        </div>
        <div className="info-section">
          <div className="song-name">{item.title}</div>
          <div className="options">
            <div className="button">
              <div className="controls">
                <button
                  className="controls-button play-pause"
                  onClick={handlePlayButton}
                >
                  <img
                    src={
                      isPlaying & (playing.id === item.id)
                        ? "http://127.0.0.1:8000/api/static/icons/Pause.svg"
                        : "http://127.0.0.1:8000/api/static/icons/Play.svg"
                    }
                    alt=""
                    className="controls-button-icon"
                  />
                </button>
              </div>
            </div>
            <div className="button">
              <button className="controls-button">
                <img
                  src="http://127.0.0.1:8000/api/static/icons/Pause.svg"
                  alt=""
                  className="controls-button-icon"
                />
              </button>
            </div>
            <div className="button">
              <button className="controls-button">
                <img
                  src="http://127.0.0.1:8000/api/static/icons/Pause.svg"
                  alt=""
                  className="controls-button-icon"
                />
              </button>
            </div>
          </div>
          <div className="genre-filters">
            {genres.map((chip) => (
              <div className="chips" key={chip.id}>
                <button className="chips-button">{chip.name}</button>
              </div>
            ))}
          </div>
          <div className="artist-list">
            {artists.map((person) => (
              <div className="artist-item" key={person.id}>
                <div className="artist-item-thumbnail">
                  <img
                    src={person.profile_image_url}
                    alt=""
                    className="artist-item-image"
                  />
                </div>
                <div className="artist-item-name">
                  <Link to={"/artist/" + person.id}>{person.name}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Artist_Info() {
  const { artist_id } = useParams();
  const [item, setItem] = useState({});
  const [songs, setSongs] = useState([]);
  const { playing, setPlaying, isPlaying, setIsPlaying } =
    useContext(PlayingContext);

  useEffect(() => {
    getItem();
  }, []);

  const handlePlayButton = () => {
    if (playing.id === item.id) {
      setIsPlaying(!isPlaying);
    } else {
      setPlaying(item);
      setIsPlaying(true);
    }
    console.log(item.file_url);
  };

  const getItem = () => {
    api
      .get(`/api/artist/${artist_id}`)
      .then((res) => res.data)
      .then((data) => {
        setItem(data);
        setSongs(data.songs);
        // console.log(data);
      })
      .catch((err) => alert(err));
  };
  return (
    <div className="body">
      <Header destination="Artist Info" />
      <div className="artist-info">
        <div className="thumbnail-section">
          <div className="large-artist-thumbnail">
            <img
              src={item.profile_image_url}
              className="large-thumbnail-image"
            />
          </div>
        </div>
        <div className="artist-info-section">
          <div className="artist-name">{item.name}</div>
          <div className="options">
            <div className="button">
              <div className="controls">
                <button
                  className="controls-button play-pause"
                  // onClick={handlePlayButton}
                >
                  {/* <img
                    src={
                      isPlaying
                        ? "http://127.0.0.1:8000/api/static/icons/Pause.svg"
                        : "http://127.0.0.1:8000/api/static/icons/Play.svg"
                    }
                    alt=""
                    className="controls-button-icon"
                  /> */}
                </button>
              </div>
            </div>
            <div className="button">add to playlist</div>
            <div className="button">add to queue</div>
          </div>
          <div className="song-list">
            {songs.map((song) => (
              <div className="song-item" key={song.id}>
                <div className="song-item-thumbnail-section">
                  <div className="song-item-thumbnail">
                    <img
                      src={song.cover_image_url}
                      alt=""
                      className="song-item-image"
                    />
                  </div>
                  <div
                    className="overlay"
                    onClick={() => {
                      if (playing.id === song.id) {
                        setIsPlaying(!isPlaying);
                      } else {
                        setPlaying(song);
                        setIsPlaying(true);
                      }
                      console.log(song.file_url);
                    }}
                  >
                    <button className="controls-button play-pause">
                      <img
                        src={
                          isPlaying && (playing.id === song.id)
                            ? "http://127.0.0.1:8000/api/static/icons/Pause.svg"
                            : "http://127.0.0.1:8000/api/static/icons/Play.svg"
                        }
                        alt=""
                        className="controls-button-icon"
                      />
                    </button>
                  </div>
                </div>
                <div className="song-item-name">
                  <Link to={"/info/" + song.id}>{song.title}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export function Album_Info() {
  const { album_id } = useParams();
  const [item, setItem] = useState({});
  const [songs, setSongs] = useState([]);
  const { playing, setPlaying, isPlaying, setIsPlaying } =
    useContext(PlayingContext);

  useEffect(() => {
    getItem();
  }, []);

  const handlePlayButton = () => {
    if (playing.id === item.id) {
      setIsPlaying(!isPlaying);
    } else {
      setPlaying(item);
      setIsPlaying(true);
    }
    console.log(item.file_url);
  };

  const getItem = () => {
    api
      .get(`/api/album/${album_id}`)
      .then((res) => res.data)
      .then((data) => {
        setItem(data);
        setSongs(data.songs);
        // console.log(data);
      })
      .catch((err) => alert(err));
  };
  return (
    <div className="body">
      <Header destination="Album Info" />
      <div className="info">
        <div className="thumbnail-section">
          <div className="large-thumbnail">
            <img src={item.cover_image_url} className="large-thumbnail-image" />
          </div>
        </div>
        <div className="info-section">
          <div className="song-name">{item.title}</div>
          <div className="options">
            <div className="button">
              <div className="controls">
                <button
                  className="controls-button play-pause"
                  // onClick={handlePlayButton}
                >
                  <img
                    src={"http://127.0.0.1:8000/api/static/icons/Play.svg"}
                    alt=""
                    className="controls-button-icon"
                  />
                </button>
              </div>
            </div>
            <div className="button">add to playlist</div>
            <div className="button">add to queue</div>
          </div>
          <div className="song-list">
            {songs.map((song) => (
              <div className="song-item" key={song.id}>
                <div className="song-item-thumbnail-section">
                  <div className="song-item-thumbnail">
                    <img
                      src={song.cover_image_url}
                      alt=""
                      className="song-item-image"
                    />
                  </div>
                  <div
                    className="overlay"
                    onClick={() => {
                      if (playing.id === song.id) {
                        setIsPlaying(!isPlaying);
                      } else {
                        setPlaying(song);
                        setIsPlaying(true);
                      }
                      console.log(song.file_url);
                    }}
                  >
                    <button className="controls-button play-pause">
                      <img
                        src={
                          isPlaying & (playing.id === song.id)
                            ? "http://127.0.0.1:8000/api/static/icons/Pause.svg"
                            : "http://127.0.0.1:8000/api/static/icons/Play.svg"
                        }
                        alt=""
                        className="controls-button-icon"
                      />
                    </button>
                  </div>
                </div>
                <div className="song-item-name">
                  <Link to={"/info/" + song.id}>{song.title}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Playlist_Info() {
  const { playlist_id } = useParams();
  const [item, setItem] = useState({});
  const [songs, setSongs] = useState([]);
  const { playing, setPlaying, isPlaying, setIsPlaying, queue, setQueue } =
    useContext(PlayingContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getItem();
  }, []);

  const handlePlayButton = async () => {
    try {
      const response = await api.get(`api/playlist/${item.id}`);
      setQueue(response.data.songs);
      setPlaying(response.data.songs[0]);
      setIsPlaying(true);
    } catch (err) {
      alert(err);
    } finally {
      setIsLoading(false);
    }
    console.log(item.file_url);
  };

  const getItem = () => {
    api
      .get(`/api/playlist/${playlist_id}`)
      .then((res) => res.data)
      .then((data) => {
        setItem(data);
        setSongs(data.songs);
        // console.log(data);
      })
      .catch((err) => alert(err));
  };
  return (
    <div className="body">
      <Header destination="Playlist Info" />
      <div className="info">
        <div className="thumbnail-section">
          <div className="large-thumbnail">
            <img src={item.cover_image_url} className="large-thumbnail-image" />
          </div>
        </div>
        <div className="info-section">
          <div className="song-name">{item.name}</div>
          <div className="options">
            <div className="button">
              <div className="controls">
                <button
                  className="controls-button play-pause"
                  onClick={handlePlayButton}
                >
                  <img
                    src={"http://127.0.0.1:8000/api/static/icons/Play.svg"}
                    alt=""
                    className="controls-button-icon"
                  />
                </button>
              </div>
            </div>
            <div className="button">add to playlist</div>
            <div className="button">add to queue</div>
          </div>
          <div className="song-list">
            {songs.map((song) => (
              <div className="song-item" key={song.id}>
                <div className="song-item-thumbnail-section">
                  <div className="song-item-thumbnail">
                    <img
                      src={song.cover_image_url}
                      alt=""
                      className="song-item-image"
                    />
                  </div>
                  <div
                    className="overlay"
                    onClick={() => {
                      if (playing.id === song.id) {
                        setIsPlaying(!isPlaying);
                      } else {
                        setPlaying(song);
                        setIsPlaying(true);
                      }
                      console.log(song.file_url);
                    }}
                  >
                    <button className="controls-button play-pause">
                      <img
                        src={
                          isPlaying & (playing.id === song.id)
                            ? "http://127.0.0.1:8000/api/static/icons/Pause.svg"
                            : "http://127.0.0.1:8000/api/static/icons/Play.svg"
                        }
                        alt=""
                        className="controls-button-icon"
                      />
                    </button>
                  </div>
                </div>
                <div className="song-item-name">
                  <Link to={"/info/" + song.id}>{song.title}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
