import { useEffect, useMemo, useState } from "react";
import { Container, Box, Button, CircularProgress, Typography } from "@mui/material";
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
  
  const isLoading = !user || !intakes;

  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const changeDay = (amount: number) => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + amount);
      return newDate;
    });
  };

  useEffect(() => {
    fetchUserById(getUserId());
    fetchUserIntakes(getUserId());
  }, []);

  const todayIntakes = useMemo<Intake[]>(() => {
    return (intakes || []).filter((item: Intake) => {
      if (!item.date) return false;

      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);

      return itemDate.getTime() === selectedDate.getTime();
    });
  }, [intakes, selectedDate]);

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

  const waterUser = useMemo(() => {
    if (!user?.dateDailyWater) return 0;

    const waterDate = new Date(user.dateDailyWater);
    waterDate.setHours(0, 0, 0, 0);

    return waterDate.getTime() === selectedDate.getTime()
      ? user.dailyWater ?? 0
      : 0;
  }, [user, selectedDate]);

  const macroCharts = [
    { type: "protein", current: totalMacros.protein, target: user?.dailyProteinTarget },
    { type: "carbohydrate", current: totalMacros.carbohydrate, target: user?.dailyCarbohydrateTarget },
    { type: "fat", current: totalMacros.fat, target: user?.dailyFatTarget },
    { type: "kiloCalorie", current: totalMacros.kiloCalorie, target: user?.dailyKilocalorieTarget },
    { type: "water", current: waterUser, target: user?.dailyWaterTarget }
  ] as const;

  return (
    <Container maxWidth={false} className={styles.container}>
      <Header />

      <Box display="flex" flexDirection="column" alignItems="center" my={5}>
        <Box display="flex" alignItems="center" justifyContent="center" gap={3} mb={3}>
          <Button variant="contained" size="small" sx={{ fontSize: '2rem', maxHeight: 30 }} onClick={() => changeDay(-1)}>-</Button>
          <Box fontSize={20} fontWeight={600}>
            {selectedDate.toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric"
            })}
          </Box>
          <Button variant="contained" size="small" sx={{ fontSize: '2rem', maxHeight: 30 }} onClick={() => changeDay(1)}>+</Button>
        </Box>

        {isLoading ? (
          <Box className={styles['container-loading']}>
            <CircularProgress size={60} />
            <Typography fontSize={20}>Cargando macronutrientes...</Typography>
          </Box>
        ) : null}

        {!isLoading ? (
          <Box className={styles['container-charts']} sx={{ pt: 3, borderTopLeftRadius: 25, borderTopRightRadius: 25 }}>
            {
              macroCharts
                .filter(({ type }) => ["protein", "carbohydrate", "fat"].includes(type))
                .map(({ type, current, target }) => (
                  <UserMacroChart key={type} type={type} current={current!} target={target!} />
                ))
            }
          </Box>
        ) : null}

        {!isLoading ? (
          <Box className={styles['container-charts']} sx={{ pb: 3, borderBottomLeftRadius: 25, borderBottomRightRadius: 25 }}>
            {
              macroCharts
                .filter(({ type }) => ["kiloCalorie", "water"].includes(type))
                .map(({ type, current, target }) => (
                  <UserMacroChart key={type} type={type} current={current!} target={target!} />
                ))
            }
          </Box>
        ) : null}

        <UserMacroButtons disabled={isLoading} />
      </Box>
    </Container>
  );
}