import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { LibrarianData } from "../api/api";
import LibraryInfoCard from "../components/LibInfo";

const LibrarianDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await LibrarianData();
        console.log("Librarian data:", res.data);
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching librarian data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading)
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (!profile)
    return (
      <Typography textAlign="center" mt={5}>
        Failed to load librarian data.
      </Typography>
    );

  return (
    <>
      <Box
        sx={{
          p: 4,
          background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
          minHeight: "90vh",
        }}
      >
        <Typography
          variant="h4"
          sx={{ mb: 3, fontWeight: "bold", color: "#0d47a1" }}
        >
          Welcome, {profile.username || "Librarian"} 👋
        </Typography>

        {/* Librarian personal info */}
        <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3, maxWidth: 500, mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Librarian Details
            </Typography>
            <Typography>
              <strong>Username:</strong> {profile.username}
            </Typography>
            <Typography>
              <strong>Email:</strong> {profile.email}
            </Typography>
            <Typography>
              <strong>Role:</strong> {profile.role}
            </Typography>
          </CardContent>
        </Card>

        {/* Library details passed to a separate component */}
        {profile.library && <LibraryInfoCard library={profile.library} />}
      </Box>
    </>
  );
};

export default LibrarianDashboard;
