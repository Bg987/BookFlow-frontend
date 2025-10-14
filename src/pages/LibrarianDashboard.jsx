import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { LibrarianData } from "../api/api";
import LogoutButton from "../components/logout";
import LibraryInfoCard from "../components/LibraryProfile";
import LibrarianProfile from "../components/LibrarianProfile"; // import the profile component

const LibrarianDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [Library, setLibrary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await LibrarianData();
        const data = res.data.Data;
        setProfile(data); // contains librarian_data + userData
        setLibrary(data.library_data);
        console.log("Librarian data:", data);
      } catch (err) {
        console.error("Error fetching librarian data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <Box
      sx={{
        p: 4,
        background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
        minHeight: "90vh",
      }}
    >
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "#0d47a1" }}>
        Welcome, {profile?.userData?.username || profile?.librarian_data?.name || "Librarian"} 👋
      </Typography>

      <LogoutButton redirectTo="/" />

      {/* LibrarianProfile component */}
      <LibrarianProfile 
        librarian_data={profile?.librarian_data}
        userData={profile?.userData}
        loading={loading}  // pass loading state
      />

      {/* LibraryInfoCard component */}
      <LibraryInfoCard 
        library={Library} 
        extra="librarian" 
        loading={loading}  // pass loading state
      />

      {/* Optional: fallback while data is loading */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && !profile && (
        <Typography textAlign="center" mt={5}>
          Failed to load librarian data.
        </Typography>
      )}
    </Box>
  );
};

export default LibrarianDashboard;
