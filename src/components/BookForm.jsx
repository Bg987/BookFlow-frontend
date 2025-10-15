import React, { useState } from "react";
import { TextField, Button, CircularProgress, Box, Typography } from "@mui/material";

const BookForm = ({ bookData, setBookData, copies, setCopies, saveBook, loading }) => {
  const [preview, setPreview] = useState(bookData?.cover?.medium || "");
    console.log("component ",bookData);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, value) => {
    setBookData((prev) => ({ ...prev, [field]: value.split(",").map((v) => v.trim()) }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBookData((prev) => ({ ...prev, coverFile: file }));
      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <TextField label="Title" name="title" value={bookData?.title || ""} onChange={handleChange} fullWidth />
      
      <TextField
        label="Authors (comma separated)"
        value={bookData?.authors?.join(", ") || ""}
        onChange={(e) => handleArrayChange("authors", e.target.value)}
        fullWidth
      />
      
      <TextField
        label="Publishers (comma separated)"
        value={bookData?.publishers?.join(", ") || ""}
        onChange={(e) => handleArrayChange("publishers", e.target.value)}
        fullWidth
      />

      <TextField
        label="Publish Places (comma separated)"
        value={bookData?.publish_places?.join(", ") || ""}
        onChange={(e) => handleArrayChange("publish_places", e.target.value)}
        fullWidth
      />

      <TextField label="Publish Date" name="publish_date" value={bookData?.publish_date || ""} onChange={handleChange} fullWidth />
      <TextField
        label="Number of Pages"
        type="number"
        name="number_of_pages"
        value={bookData?.number_of_pages || 0}
        onChange={(e) => setBookData((prev) => ({ ...prev, number_of_pages: Number(e.target.value) }))}
        fullWidth
      />

      <TextField label="Edition" name="edition" value={bookData?.edition || ""} onChange={handleChange} fullWidth />
      <TextField
        label="Subjects (comma separated)"
        value={bookData?.subjects?.join(", ") || ""}
        onChange={(e) => handleArrayChange("subjects", e.target.value)}
        fullWidth
      />
      
      <TextField
        label="Subject Places (comma separated)"
        value={bookData?.subject_places?.join(", ") || ""}
        onChange={(e) => handleArrayChange("subject_places", e.target.value)}
        fullWidth
      />

      {/* Image upload */}
      <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
        <Typography variant="body2" mb={1}>Upload Cover Image (Medium)</Typography>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && (
          <Box mt={1}>
            <img src={preview} alt="cover preview" style={{ width: "150px", height: "auto", borderRadius: 4 }} />
          </Box>
        )}
      </Box>

      <TextField
        label="Copies"
        type="number"
        value={copies}
        onChange={(e) => setCopies(Number(e.target.value))}
        fullWidth
      />

      <Button variant="contained" onClick={saveBook} disabled={loading}>
        {loading ? <CircularProgress size={20} /> : "Save Book"}
      </Button>
    </Box>
  );
};

export default BookForm;
