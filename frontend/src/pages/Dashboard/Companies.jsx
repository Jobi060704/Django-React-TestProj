import { useEffect, useState, useRef } from "react";
import api from "../../api";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../../styles/Dashboard/Companies.css";

function Companies() {
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const mapRef = useRef(null);
    const markersRef = useRef({});  // Store markers by company ID

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
                attribution: "© ArcGIS All rights reserved. -------"
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

    return (
        <div className="company-container">
            <div className="company-table">
                <h2>Companies</h2>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Owner</th>
                    </tr>
                    </thead>
                    <tbody>
                    {companies.map((company) => (
                        <tr
                            key={company.id}
                            onClick={() => {
                                setSelectedCompany(company);
                                if (company.location && mapRef.current) {
                                    const { lat, lng } = company.location;
                                    mapRef.current.setView([lat, lng], 13);
                                }
                            }}
                            style={{ cursor: "pointer" }}
                        >
                            <td>{company.id}</td>
                            <td>{company.name}</td>
                            <td>{company.owner}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="company-map" id="company-map"></div>
        </div>
    );
}

export default Companies;
