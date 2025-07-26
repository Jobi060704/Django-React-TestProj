import React, { useState } from "react";
import api from "../api.js";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css"

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        api
            .post(`auth/token/`, { username, password })
            .then((res) => {
                localStorage.setItem("access", res.data.access);
                localStorage.setItem("refresh", res.data.refresh);
                navigate("/");
            })
            .catch(() => setError("Invalid username or password"));
    };

    return (
        <div>

            {error && <p style={{color: "red"}}>{error}</p>}

            <form className="form" onSubmit={handleLogin}>

                <div className="form-title">
                    Login to <span className="brand-name"> SmartCrop.io</span>
                </div>

                <div className="input-container">

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                </div>

                <button className="submit" type="submit">Login</button>

                <p className="signup-link">
                    No account? <a href="/register">Register</a>
                </p>

            </form>

        </div>
    );
};

export default Login;