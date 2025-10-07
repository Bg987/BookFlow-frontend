import axios from "axios";

const BASE_URL = "https://bookflow-1ceq.onrender.com/api"; // backend URL

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
})

// Auth APIs
//export const loginUser = (data) => api.post("/auth/login", data);
export const signupLibPre = (data) => api.post("/library/pre-signup", data);

export default api;
