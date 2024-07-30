import "../styles/Navigation.css";
import { Link, Outlet } from "react-router-dom";

function Navbutton(props) {
  return (
    <div className="nav-button">
      <div className="icon">
        <img
          src={"http://127.0.0.1:8000/api/static/icons/" + props.name + ".svg"}
          className="icon-image"
        />
      </div>
      <div className="icon-label">{props.name}</div>
    </div>
  );
}

function Navigation() {
  return (
    <>
      <div className="navigation destination">
        <Link to="/">
          <Navbutton name="Home" />
        </Link>
        <Link to="/explore">
          <Navbutton name="Explore" />
        </Link>
        <Link to="/library">
          <Navbutton name="Library" />
        </Link>
        {/* <div className="playlists">
        <Playlist name="Playlist 1" id="" owner="" />
      </div> */}
      </div>
      <Outlet />
    </>
  );
}

export default Navigation;
