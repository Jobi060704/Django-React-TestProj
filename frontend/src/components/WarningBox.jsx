// src/components/WarningBox.jsx
import "../styles/WarningBox.css";

const WarningBox = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="warning-overlay">
            <div className="warning-box">
                <p>{message}</p>
                <div className="warning-actions">
                    <button className="confirm-btn" onClick={onConfirm}>Yes</button>
                    <button className="cancel-btn" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default WarningBox;
