import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button, Drawer, IconButton, Skeleton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DataLib } from "../api/api";
import LibraryInfoCard from "../components/LibraryProfile";
import LogoutButton from "../components/logout";
import AddLibrarianForm from "../components/AddLibrarianForm";

export default function LibraryDashboard() {
  const [libData, setLibData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchLibraryData = async () => {
    setLoading(true);
    try {
      const response = await DataLib();
      setLibData(response.data.data[0]);
    } catch (error) {
      alert(error.response.data.message);
      setLibData("");
      console.error("Error fetching library data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraryData();
  }, []);

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  return (
    <Box
      sx={{
        p: 3,
        minHeight: "100vh",
        background: "linear-gradient(to right, #1f4037, #99f2c8)",
      }}
    >
      {/* Top bar */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        {loading ? (
          <Skeleton variant="text" width={250} height={40} />
        ) : (
          <Typography variant="h4" fontWeight="bold" sx={{ color: "white" }}>
            📚 {libData.library_name}
          </Typography>
        )}
        <LogoutButton redirectTo="/" />
      </Box>

      {/* Add Librarian button */}
      <Button
        variant="contained"
        color="secondary"
        sx={{ mb: 3 }}
        onClick={toggleDrawer}
        disabled={loading}
      >
        {drawerOpen ? "Close Add Librarian" : "+ Add Librarian"}
      </Button>

      {/* Library info */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <LibraryInfoCard library={libData} loading={loading} />
        </Grid>
      </Grid>

      {/* Drawer for AddLibrarianForm */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 600,
            p: 3,
            overflowY: "auto",
          },
        }}
      >
        {/* Close button */}
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={toggleDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Add Librarian form */}
        <AddLibrarianForm onClose={toggleDrawer} onAdded={fetchLibraryData} />
      </Drawer>
    </Box>
  );
}
