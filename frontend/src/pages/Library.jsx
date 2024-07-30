import Header from "../components/Header";
import { useContext, useEffect, useState } from "react";
import api from "../api";
import {
  ArtistThumbnail,
  MediumThumbnail,
  PlaylistThumbnail,
} from "../components/Thumbnails";
import AuthContext from "../contexts/AuthContext";
// import "../styles/General.css";

function Library() {
  const [feeds, setFeeds] = useState([]);
  const [library, setLibrary] = useState([]);
  const [myPlaylists, setmyPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthorized } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [HistoryResponse, LibraryResponse, PlaylistResponse] =
          await Promise.all([
            api.get("/api/history/get/?limit=10"),
            api.get("/api/library/"),
            api.get("/api/library/playlists/"),
          ]);

        setFeeds(HistoryResponse.data.results);
        setLibrary(LibraryResponse.data[0]);
        setmyPlaylists(PlaylistResponse.data);
      } catch (err) {
        alert(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthorized) {
      fetchData();
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="body">
      <Header destination="Library" />
      <>
        <div className="heading-section">
          <div className="heading">
            <b>History</b>
          </div>
        </div>
        <div className="medium-thumbnails">
          {feeds.map((song) => (
            <MediumThumbnail item={song.song} key={song.id} />
          ))}
        </div>
      </>
      <>
        <div className="heading-section">
          <div className="heading">
            <b>Your Playlists</b>
          </div>
        </div>
        <div className="medium-thumbnails">
          {myPlaylists.map((song) => (
            <PlaylistThumbnail item={song} key={song.id} />
          ))}
        </div>
      </>
      <>
        <div className="heading-section">
          <div className="heading">
            <b>Liked Songs</b>
          </div>
        </div>
        <div className="medium-thumbnails">
          {library.liked_songs.map((song) => (
            <MediumThumbnail item={song} key={song.id} />
          ))}
        </div>
      </>
      <>
        <div className="heading-section">
          <div className="heading">
            <b>Artists you're Following</b>
          </div>
        </div>
        <div className="medium-thumbnails">
          {library.followed_artists.map((song) => (
            <ArtistThumbnail item={song} key={song.id} />
          ))}
        </div>
      </>
      <>
        <div className="heading-section">
          <div className="heading">
            <b>Liked Albums</b>
          </div>
        </div>
        <div className="medium-thumbnails">
          {library.liked_albums.map((song) => (
            <PlaylistThumbnail item={song} key={song.id} />
          ))}
        </div>
      </>
      <>
        <div className="heading-section">
          <div className="heading">
            <b>Saved Playlists</b>
          </div>
        </div>
        <div className="medium-thumbnails">
          {library.saved_playlists.map((song) => (
            <PlaylistThumbnail item={song} key={song.id} />
          ))}
        </div>
      </>
    </div>
  );
}

export default Library;
