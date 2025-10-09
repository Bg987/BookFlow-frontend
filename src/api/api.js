import axios from "axios";

const BASE_URL = "https://bookflow-1ceq.onrender.com/api"; // backend URL
//http://localhost:5000
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

// Auth APIs
//export const loginUser = (data) => api.post("/auth/login", data);
export const logout = () => api.post("/logout");
export const signupLibPre = (data) => api.post("/library/pre-signup", data);
export const LoginLib = (data) => api.post("/library/login", data);
export const DataLib = () => api.get("/library/libdata");
export default api;
