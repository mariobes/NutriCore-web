import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, TextField, Button, Select, MenuItem } from "@mui/material";
import type { Food } from "@/core/food";
import { useAuthStore } from "@/stores/authStore";
import { useFoodStore } from "@/stores/foodStore";

export default function CreateFoodDialog({ open, onClose }: { open: boolean, onClose: () => void }) {
  const { getUserId } = useAuthStore();
  const { createFood } = useFoodStore();
  
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [unitOfMeasurement, setUnitOfMeasurement] = useState(0);
  const [measurementQuantity, setMeasurementQuantity] = useState("");
  const [kilocalories, setKilocalories] = useState("");
  const [fats, setFats] = useState("");
  const [carbohydrates, setCarbohydrates] = useState("");
  const [proteins, setProteins] = useState("");
  const [fiber, setFiber] = useState("");
  const [sugar, setSugar] = useState("");
  const [salt, setSalt] = useState("");

  const handleSubmit = async () => {
    const data: Food = {
      userId: getUserId(),
      name,
      image,
      unitOfMeasurement: Number(unitOfMeasurement),
      measurementQuantity: Number(measurementQuantity),
      kilocalories: Number(kilocalories),
      fats: Number(fats),
      carbohydrates: Number(carbohydrates),
      proteins: Number(proteins),
      fiber: Number(fiber),
      sugar: Number(sugar),
      salt: Number(salt),
    };

    const success = await createFood(getUserId(), data);
    
    if (success) handleClose();
  };

  const handleClose = () => {
    setName("");
    setImage("");
    setUnitOfMeasurement(0);
    setMeasurementQuantity("");
    setKilocalories("");
    setFats("");
    setCarbohydrates("");
    setProteins("");
    setFiber("");
    setSugar("");
    setSalt("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Crear nuevo alimento</DialogTitle>
      <DialogContent>
        <Box display="flex" gap={2}>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Image"
          margin="normal"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        </Box>

        <Box display="flex" gap={2}>
          <TextField
            label="Kilocalories"
            type="number"
            fullWidth
            margin="normal"
            value={kilocalories}
            onChange={(e) => setKilocalories(e.target.value)}
          />
          <TextField
            label="Measurement quantity"
            type="number"
            fullWidth
            margin="normal"
            value={measurementQuantity}
            onChange={(e) => setMeasurementQuantity(e.target.value)}
          />
          <Select 
            label="Unit of measurement" 
            value={unitOfMeasurement} onChange={(e) => setUnitOfMeasurement(e.target.value)} 
            sx={{ maxHeight: '50px', mt: 2.4 }}
          >
            <MenuItem value="0">Gramos</MenuItem>
            <MenuItem value="1">Mililitros</MenuItem>
            <MenuItem value="2">Litros</MenuItem>
            <MenuItem value="3">Unidades</MenuItem>
          </Select>
        </Box>

        <Box display="flex" gap={2}>
          <TextField
            label="Proteins"
            type="number"
            fullWidth
            margin="normal"
            value={proteins}
            onChange={(e) => setProteins(e.target.value)}
          />
          <TextField
            label="Carbohydrates"
            type="number"
            fullWidth
            margin="normal"
            value={carbohydrates}
            onChange={(e) => setCarbohydrates(e.target.value)}
          />
          <TextField
            label="Fats"
            type="number"
            fullWidth
            margin="normal"
            value={fats}
            onChange={(e) => setFats(e.target.value)}
          />
        </Box>
        
        <Box display="flex" gap={2}>
          <TextField
            label="Fiber"
            type="number"
            fullWidth
            margin="normal"
            value={fiber}
            onChange={(e) => setFiber(e.target.value)}
          />
          <TextField
            label="Sugar"
            type="number"
            fullWidth
            margin="normal"
            value={sugar}
            onChange={(e) => setSugar(e.target.value)}
          />
          <TextField
            label="Salt"
            type="number"
            fullWidth
            margin="normal"
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Crear</Button>
      </DialogActions>
    </Dialog>
  );
}