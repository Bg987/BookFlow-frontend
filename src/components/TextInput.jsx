import { TextField } from "@mui/material";

const TextInput = ({ label, value, onChange, type = "text", required = true }) => (
  <TextField
    label={label}
    value={value}
    onChange={onChange}
    type={type}
    required={required}
    fullWidth
    margin="normal"
  />
);

export default TextInput;
