// MainLayout.jsx
import React from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"

const MainLayout = ({ children }) => {
    return (
        <div className="main-layout">
            <Header />
            <div className="content-area">
                <Sidebar />
                <main className="main-content">{children}</main>
            </div>
        </div>
    )
}

export default MainLayout;
