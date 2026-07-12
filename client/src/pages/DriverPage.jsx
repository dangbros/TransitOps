import React, { useState, useEffect } from "react";
import {
  FaRoute,
  FaTruck,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { getTrips, completeTrip, getVehicles, getDrivers } from "../api/auth";

const DriverPage = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Completion State
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completeForm, setCompleteForm] = useState({
    actual_distance: "",
    final_odometer: "",
    fuel_consumed: "",
    revenue: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tData, vData, dData] = await Promise.all([getTrips(), getVehicles(), getDrivers()]);
      setTrips(tData);
      setVehicles(vData);
      setDrivers(dData);
    } catch (err) {
      toast.error(err.message || "Failed to load driver schedule.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-refresh when switching back to this tab
    const handleFocus = () => {
      fetchData();
    };
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Match the logged-in user to their driver profile (matching email prefix to driver name)
  const getMatchedDriver = () => {
    if (!user || !user.email) return null;
    const emailPrefix = user.email.split("@")[0].toLowerCase();
    
    // Try to find a driver whose name matches or contains the email prefix
    const matched = drivers.find((d) => d.name.toLowerCase().includes(emailPrefix));
    // Fallback to driver@transitops.com matching Alex Carter (default seed)
    if (!matched && emailPrefix === "driver") {
      return drivers.find((d) => d.name === "Alex Carter");
    }
    return matched;
  };

  const currentDriver = getMatchedDriver();
  const driverId = currentDriver ? currentDriver.id : null;

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        actual_distance: Number(completeForm.actual_distance),
        final_odometer: Number(completeForm.final_odometer),
        fuel_consumed: Number(completeForm.fuel_consumed) || 0,
        revenue: Number(completeForm.revenue) || 0,
      };
      await completeTrip(selectedTrip.id, payload);
      toast.success("Trip completed successfully!");
      setShowCompleteModal(false);
      setCompleteForm({ actual_distance: "", final_odometer: "", fuel_consumed: "", revenue: "" });
      setSelectedTrip(null);
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to complete trip. Verify odometer rules.");
    }
  };

  const getVehicleInfo = (vId) => {
    const vehicle = vehicles.find((v) => v.id === vId);
    return vehicle ? `${vehicle.name_model} (${vehicle.registration_number})` : `Vehicle #${vId}`;
  };

  // Filter trips by matched driver ID
  const activeTrips = trips.filter(
    (t) =>
      (t.status === "Dispatched" || t.status === "dispatched") &&
      (driverId ? t.driver_id === driverId : true)
  );
  const completedTrips = trips.filter(
    (t) =>
      (t.status === "Completed" || t.status === "completed") &&
      (driverId ? t.driver_id === driverId : true)
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">
          Welcome back, {currentDriver ? currentDriver.name : (user?.email || "Driver")}! 👋
        </h1>
        <p className="text-slate-500 mt-1">
          {currentDriver 
            ? `Displaying dispatch schedule for Driver Profile #${currentDriver.id}.`
            : "Please ensure your driver profile name matches your email prefix to sync assignments."}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-400">Assigned Trips</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">{activeTrips.length}</h3>
          </div>
          <div className="text-blue-600 p-4 bg-slate-50 rounded-xl"><FaRoute size={24} /></div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-400">Completed Trips</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">{completedTrips.length}</h3>
          </div>
          <div className="text-green-600 p-4 bg-slate-50 rounded-xl"><FaCheckCircle size={24} /></div>
        </div>
      </div>

      {/* Active Trips */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Current Dispatch</h2>
        {activeTrips.length === 0 ? (
          <p className="text-slate-400 text-sm">No active dispatches assigned to you today.</p>
        ) : (
          <div className="space-y-6">
            {activeTrips.map((trip) => (
              <div key={trip.id} className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-green-600" />
                    <div>
                      <p className="text-xs text-slate-400">Route</p>
                      <p className="font-semibold text-slate-700">{trip.source} ➔ {trip.destination}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaTruck className="text-blue-600" />
                    <div>
                      <p className="text-xs text-slate-400">Assigned Truck</p>
                      <p className="font-semibold text-slate-700">{getVehicleInfo(trip.vehicle_id)}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedTrip(trip);
                    setShowCompleteModal(true);
                  }}
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-sm transition"
                >
                  Complete Trip
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trip Log History */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Trip Log History ({completedTrips.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-sm font-semibold">
                <th className="py-4">Trip ID</th>
                <th className="py-4">Route</th>
                <th className="py-4">Vehicle</th>
                <th className="py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {completedTrips.map((t) => (
                <tr key={t.id} className="text-slate-700 text-sm">
                  <td className="py-4 font-medium">#{t.id}</td>
                  <td className="py-4 font-semibold">{t.source} ➔ {t.destination}</td>
                  <td className="py-4">{getVehicleInfo(t.vehicle_id)}</td>
                  <td className="py-4">
                    <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">Completed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompleteModal && selectedTrip && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-slate-800 font-bold">Complete Trip</h3>
            <form onSubmit={handleCompleteSubmit} className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 mb-4">
                  Confirm route details for <strong>{selectedTrip.source} ➔ {selectedTrip.destination}</strong>.
                </p>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Actual Distance Covered (km)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 480"
                      value={completeForm.actual_distance}
                      onChange={(e) => setCompleteForm({ ...completeForm, actual_distance: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Final Odometer Reading (km)</label>
                    <input
                      type="number"
                      required
                      placeholder="Must be greater than starting mileage"
                      value={completeForm.final_odometer}
                      onChange={(e) => setCompleteForm({ ...completeForm, final_odometer: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Fuel Consumed (Liters)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 45"
                      value={completeForm.fuel_consumed}
                      onChange={(e) => setCompleteForm({ ...completeForm, fuel_consumed: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Trip Revenue ($)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1200"
                      value={completeForm.revenue}
                      onChange={(e) => setCompleteForm({ ...completeForm, revenue: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCompleteModal(false);
                    setCompleteForm({ actual_distance: "", final_odometer: "", fuel_consumed: "", revenue: "" });
                  }}
                  className="flex-1 py-2.5 border border-slate-200 font-semibold rounded-xl text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 font-semibold rounded-xl text-white transition"
                >
                  Complete Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverPage;