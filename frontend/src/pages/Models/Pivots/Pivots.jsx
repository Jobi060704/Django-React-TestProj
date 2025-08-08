import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../../../api.js";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import "../../../styles/ModelAndMapLayout.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import WarningBox from "../../../components/WarningBox.jsx";
import ModelAndMapLayout from "../../../components/ModelAndMapLayout.jsx";

function Pivots() {
    const [pivots, setPivots] = useState([]);
    const [pivotToDelete, setPivotToDelete] = useState(null);
    const [selectedPivot, setSelectedPivot] = useState(null);
    const [sortKey, setSortKey] = useState("logical_name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedSectors, setExpandedSectors] = useState({});
    const mapRef = useRef(null);
    const circlesRef = useRef({});

    const toggleSectorGroup = (sector) => {
        setExpandedSectors(prev => ({
            ...prev,
            [sector]: !prev[sector]
        }));
    };

    const handleDeleteRequest = (e, pivot) => {
        e.stopPropagation();
        setPivotToDelete(pivot);
    };

    const confirmDelete = () => {
        api.delete(`/api/pivots/${pivotToDelete.id}/`)
            .then(() => {
                setPivots(prev => prev.filter(p => p.id !== pivotToDelete.id));
                setPivotToDelete(null);
            })
            .catch(err => {
                console.error("Failed to delete pivot", err);
                alert("Failed to delete pivot.");
                setPivotToDelete(null);
            });
    };

    const filteredPivots = pivots.filter(p =>
        p.logical_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedPivots = [...filteredPivots].sort((a, b) => {
        const valA = a[sortKey]?.toLowerCase?.() || "";
        const valB = b[sortKey]?.toLowerCase?.() || "";
        return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    const groupedPivots = sortedPivots.reduce((acc, pivot) => {
        const sector = pivot.sector || "Unknown";
        if (!acc[sector]) acc[sector] = [];
        acc[sector].push(pivot);
        return acc;
    }, {});

    const createCircleIcon = (hexColor) => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill={hexColor} stroke="black" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="2" fill="black" />
        </svg>
    );

    useEffect(() => {
        api.get("/api/pivots/")
            .then((res) => {
                const parsed = res.data.map((pivot) => {
                    let lat = null, lng = null;
                    if (pivot.center && pivot.center.includes("POINT")) {
                        const wkt = pivot.center.replace("SRID=4326;", "").trim();
                        const match = wkt.match(/POINT\s*\(([-\d.]+)\s+([-\d.]+)\)/);
                        if (match) {
                            lng = parseFloat(match[1]);
                            lat = parseFloat(match[2]);
                        }
                    }
                    return {
                        ...pivot,
                        location: lat && lng ? { lat, lng } : null
                    };
                });
                setPivots(parsed);
            })
            .catch((err) => console.error("Failed to load pivots", err));
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
        if (mapRef.current) {
            Object.values(circlesRef.current).forEach(circle => mapRef.current.removeLayer(circle));
            circlesRef.current = {};

            pivots.forEach(pivot => {
                if (pivot.location) {
                    const circle = L.circle(pivot.location, {
                        radius: pivot.radius_m,
                        color: pivot.color || "#3388ff",
                        fillOpacity: 0.5,
                        weight: 2
                    })
                        .addTo(mapRef.current)
                        .bindTooltip(`${pivot.logical_name} (${pivot.sector})`, {
                            permanent: false,
                            direction: "top",
                            className: "model-tooltip"
                        });

                    circlesRef.current[pivot.id] = circle;
                }
            });
        }
    }, [pivots]);

    const handlePivotClick = (pivot) => {
        setSelectedPivot(pivot);
        if (pivot.location && mapRef.current) {
            mapRef.current.setView([pivot.location.lat, pivot.location.lng], 14);
        }
    };

    return (
        <ModelAndMapLayout
            leftPanel={
                <>
                    {pivotToDelete && (
                        <WarningBox
                            message={`Are you sure you want to delete "${pivotToDelete.logical_name}"?`}
                            onConfirm={confirmDelete}
                            onCancel={() => setPivotToDelete(null)}
                        />
                    )}

                    <div className="model-container">
                        <div className="model-list">
                            <div className="model-header">
                                <div className="model-header-top">
                                    <h2>Pivots</h2>
                                    <div className="sort-controls">
                                        <label htmlFor="sort-select">Sort:</label>
                                        <select
                                            id="sort-select"
                                            value={sortKey}
                                            onChange={(e) => setSortKey(e.target.value)}
                                        >
                                            <option value="logical_name">Name</option>
                                            <option value="sector">Sector</option>
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
                                            placeholder="Search by name..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        {searchQuery && (
                                            <button className="clear-search" onClick={() => setSearchQuery("")}>✕</button>
                                        )}
                                    </div>
                                    <Link to="/dashboard/pivots/add" className="add-model-button">
                                        + Add
                                    </Link>
                                </div>
                            </div>

                            <div className="model-list-content">
                                <div className="model-boxes">
                                    {Object.entries(groupedPivots).map(([sector, pivotsInGroup]) => (
                                        <div key={sector} className="model-group">
                                            <div
                                                className="model-group-header"
                                                onClick={() => toggleSectorGroup(sector)}
                                            >
                                                <strong>{sector}</strong>
                                                <span className="collapse-icon">{expandedSectors[sector] ? "−" : "+"}</span>
                                            </div>

                                            {expandedSectors[sector] && (
                                                <div className="model-group-boxes">
                                                    {pivotsInGroup.map((pivot) => (
                                                        <div
                                                            key={pivot.id}
                                                            className="model-box"
                                                            onClick={() => handlePivotClick(pivot)}
                                                        >
                                                            <div className="model-box-top">
                                                                <h3>
                                                                    <span className="model-box-marker">
                                                                        {createCircleIcon(pivot.color)}
                                                                    </span>
                                                                    {pivot.logical_name}
                                                                </h3>
                                                                <div className="model-actions">
                                                                    <Link to={`/dashboard/pivots/${pivot.id}/edit`}>
                                                                        <FaEdit className="action-icon edit" />
                                                                    </Link>
                                                                    <button
                                                                        className="action-icon delete"
                                                                        onClick={(e) => handleDeleteRequest(e, pivot)}
                                                                    >
                                                                        <FaTrash />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <p>{pivot.crops.length} crop types</p>
                                                            <p>{pivot.area?.toFixed(2)} ha</p>
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

export default Pivots;
