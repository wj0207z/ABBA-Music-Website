import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar">
            <ul className="nav-links">
                <li>
                    <Link to="/">HOME</Link>
                </li>

                <li>
                    <Link to="/albums">ALBUMS</Link>
                </li>

                <li className="homeIcon">
                    <Link to="/">
                        <img
                            src="/images/nav_icon/ABBAicon.png"
                            alt="ABBA logo"
                        />
                    </Link>
                </li>

                <li>
                    <Link to="/gallery">GALLERY</Link>
                </li>

                <li>
                    <Link to="/community">COMMUNITY</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;