import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import api from "../api";
import { AddIcon, IconSVG } from "../assets/Icons";
import { GridThumbnail } from "./Thumbnails";

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const boxStyle = {
  background: "#fff",
  padding: "2rem",
  borderRadius: "8px",
  minWidth: "320px",
  boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

function PlaylistCheck({ onClose, onChange, currentSong }) {
  const [playlists, setPlaylists] = useState([]);
  const [checked, setChecked] = useState([]);
  const initialChecked = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `/api/playlist/list/?song=${currentSong.public_id}`
        );
        setPlaylists(response.data);
      } catch (err) {
        setPlaylists([]);
      }
    };

    fetchData();
  }, [currentSong.public_id]);

  useEffect(() => {
    const checkedIds = playlists
      .filter((item) => item.is_added)
      .map((item) => item.public_id);
    setChecked(checkedIds);
    initialChecked.current = checkedIds;
  }, [playlists]);

  const handleCheck = (public_id) => {
    setChecked((prev) =>
      prev.includes(public_id)
        ? prev.filter((cid) => cid !== public_id)
        : [...prev, public_id]
    );
    if (onChange) {
      console.log(public_id);
      onChange(
        checked.includes(public_id)
          ? checked.filter((cid) => cid !== public_id)
          : [...checked, public_id]
      );
    }
  };

  const handleConfirm = async () => {
    try {
      const toAdd = checked.filter(
        (id) => !initialChecked.current.includes(id)
      );
      const toRemove = initialChecked.current.filter(
        (id) => !checked.includes(id)
      );

      await Promise.all(
        playlists
          .filter((playlist) => toAdd.includes(playlist.public_id))
          .map(async (playlist) => {
            const songIds = Array.isArray(playlist.songs)
              ? [
                  ...playlist.songs.filter(
                    (song) => song.public_id !== currentSong.public_id
                  ),
                  currentSong,
                ]
              : [currentSong];

            const updatedSongs = songIds.map((songId, idx) => ({
              public_id: songId.public_id,
              order: idx + 1,
            }));

            // console.log(updatedSongs);

            const formData = new FormData();
            formData.append("title", playlist.title);
            formData.append("description", playlist.description);
            formData.append("duration", playlist.duration);
            formData.append("privacy", playlist.privacy);
            formData.append("songs", JSON.stringify(updatedSongs));

            console.log(formData);
            await api.put(
              `/api/playlist/${playlist.public_id}/update/`,
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
          })
      );

      await Promise.all(
        playlists
          .filter((playlist) => toRemove.includes(playlist.public_id))
          .map(async (playlist) => {
            const songIds = Array.isArray(playlist.songs)
              ? playlist.songs.filter(
                  (song) => song.public_id !== currentSong.public_id
                )
              : [];

            const updatedSongs = songIds.map((songId, idx) => ({
              public_id: songId.public_id,
              order: idx + 1,
            }));

            // console.log(updatedSongs);

            const formData = new FormData();
            formData.append("title", playlist.title);
            formData.append("description", playlist.description);
            formData.append("duration", playlist.duration);
            formData.append("privacy", playlist.privacy);
            formData.append("songs", JSON.stringify(updatedSongs));

            console.log(formData);
            await api.put(
              `/api/playlist/${playlist.public_id}/update/`,
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
          })
      );
      if (onClose) onClose();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="new-playlist-form" onClick={(e) => e.stopPropagation()}>
        <div className="title">Select Playlists</div>
        <div style={{ maxHeight: 300, overflowY: "auto" }}>
          <div
            className="new-playlist-btn"
            // onClick={onNewPlaylist}>
          >
            <div className="icon">
              <IconSVG>{AddIcon}</IconSVG>
            </div>
            <div className="icon-label">New Playlist</div>
          </div>
          <div className="playlist-list">
            {playlists.map((item) => (
              <div className="playlist-list-item">
                <input
                  type="checkbox"
                  checked={checked.includes(item.public_id)}
                  onChange={() => handleCheck(item.public_id)}
                />
                <GridThumbnail item={item} />
              </div>
            ))}
          </div>
        </div>
        <div className="playlist-form-btn-container">
          <button className="playlist-form-btn" onClick={onClose}>
            Close
          </button>
          <button className="playlist-form-btn submit" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlaylistCheck;
