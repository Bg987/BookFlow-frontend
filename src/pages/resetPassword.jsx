import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import {resetPass} from "../api/api";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing token in reset link.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const response = await resetPass( {token,newPassword: password,});
      setSuccess(response.data.message || "Password reset successful!");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
        console.log(err);
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
         height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: { xs: 2, sm: 4 },
        py: { xs: 4, sm: 6 },
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          textAlign: "center",
          backgroundColor: "#fff",
          boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
        }}
      >
        <Typography
          variant="h4"
          mb={3}
          sx={{ fontWeight: "bold", color: "#1976d2", fontSize: { xs: "1.6rem", sm: "2rem" } }}
        >
          Reset Password
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            disabled={loading}
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="normal"
            disabled={loading}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, py: 1.2, fontSize: "1rem", borderRadius: 2, textTransform: "none" }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
          </Button>

          <Button
            variant="text"
            color="secondary"
            fullWidth
            sx={{ mt: 2, textTransform: "none", fontWeight: 500, "&:hover": { textDecoration: "underline" } }}
            onClick={() => navigate("/")}
          >
            Back to Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ResetPassword;
