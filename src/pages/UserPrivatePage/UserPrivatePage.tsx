import { useEffect } from "react";
import { Container, Box, Button } from "@mui/material";
import IconAdd from '@mui/icons-material/AddCircleOutline';
import styles from "./UserPrivate.module.css";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import Header from "@/components/Common/Header/Header";
import UserMacroChart from "@/components/User/UserMacroChart/UserMacroChart";
import UserMacroButtons from "@/components/User/UserMacroButtons/UserMacroButtons";

export default function UserPrivatePage() {
  const { getUserId } = useAuthStore();
  const { user, fetchUserById } = useUserStore();

  useEffect(() => {
    fetchUserById(getUserId());
  }, []);

  const macroCharts = [
    { type: "protein", current: 90, target: user?.dailyProteinTarget },
    { type: "carbohydrate", current: 80, target: user?.dailyCarbohydrateTarget },
    { type: "fat", current: 40, target: user?.dailyFatTarget },
    { type: "kiloCalorie", current: 1500, target: user?.dailyKilocalorieTarget },
    { type: "water", current: user?.dailyWater, target: user?.dailyWaterTarget }
  ] as const;

  return (
    <Container maxWidth={false} className={styles.container}>
      
      <Header />

      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <Box className={styles['container-charts']} sx={{ pt: 3,  borderTopLeftRadius: 25, borderTopRightRadius: 25 }} >
          {macroCharts
            .filter(({ type }) => ["protein", "carbohydrate", "fat"].includes(type))
            .map(({ type, current, target }) => (
              <UserMacroChart
                key={type}
                type={type}
                current={current!}
                target={target!}
              />
          ))}
        </Box>

        <Box className={styles['container-charts']} sx={{ pb: 3, borderBottomLeftRadius: 25, borderBottomRightRadius: 25 }} >
          {macroCharts
            .filter(({ type }) => ["kiloCalorie", "water"].includes(type))
            .map(({ type, current, target }) => (
              <UserMacroChart
                key={type}
                type={type}
                current={current!}
                target={target!}
              />
          ))}
        </Box>

        <UserMacroButtons />

      </Box>
    </Container>
  );
}