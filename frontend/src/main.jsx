import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import "./styles/albums.css";
import "./styles/auth.css";
import "./styles/community.css";
import "./styles/gallery.css";
import "./styles/global.css";
import "./styles/home.css";
import "./styles/navbar.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);