import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import "../../styles/ModelAndMapLayout.css";

function CompanyForm({ initialData = {}, onSubmit, onCancel, modelName = "Item" }) {
    const [name, setName] = useState(initialData.name || "");
    const [center, setCenter] = useState(initialData.center || "");
    const [color, setColor] = useState(initialData.color || "#0000ff");
    const [isPicking, setIsPicking] = useState(false);

    const isPickingRef = useRef(false);
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        isPickingRef.current = isPicking;
    }, [isPicking]);

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
                    polyline: false,
                    rectangle: false,
                    circle: false,
                    circlemarker: false
                },
                edit: {
                    featureGroup: drawnItems
                }
            });

            map.addControl(drawControl);

            map.on(L.Draw.Event.CREATED, function (e) {
                drawnItems.clearLayers();
                const marker = e.layer;
                drawnItems.addLayer(marker);
                const { lat, lng } = marker.getLatLng();
                setCenter(`SRID=4326;POINT(${lng} ${lat})`);
            });

            if (initialData.center && initialData.center.includes("POINT")) {
                const wkt = initialData.center.replace("SRID=4326;", "").trim();
                const match = wkt.match(/POINT\s*\(([-\d.]+)\s+([-\d.]+)\)/);
                if (match) {
                    const lng = parseFloat(match[1]);
                    const lat = parseFloat(match[2]);
                    const latlng = L.latLng(lat, lng);
                    map.setView(latlng, 10);
                    const icon = L.divIcon({
                        className: "",
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        html: `<span style="background-color: ${color}; width: 1.2rem; height: 1.2rem; display: block; left: -0.6rem; top: -0.6rem; position: relative; border-radius: 50% 50% 0; transform: rotate(45deg); border: 1px solid #ffffffaa;"></span>`
                    });
                    markerRef.current = L.marker(latlng, { icon }).addTo(map);
                }
            }
        }
    }, [initialData.center, color]);

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
