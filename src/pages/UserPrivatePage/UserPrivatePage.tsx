import { useEffect, useMemo } from "react";
import { Container, Box } from "@mui/material";
import styles from "./UserPrivate.module.css";
import type { Intake } from "@/core/intake";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { useIntakeStore } from "@/stores/intakeStore";
import Header from "@/components/Common/Header/Header";
import UserMacroChart from "@/components/User/UserMacroChart/UserMacroChart";
import UserMacroButtons from "@/components/User/UserMacroButtons/UserMacroButtons";

export default function UserPrivatePage() {
  const { getUserId } = useAuthStore();
  const { user, fetchUserById } = useUserStore();
  const { intakes, fetchUserIntakes } = useIntakeStore();

  useEffect(() => {
    fetchUserById(getUserId());
    fetchUserIntakes(getUserId());
  }, []);

  const todayIntakes = useMemo<Intake[]>(() => {
    const today = new Date(2026, 1, 11);//();
    today.setHours(0, 0, 0, 0);
    
    return (intakes || []).filter((item: Intake) => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);
      return itemDate.getTime() === today.getTime();
    });
  }, [intakes]);

  const totalMacros = useMemo(() => {
    return todayIntakes.reduce(
      (acc, item) => {
        acc.protein += item.totalProteins || 0;
        acc.carbohydrate += item.totalCarbohydrates || 0;
        acc.fat += item.totalFats || 0;
        acc.kiloCalorie += item.totalKilocalories || 0;
        return acc;
      },
      { protein: 0, carbohydrate: 0, fat: 0, kiloCalorie: 0, water: 0 }
    );
  }, [todayIntakes]);

  const macroCharts = [
    { type: "protein", current: totalMacros.protein, target: user?.dailyProteinTarget },
    { type: "carbohydrate", current: totalMacros.carbohydrate, target: user?.dailyCarbohydrateTarget },
    { type: "fat", current: totalMacros.fat, target: user?.dailyFatTarget },
    { type: "kiloCalorie", current: totalMacros.kiloCalorie, target: user?.dailyKilocalorieTarget },
    { type: "water", current: user?.dailyWater, target: user?.dailyWaterTarget }
  ] as const;

  return (
    <Container maxWidth={false} className={styles.container}>
      <Header />

      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <Box className={styles['container-charts']} sx={{ pt: 3, borderTopLeftRadius: 25, borderTopRightRadius: 25 }} >
          {macroCharts.filter(({ type }) => ["protein", "carbohydrate", "fat"].includes(type)).map(({ type, current, target }) => (
            <UserMacroChart key={type} type={type} current={current!} target={target!} />
          ))}
        </Box>

        <Box className={styles['container-charts']} sx={{ pb: 3, borderBottomLeftRadius: 25, borderBottomRightRadius: 25 }} >
          {macroCharts.filter(({ type }) => ["kiloCalorie", "water"].includes(type)).map(({ type, current, target }) => (
            <UserMacroChart key={type} type={type} current={current!} target={target!} />
          ))}
        </Box>

        <UserMacroButtons />
      </Box>
    </Container>
  );
}