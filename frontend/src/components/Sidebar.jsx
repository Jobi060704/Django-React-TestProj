// src/components/Sidebar.jsx
import { Link } from "react-router-dom";
import { FaChartBar, FaIndustry, FaMapMarkedAlt, FaDrawPolygon, FaTint } from "react-icons/fa";
import "../styles/Sidebar.css";
import {FaCircleDot, FaCircleH, FaMapLocation, FaPersonHiking} from "react-icons/fa6";

const Sidebar = () => {
    return (
        <aside className="sidebar">

            <ul> {/*Dashboard and Map*/}
                <li>
                    <Link to="/dashboard">
                        <FaChartBar className="sidebar-icon" />
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link to="/map">
                        <FaMapLocation className="sidebar-icon" />
                        Map view
                    </Link>
                </li>
            </ul>

            <ul> {/*Models*/}
                <li>
                    <Link to="/dashboard/companies">
                        <FaIndustry className="sidebar-icon" />
                        Companies
                    </Link>
                </li>
                <li>
                    <Link to="/regions">
                        <FaMapMarkedAlt className="sidebar-icon" />
                        Regions
                    </Link>
                </li>
                <li>
                    <Link to="/sectors">
                        <FaDrawPolygon className="sidebar-icon" />
                        Sectors
                    </Link>
                </li>
                <li>
                    <Link to="/pivots">
                        <FaCircleDot className="sidebar-icon" />
                        Pivots
                    </Link>
                </li>
            </ul>

            <ul> {/*Extras*/}
                <li>
                    <Link to="/scouting">
                        <FaPersonHiking className="sidebar-icon" />
                        Scouting
                    </Link>
                </li>
            </ul>

        </aside>
    );
};

export default Sidebar;
