import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { PlayingProvider } from "./contexts/PlayingContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <PlayingProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </PlayingProvider>
    </BrowserRouter>
  </React.StrictMode>
);
