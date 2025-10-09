import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {logout} from "../api/api";

const LogoutButton = ({ redirectTo}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Call backend logout route to remove cookie
      const res = await logout();
        // Redirect to login page
        if (res.status === 200) {
            navigate(redirectTo);
        }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outlined"
      color="secondary"
      onClick={handleLogout}
      disabled={loading}
      sx={{
        borderRadius: 2,
        textTransform: "none",
        fontWeight: "bold",
      }}
    >
      {loading ? <CircularProgress size={20} /> : "Logout"}
    </Button>
  );
};

export default LogoutButton;
