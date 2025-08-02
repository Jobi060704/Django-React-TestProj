import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import "../../styles/ModelAndMapLayout.css";

function CompanyForm({ initialData = {}, onSubmit, onCancel, modelName = "Company" }) {
    const [name, setName] = useState(initialData.name || "");
    const [center, setCenter] = useState(initialData.center || "");
    const [color, setColor] = useState(initialData.color || "#fff200");
    const [isPicking, setIsPicking] = useState(false);

    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const isPickingRef = useRef(false);

    useEffect(() => {
        isPickingRef.current = isPicking;
    }, [isPicking]);

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
        if (!mapRef.current) {
            const map = L.map("model-map").setView([40.4, 49.8], 5);
            mapRef.current = map;

            L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
                maxZoom: 19,
                attribution: "© ArcGIS"
            }).addTo(map);

            const drawnItems = new L.FeatureGroup();
            map.addLayer(drawnItems);

            const drawControl = new L.Control.Draw({
                draw: {
                    marker: true,
                    polygon: false,
                    circle: false,
                    rectangle: false,
                    polyline: false,
                    circlemarker: false
                },
                edit: { featureGroup: drawnItems }
            });
            map.addControl(drawControl);

            map.on(L.Draw.Event.CREATED, (e) => {
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

            // Preload marker from center WKT
            if (initialData.center && initialData.center.includes("POINT")) {
                const match = initialData.center.replace("SRID=4326;", "").match(/POINT\s*\(([-\d.]+)\s+([-\d.]+)\)/);
                if (match) {
                    const latlng = L.latLng(parseFloat(match[2]), parseFloat(match[1]));
                    map.setView(latlng, 10);
                    const marker = L.marker(latlng, {
                        icon: createColoredIcon(color)
                    }).addTo(map);
                    markerRef.current = marker;
                }
            }
        }
    }, []);

    // Update marker color live when color changes
    useEffect(() => {
        if (markerRef.current && center) {
            const match = center.replace("SRID=4326;", "").match(/POINT\s*\(([-\d.]+)\s+([-\d.]+)\)/);
            if (match) {
                const latlng = L.latLng(parseFloat(match[2]), parseFloat(match[1]));
                const newMarker = L.marker(latlng, { icon: createColoredIcon(color) }).addTo(mapRef.current);
                mapRef.current.removeLayer(markerRef.current);
                markerRef.current = newMarker;
            }
        }
    }, [color]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, center, color });
    };

    return (
        <div className="model-list">
            <h2>{initialData.id ? `Edit ${modelName}` : `Add ${modelName}`}</h2>
            <form onSubmit={handleSubmit} className="model-form">
                <label>
                    {modelName} Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
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
                    </div>
                </label>

                <label>
                    Center:
                    <input
                        type="text"
                        value={center}
                        readOnly
                        placeholder="Place a marker on the map..."
                    />
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

export default CompanyForm;
