import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  CircularProgress,
  Divider,
  Chip,
} from "@mui/material";
import { DataLibraians } from "../api/api";

const LibrariansData = () => {
  const [librarians, setLibrarians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLibrarians = async () => {
      setLoading(true);
      try {
        const res = await DataLibraians();
        setLibrarians(res.data.librarians);
      } catch (err) {
        console.error("Failed to fetch librarians:", err);
        setError("Unable to load librarian data.");
      } finally {
        setLoading(false);
      }
    };
    fetchLibrarians();
  },[]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" textAlign="center" mt={3}>
        {error}
      </Typography>
    );

  if (librarians.length === 0)
    return (
      <Typography textAlign="center" mt={3}>
        No librarians found for this library.
      </Typography>
    );

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
        👩‍💼 Librarian Details
      </Typography>

      <Grid container spacing={3}>
        {librarians.map((lib) => (
          <Grid item xs={12} sm={6} md={4} key={lib.librarian_id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 4,
                p: 2,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(220,255,245,0.9))",
                transition: "0.3s",
                "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Avatar
                  src={lib.profilePicUrl || "/default-avatar.png"}
                  sx={{
                    width: 80,
                    height: 80,
                    mx: "auto",
                    mb: 2,
                    border: "2px solid #1976d2",
                  }}
                />
                <Typography variant="h6" fontWeight="bold">
                  {lib.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {lib.username} ({lib.role})
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  📧 {lib.email}
                </Typography>
                <Typography variant="body2">🎂 {lib.dob}</Typography>
                <Divider sx={{ my: 1 }} />
                <Chip
                  label={lib.is_verified ? "Verified ✅" : "Unverified ⚠️"}
                  color={lib.is_verified ? "success" : "warning"}
                  variant="outlined"
                  size="small"
                />
                <Typography variant="caption" display="block" mt={1}>
                  Joined:{" "}
                  {lib.createdAt
                    ? new Date(lib.createdAt).toLocaleDateString()
                    : "N/A"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LibrariansData;
