import { useNavigate } from "react-router-dom";
import api from "../../api.js";
import CompanyForm from "../../components/CompanyForm.jsx";

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
        <div className="company-container">
                <CompanyForm onSubmit={handleCreate} onCancel={() => navigate("/dashboard/companies")} />
            <div className="company-map" id="company-map"></div>
        </div>
    );
}

export default CompanyAdd;
