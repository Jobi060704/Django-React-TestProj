import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import api from "../../api.js";
import "../../styles/ModelAndMapLayout.css";

function RegionForm({ initialData = {}, onSubmit, onCancel }) {
    const [name, setName] = useState(initialData.name || "");
    const [center, setCenter] = useState(initialData.center || "");
    const [companyId, setCompanyId] = useState(initialData.company_id || "");
    const [color, setColor] = useState(initialData.color || "#FF0000");
    const [companies, setCompanies] = useState([]);

    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const drawnItemsRef = useRef(null);

    // Colored Leaflet icon
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

    // Load companies
    useEffect(() => {
        api.get("/api/companies/")
            .then(res => setCompanies(res.data))
            .catch(err => console.error("Failed to fetch companies", err));
    }, []);

    // Init map and draw toolbar
    useEffect(() => {
        if (!mapRef.current) {
            const map = L.map("model-map").setView([40.4, 49.8], 5);
            mapRef.current = map;

            L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
                maxZoom: 19,
                attribution: "© ArcGIS"
            }).addTo(map);

            const drawnItems = new L.FeatureGroup();
            drawnItemsRef.current = drawnItems;
            map.addLayer(drawnItems);

            const drawControl = new L.Control.Draw({
                draw: {
                    marker: true,
                    polygon: false,
                    polyline: false,
                    rectangle: false,
                    circle: false,
                    circlemarker: false
                },
                edit: { featureGroup: drawnItems }
            });
            map.addControl(drawControl);

            // Handle marker placement
            map.on(L.Draw.Event.CREATED, function (e) {
                if (markerRef.current) {
                    drawnItems.removeLayer(markerRef.current);
                }

                const layer = e.layer;
                const { lat, lng } = layer.getLatLng();
                const wkt = `SRID=4326;POINT(${lng} ${lat})`;
                setCenter(wkt);

                const coloredMarker = L.marker([lat, lng], {
                    icon: createColoredIcon(color)
                }).addTo(map);
                drawnItems.addLayer(coloredMarker);
                markerRef.current = coloredMarker;
            });

            // Preload existing marker if editing
            if (initialData.center && initialData.center.includes("POINT")) {
                const match = initialData.center.replace("SRID=4326;", "").match(/POINT\s*\(([-\d.]+)\s+([-\d.]+)\)/);
                if (match) {
                    const latlng = L.latLng(parseFloat(match[2]), parseFloat(match[1]));
                    map.setView(latlng, 10);
                    const marker = L.marker(latlng, {
                        icon: createColoredIcon(color)
                    }).addTo(drawnItems);
                    markerRef.current = marker;
                    setCenter(initialData.center);
                }
            }
        }
    }, [initialData.center]);

    // Live marker color update
    useEffect(() => {
        if (markerRef.current && center) {
            const match = center.replace("SRID=4326;", "").match(/POINT\s*\(([-\d.]+)\s+([-\d.]+)\)/);
            if (match) {
                const latlng = L.latLng(parseFloat(match[2]), parseFloat(match[1]));
                const newMarker = L.marker(latlng, { icon: createColoredIcon(color) }).addTo(mapRef.current);
                mapRef.current.removeLayer(markerRef.current);
                markerRef.current = newMarker;
                drawnItemsRef.current.addLayer(newMarker);
            }
        }
    }, [color]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, center, company_id: companyId, color });
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
                    Color:
                    <div className="color-picker-wrapper">
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="color-picker-input"
                        />
                        <span className="color-indicator" style={{ backgroundColor: color }} />
                    </div>
                </label>

                <label>
                    Center:
                    <input
                        type="text"
                        value={center}
                        readOnly
                        placeholder="Use the map toolbar to place marker"
                    />
                    <p style={{ fontSize: "0.8rem", color: "#666" }}>
                        Use the marker tool on the map to set the center.
                    </p>
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
