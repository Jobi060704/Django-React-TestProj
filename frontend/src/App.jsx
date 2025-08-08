import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import Landing from "./pages/Landing.jsx";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import Companies from "./pages/Models/Companies/Companies.jsx";
import CompanyAdd from "./pages/Models/Companies/CompanyAdd.jsx";
import CompanyEdit from "./pages/Models/Companies/CompanyEdit.jsx";
import Regions from "./pages/Models/Regions/Regions.jsx";
import RegionAdd from "./pages/Models/Regions/RegionAdd.jsx";
import RegionEdit from "./pages/Models/Regions/RegionEdit.jsx";
import Sectors from "./pages/Models/Sectors/Sectors.jsx";
import SectorAdd from "./pages/Models/Sectors/SectorAdd.jsx";
import SectorEdit from "./pages/Models/Sectors/SectorEdit.jsx";
import Pivots from "./pages/Models/Pivots/Pivots.jsx";
import PivotAdd from "./pages/Models/Pivots/PivotAdd.jsx";
import PivotEdit from "./pages/Models/Pivots/PivotEdit.jsx";
import Fields from "./pages/Models/Fields/Fields.jsx";
import FieldAdd from "./pages/Models/Fields/FieldAdd.jsx";
import FieldEdit from "./pages/Models/Fields/FieldEdit.jsx";
import CropRotations from "./pages/Models/CropRotations.jsx";

function Logout() {
    localStorage.clear();
    return <Navigate to="/login" />;
}

function RegisterAndLogout() {
    localStorage.clear();
    return <Register />;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<ProtectedRoute> <MainLayout> <Landing /> </MainLayout> </ProtectedRoute>} />

                <Route path="/dashboard/companies" element={<ProtectedRoute> <MainLayout> <Companies /> </MainLayout> </ProtectedRoute>} />
                <Route path="/dashboard/companies/add" element={<ProtectedRoute> <MainLayout> <CompanyAdd /> </MainLayout> </ProtectedRoute>} />
                <Route path="/dashboard/companies/:id/edit" element={<ProtectedRoute> <MainLayout> <CompanyEdit /> </MainLayout> </ProtectedRoute>} />

                <Route path="/dashboard/regions" element={<ProtectedRoute> <MainLayout> <Regions /> </MainLayout> </ProtectedRoute>} />
                <Route path="/dashboard/regions/add" element={<ProtectedRoute> <MainLayout> <RegionAdd /> </MainLayout> </ProtectedRoute>} />
                <Route path="/dashboard/regions/:id/edit" element={<ProtectedRoute> <MainLayout> <RegionEdit /> </MainLayout> </ProtectedRoute>} />

                <Route path="/dashboard/sectors" element={<ProtectedRoute> <MainLayout> <Sectors /> </MainLayout> </ProtectedRoute>} />
                <Route path="/dashboard/sectors/add" element={<ProtectedRoute> <MainLayout> <SectorAdd /> </MainLayout> </ProtectedRoute>} />
                <Route path="/dashboard/sectors/:id/edit" element={<ProtectedRoute> <MainLayout> <SectorEdit /> </MainLayout> </ProtectedRoute>} />

                <Route path="/dashboard/pivots" element={<ProtectedRoute> <MainLayout> <Pivots /> </MainLayout> </ProtectedRoute>} />
                <Route path="/dashboard/pivots/add" element={<ProtectedRoute> <MainLayout> <PivotAdd /> </MainLayout> </ProtectedRoute>} />
                <Route path="/dashboard/pivots/:id/edit" element={<ProtectedRoute> <MainLayout> <PivotEdit /> </MainLayout> </ProtectedRoute>} />

                <Route path="/dashboard/fields" element={<ProtectedRoute> <MainLayout> <Fields /> </MainLayout> </ProtectedRoute>} />
                <Route path="/dashboard/fields/add" element={<ProtectedRoute> <MainLayout> <FieldAdd /> </MainLayout> </ProtectedRoute>} />
                <Route path="/dashboard/fields/:id/edit" element={<ProtectedRoute> <MainLayout> <FieldEdit /> </MainLayout> </ProtectedRoute>} />

                <Route path="/dashboard/crop-rotations" element={<ProtectedRoute> <MainLayout> <CropRotations /> </MainLayout> </ProtectedRoute>} />



                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/register" element={<RegisterAndLogout />} />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App