import { Link, Outlet } from "react-router-dom";
import "../styles/Navigation.css";
import { IconSVG, HomeIcon, ExploreIcon, LibraryIcon } from "../assets/Icons";

function Navigation() {
  return (
    <>
      <div className="navigation destination">
        <Link to="/">
          <div className="nav-button">
            <div className="icon">
              <IconSVG>{HomeIcon}</IconSVG>
            </div>
            <div className="icon-label">Home</div>
          </div>
        </Link>
        <Link to="/explore">
          <div className="nav-button">
            <div className="icon">
              <IconSVG>{ExploreIcon}</IconSVG>
            </div>
            <div className="icon-label">Explore</div>
          </div>
        </Link>
        <Link to="/library">
          <div className="nav-button">
            <div className="icon">
              <IconSVG>{LibraryIcon}</IconSVG>
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
