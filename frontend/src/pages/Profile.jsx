import { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../api";
import "../styles/Profile.css";
import { Link, useParams } from "react-router-dom";

function Profile() {
  const [profiles, setProfiles] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = () => {
    api
      .get("/api/user/" + username)
      .then((res) => res.data)
      .then((data) => {
        setProfiles(data);
        // console.log(data);
      })
      .catch((err) => alert(err));
  };
  return (
    <div className="body">
      <Header destination="Profile" />
      <div className="info">
        <div className="thumbnail-section">
          <div className="large-thumbnail">
            <img
              className="large-thumbnail-image"
              src={profiles.profile_image_url}
            />
          </div>
        </div>
        <div className="info-section"></div>
      </div>
      <div className="Logout-button">
        <Link to="/logout">Logout</Link>
      </div>
    </div>
  );
}

export default Profile;
