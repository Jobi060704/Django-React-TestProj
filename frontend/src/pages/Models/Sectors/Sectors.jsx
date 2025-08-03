import { useEffect, useState, useRef } from "react";
import {Link} from "react-router-dom";
import api from "../../../api.js";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "../../../styles/ModelAndMapLayout.css";
import {FaEdit, FaTrash} from "react-icons/fa";
import WarningBox from "../../../components/WarningBox.jsx";
import ModelAndMapLayout from "../../../components/ModelAndMapLayout.jsx";

function Sectors() {
    const [sectors, setSectors] = useState([]);
    const [selectedSector, setSelectedSector] = useState(null);
    const [sectorToDelete, setSectorToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortKey, setSortKey] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [expandedRegions, setExpandedRegions] = useState({});
    const mapRef = useRef(null);
    const polygonsRef = useRef({}); // sector.id -> polygon

    const toggleRegionGroup = (region) => {
        setExpandedRegions((prev) => ({
            ...prev,
            [region]: !prev[region],
        }));
    };

    const handleDeleteRequest = (e, sector) => {
        e.stopPropagation();
        setSectorToDelete(sector);
    };

    const confirmDelete = () => {
        api.delete(`/api/sectors/${sectorToDelete.id}/`)
            .then(() => {
                setSectors((prev) => prev.filter((s) => s.id !== sectorToDelete.id));
                setSectorToDelete(null);
            })
            .catch((err) => {
                console.error("Failed to delete sector", err);
                alert("Failed to delete sector.");
                setSectorToDelete(null);
            });
    };

    const filteredSectors = sectors.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedSectors = [...filteredSectors].sort((a, b) => {
        const valA = a[sortKey]?.toLowerCase?.() || "";
        const valB = b[sortKey]?.toLowerCase?.() || "";
        return sortOrder === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
    });

    const groupedSectors = sortedSectors.reduce((acc, sector) => {
        const region = sector.region || "Unknown";
        if (!acc[region]) acc[region] = [];
        acc[region].push(sector);
        return acc;
    }, {});

    // Load & parse sectors
    useEffect(() => {
        api.get("/api/sectors/")
            .then((res) => {
                const parsed = res.data.map((sector) => {
                    let polygonCoords = [];

                    if (sector.shape && sector.shape.includes("POLYGON")) {
                        const wkt = sector.shape.replace("SRID=4326;", "").trim();
                        const match = wkt.match(/POLYGON\s*\(\((.+?)\)\)/);

                        if (match) {
                            polygonCoords = match[1].split(",").map((coord) => {
                                const [lng, lat] = coord.trim().split(" ").map(Number);
                                return [lat, lng];
                            });
                        }
                    }

                    return {
                        ...sector,
                        polygonCoords,
                    };
                });

                setSectors(parsed);
            })
            .catch((err) => console.error("Failed to load sectors", err));
    }, []);

    // Setup map once
    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map("map").setView([40.4, 49.8], 3);

            L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
                maxZoom: 19,
                attribution: "© ArcGIS",
            }).addTo(mapRef.current);
        }
    }, []);

    // Draw polygons
    useEffect(() => {
        if (mapRef.current) {
            // Clear old
            Object.values(polygonsRef.current).forEach((polygon) => {
                mapRef.current.removeLayer(polygon);
            });
            polygonsRef.current = {};

            // Draw new
            sectors.forEach((sector) => {
                if (sector.polygonCoords?.length > 2) {
                    const polygon = L.polygon(sector.polygonCoords, {
                        color: sector.color || "#3388ff",
                        fillOpacity: 0.5,
                        weight: 2,
                    })
                        .addTo(mapRef.current)
                        .bindTooltip(`${sector.name} (${sector.region})`, {
                            permanent: false,
                            direction: "top",
                            className: "model-tooltip",
                        });

                    polygonsRef.current[sector.id] = polygon;
                }
            });
        }
    }, [sectors]);

    const handleSectorClick = (sector) => {
        setSelectedSector(sector);

        const polygon = polygonsRef.current[sector.id];
        if (polygon && mapRef.current) {
            mapRef.current.fitBounds(polygon.getBounds(), { padding: [20, 20] });
        }
    };

    function getMiniSectorSVG(polygonCoords, color = "#888") {
        if (!polygonCoords || polygonCoords.length < 3) return null;

        const lats = polygonCoords.map(([lat]) => lat);
        const lngs = polygonCoords.map(([, lng]) => lng);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);

        const points = polygonCoords
            .map(([lat, lng]) => {
                const scaleLat = (lat - minLat) / (maxLat - minLat || 1);
                const scaleLng = (lng - minLng) / (maxLng - minLng || 1);
                return `${scaleLng * 90 + 5},${90 - scaleLat * 90 + 5}`;
            })
            .join(" ");

        return (
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="mini-sector-svg">
                <polygon
                    points={points}
                    fill={color}
                    stroke="black"
                    strokeWidth="2"
                />
            </svg>
        );
    }


    return (
        <ModelAndMapLayout
            leftPanel={
                <>
                    {sectorToDelete && (
                        <WarningBox
                            message={`Are you sure you want to delete "${sectorToDelete.name}"?`}
                            onConfirm={confirmDelete}
                            onCancel={() => setSectorToDelete(null)}
                        />
                    )}

                    <div className="model-container">
                        <div className="model-list">
                            <div className="model-header">
                                <div className="model-header-top">
                                    <h2>Sectors</h2>

                                    <div className="sort-controls">
                                        <label htmlFor="sort-select">Sort:</label>
                                        <select
                                            id="sort-select"
                                            value={sortKey}
                                            onChange={(e) => setSortKey(e.target.value)}
                                        >
                                            <option value="name">Name</option>
                                            <option value="region">Region</option>
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
                                            placeholder="Search by sector name..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        {searchQuery && (
                                            <button className="clear-search" onClick={() => setSearchQuery("")}>
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                    <Link to="/dashboard/sectors/add" className="add-model-button">
                                        + Add
                                    </Link>
                                </div>
                            </div>

                            <div className="model-list-content">
                                <div className="model-boxes">
                                    {Object.entries(groupedSectors).map(([region, group]) => (
                                        <div key={region} className="model-group">
                                            <div
                                                className="model-group-header"
                                                onClick={() => toggleRegionGroup(region)}
                                            >
                                                <strong>{region}</strong>
                                                <span className="collapse-icon">
                                                    {expandedRegions[region] ? "−" : "+"}
                                                </span>
                                            </div>

                                            {expandedRegions[region] && (
                                                <div className="model-group-boxes">
                                                    {group.map((sector) => (
                                                        <div
                                                            key={sector.id}
                                                            className="model-box"
                                                            onClick={() => handleSectorClick(sector)}
                                                        >
                                                            <div className="model-box-top">
                                                                <h3>
                                                                    <span className="model-box-mini-shape">
                                                                        {getMiniSectorSVG(sector.polygonCoords, sector.color)}
                                                                    </span>
                                                                    {sector.name}
                                                                </h3>
                                                                <div className="model-actions">
                                                                    <Link to={`/dashboard/sectors/${sector.id}/edit`}>
                                                                        <FaEdit className="action-icon edit" />
                                                                    </Link>
                                                                    <button
                                                                        className="action-icon delete"
                                                                        onClick={(e) => handleDeleteRequest(e, sector)}
                                                                    >
                                                                        <FaTrash />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <p>{sector.pivot_count} pivots</p>
                                                            <p>{sector.area_ha?.toFixed(2)} ha</p>
                                                            <p>{sector.total_pivot_area?.toFixed(2)} pivot ha</p>
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

export default Sectors;
