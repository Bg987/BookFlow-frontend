import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { AddBook } from "../api/api";

const AddBookForm = ({ initialIsbn = "", handleBookAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    publishers: "",
    publish_places: "",
    publish_date: "",
    number_of_pages: "",
    edition: "",
    subjects: "",
    subject_places: "",
    description: "",
    copies: 1,
    isbn: initialIsbn,
  });

  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const requiredFields = [
      "title",
      "authors",
      "publishers",
      "publish_places",
      "number_of_pages",
      "subjects",
      "subject_places",
      "description",
      "copies",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        setError(`Field "${field}" is required`);
        return;
      }
    }

    if (!coverFile) {
      setError("Cover image is required");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      for (let key in formData) {
        data.append(key, formData[key]);
      }
      data.append("cover", coverFile);

      const res = await AddBook(data);
      setMessage(res.data.message || "Book added successfully!");
      handleBookAdded();

      // Reset form
      setTimeout(() => {
        setMessage("");
        setCoverFile(null);
        setFormData({
          title: "",
          authors: "",
          publishers: "",
          publish_places: "",
          publish_date: "",
          number_of_pages: "",
          edition: "",
          subjects: "",
          subject_places: "",
          description: "",
          copies: 1,
          isbn: "",
        });
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const multipleFields = [
    "authors",
    "publishers",
    "publish_places",
    "subjects",
    "subject_places",
  ];

  return (
    <Paper
      elevation={8}
      sx={{
        p: { xs: 3, sm: 5 },
        borderRadius: 4,
        textAlign: "center",
        width: "100%",
        maxWidth: 700,
        mx: "auto",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1976d2" }}
      >
        Add New Book
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Text Fields */}
          {[
            { label: "Title *", name: "title" },
            { label: "Authors *", name: "authors" },
            { label: "Publishers *", name: "publishers" },
            { label: "Publish Places *", name: "publish_places" },
          ].map((field) => (
            <Grid item xs={12} key={field.name}>
              <TextField
                fullWidth
                label={field.label}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
              />
              {multipleFields.includes(field.name) && (
                <Typography variant="caption" color="textSecondary">
                  If multiple, separate with commas
                </Typography>
              )}
            </Grid>
          ))}

          {/* Publish Date (Calendar) */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Publish Date"
              name="publish_date"
              type="date"
              value={formData.publish_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Number of Pages, Edition */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Number of Pages *"
              name="number_of_pages"
              type="number"
              value={formData.number_of_pages}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Edition"
              name="edition"
              value={formData.edition}
              onChange={handleChange}
            />
          </Grid>

          {/* Subjects */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Subjects *"
              name="subjects"
              value={formData.subjects}
              onChange={handleChange}
            />
            <Typography variant="caption" color="textSecondary">
              If multiple, separate with commas
            </Typography>
          </Grid>

          {/* Subject Places */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Subject Places *"
              name="subject_places"
              value={formData.subject_places}
              onChange={handleChange}
            />
            <Typography variant="caption" color="textSecondary">
              If multiple, separate with commas
            </Typography>
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Description *"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>

          {/* Copies */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="number"
              label="Copies *"
              name="copies"
              value={formData.copies}
              onChange={handleChange}
            />
          </Grid>

          {/* ISBN */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="ISBN"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
            />
          </Grid>

          {/* Cover Upload */}
          <Grid item xs={12}>
            <Button variant="contained" component="label" fullWidth>
              Upload Cover Image *
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
            {coverFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected: {coverFile.name}
              </Typography>
            )}
          </Grid>

          {/* Messages */}
          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}
          {message && (
            <Grid item xs={12}>
              <Alert severity="success">{message}</Alert>
            </Grid>
          )}

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={loading}
              sx={{ py: 1.2, borderRadius: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Add Book"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default AddBookForm;
