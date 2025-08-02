import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api.js";
import CompanyForm from "../../../components/ModelForms/CompanyForm.jsx";
import ModelAndMapLayout from "../../../components/ModelAndMapLayout.jsx";
import "../../../styles/ModelAndMapLayout.css";

function CompanyEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        api.get(`/api/companies/${id}/`)
            .then((res) => setInitialData(res.data))
            .catch((err) => {
                console.error("Failed to load company", err);
                alert("Failed to load company.");
                navigate("/dashboard/companies");
            });
    }, [id, navigate]);

    const handleUpdate = (formData) => {
        api.put(`/api/companies/${id}/`, { id: parseInt(id), ...formData })
            .then(() => navigate("/dashboard/companies"))
            .catch((err) => {
                console.error("Failed to update company", err);
                alert("Failed to update company.");
            });
    };

    if (!initialData) return <p>Loading...</p>;

    return (
        <ModelAndMapLayout
            leftPanel={
                <CompanyForm
                    modelName="Company"
                    initialData={initialData}
                    onSubmit={handleUpdate}
                    onCancel={() => navigate("/dashboard/companies")}
                />
            }
            rightPanel={<div id="model-map" className="model-map" />}
        />
    );
}

export default CompanyEdit;
