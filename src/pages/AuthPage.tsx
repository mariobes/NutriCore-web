import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useAuthStore } from "@/stores/authStore";

type Tab = "login" | "register";

export default function AuthPage() {
  const auth = useAuthStore();
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [country, setCountry] = useState("");

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  console.log("¿AUTENTIFICADO?", auth.isLoggedIn());
  console.log("Token Axios:", localStorage.getItem("token"));
  console.log("Token Axios:", localStorage.getItem("role"));
  console.log("Token Axios:", localStorage.getItem("userId"));
  }, [auth.token, auth.role, auth.userId]);

  useEffect(() => {
    if (auth.isLoggedIn()) navigate(`/userPrivate/${auth.getUserId()}`);
  }, []);

  const clearForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setAge("");
    setHeight("");
    setWeight("");
    setCountry("");
    setError(null);
  };

  const handleAuth = async () => {
    setError(null);

    let success = false;

    if (tab === "login") {
      if (!email || !password) {
        setError("Rellena todos los campos");
        return;
      }

      success = await auth.login({
        email, 
        password 
      });

      if (!success) setError("Error en login");

      if (success) navigate(`/userPrivate/${auth.getUserId()}`);
    } else {
      if (!name || !email || !password || !age || !height || !weight || !country) {
        setError("Rellena todos los campos");
        return;
      }

      success = await auth.register({
        name,
        email,
        password,
        age: Number(age),
        height: Number(height),
        weight: Number(weight),
        country,
      });

      if (!success) {
        setError("Error en registro");
        return;
      }

      success = await auth.login({
        email, 
        password 
      });
    }

    if (success) navigate(`/userPrivate/${auth.getUserId()}`);
  };

  const handleLogout = async () => {
    auth.logout();
  };

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={8}>
        <Typography variant="h4">{tab === "login" ? "Login" : "Register"}</Typography>

        <Box mt={4}>
          <Button onClick={() => { setTab("login"); clearForm(); }}>Login</Button>
          <Button onClick={() => { setTab("register"); clearForm(); }}>Register</Button>
        </Box>

        {tab === "login" ? (
          <Box mt={3}>
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
            />
          </Box>
        ) : (
          <Box mt={3}>
            <TextField fullWidth label="Name" value={name} onChange={e => setName(e.target.value)} margin="normal" />
            <TextField fullWidth label="Email" value={email} onChange={e => setEmail(e.target.value)} margin="normal" />
            <TextField fullWidth label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} margin="normal" />
            <TextField fullWidth label="Age" type="number" value={age} onChange={e => setAge(e.target.value)} margin="normal" />
            <TextField fullWidth label="Height" type="number" value={height} onChange={e => setHeight(e.target.value)} margin="normal" />
            <TextField fullWidth label="Weight" type="number" value={weight} onChange={e => setWeight(e.target.value)} margin="normal" />
            <TextField fullWidth label="Country" value={country} onChange={e => setCountry(e.target.value)} margin="normal" />
          </Box>
        )}

        {error && <Typography color="error">{error}</Typography>}

        <Box mt={2}>
          <Button variant="contained" fullWidth onClick={handleAuth}>
            {tab === "login" ? "Login" : "Register"}
          </Button>
          <Button variant="contained" fullWidth onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>
    </Container>
  );
}