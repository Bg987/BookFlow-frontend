import React from "react";
import { Card, CardContent, Typography, Link } from "@mui/material";

const LibraryInfoCard = ({ library }) => {
  if (!library) return null;

  const {
    library_name,
    founded_year,
    verified,
    total_members,
    total_books,
    total_librarians,
    latitude,
    longitude,
  } = library;

  // Construct Google Maps link if coordinates are available
  const mapsLink =
    latitude && longitude
      ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      : null;

  return (
    <Card sx={{ borderRadius: 3, p: 2, boxShadow: 5 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {library_name}
        </Typography>

        <Typography>🏛️ Name: {library_name}</Typography>
        <Typography>📅 Founded: {founded_year}</Typography>
        <Typography>✅ Verified: {verified ? "Yes" : "No"}</Typography>
        {total_members !== undefined && <Typography>👥 Total Members: {total_members}</Typography>}
        {total_books !== undefined && <Typography>📚 Total Books: {total_books}</Typography>}
        {total_librarians !== undefined && <Typography>👨‍🏫 Total Librarians: {total_librarians}</Typography>}
        {latitude && longitude && (
          <Typography>
            📍 Location:{" "}
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
