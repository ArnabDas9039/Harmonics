import { useContext, useEffect, useState } from "react";
import "../styles/Header.css";
import { Link } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import api from "../api";

function Header(props) {
  const { isAuthorized, user } = useContext(AuthContext);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    if (isAuthorized) {
      getProfile();
    }
  }, [isAuthorized]);

  const getProfile = () => {
    api
      .get("/api/user/" + user)
      .then((res) => res.data)
      .then((data) => {
        setProfile(data);
      })
      .catch((err) => alert(err));
  };

  return (
    <div className="header">
      <div className="left-section">
        <div className="top-destination">
          <b>{props.destination}</b>
        </div>
      </div>
      <div className="right-section">
        <div className="icon search-icon">
          <button className="icon-button">
            <img
              src="http://127.0.0.1:8000/api/static/icons/Search.svg"
              className="search-image"
            />
          </button>
        </div>
        {isAuthorized && (
          <div className="icon notification-icon">
            <button className="icon-button">
              <img
                src="http://127.0.0.1:8000/api/static/icons/Notification.svg"
                className="notification-icon-image"
              />
            </button>
          </div>
        )}
        {isAuthorized ? (
          <Link to={"/user/" + user}>
            <div className="icon profile-icon">
              <img
                src={profile.profile_image_url}
                className="profile-icon-image"
              />
            </div>
          </Link>
        ) : (
          <Link to="/login">
            <div>Sign In</div>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Header;
