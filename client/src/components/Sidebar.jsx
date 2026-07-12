import React, { useState } from "react";
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
  const [dark, setDark] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  const toggleDarkMode = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
    }
  };

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

      {/* Dark Mode Control in Sidebar footer */}
      <div className="p-4 border-t border-blue-600 flex items-center justify-between">
        <span className="text-xs text-blue-200 font-semibold uppercase tracking-wider">Dark Mode</span>
        <button
          onClick={toggleDarkMode}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none cursor-pointer ${
            dark ? "bg-green-500" : "bg-blue-800"
          }`}
          title="Toggle Dark Mode"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
              dark ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
