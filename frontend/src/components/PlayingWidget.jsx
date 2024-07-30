import { useContext, useEffect, useRef, useState } from "react";
import "../styles/PlayingWidget.css";
import "../styles/General.css";
import PlayingContext from "../contexts/PlayingContext";
import SeekBar from "./SeekBar";
import api from "../api";
import RoomContext from "../contexts/RoomContext";
import { GridThumbnail } from "./Thumbnails";
import { Link } from "react-router-dom";

function PlayingWidget() {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { playing, setPlaying, isPlaying, setIsPlaying, queue, setQueue } =
    useContext(PlayingContext);
  const { roomId, currentSong, syncTime, setSyncTime, isHost } =
    useContext(RoomContext);
  const [showPlayingPage, setShowPlayingPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  useEffect(() => {
    audioRef.current.addEventListener("play", handlePlay);
    audioRef.current.addEventListener("pause", handlePause);
    audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
    audioRef.current.addEventListener("ended", handleSongEnd);

    handlePlayPause();

    if (isHost) {
      setSyncTime(currentTime);
    }

    return () => {
      audioRef.current.removeEventListener("play", handlePlay);
      audioRef.current.removeEventListener("pause", handlePause);
      audioRef.current.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );
      audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [playing, isPlaying]);

  useEffect(() => {
    const fetchRadio = async () => {
      try {
        const response = await api.get("api/radio/");
        console.log(response.data[0]);
        setQueue(response.data[0].results);
      } catch (err) {
        alert(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRadio();
    // console.log(queue.results);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      // handleHistory();
    }
    if (isHost && roomId) {
      const update = async () => {
        try {
          const res = await api.put(`api/room/${roomId}/update/`, {
            song_id: playing.id,
          });
          console.log(res);
        } catch (err) {
          alert(err);
        }
      };

      update();
    }
  }, [playing]);

  // useEffect(() => {
  //   if (!isHost) {
  //     console.log(typeof syncTime);
  //     audioRef.current.currentTime = syncTime;
  //     console.log(audioRef.current.currentTime);
  //     // setIsPlaying(true);
  //   }
  // }, [syncTime]);

  useEffect(() => {
    if (!isHost && audioRef.current) {
      console.log("Setting currentTime to syncTime:", syncTime);

      const handleSyncTime = () => {
        if (audioRef.current.readyState === 4) {
          // Ensure the audio is ready to play
          audioRef.current.currentTime = syncTime;
          console.log(
            "Audio currentTime set to:",
            audioRef.current.currentTime
          );
        } else {
          console.log("Audio not ready, waiting for canplay event");
          audioRef.current.addEventListener(
            "canplaythrough",
            () => {
              audioRef.current.currentTime = syncTime;
              console.log(
                "Audio currentTime set to (canplay):",
                audioRef.current.currentTime
              );
            },
            { once: true }
          );
        }
      };

      handleSyncTime();
    }
  }, [syncTime, isHost]);

  const handleSongEnd = () => {
    handleNextSong();
  };

  const handleNextSong = () => {
    const currentIndex = queue.findIndex((item) => item.id === playing.id);
    if (currentIndex !== -1 && currentIndex < queue.length - 1) {
      setPlaying(queue[currentIndex + 1]);
      setIsPlaying(true);
    } else {
      // Optionally handle the case where the next song does not exist
      console.log("No next song available");
    }
  };

  // useEffect(() => {
  //   if (playing && isPlaying) {
  //     // setIsPlaying(true);
  //     // Set a timer to trigger the handleHistory function after 5 seconds
  //     const newTimer = setTimeout(() => {
  //       console.log(playing);
  //       handleHistory();
  //     }, 5000); // 5000 milliseconds = 5 seconds
  //     setTimer(newTimer);
  //   } else {
  //     // Clear the timer if the song stops playing before 5 seconds
  //     if (timer) {
  //       clearTimeout(timer);
  //       setTimer(null);
  //     }
  //   }

  //   // Cleanup timer on component unmount or when the song changes
  //   return () => {
  //     if (timer) {
  //       clearTimeout(timer);
  //     }
  //   };
  // }, [playing]);

  const handleHistory = async () => {
    try {
      await api.post("api/history/post/", { song: playing.id });
    } catch (error) {
      alert(error);
    }
  };

  const handlePlayPause = () => {
    console.log(isPlaying);
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  const handlePlayButton = () => {
    console.log("Button Clicked");
    setIsPlaying(!isPlaying);
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

  const handlePlaylistAdd = async () => {
    try {
      await api.patch("api/playlist/p1/update/", { song_id: playing.id });
    } catch (error) {
      alert(error);
    }
  };

  if (isLoading) {
    return (
      <div>
        <audio
          ref={audioRef}
          src={playing && playing.file_url}
          onTimeUpdate={handleTimeUpdate}
        />
        Loading...
      </div>
    );
  }

  return (
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
                  src={playing && playing.cover_image_url}
                  alt=""
                  className="large-thumbnail-image"
                />
              </div>
              <div className="left-title-section">
                <div className="title">
                  <b>{playing && playing.title}</b>
                  {/* {isPlaying ?  : "Nothing is playing"} */}
                </div>
                <div className="title-info"></div>
              </div>
            </div>
            <div className="seek-bar-section">
              {/* {isPlaying ? ( */}
              <div className="seek-bar">
                <SeekBar
                  min="0"
                  max="100"
                  value={String((currentTime / duration) * 100)}
                  onChange={handleSeek}
                />
              </div>
              <div>
                {Math.floor(currentTime / 60)}:
                {Math.floor(currentTime % 60)
                  .toString()
                  .padStart(2, "0")}{" "}
                /{Math.floor(duration / 60)}:
                {Math.floor(duration % 60)
                  .toString()
                  .padStart(2, "0")}
              </div>
              {/* ) : ( */}
              {/* )} */}
            </div>
            <div className="extra-controls-section">
              <div className="controls">
                <button className="controls-button">
                  <img
                    src="http://127.0.0.1:8000/api/static/icons/Like.svg"
                    alt=""
                    className="controls-button-icon"
                  />
                </button>
              </div>
              <div className="controls">
                <button className="controls-button">
                  <img
                    src="http://127.0.0.1:8000/api/static/icons/Share.svg"
                    alt=""
                    className="controls-button-icon"
                  />
                </button>
              </div>
              <div className="controls">
                <button className="controls-button">
                  <img
                    src="http://127.0.0.1:8000/api/static/icons/Playlist_add.svg"
                    alt=""
                    className="controls-button-icon"
                  />
                </button>
              </div>
              <div className="controls">
                <button className="controls-button" onClick={handlearrowbutton}>
                  <img
                    src="http://127.0.0.1:8000/api/static/icons/Arrow_up.svg"
                    alt=""
                    className="controls-button-icon"
                  />
                </button>
              </div>
            </div>
            <div className="controls-section">
              <div className="controls">
                <button className="controls-button">
                  <img
                    src="http://127.0.0.1:8000/api/static/icons/Shuffle.svg"
                    alt=""
                    className="controls-button-icon"
                  />
                </button>
              </div>
              <div className="controls">
                <button className="controls-button">
                  <img
                    src="http://127.0.0.1:8000/api/static/icons/Skip_previous.svg"
                    alt=""
                    className="controls-button-icon"
                  />
                </button>
              </div>
              <div className="controls">
                <button
                  className="controls-button play-pause"
                  onClick={handlePlayButton}
                >
                  <img
                    src={
                      isPlaying
                        ? "http://127.0.0.1:8000/api/static/icons/Pause.svg"
                        : "http://127.0.0.1:8000/api/static/icons/Play.svg"
                    }
                    alt=""
                    className="controls-button-icon"
                  />
                </button>
              </div>
              <div className="controls">
                <button className="controls-button" onClick={handleNextSong}>
                  <img
                    src="http://127.0.0.1:8000/api/static/icons/Skip_next.svg"
                    alt=""
                    className="controls-button-icon"
                  />
                </button>
              </div>
              <div className="controls">
                <button className="controls-button">
                  <img
                    src="http://127.0.0.1:8000/api/static/icons/Repeat.svg"
                    alt=""
                    className="controls-button-icon"
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="full-right-section">
            <div className="tab-switch">
              <div className="tab-items">Up Next</div>
              <div className="tab-items">Lyrics</div>
              <div className="tab-items">Related</div>
            </div>
            <div className="list"></div>
            <div className="song-list">
              {queue.map((song) => (
                <div className="song-item" key={song.id}>
                  <div className="song-item-thumbnail-section">
                    <div className="song-item-thumbnail-image">
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
                            isPlaying && playing.id === song.id
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
      ) : (
        <div className="playing-widget">
          <div className="widget-left-section">
            <div className="controls">
              <button className="controls-button">
                <img
                  src="http://127.0.0.1:8000/api/static/icons/Skip_previous.svg"
                  alt=""
                  className="controls-button-icon"
                />
              </button>
            </div>
            <div className="controls">
              <button
                className="controls-button play-pause"
                onClick={handlePlayButton}
              >
                <img
                  src={
                    isPlaying
                      ? "http://127.0.0.1:8000/api/static/icons/Pause.svg"
                      : "http://127.0.0.1:8000/api/static/icons/Play.svg"
                  }
                  alt=""
                  className="controls-button-icon"
                />
              </button>
            </div>
            <div className="controls">
              <button className="controls-button" onClick={handleNextSong}>
                <img
                  src="http://127.0.0.1:8000/api/static/icons/Skip_next.svg"
                  alt=""
                  className="controls-button-icon"
                />
              </button>
            </div>
            <div className="controls">
              <button className="controls-button">
                <img
                  src="http://127.0.0.1:8000/api/static/icons/Shuffle.svg"
                  alt=""
                  className="controls-button-icon"
                />
              </button>
            </div>
            <div className="controls">
              <button className="controls-button">
                <img
                  src="http://127.0.0.1:8000/api/static/icons/Repeat.svg"
                  alt=""
                  className="controls-button-icon"
                />
              </button>
            </div>
          </div>
          <div className="seek-bar-section">
            {/* {isPlaying ? ( */}
            <>
              <div className="seek-bar">
                <SeekBar
                  min="0"
                  max="100"
                  value={String((currentTime / duration) * 100)}
                  onChange={handleSeek}
                />
              </div>
              <div>
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
            {/* ) : ( */}
            <></>
            {/* )} */}
          </div>
          <div className="widget-center-section">
            <div className="widget-thumbnail">
              <img
                src={playing && playing.cover_image_url}
                alt=""
                className="widget-thumbnail-image"
              />
            </div>
            <div className="widget-title-section">
              <div className="title">
                {playing && playing.title}
                {/* {isPlaying ?  : "Nothing is playing"} */}
              </div>
              <div className="title-info"></div>
            </div>
          </div>
          <div className="widget-right-section">
            <div className="controls">
              <button className="controls-button">
                <img
                  src="http://127.0.0.1:8000/api/static/icons/Like.svg"
                  alt=""
                  className="controls-button-icon"
                />
              </button>
            </div>
            <div className="controls">
              <button className="controls-button">
                <img
                  src="http://127.0.0.1:8000/api/static/icons/Share.svg"
                  alt=""
                  className="controls-button-icon"
                />
              </button>
            </div>
            <div className="controls">
              <button className="controls-button" onClick={handlePlaylistAdd}>
                <img
                  src="http://127.0.0.1:8000/api/static/icons/Playlist_add.svg"
                  alt=""
                  className="controls-button-icon"
                />
              </button>
            </div>
            <div className="controls">
              <button className="controls-button" onClick={handlearrowbutton}>
                <img
                  src="http://127.0.0.1:8000/api/static/icons/Arrow_up.svg"
                  alt=""
                  className="controls-button-icon"
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayingWidget;
