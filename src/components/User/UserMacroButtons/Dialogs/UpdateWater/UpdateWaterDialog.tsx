import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, TextField, Button } from "@mui/material";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";

export default function UpdateWaterDialog({ open, onClose }: { open: boolean, onClose: () => void }) {
  const { getUserId } = useAuthStore();
  const { user, fetchUserById, updateDailyWater } = useUserStore();
  
  const [water, setWater] = useState(0);

  useEffect(() => {
    if (!open || !user) return;

    const today = new Date();
    today.setHours(0,0,0,0);

    let waterValue = 0;

    if (user.dateDailyWater) {
      const waterDate = new Date(user.dateDailyWater);
      waterDate.setHours(0,0,0,0);

      if (waterDate.getTime() === today.getTime()) {
        waterValue = user.dailyWater ?? 0;
      }
    }

    setWater(waterValue);
  }, [open, user]);

  const handleSubmit = async () => {
    const success = await updateDailyWater(getUserId(), water);
    if (success) {
      await fetchUserById(getUserId());
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Actualizar agua diaria</DialogTitle>
      <DialogContent>
        <Box display="flex" gap={2}>
        <TextField
          label="Daily water (L)"
          type="number"
          fullWidth
          margin="normal"
          value={water}
          onChange={(e) => setWater(parseFloat(e.target.value) || 0)}
        />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Actualizar</Button>
      </DialogActions>
    </Dialog>
  );
}