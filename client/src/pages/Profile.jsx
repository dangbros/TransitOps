import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getDrivers } from "../api/auth";
import {
  FaUserCircle,
  FaEnvelope,
  FaUserTag,
  FaIdCard,
  FaStar,
  FaInfoCircle,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const Profile = () => {
  const { user, logout } = useAuth();
  const [driverProfile, setDriverProfile] = useState(null);
  const [loadingDriver, setLoadingDriver] = useState(false);

  useEffect(() => {
    const fetchDriverDetails = async () => {
      if (user && user.role === "Driver") {
        setLoadingDriver(true);
        try {
          const driversData = await getDrivers();
          const emailPrefix = user.email.split("@")[0].toLowerCase();
          
          // Match driver profile by email prefix
          const matched = driversData.find((d) => d.name.toLowerCase().includes(emailPrefix));
          if (matched) {
            setDriverProfile(matched);
          }
        } catch (err) {
          toast.error("Failed to load driver profile details.");
        } finally {
          setLoadingDriver(false);
        }
      }
    };

    fetchDriverDetails();
  }, [user]);

  // If no user context, show loading
  if (!user) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-slate-500 font-semibold">
        Loading profile details...
      </div>
    );
  }

  // Get display name from email prefix
  const displayName = user.email ? user.email.split("@")[0] : "User";

  return (
    <div className="min-h-full bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
              <FaUserCircle className="text-6xl text-blue-600" />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-extrabold text-slate-800 capitalize">
                {driverProfile ? driverProfile.name : displayName}
              </h1>
              <p className="text-blue-600 font-semibold mt-1">
                {user.role}
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Active Database Session
              </p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 mt-8 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Account Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-50 rounded-xl text-blue-600">
                <FaUserCircle size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">Display Username</p>
                <p className="font-semibold text-slate-700 capitalize">
                  {driverProfile ? driverProfile.name : displayName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-50 rounded-xl text-blue-600">
                <FaEnvelope size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">Email Address</p>
                <p className="font-semibold text-slate-700">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-50 rounded-xl text-blue-600">
                <FaUserTag size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">Account Role</p>
                <p className="font-semibold text-slate-700">{user.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Driver-Specific Information Card */}
        {user.role === "Driver" && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 mt-8 p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Driver Profile Details
            </h2>

            {loadingDriver ? (
              <p className="text-slate-400 text-sm">Fetching driver license details...</p>
            ) : driverProfile ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl text-blue-600">
                    <FaIdCard size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">License Number</p>
                    <p className="font-semibold text-slate-700 font-mono">{driverProfile.license_number}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl text-blue-600">
                    <FaIdCard size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">License Category / Expiry</p>
                    <p className="font-semibold text-slate-700">
                      {driverProfile.license_category} (Expires: {driverProfile.license_expiry_date})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl text-blue-600">
                    <FaStar size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">Safety Score</p>
                    <p className="font-semibold text-slate-700">
                      {Math.round(driverProfile.safety_score * 100)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl text-blue-600">
                    <FaInfoCircle size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">Duty Status</p>
                    <span className="px-2.5 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                      {driverProfile.status}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-sm">
                No matched driver profile found. Please register this driver name ("{displayName}") in the Fleet Manager admin panel to load license details.
              </p>
            )}
          </div>
        )}

        {/* Action Panel */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 mt-8 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Account Controls
          </h2>

          <div className="flex gap-4">
            <button
              onClick={logout}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl transition cursor-pointer"
            >
              Sign Out of Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;