import React, { useState, useEffect } from "react";
import {
  FaShieldAlt,
  FaClipboardCheck,
  FaPlus,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { getVehicles, getMaintenance, createMaintenance, completeMaintenance } from "../api/auth";

const SafetyOfficerPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State matching MaintenanceCreate schema exactly
  const [showLogModal, setShowLogModal] = useState(false);
  const [logForm, setLogForm] = useState({
    vehicle_id: "",
    description: "",
    cost: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vData, mData] = await Promise.all([getVehicles(), getMaintenance()]);
      setVehicles(vData);
      setMaintenance(mData);
    } catch (err) {
      toast.error(err.message || "Failed to load safety data.");
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

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        vehicle_id: Number(logForm.vehicle_id),
        description: logForm.description,
        cost: Number(logForm.cost) || 0,
      };
      await createMaintenance(payload);
      toast.success("Maintenance log created successfully!");
      setShowLogModal(false);
      setLogForm({ vehicle_id: "", description: "", cost: "" });
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to log maintenance.");
    }
  };

  const handleResolve = async (id) => {
    try {
      await completeMaintenance(id);
      toast.success("Maintenance marked as completed.");
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to complete maintenance.");
    }
  };

  const getVehicleInfo = (vId) => {
    const vehicle = vehicles.find((v) => v.id === vId);
    return vehicle ? `${vehicle.name_model} (${vehicle.registration_number})` : `Vehicle #${vId}`;
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Safety & Maintenance</h1>
          <p className="text-slate-500 mt-1">Log Inspections, resolve safety alerts, and view compliance.</p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition"
        >
          <FaPlus size={12} /> Log Maintenance
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-400">Total Inspections Logged</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">{maintenance.length}</h3>
          </div>
          <div className="text-blue-600 p-4 bg-slate-50 rounded-xl"><FaClipboardCheck size={24} /></div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-400">Fleet Safety Score</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">96%</h3>
          </div>
          <div className="text-green-600 p-4 bg-slate-50 rounded-xl"><FaShieldAlt size={24} /></div>
        </div>
      </div>

      {/* Maintenance Logs */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Recent Maintenance & Inspection Log ({maintenance.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-sm font-semibold">
                <th className="py-4">Log ID</th>
                <th className="py-4">Vehicle</th>
                <th className="py-4">Status</th>
                <th className="py-4">Cost</th>
                <th className="py-4">Details</th>
                <th className="py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {maintenance.map((m) => (
                <tr key={m.id} className="text-slate-700 text-sm">
                  <td className="py-4 font-medium">#{m.id}</td>
                  <td className="py-4 font-semibold">{getVehicleInfo(m.vehicle_id)}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      m.status === "completed" || m.status === "Completed" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                    }`}>{m.status}</span>
                  </td>
                  <td className="py-4 font-semibold">${m.cost.toLocaleString()}</td>
                  <td className="py-4 text-slate-500">{m.description}</td>
                  <td className="py-4 text-center">
                    {m.status && m.status.toLowerCase() === "open" && (
                      <button
                        onClick={() => handleResolve(m.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-semibold cursor-pointer"
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Maintenance Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-slate-800 font-bold">Log Maintenance</h3>
            <form onSubmit={handleLogSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Select Vehicle</label>
                <select
                  required
                  value={logForm.vehicle_id}
                  onChange={(e) => setLogForm({ ...logForm, vehicle_id: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white outline-none focus:border-blue-500"
                >
                  <option value="">Choose Vehicle</option>
                  {vehicles.filter(v => v.status && v.status.toLowerCase() === "available").map((v) => (
                    <option key={v.id} value={v.id}>{v.name_model} ({v.registration_number})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Cost ($)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 250"
                  value={logForm.cost}
                  onChange={(e) => setLogForm({ ...logForm, cost: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Log Details</label>
                <textarea
                  required
                  rows="3"
                  placeholder="e.g. Brakes changed, oil filter replaced."
                  value={logForm.description}
                  onChange={(e) => setLogForm({ ...logForm, description: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 resize-none"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowLogModal(false);
                    setLogForm({ vehicle_id: "", description: "", cost: "" });
                  }}
                  className="flex-1 py-2.5 border border-slate-200 font-semibold rounded-xl text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 font-semibold rounded-xl text-white transition"
                >
                  Log Maintenance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyOfficerPage;