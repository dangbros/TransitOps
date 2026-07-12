import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// ─────────────────────────────────────────────────────────────
// MOCK AUTH — active now, no backend required.
// Matches the demo credentials shown on the landing page (BasePage.jsx):
//   manager@demo.com / driver@demo.com / safety@demo.com / finance@demo.com
//   password for all: Password@123
// Delete this whole MOCK block once the real backend is ready,
// and uncomment the REAL AUTH block further down.
// ─────────────────────────────────────────────────────────────

const DEMO_USERS = {
  "manager@demo.com": { name: "Fleet Manager Demo", role: "fleet_manager" },
  "driver@demo.com": { name: "Driver Demo", role: "driver" },
  "safety@demo.com": { name: "Safety Officer Demo", role: "safety_officer" },
  "finance@demo.com": {
    name: "Financial Analyst Demo",
    role: "financial_analyst",
  },
};
const DEMO_PASSWORD = "Password@123";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on refresh
  useEffect(() => {
    const stored = localStorage.getItem("mockUser");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const match = DEMO_USERS[email.toLowerCase()];
    if (!match || password !== DEMO_PASSWORD) {
      throw new Error(
        "Invalid email or password. Try one of the demo accounts.",
      );
    }
    const loggedInUser = { email, ...match };
    localStorage.setItem("mockUser", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  };

  const signup = async (formData) => {
    // In mock mode, signup just logs you in as whatever role you picked
    const newUser = {
      email: formData.email,
      name: formData.name,
      role: formData.role,
    };
    localStorage.setItem("mockUser", JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem("mockUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// ─────────────────────────────────────────────────────────────
// REAL AUTH — uncomment this whole block once the backend's
// login/signup/me endpoints exist, and delete the MOCK block above.
// Also update api/auth.js with the real endpoint paths at that point.
// ─────────────────────────────────────────────────────────────

// import { loginUser, signupUser, getCurrentUser } from "../api/auth";
//
// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setLoading(false);
//       return;
//     }
//     getCurrentUser()
//       .then((data) => setUser(data))
//       .catch(() => localStorage.removeItem("token"))
//       .finally(() => setLoading(false));
//   }, []);
//
//   const login = async (email, password) => {
//     const data = await loginUser(email, password);
//     localStorage.setItem("token", data.token);
//     setUser(data.user);
//     return data.user;
//   };
//
//   const signup = async (formData) => {
//     const data = await signupUser(formData);
//     localStorage.setItem("token", data.token);
//     setUser(data.user);
//     return data.user;
//   };
//
//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//   };
//
//   return (
//     <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
//
// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// }
