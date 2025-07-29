import { useState, useEffect } from "react";
import "../styles/Dashboard/Companies.css";

function CompanyForm({ initialData = {}, onSubmit, onCancel }) {
    const [name, setName] = useState(initialData.name || "");
    const [center, setCenter] = useState(initialData.center || "");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, center });
    };

    return (
        <div className="company-list">
            <h2>{initialData.id ? "Edit Company" : "Add Company"}</h2>
            <form onSubmit={handleSubmit} className="company-form">
                <label>
                    Company Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Center (Click on map to select):
                    <input
                        type="text"
                        value={center}
                        readOnly
                        placeholder="Click on map..."
                    />
                </label>

                <div className="form-buttons">
                    <button type="submit" className="submit-button">
                        {initialData.id ? "Save Changes" : "Create"}
                    </button>
                    <button type="button" onClick={onCancel} className="cancel-button">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CompanyForm;
