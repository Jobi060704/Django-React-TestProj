import { useNavigate } from "react-router-dom";
import api from "../../../api.js";
import SectorForm from "../../../components/ModelForms/SectorForm.jsx";
import ModelAndMapLayout from "../../../components/ModelAndMapLayout.jsx";
import "../../../styles/ModelAndMapLayout.css";

function SectorAdd() {
    const navigate = useNavigate();

    const handleCreate = (formData) => {
        api.post("/api/sectors/", formData)
            .then(() => navigate("/dashboard/sectors"))
            .catch((err) => {
                console.error("Failed to create sector", err);
                alert("Failed to create sector.");
            });
    };

    return (
        <ModelAndMapLayout
            leftPanel={
                <SectorForm
                    onSubmit={handleCreate}
                    onCancel={() => navigate("/dashboard/sectors")}
                />
            }
            rightPanel={<div id="model-map" className="model-map" />}
        />
    );
}

export default SectorAdd;
