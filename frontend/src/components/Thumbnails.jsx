import PlayingContext from "../contexts/PlayingContext";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { MenuContext } from "./Menu";

export function GridThumbnail({ item }) {
  const { playing, setPlaying, isPlaying, setIsPlaying, queue, setQueue } =
    useContext(PlayingContext);
  const [radioCreated, setRadioCreated] = useState(false);

  const createRadio = async () => {
    try {
      const response = await api.post("api/radio/post/", {
        seed: [playing.id],
        results: [playing.id],
      });
      console.log(response.data);
      setRadioCreated(true);
    } catch (err) {
      alert(err);
    }
  };

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
    if (playing && !radioCreated) {
      createRadio(item);
    }
  };

  useEffect(() => {
    setRadioCreated(false);
  }, [playing]);

  return (
    <MenuContext>
      <div className="info">
        <div className="thumbnail-section">
          <div className="thumbnail">
            <img
              src={item.cover_image_url}
              alt=""
              className="thumbnail-image"
            />
          </div>
          <div className="overlay" onClick={handlePlayButton}>
            <button className="controls-button play-pause">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="28px"
                viewBox="0 -960 960 960"
                width="28px"
                fill="var(--md-sys-color-on-background)"
              >
                {isPlaying && playing.id === item.id ? (
                  <path d="M560-240v-480h140v480H560Zm-300 0v-480h140v480H260Z" />
                ) : (
                  <path d="M360-272.31v-415.38L686.15-480 360-272.31Z" />
                )}
              </svg>
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
    </MenuContext>
  );
}

export function MediumThumbnail({ item }) {
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
  };

  return (
    <div className="info">
      <div className="thumbnail-section">
        <div className="thumbnail">
          <img src={item.cover_image_url} alt="" className="thumbnail-image" />
        </div>
        <div className="overlay" onClick={handlePlayButton}>
          <button className="controls-button play-pause">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="28px"
              viewBox="0 -960 960 960"
              width="28px"
              fill="var(--md-sys-color-on-background)"
            >
              {isPlaying && playing.id === item.id ? (
                <path d="M560-240v-480h140v480H560Zm-300 0v-480h140v480H260Z" />
              ) : (
                <path d="M360-272.31v-415.38L686.15-480 360-272.31Z" />
              )}
            </svg>
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

export function AlbumThumbnail({ item }) {
  const { playing, setPlaying, isPlaying, setIsPlaying, queue, setQueue } =
    useContext(PlayingContext);
  const [isLoading, setIsLoading] = useState(true);

  const handlePlayButton = async () => {
    try {
      const response = await api.get(`api/album/${item.id}`);
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="28px"
              viewBox="0 -960 960 960"
              width="28px"
              fill="var(--md-sys-color-on-background)"
            >
              {isPlaying ? (
                <path d="M560-240v-480h140v480H560Zm-300 0v-480h140v480H260Z" />
              ) : (
                <path d="M360-272.31v-415.38L686.15-480 360-272.31Z" />
              )}
            </svg>
          </button>
        </div>
      </div>
      <div className="title-section">
        <div className="title">
          <Link to={"/album/" + item.id}>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="28px"
              viewBox="0 -960 960 960"
              width="28px"
              fill="var(--md-sys-color-on-background)"
            >
              {isPlaying ? (
                <path d="M560-240v-480h140v480H560Zm-300 0v-480h140v480H260Z" />
              ) : (
                <path d="M360-272.31v-415.38L686.15-480 360-272.31Z" />
              )}
            </svg>
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
