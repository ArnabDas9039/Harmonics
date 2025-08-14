import { useState } from "react";
import api from "../api";

function PlaylistCreateForm({ onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("private");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!title.trim() || !description.trim() || !privacy) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("duration", 0);
      formData.append("privacy", privacy);

      await api.post("/api/playlist/create/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setLoading(false);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setLoading(false);
      setError("Failed to create playlist.");
    }
  };

  return (
    <div className="form-overlay" onClick={onClose}>
      <form
        className="new-playlist-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="title">New Playlist</div>
        <input
          className="form-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={100}
          autoFocus
          placeholder="Title"
        />
        <textarea
          className="form-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          maxLength={500}
          rows={3}
          placeholder="Description"
        />
        <select
          className="form-input"
          value={privacy}
          onChange={(e) => setPrivacy(e.target.value)}
          required
        >
          <option value="Private">Private</option>
          <option value="Public">Public</option>
        </select>
        <div className="playlist-form-btn-container">
          <button className="playlist-form-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="playlist-form-btn submit"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

export default PlaylistCreateForm;
