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
  Alert,
  Collapse,
} from "@mui/material";
import { updateBook } from "../api/api";

const BookDetails = ({ bookData, closeDrawer, onUpdate }) => {
  const [isbnValue, setIsbnValue] = useState(bookData?.isbn || "");
  const [copiesValue, setCopiesValue] = useState(bookData?.copies || 1);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleDownload = async () => {
    try {
      const response = await fetch(bookData.qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${bookData.title.replace(/\s+/g, "_")}_QR.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading QR code:", err);
      alert("Failed to download QR code. Please try again.");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg("");
    try {
      await updateBook(bookData.book_id, {
        isbn: isbnValue,
        copies: copiesValue,
      });

      setSuccessMsg("✅ Book updated successfully!");
      if (onUpdate) {
        onUpdate({ ...bookData, isbn: isbnValue, copies: copiesValue });
      }
      setTimeout(() => {
        setSuccessMsg("");
        closeDrawer();
      }, 1500);
    } catch (err) {
      console.error("Error updating book:", err);
      setSuccessMsg("❌ Failed to update book.");
    } finally {
      setSaving(false);
    }
  };

  if (!bookData) return null;

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Book Details
      </Typography>

      {/* ✅ Top Row: Book cover + QR code + form fields */}
      <Grid
        container
        spacing={2}
        alignItems="flex-start"
        justifyContent="center"
      >
        {/* Book Cover */}
        <Grid item xs={12} md={3}>
          <Card sx={{ width: "100%", boxShadow: 3 }}>
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

        {/* QR Code */}
        <Grid item xs={12} md={3}>
          <Card
            sx={{
              p: 2,
              boxShadow: 3,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Typography variant="subtitle1" mb={1} fontWeight="bold">
              QR Code
            </Typography>
            <img
              src={bookData.qrCodeUrl}
              alt="QR Code"
              style={{
                width: "150px",
                height: "150px",
                objectFit: "contain",
                marginBottom: "10px",
              }}
            />
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={handleDownload}
            >
              Download QR Code
            </Button>
          </Card>
        </Grid>

        {/* ISBN & Copies Fields */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, boxShadow: 3, height: "100%" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="ISBN"
                  fullWidth
                  value={isbnValue}
                  onChange={(e) => setIsbnValue(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Number of Copies"
                  type="number"
                  fullWidth
                  value={copiesValue}
                  onChange={(e) => setCopiesValue(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <Collapse in={!!successMsg}>
                  <Alert sx={{ mb: 2, fontWeight: "bold" }}>{successMsg}</Alert>
                </Collapse>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Full Book Details Section */}
      <Box mt={4}>
        <Paper sx={{ p: 3, boxShadow: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>
                <strong>Authors:</strong> {bookData.authors.join(", ")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <strong>Publishers:</strong> {bookData.publishers.join(", ")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <strong>Publish Places:</strong> {bookData.publish_places.join(", ")}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Publish Date:</strong> {bookData.publish_date || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Edition:</strong> {bookData.edition || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Number of Pages:</strong> {bookData.number_of_pages}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Subjects:</strong> {bookData.subjects.join(", ")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <strong>Subject Places:</strong>{" "}
                {bookData.subject_places.join(", ")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <strong>Description:</strong> {bookData.description}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default BookDetails;
