import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSpringAuth } from "../context/SpringAuthContext";

function Navbar() {
    const navigate = useNavigate();
    const { user, checkingSession, logout } = useSpringAuth();

    const [menuOpen, setMenuOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [logoutError, setLogoutError] = useState("");

    function closeMenu() {
        setMenuOpen(false);
    }

    async function handleLogout(){
        setLoggingOut(true);
        setLogoutError("");

        try {
            await logout();
            closeMenu();
            navigate("/login");
        } catch {
            setLogoutError("Could not log out. Please try again.");
        } finally {
            setLoggingOut(false);
        }
    }

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link className="navbar-brand" to="/">
                    <img
                        src="/images/nav_icon/ABBAicon.png"
                        alt="ABBA logo"
                    />

                    <span>ABBA</span>
                </Link>

                <button
                    className={`menu-toggle ${menuOpen ? "menu-toggle-open" : ""}`}
                    type="button"
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((current) => !current)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div className={`nav-links ${menuOpen ? "mobile-menu-open" : ""}`}>
                    <Link to="/" onClick={closeMenu}>
                        Home
                    </Link>
                    <Link to="/albums" onClick={closeMenu}>
                        Albums
                    </Link>
                    <Link to="/gallery" onClick={closeMenu}>
                        Gallery
                    </Link>

                    <div className="nav-dropdown">
                        <span className="nav-dropdown-label">
                            Community
                        </span>

                        <div className="nav-dropdown-menu">
                            <Link to="/community">
                                Community Feed
                            </Link>

                            <Link to="/my-posts">
                                My Posts
                            </Link>

                            <Link to="/chatroom">
                                Chat Room
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="navbar-auth">
                    {logoutError && <p role="alert">{logoutError}</p>}
                    {user ? (
                        <>
                            <span className="user-status">

                                <img
                                    className="user-icon"
                                    src="/images/nav_icon/user.png"
                                    alt="User"
                                />

                                <span>:</span>
                                <span>{user.name}</span>
                            </span>

                            <Link
                                className="profile-nav-button"
                                to="/profile"
                            >
                                Profile
                            </Link>
                            
                            <button
                                type="button"
                                className="logout-button"
                                onClick={handleLogout}
                                disabled={loggingOut}
                            >
                                {loggingOut ? "Logging out..." : "Logout"}
                            </button>
                        </>
                    ) : (
                        <>
                            <span className="user-status">
                                <img
                                    className="user-icon"
                                    src="/images/nav_icon/user.png"
                                    alt="Guest"
                                />

                                <span>:</span>
                                <span>{checkingSession ? "Checking session..." : "Guest"}</span>
                            </span>

                            <Link
                                className="login-button"
                                to="/login"
                            >
                                Login
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;