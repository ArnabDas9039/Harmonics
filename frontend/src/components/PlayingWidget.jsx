import { useContext, useEffect, useRef, useState } from "react";
import "../styles/PlayingWidget.css";
import "../styles/General.css";
import "../styles/Feed.css";
import PlayingContext from "../contexts/PlayingContext";
import SeekBar from "./SeekBar";
import api from "../api";
// import RoomContext from "../contexts/RoomContext";
import { Link } from "react-router-dom";
import { GridThumbnail } from "./Thumbnails";

function PlayingWidget() {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { playing, setPlaying, isPlaying, setIsPlaying, queue, setQueue } =
    useContext(PlayingContext);
  // const { roomId, currentSong, syncTime, setSyncTime, isHost } =
  //   useContext(RoomContext);
  const [showPlayingPage, setShowPlayingPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [repeat, setRepeat] = useState(false);
  const [timer, setTimer] = useState(null);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  useEffect(() => {
    audioRef.current.addEventListener("play", handlePlay);
    audioRef.current.addEventListener("pause", handlePause);
    audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
    audioRef.current.addEventListener("ended", handleSongEnd);

    handlePlayPause();

    // if (isHost) {
    //   setSyncTime(currentTime);
    // }

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

  const fetchRadio = async () => {
    try {
      const response = await api.post("api/radio/post/", {
        seed: [playing.id],
        results: [playing.id],
      });
      if (response.status === 201) {
        try {
          const result = await api.get(`api/radio/${response.data.id}`);
          setQueue(result.data.results);
        } catch (err) {
          alert(err);
        }
      }
    } catch (err) {
      alert(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (playing) {
      if (queue.length === 0) {
        fetchRadio();
      }
      if (isPlaying) {
        const newTimer = setTimeout(() => {
          // handleHistory();
        }, 10000);
        setTimer(newTimer);
      } else {
        if (timer) {
          clearTimeout(timer);
          setTimer(null);
        }
      }

      // if (isHost && roomId) {
      //   const update = async () => {
      //     try {
      //       const res = await api.put(`api/room/${roomId}/update/`, {
      //         song_id: playing.id,
      //       });
      //       console.log(res);
      //     } catch (err) {
      //       alert(err);
      //     }
      //   };

      //   update();
      // }

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
    const currentIndex = queue.findIndex((item) => item.id === playing.id);
    if (currentIndex !== -1 && currentIndex < queue.length - 1) {
      setPlaying(queue[currentIndex + 1]);
      setIsPlaying(true);
    } else {
      // Optionally handle the case where the next song does not exist
      console.log("No next song available");
    }
  };

  const handlePreviousSong = () => {
    const currentIndex = queue.findIndex((item) => item.id === playing.id);
    if (currentIndex !== -1 && currentIndex > 0) {
      setPlaying(queue[currentIndex - 1]);
      setIsPlaying(true);
    } else {
      console.log("No previous song available");
    }
  };

  const handleRepeat = () => {
    setRepeat(true);
  };

  const handleLike = async () => {
    try {
      const response = api.put("api/library/post/song/", {
        song_id: playing.id,
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
      await api.post("api/history/post/", { song: playing.id });
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

  // const handlePlaylistAdd = async () => {
  //   try {
  //     const response = await api.patch("api/playlist/p1/update/", {
  //       song_id: playing.id,
  //     });
  //     if (response.status === 201) {
  //       alert("Song added to Defualt Playlist");
  //     }
  //   } catch (error) {
  //     alert(error);
  //   }
  // };

  if (playing === null) {
    return (
      <>
        <audio ref={audioRef} />
      </>
    );
  }

  // if (isLoading) {
  //   return (
  //     <div>
  //       <audio
  //         ref={audioRef}
  //         src={playing && playing.file_url}
  //         onTimeUpdate={handleTimeUpdate}
  //       />
  //       Loading...
  //     </div>
  //   );
  // }

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
                <div className="title-info">
                  {playing.artist.map((person) => (
                    <Link to={"/artist/" + person.id} key={person.id}>
                      {person.name + " "}
                    </Link>
                  ))}
                </div>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="28px"
                    viewBox="0 -960 960 960"
                    width="28px"
                    fill="var(--md-sys-color-on-background)"
                  >
                    <path d="M698.46-160H296.92v-440l250.77-247.69L565.38-830q5.47 5.46 9.2 14 3.73 8.54 3.73 15.69v6.31l-40.93 194h278q25.08 0 44.85 19.77Q880-560.46 880-535.38v49.23q0 5.46-1.23 11.92t-3.23 11.92L766.31-203.38q-8.23 18.46-27.69 30.92Q719.15-160 698.46-160Zm-361.54-40h361.54q8.46 0 17.31-4.62 8.85-4.61 13.46-15.38L840-480v-55.38q0-10.77-6.92-17.7-6.93-6.92-17.7-6.92H487.69L534-778.46 336.92-582.92V-200Zm0-382.92V-200v-382.92Zm-40-17.08v40H160v360h136.92v40H120v-440h176.92Z" />
                  </svg>
                </button>
              </div>
              <div className="controls">
                <button className="controls-button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="28px"
                    viewBox="0 -960 960 960"
                    width="28px"
                    fill="var(--md-sys-color-on-background)"
                  >
                    <path d="M720.09-100q-41.63 0-70.86-29.17Q620-158.33 620-200q0-7.98 1.38-16.53 1.39-8.55 4.16-16.09L315.85-415.08q-14.7 16.54-34.16 25.81Q262.23-380 240-380q-41.67 0-70.83-29.14Q140-438.28 140-479.91q0-41.63 29.17-70.86Q198.33-580 240-580q22.23 0 41.69 9.27 19.46 9.27 34.16 25.81l309.69-182.46q-2.77-7.54-4.16-16.09Q620-752.02 620-760q0-41.67 29.14-70.83Q678.28-860 719.91-860q41.63 0 70.86 29.14Q820-801.72 820-760.09q0 41.63-29.17 70.86Q761.67-660 720-660q-22.23 0-41.69-9.27-19.46-9.27-34.16-25.81L334.46-512.62q2.77 7.54 4.16 16.04 1.38 8.49 1.38 16.42 0 7.93-1.38 16.58-1.39 8.66-4.16 16.2l309.69 182.46q14.7-16.54 34.16-25.81Q697.77-300 720-300q41.67 0 70.83 29.14Q820-241.72 820-200.09q0 41.63-29.14 70.86Q761.72-100 720.09-100ZM720-700q24.69 0 42.35-17.65Q780-735.31 780-760t-17.65-42.35Q744.69-820 720-820t-42.35 17.65Q660-784.69 660-760t17.65 42.35Q695.31-700 720-700ZM240-420q24.69 0 42.35-17.65Q300-455.31 300-480t-17.65-42.35Q264.69-540 240-540t-42.35 17.65Q180-504.69 180-480t17.65 42.35Q215.31-420 240-420Zm480 280q24.69 0 42.35-17.65Q780-175.31 780-200t-17.65-42.35Q744.69-260 720-260t-42.35 17.65Q660-224.69 660-200t17.65 42.35Q695.31-140 720-140Zm0-620ZM240-480Zm480 280Z" />
                  </svg>
                </button>
              </div>
              {/* <div className="controls">
                <button className="controls-button" onClick={handlePlaylistAdd}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="28px"
                    viewBox="0 -960 960 960"
                    width="28px"
                    fill="var(--md-sys-color-on-background)"
                  >
                    <path d="M140-340v-40h280v40H140Zm0-160v-40h440v40H140Zm0-160v-40h440v40H140Zm520 480v-160H500v-40h160v-160h40v160h160v40H700v160h-40Z" />
                  </svg>
                </button>
              </div> */}
              <div className="controls">
                <button className="controls-button" onClick={handlearrowbutton}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="28px"
                    viewBox="0 -960 960 960"
                    width="28px"
                    fill="var(--md-sys-color-on-background)"
                  >
                    {showPlayingPage ? (
                      <path d="M480-360 280-560h400L480-360Z" />
                    ) : (
                      <path d="M327.69-420 480-572.31 632.31-420H327.69Z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
            <div className="controls-section">
              <div className="controls">
                <button className="controls-button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="28px"
                    viewBox="0 -960 960 960"
                    width="28px"
                    fill="var(--md-sys-color-on-background)"
                  >
                    <path d="M569.23-200v-40h124L552.38-380.85l28.54-28.53L720-270.31v-118.15h40V-200H569.23Zm-340.92 0L200-228.31 691.69-720H569.23v-40H760v188.46h-40v-120.15L228.31-200Zm147.15-357L200-732.46 227.54-760 403-584.54 375.46-557Z" />
                  </svg>
                </button>
              </div>
              <div className="controls">
                <button
                  className="controls-button"
                  onClick={handlePreviousSong}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="28px"
                    viewBox="0 -960 960 960"
                    width="28px"
                    fill="var(--md-sys-color-on-background)"
                  >
                    <path d="M269.23-295.38v-369.24h40v369.24h-40Zm421.54 0L413.85-480l276.92-184.62v369.24Z" />
                  </svg>
                </button>
              </div>
              <div className="controls">
                <button
                  className="controls-button play-pause"
                  onClick={handlePlayButton}
                >
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
              <div className="controls">
                <button className="controls-button" onClick={handleNextSong}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="28px"
                    viewBox="0 -960 960 960"
                    width="28px"
                    fill="var(--md-sys-color-on-background)"
                  >
                    <path d="M650.77-295.38v-369.24h40v369.24h-40Zm-381.54 0v-369.24L546.15-480 269.23-295.38Z" />
                  </svg>
                </button>
              </div>
              <div className="controls">
                <button className="controls-button" onClick={handleRepeat}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="28px"
                    viewBox="0 -960 960 960"
                    width="28px"
                    fill="var(--md-sys-color-on-background)"
                  >
                    {repeat ? (
                      <></>
                    ) : (
                      <path d="M292.31-120 160-252.31l132.31-132.31 28.31 28.77-83.54 83.54h455.23v-160h40v200H237.08l83.54 83.54L292.31-120Zm-64.62-407.69v-200h495.23l-83.54-83.54L667.69-840 800-707.69 667.69-575.38l-28.31-28.77 83.54-83.54H267.69v160h-40Z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="full-right-section">
            <div className="tab">Up Next</div>
            <div className="song-queue-list queue-thumbnails">
              {queue.map((song) => (
                <GridThumbnail item={song} key={song.id} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="playing-widget">
          <div className="widget-left-section">
            <div className="controls">
              <button className="controls-button" onClick={handlePreviousSong}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="28px"
                  viewBox="0 -960 960 960"
                  width="28px"
                  fill="var(--md-sys-color-on-background)"
                >
                  <path d="M269.23-295.38v-369.24h40v369.24h-40Zm421.54 0L413.85-480l276.92-184.62v369.24Z" />
                </svg>
              </button>
            </div>
            <div className="controls play-pause-controls">
              <button
                className="controls-button play-pause"
                onClick={handlePlayButton}
              >
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
            <div className="controls">
              <button className="controls-button" onClick={handleNextSong}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="28px"
                  viewBox="0 -960 960 960"
                  width="28px"
                  fill="var(--md-sys-color-on-background)"
                >
                  <path d="M650.77-295.38v-369.24h40v369.24h-40Zm-381.54 0v-369.24L546.15-480 269.23-295.38Z" />
                </svg>
              </button>
            </div>
            <div className="controls">
              <button className="controls-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="28px"
                  viewBox="0 -960 960 960"
                  width="28px"
                  fill="var(--md-sys-color-on-background)"
                >
                  <path d="M569.23-200v-40h124L552.38-380.85l28.54-28.53L720-270.31v-118.15h40V-200H569.23Zm-340.92 0L200-228.31 691.69-720H569.23v-40H760v188.46h-40v-120.15L228.31-200Zm147.15-357L200-732.46 227.54-760 403-584.54 375.46-557Z" />
                </svg>
              </button>
            </div>
            <div className="controls">
              <button className="controls-button" onClick={handleRepeat}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="28px"
                  viewBox="0 -960 960 960"
                  width="28px"
                  fill="var(--md-sys-color-on-background)"
                >
                  {repeat ? (
                    <></>
                  ) : (
                    <path d="M292.31-120 160-252.31l132.31-132.31 28.31 28.77-83.54 83.54h455.23v-160h40v200H237.08l83.54 83.54L292.31-120Zm-64.62-407.69v-200h495.23l-83.54-83.54L667.69-840 800-707.69 667.69-575.38l-28.31-28.77 83.54-83.54H267.69v160h-40Z" />
                  )}
                </svg>
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
                src={playing && playing.cover_image_url}
                alt=""
                className="widget-thumbnail-image"
              />
            </div>
            <div className="widget-title-section">
              <div className="title">
                <b>{playing && playing.title}</b>
              </div>
              <div className="title-info">
                {playing.artist.map((person) => (
                  <Link to={"/artist/" + person.id} key={person.id}>
                    {person.name + " "}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="widget-right-section">
            <div className="controls">
              <button className="controls-button" onClick={handleLike}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="28px"
                  viewBox="0 -960 960 960"
                  width="28px"
                  fill="var(--md-sys-color-on-background)"
                >
                  <path d="M698.46-160H296.92v-440l250.77-247.69L565.38-830q5.47 5.46 9.2 14 3.73 8.54 3.73 15.69v6.31l-40.93 194h278q25.08 0 44.85 19.77Q880-560.46 880-535.38v49.23q0 5.46-1.23 11.92t-3.23 11.92L766.31-203.38q-8.23 18.46-27.69 30.92Q719.15-160 698.46-160Zm-361.54-40h361.54q8.46 0 17.31-4.62 8.85-4.61 13.46-15.38L840-480v-55.38q0-10.77-6.92-17.7-6.93-6.92-17.7-6.92H487.69L534-778.46 336.92-582.92V-200Zm0-382.92V-200v-382.92Zm-40-17.08v40H160v360h136.92v40H120v-440h176.92Z" />
                </svg>
              </button>
            </div>
            <div className="controls">
              <button className="controls-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="28px"
                  viewBox="0 -960 960 960"
                  width="28px"
                  fill="var(--md-sys-color-on-background)"
                >
                  <path d="M720.09-100q-41.63 0-70.86-29.17Q620-158.33 620-200q0-7.98 1.38-16.53 1.39-8.55 4.16-16.09L315.85-415.08q-14.7 16.54-34.16 25.81Q262.23-380 240-380q-41.67 0-70.83-29.14Q140-438.28 140-479.91q0-41.63 29.17-70.86Q198.33-580 240-580q22.23 0 41.69 9.27 19.46 9.27 34.16 25.81l309.69-182.46q-2.77-7.54-4.16-16.09Q620-752.02 620-760q0-41.67 29.14-70.83Q678.28-860 719.91-860q41.63 0 70.86 29.14Q820-801.72 820-760.09q0 41.63-29.17 70.86Q761.67-660 720-660q-22.23 0-41.69-9.27-19.46-9.27-34.16-25.81L334.46-512.62q2.77 7.54 4.16 16.04 1.38 8.49 1.38 16.42 0 7.93-1.38 16.58-1.39 8.66-4.16 16.2l309.69 182.46q14.7-16.54 34.16-25.81Q697.77-300 720-300q41.67 0 70.83 29.14Q820-241.72 820-200.09q0 41.63-29.14 70.86Q761.72-100 720.09-100ZM720-700q24.69 0 42.35-17.65Q780-735.31 780-760t-17.65-42.35Q744.69-820 720-820t-42.35 17.65Q660-784.69 660-760t17.65 42.35Q695.31-700 720-700ZM240-420q24.69 0 42.35-17.65Q300-455.31 300-480t-17.65-42.35Q264.69-540 240-540t-42.35 17.65Q180-504.69 180-480t17.65 42.35Q215.31-420 240-420Zm480 280q24.69 0 42.35-17.65Q780-175.31 780-200t-17.65-42.35Q744.69-260 720-260t-42.35 17.65Q660-224.69 660-200t17.65 42.35Q695.31-140 720-140Zm0-620ZM240-480Zm480 280Z" />
                </svg>
              </button>
            </div>
            {/* <div className="controls">
              <button className="controls-button" onClick={handlePlaylistAdd}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="28px"
                  viewBox="0 -960 960 960"
                  width="28px"
                  fill="var(--md-sys-color-on-background)"
                >
                  <path d="M140-340v-40h280v40H140Zm0-160v-40h440v40H140Zm0-160v-40h440v40H140Zm520 480v-160H500v-40h160v-160h40v160h160v40H700v160h-40Z" />
                </svg>
              </button>
            </div> */}
            <div className="controls">
              <button className="controls-button" onClick={handlearrowbutton}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="28px"
                  viewBox="0 -960 960 960"
                  width="28px"
                  fill="var(--md-sys-color-on-background)"
                >
                  <path d="M327.69-420 480-572.31 632.31-420H327.69Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayingWidget;
