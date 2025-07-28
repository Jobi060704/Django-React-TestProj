import { Link } from "react-router-dom";
import "../styles/Header.css";

const Header = ({ user }) => {
    const username = localStorage.getItem("username");

    return (
        <header className="app-header">
            <div className="logo-section">
                <Link to="/">
                    <img src="/logo1bgless.png" alt="SmartCrop Logo" className="logo-img" />
                </Link>
            </div>

            <nav className="nav-links">
                {!username ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                ) : (
                    <>
                        <Link to="/logout">Logout</Link>
                        <span className="username">Welcome, {username}!</span>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
