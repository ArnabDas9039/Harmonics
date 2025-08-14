import { useContext, useEffect, useRef, useState } from "react";
import parseLrc from "lrc-parser";
import "../styles/PlayingWidget.css";
import "../styles/General.css";
import "../styles/Feed.css";
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
  DislikeIcon,
  FilledLikeIcon,
  CheckPlaylistIcon,
  QueueIcon,
  LyricsIcon,
} from "../assets/Icons";
import PlaylistCheck from "./PlaylistCheck";
import { SmallThumbnail } from "./Thumbnails";

function PlayingWidget() {
  const audioRef = useRef(null);

  const { isPlaying, playing, queue } = useSelector((state) => state.play);
  const dispatch = useDispatch();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [repeat, setRepeat] = useState(false);
  const hasLoggedPlayRef = useRef(false);
  const thresholdRef = useRef(null);

  const [showPlayingPage, setShowPlayingPage] = useState(false);

  const [activeTab, setActiveTab] = useState("Queue");
  const [showSection, setShowSection] = useState(true);

  const [showPlaylistCheck, setShowPlaylistCheck] = useState(false);

  const lyricsContainerRef = useRef(null);
  const [lrcText, setLrcText] = useState("");
  const [lyrics, setLyrics] = useState([]);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);

  useEffect(() => {
    hasLoggedPlayRef.current = false;
    thresholdRef.current = null;
    lyricsContainerRef.current = null;
  }, [playing.public_id]);

  const getLyrics = async () => {
    try {
      const response = await api.get(playing.lyrics_url);
      // console.log(response.data);
      setLrcText(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getLyrics();
  }, [playing]);

  useEffect(() => {
    if (!lrcText) return;
    try {
      const parsed = parseLrc(lrcText)?.scripts || [];
      if (Array.isArray(parsed)) {
        setLyrics(parsed);
      } else {
        console.error("Parsed lyrics is not an array:", parsed);
        setLyrics([]);
      }
    } catch (error) {
      console.error("Error parsing lyrics:", error);
      setLyrics([]);
    }
  }, [lrcText]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!audioRef.current) return;
      const currentTime = audioRef.current.currentTime;
      const index = lyrics.findIndex((line, i) =>
        i === lyrics.length - 1 ? true : currentTime < lyrics[i + 1].start
      );

      if (index !== -1 && index !== currentLyricIndex) {
        // console.log(index);
        setCurrentLyricIndex(index);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [lyrics, currentLyricIndex]);

  useEffect(() => {
    const container = lyricsContainerRef.current;
    const activeLine = container?.querySelector(".active");
    if (activeLine && container) {
      container.scrollTo({
        top: activeLine.offsetTop - container.clientHeight / 2 + 20,
        behavior: "smooth",
      });
    }
  }, [currentLyricIndex]);

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
          console.log(err);
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

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
      const response = await api.post("api/interact/toggle/", {
        content_type: "song",
        object_id: playing.public_id,
        interaction_type: "Like",
      });
      console.log(response);
      const currentInteractions = playing.interactions || [];
      let updatedInteractions;

      if (response.data.detail === "Added") {
        updatedInteractions = [
          ...currentInteractions,
          { interaction_type: response.data.interaction_type },
        ];
      } else if (response.data.detail === "Removed") {
        updatedInteractions = currentInteractions.filter(
          (item) => item.interaction_type !== "Like"
        );
      }
      const updatedPlaying = {
        ...playing,
        interactions: updatedInteractions,
      };
      dispatch(setPlaying(updatedPlaying));
    } catch (err) {
      alert(err);
    }
  };
  const handleSave = async () => {
    setShowPlaylistCheck(true);
    // try {
    //   const response = await api.post("api/interact/", {
    //     content_type: "song",
    //     object_id: playing.public_id,
    //     interaction_type: "Save",
    //   });
    //   if (response.status === 201) {
    //     const currentInteractions = playing.interactions || [];

    //     const updatedPlaying = {
    //       ...playing,
    //       interactions: [...currentInteractions, response.data],
    //     };

    //     dispatch(setPlaying(updatedPlaying));
    //   }
    // } catch (err) {
    //   alert(err);
    // }
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

    if (!hasLoggedPlayRef.current && duration && !isNaN(duration)) {
      const threshold = thresholdRef.current || Math.min(30, duration * 0.3);
      thresholdRef.current = threshold;

      if (audioRef.current.currentTime >= threshold) {
        try {
          const response = api.post("/api/interact/", {
            content_type: "song",
            object_id: playing.public_id,
            interaction_type: "Play",
          });
          if ((response.status = 201)) {
            hasLoggedPlayRef.current = true;
          }
        } catch (err) {
          console.error("Failed to log history:", err);
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (event) => {
    const seekTime = (event.target.value / 100) * duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleLyricJump = (line) => {
    console.log(line);
    const jumpTime = line.start;
    audioRef.current.currentTime = jumpTime;
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
          {showPlaylistCheck && (
            <PlaylistCheck
              onClose={() => setShowPlaylistCheck(false)}
              currentSong={playing}
            />
          )}
          <audio
            ref={audioRef}
            src={playing && playing.file_url}
            onTimeUpdate={handleTimeUpdate}
          />
          {showPlayingPage ? (
            <div className={`playing-page ${showSection ? "active-more" : ""}`}>
              <div className="player-section">
                <div className="player-thumbnail-section">
                  <div className="player-thumbnail-mask">
                    <img
                      src={playing && playing.thumbnail_url}
                      alt=""
                      className="player-large-thumbnail-image"
                    />
                  </div>
                </div>
                <div className="player-title-section">
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
                <div className="extra-controls-section">
                  <div className="controls">
                    <button className="controls-button" onClick={handleLike}>
                      <IconSVG>
                        {playing.interactions?.some(
                          (interaction) =>
                            interaction.interaction_type === "Like"
                        )
                          ? FilledLikeIcon
                          : LikeIcon}
                      </IconSVG>
                    </button>
                  </div>
                  {/* <div className="controls">
                    <button className="controls-button" onClick={handleLike}>
                      <IconSVG>{DislikeIcon}</IconSVG>
                    </button>
                  </div> */}
                  <div className="controls">
                    <button className="controls-button" onClick={handleSave}>
                      <IconSVG>
                        {playing.interactions?.some(
                          (interaction) =>
                            interaction.interaction_type === "Save"
                        )
                          ? CheckPlaylistIcon
                          : AddToPlaylistIcon}
                      </IconSVG>
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
                  <div className="player-time">
                    <div className="playing-time">
                      {Math.floor(currentTime / 60)}:
                      {Math.floor(currentTime % 60)
                        .toString()
                        .padStart(2, "0")}{" "}
                    </div>
                    <div className="playing-time">
                      {Math.floor(duration / 60)}:
                      {Math.floor(duration % 60)
                        .toString()
                        .padStart(2, "0")}
                    </div>
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
                  <div className="controls play-btn-container">
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
              <div className="more-section">
                <div className="tab-buttons">
                  <div className="tab-btn-container">
                    <button
                      className={`tab-button ${
                        activeTab === "Queue" ? "active" : ""
                      }`}
                      onClick={() => {
                        setActiveTab("Queue");
                        if (
                          (activeTab === "Queue" && showSection) ||
                          !showSection
                        ) {
                          setShowSection(!showSection);
                        }
                      }}
                    >
                      <IconSVG>{QueueIcon}</IconSVG>
                      <div className="icon-label">Queue</div>
                    </button>
                  </div>
                  <div className="tab-btn-container">
                    <button
                      className={`tab-button ${
                        activeTab === "Lyrics" ? "active" : ""
                      }`}
                      onClick={() => {
                        setActiveTab("Lyrics");
                        if (
                          (activeTab === "Lyrics" && showSection) ||
                          !showSection
                        ) {
                          setShowSection(!showSection);
                        }
                      }}
                    >
                      <IconSVG>{LyricsIcon}</IconSVG>
                      <div className="icon-label">Lyrics</div>
                    </button>
                  </div>
                </div>
                <div className="tab-content">
                  {activeTab === "Queue" && (
                    <div className="tab-panel">
                      <div className="song-queue-list queue-thumbnails">
                        {queue?.map((song) => (
                          <div className="song-item" key={song.public_id}>
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
                                  if (playing.public_id != song.public_id) {
                                    if (
                                      currentIndex != 0 &&
                                      currentIndex < queue.length
                                    ) {
                                      dispatch(setPlaying(queue[currentIndex]));
                                      dispatch(setIsPlaying(true));
                                    } else {
                                      dispatch(setPlaying(queue[0]));
                                      dispatch(setIsPlaying(true));
                                    }
                                    dispatch(setQueue(queue));
                                  } else {
                                    dispatch(setIsPlaying(!isPlaying));
                                  }
                                }}
                              >
                                <button className="controls-button play-pause">
                                  <IconSVG>
                                    {isPlaying &&
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
                  )}
                  {activeTab === "Lyrics" && (
                    <div className="tab-panel">
                      {lyrics && (
                        <div
                          className="lyrics-container"
                          ref={lyricsContainerRef}
                        >
                          {lyrics.map((line, index) => (
                            <div
                              key={index}
                              className={`lyric-line ${
                                index === currentLyricIndex ? "active" : ""
                              }`}
                              onClick={() => handleLyricJump(line)}
                            >
                              {line.text}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="playing-widget">
              <div className="widget-left-section">
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
              <div className="widget-center-section">
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
                  <div className="controls play-pause-controls">
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
                <div className="seek-bar-section">
                  <div className="playing-time left">
                    {Math.floor(currentTime / 60)}:
                    {Math.floor(currentTime % 60)
                      .toString()
                      .padStart(2, "0")}{" "}
                  </div>
                  <div className="seek-bar">
                    <SeekBar
                      min="0"
                      max="100"
                      value={String((currentTime / duration) * 100)}
                      onChange={handleSeek}
                      played={(currentTime / duration) * 100}
                    />
                  </div>
                  <div className="playing-time right">
                    {Math.floor(duration / 60)}:
                    {Math.floor(duration % 60)
                      .toString()
                      .padStart(2, "0")}
                  </div>
                </div>
              </div>
              <div className="widget-right-section">
                <div className="controls">
                  <button className="controls-button" onClick={handleLike}>
                    <IconSVG>
                      {playing.interactions?.some(
                        (interaction) => interaction.interaction_type === "Like"
                      )
                        ? FilledLikeIcon
                        : LikeIcon}
                    </IconSVG>
                  </button>
                </div>
                <div className="controls">
                  <button className="controls-button" onClick={handleSave}>
                    <IconSVG>
                      {playing.interactions?.some(
                        (interaction) => interaction.interaction_type === "Save"
                      )
                        ? CheckPlaylistIcon
                        : AddToPlaylistIcon}
                    </IconSVG>
                  </button>
                </div>
                <div className="controls">
                  <button
                    className="controls-button"
                    onClick={() => {
                      setShowPlayingPage(true);
                      setActiveTab("Queue");
                    }}
                  >
                    <IconSVG>{QueueIcon}</IconSVG>
                  </button>
                </div>
                <div className="controls">
                  <button
                    className="controls-button"
                    onClick={() => {
                      setShowPlayingPage(true);
                      setActiveTab("Lyrics");
                    }}
                  >
                    <IconSVG>{LyricsIcon}</IconSVG>
                  </button>
                </div>
                <div className="controls arrow">
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
