import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Typography,
  Paper,
} from "@mui/material";
import { AddLibrarian } from "../api/api";

const AddLibrarianForm = ({ onClose, onAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
    username: "",
    profilePic: null,
  });
  const [preview, setPreview] = useState(null); // For image preview
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic") {
      const file = files[0];
      setFormData({ ...formData, profilePic: file });
      setPreview(URL.createObjectURL(file)); // show preview
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { name, dob, email, username, profilePic } = formData;
    if (!name || !dob || !email || !username  || !profilePic) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      const response = await AddLibrarian(data);
      setSuccess(response.data.message || "Librarian added successfully!");

      // setFormData({
      //   name: "",
      //   dob: "",
      //   email: "",
      //   username: "",
      //   profilePic: null,
      // });
      // setPreview(null);

      if (onAdded) onAdded(); // notify parent to refresh data
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={8}
      sx={{
        width: "100%",
        maxWidth: 500,
        p: { xs: 3, sm: 5 },
        borderRadius: 4,
        textAlign: "center",
      }}
    >
      <Typography variant="h5" mb={3} sx={{ fontWeight: "bold", color: "#1976d2" }}>
        Add Librarian
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
        <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Username" name="username" value={formData.username} onChange={handleChange} fullWidth margin="normal" />
        <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
          Upload Profile Picture
          <input type="file" name="profilePic" accept="image/*" hidden onChange={handleChange} />
        </Button>

        {/* Image preview */}
        {preview && (
          <Box mt={2}>
            <Typography variant="body2" sx={{ mb: 1 }}>Preview:</Typography>
            <img src={preview} alt="Preview" style={{ width: "120px", borderRadius: "8px" }} />
          </Box>
        )}

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, py: 1.2, borderRadius: 2 }} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Add Librarian"}
        </Button>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <Button variant="text" fullWidth sx={{ mt: 2 }} onClick={onClose}>
          Cancel
        </Button>
      </form>
    </Paper>
  );
};

export default AddLibrarianForm;
