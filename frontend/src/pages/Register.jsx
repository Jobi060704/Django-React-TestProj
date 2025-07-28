import React, { useState } from "react";
import api from "../api.js";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css"
import Alert from "../components/Alert";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        api
            .post(`auth/user/register/`, { username, email, password })
            .then(() => {
                setError("");
                navigate("/login");
            })
            .catch(() => {
                setError("Failed to register. Try again.");
            });
    };

    return (
        <div className="auth-page">
            {error && <Alert message={error} onClose={() => setError("")} />}

            <form className="auth-form" onSubmit={handleRegister}>
                <div className="form-title">
                    <img src="/logo1.png" alt="Logo" className="logo" />
                    <div className="brand-name">
                        <span className="brand-line1">Register</span>
                    </div>
                </div>

                <div className="input-container">

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <button className="submit" type="submit">Register</button>

                <p className="signup-link">
                    Have an account? <a href="/login">Login</a>
                </p>

            </form>

        </div>
    );
};

export default Register;
