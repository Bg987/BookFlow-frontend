import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { signupLibPre } from "../api/api";
import { redirect } from "react-router-dom";

const LibraryPreSignup = () => {
  const [formData, setFormData] = useState({
    library_name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    founded_year: "",
    latitude: "",
    longitude: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Request location
  useEffect(() => {
    const requestLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setFormData((prev) => ({
              ...prev,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }));
            setLoadingLocation(false);
          },
          () => {
            setTimeout(requestLocation, 1000);
          }
        );
      } else {
        alert("Geolocation not supported by your browser.");
      }
    };
    requestLocation();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const redirect = () => {
    window.location.href= "/library-login";
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setSubmitting(true);
    try {
      const res = await signupLibPre(formData);
      setSuccess(res.data.message);
      if (res.status === 200) {
        setTimeout(() => {
          window.location.href = "/library-login";
        },3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingLocation) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #1976d2, #42a5f5)",
        }}
      >
        <CircularProgress color="secondary" />
        <Typography variant="h6" sx={{ ml: 2, color: "#fff" }}>
          Waiting for location permission...
        </Typography>
      </Box>
    );
  }

  const foundedYearOptions = Array.from(
    { length: new Date().getFullYear() - 999 },
    (_, i) => 1000 + i
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1976d2, #42a5f5)",
        px: 2,
        py: 4,
        overflowX: "hidden",
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            width: { xs: "100%", sm: 500, md: "100%" },
            p: { xs: 3, sm: 5 },
            backgroundColor: "white",
            borderRadius: 4,
            boxShadow: 6,
            mx: "auto",
          }}
        >
          <Typography
            variant="h4"
            sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}
          >
            Library Signup
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Library Name"
                  name="library_name"
                  value={formData.library_name}
                  onChange={handleChange}
                  fullWidth
                  required
                  disabled={submitting}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                  disabled={submitting}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  fullWidth
                  required
                  disabled={submitting}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  required
                  disabled={submitting}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  fullWidth
                  required
                  disabled={submitting}
                />
              </Grid>

              {/* Founded Year Autocomplete */}
              <Grid item xs={12}>
                <Autocomplete
                  freeSolo
                  options={foundedYearOptions}
                  value={formData.founded_year}
                  onChange={(event, newValue) =>
                    setFormData((prev) => ({ ...prev, founded_year: newValue }))
                  }
                  onInputChange={(event, newInputValue) =>
                    setFormData((prev) => ({ ...prev, founded_year: newInputValue }))
                  }
                  sx={{ width: "100%" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Founded Year"
                      fullWidth
                      required
                      disabled={submitting}
                    />
                  )}
                />
              </Grid>
                  
              {/* Display lat/lng */}
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary">
                  Location captured: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  fullWidth
                  size="large"
                  sx={{ borderRadius: 3 }}
                  disabled={submitting}
                >
                  {submitting ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
                </Button>
              </Grid>
               <Button
                variant="contained"
                color="primary"
                onClick={redirect}
                sx={{ borderRadius: 2, textTransform: "none" }}
              >
                Already Have An Account?
              </Button>
            </Grid>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default LibraryPreSignup;
