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
