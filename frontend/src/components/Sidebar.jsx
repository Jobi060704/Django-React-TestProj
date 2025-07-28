// src/components/Sidebar.jsx
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/pivots">Pivots</Link></li>
                <li><Link to="/sectors">Sectors</Link></li>
            </ul>
        </aside>
    );
};

export default Sidebar;
