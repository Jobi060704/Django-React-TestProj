import { useNavigate } from "react-router-dom";
import api from "../../api.js";
import ModelForm from "../../components/ModelForm.jsx";
import ModelAndMapLayout from "../../components/ModelAndMapLayout.jsx";
import "../../styles/ModelAndMapLayout.css";

function CompanyAdd() {
    const navigate = useNavigate();

    const handleCreate = (formData) => {
        api.post("/api/companies/", formData)
            .then(() => navigate("/dashboard/companies"))
            .catch((err) => {
                console.error("Failed to create company", err);
                alert("Failed to create company.");
            });
    };

    return (
        <ModelAndMapLayout
            leftPanel={
                <ModelForm
                    modelName="Company"
                    onSubmit={handleCreate}
                    onCancel={() => navigate("/dashboard/companies")}
                />
            }
            rightPanel={<div id="model-map" className="model-map" />}
        />
    );
}

export default CompanyAdd;
