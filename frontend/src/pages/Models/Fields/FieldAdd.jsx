import { useNavigate } from "react-router-dom";
import api from "../../../api.js";
import PivotForm from "../../../components/ModelForms/PivotForm.jsx";
import ModelAndMapLayout from "../../../components/ModelAndMapLayout.jsx";
import "../../../styles/ModelAndMapLayout.css";

function PivotAdd() {
    const navigate = useNavigate();

    const handleCreate = (formData) => {
        api.post("/api/pivots/", formData)
            .then(() => navigate("/dashboard/pivots"))
            .catch((err) => {
                console.error("Failed to create pivot", err);
                alert("Failed to create pivot.");
            });
    };

    return (
        <ModelAndMapLayout
            leftPanel={
                <PivotForm
                    onSubmit={handleCreate}
                    onCancel={() => navigate("/dashboard/pivots")}
                />
            }
            rightPanel={<div id="model-map" className="model-map" />}
        />
    );
}

export default PivotAdd;
