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
} from "../assets/Icons";

function Navigation() {
  const location = useLocation();
  const currentPath = location.pathname;
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
      </div>
      <Outlet />
    </>
  );
}

export default Navigation;
