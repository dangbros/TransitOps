import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// Initialize theme from localStorage or system settings
if (
  localStorage.getItem("theme") === "dark" ||
  (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}
import { RouterProvider } from "react-router/dom";

import routes from "./routes/index.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={routes} />
    </AuthProvider>
  </StrictMode>,
);
