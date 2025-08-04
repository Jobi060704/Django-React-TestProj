import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api.js";
import FieldForm from "../../../components/ModelForms/FieldForm.jsx";
import ModelAndMapLayout from "../../../components/ModelAndMapLayout.jsx";
import "../../../styles/ModelAndMapLayout.css";

function FieldEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        api.get(`/api/fields/${id}/`)
            .then((res) => setInitialData(res.data))
            .catch((err) => {
                console.error("Failed to load field", err);
                alert("Failed to load field.");
                navigate("/dashboard/fields");
            });
    }, [id, navigate]);

    const handleUpdate = (formData) => {
        api.put(`/api/fields/${id}/`, { id: parseInt(id), ...formData })
            .then(() => navigate("/dashboard/fields"))
            .catch((err) => {
                console.error("Failed to update field", err);
                alert("Failed to update field.");
            });
    };

    if (!initialData) return <p>Loading...</p>;

    return (
        <ModelAndMapLayout
            leftPanel={
                <FieldForm
                    initialData={initialData}
                    onSubmit={handleUpdate}
                    onCancel={() => navigate("/dashboard/fields")}
                />
            }
            rightPanel={<div id="model-map" className="model-map" />}
        />
    );
}

export default FieldEdit;
