import { Box, Typography } from "@mui/material";
import { PieChart } from '@mui/x-charts';

	type Tab = "kiloCalorie" | "fat" | "carbohydrate" | "protein" | "water";

  const colors: Record<Tab, string> = {
    kiloCalorie: "#ff5722",
    fat: "#4caf50",
    carbohydrate: "#2196f3",
    protein: "#fbc02d",
    water: "#00bcd4",
  };

  const labels: Record<Tab, string> = {
    kiloCalorie: "Calorías",
    fat: "Grasas",
    carbohydrate: "Carbos",
    protein: "Proteínas",
    water: "Agua",
  };

export default function UserMacroChart({ type, current, target }: { type: Tab, current: number, target: number }) {

  return (
    <Box position="relative" width={250} height={250}>
      <PieChart
        series={[
          {
            data: [
              { id: 0, value: current, color: colors[type] },
              { id: 1, value: target, color: "#e0e0e0" },
            ],
            innerRadius: 90,
            outerRadius: 100,
            startAngle: 0,
            endAngle: -360
          },
        ]}
        width={250}
        height={250}
        slotProps={{ tooltip: { trigger: "none" } }}
      />

      <Box
        position="absolute"
        top="50%"
        left="50%"
        sx={{ transform: "translate(-50%, -50%)" }}
        textAlign="center"
      >
        <Typography variant="subtitle2" fontWeight="bold">
          {labels[type]}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {current} / {target}
        </Typography>
      </Box>
    </Box>
  );



  // return (
  //   <Box position="relative" display="inline-flex" width={250} height={250}>
  //     {/* Donut */}
  //     <CircularProgress
  //       variant="determinate"
  //       value={current}
  //       size={250}
  //       thickness={10}
  //       sx={{
  //         color: colors[type],
  //         circle: {
  //           strokeLinecap: "round", // opcional, para bordes redondeados
  //         },
  //       }}
  //     />

  //     {/* Fondo gris (opcional, para el donut restante) */}
  //     <CircularProgress
  //       variant="determinate"
  //       value={target}
  //       size={250}
  //       thickness={10}
  //       sx={{
  //         color: "#e0e0e0",
  //         position: "absolute",
  //         left: 0,
  //       }}
  //     />

  //     {/* Texto centrado */}
  //     <Box
  //       position="absolute"
  //       top="50%"
  //       left="50%"
  //       sx={{ transform: "translate(-50%, -50%)" }}
  //       textAlign="center"
  //     >
  //       <Typography variant="subtitle2" fontWeight="bold">
  //         {labels[type]}
  //       </Typography>
  //       <Typography variant="caption" color="text.secondary">
  //         {current} / {target}
  //       </Typography>
  //     </Box>
  //   </Box>
  // );



}