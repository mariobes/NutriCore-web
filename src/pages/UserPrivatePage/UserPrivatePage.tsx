import { useEffect } from "react";
import { Container, Box } from "@mui/material";
import styles from "./UserPrivate.module.css";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import Header from "@/components/Common/Header/Header";
import UserMacroChart from "@/components/User/UserMacroChart/UserMacroChart";

export default function UserPrivatePage() {
  const { getUserId } = useAuthStore();
  const { user, fetchUserById } = useUserStore();

  useEffect(() => {
    fetchUserById(getUserId());
  }, []);

  const macroCharts = [
    { type: "kiloCalorie", current: 1500, target: user?.dailyKilocalorieTarget },
    { type: "fat", current: 40, target: user?.dailyFatTarget },
    { type: "carbohydrate", current: 80, target: user?.dailyCarbohydrateTarget },
    { type: "protein", current: 90, target: user?.dailyProteinTarget },
    { type: "water", current: user?.dailyWater, target: user?.dailyWaterTarget },
  ] as const;

  return (
    <Container maxWidth={false} className={styles.container}>
      <Header />
      <Box mt={2}>
        
        <Box display="flex" gap={3} flexWrap="wrap">
          {macroCharts.map(({ type, current, target }) => (
            <UserMacroChart
              key={type}
              type={type}
              current={current ?? 0}
              target={target ?? 0}
            />
          ))}
        </Box>

        <div>
          <span>Hola {user?.name} con altura {user?.height} y peso {user?.weight}</span>
        </div>
      </Box>
    </Container>
  );
}