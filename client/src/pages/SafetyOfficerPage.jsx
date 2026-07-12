import React from "react";
import {
    FaShieldAlt,
    FaExclamationTriangle,
    FaClipboardCheck,
    FaIdCard,
} from "react-icons/fa";

const SafetyOfficerPage = () => {
    const cards = [
        {
            title: "Vehicles Due for Inspection",
            value: 12,
            icon: <FaClipboardCheck />,
            color: "text-blue-600",
            bg: "bg-blue-100",
        },
        {
            title: "Expired Driver Licenses",
            value: 3,
            icon: <FaIdCard />,
            color: "text-red-600",
            bg: "bg-red-100",
        },
        {
            title: "Safety Alerts",
            value: 8,
            icon: <FaExclamationTriangle />,
            color: "text-yellow-600",
            bg: "bg-yellow-100",
        },
        {
            title: "Fleet Safety Score",
            value: "92%",
            icon: <FaShieldAlt />,
            color: "text-green-600",
            bg: "bg-green-100",
        },
    ];

    const inspections = [
        {
            vehicle: "TRK-101",
            date: "15 Jul 2026",
            status: "Pending",
        },
        {
            vehicle: "TRK-108",
            date: "16 Jul 2026",
            status: "Pending",
        },
        {
            vehicle: "VAN-205",
            date: "17 Jul 2026",
            status: "Pending",
        },
    ];

    const alerts = [
        "Driver John Smith's license expires in 5 days.",
        "Truck TRK-115 missed scheduled inspection.",
        "Two vehicles reported brake issues.",
        "Safety score dropped below 80 for Driver Alex.",
    ];

    return (
        <div className="p-8 bg-gray-100 min-h-full">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Safety Officer Dashboard
                </h1>

                <p className="text-gray-500 mt-2">
                    Monitor inspections, compliance, and fleet safety.
                </p>
            </div>

            {/* Cards */}
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => (
                    <div
                        key={card.title}
                        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-lg transition"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500">{card.title}</p>

                                <h2 className="text-3xl font-bold mt-2">
                                    {card.value}
                                </h2>
                            </div>

                            <div
                                className={`w-14 h-14 rounded-full flex items-center justify-center ${card.bg}`}
                            >
                                <span className={`${card.color} text-2xl`}>
                                    {card.icon}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Inspection Schedule & Alerts */}
            <div className="grid lg:grid-cols-2 gap-6 mt-8">

                {/* Upcoming Inspections */}
                <div className="bg-white rounded-2xl border shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-5">
                        Upcoming Inspections
                    </h2>

                    <div className="space-y-4">
                        {inspections.map((item, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center border rounded-xl p-4"
                            >
                                <div>
                                    <h3 className="font-semibold">{item.vehicle}</h3>
                                    <p className="text-sm text-gray-500">
                                        Inspection: {item.date}
                                    </p>
                                </div>

                                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Safety Alerts */}
                <div className="bg-white rounded-2xl border shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-5">
                        Recent Safety Alerts
                    </h2>

                    <div className="space-y-4">
                        {alerts.map((alert, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 border-b pb-4"
                            >
                                <FaExclamationTriangle className="text-yellow-500 mt-1" />

                                <p className="text-gray-700">
                                    {alert}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Driver Safety Scores */}
            <div className="bg-white rounded-2xl border shadow-sm mt-8 p-6">
                <h2 className="text-xl font-semibold mb-6">
                    Driver Safety Scores
                </h2>

                <div className="space-y-5">
                    {[
                        { name: "John Smith", score: 95 },
                        { name: "Alex Johnson", score: 78 },
                        { name: "Rahul Das", score: 88 },
                        { name: "David Lee", score: 91 },
                    ].map((driver) => (
                        <div key={driver.name}>
                            <div className="flex justify-between mb-2">
                                <span>{driver.name}</span>
                                <span>{driver.score}%</span>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full ${driver.score >= 90
                                            ? "bg-green-500"
                                            : driver.score >= 80
                                                ? "bg-yellow-500"
                                                : "bg-red-500"
                                        }`}
                                    style={{ width: `${driver.score}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SafetyOfficerPage;