import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert, CircularProgress, Paper } from "@mui/material";

const LoginForm = ({ Type, loginApi, onSuccessRedirect = "/" }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    if (!username || !password) {
      setError("Username and password are required");
      setLoading(false);
      return;
    }

    try {
      const response = await loginApi({ username, password });
      setSuccess(response.data.message);
      setTimeout(() => {
        window.location.href = onSuccessRedirect;
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={8}
      sx={{
        width: "100%",
        maxWidth: 420,
        p: { xs: 3, sm: 5 },
        borderRadius: 4,
        backgroundColor: "#ffffff",
        boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
      }}
    >
      <Typography
        variant="h4"
        mb={3}
        textAlign="center"
        sx={{ fontWeight: "bold", color: "#1976d2", letterSpacing: 0.5 }}
      >
        {Type} Login
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <TextField
        label="Username"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        variant="outlined"
        disabled={loading}
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        variant="outlined"
        disabled={loading}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3, py: 1.2, fontSize: "1rem", borderRadius: 2, textTransform: "none" }}
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
      </Button>

      {/* Hardcoded redirect for Forgot Password */}
      <Button
        variant="text"
        color="secondary"
        fullWidth
        sx={{ mt: 2, textTransform: "none" }}
        onClick={() => window.location.href = "/forgotPass"}
      >
        Forgot Password?
      </Button>

      <Typography variant="body2" textAlign="center" sx={{ mt: 3, color: "#666" }}>
        © BookFlow System
      </Typography>
    </Paper>
  );
};

export default LoginForm;
