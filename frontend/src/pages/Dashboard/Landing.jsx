// import {useState, useEffect} from "react";
// import api from "../api";
// import Note from "../components/Note";

import "../../styles/Dashboard/Landing.css"

function Landing() {
    return (
        <div className="dashboard-landing">
            <h1>Welcome to SmartCrop.io!</h1>

            <img src="/tractor.jpg" alt="Tractor" className="tractor-img" />

            <h2>What is SmartCrop?</h2>
            <p>SmartCrop.io is your agro management, crop rotation and field scouting companion!</p>

            <h2>What can I do now?</h2>
            <p>You can visit any of the sidebar links and get started!</p>
        </div>
    );
}

export default Landing;