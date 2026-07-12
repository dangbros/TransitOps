import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Toaster } from "react-hot-toast";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Toaster position="top-right" reverseOrder={false} />
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
