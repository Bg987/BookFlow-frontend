import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Divider,
} from "@mui/material";

const MemberInfoCard = ({ user, member }) => {
  if (!user || !member) return null;

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 3,
        boxShadow: 3,
        backgroundColor: "#ffffff",
      }}
    >
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          {/* Profile Picture */}
          <Grid
            item
            xs={12}
            sm={3}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Avatar
              src={user.profilePicUrl}
              alt={member.name}
              sx={{
                width: 100,
                height: 100,
                border: "3px solid #1976d2",
                boxShadow: 3,
              }}
            />
          </Grid>

          {/* Member Info */}
          <Grid item xs={12} sm={9}>
            <Typography variant="h6" gutterBottom>
              Member Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <b>Name:</b> {member.name}
                </Typography>
                <Typography>
                  <b>Email:</b> {user.email}
                </Typography>
                <Typography>
                  <b>Username:</b> {user.username}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography>
                  <b>Date of Birth:</b> {member.dob}
                </Typography>
                <Typography>
                  <b>City:</b> {member.city}
                </Typography>
                <Typography>
                  <b>Verified:</b> {user.is_verified ? "Yes ✅" : "No ❌"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default MemberInfoCard;
