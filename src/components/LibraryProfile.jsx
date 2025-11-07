import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Link,
  Skeleton,
  Box,
} from "@mui/material";
import io from "socket.io-client";

const socket = io("https://bookflow-1ceq.onrender.com", { transports: ["websocket"] });

const LibraryInfoCard = ({ library, verified, extra, loading }) => {
  

  const [animKey, setAnimKey] = useState({ pending: false, approved: false });
  const [counts, setCounts] = useState({
    pending: library?.pending_requests || 0,
    rejected: library?.rejected_requests || 0,
    total: library?.total_members || 0,
  });

useEffect(() => {
  if (!library?.lib_id || extra === "member") return;

  // Join the library room
  console.log(`Connecting to library room: ${library.lib_id}`);
  socket.emit("join-library-room", library.lib_id);

  // Listen for updates
  const handleUpdate = (data) => {
    console.log("Received update-request-count:", data);
    setCounts((prev) => {
      const newCounts = {
        pending: data.pending ?? prev.pending,
        rejected: data.rejected ?? prev.rejected,
        total: data.total ?? prev.total,
      };

      // Trigger animation only if number changed
      if (newCounts.pending !== prev.pending)
        setAnimKey((a) => ({ ...a, pending: true }));
      if (newCounts.rejected !== prev.rejected)
        setAnimKey((a) => ({ ...a, approved: true }));
      if (newCounts.total !== prev.total)
        setAnimKey((a) => ({ ...a, total: true }));

      return newCounts;
    });
  };

  socket.on("update-request-count", handleUpdate);

  // Cleanup on unmount
  return () => {
    console.log(`Disconnecting from library room: ${library.lib_id}`);
    socket.emit("leave-library-room", library.lib_id);
    socket.off("update-request-count", handleUpdate);
  };
}, [library?.lib_id]);

  //perent componnet take some time to fetchdata from api so as it done show in UI 
  useEffect(() => {
  if (library) {
    setCounts({
      pending: library.pending_requests || 0,
      rejected: library.rejected_requests || 0,
      total : library.total_members||0,
    });
    }
  }, [library]);

  // Reset animation flags after 1s
  useEffect(() => {
    const timer = setTimeout(
      () => setAnimKey({ pending: false, approved: false }),
      1000
    );
    return () => clearTimeout(timer);
  }, [animKey]);

  if (loading)
    return (
      <Card sx={{ borderRadius: 3, p: 2, boxShadow: 5, mb: 2 }}>
        <Skeleton variant="text" width={250} height={40} sx={{ mb: 2 }} />
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} variant="text" width={200 - i * 10} sx={{ mb: 1 }} />
        ))}
      </Card>
    );

  if (!library) return null;

  const {
    library_name,
    founded_year,
    total_books,
    total_librarians,
    latitude,
    longitude,
  } = library;

  const mapsLink =
    latitude && longitude
      ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      : null;

  return (
    <Card
      sx={{
        borderRadius: 3,
        p: 2,
        boxShadow: 5,
        mb: 2,
        backgroundColor: "#fafafa",
      }}
    >
      {(extra === "librarian" || extra === "library") && (
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          {extra === "library" ? "Information" : "Associated Library"}
        </Typography>
      )}

      <CardContent sx={{ pt: 0 }}>
        {founded_year && (
          <Typography sx={{ mb: 0.5 }}>
            📅 <b>Founded:</b> {founded_year}
          </Typography>
        )}
        <Typography sx={{ mb: 0.5 }}>
          ✅ <b>Verified:</b> {verified ? "Yes" : "No"}
        </Typography>

        <Box sx={{ mt: 1 }}>
          <Typography
            sx={{
              mb: 0.5,
              transition: "transform 0.3s ease, color 0.3s ease",
              ...(animKey.approved && {
                color: "#2e7d32",
                transform: "scale(1.1)",
              }),
            }}
          >
            👥 <b>Total Members:</b> {counts.total}
          </Typography>

          <Typography
            sx={{
              mb: 0.5,
              transition: "transform 0.3s ease, color 0.3s ease",
              ...(animKey.pending && {
                color: "#ed6c02",
                transform: "scale(1.1)",
              }),
            }}
          >
            ⏳ <b>Pending Requests:</b> {counts.pending}
          </Typography> 
          <Typography
            sx={{
              mb: 0.5,
              transition: "transform 0.3s ease, color 0.3s ease",
              ...(animKey.pending && {
                color: "#ed6c02",
                transform: "scale(1.1)",
              }),
            }}
          >
          ❌<b>Rejected Requests:</b> {counts.rejected}
          </Typography> 
          {total_books !== undefined && (
            <Typography sx={{ mb: 0.5 }}>
              📚 <b>Total Books:</b> {total_books}
            </Typography>
          )}
          {total_librarians !== undefined && (
            <Typography sx={{ mb: 0.5 }}>
              👨‍🏫 <b>Total Librarians:</b> {total_librarians}
            </Typography>
          )}
        </Box>

        {latitude && longitude && (
          <Typography sx={{ mt: 1 }}>
            📍 <b>Location:</b>{" "}
            <Link href={mapsLink} target="_blank" rel="noopener" underline="hover">
              View on Google Maps
            </Link>
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default LibraryInfoCard;
