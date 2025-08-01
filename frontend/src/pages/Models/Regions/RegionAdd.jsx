import { useNavigate } from "react-router-dom";
import api from "../../../api.js";
import ModelForm from "../../../components/ModelForm.jsx";
import ModelAndMapLayout from "../../../components/ModelAndMapLayout.jsx";
import "../../../styles/ModelAndMapLayout.css";

function RegionAdd() {
    const navigate = useNavigate();

    const handleCreate = (formData) => {
        api.post("/api/regions/", formData)
            .then(() => navigate("/dashboard/regions"))
            .catch((err) => {
                console.error("Failed to create region", err);
                alert("Failed to create region.");
            });
    };

    return (
        <ModelAndMapLayout
            leftPanel={
                <ModelForm
                    modelName="Region"
                    onSubmit={handleCreate}
                    onCancel={() => navigate("/dashboard/regions")}
                />
            }
            rightPanel={<div id="model-map" className="model-map" />}
        />
    );
}

export default RegionAdd;
