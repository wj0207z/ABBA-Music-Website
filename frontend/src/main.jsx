import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import "./styles/albums.css";
import "./styles/auth.css";
import "./styles/chatroom.css";
import "./styles/community.css";
import "./styles/gallery.css";
import "./styles/global.css";
import "./styles/home.css";
import "./styles/music-player.css";
import "./styles/navbar.css";
import "./styles/profile.css";


import { MusicProvider } from "./context/MusicContext";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <MusicProvider>
                <App />
            </MusicProvider>
        </BrowserRouter>
    </React.StrictMode>
);