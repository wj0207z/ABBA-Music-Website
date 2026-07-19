import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Albums from "./pages/Albums";
import Home from "./pages/Home";

function App() {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/albums" element={<Albums />} />


                <Route
                path="/albums"
                element={<h1 className="page-title">Albums Page</h1>}
                />
                
                <Route
                path="/gallery"
                element={<h1 className="page-title">Gallery Page</h1>}
                />

                <Route
                path="/community"
                element={<h1 className="page-title">Community Page</h1>}
                />

            </Routes>
        </>
    );
}

export default App;