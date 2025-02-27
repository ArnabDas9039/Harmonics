import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { PlayingProvider } from "./contexts/PlayingContext.jsx";
// import { RoomProvider } from "./contexts/RoomContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <PlayingProvider>
        <AuthProvider>
          {/* <RoomProvider> */}
          <App />
          {/* </RoomProvider> */}
        </AuthProvider>
      </PlayingProvider>
    </BrowserRouter>
  </React.StrictMode>
);
