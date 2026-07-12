import React, { useState, useEffect } from "react";
import {
  FaGasPump,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaArrowTrendUp,
  FaPlus,
} from "react-icons/fa6";
import { toast } from "react-hot-toast";
import { getExpenses, createExpense, getVehicles, getTrips } from "../api/auth";

const FinancialAnalystPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    vehicle_id: "",
    trip_id: "",
    amount: "",
    category: "Fuel", // e.g. "Fuel", "Maintenance", "Tolls", "Other"
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eData, vData, tData] = await Promise.all([
        getExpenses(),
        getVehicles(),
        getTrips(),
      ]);
      setExpenses(eData);
      setVehicles(vData);
      setTrips(tData);
    } catch (err) {
      toast.error(err.message || "Failed to load financial records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    try {
      await createExpense({
        ...expenseForm,
        vehicle_id: Number(expenseForm.vehicle_id),
        trip_id: Number(expenseForm.trip_id),
        amount: Number(expenseForm.amount),
      });
      toast.success("Expense logged successfully!");
      setShowExpenseModal(false);
      setExpenseForm({
        vehicle_id: "",
        trip_id: "",
        amount: "",
        category: "Fuel",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to record expense.");
    }
  };

  const getVehicleInfo = (vId) => {
    const vehicle = vehicles.find((v) => v.id === vId);
    return vehicle ? `${vehicle.name} (${vehicle.license_plate})` : `Vehicle #${vId}`;
  };

  // Calculate totals
  const totalCost = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const fuelCost = expenses.filter((e) => e.category === "Fuel").reduce((acc, curr) => acc + curr.amount, 0);
  const maintCost = expenses.filter((e) => e.category === "Maintenance").reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Financial Reports</h1>
          <p className="text-slate-500 mt-1">Log fleet expenses, monitor fuel/maintenance costs, and generate invoices.</p>
        </div>

        <button
          onClick={() => setShowExpenseModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition"
        >
          <FaPlus size={12} /> Add Expense
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-400">Total Operational Cost</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">${totalCost.toLocaleString()}</h3>
          </div>
          <div className="text-red-600 p-4 bg-slate-50 rounded-xl"><FaMoneyBillWave size={24} /></div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-400">Fuel Expenditure</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">${fuelCost.toLocaleString()}</h3>
          </div>
          <div className="text-blue-600 p-4 bg-slate-50 rounded-xl"><FaGasPump size={24} /></div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-400">Maintenance Expenditure</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">${maintCost.toLocaleString()}</h3>
          </div>
          <div className="text-orange-600 p-4 bg-slate-50 rounded-xl"><FaArrowTrendUp size={24} /></div>
        </div>
      </div>

      {/* Expense Logs */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Real-Time Expense Breakdown ({expenses.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-sm font-semibold">
                <th className="py-4">Expense ID</th>
                <th className="py-4">Category</th>
                <th className="py-4">Vehicle</th>
                <th className="py-4">Trip ID</th>
                <th className="py-4">Amount</th>
                <th className="py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {expenses.map((e) => (
                <tr key={e.id} className="text-slate-700 text-sm">
                  <td className="py-4 font-medium">#{e.id}</td>
                  <td className="py-4 font-semibold">{e.category}</td>
                  <td className="py-4 font-semibold">{getVehicleInfo(e.vehicle_id)}</td>
                  <td className="py-4 font-mono">#{e.trip_id}</td>
                  <td className="py-4 font-semibold">${e.amount.toLocaleString()}</td>
                  <td className="py-4 text-slate-500">{e.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-slate-800 font-bold">Add Expense Record</h3>
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Category</label>
                <select
                  required
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white outline-none focus:border-blue-500"
                >
                  <option value="Fuel">Fuel</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Tolls">Tolls</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Select Vehicle</label>
                <select
                  required
                  value={expenseForm.vehicle_id}
                  onChange={(e) => setExpenseForm({ ...expenseForm, vehicle_id: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white outline-none focus:border-blue-500"
                >
                  <option value="">Choose Vehicle</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>{v.name} ({v.license_plate})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Select Trip</label>
                <select
                  required
                  value={expenseForm.trip_id}
                  onChange={(e) => setExpenseForm({ ...expenseForm, trip_id: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white outline-none focus:border-blue-500"
                >
                  <option value="">Choose Trip Route</option>
                  {trips.map((t) => (
                    <option key={t.id} value={t.id}>Trip #{t.id} ({t.source} ➔ {t.destination})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Amount ($)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 50"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Description</label>
                <textarea
                  required
                  rows="2"
                  placeholder="Receipt number or billing details."
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 resize-none"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowExpenseModal(false);
                    setExpenseForm({
                      vehicle_id: "",
                      trip_id: "",
                      amount: "",
                      category: "Fuel",
                      description: "",
                      date: new Date().toISOString().split("T")[0],
                    });
                  }}
                  className="flex-1 py-2.5 border border-slate-200 font-semibold rounded-xl text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 font-semibold rounded-xl text-white transition"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialAnalystPage;