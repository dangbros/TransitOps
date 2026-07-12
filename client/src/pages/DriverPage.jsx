import React from "react";
import {
  FaRoute,
  FaTruck,
  FaMapMarkerAlt,
  FaGasPump,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";

const DriverPage = () => {
  const cards = [
    {
      title: "Today's Trips",
      value: 2,
      icon: <FaRoute />,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Completed Trips",
      value: 18,
      icon: <FaCheckCircle />,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Assigned Vehicle",
      value: "TRK-102",
      icon: <FaTruck />,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Fuel Remaining",
      value: "65%",
      icon: <FaGasPump />,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, John 👋
        </h1>
        <p className="text-gray-500 mt-2">
          Here's your driving schedule for today.
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
                <h2 className="text-3xl font-bold mt-2">{card.value}</h2>
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

      {/* Current Trip */}
      <div className="bg-white rounded-2xl shadow-sm border mt-8 p-6">
        <h2 className="text-xl font-semibold mb-5">
          Current Trip
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Source</p>
                <p className="font-semibold">Kolkata</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-red-600" />
              <div>
                <p className="text-sm text-gray-500">Destination</p>
                <p className="font-semibold">Delhi</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaTruck className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Vehicle</p>
                <p className="font-semibold">
                  TRK-102 (WB-12AB1234)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaCalendarAlt className="text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  Active
                </span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">
              Trip Progress
            </p>

            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-blue-600"></div>
            </div>

            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>320 km</span>
              <span>480 km</span>
            </div>

            <p className="mt-4 text-gray-600">
              Estimated Arrival:
              <span className="font-semibold">
                {" "}
                7:30 PM Today
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Trips */}
      <div className="bg-white rounded-2xl shadow-sm border mt-8 p-6">
        <h2 className="text-xl font-semibold mb-5">
          Upcoming Trips
        </h2>

        <div className="space-y-4">
          <div className="border rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">
                Mumbai → Pune
              </h3>
              <p className="text-sm text-gray-500">
                15 July 2026 • 08:00 AM
              </p>
            </div>

            <span className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full">
              Pending
            </span>
          </div>

          <div className="border rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">
                Pune → Goa
              </h3>
              <p className="text-sm text-gray-500">
                17 July 2026 • 09:30 AM
              </p>
            </div>

            <span className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full">
              Pending
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverPage;