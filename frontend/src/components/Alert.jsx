import React, { useEffect, useState } from "react";
import "../styles/Alert.css";

const Alert = ({ message, onClose }) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true); // Start fade-out animation
            setTimeout(() => onClose(), 300); // Remove after animation ends
        }, 3000); // Show for 3 sec

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`alert-container ${fadeOut ? "fade-out" : ""}`}>
            <div className="alert">
                <span>{message}</span>
                <span className="alert-close" onClick={() => setFadeOut(true)}>×</span>
            </div>
        </div>
    );
};

export default Alert;
