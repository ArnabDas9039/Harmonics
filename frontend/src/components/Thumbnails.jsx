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
          {item.artists?.map((person) => (
            <Link to={"/artist/" + person.public_id} key={person.public_id}>
              {person.name + " "}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MediumThumbnail({ item, content_type }) {
  const { isPlaying, playing } = useSelector((state) => state.play);
  const dispatch = useDispatch();

  const handlePlayButton = () => {
    if (
      playing?.source_id != item.public_id ||
      playing?.public_id != item.public_id
    ) {
      if (content_type !== "song") {
        const qsongs =
          item.songs?.map((song) => ({
            ...song,
            source_id: item.public_id,
            source_type: content_type,
          })) || [];
        dispatch(setPlaying(qsongs[0]));
        dispatch(setQueue(qsongs));
      } else {
        let song = { ...item };
        song.source_id = song.public_id;
        song.source_type = content_type;
        dispatch(setPlaying(song));
        dispatch(setQueue([]));
      }
      dispatch(setIsPlaying(true));
    } else {
      dispatch(setIsPlaying(!isPlaying));
    }
  };

  return (
    <div className={`info ${content_type}`}>
      <div className={`thumbnail-section ${content_type}`}>
        <div className="thumbnail">
          {content_type === "artist" ? (
            <img src={item.profile_image_url} alt="" className="artist-image" />
          ) : (
            <img src={item.thumbnail_url} alt="" className="thumbnail-image" />
          )}
        </div>
        {content_type !== "artist" && (
          <div className="overlay" onClick={handlePlayButton}>
            <button className="controls-button play-pause">
              <IconSVG>
                {isPlaying &&
                (playing.public_id === item.public_id ||
                  content_type !== "song") &&
                playing.source_id === item.public_id
                  ? PauseIcon
                  : PlayIcon}
              </IconSVG>
            </button>
          </div>
        )}
      </div>
      <div className="title-section">
        <div className={`${content_type}-title`}>
          <Link to={`/${content_type}/${item.public_id}`}>
            {content_type === "artist" ? (
              <b>{item.name}</b>
            ) : (
              <b>{item.title}</b>
            )}
          </Link>
        </div>
        {content_type === "artist" ? (
          <div className="artist-thumbnail-info">
            {item.analytics?.save_count} followers
          </div>
        ) : (
          <>
            <div className="title-info">
              {content_type === "album" ? (
                <>
                  {item.release_type} • {item.release_date}
                </>
              ) : (
                <>
                  {content_type}
                  {content_type === "playlist" && (
                    <>
                      {" "}
                      • {item.analytics?.play_count} plays •{" "}
                      {item.songs?.length} tracks
                    </>
                  )}
                </>
              )}
            </div>
            <div className="title-info">
              {item.artists?.map((person) => (
                <Link to={"/artist/" + person.public_id} key={person.public_id}>
                  {person.name + " "}
                </Link>
              ))}
              {item.owner}
            </div>
          </>
        )}
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
