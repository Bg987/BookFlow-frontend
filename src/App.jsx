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
          <Route path="/dashLib" element={<LibraryDashboard />} />
          <Route path="/forgotPass" element={<ForgotPassword />} />
          <Route path="/resetPass" element={<ResetPassword />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
