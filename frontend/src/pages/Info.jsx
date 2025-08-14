import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import api from "../api";
// import PlayingContext from "../contexts/PlayingContext";
import { Link } from "react-router-dom";
import "../styles/Info.css";
import { useDispatch, useSelector } from "react-redux";
import { setIsPlaying, setPlaying, setQueue } from "../store/playSlice";
import { MediumThumbnail } from "../components/Thumbnails";
import {
  IconSVG,
  PlayIcon,
  PauseIcon,
  LikeIcon,
  FilledLikeIcon,
  AddToPlaylistIcon,
  CheckPlaylistIcon,
  ExplicitIcon,
  AddLibraryIcon,
  AddLibraryCheckIcon,
  AddToQueueIcon,
  QueueIcon,
} from "../assets/Icons";

const ReadMore = ({ text, limit = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  useEffect(() => {
    if (text.length < limit) {
      setIsExpanded(true);
    }
  });
  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      {/* {isExpanded ? text : `${text.slice(0, limit)}...`} */}
      {isExpanded ? text : text}
      <button className="read-more" onClick={toggleReadMore}>
        {isExpanded ? "Show Less" : "Read More"}
      </button>
    </div>
  );
};

export function Song_Info() {
  const { song_id } = useParams();
  const [item, setItem] = useState({});
  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [albums, setAlbums] = useState([]);
  // const { playing, setPlaying, isPlaying, setIsPlaying } =
  //   useContext(PlayingContext);
  const { isPlaying, playing } = useSelector((state) => state.play);
  const dispatch = useDispatch();
  useEffect(() => {
    getItem();
  }, []);

  const getItem = () => {
    api
      .get(`/api/song/${song_id}`)
      .then((res) => res.data)
      .then((data) => {
        setItem(data);
        setArtists(data.artists);
        setGenres(data.genres);
        setAlbums(data.albums);
        // console.log(data);
      })
      .catch((err) => alert(err));
  };

  const handlePlayButton = () => {
    if (
      playing?.source_id != item.public_id ||
      playing?.public_id != item.public_id
    ) {
      let song = { ...item };
      song.source_id = song.public_id;
      song.source_type = "song";
      dispatch(setPlaying(song));
      dispatch(setIsPlaying(true));
      dispatch(setQueue([]));
    } else {
      dispatch(setIsPlaying(!isPlaying));
    }
  };

  return (
    <div className="body">
      <Header destination="Info" />
      <div className="info-page">
        <div className="thumbnail-section">
          <div className="large-thumbnail">
            <img src={item.thumbnail_url} className="large-thumbnail-image" />
          </div>
        </div>
        <div className="info-section">
          <div className="song-name">{item.title}</div>
          <div className="title-desc">
            {item.is_explicit ? <IconSVG>{ExplicitIcon}</IconSVG> : ""}
            {item.version} • {item.release_date} • {item.duration} •{" "}
            {item.analytics && <>{item.analytics.play_count} plays</>}
            {albums.map((album) => (
              <div className="album-item" key={album.public_id}>
                <Link to={"/album/" + album.public_id}>{album.title}</Link>
              </div>
            ))}
          </div>
          <div className="options">
            <div className="controls">
              <button
                className="controls-button play-pause"
                onClick={handlePlayButton}
              >
                <IconSVG>
                  {isPlaying &&
                  playing.public_id === item.public_id &&
                  playing.source_id === item.public_id
                    ? PauseIcon
                    : PlayIcon}
                </IconSVG>
              </button>
            </div>
            <div className="controls">
              <button className="controls-button">
                <IconSVG>
                  {item.interactions?.some(
                    (interaction) => interaction.interaction_type === "Like"
                  )
                    ? FilledLikeIcon
                    : LikeIcon}
                </IconSVG>
              </button>
            </div>
            <div className="controls">
              <button className="controls-button">
                <IconSVG>{AddToQueueIcon}</IconSVG>
              </button>
            </div>
            <div className="controls">
              <button className="controls-button">
                <IconSVG>
                  {item.interactions?.some(
                    (interaction) => interaction.interaction_type === "Save"
                  )
                    ? AddLibraryCheckIcon
                    : AddLibraryIcon}
                </IconSVG>
              </button>
            </div>
            <div className="controls">
              <button className="controls-button">
                <IconSVG>
                  {item.interactions?.some(
                    (interaction) => interaction.interaction_type === "Save"
                  )
                    ? CheckPlaylistIcon
                    : AddToPlaylistIcon}
                </IconSVG>
              </button>
            </div>
          </div>
          <div className="genre-filters">
            {genres.map((chip) => (
              <div className="chips" key={chip}>
                <button className="chips-button">{chip}</button>
              </div>
            ))}
          </div>
          <div className="artist-list">
            {artists.map((person) => (
              <div className="artist-item" key={person.public_id}>
                <div className="artist-item-thumbnail">
                  <img
                    src={person.profile_image_url}
                    alt=""
                    className="artist-item-image"
                  />
                </div>
                <div className="artist-item-info">
                  <div className="artist-item-name">
                    <Link to={"/artist/" + person.public_id}>
                      {person.name}
                    </Link>
                  </div>
                  <div className="role">{person.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="heading-section">
        <div className="heading">
          <b>Similar to this</b>
        </div>
      </div>
      <div className="grid-thumbnails">
        {/* {userFeed.quick_picks.map((item) => ( */}
        {/* <GridThumbnail item={item} key={item.public_id} /> */}
        {/* ))} */}
      </div>
      <div className="heading-section">
        <div className="heading">
          <b>More from the Artists</b>
        </div>
      </div>
      <div className="medium-thumbnails">
        {/* {userFeed.quick_picks.map((item) => ( */}
        {/* <GridThumbnail item={item} key={item.public_id} /> */}
        {/* ))} */}
      </div>
    </div>
  );
}

export function Artist_Info() {
  const { artist_id } = useParams();
  const [item, setItem] = useState({});
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const { isPlaying, playing } = useSelector((state) => state.play);
  const dispatch = useDispatch();

  useEffect(() => {
    getItem();
    if (item.bio && item.bio.length > 50) {
      setIsExpanded(false);
    }
  }, []);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const handlePlayButton = () => {};

  const getItem = async () => {
    try {
      const response = await api.get(`/api/artist/${artist_id}`);
      if (response.status === 200) {
        // console.log(data);
        setItem(response.data);
        setSongs(response.data.songs);
        setAlbums(response.data.albums);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlefollow = async () => {
    try {
      const response = await api.post("/api/interact/toggle/", {
        content_type: "artist",
        object_id: artist_id,
        interaction_type: "save",
      });
      // console.log(response.data);
    } catch (err) {
      console.log(err);
    }
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
          <div className="text">
            <div className="artist-name">{item.name}</div>
            {item.analytics && (
              <div className="artist-follow-count">
                {item.analytics.save_count} Followers
              </div>
            )}
            {item.bio && (
              <div className="artist-bio">
                {isExpanded ? item.bio : `${item.bio.slice(0, 50)}...`}
                <button className="read-more" onClick={toggleReadMore}>
                  {isExpanded ? "Show Less" : "Read More"}
                </button>
              </div>
            )}
          </div>
          <div className="options">
            <div className="controls">
              <button className="controls-button play-pause">
                <IconSVG>{isPlaying ? PauseIcon : PlayIcon}</IconSVG>
              </button>
            </div>
            <div className="follow-container">
              <button className="follow-button" onClick={handlefollow}>
                Follow
              </button>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="heading-section">
            <div className="heading">
              <b>Songs</b>
            </div>
          </div>
          <div className="grid-thumbnails">
            {songs.map((song) => (
              <div className="song-item" key={song.public_id}>
                <div className="order">{song.order}</div>
                <div className="song-item-thumbnail-section">
                  <div className="song-item-thumbnail">
                    <img
                      src={song.thumbnail_url}
                      alt=""
                      className="song-item-image"
                    />
                  </div>
                  <div
                    className="overlay"
                    onClick={() => {
                      if (
                        playing.public_id != song.public_id ||
                        playing.source_id != item.public_id
                      ) {
                        const qsongs =
                          item.songs?.map((song) => ({
                            ...song,
                            source_id: item.public_id,
                            source_type: "artist",
                          })) || [];
                        const currentIndex = qsongs.findIndex(
                          (item) => item.public_id === song.public_id
                        );
                        console.log(currentIndex);
                        if (currentIndex != 0 && currentIndex < qsongs.length) {
                          dispatch(setPlaying(qsongs[currentIndex]));
                          dispatch(setIsPlaying(true));
                        } else {
                          dispatch(setPlaying(qsongs[0]));
                          dispatch(setIsPlaying(true));
                        }
                        dispatch(setQueue(qsongs));
                      } else {
                        dispatch(setIsPlaying(!isPlaying));
                      }
                    }}
                  >
                    <button className="controls-button play-pause">
                      <IconSVG>
                        {isPlaying &&
                        playing.source_id === item.public_id &&
                        playing.public_id === song.public_id
                          ? PauseIcon
                          : PlayIcon}
                      </IconSVG>
                    </button>
                  </div>
                </div>
                <div className="title-section">
                  <div className="title">
                    <Link to={"/song/" + song.public_id}>{song.title}</Link>
                  </div>
                  {song.analytics && (
                    <div className="title-info">
                      {song.analytics.play_count} plays
                    </div>
                  )}
                  <div className="title-info">
                    {song.artists.map((person) => (
                      <Link
                        to={"/artist/" + person.public_id}
                        key={person.public_id}
                      >
                        {person.name + " "}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="duration">{song.duration}</div>
              </div>
            ))}
          </div>
          <div className="heading-section">
            <div className="heading">
              <b>Albums</b>
            </div>
          </div>
          <div className="medium-thumbnails">
            {albums.map((album) => (
              <MediumThumbnail
                item={album}
                key={album.public_id}
                content_type={"album"}
              />
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
  const [artists, setArtists] = useState([]);
  const { isPlaying, playing } = useSelector((state) => state.play);
  const dispatch = useDispatch();

  useEffect(() => {
    getItem();
  }, []);

  const handlePlayButton = () => {
    if (playing.source_id != item.public_id) {
      const qsongs =
        item.songs?.map((song) => ({
          ...song,
          source_id: item.public_id,
          source_type: "album",
        })) || [];
      dispatch(setPlaying(qsongs[0]));
      dispatch(setIsPlaying(true));
      dispatch(setQueue(qsongs));
    } else {
      dispatch(setIsPlaying(!isPlaying));
    }
  };

  const getItem = () => {
    api
      .get(`/api/album/${album_id}`)
      .then((res) => res.data)
      .then((data) => {
        setItem(data);
        setSongs(data.songs);
        setArtists(data.artists);
        console.log(data);
      })
      .catch((err) => alert(err));
  };
  return (
    <div className="body">
      <Header destination="Album Info" />
      <div className="info-page">
        <div className="thumbnail-section">
          <div className="large-thumbnail">
            <img src={item.thumbnail_url} className="large-thumbnail-image" />
          </div>
          {artists.map((person) => (
            <div className="artist-item" key={person.public_id}>
              <div className="artist-item-thumbnail">
                <img
                  src={person.profile_image_url}
                  alt=""
                  className="artist-item-image"
                />
              </div>
              <div className="artist-item-info">
                <div className="artist-item-name">
                  <Link to={"/artist/" + person.public_id}>
                    <b>{person.name}</b>
                  </Link>
                </div>
                <div className="role">{person.role}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="info-section">
          <div className="song-name">{item.title}</div>
          <div className="title-desc">
            {item.is_explicit ? <IconSVG>{ExplicitIcon}</IconSVG> : ""}
            {item.release_type} • {item.release_date} • {songs.length}
            {songs.length === 1 ? " song" : " songs"} • {item.duration}
            {item.analytics && <>{item.analytics.play_count} plays</>}
          </div>
          <div className="options">
            <div className="controls">
              <button
                className="controls-button play-pause"
                onClick={handlePlayButton}
              >
                <IconSVG>
                  {isPlaying && playing.source_id === item.public_id
                    ? PauseIcon
                    : PlayIcon}
                </IconSVG>
              </button>
            </div>
            <div className="controls">
              <button className="controls-button">
                <IconSVG>
                  {item.interactions?.some(
                    (interaction) => interaction.interaction_type === "Save"
                  )
                    ? CheckPlaylistIcon
                    : AddToPlaylistIcon}
                </IconSVG>
              </button>
            </div>
            <div className="controls">
              <button className="controls-button">
                <IconSVG>
                  {item.interactions?.some(
                    (interaction) => interaction.interaction_type === "Like"
                  )
                    ? FilledLikeIcon
                    : LikeIcon}
                </IconSVG>
              </button>
            </div>
          </div>
          <div className="song-list">
            {songs.map((song) => (
              <div className="song-item" key={song.public_id}>
                <div className="order">{song.order}</div>
                <div className="song-item-thumbnail-section">
                  <div className="song-item-thumbnail">
                    <img
                      src={song.thumbnail_url}
                      alt=""
                      className="song-item-image"
                    />
                  </div>
                  <div
                    className="overlay"
                    onClick={() => {
                      if (
                        playing.public_id != song.public_id ||
                        playing.source_id != item.public_id
                      ) {
                        const qsongs =
                          item.songs?.map((song) => ({
                            ...song,
                            source_id: item.public_id,
                            source_type: "album",
                          })) || [];
                        const currentIndex = qsongs.findIndex(
                          (item) => item.public_id === song.public_id
                        );
                        console.log(currentIndex);
                        if (currentIndex != 0 && currentIndex < qsongs.length) {
                          dispatch(setPlaying(qsongs[currentIndex]));
                          dispatch(setIsPlaying(true));
                        } else {
                          dispatch(setPlaying(qsongs[0]));
                          dispatch(setIsPlaying(true));
                        }
                        dispatch(setQueue(qsongs));
                      } else {
                        dispatch(setIsPlaying(!isPlaying));
                      }
                    }}
                  >
                    <button className="controls-button play-pause">
                      <IconSVG>
                        {isPlaying &&
                        playing.source_id === item.public_id &&
                        playing.public_id === song.public_id
                          ? PauseIcon
                          : PlayIcon}
                      </IconSVG>
                    </button>
                  </div>
                </div>
                <div className="title-section">
                  <div className="title">
                    <Link to={"/song/" + song.public_id}>
                      <b>{song.title}</b>
                    </Link>
                  </div>
                  {song.analytics && (
                    <div className="title-info">
                      {song.analytics.play_count} plays
                    </div>
                  )}
                  <div className="title-info">
                    {song.artists.map((person) => (
                      <Link
                        to={"/artist/" + person.public_id}
                        key={person.public_id}
                      >
                        {person.name + " "}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="duration">{song.duration}</div>
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
  // const { playing, setPlaying, isPlaying, setIsPlaying, queue, setQueue } =
  //   useContext(PlayingContext);
  const { isPlaying, playing } = useSelector((state) => state.play);
  const dispatch = useDispatch();

  useEffect(() => {
    getItem();
  }, []);

  const handlePlayButton = async () => {
    if (playing.source_id != item.public_id) {
      const qsongs =
        item.songs?.map((song) => ({
          ...song,
          source_id: item.public_id,
          source_type: "playlist",
        })) || [];
      // console.log(qsongs);
      dispatch(setPlaying(qsongs[0]));
      dispatch(setIsPlaying(true));
      dispatch(setQueue(qsongs));
    } else {
      dispatch(setIsPlaying(!isPlaying));
    }
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
      <div className="info-page">
        <div className="thumbnail-section">
          <div className="large-thumbnail">
            <img src={item.thumbnail_url} className="large-thumbnail-image" />
          </div>
          {/* <div className="title-desc">{item.created_at}</div>
          <div className="title-desc">{item.last_updated}</div> */}
        </div>
        <div className="info-section">
          <div className="song-name">{item.title}</div>
          <div className="title-desc">{item.description}</div>
          <div className="title-desc">
            {songs.length}
            {songs.length === 1 ? " song" : " songs"} • {item.duration} •{" "}
            {item.analytics && <>{item.analytics.play_count} plays</>}
          </div>
          <div className="options">
            <div className="controls">
              <button
                className="controls-button play-pause"
                onClick={handlePlayButton}
              >
                <IconSVG>
                  {isPlaying && playing.source_id === item.public_id
                    ? PauseIcon
                    : PlayIcon}
                </IconSVG>
              </button>
            </div>
            <div className="controls">
              <button className="controls-button">
                <IconSVG>{LikeIcon}</IconSVG>
              </button>
            </div>
            <div className="controls">
              <button className="controls-button">
                <IconSVG>{QueueIcon}</IconSVG>
              </button>
            </div>
          </div>
          <div className="song-list">
            <div className="song-item heading">
              <div className="order">#</div>
              <div className="song-item-thumbnail-section">Song</div>
              <div className="title-section"></div>
              <div className="duration">duration</div>
            </div>
            {songs.map((song) => (
              <div className="song-item" key={song.public_id}>
                <div className="order">{song.order}</div>
                <div className="song-item-thumbnail-section">
                  <div className="song-item-thumbnail">
                    <img
                      src={song.thumbnail_url}
                      alt=""
                      className="song-item-image"
                    />
                  </div>
                  <div
                    className="overlay"
                    onClick={() => {
                      if (
                        playing.public_id != song.public_id ||
                        playing.source_id != item.public_id
                      ) {
                        const qsongs =
                          item.songs?.map((song) => ({
                            ...song,
                            source_id: item.public_id,
                            source_type: "album",
                          })) || [];
                        const currentIndex = qsongs.findIndex(
                          (item) => item.public_id === song.public_id
                        );
                        console.log(currentIndex);
                        if (currentIndex != 0 && currentIndex < qsongs.length) {
                          dispatch(setPlaying(qsongs[currentIndex]));
                          dispatch(setIsPlaying(true));
                        } else {
                          dispatch(setPlaying(qsongs[0]));
                          dispatch(setIsPlaying(true));
                        }
                        dispatch(setQueue(qsongs));
                      } else {
                        dispatch(setIsPlaying(!isPlaying));
                      }
                    }}
                  >
                    <button className="controls-button play-pause">
                      <IconSVG>
                        {isPlaying &&
                        playing.source_id === item.public_id &&
                        playing.public_id === song.public_id
                          ? PauseIcon
                          : PlayIcon}
                      </IconSVG>
                    </button>
                  </div>
                </div>
                <div className="title-section">
                  <div className="title">
                    <Link to={"/song/" + song.public_id}>
                      <b>{song.title}</b>
                    </Link>
                  </div>
                  {song.analytics && (
                    <div className="title-info">
                      {song.analytics.play_count} plays
                    </div>
                  )}
                  <div className="title-info">
                    {song.artists.map((person) => (
                      <Link
                        to={"/artist/" + person.public_id}
                        key={person.public_id}
                      >
                        {person.name + " "}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="duration">{song.duration}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
