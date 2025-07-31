// src/components/Sidebar.jsx
import { Link } from "react-router-dom";
import {FaChartBar,FaIndustry,FaMapMarkedAlt,FaDrawPolygon,FaTint,FaSolarPanel,FaLandmark,FaTable} from "react-icons/fa";
import {FaCircleDot, FaCircleH, FaMapLocation, FaPersonHiking, FaTableCells, FaTruckField} from "react-icons/fa6";
import "../styles/Sidebar.css";

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <ul> {/*Landing*/}
                <li>
                    <Link to="/dashboard">
                        <FaLandmark className="sidebar-icon" />
                        Landing
                    </Link>
                </li>
            </ul>

            <ul> {/*Dashboard and Map*/}
                <li>
                    <Link to="/dashboard/statistics">
                        <FaChartBar className="sidebar-icon" />
                        Statistics
                    </Link>
                </li>
                <li>
                    <Link to="/dashboard/map">
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
                    <Link to="/dashboard/regions">
                        <FaMapMarkedAlt className="sidebar-icon" />
                        Regions
                    </Link>
                </li>
                <li>
                    <Link to="/dashboard/sectors">
                        <FaDrawPolygon className="sidebar-icon" />
                        Sectors
                    </Link>
                </li>
                <li>
                    <Link to="/dashboard/pivots">
                        <FaCircleDot className="sidebar-icon" />
                        Pivots
                    </Link>
                </li>
                <li>
                    <Link to="/dashboard/fields">
                        <FaSolarPanel className="sidebar-icon" />
                        Fields
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

            <ul> {/*Extras*/}
                <li>
                    <Link to="/croprotation">
                        <FaTable className="sidebar-icon" />
                        Crop Rotation
                    </Link>
                </li>
            </ul>

        </aside>
    );
};

export default Sidebar;
