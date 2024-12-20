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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              fill="var(--md-sys-color-on-background)"
            >
              <path d="m20.87 20.17-5.59-5.59C16.35 13.35 17 11.75 17 10c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7c1.75 0 3.35-.65 4.58-1.71l5.59 5.59.7-.71zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"></path>
            </svg>
          </button>
        </div>
        {isAuthorized && (
          <div className="icon notification-icon">
            <button className="icon-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                fill="var(--md-sys-color-on-background)"
              >
                <path d="M10 20h4c0 1.1-.9 2-2 2s-2-.9-2-2zm10-2.65V19H4v-1.65l2-1.88v-5.15C6 7.4 7.56 5.1 10 4.34v-.38c0-1.42 1.49-2.5 2.99-1.76.65.32 1.01 1.03 1.01 1.76v.39c2.44.75 4 3.06 4 5.98v5.15l2 1.87zm-1 .42-2-1.88v-5.47c0-2.47-1.19-4.36-3.13-5.1-1.26-.53-2.64-.5-3.84.03C8.15 6.11 7 7.99 7 10.42v5.47l-2 1.88V18h14v-.23z"></path>
              </svg>
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
