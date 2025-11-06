import axios from "axios";

const BASE_URL = "http://localhost:5000/api"; // also change in librariansdata,liband member dashboard comp.
/// http://192.168.41.47:5000 https://bookflow-1ceq.onrender.com http://10.182.99.47:5000 
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
export const LoginLibrary = (data) => api.post("/library/login", data);
export const DataLib = () => api.get("/library/libdata");
export const DataLibraians = () => api.get("/library/librariansdata");
export const ActiveLibraianIds = () => api.get("/library/ActivelibrarianIds");

//books apis
export const AddBook = (data) => api2.post("/book/addBook", data);
export const getBooks = (filters = {}) =>
  api.get(`/book/getBooks`, { params: filters });
export const getBookDetails = (scannedData) =>
  api.get(`/book/getBookDetails/${scannedData}`);
export const updateBook = (bookId, updatedData) =>
  api.patch(`/book/updateBook/${bookId}`, updatedData);

//librarian apis
export const LoginLibrarian = (data) =>
  api.post("/librarian/LoginLibrarian", data);
export const LibrarianData = () =>
  api.get(`/librarian/getLibrarian`);
export const AddLibrarian = (data) => api2.post(`/librarian/AddLibrarian`, data);
;
//member apis
export const signupMember = (data) => api2.post("/member/pre-signup", data);
export const LoginMember = (data) => api.post("/member/login", data);
export const MemberData = () => api.get(`member/getMember`);
export const getNearLibs = ({ latitude, longitude}) =>
  api.get(`/member/GetNearLibs?lat=${latitude}&lon=${longitude}`);
export const LibReq = (data) => api.post("/member/apply", data);
export default api;
