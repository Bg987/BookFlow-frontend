import React from "react";
import { TextField, Button, Grid, CircularProgress } from "@mui/material";

const ISBNForm = ({ isbn, setIsbn, copies, setCopies, fetchBook, setManualMode, loading }) => {
  return (
    <>
      <TextField
        label="ISBN"
        value={isbn}
        onChange={(e) => setIsbn(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Copies"
        type="number"
        value={copies}
        onChange={(e) => setCopies(Number(e.target.value))}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Grid container spacing={1}>
        <Grid item>
          <Button variant="contained" onClick={fetchBook} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "Fetch Book"}
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" onClick={() => setManualMode(true)}>
            Enter Manually
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default ISBNForm;
