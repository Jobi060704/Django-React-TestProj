import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import api from "../../api.js";
import "../../styles/ModelAndMapLayout.css";

function FieldForm({ initialData = {}, onSubmit, onCancel }) {
    const [logicalName, setLogicalName] = useState(initialData.logical_name || "");
    const [shape, setShape] = useState(initialData.shape || "");
    const [color, setColor] = useState(initialData.color || "#00AAFF");
    const [area, setArea] = useState(initialData.area || 0);
    const [sectorId, setSectorId] = useState(initialData.sector_id || "");
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
    const drawnItemsRef = useRef(null);

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
                    polygon: true,
                    marker: false,
                    circle: false,
                    polyline: false,
                    rectangle: false,
                    circlemarker: false
                },
                edit: { featureGroup: drawnItems }
            });
            map.addControl(drawControl);

            map.on(L.Draw.Event.CREATED, function (e) {
                drawnItems.clearLayers();

                const layer = e.layer;
                const latlngs = layer.getLatLngs()[0];

                const polygonWKT = `SRID=4326;POLYGON((` + latlngs.map(p => `${p.lng} ${p.lat}`).join(",") + `))`;
                setShape(polygonWKT);

                const areaHa = L.GeometryUtil.geodesicArea(latlngs) / 10000;
                setArea(parseFloat(areaHa.toFixed(2)));

                layer.setStyle({ color });
                drawnItems.addLayer(layer);
            });
        }
    }, []);

    const isDuplicateCrop = (crop, others) => crop !== "none" && others.includes(crop);

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
            shape,
            color,
            sector_id: sectorId,
            area
        });
    };

    return (
        <div className="model-list">
            <h2>{initialData.id ? "Edit Field" : "Add Field"}</h2>
            <form onSubmit={handleSubmit} className="model-form">
                <label>
                    Field Name:
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
                    Shape:
                    <input type="text" value={shape} readOnly />
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

export default FieldForm;
