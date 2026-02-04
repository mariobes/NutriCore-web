import { AppBar, Box, Toolbar, Typography, Button, Switch } from "@mui/material";
import styles from "./Header.module.css";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";

export default function Header() {
  const { logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  
  // useEffect(() => {
  //   console.log("¿AUTENTIFICADO?", auth.isLoggedIn());
  //   console.log("Token Axios:", localStorage.getItem("token"));
  //   console.log("Token Axios:", localStorage.getItem("role"));
  //   console.log("Token Axios:", localStorage.getItem("userId"));
  // }, [auth.token, auth.role, auth.userId]);

  const handleLogout = async () => {
    logout();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar className={styles['header-container']} position="static">
        <Toolbar className={styles['header-toolbar']}>
          <img src="../src/assets/favicon.ico" alt="Logo" className={styles['header-image']} />
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            NutriCore
          </Typography>
          <Button variant="contained" onClick={handleLogout}>
            Logout
          </Button>
          <Switch
            checked={theme === "dark"}
            onChange={toggleTheme}
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
}