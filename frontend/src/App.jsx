import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import Landing from "./pages/Landing.jsx";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import Companies from "./pages/Models/Companies/Companies.jsx";
import CompanyAdd from "./pages/Models/Companies/CompanyAdd.jsx"; // ✅ Import layout wrapper
import CompanyEdit from "./pages/Models/Companies/CompanyEdit.jsx";
import Regions from "./pages/Models/Regions/Regions.jsx";
import RegionAdd from "./pages/Models/Regions/RegionAdd.jsx";
import RegionEdit from "./pages/Models/Regions/RegionEdit.jsx"; // ✅ Import layout wrapper

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


                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/register" element={<RegisterAndLogout />} />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App