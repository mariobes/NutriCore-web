import { Box, Typography, CircularProgress } from "@mui/material";
import styles from "./UserMacroChart.module.css";

type Tab = "kiloCalorie" | "fat" | "carbohydrate" | "protein" | "water";

const colors: Record<Tab, string> = {
  kiloCalorie: "#ff5722",
  fat: "#4caf50",
  carbohydrate: "#fbc02d",
  protein: "#923ae4",
  water: "#00bcd4",
};

const labels: Record<Tab, string> = {
  kiloCalorie: "Calorías",
  fat: "Grasas",
  carbohydrate: "Carbohidratos",
  protein: "Proteínas",
  water: "Agua",
};

export default function UserMacroChart({ type, current, target }: { type: Tab, current: number, target: number }) {
  const progress = Math.min((current / target) * 100, 100);

  return (
    <Box width={250} height={250} display="flex" alignItems="center" justifyContent="center" sx={{ mx: 5 }}>
      
      <CircularProgress
        variant="determinate"
        value={-100}
        size={250}
        thickness={3}
        sx={{ color: "#e0e0e0", position: "absolute" }}
      />

      <CircularProgress
        variant="determinate"
        value={-progress}
        size={250}
        thickness={3}
        sx={{ color: colors[type] }}
      />

      <Box position="absolute" textAlign="center">
        <Typography className={styles['chart-text']}>
          {labels[type]}
        </Typography>
        <Typography className={styles['chart-value']}>
          0
        </Typography>
        <Typography className={styles['chart-target']}>
          {target - current} restantes
        </Typography>
      </Box>
    </Box>
  );
}