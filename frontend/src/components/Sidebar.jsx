import {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import {
    FaChartBar, FaIndustry, FaMapMarkedAlt, FaDrawPolygon,
    FaTint, FaSolarPanel, FaLandmark, FaTable
} from "react-icons/fa";
import {
    FaCircleDot, FaCircleH, FaMapLocation, FaPersonHiking,
    FaTableCells, FaTruckField, FaChevronLeft, FaChevronRight
} from "react-icons/fa6";
import "../styles/Sidebar.css";

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(() => {
        const stored = localStorage.getItem("sidebarCollapsed");
        return stored === "true"; // convert from string to boolean
    });

    // Store new state on change
    useEffect(() => {
        localStorage.setItem("sidebarCollapsed", collapsed);
    }, [collapsed]);

    return (
        <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
            <div>
                <ul>
                    <li>
                        <Link to="/dashboard">
                            <FaLandmark className="sidebar-icon" />
                            <span>Landing</span>
                        </Link>
                    </li>
                </ul>

                <ul>
                    <li>
                        <Link to="/dashboard/statistics">
                            <FaChartBar className="sidebar-icon" />
                            <span>Statistics</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard/map">
                            <FaMapLocation className="sidebar-icon" />
                            <span>Map view</span>
                        </Link>
                    </li>
                </ul>

                <ul>
                    <li>
                        <Link to="/dashboard/companies">
                            <FaIndustry className="sidebar-icon" />
                            <span>Companies</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard/regions">
                            <FaMapMarkedAlt className="sidebar-icon" />
                            <span>Regions</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard/sectors">
                            <FaDrawPolygon className="sidebar-icon" />
                            <span>Sectors</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard/pivots">
                            <FaCircleDot className="sidebar-icon" />
                            <span>Pivots</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard/fields">
                            <FaSolarPanel className="sidebar-icon" />
                            <span>Fields</span>
                        </Link>
                    </li>
                </ul>

                <ul>
                    <li>
                        <Link to="/scouting">
                            <FaPersonHiking className="sidebar-icon" />
                            <span>Scouting</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard/crop-rotations">
                            <FaTable className="sidebar-icon" />
                            <span>Crop Rotation</span>
                        </Link>
                    </li>
                </ul>
            </div>

            <button
                className="toggle-button"
                onClick={() => setCollapsed(prev => !prev)}
                aria-label="Toggle Sidebar"
            >
                {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
        </aside>
    );
};

export default Sidebar;
