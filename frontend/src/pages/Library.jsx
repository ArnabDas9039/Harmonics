import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api";
import {
  AlbumThumbnail,
  ArtistThumbnail,
  MediumThumbnail,
  PlaylistThumbnail,
} from "../components/Thumbnails";

function Library() {
  const [feeds, setFeeds] = useState([]);
  const [library, setLibrary] = useState([]);
  const [myPlaylists, setmyPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthorized = useSelector((state) => state.auth.isAuthorized);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [HistoryResponse, LibraryResponse] = await Promise.all([
          api.get("/api/history/?limit=10"),
          api.get("/api/library/"),
        ]);
        setFeeds(HistoryResponse.data.results);
        setLibrary(LibraryResponse.data.results);
        // setmyPlaylists(PlaylistResponse.data);
        setIsLoading(false);
      } catch (err) {
        alert(err);
      }
    };

    if (isAuthorized) {
      fetchData();
    }
  }, [isAuthorized]);

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
            <MediumThumbnail item={song.content_object} key={song.created_at} />
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
          {/* {myPlaylists.map((song) => (
            <PlaylistThumbnail item={song} key={song.id} />
          ))} */}
        </div>
      </>
      <>
        <div className="heading-section">
          <div className="heading">
            <b>Liked Songs</b>
          </div>
        </div>
        <div className="medium-thumbnails">
          {/* {library.liked_songs.map((song) => (
            <MediumThumbnail item={song} key={song.id} />
          ))} */}
        </div>
      </>
      <>
        <div className="heading-section">
          <div className="heading">
            <b>Artists you're Following</b>
          </div>
        </div>
        <div className="medium-thumbnails">
          {/* {library.followed_artists.map((song) => (
            <ArtistThumbnail item={song} key={song.id} />
          ))} */}
        </div>
      </>
      <>
        <div className="heading-section">
          <div className="heading">
            <b>Liked Albums</b>
          </div>
        </div>
        <div className="medium-thumbnails">
          {/* {library.liked_albums.map((song) => (
            <AlbumThumbnail item={song} key={song.id} />
          ))} */}
        </div>
      </>
      <>
        <div className="heading-section">
          <div className="heading">
            <b>Saved Playlists</b>
          </div>
        </div>
        <div className="medium-thumbnails">
          {/* {library.saved_playlists.map((song) => (
            <PlaylistThumbnail item={song} key={song.id} />
          ))} */}
        </div>
      </>
    </div>
  );
}

export default Library;
