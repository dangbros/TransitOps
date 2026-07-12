import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminPage from './AdminPage';
import DriverPage from './DriverPage';
import SafetyOfficerPage from './SafetyOfficerPage';
import FinancialAnalystPage from './FinancialAnalystPage';

const Home = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            console.log("Logged in user details:", user);
        }
        if (!loading && !user) {
            navigate("/login");
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-xl font-medium text-gray-500">Loading session...</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    // Render page according to user role
    if (user.role === "Fleet Manager") {
        return <AdminPage />;
    } else if (user.role === "Driver") {
        return <DriverPage />;
    } else if (user.role === "Safety Officer") {
        return <SafetyOfficerPage />;
    } else if (user.role === "Financial Analyst") {
        return <FinancialAnalystPage />;
    }

    // Fallback
    return <AdminPage />;
}

export default Home;
