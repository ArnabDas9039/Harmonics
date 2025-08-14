import { useEffect, useState } from "react";
import "./assets/fonts.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notfound from "./pages/NotFound";
import Explore from "./pages/Explore";
import Library from "./pages/Library";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import {
  Song_Info,
  Artist_Info,
  Album_Info,
  Playlist_Info,
} from "./pages/Info";
import PlayingWidget from "./components/PlayingWidget";
import { logoutUser } from "./store/authSlice";
import PlaylistCreateForm from "./components/PlaylistCreateForm";
import Search from "./pages/Search";
// import SongUploadForm from "./pages/Upload";

function Logout() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  return <Navigate to="/login" />;
}

function App() {
  const dispatch = useDispatch();
  const { isAuthorized, loading } = useSelector((state) => state.auth);
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* {roomId ? <div className="RoomContext">In A Room</div> : <></>} */}
      <div className="logo-section">
        <div className="logo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            height="50px"
            width="50px"
            fill="url(#myGradient)"
          >
            <defs>
              <linearGradient
                id="myGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="80%"
              >
                <stop offset="30%" stopColor="var(--md-sys-color-primary)" />
                <stop offset="62%" stopColor="var(--md-sys-color-secondary)" />
                <stop offset="85%" stopColor="var(--md-sys-color-tertiary)" />
              </linearGradient>
            </defs>
            <path
              d="M479.49,36.23C344.46,36.23,235,145.7,235,280.73S344.46,525.22,479.49,525.22,724,415.75,724,280.73,614.52,36.23,479.49,36.23ZM619.76,383.12a73.32,73.32,0,1,1-31.65-60.33V252.14a10.7,10.7,0,0,0-10.7-10.71H453a10.7,10.7,0,0,0-10.71,10.71h0c-.05,66.73-.09,131-.09,131a73.32,73.32,0,1,1-31.65-60.33V120.92a15.91,15.91,0,1,1,31.82,0v.22h0c0,14.82,0,40-.05,68.32l0-68.32h-.15l.1,77.74A10.71,10.71,0,0,0,453,209.59H577.41a10.71,10.71,0,0,0,10.7-10.71v-78a15.91,15.91,0,1,1,31.82,0h0C619.9,180,619.76,383.12,619.76,383.12Z"
              transform="translate(-400 -965) scale(1.8)"
            />
          </svg>
        </div>
        <div className="app-name">Harmonics</div>
      </div>
      <Navigation onNewPlaylist={() => setShowPlaylistForm(true)} />
      <PlayingWidget />
      {/* <div style={{ position: "fixed", top: 90, right: 32, zIndex: 999 }}>
        <button onClick={() => setShowPlaylistForm(true)}>New Playlist</button>
      </div> */}
      {showPlaylistForm && (
        <PlaylistCreateForm
          onClose={() => setShowPlaylistForm(false)}
          onSuccess={() => setShowPlaylistForm(false)}
        />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route
          path="/library"
          element={isAuthorized ? <Library /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isAuthorized ? <Profile /> : <Navigate to="/login" />}
        />
        <Route path="/song/:song_id" element={<Song_Info />} />
        <Route path="/artist/:artist_id" element={<Artist_Info />} />
        <Route path="/album/:album_id" element={<Album_Info />} />
        <Route path="/playlist/:playlist_id" element={<Playlist_Info />} />
        <Route path="/search" element={<Search />} />
        {/* </Route> */}
        <Route
          path="/login"
          element={isAuthorized ? <Navigate to="/profile" /> : <Login />}
        />
        <Route path="/logout" element={<Logout />} />
        {/* <Route path="/upload" element={<SongUploadForm />} /> */}
        <Route
          path="/register"
          element={isAuthorized ? <Navigate to="/profile" /> : <Register />}
        />
      </Routes>
    </>
  );
}

export default App;
