import React from "react";
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import * as api from "../api/api";
import LoginForm from "../components/loginComponent";

const Login = () => {
  const location = useLocation();
  const role = location.state?.role;
  // Dynamically pick API based on role
  const loginApi = api[`Login${role}`];
  const redirect = `/dash${role}`;

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
      }}
    >
      <LoginForm
        Type={role}
        loginApi={loginApi}
        onSuccessRedirect={redirect}
        role={role}
      />
    </Box>
  );
};

export default Login;
