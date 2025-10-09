import { Box } from "@mui/material";
import LibraryLoginForm from "../components/loginComponent";
import { LoginLib } from "../api/api"; // API function for library login

const LibraryLogin = () => {
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
      <LibraryLoginForm 
        Type = "Library"
        loginApi={LoginLib} 
        onSuccessRedirect="/dashLib" 
        role="Library" 
      />
    </Box>
  );
};

export default LibraryLogin;
