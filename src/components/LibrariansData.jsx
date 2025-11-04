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
import { io } from "socket.io-client";
import { DataLibraians, ActiveLibraianIds } from "../api/api";

const LibrariansData = () => {
  const [librarians, setLibrarians] = useState([]);
  const [activeIds, setActiveIds] = useState([]); 
  const [activeNumber, setActiveCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await DataLibraians();
        const res2 = await ActiveLibraianIds();
        setLibrarians(res.data.librarians);
        setActiveIds(res2.data.activeLibrarianIds || []);
        setActiveCount((res2.data.activeLibrarianIds ||[]).length)
      } catch (err) {
        console.error("Failed to fetch librarians:", err.status);
        if (err.status === 404) {
          setError("NO librarian data.");
          return;
        }
        setError("Unable to load librarian data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    //Socket.IO connection
    const socket = io("https://bookflow-1ceq.onrender.com"); 

    socket.on("connect", () => {
      console.log("Connected :");
    });

    //real-time librarian status updates
    socket.on("activeUpdate", (data) => {
      setActiveIds((prev) => {
        if (data.action === "login") {
          const updated = [...new Set([...prev, data.id])];
          setActiveCount(updated.length); // update count
          return updated;
        }

        if (data.action === "logout") {
          const updated = prev.filter((id) => id !== data.id);
          setActiveCount(updated.length); // update count
          return updated;
        }

        return prev;
});
    });

    // Cleanup 
    return () => {
      socket.disconnect();
    };
  }, []);

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
  👩‍💼 Librarian Details{" "}
  {activeNumber > 0 && (
    <Box
      component="span"
      sx={{
        backgroundColor: "#4CAF50",
        color: "white",
        px: 1.5,
        py: 0.3,
        borderRadius: "12px",
        fontSize: "0.9rem",
        ml: 1,
        boxShadow: "0 0 10px #4CAF50",
        animation: "pulse 2s infinite",
      }}
    >
      {activeNumber}
    </Box>
  )}
    </Typography>
      <style>
      {`
        @keyframes pulse {
          0% { box-shadow: 0 0 5px #4CAF50; }
          25% { box-shadow: 0 0 15px #4CAF50; }
          50% { box-shadow: 0 0 20px #4CAF50; }
          75% { box-shadow: 0 0 15px #4CAF50; }
          100% { box-shadow: 0 0 5px #4CAF50; }
        }
      `}
      </style>


      <Grid container spacing={3}>
        {librarians.map((lib) => {
          const isActive = activeIds.includes(lib.librarian_id); // check status arr. of library's active librarian ids
          return ( 
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
                      border: `2px solid ${isActive ? "#4CAF50" : "#F44336"}`, // 🟢🔴 border color
                      boxShadow: isActive
                        ? "0 0 10px #4CAF50"
                        : "0 0 10px #F44336",
                      animation: isActive ? "blink 1s infinite" : "none",
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
                    label={
                      isActive
                        ? "🟢 Active"
                        : lib.is_verified
                        ? "Verified ✅"
                        : "Unverified ⚠️"
                    }
                    color={isActive ? "success" : "default"}
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
          );
        })}
      </Grid>

      {/* 🟢 Blinking animation */}
      <style>
        {`
          @keyframes blink {
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </Box>
  );
};

export default LibrariansData;
