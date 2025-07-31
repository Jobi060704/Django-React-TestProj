// src/components/ModelAndMapLayout.jsx
import React from "react";
import "../styles/ModelAndMapLayout.css";

const ModelAndMapLayout = ({ leftPanel, rightPanel }) => {
    return (
        <div className="model-map-container">
            <div className="left-panel">
                {leftPanel}
            </div>
            <div className="right-panel">
                {rightPanel}
            </div>
        </div>
    );
};

export default ModelAndMapLayout;
