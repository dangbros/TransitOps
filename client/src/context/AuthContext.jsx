// import { createContext, useContext, useState, useEffect } from "react";
// import { loginUser, signupUser, getCurrentUser } from "../api/auth";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {

//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // On app load, check if a token exists and try to restore the session
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

//   const login = async (email, password) => {
//     const data = await loginUser(email, password);
//     localStorage.setItem("token", data.token);
//     setUser(data.user);
//     return data.user;
//   };

//   const signup = async (formData) => {
//     const data = await signupUser(formData);
//     localStorage.setItem("token", data.token);
//     setUser(data.user);
//     return data.user;
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// }
