import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user"))
    );

    const [menuOpen, setMenuOpen] = useState(false);

    function closeMenu() {
        setMenuOpen(false);
    }

    useEffect(() => {
        function updateUser() {
            setUser(JSON.parse(localStorage.getItem("user")));
        }

        window.addEventListener("auth-changed", updateUser);

        return () => {
            window.removeEventListener("auth-changed", updateUser);
        };
    }, []);

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
        navigate("/login");
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
                                className="logout-button"
                                onClick={handleLogout}
                            >
                                Logout
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
                                <span>Guest</span>
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