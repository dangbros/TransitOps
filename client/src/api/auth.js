import axiosClient from "./axiosClient";

export const loginUser = (email, password) => {
  const formData = new FormData();
  formData.append("username", email);
  formData.append("password", password);
  return axiosClient.post("/auth/login", formData);
};

export const signupUser = ({ email, password, role }) => {
  return axiosClient.post("/auth/signup", { email, password, role });
};

export const getCurrentUser = () => {
  return axiosClient.get("/auth/me");
};

// Vehicles CRUD
export const getVehicles = () => axiosClient.get("/vehicles");
export const createVehicle = (data) => axiosClient.post("/vehicles", data);
export const updateVehicle = (id, data) => axiosClient.put(`/vehicles/${id}`, data);
export const deleteVehicle = (id) => axiosClient.delete(`/vehicles/${id}`);

// Drivers CRUD
export const getDrivers = () => axiosClient.get("/drivers");
export const createDriver = (data) => axiosClient.post("/drivers", data);
export const updateDriver = (id, data) => axiosClient.put(`/drivers/${id}`, data);
export const deleteDriver = (id) => axiosClient.delete(`/drivers/${id}`);

// Trips CRUD
export const getTrips = () => axiosClient.get("/trips");
export const createTrip = (data) => axiosClient.post("/trips", data);
export const updateTrip = (id, data) => axiosClient.put(`/trips/${id}`, data);
export const dispatchTrip = (id) => axiosClient.post(`/trips/${id}/dispatch`);
export const cancelTrip = (id) => axiosClient.post(`/trips/${id}/cancel`);
export const completeTrip = (id, payload) => 
  axiosClient.post(`/trips/${id}/complete`, payload);
export const deleteTrip = (id) => axiosClient.delete(`/trips/${id}`);

// Maintenance CRUD
export const getMaintenance = () => axiosClient.get("/maintenance");
export const createMaintenance = (data) => axiosClient.post("/maintenance", data);
export const completeMaintenance = (id) => axiosClient.post(`/maintenance/${id}/complete`);

// Expenses CRUD
export const getExpenses = () => axiosClient.get("/expenses");
export const createExpense = (data) => axiosClient.post("/expenses", data);

// Dashboard KPIs
export const getDashboardKPIs = () => axiosClient.get("/dashboard/kpis");
