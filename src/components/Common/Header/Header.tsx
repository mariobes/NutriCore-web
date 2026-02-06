import logo from '@/assets/favicon.ico';
import { AppBar, Box, Toolbar, Typography, Button, Switch } from "@mui/material";
import styles from "./Header.module.css";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";

export default function Header() {
  const { logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const handleLogout = async () => {
    logout();
  };

  return (
    <Box>
      <AppBar className={styles['header-container']} position="static">
        <Toolbar className={styles['header-toolbar']}>
          <img src={logo} alt="Logo" className={styles['header-image']} />
          <Typography className={styles['header-title']}>
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