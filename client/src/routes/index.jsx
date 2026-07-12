import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/login";
import SignUp from "../pages/SignUp";
import Profile from "../pages/Profile";
import DashboardLayout from "../pages/DashboardLayout";
import AdminPage from "../pages/AdminPage";
import DriverPage from "../pages/DriverPage";
import FinancialAnalystPage from "../pages/FinancialAnalystPage";
import SafetyOfficerPage from "../pages/SafetyOfficerPage";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "dashboard/admin",
        element: <AdminPage />,
      },
      {
        path: "dashboard/driver",
        element: <DriverPage />,
      },
      {
        path: "dashboard/safety-officer",
        element: <SafetyOfficerPage />,
      },
      {
        path: "dashboard/financial-analyst",
        element: <FinancialAnalystPage />,
      },
      {
        path: "my-profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
]);

export default routes;
