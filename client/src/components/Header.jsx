import React from "react";
import { Link } from "react-router";

const Header = () => {
    return (
        <header className="h-16 bg-blue-600 text-white shadow-md flex items-center justify-between px-6">
            <h1 className="text-2xl font-bold">
                Fleet Management System
            </h1>

            <div className="flex items-center gap-4">
                <span className="font-medium">Admin</span>

                <Link to={"/my-profile"} className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold">
                    A
                </Link>
            </div>
        </header>
    );
};

export default Header;