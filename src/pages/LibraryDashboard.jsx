import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Drawer,
  IconButton,
  Skeleton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import io from "socket.io-client";

import { DataLib } from "../api/api";
import LibrariansData from "../components/LibrariansData";
import LibraryInfoCard from "../components/LibraryProfile";
import LogoutButton from "../components/logout";
import AddLibrarianForm from "../components/AddLibrarianForm";
import QRScanner from "../components/QRScanner";

// Connect to Socket.IO server
const socket = io("http://localhost:5000"); // replace with your backend URL

export default function LibraryDashboard() {
  const [libData, setLibData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerOpenQR, setDrawerOpenQR] = useState(false);
  const [drawerOpenLibs, setDrawerOpenLibs] = useState(false);
  const [realTimeCounts, setRealTimeCounts] = useState({ pending: 0, totalMembers: 0 });

  // Fetch library data
  const fetchLibraryData = async () => {
    setLoading(true);
    try {
      const response = await DataLib();
      setVerified(response.data.verified);
      setLibData(response.data.data[0]);
      // Initialize real-time counts
      setRealTimeCounts({
        pending: response.data.data[0]?.pending_requests ?? 0,
        totalMembers: response.data.data[0]?.total_members ?? 0,
      });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load data");
      console.error("Error fetching library data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraryData();
  }, []);

  // Setup Socket.IO for real-time updates
  useEffect(() => {
    if (!libData?.lib_id) return;

    // Join room for this library
    socket.emit("join-library-room", libData.lib_id);

    // Listen for updates
    socket.on("update-request-count", (data) => {
      // data = { pending, totalMembers }
      console.log(data);
      setRealTimeCounts(data);
    });
    return () => {
      socket.emit("leave-library-room", libData.lib_id);
      socket.off("update-request-count");
    };
  }, [libData?.lib_id]);

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
            📚 {libData?.library_name || "Library Dashboard"}
          </Typography>
        )}
        <LogoutButton redirectTo="/" />
      </Box>

      {/* Buttons */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={toggleDrawer}
            disabled={loading}
          >
            {drawerOpen ? "Close Add Librarian" : "+ Add Librarian"}
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="success"
            onClick={() => setDrawerOpenQR(true)}
          >
            Scan Book QR
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setDrawerOpenLibs(true)}
            disabled={loading}
          >
            👩‍💼 View Librarians
          </Button>
        </Grid>
      </Grid>

      {/* Library info */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <LibraryInfoCard
            library={libData}
            verified={verified}
            extra="library"
            loading={loading}
            realTimeCounts={realTimeCounts} // <-- pass real-time counts
          />
        </Grid>
      </Grid>

      {/* Drawers (Add Librarian, QR Scanner, Librarians Data) */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer} PaperProps={{ sx: { width: "100%", maxWidth: 600, p: 3, overflowY: "auto" } }}>
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={toggleDrawer}><CloseIcon /></IconButton>
        </Box>
        <AddLibrarianForm onClose={toggleDrawer} onAdded={fetchLibraryData} />
      </Drawer>

      <Drawer anchor="right" open={drawerOpenQR} onClose={() => setDrawerOpenQR(false)} PaperProps={{ sx: { width: "100%", maxWidth: 800, p: 3, overflowY: "auto" } }}>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <IconButton onClick={() => setDrawerOpenQR(false)}><CloseIcon /></IconButton>
        </Box>
        <QRScanner open={drawerOpenQR} />
      </Drawer>

      <Drawer anchor="right" open={drawerOpenLibs} onClose={() => setDrawerOpenLibs(false)} PaperProps={{ sx: { width: "100%", maxWidth: 900, p: 3, overflowY: "auto", background: "linear-gradient(to right, #e0f7fa, #f1f8e9)" } }}>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <IconButton onClick={() => setDrawerOpenLibs(false)}><CloseIcon /></IconButton>
        </Box>
        <LibrariansData />
      </Drawer>
    </Box>
  );
}
