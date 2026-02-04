import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import styles from "./LoginForm.module.css";
import type { Login } from "@/core/auth";

interface LoginFormProps {
  onSubmit: (data: Login) => Promise<boolean>;
  error: string | null;
}

export const LoginForm = ({ onSubmit, error }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleClick = () => {
    const data: Login = {
      email,
      password
    };

    onSubmit(data);
  };

  return (
    <Box mt={3}>
      <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" />
      <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" />

      {error && <Typography color="error">{error}</Typography>}

      <Box mt={2}>
        <Button variant="contained" fullWidth onClick={handleClick}>
          Login
        </Button>
      </Box>
    </Box>
  );
};