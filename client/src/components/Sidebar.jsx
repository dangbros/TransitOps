import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaTruckMoving,
  FaTachometerAlt,
  FaRoute,
  FaGasPump,
  FaUserShield,
  FaMoneyBillWave,
  FaUserCircle,
} from "react-icons/fa";

const links = [
  { to: "/dashboard/admin", label: "Fleet Manager", icon: <FaTachometerAlt />, roles: ["Fleet Manager"] },
  { to: "/dashboard/driver", label: "Driver", icon: <FaRoute />, roles: ["Driver", "Fleet Manager"] },
  {
    to: "/dashboard/safety-officer",
    label: "Safety Officer",
    icon: <FaUserShield />,
    roles: ["Safety Officer", "Fleet Manager"],
  },
  {
    to: "/dashboard/financial-analyst",
    label: "Financial Analyst",
    icon: <FaMoneyBillWave />,
    roles: ["Financial Analyst", "Fleet Manager"],
  },
  { to: "/my-profile", label: "Profile", icon: <FaUserCircle />, roles: [] }, // visible to everyone
];

const Sidebar = () => {
  const { user } = useAuth();

  const filteredLinks = links.filter((link) => {
    if (link.roles.length === 0) return true; // Profile
    return user && link.roles.includes(user.role);
  });

  return (
    <aside className="w-64 min-h-screen bg-blue-700 text-white flex flex-col">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-blue-600">
        <FaTruckMoving className="text-2xl" />
        <span className="text-xl font-bold">TransitOps</span>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {filteredLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                isActive
                  ? "bg-white text-blue-700"
                  : "text-blue-100 hover:bg-blue-600"
              }`
            }
          >
            <span className="text-lg">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
