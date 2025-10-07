import axios from "axios";

const BASE_URL = "http://localhost:5000/api"; // backend URL

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Auth APIs
export const loginUser = (data) => api.post("/auth/login", data);
export const signupUser = (data) => api.post("/auth/signup", data);

export default api;
