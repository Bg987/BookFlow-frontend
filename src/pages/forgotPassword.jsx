import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { forgotpass } from "../api/api"; // API call

const ForgotPassword = () => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!inputValue) {
      setError("Please enter your username or email.");
      return;
    }

    setLoading(true);
    try {
      const response = await forgotpass({ identifier: inputValue });
        console.log(response);
      setSuccess(
        response.data.message || "Check your email for reset instructions."
      );
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
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
        background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 450,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={10}
          sx={{
            width: "100%",
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            textAlign: "center",
            backgroundColor: "#fff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          }}
        >
          <Typography
            variant="h4"
            mb={3}
            sx={{
              fontWeight: "bold",
              color: "#1976d2",
              fontSize: { xs: "1.6rem", sm: "2rem" },
            }}
          >
            Forgot Password
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

          <form onSubmit={handleSubmit}>
            <TextField
              label="Username or Email"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              disabled={loading}
            />

            <Button
              type="submit"
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
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Submit"
              )}
            </Button>

            <Button
              variant="text"
              color="secondary"
              fullWidth
              sx={{
                mt: 2,
                textTransform: "none",
                fontWeight: 500,
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => (window.location.href = "/login")}
            >
              Back to Login
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
