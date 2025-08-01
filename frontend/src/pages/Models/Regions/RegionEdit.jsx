import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api.js";
import ModelForm from "../../../components/ModelForm.jsx";
import ModelAndMapLayout from "../../../components/ModelAndMapLayout.jsx";
import "../../../styles/ModelAndMapLayout.css";

function RegionEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        api.get(`/api/regions/${id}/`)
            .then((res) => setInitialData(res.data))
            .catch((err) => {
                console.error("Failed to load region", err);
                alert("Failed to load region.");
                navigate("/dashboard/regions");
            });
    }, [id, navigate]);

    const handleUpdate = (formData) => {
        api.put(`/api/regions/${id}/`, { id: parseInt(id), ...formData })
            .then(() => navigate("/dashboard/regions"))
            .catch((err) => {
                console.error("Failed to update region", err);
                alert("Failed to update region.");
            });
    };

    if (!initialData) return <p>Loading...</p>;

    return (
        <ModelAndMapLayout
            leftPanel={
                <ModelForm
                    modelName="Region"
                    initialData={initialData}
                    onSubmit={handleUpdate}
                    onCancel={() => navigate("/dashboard/regions")}
                />
            }
            rightPanel={<div id="model-map" className="model-map" />}
        />
    );
}

export default RegionEdit;
