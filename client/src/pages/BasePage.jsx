import React from "react";
import { Link } from "react-router-dom";
import {
    FaTruckMoving,
    FaUsers,
    FaRoute,
    FaChartLine,
    FaShieldAlt,
    FaMoneyBillWave,
} from "react-icons/fa";

const BasePage = () => {

    const features = [
        {
            icon: <FaTruckMoving />,
            title: "Fleet Management",
            desc: "Manage vehicles, availability, maintenance, and fleet utilization.",
        },
        {
            icon: <FaUsers />,
            title: "Driver Management",
            desc: "Track drivers, licenses, safety scores, and assignments.",
        },
        {
            icon: <FaRoute />,
            title: "Trip Management",
            desc: "Plan, dispatch, monitor, and complete trips efficiently.",
        },
        {
            icon: <FaChartLine />,
            title: "Analytics",
            desc: "Visual dashboards with reports and operational insights.",
        },
        {
            icon: <FaShieldAlt />,
            title: "Safety Monitoring",
            desc: "Track inspections, compliance, and safety alerts.",
        },
        {
            icon: <FaMoneyBillWave />,
            title: "Financial Reports",
            desc: "Monitor fuel expenses, maintenance costs, and ROI.",
        },
    ];

    const roles = [
        "Fleet Manager",
        "Driver",
        "Safety Officer",
        "Financial Analyst",
    ];

    return (
        <div className="bg-slate-50">

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white">

                <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center justify-between gap-12">

                    <div className="max-w-2xl">
                        <h1 className="text-5xl font-bold leading-tight">
                            Smart Fleet
                            <span className="text-yellow-300"> Management </span>
                            System
                        </h1>

                        <p className="mt-6 text-lg text-blue-100">
                            Manage vehicles, drivers, trips, maintenance, safety, and
                            financial operations from one centralized dashboard.
                        </p>

                        <div className="flex gap-4 mt-10">
                            <Link
                                to="/sign-up"
                                className="px-6 py-3 rounded-xl bg-white text-blue-700 font-semibold hover:bg-gray-100 transition"
                            >
                                Get Started
                            </Link>

                            <Link
                                to="/login"
                                className="px-6 py-3 rounded-xl border border-white hover:bg-white hover:text-blue-700 transition"
                            >
                                Login
                            </Link>
                        </div>

                        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 w-[60%] text-slate-800">
                            <h3 className="text-sm font-semibold text-blue-700 mb-3">
                                Demo Credentials (Database Active)
                            </h3>

                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between gap-4">
                                    <span>👨‍💼 Fleet Manager</span>
                                    <span className="font-semibold">fleetmanager@transitops.com</span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span>🚚 Driver</span>
                                    <span className="font-semibold">driver@transitops.com</span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span>🦺 Safety Officer</span>
                                    <span className="font-semibold">safety@transitops.com</span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span>💰 Financial Analyst</span>
                                    <span className="font-semibold">finance@transitops.com</span>
                                </div>
                            </div>

                            <div className="mt-3 flex items-center justify-between rounded-lg bg-white border border-blue-100 px-3 py-2">
                                <span className="text-xs font-semibold text-gray-600">
                                    Password (for all)
                                </span>

                                <code className="text-xs font-bold text-blue-700">
                                    password123
                                </code>
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Preview */}
                    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6">

                        <div className="flex items-center gap-3 mb-5 ">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                                🚚
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-800">
                                    Fleet Dashboard
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Everything in one place
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">

                            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 shadow-lg border border-gray-200">
                                <span className="text-xl">📍</span>

                                <div>
                                    <h4 className="font-semibold text-gray-800">
                                        Live Trip Tracking
                                    </h4>

                                    <p className="text-sm text-gray-500">
                                        Monitor active trips and vehicle locations in real time.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 shadow-lg border border-gray-200">
                                <span className="text-xl">🚛</span>

                                <div>
                                    <h4 className="font-semibold text-gray-800">
                                        Vehicle Management
                                    </h4>

                                    <p className="text-sm text-gray-500">
                                        Track fleet availability, maintenance, and utilization.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 shadow-lg border border-gray-200">
                                <span className="text-xl">👥</span>

                                <div>
                                    <h4 className="font-semibold text-gray-800">
                                        Role-Based Dashboards
                                    </h4>

                                    <p className="text-sm text-gray-500">
                                        Fleet Manager, Driver, Safety Officer, and Financial Analyst each get personalized views.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 shadow-lg border border-gray-200">
                                <span className="text-xl">📊</span>

                                <div>
                                    <h4 className="font-semibold text-gray-800">
                                        Reports & Analytics
                                    </h4>

                                    <p className="text-sm text-gray-500">
                                        Analyze fleet performance, fuel costs, and operational efficiency.
                                    </p>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <h2 className="text-4xl font-bold text-center text-gray-800">
                    Key Features
                </h2>

                <p className="text-center text-gray-500 mt-3">
                    Everything you need to manage your fleet efficiently.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="bg-white rounded-2xl shadow-sm border p-8 hover:shadow-xl transition"
                        >
                            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-2xl">
                                {feature.icon}
                            </div>

                            <h3 className="text-xl font-semibold mt-6">
                                {feature.title}
                            </h3>

                            <p className="text-gray-500 mt-3">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Roles */}
            <section className="bg-white py-20">
                <div className="max-w-5xl mx-auto px-6">

                    <h2 className="text-4xl font-bold text-center">
                        Role Based Access
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">

                        {roles.map((role) => (
                            <div
                                key={role}
                                className="rounded-2xl border p-8 text-center hover:bg-blue-50 transition"
                            >
                                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto text-2xl">
                                    <FaUsers />
                                </div>

                                <h3 className="font-semibold text-lg mt-5">
                                    {role}
                                </h3>
                            </div>
                        ))}

                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-blue-700 text-white py-20">
                <div className="max-w-4xl mx-auto text-center px-6">

                    <h2 className="text-4xl font-bold">
                        Ready to manage your fleet smarter?
                    </h2>

                    <p className="mt-4 text-blue-100">
                        Join TransitOps and simplify fleet operations with one platform.
                    </p>

                    <Link
                        to="/sign-up"
                        className="inline-block mt-8 bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
                    >
                        Create Free Account
                    </Link>

                </div>
            </section>

        </div>
    );
};

export default BasePage;