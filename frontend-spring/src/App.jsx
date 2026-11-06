import { Route, Routes } from "react-router-dom";
import MusicPlayer from "./components/MusicPlayer";
import Navbar from "./components/Navbar";
import AlbumDetail from "./pages/AlbumDetail";
import Albums from "./pages/Albums";
import ChatRoom from "./pages/ChatRoom";
import ChatRoomDetail from "./pages/ChatRoomDetail";
import Gallery from "./pages/Gallery";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyPosts from "./pages/MyPosts";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import SpringLogin from "./pages/SpringLogin";
import SpringPosts from "./pages/SpringPosts";


function App() {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/albums" element={<Albums />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/community" element={<SpringPosts />} />
                <Route
                    path="/albums/:slug"
                    element={<AlbumDetail />}
                />
                <Route path="/my-posts" element={<MyPosts />} />
                <Route path="/profile" element={<Profile />} />

                <Route path="/chatroom" element={<ChatRoom />}/>
                <Route path="/chatroom/:id" element={<ChatRoomDetail />} />
                <Route path="/spring-posts" element={<SpringPosts />} />
                <Route path="/spring-login" element={<SpringLogin />} />
            </Routes>

            <MusicPlayer />
        </>
    );
}

export default App;