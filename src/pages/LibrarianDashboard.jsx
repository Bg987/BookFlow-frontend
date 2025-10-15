import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Button, Grid, Drawer, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LibrarianData } from "../api/api";
import LogoutButton from "../components/logout";
import LibraryInfoCard from "../components/LibraryProfile";
import LibrarianProfile from "../components/LibrarianProfile";
import AddBook from "../pages/AddBook";

const LibrarianDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [Library, setLibrary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch librarian & library data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await LibrarianData();
        const data = res.data.Data;
        setProfile(data);
        setLibrary(data.library_data);
      } catch (err) {
        console.error("Error fetching librarian data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Toggle drawer
  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  return (
    <Box sx={{ p: 4, background: "linear-gradient(135deg, #e3f2fd, #bbdefb)", minHeight: "90vh" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#0d47a1" }}>
          Welcome, {profile?.userData?.username || profile?.librarian_data?.name || "Librarian"} 👋
        </Typography>
        <LogoutButton redirectTo="/" />
      </Box>

      {/* Action buttons */}
      <Grid container spacing={2} sx={{ my: 3 }}>
        <Grid item>
          <Button variant="contained" color="primary" onClick={toggleDrawer}>
            {drawerOpen ? "Close Add Book" : "Add Book"}
          </Button>
        </Grid>
      </Grid>

      {/* Dashboard content */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : profile ? (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <LibrarianProfile 
              librarian_data={profile?.librarian_data}
              userData={profile?.userData}
              loading={loading}  
            />
            <LibraryInfoCard 
              library={Library} 
              extra="librarian" 
              loading={loading}  
            />
          </Grid>
        </Grid>
      ) : (
        <Typography textAlign="center" mt={5}>
          Failed to load librarian data.
        </Typography>
      )}

      {/* Drawer for AddBook */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 800,
            p: 3,
            overflowY: "auto",
          },
        }}
      >
        {/* Close button at the top */}
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <IconButton onClick={toggleDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>

        <AddBook closeDrawer={toggleDrawer} />
      </Drawer>
    </Box>
  );
};

export default LibrarianDashboard;
