import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api.js";
import CompanyForm from "../../components/CompanyForm.jsx";

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
        <div className="company-container">
            <CompanyForm
                initialData={initialData}
                onSubmit={handleUpdate}
                onCancel={() => navigate("/dashboard/companies")}
            />
            <div className="company-map" id="company-map"></div>
        </div>
    );
}

export default CompanyEdit;
