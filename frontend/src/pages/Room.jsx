import { useContext, useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import PlayingContext from "../contexts/PlayingContext";
import AuthContext from "../contexts/AuthContext";
import api from "../api";
import { useNavigate } from "react-router-dom";
import RoomContext from "../contexts/RoomContext";

export function Room() {
  const [room, setRoom] = useState("");
  const navigate = useNavigate();
  const { roomId, setRoomId, currentSong, setCurrentSong, setIsHost } =
    useContext(RoomContext);
  const { playing } = useContext(PlayingContext);
  const { user } = useContext(AuthContext);

  const enterRoom = async () => {
    console.log(room);
    try {
      const res = await api.get("api/room/" + room);
    
      if (res.status === 403) {
        // ask permission
        console.log("asking permission");
        // Handle permission request here if needed
      } else {
        const data = res.data;
        console.log(data);
        setRoomId(data.room_id);
        setCurrentSong(data.current_song);
        console.log(user);
        setIsHost(data.host.username === user);
        navigate("/");
      }
    } catch (err) {
      alert(err);
    }
    
  };

  const createNewRoom = async () => {
    try {
      await api
        .post("api/room/create/", {
          room_id: parseInt(Math.random() * 10000),
          current_song: playing,
        })
        .then((res) => res.data)
        .then(async (data) => {
          console.log(data.room_id);
          try {
            await api
              .get("api/room/" + data.room_id)
              .then((res) => res.data)
              .then((data) => {
                console.log(data);
                setRoomId(data.room_id);
                console.log(user);
                setIsHost(data.host.username === user);
                data.current_song && setCurrentSong(data.current_song.id);
                navigate("/");
              });
          } catch (err) {
            alert(err);
          }
        });
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>
      <div className="body">
        <Header destination="Room" />
        <button className="form-button" onClick={createNewRoom}>
          Create Room
        </button>
        <input
          type="text"
          className="form-input"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Room ID"
          required
        />
        {/* <input
        type="password"
        className="form-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      /> */}
        <button className="form-button" onClick={enterRoom}>
          Enter Room
        </button>
      </div>
    </>
  );
}

export default Room;
