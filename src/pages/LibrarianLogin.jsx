import React from "react";
import { Box } from "@mui/material";
import LoginForm from "../components/loginComponent"; // Reusable login component
import { LoginLibrarian } from "../api/api"; // API function for librarian login

const LibrarianLogin = () => {
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
        Type="Librarian"
        loginApi={LoginLibrarian}
        onSuccessRedirect="/dashLibrarian"
        role="Librarian"
      />
    </Box>
  );
};

export default LibrarianLogin;
