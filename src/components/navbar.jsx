import { AppBar, Toolbar, Typography } from "@mui/material";

const Navbar = ({ title = "Library System" }) => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {title}
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Navbar;
