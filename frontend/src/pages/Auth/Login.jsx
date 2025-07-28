import React, { useState } from "react";
import api from "../../api.js";
import { useNavigate } from "react-router-dom";
import "../../styles/Auth.css";
import Alert from "../../components/Alert.jsx";

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
                navigate("/dashboard");
            })
            .catch(() => setError("Invalid username or password"));
    };

    return (
        <div className="auth-page">
            {error && <Alert message={error} onClose={() => setError("")} />}

            <form className="auth-form" onSubmit={handleLogin}>
                <div className="form-title">
                    <img src="/logo1.png" alt="Logo" className="logo" />
                    <div className="brand-name">
                        <span className="brand-line1">Login</span>
                    </div>
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
                    No account? <a href="/Register">Register</a>
                </p>

            </form>

        </div>
    );

};

export default Login;