import React from "react";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Grid,
  Box,
  Divider,
  Skeleton,
} from "@mui/material";

const LibrarianProfile = ({ librarian_data, userData, loading }) => {
  // Function to ignore null/undefined values
  const displayField = (label, value) => {
    if (value === null || value === undefined || value === "") return null;
    return (
      <Typography variant="body1">
        <strong>{label}:</strong> {value}
      </Typography>
    );
  };

  return (
    <Card
      sx={{
        maxWidth: 700,
        margin: "40px auto",
        borderRadius: "16px",
        boxShadow: 3,
        p: 2,
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" flexDirection="column" mb={2}>
          {loading ? (
            <Skeleton variant="circular" width={120} height={120} />
          ) : (
            <Avatar
              src={userData.profilePicUrl}
              alt={userData.username}
              sx={{ width: 120, height: 120, mb: 2 }}
            />
          )}

          {loading ? (
            <Skeleton variant="text" width={200} height={30} />
          ) : (
            <Typography variant="h5" fontWeight="bold">
              {librarian_data.name || userData.username}
            </Typography>
          )}

          {loading ? (
            <Skeleton variant="text" width={120} />
          ) : (
            <Typography variant="body2" color="textSecondary">
              Role: {userData.role}
            </Typography>
          )}

          {loading ? (
            <Skeleton variant="text" width={140} />
          ) : (
            <Typography variant="body2" color="textSecondary">
              Joined: {new Date(userData.createdAt).toLocaleDateString()}
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            {loading ? (
              <>
                <Skeleton variant="text" width={180} />
                <Skeleton variant="text" width={220} />
                <Skeleton variant="text" width={200} />
              </>
            ) : (
              <>
                {displayField("Username", userData.username)}
                {displayField("Email", userData.email)}
                {displayField("Date of Birth", librarian_data.dob)}
              </>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            {loading ? (
              <Skeleton variant="text" width={150} />
            ) : (
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body1">
                  <strong>Verified:</strong>
                </Typography>
                {librarian_data.is_verified ? "✅" : "❌"}
              </Box>
            )}

            {loading ? <Skeleton variant="text" width={180} /> : displayField("Reference ID", userData.referenceId)}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LibrarianProfile;
