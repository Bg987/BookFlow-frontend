import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  Skeleton,
  Grid,
  Drawer,
  IconButton,
  List,
  ListItem,
  
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MemberData, getNearLibs,LibReq } from "../api/api";
import LogoutButton from "../components/logout";
import MemberInfoCard from "../components/MemberProfile";
import LibraryInfoCard from "../components/LibraryProfile";

const MemberDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [nearbyLibraries, setNearbyLibraries] = useState([]);
  const [locating, setLocating] = useState(false);
  const [requestStatus, setRequestStatus] = useState({});
  const [requestLoading, setRequestLoading] = useState({});
  const [memberCoords, setMemberCoords] = useState({ lat: null, lon: null });

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const res = await MemberData();
        console.log(res.data.data.libMsg);
        setData(res.data.data);
      } catch (err) {
        console.error("Error fetching member data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMemberData();
  }, []);

  //Get member location & nearby libraries
  const getNearbyLibraries = async () => {
    setLocating(true);
    try {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setMemberCoords({ lat: latitude, lon: longitude });
          const res = await getNearLibs({ latitude, longitude });
          setNearbyLibraries(res.data.data);
          setDrawerOpen(true);
          setLocating(false);
        },
        (err) => {
          console.error("Location permission denied:", err);
          alert("Location permission is required to find nearby libraries.");
          setLocating(false);
        }
      );
    } catch (error) {
      console.error("Error fetching nearby libraries:", error);
      setLocating(false);
    }
  };

  //Open Google Maps route between member and library
  const openInGoogleMaps = (library) => {
    if (!memberCoords.lat || !memberCoords.lon) {
      alert("Location not detected. Please enable location and try again.");
      return;
    }

    const origin = `${memberCoords.lat},${memberCoords.lon}`;
    const destination = `${library.latitude},${library.longitude}`;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    window.open(mapsUrl, "_blank");
  };

const handleApplyMembership = async (libraryId) => {
  // Set loading true for this library
  setRequestLoading((prev) => ({ ...prev, [libraryId]: true }));

  try {
    const res = await LibReq({ library_id: libraryId });

    setRequestStatus((prev) => ({
      ...prev,
      [libraryId]: res.data.message || "Membership request sent successfully!",
    }));
  } catch (err) {
    console.error("Error applying for membership:", err);
    const errorMsg = err.response?.data?.message || "Failed to send membership request.";
    setRequestStatus((prev) => ({
      ...prev,
      [libraryId]: errorMsg,
    }));
  } finally {
    // Reset loading after response
    setRequestLoading((prev) => ({ ...prev, [libraryId]: false }));
  }
};
  
const renderSkeleton = () => (
    <Box sx={{ p: 4 }}>
      <Skeleton variant="text" width={220} height={40} sx={{ mb: 2 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
            <Skeleton variant="circular" width={80} height={80} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="80%" height={30} />
            <Skeleton variant="text" width="60%" height={25} />
            <Skeleton variant="rectangular" width="100%" height={150} sx={{ mt: 2, borderRadius: 2 }} />
          </Card>
        </Grid>
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
            <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="text" width={`${80 - i * 10}%`} height={25} sx={{ mb: 1 }} />
            ))}
            <Skeleton variant="rectangular" width="100%" height={120} sx={{ borderRadius: 2 }} />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  if (loading) return renderSkeleton();

  if (!data)
    return (
      <Typography color="error" sx={{ p: 4 }}>
        Failed to load member data.
      </Typography>
    );

  const { user, member, library } = data;

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: "black" }}>
          Welcome {member.name || "Member Dashboard"}
        </Typography>
        <LogoutButton redirectTo="/" />
      </Box>

      {/* Member Info */}
      <MemberInfoCard user={user} member={member} loading={loading} />

      {/* Library Info or Nearby Search */}
      {library ? (
        <LibraryInfoCard library={library} verified={true} extra="member" loading={loading} />
      ) : (
        <Card
          sx={{
            textAlign: "center",
            borderRadius: 3,
            boxShadow: 3,
            py: 5,
            mt: 3,
            backgroundColor: "#fff3e0",
          }}
        >
            <Typography variant="h6" color="textSecondary">
          {/*check whether member apply for any membership or not*/}
          {!data.libMsg?"You are not connected to any library.":data.libMsg}  
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={getNearbyLibraries}
            disabled={data.libMsg||locating}//
          >
            {locating ? "Detecting Location..." : "Find Nearby Libraries"}
          </Button>
        </Card>
      )}

      {/* Drawer for Nearby Libraries */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 350, p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold">
              Nearby Libraries
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {nearbyLibraries.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              No libraries found nearby.
            </Typography>
          ) : (
            <List>
            {nearbyLibraries.map((lib) => (
              <React.Fragment key={lib.lib_id}>
                <ListItem
                  sx={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    mb: 1,
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    p: 2,
                  }}
                >
                  <Box
                    width="100%"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {lib.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {lib.distance.toFixed(2)} km away
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      color="secondary"
                      onClick={() => openInGoogleMaps(lib)}
                    >
                      Route
                    </Button>
                  </Box>
                  <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 1 }}
                      onClick={() => handleApplyMembership(lib.lib_id)}
                      disabled={requestLoading[lib.lib_id] || !!requestStatus[lib.lib_id]} // disable while sending or after sent
                    >
                      {requestLoading[lib.lib_id]
                        ? "Sending..."
                        : requestStatus[lib.lib_id]
                        ? "Request Sent"
                        : "Apply for Membership"}
                    </Button>
                  {requestStatus[lib.lib_id] && (
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        color: requestStatus[lib.lib_id].includes("Failed")
                          ? "error.main"
                          : "success.main",
                        fontWeight: 500,
                      }}
                    >
                      {requestStatus[lib.lib_id]}
                    </Typography>
                  )}
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default MemberDashboard;
