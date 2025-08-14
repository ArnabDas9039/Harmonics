import { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../api";
import "../styles/Profile.css";
import { Link } from "react-router-dom";

function Profile() {
  const [profile, setProfile] = useState([]);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = () => {
    api
      .get("/api/profile/")
      .then((res) => res.data)
      .then((data) => {
        setProfile(data);
        // console.log(data);
      })
      .catch((err) => alert(err));
  };
  return (
    <div className="body">
      <Header destination="Profile" />
      <div className="info-page">
        <div className="profile-section">
          <div className="profile-thumbnail">
            <img
              className="profile-thumbnail-image"
              src={profile.profile_image_url}
            />
          </div>
        </div>
        <div className="info-section">
          <div className="username">{profile.username}</div>
          {/* <div className="user-settings">{profile.user_settings}</div> */}
        </div>
      </div>
      <div className="logout-button">
        <Link to="/logout">Logout</Link>
      </div>
    </div>
  );
}

export default Profile;
