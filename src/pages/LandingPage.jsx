import { Container, Typography, Button, Box, Grid, Menu, MenuItem, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../../public/image.jpg"; // replace with your logo path
import { useState } from "react";

const LandingPageModern = () => {
  const navigate = useNavigate();

  const [anchorElStart, setAnchorElStart] = useState(null);
  const openStart = Boolean(anchorElStart);
  const handleStartClick = (event) => setAnchorElStart(event.currentTarget);
  const handleStartClose = (path) => {
    setAnchorElStart(null);
    if (path) navigate(path);
  };

  const [anchorElLogin, setAnchorElLogin] = useState(null);
  const openLogin = Boolean(anchorElLogin);
  const handleLoginClick = (event) => setAnchorElLogin(event.currentTarget);
  const handleLoginClose = (path) => {
    setAnchorElLogin(null);
    if (path) navigate(path);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, rgba(25,118,210,0.9), rgba(25,118,210,0.5))",
        color: "#fff",
        overflowX: "hidden",
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 4, sm: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg" sx={{ width: "100%", overflowX: "hidden" }}>
        <Grid
          container
          spacing={4}
          alignItems="center"
          direction={{ xs: "column", md: "row" }}
        >
          {/* Logo Section */}
          <Grid item xs={12} md={5} sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Box
              component="img"
              src={logo}
              alt="BookFlow Logo"
              sx={{
                width: { xs: "60%", sm: "50%", md: "100%" },
                maxWidth: 280,
                height: "auto",
                borderRadius: "16px",
                boxShadow: 5,
                mx: { xs: "auto", md: 0 },
              }}
            />
          </Grid>

          {/* Hero Content */}
          <Grid item xs={12} md={7}>
            <Paper
              elevation={6}
              sx={{
                backgroundColor: "rgba(0,0,0,0.5)",
                p: { xs: 3, sm: 4, md: 6 },
                borderRadius: 3,
                textAlign: { xs: "center", md: "left" },
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  mb: { xs: 2, sm: 3, md: 4 },
                  fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
                  lineHeight: 1.2,
                }}
              >
                Welcome to BookFlow
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mb: { xs: 3, sm: 4, md: 5 },
                  fontSize: { xs: "1rem", sm: "1.15rem", md: "1.3rem" },
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                Manage library books, track users, and simplify book lending in one modern platform.
              </Typography>

              <Grid container spacing={2} justifyContent={{ xs: "center", md: "flex-start" }}>
                <Grid item xs={12} sm="auto">
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    fullWidth
                    onClick={handleStartClick}
                    sx={{ borderRadius: 3 }}
                  >
                    Get Started
                  </Button>
                  <Menu anchorEl={anchorElStart} open={openStart} onClose={() => handleStartClose()}>
                    <MenuItem onClick={() => handleStartClose("/library-signup")}>Library</MenuItem>
                    <MenuItem onClick={() => handleStartClose("/member")}>Member</MenuItem>
                  </Menu>
                </Grid>

                <Grid item xs={12} sm="auto">
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="large"
                    fullWidth
                    onClick={handleLoginClick}
                    sx={{ borderRadius: 3 }}
                  >
                    Login
                  </Button>
                  <Menu anchorEl={anchorElLogin} open={openLogin} onClose={() => handleLoginClose()}>
                    <MenuItem onClick={() => handleLoginClose("/library-login")}>Library</MenuItem>
                    <MenuItem onClick={() => handleLoginClose("/librarian-login")}>Librarian</MenuItem>
                    <MenuItem onClick={() => handleLoginClose("/member-login")}>Member</MenuItem>
                  </Menu>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box sx={{ mt: { xs: 6, sm: 8, md: 10 }, textAlign: "center" }}>
          <Typography
            variant="body2"
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, color: "rgba(255,255,255,0.8)" }}
          >
            © {new Date().getFullYear()} BookFlow. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPageModern;
