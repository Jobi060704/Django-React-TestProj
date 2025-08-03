import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../../../api.js";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import "../../../styles/ModelAndMapLayout.css";
import {FaEdit, FaTrash} from "react-icons/fa";
import WarningBox from "../../../components/WarningBox.jsx";
import ModelAndMapLayout from "../../../components/ModelAndMapLayout.jsx";

function Regions() {
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const mapRef = useRef(null);
    const markersRef = useRef({});
    const [sortKey, setSortKey] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchQuery, setSearchQuery] = useState("");
    const [regionToDelete, setRegionToDelete] = useState(null);
    const [expandedCompanies, setExpandedCompanies] = useState({});

    const toggleCompanyGroup = (company) => {
        setExpandedCompanies(prev => ({
            ...prev,
            [company]: !prev[company]
        }));
    };

    const handleDeleteRequest = (e, region) => {
        e.stopPropagation();
        setRegionToDelete(region);
    };

    const confirmDelete = () => {
        api.delete(`/api/regions/${regionToDelete.id}/`)
            .then(() => {
                setRegions(prev => prev.filter(r => r.id !== regionToDelete.id));

                // Remove marker from map and ref
                const marker = markersRef.current[regionToDelete.id];
                if (marker && mapRef.current) {
                    mapRef.current.removeLayer(marker);
                    delete markersRef.current[regionToDelete.id];
                }

                setRegionToDelete(null);
            })
            .catch(err => {
                console.error("Failed to delete region", err);
                alert("Failed to delete region.");
                setRegionToDelete(null);
            });
    };

    const filteredRegions = regions.filter(region =>
        region.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedRegions = [...filteredRegions].sort((a, b) => {
        const valA = a[sortKey]?.toLowerCase?.() || "";
        const valB = b[sortKey]?.toLowerCase?.() || "";
        return sortOrder === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
    });

    const groupedRegions = sortedRegions.reduce((acc, region) => {
        const company = region.company || "Unknown";
        if (!acc[company]) acc[company] = [];
        acc[company].push(region);
        return acc;
    }, {});

    const createColoredIcon = (hexColor) =>
        L.divIcon({
            className: "custom-colored-icon",
            html: `
                <svg width="24" height="40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C6 0 0 6 0 12c0 7.5 12 27 12 27s12-19.5 12-27c0-6-6-12-12-12z" fill="${hexColor}" stroke="black" stroke-width="1.5"/>
                    <circle cx="12" cy="12" r="4" fill="white"/>
                </svg>
            `,
            iconSize: [24, 40],
            iconAnchor: [12, 40],
            popupAnchor: [0, -40]
        });

    useEffect(() => {
        api.get("/api/regions/")
            .then((res) => {
                const parsedRegions = res.data.map((region) => {
                    let lat = null, lng = null;
                    if (region.center && region.center.includes("POINT")) {
                        const wkt = region.center.replace("SRID=4326;", "").trim();
                        const match = wkt.match(/POINT\s*\(([-\d.]+)\s+([-\d.]+)\)/);
                        if (match) {
                            lng = parseFloat(match[1]);
                            lat = parseFloat(match[2]);
                        }
                    }
                    return {
                        ...region,
                        location: lat && lng ? { lat, lng } : null
                    };
                });
                setRegions(parsedRegions);
            })
            .catch((err) => console.error("Failed to load regions", err));
    }, []);

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map("map").setView([40.4, 49.8], 3);
            L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
                maxZoom: 19,
                attribution: "© ArcGIS"
            }).addTo(mapRef.current);
        }
    }, []);

    useEffect(() => {
        if (mapRef.current && regions.length) {
            regions.forEach((region) => {
                if (region.location && region.id && !markersRef.current[region.id]) {
                    const { lat, lng } = region.location;
                    const icon = createColoredIcon(region.color || "#fff200");
                    const marker = L.marker([lat, lng], { icon })
                        .addTo(mapRef.current)
                        .bindTooltip(`${region.name} - ${region.company}`, {
                            permanent: false,
                            direction: "top",
                            className: "model-tooltip"
                        });
                    markersRef.current[region.id] = marker;
                }
            });
        }
    }, [regions]);

    const handleRegionClick = (region) => {
        setSelectedRegion(region);
        if (region.location && mapRef.current) {
            const { lat, lng } = region.location;
            mapRef.current.setView([lat, lng], 13);
        }
    };

    return (
        <ModelAndMapLayout
            leftPanel={
                <>
                    {regionToDelete && (
                        <WarningBox
                            message={`Are you sure you want to delete "${regionToDelete.name}"?`}
                            onConfirm={confirmDelete}
                            onCancel={() => setRegionToDelete(null)}
                        />
                    )}

                    <div className="model-container">
                        <div className="model-list">
                            <div className="model-header">
                                <div className="model-header-top">
                                    <h2>Regions</h2>

                                    <div className="sort-controls">
                                        <label htmlFor="sort-select">Sort:</label>
                                        <select
                                            id="sort-select"
                                            value={sortKey}
                                            onChange={(e) => setSortKey(e.target.value)}
                                        >
                                            <option value="name">Name</option>
                                            <option value="company">Company</option>
                                        </select>
                                        <button
                                            className="sort-arrow"
                                            onClick={() =>
                                                setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                                            }
                                        >
                                            {sortOrder === "asc" ? "↑" : "↓"}
                                        </button>
                                    </div>
                                </div>

                                <div className="search-bar">
                                    <div className="search-input-wrapper">
                                        <input
                                            type="text"
                                            placeholder="Search by region name..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        {searchQuery && (
                                            <button className="clear-search" onClick={() => setSearchQuery("")}>
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                    <Link to="/dashboard/regions/add" className="add-model-button">
                                        + Add
                                    </Link>
                                </div>
                            </div>

                            <div className="model-list-content">
                                <div className="model-boxes">
                                    {Object.entries(groupedRegions).map(([company, regionsInGroup]) => (
                                        <div key={company} className="model-group">
                                            <div
                                                className="model-group-header"
                                                onClick={() => toggleCompanyGroup(company)}
                                            >
                                                <strong>{company}</strong>
                                                <span className="collapse-icon">{expandedCompanies[company] ? "−" : "+"}</span>
                                            </div>

                                            {expandedCompanies[company] && (
                                                <div className="model-group-boxes">
                                                    {regionsInGroup.map((region) => (
                                                        <div
                                                            key={region.id}
                                                            className="model-box"
                                                            onClick={() => handleRegionClick(region)}
                                                        >
                                                            <div className="model-box-top">
                                                                <h3>
                                                                    <span className="model-box-marker">
                                                                        <svg viewBox="0 0 24 40" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M12 0C6 0 0 6 0 12c0 7.5 12 27 12 27s12-19.5 12-27c0-6-6-12-12-12z"
                                                                                fill={region.color} stroke="black" strokeWidth="1.5" />
                                                                            <circle cx="12" cy="12" r="4" fill="white" />
                                                                        </svg>
                                                                    </span>
                                                                    {region.name}
                                                                </h3>
                                                                <div className="model-actions">
                                                                    <Link to={`/dashboard/regions/${region.id}/edit`}>
                                                                        <FaEdit className="action-icon edit" />
                                                                    </Link>
                                                                    <button
                                                                        className="action-icon delete"
                                                                        onClick={(e) => handleDeleteRequest(e, region)}
                                                                    >
                                                                        <FaTrash />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
            rightPanel={<div id="map" className="model-map" />}
        />
    );

}

export default Regions;
