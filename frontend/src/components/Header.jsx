import { Link } from "react-router-dom";
import "../styles/Header.css";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import api from "../api";
import { IconSVG, SearchIcon } from "../assets/Icons";

function Header(props) {
  const { isAuthorized, username } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState({});

  // useEffect(() => {
  //   if (isAuthorized) {
  //     api
  //       .get("/api/me/")
  //       .then((res) => res.data)
  //       .then((data) => {
  //         setProfile(data);
  //       })
  //       .catch((err) => alert(err));
  //   }
  // }, [isAuthorized]);

  return (
    <div className="header">
      <div className="left-section">
        <div className="top-destination">
          <b>{props.destination}</b>
        </div>
      </div>
      <div className="right-section">
        <div className="search">
          <button className="icon-button">
            <IconSVG>{SearchIcon}</IconSVG>
          </button>
        </div>
        {isAuthorized ? (
          <Link to={"/profile"}>
            <div className="icon profile-icon">
              <img
                src={profile.profile_image_url}
                className="profile-icon-image"
                alt="Profile"
              />
            </div>
          </Link>
        ) : (
          <>
            <div className="login-button">
              <Link to="/login">Log In</Link>
            </div>
            <div className="login-button">
              <Link to="/register">Register</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
