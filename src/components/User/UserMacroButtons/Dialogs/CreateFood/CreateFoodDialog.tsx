import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
//import { createFood } from "@/services/foodService";

export default function CreateFoodModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const handleSubmit = async () => {

  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Crear nuevo alimento</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Cantidad"
          type="number"
        //   value={quantity}
        //   onChange={(e) => setQuantity(Number(e.target.value))}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Crear</Button>
      </DialogActions>
    </Dialog>
  );
}