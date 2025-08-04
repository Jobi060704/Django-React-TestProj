import { useNavigate } from "react-router-dom";
import api from "../../../api.js";
import FieldForm from "../../../components/ModelForms/FieldForm.jsx";
import ModelAndMapLayout from "../../../components/ModelAndMapLayout.jsx";
import "../../../styles/ModelAndMapLayout.css";

function FieldAdd() {
    const navigate = useNavigate();

    const handleCreate = (formData) => {
        api.post("/api/fields/", formData)
            .then(() => navigate("/dashboard/fields"))
            .catch((err) => {
                console.error("Failed to create field", err);
                alert("Failed to create field.");
            });
    };

    return (
        <ModelAndMapLayout
            leftPanel={
                <FieldForm
                    onSubmit={handleCreate}
                    onCancel={() => navigate("/dashboard/fields")}
                />
            }
            rightPanel={<div id="model-map" className="model-map" />}
        />
    );
}

export default FieldAdd;
