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

function Regions() {
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const mapRef = useRef(null);
    const markersRef = useRef({});  // Store markers by company ID
    const [sortKey, setSortKey] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchQuery, setSearchQuery] = useState("");
    const [companyToDelete, setCompanyToDelete] = useState(null);
    const [expandedOwners, setExpandedOwners] = useState({});

    const toggleOwnerGroup = (owner) => {
        setExpandedOwners(prev => ({
            ...prev,
            [owner]: !prev[owner]
        }));
    };

    const handleDeleteRequest = (e, company) => {
        e.stopPropagation();
        setCompanyToDelete(company);
    };

    const confirmDelete = () => {
        api.delete(`/api/companies/${companyToDelete.id}/`)
            .then(() => {
                setCompanies((prev) => prev.filter(c => c.id !== companyToDelete.id));
                setCompanyToDelete(null);
            })
            .catch((err) => {
                console.error("Failed to delete company", err);
                alert("Failed to delete company.");
                setCompanyToDelete(null);
            });
    };


    const filteredCompanies = companies.filter((company) =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedCompanies = [...filteredCompanies].sort((a, b) => {
        const valA = a[sortKey]?.toLowerCase?.() || "";
        const valB = b[sortKey]?.toLowerCase?.() || "";
        return sortOrder === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
    });

    const groupedCompanies = sortedCompanies.reduce((acc, company) => {
        const owner = company.owner || "Unknown";
        if (!acc[owner]) acc[owner] = [];
        acc[owner].push(company);
        return acc;
    }, {});



    // Load and parse companies
    useEffect(() => {
        api.get("/api/companies/")
            .then((res) => {
                const parsedCompanies = res.data.map((company) => {
                    let lat = null, lng = null;

                    if (company.center && company.center.includes("POINT")) {
                        const wkt = company.center.replace("SRID=4326;", "").trim();
                        const match = wkt.match(/POINT\s*\(([-\d.]+)\s+([-\d.]+)\)/);
                        if (match) {
                            lng = parseFloat(match[1]);
                            lat = parseFloat(match[2]);
                        }
                    }

                    return {
                        ...company,
                        location: lat && lng ? { lat, lng } : null
                    };
                });

                setCompanies(parsedCompanies);
            })
            .catch((err) => console.error("Failed to load companies", err));
    }, []);

    // Initialize map once
    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map("map").setView([40.4, 49.8], 3);

            L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
                maxZoom: 19,
                attribution: "© ArcGIS"
            }).addTo(mapRef.current);
        }
    }, []);

    // Once companies are loaded, add all pins
    useEffect(() => {
        if (mapRef.current && companies.length) {
            companies.forEach((company) => {
                if (
                    company.location &&
                    company.id &&
                    !markersRef.current[company.id]
                ) {
                    const { lat, lng } = company.location;

                    const customIcon = L.icon({
                        iconUrl: "/marker-icon.png",      // public path
                        shadowUrl: "/marker-shadow.png",
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41],
                    });

                    const marker = L.marker([lat, lng], { icon: customIcon })
                        .addTo(mapRef.current)
                        .bindTooltip((company.name + " - " + company.owner), {
                            permanent: false,
                            direction: "top",
                            className: "company-tooltip"
                        });

                    markersRef.current[company.id] = marker;
                }
            });
        }
    }, [companies]);

    const handleCompanyClick = (company) => {
        setSelectedCompany(company);
        if (company.location && mapRef.current) {
            const { lat, lng } = company.location;
            mapRef.current.setView([lat, lng], 13);
        }
    };

    return (
        <ModelAndMapLayout
            leftPanel={
                <>
                    {companyToDelete && (
                        <WarningBox
                            message={`Are you sure you want to delete "${companyToDelete.name}"?`}
                            onConfirm={confirmDelete}
                            onCancel={() => setCompanyToDelete(null)}
                        />
                    )}

                    <div className="model-container">
                        <div className="model-list">
                            <div className="model-header">
                                <div className="model-header-top">
                                    <h2>Companies</h2>

                                    <div className="sort-controls">
                                        <label htmlFor="sort-select">Sort:</label>
                                        <select
                                            id="sort-select"
                                            value={sortKey}
                                            onChange={(e) => setSortKey(e.target.value)}
                                        >
                                            <option value="name">Name</option>
                                            <option value="owner">Owner</option>
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
                                            placeholder="Search by company name..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        {searchQuery && (
                                            <button className="clear-search" onClick={() => setSearchQuery("")}>
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                    <Link to="/dashboard/companies/add" className="add-model-button">
                                        + Add
                                    </Link>
                                </div>
                            </div>

                            <div className="model-list-content">
                                <div className="model-boxes">
                                    {Object.entries(groupedCompanies).map(([owner, companiesInGroup]) => (
                                        <div key={owner} className="model-group">
                                            <div
                                                className="model-group-header"
                                                onClick={() => toggleOwnerGroup(owner)}
                                            >
                                                <strong>{owner}</strong>
                                                <span className="collapse-icon">{expandedOwners[owner] ? "−" : "+"}</span>
                                            </div>

                                            {expandedOwners[owner] && (
                                                <div className="model-group-boxes">
                                                    {companiesInGroup.map((company) => (
                                                        <div
                                                            key={company.id}
                                                            className="model-box"
                                                            onClick={() => handleCompanyClick(company)}
                                                        >
                                                            <div className="model-box-top">
                                                                <h3>{company.name}</h3>
                                                                <div className="model-actions">
                                                                    <Link to={`/dashboard/companies/${company.id}/edit`}>
                                                                        <FaEdit className="action-icon edit" />
                                                                    </Link>
                                                                    <button
                                                                        className="action-icon delete"
                                                                        onClick={(e) => handleDeleteRequest(e, company)}
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
