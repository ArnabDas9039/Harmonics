import PlayingContext from "../contexts/PlayingContext";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export function GridThumbnail({ item }) {
  const { playing, setPlaying, isPlaying, setIsPlaying } =
    useContext(PlayingContext);

  const handlePlayButton = () => {
    if (!playing) {
      setPlaying(item);
      setIsPlaying(true);
    } else if (playing && playing.id === item.id) {
      setIsPlaying(!isPlaying);
    } else {
      setPlaying(item);
      setIsPlaying(true);
    }
    console.log(item.file_url);
  };

  return (
    <div className="info">
      <div className="thumbnail-section">
        <div className="thumbnail">
          <img src={item.cover_image_url} alt="" className="thumbnail-image" />
        </div>
        <div className="overlay" onClick={handlePlayButton}>
          <button className="controls-button play-pause">
            <img
              src={
                isPlaying && playing.id === item.id
                  ? "http://127.0.0.1:8000/api/static/icons/Pause.svg"
                  : "http://127.0.0.1:8000/api/static/icons/Play.svg"
              }
              alt=""
              className="controls-button-icon"
            />
          </button>
        </div>
      </div>
      <div className="title-section">
        <div className="title">
          <Link to={"/info/" + item.id}>
            <b>{item.title}</b>
          </Link>
        </div>
        <div className="title-info">
          {item.artist.map((person) => (
            <Link to={"/artist/" + person.id} key={person.id}>
              {person.name + " "}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MediumThumbnail({ item }) {
  const { playing, setPlaying, isPlaying, setIsPlaying } =
    useContext(PlayingContext);

  const handlePlayButton = () => {
    if (playing.id === item.id) {
      setIsPlaying(!isPlaying);
    } else {
      setPlaying(item);
      setIsPlaying(true);
    }
    console.log(item.file_url);
  };

  return (
    <div className="info">
      <div className="thumbnail-section">
        <div className="thumbnail">
          <img src={item.cover_image_url} alt="" className="thumbnail-image" />
        </div>
        <div className="overlay" onClick={handlePlayButton}>
          <button className="controls-button play-pause">
            <img
              src={
                isPlaying && playing.id === item.id
                  ? "http://127.0.0.1:8000/api/static/icons/Pause.svg"
                  : "http://127.0.0.1:8000/api/static/icons/Play.svg"
              }
              alt=""
              className="controls-button-icon"
            />
          </button>
        </div>
      </div>
      <div className="title-section">
        <div className="title">
          <Link to={"/info/" + item.id}>
            <b>{item.title}</b>
          </Link>
        </div>
        <div className="title-info">
          {item.artist.map((person) => (
            <Link to={"/artist/" + person.id} key={person.id}>
              {person.name + " "}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PlaylistThumbnail({ item }) {
  const { playing, setPlaying, isPlaying, setIsPlaying, queue, setQueue } =
    useContext(PlayingContext);
  const [isLoading, setIsLoading] = useState(true);

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
    // if (playing.id === .id) {
    //   setIsPlaying(!isPlaying);
    // } else {
    //   setPlaying(item);
    //   setIsPlaying(true);
    // }
    console.log(item.file_url);
  };

  return (
    <div className="info">
      <div className="thumbnail-section">
        <div className="thumbnail">
          <img src={item.cover_image_url} alt="" className="thumbnail-image" />
        </div>
        <div className="overlay" onClick={handlePlayButton}>
          <button className="controls-button play-pause">
            <img
              src={
                isPlaying && playing.id === item.id
                  ? "http://127.0.0.1:8000/api/static/icons/Pause.svg"
                  : "http://127.0.0.1:8000/api/static/icons/Play.svg"
              }
              alt=""
              className="controls-button-icon"
            />
          </button>
        </div>
      </div>
      <div className="title-section">
        <div className="title">
          <Link to={"/playlist/" + item.id}>
            <b>{item.name}</b>
          </Link>
        </div>
        <div className="title-info">
          {/* {item.artist.map((person) => (
            <Link to={"/artist/" + person.id} key={person.id}>
              {person.name + " "}
            </Link>
          ))} */}
        </div>
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
        {/* <div className="overlay"><button className="overlay-button"></button></div> */}
      </div>
      <div className="artist-title-section">
        <div className="artist-title">
          <Link to={"/artist/" + item.id}>
            <b>{item.name}</b>
          </Link>
        </div>
        <div className="artist-info"></div>
      </div>
    </div>
  );
}
