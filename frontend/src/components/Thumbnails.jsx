// import PlayingContext from "../contexts/PlayingContext";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { MenuContext } from "./Menu";
import { IconSVG, PlayIcon, PauseIcon } from "../assets/Icons";
import { useDispatch, useSelector } from "react-redux";
import { setIsPlaying, setPlaying, setQueue } from "../store/playSlice";

export function GridThumbnail({ item }) {
  // const { playing, setPlaying, isPlaying, setIsPlaying } =
  //   useContext(PlayingContext);
  const { isPlaying, playing } = useSelector((state) => state.play);

  const handlePlayButton = () => {
    if (!playing) {
      setPlaying(item);
      setIsPlaying(true);
    } else if (playing && playing.public_id === item.public_id) {
      setIsPlaying(!isPlaying);
    } else {
      setPlaying(item);
      setIsPlaying(true);
    }
  };
  return (
    <div className="info">
      <div className="thumbnail-section">
        <div className="thumbnail">
          <img src={item.thumbnail_url} alt="" className="thumbnail-image" />
        </div>
        <div className="overlay" onClick={handlePlayButton}>
          <button className="controls-button play-pause">
            <IconSVG>
              {isPlaying && playing.public_id === item.public_id
                ? PauseIcon
                : PlayIcon}
            </IconSVG>
          </button>
        </div>
      </div>
      <div className="title-section">
        <div className="title">
          <Link to={"/song/" + item.public_id}>
            <b>{item.title}</b>
          </Link>
        </div>
        <div className="title-info">
          {item.artists.map((person) => (
            <Link to={"/artist/" + person.public_id} key={person.public_id}>
              {person.name + " "}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MediumThumbnail({ item }) {
  // const { playing, setPlaying, isPlaying, setIsPlaying } =
  //   useContext(PlayingContext);
  const { isPlaying, playing } = useSelector((state) => state.play);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(item);
  }, []);

  const handlePlayButton = () => {
    // if (!playing) {
    //   dispatch(setPlaying(item));
    //   dispatch(setIsPlaying(true));
    // } else if (playing && playing.public_id === item.public_id) {
    //   dispatch(setIsPlaying(!isPlaying));
    // } else {
    //   dispatch(setPlaying(item));
    //   dispatch(setIsPlaying(true));
    // }
    if (
      playing?.source_id != item.public_id ||
      playing?.public_id != item.public_id
    ) {
      let song = { ...item };
      // console.log(song);
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
    <div className="info">
      <div className="thumbnail-section">
        <div className="thumbnail">
          <img src={item.thumbnail_url} alt="" className="thumbnail-image" />
        </div>
        <div className="overlay" onClick={handlePlayButton}>
          <button className="controls-button play-pause">
            <IconSVG>
              {isPlaying &&
              playing.public_id === item.public_id &&
              playing.source_id === item.public_id
                ? PauseIcon
                : PlayIcon}
            </IconSVG>
          </button>
        </div>
      </div>
      <div className="title-section">
        <div className="title">
          <Link to={"/song/" + item.public_id}>
            <b>{item.title}</b>
          </Link>
        </div>
        <div className="title-info">
          {item.artists.map((person) => (
            <Link to={"/artist/" + person.public_id} key={person.public_id}>
              {person.name + " "}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MediumThumbnailx({ item, content_type }) {
  // const { playing, setPlaying, isPlaying, setIsPlaying } =
  //   useContext(PlayingContext);
  const { isPlaying, playing } = useSelector((state) => state.play);

  useEffect(() => {
    console.log(item);
  }, []);

  const handlePlayButton = () => {
    if (!playing) {
      setPlaying(item);
      setIsPlaying(true);
    } else if (playing && playing.public_id === item.public_id) {
      setIsPlaying(!isPlaying);
    } else {
      setPlaying(item);
      setIsPlaying(true);
    }
  };

  return (
    <div className="info">
      <div className="thumbnail-section">
        <div className="thumbnail">
          <img src={item.thumbnail_url} alt="" className="thumbnail-image" />
        </div>
        <div className="overlay" onClick={handlePlayButton}>
          <button className="controls-button play-pause">
            <IconSVG>
              {isPlaying &&
              playing.public_id === item.public_id &&
              playing.source_id === item.public_id
                ? PauseIcon
                : PlayIcon}
            </IconSVG>
          </button>
        </div>
      </div>
      <div className="title-section">
        <div className="title">
          <Link to={"/song/" + item.public_id}>
            <b>{item.title}</b>
          </Link>
        </div>
        <div className="title-info">
          {item.artists.map((person) => (
            <Link to={"/artist/" + person.public_id} key={person.public_id}>
              {person.name + " "}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AlbumThumbnail({ item }) {
  // const { playing, setPlaying, isPlaying, setIsPlaying, queue, setQueue } =
  //   useContext(PlayingContext);
  const { isPlaying, playing } = useSelector((state) => state.play);
  // const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const handlePlayButton = async () => {
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
  return (
    <div className="info">
      <div className="thumbnail-section">
        <div className="thumbnail">
          <img src={item.thumbnail_url} alt="" className="thumbnail-image" />
        </div>
        <div className="overlay" onClick={handlePlayButton}>
          <button className="controls-button play-pause">
            <IconSVG>
              {isPlaying && playing.source_id === item.public_id
                ? PauseIcon
                : PlayIcon}
            </IconSVG>
          </button>
        </div>
      </div>
      <div className="title-section">
        <div className="title">
          <Link to={"/album/" + item.public_id}>
            <b>{item.title}</b>
          </Link>
        </div>
        <div className="title-info">{item.release_type}</div>
        <div className="title-info">
          {item.artists.map((person) => (
            <Link to={"/artist/" + person.public_id} key={person.public_id}>
              {person.name + " "}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PlaylistThumbnail({ item }) {
  // const { playing, setPlaying, isPlaying, setIsPlaying, queue, setQueue } =
  //   useContext(PlayingContext);
  const { isPlaying, playing } = useSelector((state) => state.play);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const handlePlayButton = async () => {
    try {
      const response = await api.get(`api/playlist/${item.public_id}`);
      dispatch(setQueue(response.data.songs));
      dispatch(setPlaying(response.data.songs[0]));
      dispatch(setIsPlaying(true));
    } catch (err) {
      alert(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="info">
      <div className="thumbnail-section">
        <div className="thumbnail">
          <img src={item.cover_image_url} alt="" className="thumbnail-image" />
        </div>
        <div className="overlay" onClick={handlePlayButton}>
          <button className="controls-button play-pause">
            <IconSVG>{isPlaying ? PauseIcon : PlayIcon}</IconSVG>
          </button>
        </div>
      </div>
      <div className="title-section">
        <div className="title">
          <Link to={"/playlist/" + item.public_id}>
            <b>{item.name}</b>
          </Link>
        </div>
        <div className="title-info">{/* Playlist info if needed */}</div>
      </div>
    </div>
  );
}

export function ArtistThumbnail({ item }) {
  return (
    <div className="info">
      <div className="artist-thumbnail-section">
        <div className="thumbnail">
          <img src={item.profile_image_url} alt="" className="artist-image" />
        </div>
      </div>
      <div className="artist-title-section">
        <div className="artist-title">
          <Link to={"/artist/" + item.public_id}>
            <b>{item.name}</b>
          </Link>
        </div>
        <div className="artist-info"></div>
      </div>
    </div>
  );
}
