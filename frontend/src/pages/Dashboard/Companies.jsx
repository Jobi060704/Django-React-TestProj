import { useEffect, useState, useRef } from "react";
import {Link} from "react-router-dom";
import api from "../../api";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../../styles/Dashboard/Companies.css";

function Companies() {
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const mapRef = useRef(null);
    const markersRef = useRef({});  // Store markers by company ID
    const [sortKey, setSortKey] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchQuery, setSearchQuery] = useState("");

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
            mapRef.current = L.map("company-map").setView([40.4, 49.8], 3);

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
                    const marker = L.marker([lat, lng])
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
        <div className="company-container">
            <div className="company-list">
                <div className="company-header">
                    <div className="company-header-top">
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
                        <input
                            type="text"
                            placeholder="Search by company name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="company-list-content">
                    <div className="company-boxes">
                        {sortedCompanies.map((company) => (
                            <div
                                key={company.id}
                                className="company-box"
                                onClick={() => handleCompanyClick(company)}
                            >
                                <h3>{company.name}</h3>
                                <p>Owner: {company.owner}</p>
                            </div>
                        ))}
                    </div>

                    <div className="add-company-container">
                        <Link to="/dashboard/companies/add" className="add-company-button">
                            + Add a Company
                        </Link>
                    </div>
                </div>
            </div>

            <div className="company-map" id="company-map"></div>
        </div>
    );

}

export default Companies;
