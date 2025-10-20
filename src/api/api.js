import axios from "axios";

const BASE_URL = "https://bookflow-1ceq.onrender.com/api"; // backend URL
///http://localhost:5000
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

const api2 = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
//utility apis
export const logout = () => api.post("/logout");
export const forgotpass = (identifier) => api.post("/forgotPass", identifier);
export const resetPass = (data) => api.post("/resetPass",data);

//library apis
export const signupLibPre = (data) => api.post("/library/pre-signup", data);
export const LoginLib = (data) => api.post("/library/login", data);
export const DataLib = () => api.get("/library/libdata");

//books apis
export const AddBook = (data) => {
  console.log(BASE_URL);
  return api2.post("/book/addBook", data);
}

//librarian apis
export const LoginLibrarian = (data) =>
  api.post("/librarian/LoginLibrarian", data);

export const LibrarianData = () =>
  api.get(`/librarian/getLibrarian`);

export const AddLibrarian = (data) => api2.post(`/librarian/AddLibrarian`, data);


export default api;
