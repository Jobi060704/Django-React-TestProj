// MainLayout.jsx
import React from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"

import "../styles/MainLayout.css"

const MainLayout = ({ children }) => {
    return (
        <div className="main-layout">
            <Header />
            <div className="main-body">
                <Sidebar />
                <div className="main-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
