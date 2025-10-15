import axios from "axios";

const BASE_URL = "https://bookflow-1ceq.onrender.com/api"; // backend URL
//http://localhost:5000/
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
export const LoginLibrarian = (data) =>
  api.post("/librarian/LoginLibrarian", data);

export const LibrarianData = () =>
  api.get(`${BASE_URL}/librarian/getLibrarian`);

export const AddLibrarian = (data) => {
  return axios.post(`${BASE_URL}/librarian/AddLibrarian`, data, {
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" }, // explicitly set for FormData
  });
};

//books apis
export const fetchBookData = (isbn) => api.get(`${BASE_URL}/book/fetchByISBN/${isbn}`);
export default api;
