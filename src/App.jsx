import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import "leaflet/dist/leaflet.css";
import LibrarySignup from "./pages/LibrarySignup";
import LibraryDashboard from "./pages/LibraryDashboard";
import ForgotPassword from "./pages/forgotPassword";
import LibraryLogin from "./pages/LibraryLogin";
import ResetPassword from "./pages/resetPassword";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import LibrarianLogin from "./pages/LibrarianLogin";
import AddBook from "./pages/AddBook";
import LibrarianDashboard from "./pages/LibrarianDashboard";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/library-signup" element={<LibrarySignup />} />
          <Route path="/library-login" element={<LibraryLogin />} />
          <Route path="/dashLibrary" element={<LibraryDashboard />} />
          <Route path="/librarian-login" element={<LibrarianLogin />} />
          <Route path="/dashLibrarian" element={<LibrarianDashboard />} />
          <Route path="/forgotPass" element={<ForgotPassword />} />
          <Route path="/resetPass" element={<ResetPassword />} />
          <Route path="/addBook" element={<AddBook />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
