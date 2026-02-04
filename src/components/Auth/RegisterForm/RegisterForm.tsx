import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import styles from "./RegisterForm.module.css";
import type { Register } from "@/core/auth";

interface RegisterFormProps {
  onSubmit: (data: Register) => Promise<boolean>;
  error: string | null;
}

export const RegisterForm = ({ onSubmit, error }: RegisterFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [country, setCountry] = useState("");

  const handleClick = () => {
    const data: Register = {
      name,
      email,
      password,
      age: Number(age),
      height: Number(height),
      weight: Number(weight),
      country,
    };

    onSubmit(data);
  };

  return (
    <Box mt={3}>
      <TextField fullWidth label="Name" value={name} onChange={e => setName(e.target.value)} margin="normal" />
      <TextField fullWidth label="Email" value={email} onChange={e => setEmail(e.target.value)} margin="normal" />
      <TextField fullWidth label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} margin="normal" />
      <TextField fullWidth label="Age" type="number" value={age} onChange={e => setAge(e.target.value)} margin="normal" />
      <TextField fullWidth label="Height" type="number" value={height} onChange={e => setHeight(e.target.value)} margin="normal" />
      <TextField fullWidth label="Weight" type="number" value={weight} onChange={e => setWeight(e.target.value)} margin="normal" />
      <TextField fullWidth label="Country" value={country} onChange={e => setCountry(e.target.value)} margin="normal" />

      {error && <Typography color="error">{error}</Typography>}

      <Box mt={2}>
        <Button variant="contained" fullWidth onClick={handleClick}>
          Register
        </Button>
      </Box>
    </Box>
  );
};