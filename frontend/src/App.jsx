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
