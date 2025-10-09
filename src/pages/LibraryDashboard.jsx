import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { DataLib } from "../api/api";
import LibraryInfoCard from "../components/LibInfo";
import LogoutButton from "../components/logout"; 
export default function LibraryDashboard() {
  const [libData, setLibData] = useState(null);

  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        const response = await DataLib();
        setLibData(response.data.data[0]);
      } catch (error) {
        console.error("Error fetching library data:", error);
      }
    };
    fetchLibraryData();
  }, []);

  if (!libData) return <Typography>Loading library data...</Typography>;

  return (
    <Box
      sx={{
        p: 3,
        minHeight: "100vh",
        background: "linear-gradient(to right, #1f4037, #99f2c8)",
      }}
    >
      {/* Top bar with Logout */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <LogoutButton redirectTo="/library-login" />
      </Box>

      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ color: "white", mb: 3, textAlign: "center" }}
      >
        📚 {libData.library_name}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <LibraryInfoCard library={libData} />
        </Grid>
        {/* You can add more cards or components here */}
      </Grid>
    </Box>
  );
}
