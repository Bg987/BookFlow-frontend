import axios from "axios";

const BASE_URL = "http://localhost:5000/api"; // backend URL
//https://bookflow-1ceq.onrender.com
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})
//utility apis
export const logout = () => api.post("/logout");
export const forgotpass = (identifier) => api.post("/forgotPass", identifier);
export const resetPass = (data) => api.post("/resetPass",data);

//library apis
export const signupLibPre = (data) => api.post("/library/pre-signup", data);
export const LoginLib = (data) => api.post("/library/login", data);
export const DataLib = () => api.get("/library/libdata");

//librarian apis
// Remove default Content-Type for multipart requests
export const AddLibrarian = (data) => {
  return axios.post(`${BASE_URL}/librarian/AddLibrarian`, data, {
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" }, // explicitly set for FormData
  });
};

export default api;
