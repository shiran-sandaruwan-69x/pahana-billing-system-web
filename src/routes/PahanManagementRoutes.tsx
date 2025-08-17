import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { lazy } from "react";
import AuthLayout from "../auth/AuthLayout";

const LoginForm = lazy(() => import("../auth/LoginForm"));
const AdminDashboard = lazy(() => import("../components/dashboard/AdminDashboard"));

function PahanManagementRoutes() {
    return (

        <Routes>
            <Route path="/" element={<AuthLayout />}>
                <Route index element={<Navigate to="/auth/login" replace />} />
                <Route path="login" element={<LoginForm />} />
            </Route>

            <Route path="/auth" element={<AuthLayout />}>
                <Route index element={<Navigate to="/auth/login" replace />} />
                <Route path="login" element={<LoginForm />} />
            </Route>
            <Route
                path="/admin/*"
                element={<AdminDashboard />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default PahanManagementRoutes;
