import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import AlbumDetail from "./pages/AlbumDetail";
import Albums from "./pages/Albums";
import Community from "./pages/Community";
import Gallery from "./pages/Gallery";
import Home from "./pages/Home";

function App() {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/albums" element={<Albums />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/community" element={<Community />} />
                <Route path="/albums/:slug" element={<AlbumDetail />} />
            </Routes>
        </>
    );
}

export default App;