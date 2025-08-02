import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../../api.js";
import "../../styles/ModelAndMapLayout.css";

function SectorForm({ initialData = {}, onSubmit, onCancel }) {
    const [name, setName] = useState(initialData.name || "");
    const [shape, setShape] = useState(initialData.shape || "");
    const [regionId, setRegionId] = useState(initialData.region_id || "");
    const [regions, setRegions] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);

    const mapRef = useRef(null);
    const polygonRef = useRef(null);
    const drawnLatLngs = useRef([]);

    useEffect(() => {
        api.get("/api/regions/")
            .then((res) => setRegions(res.data))
            .catch((err) => console.error("Failed to fetch regions", err));
    }, []);

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map("model-map").setView([40.4, 49.8], 6);

            L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
                maxZoom: 19,
                attribution: "© ArcGIS"
            }).addTo(mapRef.current);

            mapRef.current.on("click", (e) => {
                if (!isDrawing) return;

                drawnLatLngs.current.push([e.latlng.lng, e.latlng.lat]);

                if (polygonRef.current) {
                    polygonRef.current.setLatLngs([drawnLatLngs.current.map(([lng, lat]) => [lat, lng])]);
                } else {
                    polygonRef.current = L.polygon(
                        drawnLatLngs.current.map(([lng, lat]) => [lat, lng]),
                        { color: "blue" }
                    ).addTo(mapRef.current);
                }
            });
        }
    }, [isDrawing]);

    const convertToWKT = () => {
        if (drawnLatLngs.current.length < 3) return "";
        const coords = [...drawnLatLngs.current, drawnLatLngs.current[0]]; // close loop
        const coordString = coords.map(([lng, lat]) => `${lng} ${lat}`).join(", ");
        return `SRID=4326;POLYGON((${coordString}))`;
    };

    const handleDrawFinish = () => {
        const wkt = convertToWKT();
        if (wkt) setShape(wkt);
        setIsDrawing(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            name,
            shape,
            region_id: regionId
        });
    };

    return (
        <div className="model-list">
            <h2>{initialData.id ? "Edit Sector" : "Add Sector"}</h2>
            <form onSubmit={handleSubmit} className="model-form">
                <label>
                    Sector Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Region:
                    <select
                        value={regionId}
                        onChange={(e) => setRegionId(e.target.value)}
                        required
                    >
                        <option value="">-- Select a Region --</option>
                        {regions.map((r) => (
                            <option key={r.id} value={r.id}>
                                {r.name} ({r.company})
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Shape:
                    <input
                        type="text"
                        value={shape}
                        readOnly
                        placeholder="Click map to draw polygon"
                    />
                    <button
                        type="button"
                        className="pick-center-button"
                        onClick={() => {
                            drawnLatLngs.current = [];
                            if (polygonRef.current) {
                                mapRef.current.removeLayer(polygonRef.current);
                                polygonRef.current = null;
                            }
                            setIsDrawing(true);
                        }}
                    >
                        Draw Polygon
                    </button>
                    {isDrawing && (
                        <button
                            type="button"
                            className="finish-draw-button"
                            onClick={handleDrawFinish}
                        >
                            Finish Drawing
                        </button>
                    )}
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

export default SectorForm;
