import { createBrowserRouter } from "react-router-dom";
import App from "../App";
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
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
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
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "admin",
        element: <AdminPage />,
      },
      {
        path: "driver",
        element: <DriverPage />,
      },
      {
        path: "safety-officer",
        element: <SafetyOfficerPage />,
      },
      {
        path: "financial-analyst",
        element: <FinancialAnalystPage />,
      },
    ],
  },
  {
    path: "/my-profile",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Profile />,
      },
    ],
  },
]);

export default routes;
