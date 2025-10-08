import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert, Paper } from "@mui/material";
import { LoginLib } from "../api/api";

const LibraryLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async () => {
    setError("");
    setSuccess("");

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    try {
      const response = await LoginLib({ username, password });
      setSuccess(response.data.message);
      // window.location.href = "/library-dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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
        background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
        overflow: "hidden",
      }}
    >
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
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
            letterSpacing: 0.5,
          }}
        >
          Library Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          variant="outlined"
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            mt: 3,
            py: 1.2,
            fontSize: "1rem",
            borderRadius: 2,
            textTransform: "none",
          }}
          onClick={handleLogin}
        >
          Login
        </Button>

        <Typography
          variant="body2"
          textAlign="center"
          sx={{ mt: 3, color: "#666" }}
        >
          © BookFlow Library System
        </Typography>
      </Paper>
    </Box>
  );
};

export default LibraryLogin;
