import { useEffect, useState } from "react";
import api from "../api";
import Header from "../components/Header";
// import "../styles/General.css";
import "../styles/Explore.css";

function Explore() {
  const [genres, SetGenres] = useState([]);

  useEffect(() => {
    getGenres();
  }, []);

  const getGenres = () => {
    api
      .get("/api/explore/")
      .then((res) => res.data)
      .then((data) => {
        SetGenres(data);
        // console.log(data);
      })
      .catch((err) => alert(err));
  };

  return (
    <div className="body">
      <Header destination="Explore" />
      <>
        <div className="heading-section">
          <div className="heading">
            <b>New albums & singles</b>
          </div>
        </div>
      </>
      <>
        <div className="heading-section">
          <div className="heading">
            <b>Trending</b>
          </div>
        </div>
      </>
      <>
        <div className="heading-section">
          <div className="heading">
            <b>Moods & genres</b>
          </div>
        </div>
      </>
      <div className="explore-thumbnails">
        {genres.map((genre, index) => (
          <div className="info" key={index}>
            <div className="thumbnail-section">
              <div className="thumbnail">
                <img
                  src={genre.cover_image_url}
                  alt=""
                  className="thumbnail-image"
                />
              </div>
              <div className="genre-name">
                <b>{genre.name}</b>
              </div>
              <div className="overlay"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Explore;
