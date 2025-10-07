import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
//import Login from "./pages/Login";
import LibrarySignup from "./pages/LibrarySignup";
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
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
