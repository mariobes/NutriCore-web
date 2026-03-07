import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, TextField, Button } from "@mui/material";
import styles from "./UpdateWaterDialog.module.css";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";

export default function UpdateWaterDialog({ open, onClose }: { open: boolean, onClose: () => void }) {
  const { getUserId } = useAuthStore();
  const { user, fetchUserById, updateDailyWater } = useUserStore();
  
  const [water, setWater] = useState("");

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

    setWater(waterValue.toString());
  }, [open, user]);

  const handleSubmit = async () => {
    const success = await updateDailyWater(getUserId(), Number(water));
    if (success) {
      await fetchUserById(getUserId());
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} slotProps={{ paper: { sx: { width: "200px", borderRadius: "24px", px: 1, py: 1 }}}}>
      <DialogTitle className={styles['form-title']}>
        Agua diaria
      </DialogTitle>
      <DialogContent>
        <Box className={styles['form-input']}>
        <TextField
          label="Agua diaria (L)"
          type="number"
          fullWidth
          margin="normal"
          value={water}
          onChange={(e) => setWater(e.target.value)}
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
          sx={{ width: '120px', minWidth: '120px' }}
        />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={Number(water) <= 0}
        >
          Actualizar
        </Button>
      </DialogActions>
    </Dialog>
  );
}