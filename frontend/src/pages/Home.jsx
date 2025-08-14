import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../api";
import "@material/web/all.js";
import { MediumThumbnail } from "../components/Thumbnails";
import "../styles/Feed.css";
import Header from "../components/Header";

function Filter_chip(props) {
  return (
    <div className="filter-chips">
      <button className="filter-chips-button">{props.name}</button>
    </div>
  );
}

function Home() {
  const isAuthorized = useSelector((state) => state.auth.isAuthorized);
  const [generalFeed, setGeneralFeed] = useState({});
  const [userFeed, setUserFeed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const chips = [
    "Romance",
    "Feel Good",
    "Relax",
    "Energize",
    "Workout",
    "Party",
    "Commute",
    "Travel",
    "Sad",
    "Focus",
    "Sleep",
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthorized) {
        try {
          const UserResponse = await api.get("/api/feed/");
          // console.log(UserResponse.data);
          setUserFeed(UserResponse.data);
          setIsLoading(false);
        } catch (err) {
          alert(err);
        }
      }
    };
    fetchData();
  }, [isAuthorized]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="body">
      <Header destination="Home" />
      <div className="feed">
        <div className="filters">
          {chips.map((chip, index) => (
            <Filter_chip name={chip} key={index} />
          ))}
        </div>
        {userFeed.map((feed) => (
          <div key={feed.group}>
            <div className="heading-section">
              <div className="heading">
                <b>{feed.group}</b>
              </div>
            </div>
            <div className="medium-thumbnails">
              {feed.items.map((item) => (
                <MediumThumbnail
                  item={item.content_object}
                  content_type={item.content_type}
                  key={item.created_at}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
