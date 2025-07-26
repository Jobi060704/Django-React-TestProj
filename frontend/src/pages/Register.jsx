import React, { useState } from "react";
import api  from "../api";
import { useNavigate } from "react-router-dom";


const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
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
        <div>

            {error && <p style={{color: "red"}}>{error}</p>}

            <form className="form" onSubmit={handleRegister}>

                <div className="form-title">
                    Register on <span className="brand-name"> SmartCrop.io</span>
                </div>

                <div className="input-container">

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
