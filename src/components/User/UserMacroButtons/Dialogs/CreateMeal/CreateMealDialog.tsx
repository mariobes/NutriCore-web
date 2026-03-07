import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, TextField, Button, Divider, List, ListItem, ListItemText, ListItemAvatar, Avatar } from "@mui/material";
import styles from "./CreateMealDialog.module.css";
import type { Food } from "@/core/food";
import type { Meal, MealIngredient } from "@/core/meal";
import { useAuthStore } from "@/stores/authStore";
import { useFoodStore } from "@/stores/foodStore";
import { useMealStore } from "@/stores/mealStore";

export default function CreateMealDialog({ open, onClose }: { open: boolean, onClose: () => void }) {
  const { getUserId } = useAuthStore();
  const { foods, fetchUserFoods, searchFood } = useFoodStore();
  const { createMeal } = useMealStore();
  
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [selectedFoods, setSelectedFoods] = useState<{ food: Food; quantity: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadFoods = async () => {
      await fetchUserFoods(getUserId());
      const userFoods = useFoodStore.getState().foods ?? [];

      await fetchUserFoods(1);
      const defaultFoods = useFoodStore.getState().foods ?? [];

      const combined = [...userFoods, ...defaultFoods];

      useFoodStore.getState().setFoods(combined);
    };

    if (open) loadFoods();
  }, [open]);

  const handleSearchChange = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      await fetchUserFoods(getUserId());
      const defaultFoods = useFoodStore.getState().foods ?? [];
      await fetchUserFoods(1);
      const userFoods = useFoodStore.getState().foods ?? [];
      useFoodStore.getState().setFoods([...defaultFoods, ...userFoods]);
    } else {
      await searchFood(getUserId(), query);
    }
  };

  const getDefaultQuantity = (unit: string) => {
    switch (unit) {
      case "g":
      case "ml":
        return 10;
      case "l":
      case "ud":
        return 1;
      default:
        return 1;
    }
  };

  const toggleFoodSelection = (food: Food) => {
    setSelectedFoods((prev) => {
      const exists = prev.find((f) => f.food.id === food.id);
      if (exists) {
        return prev.filter((f) => f.food.id !== food.id);
      } else {
        return [...prev, { food, quantity: getDefaultQuantity(food.unitOfMeasurement.toString()).toString() }];
      }
    });
  };

  const handleQuantityChange = (foodId: number, value: string) => {
    setSelectedFoods((prev) =>
      prev.map((f) =>
        f.food.id === foodId ? { ...f, quantity: value } : f
      )
    );
  };

  const handleSubmit = async () => {
    const validImage = image && isValidUrl(image) ? image : undefined;

    const mealIngredients: MealIngredient[] = selectedFoods.map((f) => ({
      foodId: f.food.id ?? 0,
      quantity: f.quantity || "0",
    }));

    const data: Meal = {
      userId: getUserId(),
      name,
      image: validImage,
      ingredients: mealIngredients,
    };

    const success = await createMeal(getUserId(), data);
    
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
    setSelectedFoods([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}  maxWidth="md" slotProps={{ paper: { sx: { borderRadius: "24px", m: 1 }}}}>
      <DialogContent className={styles['container-dialog']}>
        <Box className={styles['dialog-search']}>
          <Box
            className={styles['no-scrollbar']}
            sx={{
              width: "50%",
              maxHeight: 500,
              overflowY: "auto",
              border: "1px solid #757575",
              borderRadius: 1,
              p: 1
            }}
          >
            <TextField
              label="Buscar"
              fullWidth
              size="small"
              margin="dense"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            <List>
              {foods?.map((food) => {
                const isSelected = selectedFoods.some(
                  (f) => f.food.id === food.id
                );
                return (
                  <Box
                    className={styles['dialog-box']}
                    key={food.id}
                    onClick={() => toggleFoodSelection(food)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      alignItems: "center",
                      cursor: "pointer",
                      bgcolor: isSelected ? "#b1abab" : "inherit",
                      transition: "background-color 0.2s, color 0.2s",
                      "&:hover": {
                        bgcolor: isSelected ? "#888484" : "#b1abab",
                      }
                    }}
                  >
                    <ListItemAvatar >
                      <Avatar
                        src={food.image || "/images/default-food-meal.png"}
                        alt={food.name}
                        className={styles['dialog-image']}
                      />
                    </ListItemAvatar>
                    <ListItem className={styles['dialog-text']}>
                      <ListItemText
                        primary={food.name}
                      />
                      <ListItemText
                        secondary={`${food.kilocalories} Kcal | ${food.proteins} P | ${food.carbohydrates} C | ${food.fats} G`}
                      />
                    </ListItem>
                    <Divider />
                  </Box>
                );
              })}
            </List>
          </Box>

          <Box flex={1} className={styles['no-scrollbar']} sx={{ maxHeight: 450, overflowY: "auto" }}>
            <DialogTitle className={styles['form-title']}>
              Crear nueva comida
            </DialogTitle>
            <Box className={styles['form-header']}>
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

            {selectedFoods.length === 0 ? (
              <Box sx={{ mt: 5, textAlign: "center", color: "text.secondary", fontStyle: "italic" }}>
                Selecciona al menos un alimento
              </Box>
            ) : (
              selectedFoods.map(({ food, quantity }) => (
                <Box
                  className={styles['form-content']}
                  key={food.id}
                >
                  <ListItemAvatar >
                    <Avatar
                      src={food.image || "/images/default-food-meal.png"}
                      alt={food.name}
                      className={styles['form-food-image']}
                    />
                  </ListItemAvatar>
                  <Box className={styles['form-food-name']}>
                    {food.name}
                  </Box>
                  <TextField
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(food.id ?? 0, e.target.value)}
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    sx={{ width: '55px', minWidth: '55px' }}
                  />
                  <Box sx={{ minWidth: '30px' }}><b>{food.unitOfMeasurement}</b></Box>
                </Box>
              ))
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions className={styles['dialog-buttons']}>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={
            !name || 
            selectedFoods.length === 0 || 
            selectedFoods.some(f => f.quantity === "0" || f.quantity === "")}
        >
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
}