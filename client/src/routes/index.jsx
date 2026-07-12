import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/login";
import SignUp from "../pages/SignUp";
import Profile from "../pages/Profile";
import DashboardLayout from "../pages/DashboardLayout";
import AdminPage from "../pages/AdminPage";
import DriverPage from "../pages/DriverPage";
import FinancialAnalystPage from "../pages/FinancialAnalystPage";
import SafetyOfficerPage from "../pages/SafetyOfficerPage";
import { useAuth } from "../context/AuthContext";

// Route Guard Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-500 font-semibold">
        Validating session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the dashboard they actually have access to
    if (user.role === "Fleet Manager") return <Navigate to="/dashboard/admin" replace />;
    if (user.role === "Driver") return <Navigate to="/dashboard/driver" replace />;
    if (user.role === "Safety Officer") return <Navigate to="/dashboard/safety-officer" replace />;
    if (user.role === "Financial Analyst") return <Navigate to="/dashboard/financial-analyst" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

const routes = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "dashboard/admin",
        element: (
          <ProtectedRoute allowedRoles={["Fleet Manager"]}>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/driver",
        element: (
          <ProtectedRoute allowedRoles={["Driver", "Fleet Manager"]}>
            <DriverPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/safety-officer",
        element: (
          <ProtectedRoute allowedRoles={["Safety Officer", "Fleet Manager"]}>
            <SafetyOfficerPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/financial-analyst",
        element: (
          <ProtectedRoute allowedRoles={["Financial Analyst", "Fleet Manager"]}>
            <FinancialAnalystPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
]);

export default routes;
