import { Link, Outlet, useLocation } from "react-router-dom";
import "../styles/Navigation.css";
import {
  IconSVG,
  HomeIcon,
  ExploreIcon,
  LibraryIcon,
  FilledHomeIcon,
  FilledExploreIcon,
  FilledLibraryIcon,
  AddIcon,
} from "../assets/Icons";
import { useSelector } from "react-redux";

function Navigation({ onNewPlaylist }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isAuthorized, loading } = useSelector((state) => state.auth);

  return (
    <>
      <div className="navigation destination">
        <Link to="/">
          <div
            className={currentPath === "/" ? "nav-button active" : "nav-button"}
          >
            <div className="icon">
              <IconSVG>
                {currentPath === "/" ? FilledHomeIcon : HomeIcon}
              </IconSVG>
            </div>
            <div className="icon-label">Home</div>
          </div>
        </Link>
        <Link to="/explore">
          <div
            className={
              currentPath === "/explore" ? "nav-button active" : "nav-button"
            }
          >
            <div className="icon">
              <IconSVG>
                {currentPath === "/explore" ? FilledExploreIcon : ExploreIcon}
              </IconSVG>
            </div>
            <div className="icon-label">Explore</div>
          </div>
        </Link>
        <Link to="/library">
          <div
            className={
              currentPath === "/library" ? "nav-button active" : "nav-button"
            }
          >
            <div className="icon">
              <IconSVG>
                {currentPath === "/library" ? FilledLibraryIcon : LibraryIcon}
              </IconSVG>
            </div>
            <div className="icon-label">Library</div>
          </div>
        </Link>
        {isAuthorized ? (
          <div className="new-playlist-btn" onClick={onNewPlaylist}>
            <div className="icon">
              <IconSVG>{AddIcon}</IconSVG>
            </div>
            <div className="icon-label">New Playlist</div>
          </div>
        ) : (
          <div className="new-playlist-btn">
            <div className="icon"></div>
            <div className="icon-label">Log In</div>
          </div>
        )}
      </div>
      <Outlet />
    </>
  );
}

export default Navigation;
