import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { signupMember } from "../api/api"; // Your API function

const MemberSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    city: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    profilePic: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePic: e.target.files[0] });
  };

  const redirectToLogin = () => {
    window.location.href = "/member-login";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!formData.profilePic) {
      setError("Please upload a profile picture!");
      return;
    }

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (key !== "confirmPassword") {
        formDataToSend.append(key, formData[key]);
      }
      }
      console.log(formDataToSend);
    setSubmitting(true);
    try {
      const res = await signupMember(formDataToSend);
      setSuccess(res.data.message);
      if (res.status === 201) {
        // setTimeout(() => {
        //   window.location.href = "/member-login";
        // }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

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
            Member Signup
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  disabled={submitting}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  fullWidth
                  required
                  disabled={submitting}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="City"
                  name="city"
                  value={formData.city}
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

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  component="label"
                  color="primary"
                  fullWidth
                  sx={{ borderRadius: 2 }}
                  disabled={submitting}
                >
                  Upload Profile Picture
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>
                {formData.profilePic && (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mt: 1, textAlign: "center" }}
                  >
                    Selected: {formData.profilePic.name}
                  </Typography>
                )}
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
                  {submitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={redirectToLogin}
                  fullWidth
                  sx={{ borderRadius: 2, textTransform: "none" }}
                >
                  Already Have an Account?
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default MemberSignup;
