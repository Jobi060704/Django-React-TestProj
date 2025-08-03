import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api.js";
import PivotForm from "../../../components/ModelForms/PivotForm.jsx";
import ModelAndMapLayout from "../../../components/ModelAndMapLayout.jsx";
import "../../../styles/ModelAndMapLayout.css";

function PivotEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        api.get(`/api/pivots/${id}/`)
            .then((res) => setInitialData(res.data))
            .catch((err) => {
                console.error("Failed to load pivot", err);
                alert("Failed to load pivot.");
                navigate("/dashboard/pivots");
            });
    }, [id, navigate]);

    const handleUpdate = (formData) => {
        api.put(`/api/pivots/${id}/`, { id: parseInt(id), ...formData })
            .then(() => navigate("/dashboard/pivots"))
            .catch((err) => {
                console.error("Failed to update pivot", err);
                alert("Failed to update pivot.");
            });
    };

    if (!initialData) return <p>Loading...</p>;

    return (
        <ModelAndMapLayout
            leftPanel={
                <PivotForm
                    initialData={initialData}
                    onSubmit={handleUpdate}
                    onCancel={() => navigate("/dashboard/pivots")}
                />
            }
            rightPanel={<div id="model-map" className="model-map" />}
        />
    );
}

export default PivotEdit;
