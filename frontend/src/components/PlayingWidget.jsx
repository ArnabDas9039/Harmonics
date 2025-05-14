import { useContext, useEffect, useRef, useState } from "react";
import "../styles/PlayingWidget.css";
import "../styles/General.css";
import "../styles/Feed.css";
// import PlayingContext from "../contexts/PlayingContext";
import SeekBar from "./SeekBar";
import api from "../api";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsPlaying,
  setPlaying,
  setQueue,
  addToQueue,
} from "../store/playSlice";
import { GridThumbnail } from "./Thumbnails";
import {
  IconSVG,
  PlayIcon,
  PauseIcon,
  NextIcon,
  PreviousIcon,
  ShuffleIcon,
  RepeatIcon,
  DropdownIcon,
  UpArrowIcon,
  LikeIcon,
  AddToPlaylistIcon,
} from "../assets/Icons";

function PlayingWidget() {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // const { playing, setPlaying, isPlaying, setIsPlaying, queue, setQueue } =
  //   useContext(PlayingContext);
  const { isPlaying, playing, queue } = useSelector((state) => state.play);
  const [showPlayingPage, setShowPlayingPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [repeat, setRepeat] = useState(false);
  const [timer, setTimer] = useState(null);
  const dispatch = useDispatch();

  const handlePlay = () => dispatch(setIsPlaying(true));
  const handlePause = () => dispatch(setIsPlaying(false));

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.addEventListener("play", handlePlay);
    audioRef.current.addEventListener("pause", handlePause);
    audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
    audioRef.current.addEventListener("ended", handleSongEnd);

    handlePlayPause();

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("play", handlePlay);
        audioRef.current.removeEventListener("pause", handlePause);
        audioRef.current.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener("ended", handleSongEnd);
      }
    };
  }, [playing, isPlaying]);

  const fetchRadio = async () => {
    try {
      const response = await api.post("api/radio/post/", {
        seed: [playing.public_id],
        results: [playing.public_id],
      });
      if (response.status === 201) {
        try {
          const result = await api.get(`api/radio/${response.data.id}`);
          dispatch(setQueue(result.data.results));
        } catch (err) {
          // alert(err);
        }
      }
    } catch (err) {
      // alert(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (playing) {
      if (queue.length === 0) {
        // fetchRadio();
      }
      if (isPlaying) {
        const newTimer = setTimeout(() => {}, 10000);
        setTimer(newTimer);
      } else {
        if (timer) {
          clearTimeout(timer);
          setTimer(null);
        }
      }

      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    }
  }, [playing]);

  const handleSongEnd = () => {
    if (repeat === true) {
      setPlaying(playing);
      setIsPlaying(true);
      setRepeat(false);
    } else {
      handleNextSong();
    }
  };

  const handleNextSong = () => {
    const currentIndex = queue.findIndex(
      (item) => item.public_id === playing.public_id
    );
    if (currentIndex !== -1 && currentIndex < queue.length - 1) {
      dispatch(setPlaying(queue[currentIndex + 1]));
      dispatch(setIsPlaying(true));
    } else {
      console.log("No next song available");
    }
  };

  const handlePreviousSong = () => {
    const currentIndex = queue.findIndex(
      (item) => item.public_id === playing.public_id
    );
    if (currentIndex !== -1 && currentIndex > 0) {
      dispatch(setPlaying(queue[currentIndex - 1]));
      dispatch(setIsPlaying(true));
    } else {
      console.log("No previous song available");
    }
  };

  const handleRepeat = () => {
    setRepeat(true);
  };

  const handleLike = async () => {
    try {
      const response = api.put("api/library/post/", {
        song_id: playing.public_id,
      });
      if (response.status === 201) {
        alert("Song added to library");
      }
    } catch (err) {
      alert(err);
    }
  };

  const handleHistory = async () => {
    try {
      await api.post("api/history/post/", { song: playing.public_id });
    } catch (error) {
      alert(error);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  const handlePlayButton = () => {
    dispatch(setIsPlaying(!isPlaying));
  };

  const handlearrowbutton = () => {
    setShowPlayingPage(!showPlayingPage);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (event) => {
    const seekTime = (event.target.value / 100) * duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  if (!playing) {
    return (
      <>
        <audio ref={audioRef} />
      </>
    );
  }

  return (
    <>
      {playing && (
        <div>
          <audio
            ref={audioRef}
            src={playing && playing.file_url}
            onTimeUpdate={handleTimeUpdate}
          />
          {showPlayingPage ? (
            <div className="playing-page">
              <div className="full-left-section">
                <div className="left-thumbnail-section">
                  <div className="large-thumbnail">
                    <img
                      src={playing && playing.thumbnail_url}
                      alt=""
                      className="large-thumbnail-image"
                    />
                  </div>
                  <div className="left-title-section">
                    <div className="title">
                      <b>{playing && playing.title}</b>
                    </div>
                    <div className="title-info">
                      {playing?.artists?.map((person) => (
                        <Link
                          to={"/artist/" + person.public_id}
                          key={person.public_id}
                        >
                          {person.name + " "}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="seek-bar-section">
                  <div className="seek-bar">
                    <SeekBar
                      min="0"
                      max="100"
                      value={String((currentTime / duration) * 100)}
                      onChange={handleSeek}
                      played={(currentTime / duration) * 100}
                    />
                  </div>
                  <div className="playing-time">
                    {Math.floor(currentTime / 60)}:
                    {Math.floor(currentTime % 60)
                      .toString()
                      .padStart(2, "0")}{" "}
                    /{Math.floor(duration / 60)}:
                    {Math.floor(duration % 60)
                      .toString()
                      .padStart(2, "0")}
                  </div>
                </div>
                <div className="extra-controls-section">
                  <div className="controls">
                    <button className="controls-button" onClick={handleLike}>
                      <IconSVG>{LikeIcon}</IconSVG>
                    </button>
                  </div>
                  <div className="controls">
                    <button className="controls-button">
                      <IconSVG>{AddToPlaylistIcon}</IconSVG>
                    </button>
                  </div>
                  <div className="controls">
                    <button
                      className="controls-button"
                      onClick={handlearrowbutton}
                    >
                      <IconSVG>{DropdownIcon}</IconSVG>
                    </button>
                  </div>
                </div>
                <div className="controls-section">
                  <div className="controls">
                    <button className="controls-button">
                      <IconSVG>{ShuffleIcon}</IconSVG>
                    </button>
                  </div>
                  <div className="controls">
                    <button
                      className="controls-button"
                      onClick={handlePreviousSong}
                    >
                      <IconSVG>{PreviousIcon}</IconSVG>
                    </button>
                  </div>
                  <div className="controls">
                    <button
                      className="controls-button play-pause"
                      onClick={handlePlayButton}
                    >
                      <IconSVG>{isPlaying ? PauseIcon : PlayIcon}</IconSVG>
                    </button>
                  </div>
                  <div className="controls">
                    <button
                      className="controls-button"
                      onClick={handleNextSong}
                    >
                      <IconSVG>{NextIcon}</IconSVG>
                    </button>
                  </div>
                  <div className="controls">
                    <button className="controls-button" onClick={handleRepeat}>
                      <IconSVG>{RepeatIcon}</IconSVG>
                    </button>
                  </div>
                </div>
              </div>
              <div className="full-right-section">
                <div className="tab">Up Next</div>
                <div className="song-queue-list queue-thumbnails">
                  {queue?.map((song) => (
                    <GridThumbnail item={song} key={song.id} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="playing-widget">
              <div className="widget-left-section">
                <div className="controls">
                  <button
                    className="controls-button"
                    onClick={handlePreviousSong}
                  >
                    <IconSVG>{PreviousIcon}</IconSVG>
                  </button>
                </div>
                <div className="controls play-pause-controls">
                  <button
                    className="controls-button play-pause"
                    onClick={handlePlayButton}
                  >
                    <IconSVG>{isPlaying ? PauseIcon : PlayIcon}</IconSVG>
                  </button>
                </div>
                <div className="controls">
                  <button className="controls-button" onClick={handleNextSong}>
                    <IconSVG>{NextIcon}</IconSVG>
                  </button>
                </div>
                <div className="controls">
                  <button className="controls-button">
                    <IconSVG>{ShuffleIcon}</IconSVG>
                  </button>
                </div>
                <div className="controls">
                  <button className="controls-button" onClick={handleRepeat}>
                    <IconSVG>{RepeatIcon}</IconSVG>
                  </button>
                </div>
              </div>
              <div className="seek-bar-section">
                <>
                  <div className="seek-bar">
                    <SeekBar
                      min="0"
                      max="100"
                      value={String((currentTime / duration) * 100)}
                      onChange={handleSeek}
                      played={(currentTime / duration) * 100}
                    />
                  </div>
                  <div className="playing-time">
                    {Math.floor(currentTime / 60)}:
                    {Math.floor(currentTime % 60)
                      .toString()
                      .padStart(2, "0")}{" "}
                    /{Math.floor(duration / 60)}:
                    {Math.floor(duration % 60)
                      .toString()
                      .padStart(2, "0")}
                  </div>
                </>
              </div>
              <div className="widget-center-section">
                <div className="widget-thumbnail">
                  <img
                    src={playing && playing.thumbnail_url}
                    alt=""
                    className="widget-thumbnail-image"
                  />
                </div>
                <div className="widget-title-section">
                  <div className="title">
                    <b>{playing && playing.title}</b>
                  </div>
                  <div className="title-info">
                    {playing?.artists?.map((person) => (
                      <Link
                        to={"/artist/" + person.public_id}
                        key={person.public_id}
                      >
                        {person.name + " "}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="widget-right-section">
                <div className="controls">
                  <button className="controls-button" onClick={handleLike}>
                    <IconSVG>{LikeIcon}</IconSVG>
                  </button>
                </div>
                <div className="controls">
                  <button className="controls-button">
                    <IconSVG>{AddToPlaylistIcon}</IconSVG>
                  </button>
                </div>
                <div className="controls">
                  <button
                    className="controls-button"
                    onClick={handlearrowbutton}
                  >
                    <IconSVG>{UpArrowIcon}</IconSVG>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default PlayingWidget;
