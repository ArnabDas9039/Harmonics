import { useContext, useEffect } from "react";
import "./assets/fonts.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notfound from "./pages/NotFound";
import Explore from "./pages/Explore";
import Library from "./pages/Library";
import Navigation from "./components/Navigation";
import AuthContext from "./contexts/AuthContext";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import {
  Song_Info,
  Artist_Info,
  Album_Info,
  Playlist_Info,
} from "./pages/Info";
import PlayingWidget from "./components/PlayingWidget";
import Room from "./pages/Room";
import RoomContext from "./contexts/RoomContext";

function Logout() {
  const { setIsAuthorized, setUser } = useContext(AuthContext);

  useEffect(() => {
    setIsAuthorized(false);
    setUser("");
    localStorage.clear();
  }, []);

  return <Navigate to="/" />;
}

function App() {
  const { isAuthorized, user } = useContext(AuthContext);
  const {roomId} = useContext(RoomContext);

  return (
    <>
      {roomId ? <div className="RoomContext">In A Room</div>: <></>}
      <Navigation />
      <PlayingWidget />
      <Routes>
        {/* <Route path="/" element={<Navigation />}> */}
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/library" element={<Library />} />
        <Route
          path="/user/:username"
          element={isAuthorized ? <Profile /> : <Navigate to="/login" />}
        />
        <Route path="/info/:song_id" element={<Song_Info />} />
        <Route path="/artist/:artist_id" element={<Artist_Info />} />
        <Route path="/album/:album_id" element={<Album_Info />} />
        <Route path="/playlist/:playlist_id" element={<Playlist_Info />} />
        <Route path="/room" element={<Room />} />
        {/* </Route> */}
        <Route
          path="/login"
          element={isAuthorized ? <Navigate to={"/user/" + user} /> : <Login />}
        />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/register"
          element={
            isAuthorized ? <Navigate to={"/user/" + user} /> : <Register />
          }
        />
      </Routes>
    </>
  );
}

export default App;
