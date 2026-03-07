import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, useMediaQuery } from "@mui/material";
import styles from "./CreateFoodDialog.module.css";
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

  const isMobile = useMediaQuery("(max-width:620px)");

  const handleSubmit = async () => {
    const validImage = image && isValidUrl(image) ? image : undefined;

    const data: Food = {
      userId: getUserId(),
      name,
      image: validImage,
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

    const isValidUrl = (value: string) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
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
    <Dialog open={open} onClose={handleClose} slotProps={{ paper: { sx: { width: "550px", borderRadius: "24px", m: 1 }}}}>
      <DialogTitle className={styles['form-title']}>
        Crear nuevo alimento
      </DialogTitle>
      <DialogContent>
        <Box display="flex" gap={2}>
        <TextField
          label="Nombre"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Imagen"
          margin="normal"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        </Box>

        <Box display="flex" gap={2}>
          <TextField
            label={isMobile ? "Kcal" : "Kilocalorías"}
            type="number"
            margin="normal"
            value={kilocalories}
            onChange={(e) => setKilocalories(e.target.value)}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
          <TextField
            label={isMobile ? "Cantidad" : "Cantidad de medida"}
            type="number"
            margin="normal"
            value={measurementQuantity}
            onChange={(e) => setMeasurementQuantity(e.target.value)}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
          <FormControl 
            margin="normal" 
            sx={{ minWidth: 125 }}
          >
            <InputLabel id="unit-label">
              Unidad de medida
            </InputLabel>
            
            <Select
              labelId="unit-label"
              value={unitOfMeasurement}
              label="Unidad de medida"
              onChange={(e) => setUnitOfMeasurement(Number(e.target.value))}
            >
              <MenuItem value={0}>Gramos</MenuItem>
              <MenuItem value={1}>Mililitros</MenuItem>
              <MenuItem value={2}>Litros</MenuItem>
              <MenuItem value={3}>Unidades</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box display="flex" gap={2}>
          <TextField
            label="Grasas"
            type="number"
            margin="normal"
            value={fats}
            onChange={(e) => setFats(e.target.value)}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
          <TextField
            label={isMobile ? "Carbos" : "Carbohidratos"}
            type="number"
            margin="normal"
            value={carbohydrates}
            onChange={(e) => setCarbohydrates(e.target.value)}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
          <TextField
            label="Proteínas"
            type="number"
            margin="normal"
            value={proteins}
            onChange={(e) => setProteins(e.target.value)}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
        </Box>
        
        <Box display="flex" gap={2}>
          <TextField
            label="Fibra"
            type="number"
            margin="normal"
            value={fiber}
            onChange={(e) => setFiber(e.target.value)}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
          <TextField
            label="Azúcar"
            type="number"
            margin="normal"
            value={sugar}
            onChange={(e) => setSugar(e.target.value)}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
          <TextField
            label="Sal"
            type="number"
            margin="normal"
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
        </Box>
      </DialogContent>
      <DialogActions className={styles['dialog-buttons']}>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
            disabled={!name || !measurementQuantity ||
              !kilocalories || !fats || !carbohydrates || 
              !proteins || !fiber || !sugar || !salt
            }
        >
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
}