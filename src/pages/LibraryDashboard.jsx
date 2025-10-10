import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button, Modal } from "@mui/material";
import { DataLib } from "../api/api";
import LibraryInfoCard from "../components/LibInfo";
import LogoutButton from "../components/logout";
import AddLibrarianForm from "../components/AddLibrarianForm";

export default function LibraryDashboard() {
  const [libData, setLibData] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);

  const fetchLibraryData = async () => {
    try {
      const response = await DataLib();
      setLibData(response.data.data[0]);
    } catch (error) {
      console.error("Error fetching library data:", error);
    }
  };

  useEffect(() => {
    fetchLibraryData();
  }, []);

  if (!libData) return <Typography>Loading library data...</Typography>;

  return (
    <Box sx={{
      p: 3,
      minHeight: "100vh",
      background: "linear-gradient(to right, #1f4037, #99f2c8)"
    }}>
      {/* Top bar */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: "white" }}>
          📚 {libData.library_name}
        </Typography>
        <LogoutButton redirectTo="/library-login" />
      </Box>

      <Button variant="contained" color="secondary" sx={{ mb: 3 }} onClick={() => setOpenAddModal(true)}>
        + Add Librarian
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <LibraryInfoCard library={libData} />
        </Grid>
      </Grid>

      {/* Modal for Add Librarian */}
      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 3,
            width: { xs: "90%", sm: 500 },
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <AddLibrarianForm onClose={() => setOpenAddModal(false)} onAdded={fetchLibraryData} />
        </Box>
      </Modal>
    </Box>
  );
}
