import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Box, Button, Switch } from "@mui/material";
import styles from "./AuthPage.module.css";
import type { Login, Register } from "@/core/auth";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import { LoginForm } from "@/components/Auth/LoginForm/LoginForm";
import { RegisterForm } from "@/components/Auth/RegisterForm/RegisterForm";

type Tab = "login" | "register";

export default function AuthPage() {
  const { login, register, isLoggedIn, getUserId } = useAuthStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("login");

  //////////// Revisar error (EN LOGIN_FORM Y REGISTER_FORM TAMBIÉN)
  const [error, setError] = useState<string | null>(null);

  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    if (isLoggedIn()) navigate(`/userPrivate/${getUserId()}`);
  }, []);

  const handleLogin = async (data: Login) => {
    setError(null);

    //////////// Revisar error
    if (!data.email || !data.password) {
      setError("Rellena todos los campos");
      return false;
    }

    const success = await login(data);

    //////////// Revisar error
    if (!success) {
      setError("Error en login");
      return false;
    }

    navigate(`/userPrivate/${getUserId()}`);
    return true;
  };

  const handleRegister = async (data: Register) => {
    setError(null);

    //////////// Revisar error
    if (!data.name || !data.email || !data.password || !data.age || !data.height || !data.weight || !data.country) {
      setError("Rellena todos los campos");
      return false;
    }

    const success = await register(data);

    //////////// Revisar error
    if (!success) {
      setError("Error en registro");
      return false;
    }

    await login({ email: data.email, password: data.password });
    navigate(`/userPrivate/${getUserId()}`);
    return true;
  };

  //////////// Revisar error
  const clearError = () => setError(null);

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={8}>

        <Switch
          checked={theme === "dark"}
          onChange={toggleTheme}
        />

        <Typography variant="h4">{tab === "login" ? "Login" : "Register"}</Typography>

        <Box mt={4}>
          <Button onClick={() => { setTab("login"); clearError(); }}>Login</Button>
          <Button onClick={() => { setTab("register"); clearError(); }}>Register</Button>
        </Box>

        {tab === "login" ? (
          <LoginForm onSubmit={handleLogin} error={error} />
        ) : (
          <RegisterForm onSubmit={handleRegister} error={error} />
        )}
      </Box>
    </Container>
  );
}