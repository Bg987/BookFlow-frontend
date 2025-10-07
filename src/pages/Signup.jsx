import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import TextInput from "../components/TextInput";
import SubmitButton from "../components/SubmitButton";
import { signupUser } from "../api/api";
import { Container, Typography, Box } from "@mui/material";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signupUser({ username, email, password });
      navigate("/login"); // redirect after signup
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Signup</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextInput label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextInput label="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          <TextInput label="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
          <SubmitButton text="Signup" />
        </Box>
      </Container>
    </>
  );
};

export default Signup;
