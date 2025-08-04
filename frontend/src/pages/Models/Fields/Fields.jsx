import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../../../api.js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import WarningBox from "../../../components/WarningBox.jsx";
import ModelAndMapLayout from "../../../components/ModelAndMapLayout.jsx";

function Fields() {
    const [fields, setFields] = useState([]);
    const [fieldToDelete, setFieldToDelete] = useState(null);
    const [selectedField, setSelectedField] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortKey, setSortKey] = useState("logical_name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [expandedSectors, setExpandedSectors] = useState({});
    const mapRef = useRef(null);
    const polygonsRef = useRef({});

    const toggleSectorGroup = (sector) => {
        setExpandedSectors(prev => ({ ...prev, [sector]: !prev[sector] }));
    };

    const handleDeleteRequest = (e, field) => {
        e.stopPropagation();
        setFieldToDelete(field);
    };

    const confirmDelete = () => {
        api.delete(`/api/fields/${fieldToDelete.id}/`)
            .then(() => {
                setFields(prev => prev.filter(f => f.id !== fieldToDelete.id));
                setFieldToDelete(null);
            })
            .catch(err => {
                console.error("Failed to delete field", err);
                alert("Failed to delete field.");
                setFieldToDelete(null);
            });
    };

    const filteredFields = fields.filter(f =>
        f.logical_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedFields = [...filteredFields].sort((a, b) => {
        const valA = a[sortKey]?.toLowerCase?.() || "";
        const valB = b[sortKey]?.toLowerCase?.() || "";
        return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    const groupedFields = sortedFields.reduce((acc, field) => {
        const sector = field.sector || "Unknown";
        if (!acc[sector]) acc[sector] = [];
        acc[sector].push(field);
        return acc;
    }, {});

    useEffect(() => {
        api.get("/api/fields/")
            .then((res) => {
                const parsed = res.data.map((field) => {
                    let polygonCoords = [];
                    if (field.shape && field.shape.includes("POLYGON")) {
                        const wkt = field.shape.replace("SRID=4326;", "").trim();
                        const match = wkt.match(/POLYGON\s*\(\((.+?)\)\)/);
                        if (match) {
                            polygonCoords = match[1].split(",").map((coord) => {
                                const [lng, lat] = coord.trim().split(" ").map(Number);
                                return [lat, lng];
                            });
                        }
                    }
                    return {
                        ...field,
                        polygonCoords,
                    };
                });
                setFields(parsed);
            })
            .catch((err) => console.error("Failed to load fields", err));
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
            Object.values(polygonsRef.current).forEach(polygon => mapRef.current.removeLayer(polygon));
            polygonsRef.current = {};

            fields.forEach(field => {
                if (field.polygonCoords?.length > 2) {
                    const polygon = L.polygon(field.polygonCoords, {
                        color: field.color || "#3388ff",
                        fillOpacity: 0.5,
                        weight: 2
                    })
                        .addTo(mapRef.current)
                        .bindTooltip(`${field.logical_name} (${field.sector})`, {
                            permanent: false,
                            direction: "top",
                            className: "model-tooltip"
                        });

                    polygonsRef.current[field.id] = polygon;
                }
            });
        }
    }, [fields]);

    const handleFieldClick = (field) => {
        setSelectedField(field);
        const polygon = polygonsRef.current[field.id];
        if (polygon && mapRef.current) {
            mapRef.current.fitBounds(polygon.getBounds(), { padding: [20, 20] });
        }
    };

    const getMiniFieldSVG = (polygonCoords, color = "#888") => {
        if (!polygonCoords || polygonCoords.length < 3) return null;
        const lats = polygonCoords.map(([lat]) => lat);
        const lngs = polygonCoords.map(([, lng]) => lng);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);

        const points = polygonCoords.map(([lat, lng]) => {
            const scaleLat = (lat - minLat) / (maxLat - minLat || 1);
            const scaleLng = (lng - minLng) / (maxLng - minLng || 1);
            return `${scaleLng * 90 + 5},${90 - scaleLat * 90 + 5}`;
        }).join(" ");

        return (
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="mini-sector-svg">
                <polygon points={points} fill={color} stroke="black" strokeWidth="2" />
            </svg>
        );
    };

    return (
        <ModelAndMapLayout
            leftPanel={
                <>
                    {fieldToDelete && (
                        <WarningBox
                            message={`Are you sure you want to delete "${fieldToDelete.logical_name}"?`}
                            onConfirm={confirmDelete}
                            onCancel={() => setFieldToDelete(null)}
                        />
                    )}

                    <div className="model-container">
                        <div className="model-list">
                            <div className="model-header">
                                <div className="model-header-top">
                                    <h2>Fields</h2>
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
                                            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
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
                                    <Link to="/dashboard/fields/add" className="add-model-button">
                                        + Add
                                    </Link>
                                </div>
                            </div>

                            <div className="model-list-content">
                                <div className="model-boxes">
                                    {Object.entries(groupedFields).map(([sector, group]) => (
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
                                                    {group.map((field) => (
                                                        <div
                                                            key={field.id}
                                                            className="model-box"
                                                            onClick={() => handleFieldClick(field)}
                                                        >
                                                            <div className="model-box-top">
                                                                <h3>
                                                                    <span className="model-box-mini-shape">
                                                                        {getMiniFieldSVG(field.polygonCoords, field.color)}
                                                                    </span>
                                                                    {field.logical_name}
                                                                </h3>
                                                                <div className="model-actions">
                                                                    <Link to={`/dashboard/fields/${field.id}/edit`}>
                                                                        <FaEdit className="action-icon edit" />
                                                                    </Link>
                                                                    <button
                                                                        className="action-icon delete"
                                                                        onClick={(e) => handleDeleteRequest(e, field)}
                                                                    >
                                                                        <FaTrash />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <p>{field.crop_1}{field.crop_2 && ", " + field.crop_2}</p>
                                                            <p>{field.area?.toFixed(2)} ha</p>
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

export default Fields;
