import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Link, Skeleton } from "@mui/material";

const LibraryInfoCard = ({ library, verified, extra, pendingRequests, totalMembers, loading }) => {
  const [pending, setPending] = useState(pendingRequests || 0);
  const [members, setMembers] = useState(totalMembers || 0);

  useEffect(() => {
    // Update local state if props change
    console.log(library);
    if (pendingRequests !== undefined) setPending(pendingRequests);
    if (totalMembers !== undefined) setMembers(totalMembers);
  }, [pendingRequests, totalMembers]);

  if (!library && !loading) return null;

  const {
    library_name,
    founded_year,
    total_books,
    total_librarians,
    latitude,
    longitude,
  } = library || {};

  const mapsLink =
    latitude && longitude
      ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      : null;

  return (
    <Card sx={{ borderRadius: 3, p: 2, boxShadow: 5, mb: 2 }}>
      {loading ? (
        <Skeleton variant="text" width={250} height={40} />
      ) : extra === "librarian" || extra === "library" ? (
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          {extra === "library" ? "Library Info" : "Associated Library"}
        </Typography>
      ) : null}

      <CardContent>
        {loading ? (
          <>
            <Skeleton variant="text" width={200} />
            <Skeleton variant="text" width={150} />
            <Skeleton variant="text" width={100} />
            <Skeleton variant="text" width={180} />
            <Skeleton variant="text" width={180} />
            <Skeleton variant="text" width={180} />
            <Skeleton variant="text" width={200} />
          </>
        ) : (
          <>
            {extra !== "library" && <Typography>📚 Library: {library_name}</Typography>}
            <Typography>📅 Founded: {founded_year}</Typography>
            <Typography>✅ Verified: {verified ? "Yes" : "No"}</Typography>
            <Typography>👥 Total Members: {members}</Typography>
            <Typography>⏳ Pending Requests: {pending}</Typography>
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
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LibraryInfoCard;
