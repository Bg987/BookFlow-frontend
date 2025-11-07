import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Skeleton,
  Avatar,
  Grid,
  Divider,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import { getPendingReq, handleRequestAction } from "../api/api"; // import API

const MotionCard = motion(Card);

const PendingRequests = ({ libId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reason, setReason] = useState("");

  // Fetch requests
  const fetchRequests = async () => {
    if (!libId) return;
    setLoading(true);
    try {
      const res = await getPendingReq(libId);
      setRequests(res.data.data || []);
    } catch (err) {
      console.error("Error fetching pending requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [libId]);

  // Handle approve/reject click
  const handleActionClick = (request, action) => {
    if (action === "reject") {
      setSelectedRequest({ ...request, action }); // open dialog for reason
      setOpenDialog(true);
    } else {
      processAction(request, action);
    }
    };
    
    const processAction = async (request, action) => {
    try {
        const payload = { requestId: request.request_id, action };
        if (action === "reject") payload.reason = reason;

        const res = await handleRequestAction(payload);

        // Show success message from backend
        alert(res.data.message);

        // Refresh list after action
        fetchRequests();
        setOpenDialog(false);
        setReason("");
        setSelectedRequest(null);
    } catch (err) {
        // Handle specific backend messages
        const backendMsg = err.response?.data?.message || "Failed to process request";
        alert(backendMsg);

        // If "Reason is must" message, keep dialog open
        if (backendMsg.includes("Reason is must")) {
        setOpenDialog(true);
        }
    }
    };


  if (loading)
    return (
      <Box>
        <Typography variant="h6" mb={2} sx={{ fontWeight: "bold", color: "#333" }}>
          Loading pending requests...
        </Typography>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rounded" height={130} sx={{ mb: 2 }} />
        ))}
      </Box>
    );

  if (!requests.length)
    return (
      <Typography
        variant="h6"
        color="text.secondary"
        align="center"
        sx={{ mt: 5, fontStyle: "italic" }}
      >
        No pending membership requests found 🎉
      </Typography>
    );

  return (
    <Box>
      {/* Header */}
      <Paper
        elevation={4}
        sx={{
          mb: 4,
          p: 2,
          borderRadius: 3,
          background: "linear-gradient(to right, #ffb74d, #ffe082)",
          color: "#333",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          📩 Pending Membership Requests
        </Typography>
        <Typography variant="subtitle1">
          Total Requests: {requests.length}
        </Typography>
      </Paper>

      {/* Cards Grid */}
      <Grid container spacing={2}>
        {requests.map((req) => (
          <Grid item xs={12} sm={6} md={6} key={req.request_id}>
            <MotionCard
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              sx={{
                borderRadius: 3,
                boxShadow: 5,
                p: 2,
                background: "linear-gradient(to right, #f8f9fa, #fff3e0)",
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={1.5}>
                  <Avatar
                    src={req.profilePicUrl}
                    sx={{
                      width: 64,
                      height: 64,
                      border: "2px solid #ffa726",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {req.member_name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontStyle: "italic" }}
                    >
                      @{req.username}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 1.5 }} />

                <Typography variant="body2" color="text.secondary">
                  <strong>Email:</strong> {req.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>City:</strong> {req.member_city}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Date of Birth:</strong>{" "}
                  {req.member_dob ? new Date(req.member_dob).toDateString() : "N/A"}
                </Typography>

                <Box
                  mt={2}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleActionClick(req, "approve")}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleActionClick(req, "reject")}
                  >
                    Reject
                  </Button>
                </Box>

                <Box
                  mt={1}
                  sx={{
                    textAlign: "right",
                    fontSize: "0.85rem",
                    color: "gray",
                  }}
                >
                  Request ID: {req.request_id}
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      {/* Reject Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Reject Membership Request</DialogTitle>
        <DialogContent>
          <Typography mb={1}>Please provide a reason for rejection:</Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter rejection reason..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => processAction(selectedRequest, "reject")}
            disabled={!reason.trim()}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PendingRequests;
