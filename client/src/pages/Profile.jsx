import React from "react";
import {
    FaUserCircle,
    FaEnvelope,
    FaUserTag,
    FaCalendarAlt,
    FaPhoneAlt,
} from "react-icons/fa";

const Profile = () => {
    // Dummy user data
    const user = {
        name: "John Doe",
        email: "john.doe@transitops.com",
        role: "Fleet Manager",
        phone: "+91 9876543210",
        joined: "12 Jan 2026",
    };

    return (
        <div className="min-h-full bg-gray-100 p-8">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">

                        <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center">
                            <FaUserCircle className="text-7xl text-blue-600" />
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-gray-800">
                                {user.name}
                            </h1>

                            <p className="text-gray-500 mt-2">
                                {user.role}
                            </p>

                            <button className="mt-5 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mt-8 p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        Personal Information
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">

                        <div className="flex items-center gap-4">
                            <FaUserCircle className="text-blue-600 text-xl" />

                            <div>
                                <p className="text-sm text-gray-500">Full Name</p>
                                <p className="font-semibold">{user.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <FaEnvelope className="text-blue-600 text-xl" />

                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-semibold">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <FaUserTag className="text-blue-600 text-xl" />

                            <div>
                                <p className="text-sm text-gray-500">Role</p>
                                <p className="font-semibold">{user.role}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <FaPhoneAlt className="text-blue-600 text-xl" />

                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-semibold">{user.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <FaCalendarAlt className="text-blue-600 text-xl" />

                            <div>
                                <p className="text-sm text-gray-500">Joined On</p>
                                <p className="font-semibold">{user.joined}</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Account Settings */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mt-8 p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        Account Settings
                    </h2>

                    <div className="flex flex-wrap gap-4">
                        <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            Change Password
                        </button>

                        <button className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                            Logout
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;