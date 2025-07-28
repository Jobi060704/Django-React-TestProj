// src/components/Header.jsx
import { Link } from "react-router-dom";
import logo from "../assets/logo1bgless.png"; // Place your logo here
import "../styles/Header.css";

const Header = ({ user }) => {
    const username = localStorage.getItem("username");

    return (
        <header className="app-header">
            <div className="logo-section">
                <img src={logo} alt="SmartCrop Logo" className="logo-img" />
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
