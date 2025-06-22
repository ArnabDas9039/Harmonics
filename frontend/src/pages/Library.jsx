import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api";
import { MediumThumbnail } from "../components/Thumbnails";

function Library() {
  const [feeds, setFeeds] = useState([]);
  const [library, setLibrary] = useState([]);
  const [myPlaylists, setmyPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthorized = useSelector((state) => state.auth.isAuthorized);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [HistoryResponse, PlaylistResponse, LibraryResponse] =
          await Promise.all([
            api.get("/api/history/?limit=10"),
            api.get("/api/playlist/list/"),
            api.get("/api/library/"),
          ]);
        setFeeds(HistoryResponse.data.results);
        setmyPlaylists(PlaylistResponse.data);
        setLibrary(LibraryResponse.data);

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
          {feeds?.map((item) => (
            <MediumThumbnail
              item={item.content_object}
              content_type={item.content_type}
              key={item.created_at}
            />
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
          {myPlaylists?.map((item) => (
            <MediumThumbnail
              item={item}
              content_type={"playlist"}
              key={item.public_id}
            />
          ))}
        </div>
      </>
      <>
        <div className="heading-section">
          <div className="heading">
            <b>Saved</b>
          </div>
        </div>
        <div className="medium-thumbnails">
          {library.map((item) => (
            <MediumThumbnail
              item={item.content_object}
              content_type={item.content_type}
            />
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
