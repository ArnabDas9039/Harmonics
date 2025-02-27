// import { createContext, useState, useEffect, useRef, useContext } from "react";
// import PlayingContext from "./PlayingContext";

// const RoomContext = createContext();

// export const RoomProvider = ({ children }) => {
//   const socketRef = useRef();
//   const [roomId, setRoomId] = useState(null);
//   const [currentSong, setCurrentSong] = useState(null);
//   const [isHost, setIsHost] = useState(false);
//   const [syncTime, setSyncTime] = useState(0);
//   const { playing, setPlaying, isPlaying, setIsPlaying } =
//     useContext(PlayingContext);

//   useEffect(() => {
//     if (isHost) {
//       console.log(isHost);
//     }
//   }, [isHost]);

//   useEffect(() => {
//     if (isHost) {
//       sendMessage(syncTime);
//     }
//   }, [syncTime]);

//   useEffect(() => {
//     if (roomId) {
//       console.log(typeof roomId);
//       // const socket = new WebSocket(`ws://10.109.53.14:8000/ws/room/${roomId}/`);
//       const socket = new WebSocket(`ws://127.0.0.1:8000/ws/room/${roomId}/`);
//       socketRef.current = socket;

//       socket.onopen = () => {
//         console.log("WebSocket connection established");
//       };

//       socket.onmessage = (e) => {
//         const data = JSON.parse(e.data);
//         console.log(data);
//         if (!isHost) {
//           setIsPlaying(data.isPlaying);
//           setSyncTime(data.currentTime);
//           console.log(playing);
//           if (playing.id != data.currentSong) {
//             setPlaying(data.currentSong);
//           }
//         }
//       };

//       socket.onclose = () => {
//         console.log("WebSocket connection closed");
//       };

//       socket.onerror = (e) => {
//         console.error("WebSocket error", e);
//       };

//       return () => {
//         socket.close();
//       };
//     }
//   }, [roomId]);

//   useEffect(() => {
//     if (roomId) {
//       console.log(currentSong);
//       setPlaying(currentSong);
//     }
//   }, [currentSong]);

//   const sendMessage = (currenttime) => {
//     const messageData = JSON.stringify({
//       isPlaying: isPlaying,
//       currentTime: currenttime,
//       currentSong: playing.id,
//     });
//     if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
//       console.log(messageData);
//       socketRef.current.send(messageData);
//     } else {
//       console
//         .error
//         // "WebSocket is not open or connecting. Cannot send message."
//         ();
//     }
//   };

//   return (
//     <RoomContext.Provider
//       value={{
//         roomId,
//         setRoomId,
//         isHost,
//         setIsHost,
//         currentSong,
//         setCurrentSong,
//         syncTime,
//         setSyncTime,
//       }}
//     >
//       {children}
//     </RoomContext.Provider>
//   );
// };

// export default RoomContext;
