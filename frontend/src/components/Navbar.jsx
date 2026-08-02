import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user"))
    );

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

                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/albums">Albums</Link>
                    <Link to="/gallery">Gallery</Link>
                    <Link to="/community">Community</Link>
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