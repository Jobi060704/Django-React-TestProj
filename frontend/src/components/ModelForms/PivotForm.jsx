import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import api from "../../api.js";
import "../../styles/ModelAndMapLayout.css";

function PivotForm({ initialData = {}, onSubmit, onCancel }) {
    const [logicalName, setLogicalName] = useState(initialData.logical_name || "");
    const [center, setCenter] = useState(initialData.center || "");
    const [radius, setRadius] = useState(initialData.radius_m || 500);
    const [sectorId, setSectorId] = useState(initialData.sector_id || "");
    const [color, setColor] = useState(initialData.color || "#FF0000");
    const [area, setArea] = useState(initialData.area || 0);
    const [sectors, setSectors] = useState([]);

    const [crop1, setCrop1] = useState(initialData.crop_1 || "none");
    const [crop2, setCrop2] = useState(initialData.crop_2 || "none");
    const [crop3, setCrop3] = useState(initialData.crop_3 || "none");
    const [crop4, setCrop4] = useState(initialData.crop_4 || "none");
    const [seedingDate, setSeedingDate] = useState(initialData.seeding_date || "");
    const [harvestDate, setHarvestDate] = useState(initialData.harvest_date || "");

    const cropOptions = [
        { value: "none", label: "None" },
        { value: "corn", label: "Corn" },
        { value: "wheat", label: "Wheat" },
        { value: "soybean", label: "Soybean" },
        { value: "barley", label: "Barley" },
        { value: "canola", label: "Canola" },
        { value: "sunflower", label: "Sunflower" },
        { value: "potato", label: "Potato" },
    ];


    const mapRef = useRef(null);
    const circleRef = useRef(null);
    const drawnItemsRef = useRef(null);

    const isDuplicateCrop = (crop, others) => crop !== "none" && others.includes(crop);

    useEffect(() => {
        api.get("/api/sectors/")
            .then(res => setSectors(res.data))
            .catch(err => console.error("Failed to fetch sectors", err));
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
                    circle: true,
                    marker: false,
                    polygon: false,
                    polyline: false,
                    rectangle: false,
                    circlemarker: false
                },
                edit: { featureGroup: drawnItems }
            });
            map.addControl(drawControl);

            map.on(L.Draw.Event.CREATED, function (e) {
                if (circleRef.current) {
                    drawnItems.removeLayer(circleRef.current);
                }

                const layer = e.layer;
                const centerLatLng = layer.getLatLng();
                const radiusM = layer.getRadius();
                const wkt = `SRID=4326;POINT(${centerLatLng.lng} ${centerLatLng.lat})`;
                const calculatedArea = (Math.PI * Math.pow(radiusM, 2)) / 10000;

                setArea(parseFloat(calculatedArea.toFixed(2)));
                setCenter(wkt);
                setRadius(Math.round(radiusM));

                const circle = L.circle(centerLatLng, {
                    radius: radiusM,
                    color: color
                }).addTo(map);

                drawnItems.addLayer(circle);
                circleRef.current = circle;
            });

            if (initialData.center && initialData.center.includes("POINT")) {
                const match = initialData.center.replace("SRID=4326;", "").match(/POINT\s*\(([-\d.]+)\s+([\-\d.]+)\)/);
                if (match) {
                    const latlng = L.latLng(parseFloat(match[2]), parseFloat(match[1]));
                    const circle = L.circle(latlng, {
                        radius: radius,
                        color: color
                    }).addTo(drawnItems);
                    circleRef.current = circle;
                    map.setView(latlng, 13);
                }
            }
        }
    }, [initialData.center]);

    useEffect(() => {
        if (circleRef.current) {
            circleRef.current.setStyle({ color });
        }
    }, [color]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const crops = [crop1, crop2, crop3, crop4];
        for (let i = 1; i < crops.length; i++) {
            if (crops[i] !== "none" && crops[i - 1] === "none") {
                alert(`Crop ${i + 1} cannot be selected before crop ${i}`);
                return;
            }
            if (isDuplicateCrop(crops[i], crops.slice(0, i))) {
                alert(`Crop ${i + 1} duplicates an earlier crop`);
                return;
            }
        }

        onSubmit({
            logical_name: logicalName,
            crop_1: crop1,
            crop_2: crop2,
            crop_3: crop3,
            crop_4: crop4,
            seeding_date: seedingDate || null,
            harvest_date: harvestDate || null,
            center,
            radius_m: radius,
            sector_id: sectorId,
            color,
            area  // ✅ Fix: correctly named to match model
        });
    };

    return (
        <div className="model-list">
            <h2>{initialData.id ? "Edit Pivot" : "Add Pivot"}</h2>
            <form onSubmit={handleSubmit} className="model-form">
                <label>
                    Pivot Name:
                    <input
                        type="text"
                        value={logicalName}
                        onChange={(e) => setLogicalName(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Sector:
                    <select
                        value={sectorId}
                        onChange={(e) => setSectorId(e.target.value)}
                        required
                    >
                        <option value="">-- Select a Sector --</option>
                        {sectors.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
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
                        placeholder="Use the map to draw a circle"
                    />
                </label>

                <label>
                    Radius (meters):
                    <input
                        type="number"
                        value={radius}
                        readOnly
                    />
                </label>

                <label>
                    Area (ha):
                    <input
                        type="number"
                        value={area}
                        readOnly
                    />
                </label>

                <label>
                    Seeding Date:
                    <input
                        type="date"
                        value={seedingDate}
                        onChange={(e) => setSeedingDate(e.target.value)}
                    />
                </label>

                <label>
                    Harvest Date:
                    <input
                        type="date"
                        value={harvestDate}
                        onChange={(e) => setHarvestDate(e.target.value)}
                    />
                </label>

                {[crop1, crop2, crop3, crop4].map((crop, i) => (
                    <label key={i}>
                        Crop {i + 1}:
                        <select
                            value={crop}
                            onChange={(e) => {
                                const setter = [setCrop1, setCrop2, setCrop3, setCrop4][i];
                                setter(e.target.value);
                            }}
                        >
                            {cropOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </label>
                ))}


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

export default PivotForm;
