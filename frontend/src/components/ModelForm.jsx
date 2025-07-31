import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/ModelAndMapLayout.css";

function ModelForm({ initialData = {}, onSubmit, onCancel, modelName = "Item" }) {
    const [name, setName] = useState(initialData.name || "");
    const [center, setCenter] = useState(initialData.center || "");
    const [isPicking, setIsPicking] = useState(false);

    const isPickingRef = useRef(false);
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        isPickingRef.current = isPicking;
    }, [isPicking]);

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

            if (initialData.center && initialData.center.includes("POINT")) {
                const wkt = initialData.center.replace("SRID=4326;", "").trim();
                const match = wkt.match(/POINT\s*\(([-\d.]+)\s+([-\d.]+)\)/);
                if (match) {
                    const lng = parseFloat(match[1]);
                    const lat = parseFloat(match[2]);
                    const latlng = L.latLng(lat, lng);
                    mapRef.current.setView(latlng, 10);
                    markerRef.current = L.marker(latlng).addTo(mapRef.current);
                }
            }
        }
    }, [initialData.center]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, center });
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

export default ModelForm;