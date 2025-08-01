import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../api";
import "../styles/ModelAndMapLayout.css";

function RegionForm({ initialData = {}, onSubmit, onCancel }) {
    const [name, setName] = useState(initialData.name || "");
    const [center, setCenter] = useState(initialData.center || "");
    const [companyId, setCompanyId] = useState("");
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        api.get("/api/companies/")
            .then((res) => {
                setCompanies(res.data);

                // Match by name if we have initialData.company as string
                if (initialData.company) {
                    const matchedCompany = res.data.find(
                        (c) => c.name === initialData.company
                    );
                    if (matchedCompany) {
                        setCompanyId(matchedCompany.id);
                    }
                }
            })
            .catch((err) => console.error("Failed to load companies", err));
    }, [initialData.company]);
    const [isPicking, setIsPicking] = useState(false);

    const isPickingRef = useRef(false);
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        isPickingRef.current = isPicking;
    }, [isPicking]);

    // Load companies
    useEffect(() => {
        api.get("/api/companies/")
            .then((res) => setCompanies(res.data))
            .catch((err) => console.error("Failed to fetch companies", err));
    }, []);

    // Setup map
    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map("model-map").setView([40.4, 49.8], 5);

            L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
                maxZoom: 19,
                attribution: "© ArcGIS"
            }).addTo(mapRef.current);

            mapRef.current.on("click", (e) => {
                if (!isPickingRef.current) return;

                const { lat, lng } = e.latlng;
                const wkt = `SRID=4326;POINT(${lng} ${lat})`;
                setCenter(wkt);
                setIsPicking(false);

                if (markerRef.current) {
                    markerRef.current.setLatLng(e.latlng);
                } else {
                    markerRef.current = L.marker(e.latlng).addTo(mapRef.current);
                }
            });

            // Initialize with marker if available
            if (initialData.center && initialData.center.includes("POINT")) {
                const match = initialData.center.replace("SRID=4326;", "").match(/POINT\s*\(([-\d.]+)\s+([-\d.]+)\)/);
                if (match) {
                    const latlng = L.latLng(parseFloat(match[2]), parseFloat(match[1]));
                    mapRef.current.setView(latlng, 10);
                    markerRef.current = L.marker(latlng).addTo(mapRef.current);
                }
            }
        }
    }, [initialData.center]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            name,
            center,
            company_id: companyId
        });
    };

    return (
        <div className="model-list">
            <h2>{initialData.id ? "Edit Region" : "Add Region"}</h2>
            <form onSubmit={handleSubmit} className="model-form">
                <label>
                    Region Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Company:
                    <select
                        value={companyId}
                        onChange={(e) => setCompanyId(e.target.value)}
                        required
                    >
                        <option value="">-- Select a Company --</option>
                        {companies.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Center:
                    <input
                        type="text"
                        value={center}
                        readOnly
                        placeholder="Click 'Pick on Map'..."
                    />
                    <button
                        type="button"
                        className="pick-center-button"
                        onClick={() => setIsPicking(true)}
                    >
                        Pick on Map
                    </button>
                </label>

                <div className="form-buttons">
                    <button type="submit" className="submit-button">
                        {initialData.id ? "Save Changes" : "Create"}
                    </button>
                    <button type="button" onClick={onCancel} className="cancel-button">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RegionForm;
