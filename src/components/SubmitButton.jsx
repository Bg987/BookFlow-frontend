import { Button } from "@mui/material";

const SubmitButton = ({ text }) => (
  <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
    {text}
  </Button>
);

export default SubmitButton;
