import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api.js";
import SectorForm from "../../../components/ModelForms/SectorForm.jsx";
import ModelAndMapLayout from "../../../components/ModelAndMapLayout.jsx";
import "../../../styles/ModelAndMapLayout.css";

function SectorEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/api/sectors/${id}/`)
            .then((res) => {
                setInitialData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load sector", err);
                alert("Failed to load sector.");
                navigate("/dashboard/sectors");
            });
    }, [id, navigate]);

    const handleUpdate = (formData) => {
        api.put(`/api/sectors/${id}/`, formData)
            .then(() => navigate("/dashboard/sectors"))
            .catch((err) => {
                console.error("Failed to update sector", err);
                alert("Failed to update sector.");
            });
    };

    return (
        <ModelAndMapLayout
            leftPanel={
                loading ? (
                    <p>Loading sector...</p>
                ) : (
                    <SectorForm
                        initialData={initialData}
                        onSubmit={handleUpdate}
                        onCancel={() => navigate("/dashboard/sectors")}
                    />
                )
            }
            rightPanel={<div id="model-map" className="model-map" />}
        />
    );
}

export default SectorEdit;
