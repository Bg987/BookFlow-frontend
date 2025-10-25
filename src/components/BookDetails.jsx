import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Paper,
} from "@mui/material";
// import { updateBook } from "../api/api";

const BookDetails = ({ bookData, closeDrawer, onUpdate }) => {
  const [isbnValue, setIsbnValue] = useState(bookData.isbn || "");
  const [copiesValue, setCopiesValue] = useState(bookData.copies || 1);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // await updateBook(bookData.book_id, { isbn: isbnValue, copies: copiesValue });
      alert("Book updated successfully!");
      onUpdate({ ...bookData, isbn: isbnValue, copies: copiesValue });
      closeDrawer();
    } catch (err) {
      console.error("Error updating book:", err);
      alert("Failed to update book.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Book Details
      </Typography>

      {/* Main section */}
      <Grid container spacing={3}>
        {/* Left: Cover Image */}
        <Grid item xs={12} sm={4}>
          <Card sx={{ maxWidth: 250, margin: "auto", boxShadow: 3 }}>
            <CardMedia
              component="img"
              height="250"
              image={bookData.cover}
              alt={bookData.title}
            />
            <CardContent sx={{ textAlign: "center", backgroundColor: "#f5f5f5" }}>
              <Typography variant="h6" fontWeight="bold">
                {bookData.title}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Right: Book Details */}
        <Grid item xs={12} sm={8}>
          <Paper sx={{ p: 3, boxShadow: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography><strong>Authors:</strong> {bookData.authors.join(", ")}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography><strong>Publishers:</strong> {bookData.publishers.join(", ")}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography><strong>Publish Places:</strong> {bookData.publish_places.join(", ")}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="ISBN"
                  fullWidth
                  value={isbnValue}
                  onChange={(e) => setIsbnValue(e.target.value)}
                  sx={{ mb: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Number of Copies"
                  type="number"
                  fullWidth
                  value={copiesValue}
                  onChange={(e) => setCopiesValue(e.target.value)}
                  sx={{ mb: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><strong>Publish Date:</strong> {bookData.publish_date || "N/A"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><strong>Edition:</strong> {bookData.edition || "N/A"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><strong>Number of Pages:</strong> {bookData.number_of_pages}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><strong>Subjects:</strong> {bookData.subjects.join(", ")}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography><strong>Subject Places:</strong> {bookData.subject_places.join(", ")}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography><strong>Description:</strong> {bookData.description}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* QR Code below */}
      <Box textAlign="center" mt={3} mb={3}>
        <Card sx={{ display: "inline-block", p: 2, boxShadow: 3 }}>
          <Typography variant="subtitle1" mb={1}>QR Code</Typography>
          <img src={bookData.qrCodeUrl} alt="QR Code" style={{ maxWidth: "180px" }} />
        </Card>
      </Box>

      {/* Save Button */}
      <Box textAlign="center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
};

export default BookDetails;
