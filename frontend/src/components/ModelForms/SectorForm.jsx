import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

import api from "../../api.js";
import "../../styles/ModelAndMapLayout.css";

function SectorForm({ initialData = {}, onSubmit, onCancel }) {
    const [name, setName] = useState(initialData.name || "");
    const [totalWater, setTotalWater] = useState(initialData.total_water_requirement || 0);
    const [shape, setShape] = useState(initialData.shape || "");
    const [color, setColor] = useState(initialData.color || "#0000FF");
    const [regionId, setRegionId] = useState(initialData.region_id || "");
    const [regions, setRegions] = useState([]);

    const mapRef = useRef(null);
    const drawnItemsRef = useRef(null);
    const drawnLayerRef = useRef(null);

    useEffect(() => {
        api.get("/api/regions/")
            .then(res => setRegions(res.data))
            .catch(err => console.error("Failed to load regions", err));
    }, []);

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
                    polygon: true,
                    marker: false,
                    circle: false,
                    rectangle: false,
                    polyline: false,
                    circlemarker: false
                },
                edit: {
                    featureGroup: drawnItems
                }
            });

            map.addControl(drawControl);

            map.on(L.Draw.Event.CREATED, function (e) {
                if (drawnLayerRef.current) {
                    drawnItems.removeLayer(drawnLayerRef.current);
                }
                const layer = e.layer;

                layer.setStyle({ color: color, fillColor: color, fillOpacity: 0.4 });

                drawnItems.addLayer(layer);
                drawnLayerRef.current = layer;

                const latlngs = layer.getLatLngs()[0];
                const wkt = `SRID=4326;POLYGON((${latlngs.map(p => `${p.lng} ${p.lat}`).join(", ")}))`;
                setShape(wkt);
            });

            map.on(L.Draw.Event.EDITED, function (e) {
                const layers = e.layers;
                layers.eachLayer((layer) => {
                    if (layer instanceof L.Polygon) {
                        const latlngs = layer.getLatLngs()[0];
                        const updatedWKT = `SRID=4326;POLYGON((${latlngs.map(p => `${p.lng} ${p.lat}`).join(", ")}))`;
                        setShape(updatedWKT);
                        drawnLayerRef.current = layer;
                    }
                });
            });


            // Preload existing shape if editing
            if (initialData.shape && initialData.shape.includes("POLYGON")) {
                const match = initialData.shape.replace("SRID=4326;", "").match(/POLYGON\s*\(\((.+)\)\)/);
                if (match) {
                    const latlngs = match[1].split(",").map(pair => {
                        const [lng, lat] = pair.trim().split(" ").map(Number);
                        return [lat, lng];
                    });
                    const polygon = L.polygon(latlngs, {
                        color: color,
                        fillColor: color,
                        fillOpacity: 0.4
                    }).addTo(drawnItems);
                    map.fitBounds(polygon.getBounds());
                    drawnLayerRef.current = polygon;
                }
            }
        }
    }, [initialData.shape]);

    useEffect(() => {
        if (drawnLayerRef.current) {
            drawnLayerRef.current.setStyle({
                color: color,
                fillColor: color,
                fillOpacity: 0.4
            });
        }
    }, [color]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            name,
            total_water_requirement: totalWater,
            shape,
            region_id: regionId,
            color
        });
    };

    return (
        <div className="model-list">
            <h2>{initialData.id ? "Edit Waterway Sector" : "Add Waterway Sector"}</h2>
            <form onSubmit={handleSubmit} className="model-form">
                <label>
                    Name:
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                </label>

                <label>
                    Total Water Requirement:
                    <input
                        type="number"
                        value={totalWater}
                        onChange={e => setTotalWater(parseFloat(e.target.value))}
                        step="0.01"
                        required
                    />
                </label>

                <label>
                    Region:
                    <select value={regionId} onChange={e => setRegionId(e.target.value)} required>
                        <option value="">-- Select a Region --</option>
                        {regions.map((r) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                </label>

                <label>
                    Color:
                    <div className="color-picker-wrapper">
                        <input
                            type="color"
                            value={color}
                            onChange={e => setColor(e.target.value)}
                            className="color-picker-input"
                        />
                        <span className="color-indicator" style={{ backgroundColor: color }} />
                    </div>
                </label>

                <label>
                    Shape:
                    <textarea value={shape} readOnly placeholder="Draw a polygon on the map..." rows={4} />
                </label>

                <div className="form-buttons">
                    <button type="submit" className="submit-button">{initialData.id ? "Save Changes" : "Create"}</button>
                    <button type="button" onClick={onCancel} className="cancel-button">Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default SectorForm;
