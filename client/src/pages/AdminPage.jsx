import React, { useState, useEffect } from "react";
import {
  FaTruck,
  FaWarehouse,
  FaRoute,
  FaUserTie,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import {
  getVehicles,
  createVehicle,
  deleteVehicle,
  getDrivers,
  createDriver,
  deleteDriver,
  getTrips,
  createTrip,
  deleteTrip,
} from "../api/auth";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Live Data State
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State matching Pydantic schemas exactly
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({
    name_model: "",
    registration_number: "",
    type: "",
    region: "",
    max_load_capacity: "",
    odometer: "",
    acquisition_cost: "",
    status: "Available",
  });

  const [showDriverModal, setShowDriverModal] = useState(false);
  const [driverForm, setDriverForm] = useState({
    name: "",
    license_number: "",
    license_category: "",
    license_expiry_date: "",
    contact_number: "",
    status: "Available",
  });

  const [showTripModal, setShowTripModal] = useState(false);
  const [tripForm, setTripForm] = useState({
    source: "",
    destination: "",
    vehicle_id: "",
    driver_id: "",
    cargo_weight: "",
    planned_distance: "",
  });

  // Fetch all database records
  const fetchData = async () => {
    setLoading(true);
    try {
      const [vData, dData, tData] = await Promise.all([
        getVehicles(),
        getDrivers(),
        getTrips(),
      ]);
      setVehicles(vData);
      setDrivers(dData);
      setTrips(tData);
    } catch (err) {
      toast.error(err.message || "Failed to load live database records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers for Vehicles
  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name_model: vehicleForm.name_model,
        registration_number: vehicleForm.registration_number,
        type: vehicleForm.type,
        region: vehicleForm.region || null,
        max_load_capacity: Number(vehicleForm.max_load_capacity),
        odometer: Number(vehicleForm.odometer) || 0,
        acquisition_cost: Number(vehicleForm.acquisition_cost),
        status: vehicleForm.status,
      };
      await createVehicle(payload);
      toast.success("Vehicle registered successfully!");
      setShowVehicleModal(false);
      setVehicleForm({
        name_model: "",
        registration_number: "",
        type: "",
        region: "",
        max_load_capacity: "",
        odometer: "",
        acquisition_cost: "",
        status: "Available",
      });
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to create vehicle.");
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await deleteVehicle(id);
      toast.success("Vehicle deleted successfully!");
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to delete vehicle.");
    }
  };

  // Handlers for Drivers
  const handleAddDriver = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: driverForm.name,
        license_number: driverForm.license_number,
        license_category: driverForm.license_category,
        license_expiry_date: driverForm.license_expiry_date,
        contact_number: driverForm.contact_number || null,
        status: driverForm.status,
      };
      await createDriver(payload);
      toast.success("Driver registered successfully!");
      setShowDriverModal(false);
      setDriverForm({
        name: "",
        license_number: "",
        license_category: "",
        license_expiry_date: "",
        contact_number: "",
        status: "Available",
      });
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to register driver.");
    }
  };

  const handleDeleteDriver = async (id) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;
    try {
      await deleteDriver(id);
      toast.success("Driver profile deleted.");
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to delete driver.");
    }
  };

  // Handlers for Trips
  const handleAddTrip = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        source: tripForm.source,
        destination: tripForm.destination,
        vehicle_id: Number(tripForm.vehicle_id),
        driver_id: Number(tripForm.driver_id),
        cargo_weight: Number(tripForm.cargo_weight),
        planned_distance: Number(tripForm.planned_distance),
      };
      await createTrip(payload);
      toast.success("Trip dispatched successfully!");
      setShowTripModal(false);
      setTripForm({
        source: "",
        destination: "",
        vehicle_id: "",
        driver_id: "",
        cargo_weight: "",
        planned_distance: "",
      });
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to dispatch trip.");
    }
  };

  const handleDeleteTrip = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trip record?")) return;
    try {
      await deleteTrip(id);
      toast.success("Trip deleted successfully!");
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to delete trip.");
    }
  };

  // Static KPI Card details mapped to state lengths
  const kpis = [
    { title: "Total Registered Vehicles", value: vehicles.length, color: "text-green-600", icon: <FaTruck size={24} /> },
    { title: "Available Vehicles", value: vehicles.filter(v => v.status === "Available" || v.status === "available").length, color: "text-blue-600", icon: <FaWarehouse size={24} /> },
    { title: "Registered Drivers", value: drivers.length, color: "text-indigo-600", icon: <FaUserTie size={24} /> },
    { title: "Total Assigned Trips", value: trips.length, color: "text-purple-600", icon: <FaRoute size={24} /> },
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Fleet Operations</h1>
          <p className="text-slate-500 mt-1">Real-time database administration dashboard.</p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-200 p-1.5 rounded-xl gap-1">
          {["overview", "vehicles", "drivers", "trips"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition ${
                activeTab === tab ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((kpi, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-400">{kpi.title}</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-2">{kpi.value}</h3>
                </div>
                <div className={`${kpi.color} p-4 bg-slate-50 rounded-xl`}>{kpi.icon}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Operations Summary</h3>
              <p className="text-slate-500 text-sm">Select tabs above to manage core database objects, create vehicles, add drivers, and dispatch routes.</p>
            </div>
          </div>
        </div>
      )}

      {/* Vehicles Tab */}
      {activeTab === "vehicles" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Fleet Vehicles ({vehicles.length})</h3>
            <button
              onClick={() => setShowVehicleModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition"
            >
              <FaPlus size={12} /> Add Vehicle
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-sm font-semibold">
                  <th className="py-4">ID</th>
                  <th className="py-4">Model Name</th>
                  <th className="py-4">Registration</th>
                  <th className="py-4">Type</th>
                  <th className="py-4">Max Capacity</th>
                  <th className="py-4">Odometer</th>
                  <th className="py-4">Cost</th>
                  <th className="py-4">Status</th>
                  <th className="py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {vehicles.map((v) => (
                  <tr key={v.id} className="text-slate-700 text-sm">
                    <td className="py-4 font-medium">#{v.id}</td>
                    <td className="py-4 font-semibold">{v.name_model}</td>
                    <td className="py-4 font-mono">{v.registration_number}</td>
                    <td className="py-4">{v.type}</td>
                    <td className="py-4">{v.max_load_capacity} kg</td>
                    <td className="py-4">{v.odometer.toLocaleString()} km</td>
                    <td className="py-4">${v.acquisition_cost.toLocaleString()}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        v.status === "Available" || v.status === "available" ? "bg-green-55 text-green-700" : "bg-yellow-55 text-yellow-700"
                      }`}>{v.status}</span>
                    </td>
                    <td className="py-4 text-center">
                      <button
                        onClick={() => handleDeleteVehicle(v.id)}
                        className="text-red-500 hover:text-red-700 p-2 transition cursor-pointer"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Drivers Tab */}
      {activeTab === "drivers" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">System Drivers ({drivers.length})</h3>
            <button
              onClick={() => setShowDriverModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition"
            >
              <FaPlus size={12} /> Add Driver
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-sm font-semibold">
                  <th className="py-4">ID</th>
                  <th className="py-4">Name</th>
                  <th className="py-4">License Number</th>
                  <th className="py-4">Category</th>
                  <th className="py-4">Expiry Date</th>
                  <th className="py-4">Status</th>
                  <th className="py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {drivers.map((d) => (
                  <tr key={d.id} className="text-slate-700 text-sm">
                    <td className="py-4 font-medium">#{d.id}</td>
                    <td className="py-4 font-semibold">{d.name}</td>
                    <td className="py-4 font-mono">{d.license_number}</td>
                    <td className="py-4 font-semibold">{d.license_category}</td>
                    <td className="py-4 font-mono">{d.license_expiry_date}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        d.status === "Available" || d.status === "available" ? "bg-green-55 text-green-700" : "bg-yellow-55 text-yellow-700"
                      }`}>{d.status}</span>
                    </td>
                    <td className="py-4 text-center">
                      <button
                        onClick={() => handleDeleteDriver(d.id)}
                        className="text-red-500 hover:text-red-700 p-2 transition cursor-pointer"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Trips Tab */}
      {activeTab === "trips" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Dispatched Routes ({trips.length})</h3>
            <button
              onClick={() => setShowTripModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition"
            >
              <FaPlus size={12} /> Dispatch Trip
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-sm font-semibold">
                  <th className="py-4">ID</th>
                  <th className="py-4">Route</th>
                  <th className="py-4">Planned Distance</th>
                  <th className="py-4">Cargo Weight</th>
                  <th className="py-4">Vehicle ID</th>
                  <th className="py-4">Driver ID</th>
                  <th className="py-4">Status</th>
                  <th className="py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {trips.map((t) => (
                  <tr key={t.id} className="text-slate-700 text-sm">
                    <td className="py-4 font-medium">#{t.id}</td>
                    <td className="py-4 font-semibold">{t.source} ➔ {t.destination}</td>
                    <td className="py-4">{t.planned_distance} km</td>
                    <td className="py-4 font-mono">{t.cargo_weight} kg</td>
                    <td className="py-4 font-mono">#{t.vehicle_id}</td>
                    <td className="py-4 font-mono">#{t.driver_id}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        t.status === "Completed" || t.status === "completed" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"
                      }`}>{t.status}</span>
                    </td>
                    <td className="py-4 text-center">
                      <button
                        onClick={() => handleDeleteTrip(t.id)}
                        className="text-red-500 hover:text-red-700 p-2 transition cursor-pointer"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vehicle Modal */}
      {showVehicleModal && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-slate-800">Add Fleet Vehicle</h3>
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Model Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heavy Duty Truck"
                  value={vehicleForm.name_model}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, name_model: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Registration Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WB-12AB1234"
                  value={vehicleForm.registration_number}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, registration_number: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Type (Category)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Truck, Van, Trailer"
                  value={vehicleForm.type}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, type: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Region</label>
                <input
                  type="text"
                  placeholder="e.g. North, East"
                  value={vehicleForm.region}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, region: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Max Load Capacity (kg)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 5000"
                  value={vehicleForm.max_load_capacity}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, max_load_capacity: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Odometer Mileage (km)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1500"
                  value={vehicleForm.odometer}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, odometer: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Acquisition Cost ($)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 25000"
                  value={vehicleForm.acquisition_cost}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, acquisition_cost: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowVehicleModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 font-semibold rounded-xl text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 font-semibold rounded-xl text-white transition"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Driver Modal */}
      {showDriverModal && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-slate-800">Add Driver Profile</h3>
            <form onSubmit={handleAddDriver} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Driver Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={driverForm.name}
                  onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">License Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DL-12345678"
                  value={driverForm.license_number}
                  onChange={(e) => setDriverForm({ ...driverForm, license_number: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">License Category</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class A, HGV"
                  value={driverForm.license_category}
                  onChange={(e) => setDriverForm({ ...driverForm, license_category: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">License Expiry Date</label>
                <input
                  type="date"
                  required
                  value={driverForm.license_expiry_date}
                  onChange={(e) => setDriverForm({ ...driverForm, license_expiry_date: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Contact Number</label>
                <input
                  type="text"
                  placeholder="e.g. +91 9999999999"
                  value={driverForm.contact_number}
                  onChange={(e) => setDriverForm({ ...driverForm, contact_number: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDriverModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 font-semibold rounded-xl text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 font-semibold rounded-xl text-white transition"
                >
                  Register Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Trip Modal */}
      {showTripModal && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-slate-800">Dispatch New Trip</h3>
            <form onSubmit={handleAddTrip} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Source Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kolkata"
                  value={tripForm.source}
                  onChange={(e) => setTripForm({ ...tripForm, source: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Destination</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Delhi"
                  value={tripForm.destination}
                  onChange={(e) => setTripForm({ ...tripForm, destination: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Assign Vehicle</label>
                <select
                  required
                  value={tripForm.vehicle_id}
                  onChange={(e) => setTripForm({ ...tripForm, vehicle_id: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white outline-none focus:border-blue-500"
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.filter(v => v.status === "Available" || v.status === "available").map(v => (
                    <option key={v.id} value={v.id}>{v.name_model} ({v.registration_number})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Assign Driver</label>
                <select
                  required
                  value={tripForm.driver_id}
                  onChange={(e) => setTripForm({ ...tripForm, driver_id: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white outline-none focus:border-blue-500"
                >
                  <option value="">Select Driver</option>
                  {drivers.filter(d => d.status === "Available" || d.status === "available").map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Cargo Weight (kg)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 2500"
                  value={tripForm.cargo_weight}
                  onChange={(e) => setTripForm({ ...tripForm, cargo_weight: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Planned Distance (km)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 450"
                  value={tripForm.planned_distance}
                  onChange={(e) => setTripForm({ ...tripForm, planned_distance: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTripModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 font-semibold rounded-xl text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 font-semibold rounded-xl text-white transition"
                >
                  Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;