import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css"

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
            {error && <p style={{ color: "red" }}>{error}</p>}

            <form className="auth-form" onSubmit={handleRegister}>
                <div className="form-title">
                    Register on <span className="brand-name"> SmartCrop.io</span>
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
