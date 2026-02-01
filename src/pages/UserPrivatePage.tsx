import { useEffect } from "react";
import { Button, Container, Box } from "@mui/material";
import { useAuthStore } from "@/stores/authStore";

export default function UserPrivatePage() {
  const auth = useAuthStore();

    useEffect(() => {
    console.log("¿AUTENTIFICADO?", auth.isLoggedIn());
    console.log("Token Axios:", localStorage.getItem("token"));
    console.log("Token Axios:", localStorage.getItem("role"));
    console.log("Token Axios:", localStorage.getItem("userId"));
  }, [auth.token, auth.role, auth.userId]);
  
  const handleLogout = async () => {
    auth.logout();
  };

  return (
    <Container maxWidth="sm">
      <Box mt={2}>
          <Button variant="contained" fullWidth onClick={handleLogout}>
            Logout
          </Button>
      </Box>
    </Container>
  );
}