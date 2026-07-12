import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="h-16 bg-blue-600 text-white shadow-md flex items-center justify-between px-6">
            <Link to="/" className="text-2xl font-bold text-white no-underline">
                TransitOps
            </Link>

            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <div className="text-right">
                            <p className="text-sm font-semibold m-0">{user.email}</p>
                            <p className="text-xs text-blue-200 m-0">{user.role}</p>
                        </div>
                        <Link to="/my-profile" className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold no-underline">
                            {user.email[0].toUpperCase()}
                        </Link>
                        <button onClick={handleLogout} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-semibold transition cursor-pointer">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-white hover:underline text-sm font-medium">Login</Link>
                        <Link to="/sign-up" className="bg-white text-blue-600 px-3 py-1.5 rounded text-sm font-semibold hover:bg-blue-50 transition">Register</Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;