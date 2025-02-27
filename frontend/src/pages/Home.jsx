import { useState, useEffect, useContext } from "react";
import api from "../api";
import "@material/web/all.js";
import {
  GridThumbnail,
  ArtistThumbnail,
  MediumThumbnail,
  PlaylistThumbnail,
} from "../components/Thumbnails";
import "../styles/Feed.css";
import AuthContext from "../contexts/AuthContext";
import Header from "../components/Header";

function Filter_chip(props) {
  return (
    <div className="chips">
      <button className="chips-button">{props.name}</button>
    </div>
  );
}

function Home() {
  const { isAuthorized } = useContext(AuthContext);
  const [generalFeed, setGeneralFeed] = useState({});
  const [userFeed, setUserFeed] = useState({});
  const [topSongs, setTopSongs] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
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
      try {
        const [generalResponse, songsResponse, artistsResponse] =
          await Promise.all([
            api.get("/api/general/"),
            api.get("/api/songs/top/?limit=10"),
            api.get("/api/artists/top/?limit=10&seed=" + Math.random()),
          ]);

        setGeneralFeed(generalResponse.data[0]);
        setTopSongs(songsResponse.data.results);
        setTopArtists(artistsResponse.data.results);

        if (isAuthorized) {
          const UserResponse = await api.get("/api/user/recommendation/");

          setUserFeed(UserResponse.data[0]);
        }
        setIsLoading(false);
      } catch (err) {
        alert(err);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="body">
      <Header destination="Home" />
      <div className="feed">
        <div className="filters">
          {/* <md-chip-set> */}
          {chips.map((chip, index) => (
            // <md-filter-chip label={chip} key={index}></md-filter-chip>
            <Filter_chip name={chip} key={index} />
          ))}
          {/* </md-chip-set> */}
        </div>
        {isAuthorized && (
          <>
            <div className="heading-section">
              <div className="heading">
                <b>Quick Picks</b>
              </div>
            </div>
            {userFeed.quick_picks.length === 0 ? (
              <div className="empty-text">
                Listen to more songs to get recommendations
              </div>
            ) : (
              <div className="grid-thumbnails">
                {userFeed.quick_picks.map((item) => (
                  <GridThumbnail item={item} key={item.id} />
                ))}
              </div>
            )}
            <div className="heading-section">
              <div className="heading">
                <b>Recommended</b>
              </div>
            </div>
            {userFeed.recommended_songs.length === 0 ? (
              <div className="empty-text">
                Listen to more songs to get recommendations
              </div>
            ) : (
              <div className="medium-thumbnails">
                {userFeed.recommended_songs.map((item) => (
                  <MediumThumbnail item={item} key={item.id} />
                ))}
              </div>
            )}
            {/* <div className="heading-section">
              <div className="heading">
                <b>Listen Again</b>
              </div>
            </div> */}
            {/* <div className="heading-section">
              <div className="heading">
                <b>From your library</b>
              </div>
            </div> */}
            {/* <div className="heading-section">
              <div className="heading">
                <b>Mixed for you</b>
              </div>
            </div>
            <div className="medium-thumbnails">
              {userFeed.mixes.map((item) => (
                <PlaylistThumbnail item={item} key={item.id} />
              ))}
            </div> */}
            {/* <div className="heading-section">
              <div className="heading">
                <b>SIMILAR TO</b>
              </div>
            </div> */}
            {/* <div className="heading-section">
              <div className="heading">
                <b>Forgotten Favourites</b>
              </div>
            </div> */}
            <div className="heading-section">
              <div className="heading">
                <b>Latest Releases from your following</b>
              </div>
            </div>
            {userFeed.latest_from_following.length === 0 ? (
              <div className="empty-text">
                Follow more artists to get their latest releases
              </div>
            ) : (
              <div className="medium-thumbnails">
                {userFeed.latest_from_following.map((item) => (
                  <MediumThumbnail item={item} key={item.id} />
                ))}
              </div>
            )}
          </>
        )}
        <div className="heading-section">
          <div className="heading">
            <b>Top Songs</b>
          </div>
        </div>
        <div className="medium-thumbnails">
          {topSongs.map((song) => (
            <MediumThumbnail item={song} key={song.id} />
          ))}
        </div>
        <div className="heading-section">
          <div className="heading">
            <b>Top Artists</b>
          </div>
        </div>
        <div className="artist-thumbnails">
          {topArtists.map((artist) => (
            <ArtistThumbnail item={artist} key={artist.id} />
          ))}
        </div>
        <div className="heading-section">
          <div className="heading">
            <b>PLAYLISTS from the community</b>
          </div>
        </div>
        <div className="medium-thumbnails">
          {generalFeed.playlists.map((item) => (
            <PlaylistThumbnail item={item} key={item.id} />
          ))}
        </div>
        <div className="heading-section">
          <div className="heading">
            <b>PLAYLISTS for the SEASON</b>
          </div>
        </div>
        <div className="medium-thumbnails">
          {generalFeed.season_playlist.map((item) => (
            <PlaylistThumbnail item={item} key={item.id} />
          ))}
        </div>
        <div className="heading-section">
          <div className="heading">
            <b>PLAYLISTS for the TIME of the DAY</b>
          </div>
        </div>
        <div className="medium-thumbnails">
          {generalFeed.day_playlist.map((item) => (
            <PlaylistThumbnail item={item} key={item.id} />
          ))}
        </div>
        <div className="heading-section">
          <div className="heading">
            <b>Events</b>
          </div>
        </div>
        <div className="medium-thumbnails">
          {generalFeed.event_playlist.map((item) => (
            <PlaylistThumbnail item={item} key={item.id} />
          ))}
        </div>
        {/* <div className="heading-section">
          <div className="heading">
            <b>Genres</b>
          </div>
        </div> */}
        {/* <div className="heading-section">
          <div className="heading">
            <b>Hits</b>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Home;
