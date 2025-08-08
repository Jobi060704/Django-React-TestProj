import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api.js";
import "../../styles/CropRotation.css";

const YEARS = [2021, 2022, 2023, 2024, 2025];

function CropRotations() {
    const [rotations, setRotations] = useState([]);
    const [pivots, setPivots] = useState([]);
    const [fields, setFields] = useState([]);

    useEffect(() => {
        api.get("/api/crop-rotations/").then(res => setRotations(res.data));
        api.get("/api/pivots/").then(res => setPivots(res.data));
        api.get("/api/fields/").then(res => setFields(res.data));
    }, []);

    const getRotationCell = (modelType, modelId, year) => {
        const rotation = rotations.find(r =>
            r.year === year &&
            ((modelType === "pivot" && r.pivot_id === modelId) ||
                (modelType === "field" && r.field_id === modelId))
        );

        if (rotation) {
            return (
                <Link to={`/dashboard/crop-rotations/${rotation.id}`} className="rotation-cell">
                    {rotation.entries.length} entries
                </Link>
            );
        } else {
            return (
                <Link to={`/dashboard/crop-rotations/add?${modelType}_id=${modelId}&year=${year}`} className="rotation-cell add">
                    <span className="plus-circle">＋</span> Add
                </Link>
            );
        }
    };

    const renderShapePreview = (type, item) => {
        if (type === "pivot") {
            return (
                <div
                    className="shape-circle"
                    style={{ backgroundColor: item.color || "#999" }}
                    title={item.logical_name}
                />
            );
        }
        if (type === "field" && item.shape) {
            return (
                <svg viewBox="0 0 100 100" className="shape-polygon" title={item.logical_name}>
                    <polygon
                        points="20,20 80,20 80,80 20,80"
                        fill={item.color || "#999"}
                        stroke="black"
                        strokeWidth="2"
                    />
                </svg>
            );
        }
        return null;
    };

    const renderRow = (type, item) => (
        <tr key={`${type}-${item.id}`}>
            <td className="shape-cell">
                {renderShapePreview(type, item)}
                <span>{item.logical_name}</span>
            </td>
            {YEARS.map(year => (
                <td key={year}>{getRotationCell(type, item.id, year)}</td>
            ))}
        </tr>
    );

    return (
        <div className="crop-rotation-page">
            <h2>Crop Rotations</h2>
            <div className="rotation-table-wrapper">
                <table className="rotation-table">
                    <thead>
                    <tr>
                        <th>Pivot / Field</th>
                        {YEARS.map(year => <th key={year}>{year}</th>)}
                    </tr>
                    </thead>
                    <tbody>
                    {pivots.map(pivot => renderRow("pivot", pivot))}
                    {fields.map(field => renderRow("field", field))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CropRotations;
