import {
    FaTruck,
    FaWarehouse,
    FaTools,
    FaRoute,
    FaClock,
    FaUserTie,
    FaChartPie,
} from "react-icons/fa";

const cards = [
    {
        title: "Active Vehicles",
        value: 125,
        color: "text-green-500",
        icon: <FaTruck size={30} />,
    },
    {
        title: "Available Vehicles",
        value: 42,
        color: "text-blue-500",
        icon: <FaWarehouse size={30} />,
    },
    {
        title: "Vehicles In Maintenance",
        value: 8,
        color: "text-red-500",
        icon: <FaTools size={30} />,
    },
    {
        title: "Active Trips",
        value: 30,
        color: "text-purple-500",
        icon: <FaRoute size={30} />,
    },
    {
        title: "Pending Trips",
        value: 12,
        color: "text-yellow-500",
        icon: <FaClock size={30} />,
    },
    {
        title: "Drivers On Duty",
        value: 76,
        color: "text-indigo-500",
        icon: <FaUserTie size={30} />,
    },
    {
        title: "Fleet Utilization",
        value: "75%",
        color: "text-cyan-500",
        icon: <FaChartPie size={30} />,
    },
];


const AdminPage = () => {

    return (
        <div className="p-8 bg-gray-100 min-h-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Dashboard
                </h1>
                <p className="text-gray-500 mt-2">
                    Welcome to Fleet Management System
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cards.map((card) => (
                    <div
                        key={card.title}
                        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{card.title}</p>

                                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                                    {card.value}
                                </h2>
                            </div>

                            <div
                                className={`w-14 h-14 rounded-full flex items-center justify-center bg-opacity-10 ${card.bg}`}
                            >
                                <span className={`${card.color} text-2xl`}>
                                    {card.icon}
                                </span>
                            </div>
                        </div>

                        <div className="mt-5 pt-4 border-t flex items-center justify-between">
                            <span className="text-xs text-green-600 font-medium">
                                ▲ +8% this month
                            </span>

                            <span className="text-xs text-gray-400">
                                Updated now
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mt-8">
                <div className="bg-white rounded-xl shadow-md border p-6 h-80">
                    <h2 className="text-xl font-semibold mb-4">
                        Trip Overview
                    </h2>

                    <div className="h-full flex items-center justify-center text-gray-400">
                        Chart Placeholder
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md border p-6 h-80">
                    <h2 className="text-xl font-semibold mb-4">
                        Vehicle Status
                    </h2>

                    <div className="h-full flex items-center justify-center text-gray-400">
                        Chart Placeholder
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminPage