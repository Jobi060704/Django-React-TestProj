// src/pages/Dashboard/Companies.jsx
import { useEffect, useState, useRef } from "react";
import api from "../../api";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../../styles/Dashboard/Companies.css";

function Companies() {
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const mapRef = useRef(null);

    // Load companies
    useEffect(() => {
        api.get("/api/companies/")
            .then((res) => {
                // Dummy coordinates added
                const withCoords = res.data.map((company, index) => ({
                    ...company,
                    location: {
                        lat: 40.4 + index * 0.1,
                        lng: 49.8 + index * 0.1
                    }
                }));
                setCompanies(withCoords);
            })
            .catch((err) => console.error("Failed to load companies", err));
    }, []);

    // Initialize map
    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map("company-map").setView([40.4, 49.8], 7);

            L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
                maxZoom: 19,
                attribution: "© Esri, Maxar, Earthstar Geographics, and the GIS User Community"
            }).addTo(mapRef.current);
        }
    }, []);

    // Move map when company is selected
    useEffect(() => {
        if (selectedCompany && mapRef.current) {
            const { lat, lng } = selectedCompany.location;
            mapRef.current.setView([lat, lng], 12);
        }
    }, [selectedCompany]);

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
                            onClick={() => setSelectedCompany(company)}
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
